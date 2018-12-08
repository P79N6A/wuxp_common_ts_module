import {SyncAuthHelper} from "../src/interceptor/default/NeedAuthInterceptor";
import {FetchOptions, FetchResponse} from "../src/fetch/FetchOptions";
import * as log4js from "log4js";

const logger = log4js.getLogger();
logger.level = 'debug';

interface Member {

    id: number;

    token: string;
}

class LockExecutor {

    protected lockTask: Promise<Member>;

    execute = (): Promise<Member> => {

        if (this.lockTask == null) {
            this.lockTask = new Promise<Member>((resolve, reject) => {

                //模拟网络请求
                setTimeout(() => {
                    resolve({
                        id: Math.random() * 200,
                        token: Math.random() * 200 + ""
                    })
                }, 3 * 1000)
            });
        }

        return new Promise((resolve, reject) => {
            console.log("等待锁释放->");
            //等待锁释放
            this.lockTask.then(resolve).catch(reject);
        });
    };

}

class TestSyncAuthHelper implements SyncAuthHelper<Member> {

    protected lockExecutor: LockExecutor;

    protected member: Member = {
        id: 0,
        token: "0"
    };

    isToAuthView: (data: FetchResponse) => Promise<boolean>;

    lockExecute = (): Promise<Member> => {
        return this.lockExecutor.execute();
    };

    async requestParamsEnhance(params: FetchOptions): Promise<boolean> {

        const flag = parseInt(Math.random() * 100 + "") % 2;
        if (this.member.id == flag) {
            if (this.lockExecutor == null) {
                this.lockExecutor = new LockExecutor();
            }
            //锁定执行
            this.member = await this.lockExecute();
            //释放执行器
            this.lockExecutor = null;
        }
        logger.debug("this.member.id", this.member.id);
        logger.debug("fetch options", params);

        params.data = this.member;
        return true;
    };

    unLock: () => Promise<Member>;

}

describe("sync auth helper test", () => {

    const syncAuthHelper: SyncAuthHelper = new TestSyncAuthHelper();

    test("auth test", async () => {
        const time = new Date().getTime();
        logger.debug("开始时间", time);
        const options = [
            {
                url: "0"
            },
            {
                url: "1"
            },
            {
                url: "2"
            },
            {
                url: "3"
            },
            {
                url: "4"
            }
        ];
        syncAuthHelper.requestParamsEnhance(options[0] as any).then(() => {
            logger.debug("options[0]", options[0]);
        });

        syncAuthHelper.requestParamsEnhance(options[1] as any).then(() => {
            logger.debug("options[0]", options[1]);
        });

        syncAuthHelper.requestParamsEnhance(options[2] as any).then(() => {
            logger.debug("options[0]", options[2]);
        });

        syncAuthHelper.requestParamsEnhance(options[3] as any).then(() => {
            logger.debug("options[0]", options[3]);
        });

        await syncAuthHelper.requestParamsEnhance(options[4] as any).then(() => {
            logger.debug("options[0]", options[4]);
        });

        let endTime = new Date().getTime();
        logger.debug("结束时间", endTime);
        logger.debug("耗时", (endTime - time) / 1000);


    }, 20 * 1000);
});