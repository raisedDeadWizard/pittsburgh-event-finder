## Inspiration
It seems like everything and nothing is happening all the time. Many of us want to know what is going on - but don't have the time or energy to find out events beyond our usual schedules. The internet is a wealth of knowledge, however it can be very overwhelming and arduous to sort through.

## What it does
Pittsburgh Event Finder finds events in a variety of categories, and on specific days, by creating calls to OpenAI. Our website returns up to 15 events that fit the user-supplied criteria on each search. Each event is verified by at least 3 sources updated in the last two weeks.

## How we built it
- React frontend, utilizing JavaScript, HTML and CSS.
- Flask backend written in Python that references OpenAI's SDK.
- Our React frontend, when our user interacts with it, reaches out to our flask backend, which then scrapes the web using BeautifulSoup (a web scraping library for Python) based on the user's provided information. 
- Backend then compiles this web information and filters it for our criteria, before feeding it through a prompt into OpenAI's GPT-4.0 model which then gives us back the parsed information in a custom JSON schema format that our frontend application can read and display for our users.
- Both our frontend and our backend are hosted on Render.com and use CORS protocol and environmental variables to safely communicate between each other.

## Challenges we ran into
- We first started on our project by enlisting Gemini API.
- Gemini required extensive editing of the temperature and prompt for the responses we wished for.
- After developing on Gemini API and testing output we realized that it could not access the internet and would not ever be able to get relevant information for our application.
- We then switched over to OpenAI because the get-4o model is able to search the web.
- After entirely redesigning the project, we then found out that the web searching feature that gpt-4o has, is not available when using OpenAI API.
- Thus, we enlisted BeautifulSoup as a web scraper and fed that information into GPT
- These setbacks were arduous but allowed us to learn not only Gemini API, but also  OpenAI API, and additionally the skill of web scraping.
- We also had to do work to convert the string output of GPT to a properly formatted JSON schema to dynamically display the received response on the frontend.

## Accomplishments that we're proud of
- We learned, utilized, and scrapped our implementation of Gemini API.
- We learned and utilized OpenAI API.
- We learned how to scrape the web with BeautifulSoup.
- We hosted our website, frontend and backend, on Render.com.

## What we learned
- How to utilize Gemini AI - how to format prompts, and how to utilize the API via hosting. 
- Gemini, while it can pull from stores of websites from around when it was created - cannot check the current internet. 
- Gemini is very creative even with temperature reduction.
- Both Gemini API and OpenAI API both need additional web scraping code.
- A lot about creating frontend, specifically details about how to format items like the background, checkboxes, and buttons in CSS.

## What's next for Pittsburgh Event Finder
We hope it may help Pitt students and Pittsburgh residents find events for years to come!
