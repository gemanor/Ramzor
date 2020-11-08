const events = Object.freeze({
    TRANSITION: 'transition'
});

const Ramzor = (config) => {
    const { initial } = config;
    const states = mapStates(config.states);
    if (!initial || !states || !Object.keys(states).length || !states[initial]) {
        return;
    }
    const listeners = {};
    const trail = [states[config.initial].name];
    const machine = Object.freeze({
        initial,
        states,
        current: () => ({ ...states[trail[trail.length - 1]] }),
        send: (action, value) => transition(action, value, machine, trail),
        // Todo check if it's function
        on: (event, cb) => (listeners[event] && listeners[event].push(cb) || (listeners[event] = [cb])),
        off: (event) => (listeners[event] = []),
        emit: (event, message) => (listeners[event] && listeners[event].forEach(f => f(message))),
    });
    states[initial].enter && states[initial].enter(null, machine);
    return machine;
}

const mapStates = (config) => {
    if (!config) {
        return {};
    }
    const keys = config && Object.keys(config);
    return Object.freeze(keys.reduce((states, key) => {
        states[key] = state(key, config[key]);
        return states;
    }, {}));
}

const state = (name, config) => {
    // This object should be immutable and check
    // TBD implement better data flow and avoid value changing
    const { actions = {}, enter, leave } = config;
    return {
        actions,
        enter,
        leave,
        name,
        is: (pattern) => (pattern && pattern === name),
        next: Object.values(actions)
    };
}

const transition = (action, value, machine, trail) => {
    const active = machine.current();
    const name = active.actions && active.actions[action];
    const next = name && machine.states && machine.states[name];
    if (!next) {
        console.error(`Can't find state named ${name} for action ${action}. available states: `, Object.keys(machine.states));
        return;
    }
    trail.push(next.name);
    next.value = { ...value };
    active.leave && active.leave(next, machine);
    next.enter && next.enter(active, machine);
    machine.emit(events.TRANSITION, { from: { ...active }, to: { ...next } });
}

module.exports = { Ramzor, events };