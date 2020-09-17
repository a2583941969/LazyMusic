//设置默认端口号
const baseUrl = 'http://localhost:3000/';
//封装一个请求的函数
export const myRequest = (options) => {
	return new Promise((resolve, reject) => {
		let obj = {
			//访问路径
			url: baseUrl + options.url,
			method: options.method,
			data: options.data || {},
			success: res => {
				resolve(res)
			},
			fail: err => {
				reject(err)
			}
		}
		if (options.method === "POST") {
			obj.header = {"Content-Type": "application/x-www-form-urlencoded"}
		}
		uni.request(obj)
	})
}
