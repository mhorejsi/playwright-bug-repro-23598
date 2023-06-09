import {test as base, expect} from "@playwright/test";
import {Route} from "@playwright/test";
import cors from "cors";
import express, {Express} from "express";
import SSE from "express-sse";
import {Server} from "http";

class SSEHandle {

    private app;
    private serverUrl: string;
    private sse: SSE;

    constructor(app: Express, serverUrl: string) {
        this.app = app;
        this.serverUrl = serverUrl;
    }

    attach(route: Route): SSE {
        const url: URL = new URL(route.request().url())
        const sse = new SSE([], undefined);
        this.app.get(url.pathname, sse.init);
        route.continue({url: `${this.serverUrl}${url.pathname}`});
        this.sse = sse;
        return sse;
    }

    get(): SSE | undefined {
        if (!this.sse) {
            throw new Error("Cannot get handle before attaching to the route.")
        }
        return this.sse;
    }

}

const test = base.extend<{}, {sseHandle: SSEHandle}>({
    sseHandle: [async ({}, use) => {
        const app: Express = express();
        const server: Server = await app.listen();
        app.use(cors());
        const serverUrl: string = `http://localhost:${server.address().port}`;
        console.log(`Express server for SSE events is available at ${serverUrl}`);

        const handle: SSEHandle = new SSEHandle(app, serverUrl);

        await use(handle);

        server.close();
    }, {scope: "worker"}]
});

export {test, expect, SSEHandle};
