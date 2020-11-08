import { Ramzor } from 'ramzor';

const Search = Ramzor({
    initial: 'typing',
    states: {
        typing: {
            actions: {
                TYPE: 'typing',
            }
        }
    }
});

export default Search;
