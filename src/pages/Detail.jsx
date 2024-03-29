import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
/*Components*/
import Review from "../components/Review";
/*Icon*/
import {
	FaEllipsisH,
	FaStar,
	FaTrash,
	FaEdit,
	FaArrowLeft,
	FaArrowRight,
	} from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from "../context/AuthContext";
import timeToNow from "../utils/timeToNow";
import SpotDetail from "../components/SpotDetail";
import FoodDetail from "../components/FoodDetail";
import AccommodationDetail from "../components/AccommodationDetail";
import useLocationManager from "../hooks/useLocationManager";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
	faAnglesLeft, 
	faAnglesRight,
	faChevronLeft, 
	faChevronRight,
	faMoneyBills,
	faClock,
	faMap,
	faBookmark,
} from '@fortawesome/free-solid-svg-icons';

export default function DetailPage() {
	const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
	
	const { id } = useParams()
	const { authTokens, user } = useContext(AuthContext);
	const { 
		location, 
		error, 
		loading, 
		getLocation 
	} = useLocationManager(authTokens)

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState("");
	const [images, setImages] = useState([]);
	const letter = user.email[0].toUpperCase();
	const [isBookmarked, setBookmarked] = useState(false);
	const [editMode, setEditMode] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const [reviewData, setReviewData] = useState([]);
	const [userReview, setUserReview] = useState();
	const [formData, setFormData] = useState({
		comment: "",
		rating: 0,
	});
	const badWords = 
	["Putangina", "Tangina", "Gago", "Tay Dana", 
	"Fuck You", "Fuckyou", "Bitch", "Crap", "Asshole",
	"Fuck", "Bullshit", "Shit", "Son of a bitch", "Bastard",
	"Tanay Damo", "Puke", "Pepe", "Titi", "Leche", "Punyeta",
	"Putang", "Ina mo", "Tae", "Kupal", "Ulol" , "Pukinginamo"
	,"inamo" ,"bobo" ,"b0b0", "B1tch", "Puki", "Pukinang ina", 
	"Sh1t", "PutanginaM0"];

	const handleReviewChange = (name, value) => {
		setFormData((prev) => ({
		...prev,
		[name]: value,
		}));
	};

	const getLocationData = async () => {
		const data = await getLocation(id)
		setBookmarked(data.is_bookmarked);
		setImages(data.images);
		setSelectedImage(`${backendUrl}` + data.images[0]);
	};

	// GET LOCATION REVIEW
	const getLocationReviewData = async () => {
		const response = await fetch(
			`${backendUrl}/api/location/${Number(id)}/reviews/?page=${currentPage}`,
				{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${authTokens.access}`,
				},
			}
		);

		const locationData = await response.json();
		setReviewData(locationData.results);
		setTotalPages(Math.ceil(locationData.count / 5)); 
	};

	// GET REVIEW OF USER
	const getReviewData = async () => {
		setUserReview()

		try {
			const response = await fetch(
				`${backendUrl}/api/location/${id}/reviews/user/`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${authTokens.access}`,
					},
				}
			)

			if (response.status === 404) {
				return 
			}

			const data = await response.json();
			setUserReview(data);
			setFormData({
				"comment": data.comment,
				"rating": data.rating
			})
		} 
		catch (error) {
			
		}
	};

	const displayTags = location && location.location_type !== '3' && location.details.tags.map((tag, index) => {
		return (
			<div key={index} className="detailPage--tag description">{tag}</div>
		)
	})

	// GET LOCATION DATA
	useEffect(() => {
		getReviewData();
		getLocationData();
	}, [id]);
	
	useEffect(() => {
		getLocationReviewData();
	}, [id, currentPage]) 

	// SUBMIT REVIEW
	const submitReview = async () => {
		try {
		  // Check for inappropriate words
		  const hasBadWords = badWords.some(word => formData.comment.toLowerCase().includes(word.toLowerCase()));
	  
		  if (hasBadWords) {
			// Show an error message or handle appropriately
			toast.error("Your review contains inappropriate words. Please edit and try again.");
			return;
		  }
	  
		  const response = await fetch(
			`${backendUrl}/api/location/${id}/reviews/create/`,
			{
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${authTokens.access}`,
			  },
			  body: JSON.stringify(formData),
			}
		  );
	  
		  if (!response.ok) {
			throw new Error(`Error while submitting the review: `);
		  }
	  
		  const data = await response.json();
		  setUserReview(data);
		  toast.success("Review submitted successfully!");
		} catch (error) {
		  console.error("Error while submitting the review: ", error);
		}
	  };
	

	const handleSubmit = () => {
		if (userReview) {
			editReview()
		} else {
			submitReview()
		}
	}

	// EDIT REVIEW
	const handleEditReview = () => {
		if (dropdownOpen) {
			setDropdownOpen(false);
		}
	
		setEditMode((prev) => !prev);
	};
	
	if (loading) {
		return <div>Please wait</div>;
	}
	
	const editReview = async () => {
		try {
		  // Check for inappropriate words
		  const hasBadWords = badWords.some(word => formData.comment.toLowerCase().includes(word.toLowerCase()));
	  
		  if (hasBadWords) {
			// Show an alert for inappropriate words
			toast.error("Your review contains inappropriate words. Please edit and try again.");
			return;
		  }
	  
		  const response = await fetch(`${backendUrl}/api/location/${id}/reviews/edit/`, {
			method: "PUT",
			headers: {
			  "Content-Type": "application/json",
			  "Authorization": `Bearer ${authTokens.access}`,
			},
			body: JSON.stringify(formData),
		  });
	  
		  if (!response.ok) {
			throw new Error(`Error while updating the review: ${errorData.detail}`);
		  }
	  
		  const data = await response.json();
		  setUserReview(data);
		  setFormData({
			rating: data.rating,
			comment: data.comment,
		  });
	  
		  setEditMode(false);
		  toast.success("Review updated successfully!");
		} catch (error) {
		  console.error("Error while updating the review: ", error);
		}
	  };

	// DELETE REVIEW 
	const deleteReview = async () => {
		try {
			const response = await fetch(
				`${backendUrl}/api/location/${id}/reviews/delete/`,
					{
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${authTokens.access}`,
						},
					}
				)
			
				if (!response.ok) {
					throw new Error("Error while deleting the review");
				}
			
				setUserReview()
				setFormData({
					'rating': 0,
					'comment': '',
				})
			} catch (error) {
				console.error("Error while deleting the review: ", error);
			}
		};

	// BOOKMARK
	const handleBookmarkSave = async () => {
		try {
			const response = await fetch(`${backendUrl}/api/location/${id}/bookmark/`, {
				"method": "POST",
				"headers": {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${authTokens.access}`,
				},
			})

			if (!response.ok) {
				throw new Error("Error while updating bookmark");
			}

		} catch (error) {
			console.log("Error while updating bookmark: ", error);
		}
	};

	const toggleBookmark = () => {
		const value = isBookmarked;
		setBookmarked((prev) => !prev);
		handleBookmarkSave(value);
	};

	// MAIN IMAGE AND THUMBNAIL
	const handleThumbnailClick = (image) => {
		setSelectedImage(image); // SELECTED IMAGE FOR THE THUMBNAIL
	};

	if (loading) {
		return <div>Loading</div>;
	}

	const thumbnails = images.map((image, index) => (
		<img
		key={index}
		className="thumbnail"
		src={`${backendUrl}${image}`}
		alt={`Thumbnail ${index}`}
		onClick={() => handleThumbnailClick(`${backendUrl}${image}`)}
		/>
	));

	// DROPDOWN
	const handleEllipsisClick = () => {
		setDropdownOpen(prev => !prev);
	};

	//PAGINATION
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
		setCurrentPage(newPage);
		}
	};

	const handlePrevPage = () => {
		const newPage = currentPage - 1;
		if (newPage >= 1) {
		setCurrentPage(newPage);
		}
	};

	const handleNextPage = () => {
		const newPage = currentPage + 1;
		if (newPage <= totalPages) {
		setCurrentPage(newPage);
		}
	};

	const resultStart = (currentPage - 1) * 5 + 1;
	const resultEnd = Math.min(currentPage * 5, reviewData.length);

	return (
		<div className="detailPage">
			 <ToastContainer
				className="toast-container"
			/>
			<div className="detailPage--text">
				<div className="detailPage--address-time">
					<h1 className="detailPage--title heading6">{location?.name}</h1>
					<p className="detailPage--info">
						<FontAwesomeIcon className='btn-icons' icon={faMap} />
						{location?.address}
					</p>
					{location.location_type === "1" && 
					<div>	
						<p className="detailPage--info"> <FontAwesomeIcon className='btn-icons' icon={faClock} />Opens at {location?.details.opening_time} | Closes at {" "} {location?.details.closing_time}{" "}</p>
						<p className="detailPage--info"> <FontAwesomeIcon className='btn-icons' icon={faMoneyBills} />Fee: {location?.details.min_fee} - {location?.details.max_fee}</p>
					</div>
					}
				</div>
				<button
					className={`detailPage--bookmark ${isBookmarked ? "true" : "false"}`}
					onClick={toggleBookmark} >
					<FontAwesomeIcon className='bookmark-icon' icon={faBookmark} />
				</button>
			</div>
		<div className="detailPage--sections">
			<div className="detailPage--about">
				<h1 className="heading2">About</h1>
				<p>{location?.description}</p>
				{(location.location_type === "1" || location.location_type === "2") &&
					<div className="detailPage--tags description">
						<div>{displayTags}</div>
					</div>
				}
				
			</div>
			<div className="detailPage--pictures">
				<div className="detailPage--images">
					<img
						className="detailPage--main-image"
						src={selectedImage}
						alt="Main"
					/>
					<div className="detailPage--thumbnail">
						{thumbnails}
					</div>
				</div>
			</div>
		</div>
		
		
		{location?.location_type === "1" && 
		<SpotDetail location={location}/>
		}
		{location?.location_type === "2" &&
		<FoodDetail isOwnedByUser={location.owner === user.user_id}/>
		}
		{location?.location_type === "3" &&
		<AccommodationDetail />
		}

		<div className="detailPage--review">
			<div className="detailPage--reviews">
				<h1 className='detailPage--title heading'>Reviews & ratings</h1>
				<div className="detailPage--reviews-info">
					<p>{location?.rating_percentages.average_rating}</p>
					<div className="detailPage--star">
						{[...Array(5)].map((star, i) => (
							<FaStar
								key={i}
								className="star"
								color={
								i + 1 <= location?.rating_percentages.average_rating ? "#ffc107" : "#e4e5e9"
								}
							/>
						))}
					</div>
					<p>{location?.rating_percentages.total_reviews} reviews</p>
				</div>
				

				<div className="ratings--container">
					{[5, 4, 3, 2, 1].map((i, index) => {
						const style = {
							"width": `${location?.rating_percentages.ratings[index].percentage * 100}%`
						}

						return (
							<div key={index} className="ratings">
								<span>{i}</span>
								<div className="ratings--bar">
									<div className="ratings--fill" style={style}></div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
			<div className="write--review">
			{userReview && !editMode ? (
				<div className="user--reviewContainer">
					<div className="flex mb15px">
						<div className="d-flexCenter">
							<div className="user--profile">
								<p>{letter}</p>
							</div>
							<p className="user--username">
								{`
								${userReview.user.first_name} 
								${userReview.user.last_name}
								`}
							</p>
						</div>
						<div className="d-flexCenter">
							<div className="detailPage--star j-end">
								{[...Array(5)].map((star, i) => (
								<FaStar
									key={i}
									className="star"
									color={
									i + 1 <= userReview.rating ? "#ffc107" : "#e4e5e9"
									}
								/>
								))}
							</div>
							<p className="date--posted">
								{" "}
								Posted: {timeToNow(userReview.datetime_created)}
							</p>
							<div className="relative">
								<FaEllipsisH
								className="ellipsis-icon"
								onClick={handleEllipsisClick}
								/>
								{dropdownOpen && (
								<div className="userReview-dropContent">
									<div 
										className="plan--day-dropcontent-item"
										onClick={deleteReview}>
										<FaTrash className="btn-icons"/>
										<p>Delete review</p>
									</div>
									<div className="plan--day-dropcontent-item" onClick={handleEditReview}>
										<FaEdit className="btn-icons"/>
										<p>Edit review</p>
									</div>
								</div>
								)}
							</div>
						</div>
					</div>
					<p className="user--reviews">{userReview.comment}</p>
				</div>
			) : (
				<div>
					<textarea
						className="input--review"
						placeholder="How do you find this place?"
						rows="5"
						value={formData.comment}
						onChange={(e) => handleReviewChange("comment", e.target.value)}
					></textarea>
					<div className="button--stars">
						<div className="edit--comment-btns">
							{editMode &&
								<button className="cancel--review" onClick={handleEditReview}>Cancel</button>
							}
								<button className="submit--review" onClick={handleSubmit}>
									Submit review
								</button>
						</div>
						
						<div className="detailPage--star">
							{[...Array(5)].map((star, i) => {
								return (
								<label key={i}>
									<input
									type="radio"
									className="star--radioBtn"
									name="rating"
									value={i + 1}
									onClick={() => handleReviewChange("rating", i + 1)}
									/>
									<FaStar
									className="star"
									color={`${
										i + 1 <= formData.rating ? "#ffc107" : "#e4e5e9"
									}`}
									/>
								</label>
								);
						})}
						</div>
					</div>
				</div>
			)}
			</div>
		</div>
		<div className="detailPage--review">
			<div></div>
			<div className="user--review">
				<h1 className="mb15px"></h1>
				<hr/>
				{reviewData.map((item) => (
				<Review key={item.id} {...item} />
				))}
				<div className="pagination">
					<button
						id="pagination--button1"
						className={`plan--btn ${currentPage === 1 ? "" : ""}`}
						onClick={() => handlePageChange(1)}
						disabled={currentPage === 1}
					>
						<FontAwesomeIcon icon={faAnglesLeft} />
					</button>
					<button
						id="pagination--button1"
						className={`plan--btn ${currentPage === 1 ? "" : ""}`}
						onClick={handlePrevPage}
						disabled={currentPage === 1}
					>
						 <FontAwesomeIcon icon={faChevronLeft} />
					</button>
					{Array.from({ length: totalPages }, (_, index) => index + 1).map(
						(page) => (
						<button
							key={page}
							id="pagination--button"
							className={`plan--btn ${
							page === currentPage ? "btn-primary" : "btn-secondary"
							}`}
							onClick={() => handlePageChange(page)}
						>
							{page}
						</button>
						)
					)}
					<button
						id="pagination--button1"
						className={`plan--btn ${currentPage === totalPages ? "" : ""}`}
						onClick={handleNextPage}
						disabled={currentPage === totalPages}
					>
						<FontAwesomeIcon icon={faChevronRight} />
					</button>
					<button
						id="pagination--button1"
						className={`plan--btn ${currentPage === totalPages ? "" : ""}`}
						onClick={() => handlePageChange(totalPages)}
						disabled={currentPage === totalPages}
					>
						<FontAwesomeIcon icon={faAnglesRight} />
					</button>
				</div>
				<p className="pagination--result">
					Showing results {resultStart}-{resultEnd} of {reviewData.length}
				</p>
			</div>
		</div>
	</div>
	);
}
