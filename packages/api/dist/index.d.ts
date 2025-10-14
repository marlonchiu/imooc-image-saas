import { type OpenRouter } from './open-router-dts';
export declare const openApiClient: import("@trpc/client").TRPCClient<import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    file: import("@trpc/server").TRPCBuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        createPresignedUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                filename: string;
                contentType: string;
                size: number;
                appId: string;
            };
            output: {
                url: string;
                method: "PUT";
            };
            meta: object;
        }>;
        saveFile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                path: string;
                type: string;
                appId: string;
            };
            output: {
                id: string;
                name: string;
                type: string;
                createdAt: Date | null;
                deletedAt: Date | null;
                path: string;
                url: string;
                userId: string;
                contentType: string;
                appId: string;
            };
            meta: object;
        }>;
        listFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                appId: string;
            };
            output: {
                id: string;
                name: string;
                type: string;
                createdAt: Date | null;
                deletedAt: Date | null;
                path: string;
                url: string;
                userId: string;
                contentType: string;
                appId: string;
            }[];
            meta: object;
        }>;
        infinityQueryFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                appId: string;
                cursor?: {
                    id: string;
                    createdAt: string;
                } | undefined;
                limit?: number | undefined;
                orderBy?: {
                    field: "createdAt" | "deletedAt";
                    order: "asc" | "desc";
                } | undefined;
                showDeleted?: boolean | undefined;
            };
            output: {
                items: {
                    id: string;
                    name: string;
                    type: string;
                    createdAt: Date | null;
                    deletedAt: Date | null;
                    path: string;
                    url: string;
                    userId: string;
                    contentType: string;
                    appId: string;
                }[];
                nextCursor: {
                    createdAt: Date;
                    id: string;
                } | null;
            };
            meta: object;
        }>;
        deleteFile: import("@trpc/server").TRPCMutationProcedure<{
            input: string;
            output: import("pg").QueryResult<never>;
            meta: object;
        }>;
    }>>;
}>>>;
export declare const createOpenApiClient: ({ apiKey }: {
    apiKey: string;
}) => import("@trpc/client").TRPCClient<import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    file: import("@trpc/server").TRPCBuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        createPresignedUrl: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                filename: string;
                contentType: string;
                size: number;
                appId: string;
            };
            output: {
                url: string;
                method: "PUT";
            };
            meta: object;
        }>;
        saveFile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                path: string;
                type: string;
                appId: string;
            };
            output: {
                id: string;
                name: string;
                type: string;
                createdAt: Date | null;
                deletedAt: Date | null;
                path: string;
                url: string;
                userId: string;
                contentType: string;
                appId: string;
            };
            meta: object;
        }>;
        listFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                appId: string;
            };
            output: {
                id: string;
                name: string;
                type: string;
                createdAt: Date | null;
                deletedAt: Date | null;
                path: string;
                url: string;
                userId: string;
                contentType: string;
                appId: string;
            }[];
            meta: object;
        }>;
        infinityQueryFiles: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                appId: string;
                cursor?: {
                    id: string;
                    createdAt: string;
                } | undefined;
                limit?: number | undefined;
                orderBy?: {
                    field: "createdAt" | "deletedAt";
                    order: "asc" | "desc";
                } | undefined;
                showDeleted?: boolean | undefined;
            };
            output: {
                items: {
                    id: string;
                    name: string;
                    type: string;
                    createdAt: Date | null;
                    deletedAt: Date | null;
                    path: string;
                    url: string;
                    userId: string;
                    contentType: string;
                    appId: string;
                }[];
                nextCursor: {
                    createdAt: Date;
                    id: string;
                } | null;
            };
            meta: object;
        }>;
        deleteFile: import("@trpc/server").TRPCMutationProcedure<{
            input: string;
            output: import("pg").QueryResult<never>;
            meta: object;
        }>;
    }>>;
}>>>;
export { OpenRouter };
