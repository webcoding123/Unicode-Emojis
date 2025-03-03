// Data for sequence selecting

const sequenceIdToEmojiId = JSON.parse(bigDataElement.getAttribute('sequenceidtoemojiid'));

function makeSequenceSelect(sequenceId) {
	if (sequenceId == -1) {
		return;
	}
	emojisToShow = emojisToShow.filter(id => sequenceIdToEmojiId[sequenceId].indexOf(id) !== -1
	);
}