import {HttpCodeHandler, HttpErrorHandler} from "./HttpErrorHandler";
import {isNullOrUndefined} from "util";
import {FetchOptions, FetchResponse} from "../fetch/FetchOptions";

/**
 * 基于fetch请求的httpError错误处理者
 */
export default class FetchHttpErrorHandler implements HttpErrorHandler<FetchResponse, FetchOptions> {

    /**
     * 错误处理者的缓存列表
     */
    protected handlers: Map<number/*http 结果状态码*/, HttpCodeHandler>;

    /**
     * 默认错误处理者
     */
    protected defaultHandler: HttpCodeHandler;


    constructor(handlers?: Map<number, HttpCodeHandler>) {
        if (isNullOrUndefined(handlers)) {
            this.handlers = new Map<number, HttpCodeHandler>();
        } else {
            this.handlers = handlers;
        }
    }

    addErrorCodeHandler = (httpCode: number, handler: HttpCodeHandler): FetchHttpErrorHandler => {
        this.handlers.set(httpCode, handler);
        return this;
    };


    handleRequestError = (response: FetchResponse, request: FetchOptions): boolean | void => {
        const httpCode: number = response.httpCode;
        const handler = this.handlers.get(httpCode);
        if (isNullOrUndefined(handler)) {
            //没有找到处理者
            console.log(`未找到httpCode=${httpCode}的错误处理者`);
            if (!isNullOrUndefined(this.defaultHandler)) {
                console.log(`使用默认的错误处理`);
                this.defaultHandler(response, request);
            }
            return;
        }
        return handler(response, request);
    };


    setDefaultErrorHandler = (handler: HttpCodeHandler) => {
        this.defaultHandler = handler;
    };


}
