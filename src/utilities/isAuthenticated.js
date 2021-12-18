
export default function isAuhenticated (type) {
	let url = `${window.BASE_URL}/${type}/isAuthenticated`
	let option = {
		credentials: "include",
	}


	/**Check is the request is authenticated**/
	return (
		fetch(url, option)
		.then((res) => res.json())
		.then((res) => {
			if(res.success === true) return true;
			else return false;
		})
	);
}