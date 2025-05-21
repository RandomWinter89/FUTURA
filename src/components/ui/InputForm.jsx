import { IconPlus, IconDash } from "../icon";

export const InputNumber = ({onDecrement, onIncrement, quantity, setQuantity}) => {

    return (
        <div className="w-fit max-h-12 flex gap-2 border border-black">
            <button onClick={onDecrement} className="p-2">
                <IconDash className={"max-lg:w-4"}/>
            </button>

            <input 
                type="number" 
                value={quantity}
                onChange={(e) => {
                    if (e.target.value >= 100)
                        return setQuantity({value: 99})

                    if (e.target.value <= 0)
                        return setQuantity({value: 1})

                    setQuantity({value: e.target.value});
                }}
                className="border-none text-center p-0 w-16 max-lg:w-4 "
            />
            
            <button onClick={onIncrement} className="p-2">
                <IconPlus className={"max-lg:w-4"}/>
            </button>
        </div>
    )
}


const InputForm = ({ children }) => {
    return (
        <div className="flex flex-col gap-2">
            {children}
        </div>
    )
}

InputForm.Number = InputNumber;

export default InputForm;
