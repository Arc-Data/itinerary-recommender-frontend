import { faBars } from "@fortawesome/free-solid-svg-icons"
import { Draggable } from "react-beautiful-dnd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const OrderItem = ({location, index}) => {
    const draggableId = `location-${location.id}`;
    
    return (
        <Draggable draggableId={draggableId} index={index}>
            {(provided) => (
            <div 
                className="order-item"
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                >
                <FontAwesomeIcon icon={faBars} />
                <p>{location.details.name}</p>
            </div>
            )}
        </Draggable>
    )
}

export default OrderItem