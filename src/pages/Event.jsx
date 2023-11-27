import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import useLocationManager from '../hooks/useLocationManager'
import { useNavigate } from 'react-router-dom'
import ReactDatePicker from 'react-datepicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import useEventManager from '../hooks/useEventManager'

function Event() {
    const { authTokens } = useContext(AuthContext)
    const { events, loading, error, getAllEvents } = useEventManager(authTokens) 

    const displayEvents = events && events.map(event => {
        return (
            <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.start_date}</td>
                <td>{event.end_date}</td>
                <td><button>View</button></td>
                <td><button>Delete</button></td>
            </tr>
        )
    })

    useEffect(() => {
        getAllEvents()
    }, [])

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if(error) {
        return (
            <div>An error occured: {error}</div>
        )
    }

    console.log(events)

    return (
        <div>
            <h1 className="heading">Events</h1>
            <Link to="/admin/event" className="link">
                <button className="add-events-btn">
                    <FontAwesomeIcon className="btn-icons" icon={faCalendarDay} />
                    Add event
                </button>
            </Link>
            <table>
                <thead>
                    <tr>
                        <th className="font">Name</th>
                        <th className="font">Start date</th>
                        <th className="font">End date</th>
                        <th className="font">View</th>
                        <th className="font">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {displayEvents}
                </tbody>
            </table>
        </div>
    )
}

export default Event