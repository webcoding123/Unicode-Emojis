// Data for searching

const bigDataElement = document.querySelector('.bigData');
const arrNumToId = JSON.parse(bigDataElement.getAttribute('arrnumtoidjson'));
const arrNumToName = JSON.parse(bigDataElement.getAttribute('arrnumtonamejson'));
const arrNumToEmojiSymbol = JSON.parse(bigDataElement.getAttribute('arrnumtoemojisymboljson'));

function makeSearch(str, searchIn) {
	if (!str) {
		return;
	}
	if (searchIn == 'names') {
		emojisToShow = emojisToShow.filter((id, index) => arrNumToName[index].indexOf(str) !== -1
		);
	} else if (searchIn == 'hex') {
		emojisToShow = emojisToShow.filter((id, index) => arrNumToId[index].indexOf(str.toUpperCase()) !== -1
		);
	} else {
		emojisToShow = emojisToShow.filter((id, index) => arrNumToEmojiSymbol[index].indexOf(str) !== -1
		);
	}
}