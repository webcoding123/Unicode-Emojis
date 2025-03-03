let emojisToShow;

function getSelectSearchState() {
	// Get Group Select state
	ssQuery.groupId = parseInt(selectGroup.value);
	// Get Subgroup Select state
	ssQuery.subgroupId = parseInt(selectSubgroup.value);
	// Get Sequence Select state
	ssQuery.sequenceId = parseInt(selectSequence.value);
	// Get Search string
	ssQuery.searchStr = searchInput.value.trim();
	// Get Search option
	ssQuery.searchNames = searchNames.checked;
	ssQuery.searchHex = searchHex.checked;
	ssQuery.searchEmojiSymbols = searchEmojiSymbols.checked;
}

function updateEmojisDisplay(event) {

	// First - hide all emojis

	const allEmojiElements = document.querySelectorAll('.emojisWrapper span');
	allEmojiElements.forEach(el => el.style.display = 'none');

	// Next determine what to show

	emojisToShow = arrNumToId;	// Array of emojis IDs to show (in the beginning - show all)

	// Get current handles of search and selection

	getSelectSearchState();

	// Reset Search selection

	if (ssQuery.resetSearch) {
		ssQuery.searchStr = '';
		ssQuery.searchNames = true;
		ssQuery.searchHex = false;
		ssQuery.searchEmojiSymbols = false;
		searchInput.value = '';
		searchNames.checked = true;
		ssQuery.resetSearch = false;
	}	

	// Make Search selection

	let searchIn = 'names';
	if (ssQuery.searchHex) {
		searchIn = 'hex';
	} else if (ssQuery.searchEmojiSymbols) {
		searchIn = 'emojisymbols';
	}
	makeSearch(ssQuery.searchStr, searchIn);

	// Reset All Select

	if (ssQuery.resetSelect) {
		ssQuery.groupId = -1;
		ssQuery.subgroupId = -1;
		ssQuery.sequenceId = -1;
		selectGroup.value = -1;
		selectSubgroup.value = -1;
		selectSequence.value = -1;
		ssQuery.resetSelect = false;
	}

	// Make Group selection

	makeGroupSelect(ssQuery.groupId, ssQuery.subgroupId);

	// Make Subgroup selection

	makeSubgroupSelect(ssQuery.groupId, ssQuery.subgroupId);

	// Make Sequence selection

	makeSequenceSelect(ssQuery.sequenceId);

	// Show what left

	emojisToShow.forEach(id => document.getElementById(id).style.display = 'inline-block'
	);
}