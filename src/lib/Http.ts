//React.SetStateAction<any>
const Http = async (api_url: string, data: any = {}, method: 'GET' | 'POST'  = 'POST', setState?: (data: any) => void, headers?: any,  content_type: 'json' = 'json'): Promise<any> => {

	try {
		let params_post: any = {};
		let params = "";


		if (method === 'POST' ) {

			/**
			 * Only Required Raw Data
			 */
			params_post = { body: data ? JSON.stringify(data) : undefined };
 

		} else if (method === 'GET') {
			params = "?"
			Object.keys(data).forEach((key) => {
				if (data[key])
					params += key + "=" + data[key] + "&";
			})
		}


		console.log(headers)
		//credentials: "include",
		const res = await fetch(api_url + params, { method: method, ...params_post, headers: headers });


		const json = await res.json();


		if (process.env.NODE_ENV !== 'production') {
			console.log('send data: ', api_url, 'type:', content_type, params, method, data)
			console.log("Response: ", json);
		}

		if (json.cause) {
			json.success = false;
			json.message = JSON.stringify(json.cause.details);
		}

		if (setState) {
			return setState(json)
		} else
			return json;

	} catch (err) {
		if (process.env.NODE_ENV !== 'production') {
			console.log("Http 82: ", err)
		}
		throw new Error(' Se ha perdido Conexion al Servidor ')
		//return null;
	}

}


export default Http;
