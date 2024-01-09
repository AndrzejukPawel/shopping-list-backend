import express, { RequestHandler } from 'express';
export type HttpMethod = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head"

export interface RequestDefinition {
    httpMethod: HttpMethod;
    path: string;
    handler: RequestHandler;
}
