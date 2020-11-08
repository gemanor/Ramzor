const { describe, it, expect } = require("@jest/globals");
const { Ramzor } = require("./ramzor");

const model = {
    initial: 'red',
    states: {
        red: {
            actions: {
                timer: 'yellow'
            },
            value: {
                description: 'Prepare to stop'
            },
        },
        yellow: {
            actions: {
                timer: 'green'
            },
            value: {
                description: 'Go'
            }
        },
        green: {
            actions: {
                timer: 'red'
            },
            value: {
                description: 'Stop'
            }
        }
    }
};


describe('Basic machine initialization', () => {
    const tl = Ramzor(model);
    it('Initial state equals red', () => {
        expect(tl.current().is('red')).toBeTruthy();
    });
    it('Machine includes three states', () => {
        expect(Object.keys(tl.states).length).toBe(3);
    });
    it('State includes names', () => {
        const name = 'green';
        expect(tl.states[name].name).toEqual(name);
    });
    it('Next states', () => {
        expect(tl.current().next).toEqual(['yellow']);
    });
});

describe('Active machine locking', () => {
    const tl = Ramzor(model);
    it('Cannot change state name', () => {
        const current = tl.current();
        const currentName = current.name;
        tl.current().name = 'Blue';
        expect(current.name).toEqual(currentName);
    });
});

describe('Missing states and actions', () => {
    const tl = Ramzor(model);
    it('No states in missing machines', () => {
        expect(Ramzor({})).toBeUndefined();
    });
    it('Not defined action', () => {
        try {
            tl.send('blabla');
        } catch (error) {

        }
        expect(tl.current().name).toEqual('red');
    });
});

describe('Transitions and events', () => {
    const tl = Ramzor(model);
    it('Move to other state', () => {
        const next = tl.current().next.join('');
        tl.send('timer');
        expect(tl.current().name).toEqual(next);
    });
    it('Move to other state', () => {
        const next = tl.current().next.join('');
        tl.send('timer', { test: 'test' });
        expect(tl.current().name).toEqual(next);
    });
    it('Get notification for moving', (done) => {
        const listener = tl.on('transition', (event) => {
            expect(event.to).toBeDefined();
            expect(event.from).toBeDefined();
            done();
        });
        tl.send('timer');
    });
    it('Get notification for moving with partial off', () => {
        const callback = jest.fn();
        const listener = tl.on('transition', callback);
        const listener1 = tl.on('transition', callback);
        tl.send('timer');
        tl.off('transition', listener);
        tl.send('timer');
        expect(callback).toHaveBeenCalledTimes(3);
    });
    it('Get notification for moving with full off', () => {
        const callback = jest.fn();
        const listener = tl.on('transition', callback);
        const listener1 = tl.on('transition', callback);
        tl.send('timer');
        tl.off('transition');
        tl.send('timer');
        expect(callback).toHaveBeenCalledTimes(2);
    });
    it('Empty off', () => {
        const ttl = Ramzor(model);
        ttl.off('transition');
        expect(ttl.current().is('red')).toBeTruthy();
    });
    it('Enter and leave functions', () => {
        const enter = jest.fn();
        const leave = jest.fn();
        const deadendModel = {
            initial: 'red',
            states: {
                red: { actions: { timer: 'yellow' }, enter, leave },
                yellow: { actions: { timer: 'green' }, enter },
                green: {}
            }
        };
        const ptl = Ramzor(deadendModel);
        ptl.send('timer');
        expect(enter).toHaveBeenCalledTimes(2);
        expect(leave).toHaveBeenCalledTimes(1);
    });
});