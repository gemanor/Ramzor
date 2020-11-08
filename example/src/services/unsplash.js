const Page = async (username, page, size, old = []) => {
    try {
        const response = await fetch(`https://api.unsplash.com/users/${username}/photos?per_page=${size}&page=${page}&client_id=22ae3a3fb9415b82a2f8da77b560210d4aac32adc0a3fe12dc5b4e2b85ebc384`);
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