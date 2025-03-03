// Data for group selecting

const groupIdToEmojiId = JSON.parse(bigDataElement.getAttribute('groupidtoemojiid'));

function makeGroupSelect(groupId, subgroupId) {
	if (groupId == -1) {
		ssQuery.subgroupId = -1;
		selectSubgroup.innerHTML = optionSubgroupBase;
		selectSubgroup.setAttribute('disabled', 'disabled');
		return;
	}
	emojisToShow = emojisToShow.filter(id => groupIdToEmojiId[groupId].indexOf(id) !== -1
	);
	createSubgroupsHtml(groupId, subgroupId);	
}

// Creating subgroups html

const selectBlock = document.querySelector('.selectBlock');
const allSubgroupsNames = JSON.parse(selectBlock.getAttribute('all_subgroups_names'));
const selectSubgroup = document.querySelector('#select_subgroup');
const optionSubgroupBase = selectSubgroup.innerHTML;
function createSubgroupsHtml(groupId, subgroupId) {
	let subgroupHtml = optionSubgroupBase;
	if (groupId != -1) {
		allSubgroupsNames[groupId].forEach((el, i) => subgroupHtml += `<option value='${i}'>${el}</option>`);
	}
	selectSubgroup.innerHTML = subgroupHtml;
	selectSubgroup.value = subgroupId;
	selectSubgroup.removeAttribute('disabled');
}