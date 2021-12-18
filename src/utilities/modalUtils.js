

export function acceptImage(event, setSrc, setFile){
	if(event.target.files !== "" && event.target.files.length !== 0){
		setFile(event.target.files[0]);
		const src = URL.createObjectURL(event.target.files[0]);
		setSrc(src);
		return (src);
	}else{
		return "";
	}
}