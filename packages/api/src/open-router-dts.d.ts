import * as pg from 'pg';
import * as _trpc_server from '@trpc/server';

declare const openRouter: _trpc_server.TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: _trpc_server.TRPCDefaultErrorShape;
    transformer: false;
}, _trpc_server.TRPCDecorateCreateRouterOptions<{
    file: _trpc_server.TRPCBuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: false;
    }, _trpc_server.TRPCDecorateCreateRouterOptions<{
        createPresignedUrl: _trpc_server.TRPCMutationProcedure<{
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
        saveFile: _trpc_server.TRPCMutationProcedure<{
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
        listFiles: _trpc_server.TRPCQueryProcedure<{
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
        infinityQueryFiles: _trpc_server.TRPCQueryProcedure<{
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
        deleteFile: _trpc_server.TRPCMutationProcedure<{
            input: string;
            output: pg.QueryResult<never>;
            meta: object;
        }>;
    }>>;
}>>;
type OpenRouter = typeof openRouter;

export type { OpenRouter };
