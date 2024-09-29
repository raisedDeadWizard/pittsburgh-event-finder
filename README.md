## Inspiration
It seems like everything and nothing is happening all the time. Many of us want to know what is going on - but don't have the time or energy to find out events beyond our usual schedules. The internet is a wealth of knowledge, however it can be very overwhelming and arduous to sort through.

## What it does
Pittsburgh Event Finder finds events in a variety of categories, and on specific days, by creating calls to ChatGPT. Our website returns up to 15 events that fit the user-supplied criteria on each search. Each event is verified by at least 3 sources posted in the last two weeks. Upon clicking an event, our website will provide more details about the selected event.

## How we built it
We created a frontend in React, utilizing HTML and CSS.
We originally tried to create our application utilizing Gemini, and Gemini API, however we realized that Gemini cannot pull from the internet - so we used ChatGPT 4.0 API. The response from the ChatGPT model is then fed into a Flask backend, where  it is processed into a JSON file, and then fed into a React function, which processes the JSON into a HTML presentation. This is then further styled with CSS.

## Challenges we ran into
Gemini required extensive editing of the temperature and editing of the prompt for the responses we wished for out of it. 
Additionally, our challenge of realizing that Gemini could not scrape from the internet made the learning twofold, learning not only Gemini API, but also learning ChatGPT API, and additionally the skill of web scraping on top of it. 
We also had to do work to convert the string output of ChatGPT to JSON, and then use a React function to present the results.
Additionally, we spent time organizing the web presentation.

## Accomplishments that we're proud of
- We utilized ChatGPT API.
- We utilized Gemini API.
- We hosted our website frontend and backend, on Render.com.
- We bought and utilized a customized domain name.

## What we learned
We learned a lot about utilizing Gemini AI - how to format prompts, and how to utilize the API. We also learned that Gemini, while it can pull from stores of websites from around when it was created - it cannot check the current internet. Gemini is very creative.
We learned that both Gemini API and ChatGPT API both need additional web scraping code.
We learned a lot about creating frontend, specifically details about how to format items like the background, chekboxes, and buttons in CSS.

## What's next for Pittsburgh Event Finder
We hope it may help those around Pittsburgh find events for years to come!
