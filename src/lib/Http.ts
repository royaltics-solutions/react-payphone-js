//React.SetStateAction<any>
const Http = async (api_url: string, data: any = {}, method: 'GET' | 'POST'  = 'POST', setState?: (data: any) => void, headers?: any): Promise<any> => {

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
 

		//credentials: "include",
		const res = await fetch(api_url + params, { method: method, ...params_post, headers: headers });


		const json = await res.json();

		if (json.cause) {
			json.success = false;
			json.message = JSON.stringify(json.cause.details);
		}

		if (setState) {
			return setState(json)
		} else
			return json;

	} catch (err) {
		throw new Error(' Se ha perdido Conexion al Servidor ')
	}

}


export default Http;
