import { useEffect, useState } from "react";

const useMachine = (m) => {
    const [current, setCurrent] = useState(m.current);
    useEffect(() => {
        m.on('transition', (event) => {
            setCurrent(event.to)
        });
    }, [m]);
    return [current, m.send];
}

export { useMachine };
