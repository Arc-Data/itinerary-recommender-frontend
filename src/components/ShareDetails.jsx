import Map from "./Map"

const ShareDetails = ({onClose, day}) => {
    console.log(day)

    return (
        <>
            <div className="overlay" onClick={onClose}></div>
            <div className="share--details">
                <div>Content</div>
                <Map />
            </div>
        </>
    )
}

export default ShareDetails