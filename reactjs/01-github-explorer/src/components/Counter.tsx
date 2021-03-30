import { useState } from "react"

export function Counter() {
    const [counter, setCounter] = useState(0)

    function incriment() {
        setCounter(previousCounter => previousCounter + 1)
    }

    return (
        <div>
            <h2>{counter}</h2>
            <button type="button" onClick={incriment}>
                Incriment
            </button>
        </div>
    )
}