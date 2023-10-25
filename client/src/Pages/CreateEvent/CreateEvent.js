import react, { useState } from 'react';
import "./CreateEvent.css"
import exportColors from '../../Contexts/ColorsContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const CreateEvent = () => {
    const [eventName, setEventName] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventAdditional, setEventAdditional] = useState("");
    const [eventDate, setEventDate] = useState(new Date());

    const changeTextBox = (e) => {
        if(e.target.id === "eventName"){
            setEventName(e.target.value);
        } else if (e.target.id === "eventTime"){
            setEventTime(e.target.value);
        } else if (e.target.id === "eventLocation"){
            setEventLocation(e.target.value);
        } else if (e.target.id === "eventDescription"){
            setEventDescription(e.target.value);
        } else if (e.target.id === "eventAdditional"){
            setEventAdditional(e.target.value);
        }
    }

    const registerEvent = async () => {
        try {
            if (eventName === "" || eventTime === "" || eventLocation === "" || eventDescription === "") return alert("Please fill out all required fields");
            const body = {eventName: eventName, eventTime: eventTime, eventLocation: eventLocation, eventDescription: eventDescription, eventAdditional: eventAdditional, eventDate: eventDate};
            const response = await fetch("/api/events/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
            const data = await response.json()
            if (data.errorMessage) return alert(data.errorMessage);
            alert("Event has been registered");
            window.location.assign("/");
        } catch (err) {
            console.log(err);
            alert("An unknown error has occured");
        }
    }

    return (
        <div className="CreateEvent">
            <h1>Create Event</h1>
            <div className="eventForm">
                <form onSubmit={e => e.preventDefault()}>
                    <label className="requiredLabel">Event Name</label>
                    <input className="eventInput" id="eventName" onChange={changeTextBox} value={eventName}></input><br />
                    <label className="requiredLabel">Event Date</label>
                    <DatePicker className="eventInput" id="eventDate" selected={eventDate} onChange={(date) => setEventDate(date)} />
                    <label className="requiredLabel">Event Time</label><br />
                    <input className="eventInput" type="time" id="eventTime" onChange={changeTextBox} value={eventTime}></input><br />
                    <label className="requiredLabel">Event Location</label>
                    <input className="eventInput" id="eventLocation" onChange={changeTextBox} value={eventLocation}></input><br />
                    <label className="requiredLabel">Event Description</label>
                    <textarea className="eventInput" id="eventDescription" onChange={changeTextBox} value={eventDescription}></textarea><br />
                    <label>Additional Information</label>
                    <textarea className="eventInput" id="eventAdditional" onChange={changeTextBox} value={eventAdditional}></textarea><br />
                    <label id="requiredLabel">* means field is required</label><br />
                    <button className="registerButton HoverPointer" id="eventName" style={{backgroundColor: exportColors.Colors.Green}} onClick={registerEvent}>Create Event</button>
                </form>
            </div>
        </div>
    )
}

export default CreateEvent;