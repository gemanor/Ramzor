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
        on: (event, cb) => { const l = attach(cb, listeners[event]); listeners[event] = l.l; return l.id; },
        off: (event, id) => (listeners[event] = detach(id, listeners[event])),
        emit: (event, message) => (listeners[event] && Object.values(listeners[event]).forEach(f => f(message))),
    });
    states[initial].enter && states[initial].enter(null, machine);
    return machine;
}

const attach = (cb, listeners = {}) => {
    const l = { ...listeners };
    const id = uuidv4();
    l[id] = cb;
    return { id, l };
}

const detach = (id, listeners = {}) => {
    if (!id) {
        return {};
    }
    const l = { ...listeners };
    delete l[id];
    return l;
}

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
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
    // TODO make this function more pure
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