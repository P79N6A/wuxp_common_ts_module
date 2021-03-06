import {RequestHeaderResolver} from "./RequestHeaderResolver";
import {MatchRuleResolver} from "../match/MatchRuleResolver";
import DefaultMatchRuleResolver from "../match/DefaultMatchRuleResolver";
import {FeignProxy} from "../../proxy/feign/FeignProxy";


/**
 * 简单的请求头解析者
 * 通过服务接口实例和服务方法名称以及注解的配置生成请求头
 */
export default class SimpleRequestHeaderResolver implements RequestHeaderResolver {

    private matchRuleResolver: MatchRuleResolver;


    constructor(matchRuleResolver?: MatchRuleResolver) {
        this.matchRuleResolver = matchRuleResolver || new DefaultMatchRuleResolver();
    }

    resolve = (apiService: FeignProxy, methodName: string, headers: HeadersInit, data: object): HeadersInit => {

        const apiServiceConfig = apiService.getServiceMethodConfig(methodName);
        if (apiServiceConfig.requestMapping == null || apiServiceConfig.requestMapping.headers == null) {
            return headers;
        }

        const configHeaders = apiServiceConfig.requestMapping.headers;

        const newHeaders = {
            ...(headers || {})
        };
        //合并headers
        for (const key in configHeaders) {
            newHeaders[key] = this.matchRuleResolver.resolve(configHeaders[key], data);
        }

        //返回新的请求头
        return newHeaders;
    };


}