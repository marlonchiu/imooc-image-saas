import { httpBatchLink, createTRPCClient } from '@trpc/client';
export const openApiClient = createTRPCClient({
    links: [
        httpBatchLink({
            url: 'http://localhost:3000/api/open'
        })
    ]
});
export const createOpenApiClient = ({ apiKey }) => {
    return createTRPCClient({
        links: [
            httpBatchLink({
                url: 'http://localhost:3000/api/open',
                headers: {
                    'api-key': apiKey
                }
            })
        ]
    });
};
