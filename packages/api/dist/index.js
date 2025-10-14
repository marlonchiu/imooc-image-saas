import { httpBatchLink, createTRPCClient } from '@trpc/client';
export const openApiClient = createTRPCClient({
    links: [
        httpBatchLink({
            url: 'http://localhost:3000/api/open'
        })
    ]
});
export const createOpenApiClient = ({ apiKey, signedToken }) => {
    const headers = {};
    if (apiKey) {
        headers['api-key'] = apiKey;
    }
    if (signedToken) {
        headers['signed-token'] = signedToken;
    }
    return createTRPCClient({
        links: [
            httpBatchLink({
                url: 'http://localhost:3000/api/open',
                headers: headers
            })
        ]
    });
};
