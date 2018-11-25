/**
 * 测试服务
 * @author wxup
 * @create 2018-11-03 9:34
 **/
import {RequestMapping} from "../src/decorator/RequestMapping";
import {ApiFetchClient} from "../src/decorator/ApiFetchClient";

@ApiFetchClient()
class TestService {


    @RequestMapping({url:"/test"})
    testQuery = (evt: any): Promise<any> => {

        return ["id"] as any;
    }
}