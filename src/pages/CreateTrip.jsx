import { useContext, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';

const CreateTrip = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL

    const { user, authTokens } = useContext(AuthContext)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        startDate: '',
        budget: '',
        endDate: '',
        numberOfPeople: 1,
    });

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.endDate < formData.startDate) {
            alert('End date must not be less than start date');
            return;
        }

        const data = {
            start_date: formData.startDate.toLocaleDateString('en-US', {'timezone': 'Asia/Manila'}), 
            budget: parseFloat(formData.budget),
            end_date: formData.endDate.toLocaleDateString('en-US', {'timezone': 'Asia/Manila'}), 
            number_of_people: parseInt(formData.numberOfPeople),
            user: user.user_id, 
        };

        try {
            const access = String(authTokens.access)
            const response = await fetch(`${backendUrl}/api/itinerary/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
              },
              body: JSON.stringify(data),
            });
        
            if (!response.ok) {
              throw new Error('Error creating itinerary');
            }
        
            const responseData = await response.json();
        
            navigate(`/plan/${responseData.id}`)
        } catch (error) {
            console.error('Error creating itinerary:', error);
        }

    };

    return (
        <div className="create--main-content">
            <div className="create--form-container">
                <form className='create--form' onSubmit={handleSubmit}>
                    <div className='create--form-title heading'>Trip Details</div>
                    <div className='create--form-content'>
                        <div className='form-row'>
                            <label htmlFor="startDate" className="create--form-label">Start Date</label>
                            <DatePicker
                                selected={formData.startDate}
                                onChange={(date) => handleChange('startDate', date)}
                                className='create--form-input no-margin-top no-margin-bottom'
                                dateFormat="yyyy-MM-dd"
                                isClearable
                                placeholderText="Select a date"
                                name="startDate"
                                id="startDate"
                                autoComplete="off"
                            />
                        </div>
                        <div className='form-row'>
                            <label htmlFor="endDate" className='create--form-label'>End Date</label>
                            <DatePicker
                                selected={formData.endDate}
                                onChange={(date) => handleChange('endDate', date)}
                                className='create--form-input no-margin-top no-margin-bottom datepicker'
                                dateFormat="yyyy-MM-dd"
                                isClearable
                                placeholderText="Select a date"
                                name="endDate"
                                id="endDate"
                                autoComplete="off"
                            />
                        </div>
                        <div className='form-row'>
                            <label htmlFor="budget" className='create--form-label'>Budget (per person)</label>
                            <div className='create--currency'>
                                <input
                                    type="number"
                                    name="budget"
                                    className='create--form-input no-margin-top no-margin-bottom budget'
                                    placeholder="100.00"
                                    value={formData.budget}
                                    onChange={(e) => handleChange('budget', e.target.value)}
                                    id="budget"
                                    min={0}
                                />
                                <div className='create--currency-indicator heading5 no-margin-top'>PHP</div>
                            </div>
                        </div>
                        <div className='form-row'>
                            <label htmlFor="numberOfPeople" className='create--form-label'>Group size</label>
                            <input
                                type="number"
                                name="numberOfPeople"
                                className='create--form-input no-margin-top no-margin-bottom'
                                min={1}
                                placeholder='1'
                                value={formData.numberOfPeople}
                                onChange={(e) => handleChange('numberOfPeople', e.target.value)}
                                id="numberOfPeople"
                            />
                        </div>
                    </div>
                    <div className='create--form-footer'>
                        <button className='create--form-button' type="submit"><FontAwesomeIcon className='btn-icons' icon={faPenToSquare} />Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTrip