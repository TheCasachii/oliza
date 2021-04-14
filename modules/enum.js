
function Enum(...items) {
	let res = {};
	items.forEach((value, idx) => res[value] = idx);
	return res;
}

module.exports = Enum;