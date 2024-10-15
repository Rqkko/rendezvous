export interface User {
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
}

export async function getUser(): Promise<User | null> {
    return fetch('/api/user/getUser')
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(data.message);
                });
            }
            return response.json();
        })
        .then((data) => {
            return {
                userId: data.userId,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                phone: data.phone
            };
        })
        .catch(() => {
            return null;
        });
}