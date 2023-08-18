export function paramReplacing(str: string, params: string[] | undefined) {
	if (!params) return str;

	params.forEach((param, i) => {
		const regex = `\\$_${i}`;
		const re = new RegExp(regex, "g");
		str = str.replace(re, param);
	});

	return str;
}