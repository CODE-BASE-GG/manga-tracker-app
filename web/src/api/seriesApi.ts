import type {
    CreateSeriesDto,
    Series,
    SeriesStatus,
    UpdateSeriesDto,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error('VITE_API_URL is not configured');
}

async function request<T> (
    path: string,
    options?: RequestInit,
): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        },
        ...options,
    });

    if (!response.ok) {
        let message = `Request faild with status ${response.status}`;

        try {
            const body = await response.json();

            if(typeof body?.message === 'string') {
                message = body.message;
            } else if (Array.isArray(body?.message)) {
                message = body.message.join(', ');
            }
        } catch {
            // Keep default error message if the response isn't JSON.
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export function getAllSeries(status?: SeriesStatus): Promise<Series[]> {
    const query = status
        ? `?status=${encodeURIComponent(status)}`
        : '';
    
    return request<Series[]>(`/series${query}`);
}

export function getSeriesById(id: string): Promise<Series> {
    return request<Series>(`/series/${id}`);
}

export function createSeries(dto: CreateSeriesDto): Promise<Series> {
    return request<Series>(`/series`, {
        method: 'POST',
        body: JSON.stringify(dto),
    });
}

export function updateSeries(
    id: string,
    dto: UpdateSeriesDto,
): Promise<Series> {
    return request<Series>(`/series/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(dto),
    });
}

export function deleteSeries(id: string): Promise<void> {
    return request<void>(`/series/${id}`, {
        method: 'DELETE',
    });
}

export function bumpChapter(
    id: string,
    amount = 1,
): Promise<Series> {
    return request<Series>(`/series/${id}/bump`, {
        method: 'PATCH',
        body: JSON.stringify({amount}),
    });
}
