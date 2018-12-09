import {AbstractRestTemplateLoader, RestTemplateLoader} from "../src/template/RestTemplateLoader";
import {defaultApiModuleName} from "../src/constant/FeignConstVar";
import DefaultRestTemplate from "../src/template/DefaultRestTemplate";
import DefaultApiRoutingStrategy from "../src/route/DefaultApiRoutingStrategy";
import DefaultFetchClient from "../src/fetch/DefaultFetchClient";
import WebFetchAdapter from "../src/adapter/web/WebFetchAdapter";
import FetchInterceptorExecutor from "../src/interceptor/FetchInterceptorExecutor";
import {AbstractProxyServiceExecutor, ProxyServiceExecutor} from "../src/proxy/executor/ProxyServiceExecutor";
import Es6PoxyServiceFactory from "../src/proxy/factory/Es6PoxyServiceFactory";
import TestService from "./TestService";
import {setProxyFactory} from "../src/annotations/Feign";
import * as log4js from "log4js";
import SimpleRequestURLResolver from "../src/resolve/url/SimpleRequestURLResolver";
import {FetchOptions} from "../src/FetchOptions";
import {RequestURLResolver} from "../src/resolve/url/RequestURLResolver";
import {RequestHeaderResolver} from "../src/resolve/header/RequestHeaderResolver";
import SimpleRequestHeaderResolver from "../src/resolve/header/SimpleRequestHeaderResolver";
import {FeignProxy} from "../src/proxy/feign/FeignProxy";
import DefaultProxyServiceExecutor from "../src/proxy/executor/DefaultProxyServiceExecutor";

const logger = log4js.getLogger();
logger.level = 'debug';


const routingMapping = {};

class TestRestTemplateLoader extends AbstractRestTemplateLoader {


    buildRestTemplate = (apiModuleName: string) => {
        if (apiModuleName === defaultApiModuleName) {

            return new DefaultRestTemplate({}, new DefaultApiRoutingStrategy(routingMapping),
                new DefaultFetchClient(new WebFetchAdapter()),
                new FetchInterceptorExecutor([]));
        }

        return null;
    };


}

class TestProxyServiceExecutor extends DefaultProxyServiceExecutor {
}

describe("test proxy api service", () => {

    const restTemplate: RestTemplateLoader = new TestRestTemplateLoader();

    const proxyServiceExecutor: ProxyServiceExecutor = new TestProxyServiceExecutor(restTemplate);

    const es6PoxyServiceFactory = new Es6PoxyServiceFactory(proxyServiceExecutor);
    //设置代理工厂
    setProxyFactory(es6PoxyServiceFactory);

    test("test", () => {
        logger.debug("TestService", TestService);


        const testService = new TestService();

        // const proxyService = es6PoxyServiceFactory.factory(testService);
    })
});
