import {RestTemplateLoader} from "common_fetch/src/template/RestTemplateLoader";
import {ProxyServiceExecutor} from "common_fetch/src/proxy/executor/ProxyServiceExecutor";
import {setProxyFactory} from "common_fetch/src/annotations/Feign";
import Es5PoxyServiceFactory from "common_fetch/src/proxy/factory/Es5PoxyServiceFactory";
import {FetchFeignProxyInitializer} from "weex_starter/src/fetch/FetchFeignProxyInitializer";



export default class DefaultFetchFeignProxyInitializer implements FetchFeignProxyInitializer {

    // RestTemplateLoader class 对象
    public static RestTemplateLoader: any = null;

    // RestTemplateLoader class 对象
    public static ProxyServiceExecutor: any = null;

    protected initStatus: boolean = false;

    init = () => {
        if (this.initStatus) {
            return;
        }
        this.initStatus = true;

        const restTemplate: RestTemplateLoader = new DefaultFetchFeignProxyInitializer.RestTemplateLoader();

        const proxyServiceExecutor: ProxyServiceExecutor = new DefaultFetchFeignProxyInitializer.ProxyServiceExecutor(restTemplate);

        const es6PoxyServiceFactory = new Es5PoxyServiceFactory(proxyServiceExecutor);

        //设置代理工厂
        setProxyFactory(es6PoxyServiceFactory);
    }


}