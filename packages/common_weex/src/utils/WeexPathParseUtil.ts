/**
 * weex路径解析
 * 支持相对地址和绝对地址的写法
 */
export default class WeexPathParseUtil {


    private constructor() {
    }

    /**
     * 获取native 下的go to url
     * @param targetURL 目标url
     * @return {string}
     */
    static getNativeGoToURL = (targetURL: string) => {

        const bundleUrl = weex.config.bundleUrl;

        const array = bundleUrl.split("://");  //分割bundleUrl
        let path = array.pop();                //弹出最后一个url
        let root = array.join("://") + "://";  //根路径

        return WeexPathParseUtil.getTargetURL(targetURL, root, path);
    };

    /**
     * 获取 web下的go to url
     * @param targetURL
     * @return {string}
     */
    static getWebGoToURL = (targetURL: string) => {
        const bundleUrl = window.location.href;
        const urls = bundleUrl.split("#");
        const root = urls[0];
        let path = urls[1];
        return WeexPathParseUtil.getTargetURL(targetURL, root, path);
    };


    /**
     * 获取目标的页面的url
     * @param targetURL
     * @param root
     * @param path
     */
    private static getTargetURL(targetURL: string, root: string, path: string) {
        let newURL = "";
        if (targetURL.indexOf("/") === 0) {
            //是否为根路径
            newURL = root + targetURL;
        } else {
            if (path === "") {
                path = "/"
            }

            let s = path.split("?")[0].split("/");
            s.pop();   //强制移除数组最后一个元素
            let array = targetURL.split("/");
            array.forEach((item, index) => {
                if (item.trim() === "..") {
                    s.pop();
                } else {
                    s.push(item);
                }
            });
            newURL = root + s.join("/");
        }
        return newURL;
    }
}

