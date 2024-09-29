from flask import Flask
from flask import request
from flask_cors import CORS
import json
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
import os

# Flask app definintion
app = Flask(__name__)

CORS(app)
# CORS(app, origins=[os.environ["FRONTEND_URL"]])

# Gemini AI Configuration
genai.configure(api_key=os.environ["API_KEY"])

# Create the model
events_config = {
  "temperature": 0.05,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 5000,
  "response_schema": content.Schema(
    type = content.Type.OBJECT,
    properties = {
      "events": content.Schema(
        type = content.Type.ARRAY,
        items = content.Schema(
          type = content.Type.OBJECT,
          properties = {
              "date": content.Schema(
                  type = content.Type.STRING
              ),
              "location": content.Schema(
                  type = content.Type.STRING
              ),
              "time": content.Schema(
                  type = content.Type.STRING
              ),
              "name": content.Schema(
                  type = content.Type.STRING
              ),
              "description": content.Schema(
                  type = content.Type.STRING
              ),
              "web-source": content.Schema(
                  type = content.Type.STRING
              )
          }
        ),
      ),
    },
  ),
  "response_mime_type": "application/json",
}

# Create the model
details_config = {
  "temperature": 0.05,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 5000,
  "response_schema": content.Schema(
    type = content.Type.OBJECT,
    properties = {
        "date": content.Schema(
            type = content.Type.STRING
        ),
        "location": content.Schema(
            type = content.Type.STRING
        ),
        "time": content.Schema(
            type = content.Type.STRING
        ),
        "name": content.Schema(
            type = content.Type.STRING
        ),
        "description": content.Schema(
            type = content.Type.STRING
        ),
        "event-web-source": content.Schema(
            type = content.Type.STRING
        ),
        "parking": content.Schema(
            type = content.Type.STRING
        ),
        "parking-web-source": content.Schema(
            type = content.Type.STRING
        ),
        "weather": content.Schema(
            type = content.Type.STRING
        ),
        "weather-web-source": content.Schema(
            type = content.Type.STRING
        ),
    }
  ),
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=events_config,
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings

  system_instruction="This model finds information on events happening in the city of Pittsburgh in the time period requested by the user.\n\nWhen requested the model will search the web and find an event on one website source. It must then find another event on a strictly different website (different domain) until it has compiled up to 10 events that are happening within the specified time period before returning to the user making sure to cite the source of the information at the end of each event. It must not, under any circumstances, fabricate information or theorize about events, if it does not find the information when searching it cannot include it.",

)

details_model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=details_config,
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
  system_instruction="This model finds information on a specific event happening in the city of pittsburgh and gives detailed information by searching the web regarding the event, search the web for information regarding the weather around the event, and search the web for information regarding the parking available around the event.",
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
    chat_session = model.start_chat()
    response = chat_session.send_message(f'Give me information on {category} events in pittsburgh between the dates {start} and {end}')
    print(response.text)
    return {"events": json.loads(response.text)}

# events/details api route
    # start = the start date for the event for which the details are being gathered
    # end = the end date for the event for which the details are being gathered
    # event = name and description of event to identify it

@app.route("/events/details")
def details():
    start = request.args.get("start")
    end = request.args.get("end")
    event = request.args.get("event")
    chat_session = details_model.start_chat()
    response = chat_session.send_message(f'Give me detailed information, including weather and parking concerns, on {event} happening on the date: {start}-{end} as well as a lengthy description of the event')
    print(response.text)
    return {"events": json.loads(response.text)}


if __name__ == "__main__":
    app.run()