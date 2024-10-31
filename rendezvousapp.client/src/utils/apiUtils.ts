export interface User {
    // TODO: try change to number
    userId: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
}

export interface Event {
    eventId: number;
    locationId: number;
    eventName: string;
    eventDescription: string;
    date: string;
    theme: string;
    guestCount: number;
}

export interface Reservation {
    reservationId: number;
    userId: number;
    eventId: number;
    reservationDateTime: string;
    paymentId: number;
}

export interface Payment {
    paymentId: number;
    paymentAmount: number;
    paymentDateTime: string;
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