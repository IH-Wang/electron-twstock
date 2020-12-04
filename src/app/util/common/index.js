export const delay = (time) =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	});

export const toCurrency = (num) => {
	let parts = num.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
};
