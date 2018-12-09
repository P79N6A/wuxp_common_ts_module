import {AbstractRestTemplateLoader, RestTemplateLoader} from "../src/template/RestTemplateLoader";
import {defaultApiModuleName} from "../src/constant/FeignConstVar";
import DefaultRestTemplate from "../src/template/DefaultRestTemplate";
import DefaultApiRoutingStrategy from "../src/route/DefaultApiRoutingStrategy";
import CommonFetchClient from "../src/fetch/CommonFetchClient";
import WebFetchAdapter from "../src/adapter/web/WebFetchAdapter";
import FetchInterceptorExecuter from "../src/interceptor/FetchInterceptorExecuter";
import {AbstractProxyServiceExecutor, ProxyServiceExecutor} from "../src/proxy/ProxyServiceExecutor";
import {FeignProxy, ProxyApiService} from "../src/proxy/ProxyApiService";
import Es6PoxyServiceFactory from "../src/proxy/factory/Es6PoxyServiceFactory";
import TestService from "./TestService";
import {setProxyFactory} from "../src/annotations/Feign";
import * as log4js from "log4js";
import SimpleRequestURLResolver from "../src/resolve/url/SimpleRequestURLResolver";
import {FetchOptions} from "../src/FetchOptions";
import {RequestURLResolver} from "../src/resolve/url/RequestURLResolver";
import {RequestHeaderResolver} from "../src/resolve/header/RequestHeaderResolver";
import SimpleRequestHeaderResolver from "../src/resolve/header/SimpleRequestHeaderResolver";

const logger = log4js.getLogger();
logger.level = 'debug';


const routingMapping = {};

class TestRestTemplateLoader extends AbstractRestTemplateLoader {


    buildRestTemplate = (apiModuleName: string) => {
        if (apiModuleName === defaultApiModuleName) {

            return new DefaultRestTemplate({}, new DefaultApiRoutingStrategy(routingMapping),
                new CommonFetchClient(new WebFetchAdapter()),
                new FetchInterceptorExecuter([]));
        }

        return null;
    };


}

class TestProxyServiceExecutor extends AbstractProxyServiceExecutor {


    protected requestURLResolver: RequestURLResolver = new SimpleRequestURLResolver();

    protected requestHeaderResolver: RequestHeaderResolver = new SimpleRequestHeaderResolver();


    execute<T extends FeignProxy>(apiService: T, methodName: string, ...args): Promise<any> {


        //解析参数
        const data = args[0] || {};


        const options: FetchOptions = args[1] || {};

        //解析url
        const requestURL = this.requestURLResolver.resolve(apiService, methodName, data);

        //处理请求头
        const headers = this.requestHeaderResolver.resolve(apiService, methodName, options.headers, data);

        //获取请求template
        const restTemplate = this.getTemplate(apiService.feign);


        //解析参数生成 options，并提交请求
        return restTemplate.fetch({
            ...options,
            url: requestURL,
            headers,
            data: data
        });
    }


}

describe("test proxy api service", () => {

    const restTemplate: RestTemplateLoader = new TestRestTemplateLoader();

    const proxyServiceExecutor: ProxyServiceExecutor = new TestProxyServiceExecutor(restTemplate);

    const es6PoxyServiceFactory = new Es6PoxyServiceFactory(proxyServiceExecutor);
    //设置代理工厂
    setProxyFactory(es6PoxyServiceFactory);

    test("test", () => {
        logger.debug("TestService", TestService);

        // const testService = new TestService();
        // const proxyService = es6PoxyServiceFactory.factory(testService);
    })
});
