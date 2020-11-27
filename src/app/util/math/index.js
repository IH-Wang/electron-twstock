export const numRound = (number, round) => {
	const pow = Math.pow(10, round);
	return Math.round(number * pow) / pow;
};
