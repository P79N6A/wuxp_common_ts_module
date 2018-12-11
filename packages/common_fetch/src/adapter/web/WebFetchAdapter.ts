import {FetchAdapter} from "../FetchAdapter";
import {FetchResponse} from "../../FetchOptions";
import {ResponseType} from "../../constant/ResponseType";
import {WebFetchOptions} from "./WebFetchOptions";
import {ReqequestMethod} from "../../constant/ReqequestMethod";
import {ResolveFetchData} from "../../resolve/ResolveFetchData";
import CommonResolveFetchData from "../../resolve/CommonResolveFetchData";


// RequestInit 属性name列表
const RequestInitAttrNames: string[] = [
    "referrer",
    "referrerPolicy",
    "credentials",
    "redirect",
    "cache",
    "integrity",
    "keepalive",
    "window"
];

/**
 * web端fetchAdapter
 */
export default class WebFetchAdapter implements FetchAdapter<WebFetchOptions> {

    /**
     * 解析请求结果数据
     */
    private resolveFetchData: ResolveFetchData = new CommonResolveFetchData();

    request = (options: WebFetchOptions): Promise<FetchResponse> => {

        return fetch(this.buildRequest(options)).then((response: Response) => {

            return this.parse(response, options.responseType).then((data) => {
                response['data'] = data;
                return this.resolveFetchData.resolve(response);
            });
        }).catch((response: Response) => {
            const data = this.resolveFetchData.resolve(response);
            data.data = response;
            return data;
        })

    };


    /**
     * 构建请求对象
     * @param {WebFetchOptions} options
     * @return {Request}
     */
    private buildRequest(options: WebFetchOptions): RequestInfo {
        let {
            url,
            method,
            headers,
            data,
            mode
        } = options;


        const reqMethodElement = ReqequestMethod[method];

        //构建Request请求对象
        const reqOptions = {
            method: reqMethodElement,
            headers,
            body: data,
            mode
        } as RequestInit;

        RequestInitAttrNames.forEach((name) => {
            const attr = options[name];
            if (attr == null) {
                return;
            }
            reqOptions[name] = attr;
        });
        return new Request(url, reqOptions);
    }


    /**
     * 格式化数据
     * @param response
     * @param dataType
     * @return {any}
     */
    private parse(response: Response, dataType: ResponseType): Promise<any> {

        if (!response.ok) {
            return Promise.reject(null);
        }

        //TODO 请求进度
        switch (dataType) {
            case ResponseType.JSON:
                return this.parseJSON(response);
            case ResponseType.TEXT:
                return this.parseText(response);
            case ResponseType.HTML:
                return this.parseText(response);
            case ResponseType.SCRIPT:
                return this.parseJSON(response);
            case ResponseType.BLOB:
                return this.paresBlob(response);
            default:
                const error = new Error("不支持的结果数据类型：" + dataType);
                error['response'] = response;
                throw error;
        }

    }

    private parseJSON(response: Response): Promise<any> {
        return response.json();
    }

    private parseText(response: Response): Promise<string> {
        return response.text();
    }

    private paresArrayBuffer(response: Response): Promise<ArrayBuffer> {
        return response.arrayBuffer();
    }

    private paresBlob(response: Response): Promise<Blob> {
        return response.blob();
    }

    private paresFormData(response: Response): Promise<FormData> {
        return response.formData();
    }
}
