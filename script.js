const emojisWrapper = document.querySelector('.emojisWrapper');
const emojiPopup = document.querySelector('.emojiPopup');
const emojiPopupSymbol = document.querySelector('.emojiPopupSymbol');
const emojiPopupClose = document.querySelector('.emojiPopup span');
const overlay = document.querySelector('.overlay');

// Click emoji - show emoji data

emojisWrapper.addEventListener('click', function(event) {
	if (event.target.tagName == 'SPAN') {	
		const emojiJson = JSON.parse(event.target.getAttribute('json'));
		const emojiArr = [];
		emojiArr[0] = {
			key: 'name', 
			value: emojiJson.name
		};
		emojiArr[1] = {
			key: 'group', 
			value: emojiJson.group
		};
		emojiArr[2] = {
			key: 'subgroup', 
			value: emojiJson.subgroup
		};
		emojiArr[3] = {
			key: 'sequence', 
			value: emojiJson.sequence
		};
		emojiArr[4] = {
			key: 'code(s) hex', 
			value: emojiJson.codePointsArr.join(', ')
		};
		emojiArr[5] = {
			key: 'code(s) decimal', 
			value: emojiJson.codePointsArr
				.map(el => parseInt(el, 16).toString())
				.join(', ')
		};
		emojiArr[6] = {
			key: 'status', 
			value: emojiJson.status
		};

		const emojiTable = emojiPopup.getElementsByTagName('table')[0];
		emojiTable.textContent = '';
		for (const element of emojiArr) {
			const tr = document.createElement('tr');
			const tdKey = document.createElement('td');
			tdKey.textContent = element.key;
			tr.append(tdKey);
			const tdValue = document.createElement('td');
			tdValue.textContent = element.value;
			tr.append(tdValue);
			emojiTable.append(tr);
		}
		emojiPopupSymbol.textContent = event.target.textContent;
		emojiPopup.style.display = 'block';
		document.body.classList.add('no_scroll');
		overlay.style.display = 'block';
	}
});

// Close pop-up

[emojiPopupClose, overlay].forEach(el => {
	el.addEventListener('click', function(event) {
		emojiPopup.style.display = 'none';
		document.body.classList.remove('no_scroll');
		overlay.style.display = 'none';
	});
});

// Emoji copy

const emojiCopyImg = document.querySelector('.emojiPopupSymbolOuter img');
const emojiCopyTooltip = document.querySelector('#copy_tooltip');
emojiCopyImg.addEventListener('mouseover', event => 
	emojiCopyTooltip.style.visibility = 'visible');
emojiCopyImg.addEventListener('mouseleave', event => 
	emojiCopyTooltip.style.visibility = 'hidden');
emojiCopyImg.addEventListener('click', event => writeToClipboard(emojiPopupSymbol.textContent.trim()));

async function writeToClipboard(text) {
	try {
		await navigator.clipboard.writeText(text);
		emojiCopyTooltip.textContent = 'Copied!';
		setTimeout(() => emojiCopyTooltip.textContent = 'Copy', 3000);
	} catch (error) {
		console.error(error.message);
	}
}

// Search and Select query

const ssQuery = {
	searchStr: '',
	searchNames: true,
	searchHex: false,
	searchEmojiSymbols: false,
	resetSearch: false,
	groupId: -1,
	subgroupId: -1,
	sequenceId: -1,
	resetSelect: false
};
const selectGroup = document.querySelector('#select_group');
const selectSequence = document.querySelector('#select_sequence');
const searchInput = document.querySelector('#searchBlockInput');
const searchNames = document.querySelector('#search_names');
const searchHex = document.querySelector('#search_hex');
const searchEmojiSymbols = document.querySelector('#search_emojisymbols');
const resetSelect = document.querySelector('.resetSelect button');
const search = document.querySelector('.search_button');
const resetSearch = document.querySelector('.reset_search_button');

// Reset Select and Search

searchInput.value = '';
searchNames.checked = true;
selectGroup.value = -1;
selectSubgroup.value = -1;
selectSequence.value = -1;

[
	selectGroup, 
	selectSubgroup, 
	selectSequence
].forEach(el => {
	el.addEventListener('change', event => {
		if (event.target == selectGroup) {
			ssQuery.subgroupId = -1;
			selectSubgroup.value = -1;
		}
		updateEmojisDisplay(event);
	});
});
[
	search, 
	resetSearch, 
	resetSelect
].forEach(el => {
	el.addEventListener('click', event => {
		if (event.target == resetSearch) {
			ssQuery.resetSearch = true;
		} else if (event.target == resetSelect) {
			ssQuery.resetSelect = true;
		}
		updateEmojisDisplay(event);
	});
});