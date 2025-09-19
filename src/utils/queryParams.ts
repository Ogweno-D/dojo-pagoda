// utils/queryParams.ts

/**
 * Builds a URL-encoded query string from a parameter object.
 * @param params The object containing key-value pairs for the query.
 * @returns A string starting with '?' for use in a URL.
 */
export const buildQueryParams = (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, String(value));
        }
    }

    return `?${searchParams.toString()}`;
};