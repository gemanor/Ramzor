import { Ramzor } from 'ramzor';
import { Page } from '../services/unsplash';

const Gallery = Ramzor({
    initial: 'waiting',
    states: {
        waiting: {
            actions: {
                LOAD: 'loading',
            }
        },
        loading: {
            actions: {
                NOT_FOUND: 'notFound',
                ERROR: 'error',
                SUCCESS: 'feed'
            },
            enter: async (prev, machine) => {
                const response = await Page(machine.current().value.username, 1, 20);
                machine.send(response.command, response.data);
            }
        },
        loadingMore: {
            actions: {
                NOT_FOUND: 'notFound',
                ERROR: 'error',
                SUCCESS: 'feed'
            },
            enter: async (prev, machine) => {
                const { username, page, photos } = machine.current().value;
                const response = await Page(username, page + 1, 20, photos);
                machine.send(response.command, response.data);
            }
        },
        feed: {
            actions: {
                LOAD: 'loading',
                LOAD_MORE: 'loadingMore'
            }
        },
        notFound: {
            actions: {
                LOAD: 'loading'
            }
        }
    }
});

export default Gallery;