import React, { useEffect, useState } from 'react'
import { gapi } from 'gapi-script';

const apiKey = import.meta.env.VITE_GOOGLE_CALENDER_API_KEY;
const accessToken = import.meta.env.VITE_APP_GOOGLE_ACCESS_TOKEN;
const calendarID = import.meta.env.VITE_APP_CALENDAR_ID;

function Event({ description }) {
    return (
        <div className="via-navy-500 mt-4 w-1/4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 p-1 shadow-xl">
            <span className="block rounded-xl bg-white sm:p-2" href="">
                <div className="sm:pr-8">
                    <p className="mt-2 text-sm text-black">{description}</p>
                </div>
            </span>
        </div>
    )
}

const GoogleCalenderService = () => {
    const [events, setEvents] = useState([])

    const getEvents = (calendarID, apiKey) => {
        function initiate() {
            gapi.client
                .init({ apiKey: apiKey, })
    
                .then(function () {
                    return gapi.client.request({
                        path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
                    })
                })
    
                .then(
                    (response) => {
                        let events = response.result.items
                        return events
                    },
                    function (err) {
                        return [false, err]
                    }
                )
        }
    
        gapi.load('client', initiate)
    };
    
    useEffect(() => {
        const events = getEvents(calendarID, apiKey)
        setEvents(events)

        console.log("Events: ", events);
    }, [])

    return (
        <div className="App flex flex-col justify-center py-8">
            <h1 className="mb-4 text-2xl font-bold">
                React App with Google Calendar API!
                <ul>
                    {events?.map((event) => (
                        <li key={event.id} className="flex justify-center">
                            <Event description={event.summary} />
                        </li>
                    ))}
                </ul>
            </h1>
        </div>
    )
}

export default GoogleCalenderService;