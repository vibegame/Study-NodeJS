import {RequestHandler, Request} from "express";

import axios from 'axios';
import {terminal} from "../../../Terminal";

interface Params {
    [key: string]: string
}

interface Headers {
    "Content-Type": string,

    [key: string]: string
}

interface ProxyRequest extends Request {
    body: {
        url: string,
        method: "GET" | "POST"
        params: Params,
        headers: Headers
    }
}

export const savedRequests: {
    timestamp: number, requestData: {
        url: string,
        method: "GET" | "POST"
        params: Params,
        headers: Headers
    }
}[] = [];

const get = (url: string, params: Params, headers: Headers) => {
    return axios.get(url, {
        params,
        headers
    });
};

const post = (url: string, params: Params, headers: Headers) => {
    return axios.post(url, params, {
        headers
    });
};

export const onProxy: RequestHandler = async (req: ProxyRequest, res) => {

    let response;

    try {
        switch (req.body.method) {
            case "GET":
                response = await get(req.body.url, req.body.params, req.body.headers);
                res.send(response.data);
                break;
            case "POST":
                response = await post(req.body.url, req.body.params, req.body.headers);
                res.send(response.data);
                break;
        }
        savedRequests.push({
            timestamp: Date.now(),
            requestData: req.body
        });
    } catch (error) {
        terminal.error(error.message);
        res.status(500).send({
            __error: error.message
        });
    }
};
