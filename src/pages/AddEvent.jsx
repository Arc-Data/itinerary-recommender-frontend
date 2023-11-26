import { useContext, useState } from 'react'
import image from '/image.png'
import AuthContext from '../context/AuthContext'
import useLocationManager from '../hooks/useLocationManager'
import { useNavigate } from 'react-router-dom'
import ReactDatePicker from 'react-datepicker'

function AddEvent() {
    return (
        <div>
            <h1 className="heading">Add event</h1>
            <form action="" className="admin--container">
                <div className="input--form">
                    <div className="input admin--container">
                        <label htmlFor="name">Event name</label>
                        <input
                            type="text"
                            name="eventName"
                            className="styled-input" 
                        />
                    </div>
                    <div className="admin--container">
                        <div className="input admin--container">
                            <label htmlFor="startDate">Start date</label>
                            <input
                                type="date"
                                name="startDate"
                                className="styled-input" 
                            />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="endDate">End date</label>
                            <input
                                type="date"
                                name="endDate"
                                className="styled-input" 
                            />
                        </div>
                    </div>
                    <div className="input admin--container">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            name="description"
                            className="styled-input" 
                        />
                    </div>
                    <div className="admin--container">
                        <div className="input admin--container">
                            <label htmlFor="latitude">Latitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                name="latitude"
                                className="styled-input" 
                            />
                        </div>
                        <div className="input admin--container">
                            <label htmlFor="longitude">Longitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                name="longitude"
                                className="styled-input" 
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn done"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddEvent;