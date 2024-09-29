from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from datetime import datetime, timedelta
import json
import os
import requests
from bs4 import BeautifulSoup
import urllib.parse

# web scraping
def fetch_webpage_content(url):
    """
    Fetches and returns the textual content of a webpage.
    :param url: URL of the webpage
    :return: Extracted textual content of the webpage
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract the text content from the webpage. Customize this part based on the page structure
        # Here we remove script and style elements to get meaningful content
        for script in soup(["script", "style"]):
            script.decompose()  # Remove script and style tags
        
        text = soup.get_text()
        lines = [line.strip() for line in text.splitlines() if line.strip()]  # Clean up extra spaces and newlines
        content = ' '.join(lines)  # Join the cleaned lines into a single string
        return content[:3000]  # Limit the content size (for example, first 2000 characters to avoid too much data)
    
    except requests.exceptions.RequestException as e:
        return f"Error fetching content from {url}: {e}"

def google_search(query, num_results_per_event=3, num_events=15):
    """
    Perform a Google search, return titles, links, and webpage content for events with two valid sources.
    
    :param query: The search query (string)
    :param num_results_per_event: Number of links to gather per event (default: 2)
    :param num_events: Number of search result entries to return (default: 5)
    :return: List of dictionaries with 'title', 'links', and 'contents' for each event.
    """
    query = urllib.parse.quote_plus(query)
    url = f"https://www.google.com/search?q={query}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return f"Error: Unable to perform search. Status code: {response.status_code}"

    soup = BeautifulSoup(response.text, 'html.parser')
    results = []
    search_results = soup.find_all('div', class_='g')

    # Loop over the search results to extract information
    for i, result in enumerate(search_results[:num_events]):
        title_element = result.find('h3')
        if not title_element:
            continue
        title = title_element.text

        # Get the links from multiple search results for each event
        link_elements = result.find_all('a', href=True)[:num_results_per_event]  # Get the first N links per event
        links = []
        for link_element in link_elements:
            link = link_element['href']
            
            # Check if the link is a relative URL (starts with /) and prepend Google domain
            if link.startswith('/'):
                link = f"https://www.google.com{link}"
            
            links.append(link)

        # Ensure we have at least 2 valid links for this event, skip if not
        if len(links) < 2:
            continue

        # Fetch content from each link, but skip if not updated in last 3 weeks
        contents = []
        for link in links:
            content = fetch_webpage_content(link)
            if content:
                contents.append(content)

        # Only append events if both contents are valid (updated within 3 weeks)
        if len(contents) == 2:
            results.append({
                'title': title,
                'links': links,
                'contents': contents  # List of contents from the two websites
            })

    return results

# Flask app definintion
app = Flask(__name__)

CORS(app)
# CORS(app, origins=[os.environ["FRONTEND_URL"]])

# Gemini AI Configuration
#genai.configure(api_key='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')

# OpenAI API Configuration
client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY'),
    organization=os.getenv('OPENAI_ORG_ID'),
    project=os.getenv('OPENAI_PROJ_ID'),
)


schema_description = (
        "Please respond with a list of events in the following json format:\n"
        "'events': 'a list of all the events gathered' {\n"
        "  'event': 'the object containing event information' {"
        "       'date': 'The date of the event.',\n"
        "       'description': 'Detailed explanation of the event.',\n"
        "       'time': 'The time of the event.',\n"
        "       'web-sources': 'The sources on the web the info was gathered from. Should be more than one.',\n"
        "       'name': 'The name of the event.',\n"
        "       'location': 'The location of the event.',\n"
        "   }"
        "}"
    )

context = (
    "You are a model that finds information on events happening in the city of Pittsburgh in the time period and within the categories requested by the user."
    "When requested the model will use the provided information scraped from the web and find an event that matches the criteria put forward by the user."
    "The model may also search the web at the provided links to ensure the accuracy of provided information"
)

# landing page api route

@app.route('/')
def landingPage():
    return 'Pittsburgh Event Finder'

# events api route
    # start = the start date for the range of time events should be searched
    # end = the end date for the range of time events should be searched
    # type = the category of events that should be searched

@app.route("/events")
def events():
    start = request.args.get("start")
    end = request.args.get("end")
    category = request.args.get("type")
    userMessage = f'Information on {category} events in pittsburgh between the dates {start} and {end}.'
    
    # First, perform the search using google_search
    search_results = google_search(userMessage)

    # Format the search results to pass to GPT for further processing
    formatted_results = "\n\n".join(
        [f"Title: {result['title']}\nLinks: {', '.join(result['links'])}\nContent 1: {result['contents'][0]}\nContent 2: {result['contents'][1]}" for result in search_results if len(result['contents']) >= 2]
    )
    print(formatted_results)

    # Use GPT to process the search results and generate a final response
    gpt_prompt = f"The user asked: '{userMessage}'. Here are some search results:\n{formatted_results}\nBased on these results, provide an appropriate response."

    
    messages = [
        {"role": "system", "content": context},
        {"role": "system", "content": schema_description},
        {"role": "user", "content": gpt_prompt},
    ]
    response = client.chat.completions.create(
        messages=messages,
        model="gpt-4o",
        temperature=0.1,
    )

    resp = response.choices[0].message.content.strip("```json").strip("```")
    print(resp)
    return json.loads(resp)

# events/details api route
    # start = the start date for the event for which the details are being gathered
    # end = the end date for the event for which the details are being gathered
    # event = name and description of event to identify it

@app.route("/events/details")
def details():
    start = request.args.get("start")
    end = request.args.get("end")
    event = request.args.get("event")
    messages = [
        {"role": "system", "content": schema_description},
        {"role": "user", "content": context},
    ]
    response = chat_session.send_message(f'Give me detailed information, including weather and parking concerns, on {event} happening on the date: {start}-{end} as well as a lengthy description of the event')
    print(response.text)
    return {"events": json.loads(response.text)}


if __name__ == "__main__":
    app.run()