import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import useEventManager from '../hooks/useEventManager'
import EventModal from '../modals/EventModal';

function Event() {
    const { authTokens } = useContext(AuthContext)
    const { events, loading, error, getAllEvents, deleteEvent } = useEventManager(authTokens) 
    const [ selectedId, setSelectedId ] = useState()
    const [ openDetails, setOpenDetails ] = useState(false)

    const toggleDetails = () => {
        setOpenDetails(prev => !prev)
    }

    const handleViewClick = (id) => {
        setSelectedId(id)
        toggleDetails()
    }

    const displayEvents = events && events.map(event => {
        return (
            <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.start_date}</td>
                <td>{event.end_date}</td>
                <td><button onClick={() => handleViewClick(event.id)}>View</button></td>
                <td><button onClick={() => deleteEvent(event.id)}>Delete</button></td>
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
            {openDetails &&
            <EventModal onClose={toggleDetails} id={selectedId}/>
            }
        </div>
    )
}

export default Event