import { useContext, useEffect } from 'react'
import Modal from '../components/Modal'
import useEventManager from '../hooks/useEventManager'
import AuthContext from '../context/AuthContext'
import ShareMap from '../components/ShareMap'
import useMarkerManager from '../hooks/useMarkerManager'

const EventModal = ({onClose, id}) => {
    const { authTokens } = useContext(AuthContext) 
    const { event, loading, error, getEvent } = useEventManager(authTokens)
    const { markers, addMarker } = useMarkerManager()

    useEffect(() => {
        getEvent(id)
    }, [])

    useEffect(() => {
        if(event) {
            addMarker(event.latitude, event.longitude, '#cccccc', event.name)
        }
    }, [event])    

    if (loading) {
        return (
            <div>Loading</div>
        )
    }

    if (error)  {
        return (
            <div>An error occured: {error}</div>
        )
    }

    return (
        <Modal onClose={onClose}>
            <div className='event--modal'>
                <div>
                    <h1>{event.name}</h1>
                    <div>{event.start_date} - {event.end_date}</div>
                    <p>{event.description}</p>
                </div>
                <ShareMap markers={markers} center={true} />
            </div>
        </Modal>
    )
}

export default EventModal