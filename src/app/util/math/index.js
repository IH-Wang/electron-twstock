export const numRound = (number, round) => {
	const pow = Math.pow(10, round);
	return Math.round(number * pow) / pow;
};
export const numCeil = (number, round) => {
	const pow = Math.pow(10, round);
	return Math.ceil(number * pow) / pow;
};
export const numFloor = (number, round) => {
	const pow = Math.pow(10, round);
	return Math.floor(number * pow) / pow;
};
