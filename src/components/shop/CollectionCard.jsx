import { Card, Button } from '../ui'
import { useMemo } from 'react';

const CollectionCard = ({data, image, quantity, onCallUpdate, onCallRemoval}) => {
    
    const sumPrice = useMemo(() => {
        return ((parseFloat(data.base_price) + parseFloat(data.extra_charge)) * data.quantity)
    }, [data]);

    return (
        <Card variant={"horizontal"}>
            <Card.Image imageUrl={image} />

            <Card.Body>
                <Card.Text>
                    {data.name1 != null && <p>Color: {data.value1}</p>}
                    {data.name2 != null && <p>Size: {data.value2}</p>}
                    <p>Subtotal price: RM{sumPrice}</p>
                </Card.Text>

                <input 
                    type="number" 
                    value={quantity} 
                    min="1"
                    max="99"
                    onChange={(e) => onCallUpdate({quantity: parseInt(e.target.value)})} 
                />
                    
                <Card.Actions >
                    {/* <Button onClick={onAdd}>Add</Button> */}
                    <Button onClick={onCallRemoval}>Remove</Button>
                </Card.Actions>
            </Card.Body>
        </Card>
    )
}

export default CollectionCard;