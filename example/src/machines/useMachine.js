import { useEffect, useState } from "react";

const useMachine = (m) => {
    const [current, setCurrent] = useState(m.current);
    useEffect(() => {
        const event = m.on('transition', (event) => {
            setCurrent(event.to)
        });
        return (() => (m.off('transition', event)))
    }, [m]);
    return [current, m.send];
}

export { useMachine };
