
const baseUrl = 'http://localhost:3030/jsonstore/users'

export default {
    async getAll() {

        try {
            const response = await fetch(baseUrl);
            const result = await response.json();
            const users = Object.values(result);
            return users;
        } catch (error) {
            const errorMsg = error.message;

            throw new Error(errorMsg);
        }
    },

    async getOne(userId) {
        const response = await fetch(`${baseUrl}/${userId}`);

        const user = await response.json();

        return user;
    },

    async create(userData) {
        const postData = transformUserData(userData);

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        const newUser = await response.json();

        return newUser;
    },

    async delete(userId) {
        const response = await fetch(`${baseUrl}/${userId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        return result;
    },

    async update(userId, userData) {
        const postData = transformUserData(userData);
        postData._id = userId;

        const response = await fetch(`${baseUrl}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        const result = await response.json();

        return result;
    }
}

function transformUserData (userData) {
    const {country, city, street, streetNumber, ...transformedData} = userData;

    transformedData.address = {country, city, street, streetNumber};
    transformedData.createdAt = new Date().toISOString();
    transformedData.updatedAt = new Date().toISOString();

    return transformedData;
}