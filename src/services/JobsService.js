import api from '.api';

async function getAll() {
    return await api.getAll('/jobs');
}

export default {
    getAll
};