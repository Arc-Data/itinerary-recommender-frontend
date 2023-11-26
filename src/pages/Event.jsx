import { useContext, useState } from 'react'
import { Link, NavLink, useSearchParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import useLocationManager from '../hooks/useLocationManager'
import { useNavigate } from 'react-router-dom'
import ReactDatePicker from 'react-datepicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';

function Event() {
    return (
        <div>
            <h1 className="heading">Events</h1>
            <NavLink to="/admin/event" className="link">
                <button className="add-events-btn">
                    <FontAwesomeIcon className="btn-icons" icon={faCalendarDay} />
                    Add event
                </button>
            </NavLink>
            <table>
                <thead>
                    <tr>
                        <th className="font">Name</th>
                        <th className="font">Start date</th>
                        <th className="font">End date</th>
                        <th className="font">Description</th>
                        <th className="font">Latitude</th>
                        <th className="font">Longitude</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    )
}

export default Event