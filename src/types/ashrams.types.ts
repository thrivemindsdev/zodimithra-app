export interface LiveSession {
    id: number;
    title: string;
    description: string | null;
    start_time: string | null;
    end_time: string | null;
    duration: number | null;
    listener_count: number;
    price: string | number;
    is_subscribed: number | boolean;
    author_id: string | number | null;
    author: {
        id: number;
        role: string;
        image: string;
        user: {
            id: number;
            name: string;
            image: string | null;
        } | null;
    } | null;
    thumbnail: string | null;
    status?: string;
    // LiveKit / Meet platform: guest join link, embedded in an iframe.
    meet_url: string | null;
    // Legacy Zoom fields — no longer returned by the API, kept optional for back-compat.
    room_name?: string | null;
    password?: string | null;
    zoom_meeting_id?: string | null;
    zoom_join_url?: string | null;
    zoom_start_url?: string | null;
    created_by?: string | number | null;
    created_at: string;
    updated_at: string;
}

export interface LiveSessionsResponse {
    status: boolean;
    data: {
        livesessions: LiveSession[];
        upcomingsessios: LiveSession[];
    };
}
