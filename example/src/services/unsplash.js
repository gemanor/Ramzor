const clientID = ''; // Enter unsplash client ID for fetching pictures

const Page = async (username, page, size, old = []) => {
    try {
        const response = await fetch(`https://api.unsplash.com/users/${username}/photos?per_page=${size}&page=${page}&client_id=${clientID}`);
        const status = response.status;
        const total = response.headers.get('X-Total');
        const json = await response.json();
        if (status === 404) {
            return { command: 'NOT_FOUND', data: { username } };
        } else if (status === 200) {
            return { command: 'SUCCESS', data: { username, photos: old.concat(json), page, total } };
        }
    } catch (error) {
        return { command: 'ERROR', data: { ...error } };
    }
}

export { Page }