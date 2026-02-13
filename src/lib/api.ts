const API_BASE_URL = 'http://localhost:3000/api/v1';

export interface RegisterUserData {
    name: string;
    phoneNumber: string;
    email: string;
    password: string;
    collegeName: string;
    teamName?: string;
}

export interface RegisterUserResponse {
    success: boolean;
    message: string;
    data?: {
        user: {
            _id: string;
            name: string;
            email: string;
            phoneNumber: string;
            collegeName: string;
        };
        team?: {
            _id: string;
            teamName: string;
            leader: string;
            membersCount: number;
        };
    };
}

export const registerUser = async (userData: RegisterUserData): Promise<RegisterUserResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Registration API error:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};
