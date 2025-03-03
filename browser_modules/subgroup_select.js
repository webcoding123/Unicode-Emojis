// Data for subgroup selecting

const groupIdToSubgroupIdToEmojiId = JSON.parse(bigDataElement.getAttribute('groupidtosubgroupidtoemojiid'));

function makeSubgroupSelect(groupId, subgroupId) {
	if (subgroupId == -1) {
		return;
	}
	emojisToShow = emojisToShow.filter(id => groupIdToSubgroupIdToEmojiId[groupId][subgroupId].indexOf(id) !== -1
	);
}