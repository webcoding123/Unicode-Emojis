import {
	open, 
	writeFile, 
	readFile
} from 'node:fs/promises';
import {
	parsingUnicodeEmojisFile,
	allGroupsNames,
	allSubgroupsNames,
	allSequenceNames,
	emojis,
	emojisZwj,
	allSequencesTotals,
	allGroupsTotals
} from './node_modules/parsing.mjs';

// Parsing unicode files

const unicodeFileNames = [
	'./unicode_files/emoji-test.txt',
	'./unicode_files/emoji-zwj-sequences.txt'
];

for (const unicodeFileName of unicodeFileNames) {
	try {
		await parsingUnicodeEmojisFile(unicodeFileName);
	} catch(error) {
		console.error(error.message);
	}
}

// Checking total and subtotal

const totalEmojisFactual = emojis.length;
const totalEmojisZwjFactual = emojisZwj.length;
const totalInGroupsProjecting = allGroupsTotals.reduce((a, c) => a + c);
const totalInSequencesProjecting = allSequencesTotals.reduce((a, c) => a + c);
if (totalInGroupsProjecting !== totalEmojisFactual ||
	totalEmojisZwjFactual !== totalInSequencesProjecting) {
	console.log('Warning! Total emojis numbers does not equal.');
	console.log('Total emojis factual: ', totalEmojisFactual);
	console.log('All groups totals projecting: ', allGroupsTotals);
	console.log('Total in groups projecting: ', totalInGroupsProjecting);
	console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!');
	console.log('Total emojis ZWJ factual: ', totalEmojisZwjFactual);
	console.log('All sequences totals projecting: ', allSequencesTotals);
	console.log('Total in sequences projecting: ', totalInSequencesProjecting);
}

// Test for uniqueness

const emojesIdsSet = new Set();
emojis.forEach(function(emojiItem) {	
	let emojiItemId = emojiItem.codePointsArr.join('_');
	emojesIdsSet.add(emojiItemId);
});
if (totalEmojisFactual !== emojesIdsSet.size) {
	console.log('Warning! Possible doubles in emojis array.');
}
const emojesZwjIdsSet = new Set();
emojisZwj.forEach(function(emojiItem) {	
	let emojiItemId = emojiItem.codePointsArr.join('_');
	emojesZwjIdsSet.add(emojiItemId);
});
if (totalEmojisZwjFactual !== emojesZwjIdsSet.size) {
	console.log('Warning! Possible doubles in emojis zwj array.');
}

// Mapping emojis and emojisZwj

let totalMappings = 0;
emojisZwj.forEach(elZwj => {
	const found = emojis.find(elEmo => elZwj.codePointsStr === elEmo.codePointsStr);
	if (found) {
		found.sequence = elZwj.sequence;
		found.sequenceId = elZwj.sequenceId;
		totalMappings++;
	}
	
});
if (totalMappings !== totalEmojisZwjFactual) {
	console.log('Warning! Total mappings not equal total emojis zwj.');
}

// Emoji popup html

let emojiPopupHtml = '';
try {
	emojiPopupHtml = await readFile('./html_blocks/emojiPopup.html', 'utf8');
} catch(error) {
	console.error(error.message);
}

// Search block html

let searchBlockHtml = '';
try {
	searchBlockHtml = await readFile('./html_blocks/searchBlock.html', 'utf8');
} catch(error) {
	console.error(error.message);
}

// SELECT BLOCK HTML

// Groups	
let selectGroupHtml = '<option value="-1">-- Choose a group --</option>';
allGroupsNames.forEach((g, i) => selectGroupHtml += `<option value="${i}">${g}</option>`);
// Subgroups
let selectSubgroupHtml = '<option value="-1">-- Choose a subgroup --</option>';

// Sequences
let selectSequenceHtml = '<option value="-1">-- Choose a sequence --</option>';
allSequenceNames.forEach((s, i) => selectSequenceHtml += `<option value="${i}">${s}</option>`);

const selectBlockHtml = `
	<div class='ssBlock selectBlock' all_subgroups_names='${JSON.stringify(allSubgroupsNames)}'>
		<h2>Select</h2>
		<div class='gSelectBlock'>
			<label for='select_group'>Select group: </label>
			<select id='select_group'>${selectGroupHtml}</select>
		</div>
		<div class='sgSelectBlock'>
			<label for='select_subgroup'>Select subgroup: </label>
			<select id='select_subgroup' disabled='enabled'>${selectSubgroupHtml}</select>
		</div>
		<div class='sSelectBlock'>
			<label for='select_sequence'>Select sequence: </label>
			<select id='select_sequence'>${selectSequenceHtml}</select>
		</div>
		<div class='resetSelect'>
			<button>Reset</button>
		</div>
	</div>		
`;


// All emojis html

let allEmojisHtml = '';
let emojiHtml;

// Arrays for searching

const arrNumToId = [];
const arrNumToName = [];
const arrNumToEmojiSymbol = [];

// Arrays for group and subgroup selecting

const groupIdToEmojiId = [];
allGroupsNames.forEach(() => {
	groupIdToEmojiId.push([]);
});
const groupIdToSubgroupIdToEmojiId = [];
allSubgroupsNames.forEach(group => {
	const length = groupIdToSubgroupIdToEmojiId.push([]);
	group.forEach(() => {
		groupIdToSubgroupIdToEmojiId[length - 1].push([]);
	});
});

// Array for sequence selecting

const sequenceIdToEmojiId = [];
allSequenceNames.forEach(() => {
	sequenceIdToEmojiId.push([]);
});

emojis.forEach(function(emojiItem) {	
	let emojiItemId = emojiItem.codePointsArr.join('_');
	const codePointsArr0x = emojiItem.codePointsArr.map(el =>'0x' + el);
	const emojiSymbol = String.fromCodePoint.apply(null, codePointsArr0x);
	emojiHtml = `
		<span group='${emojiItem.groupId}' id='${emojiItemId}' json='${JSON.stringify(emojiItem, ['name', 'group', 'subgroup', 'sequence', 'codePointsArr', 'status'])}'>
			${emojiSymbol}
		</span>`;
	allEmojisHtml += emojiHtml;

	// For searching
	arrNumToId.push(emojiItemId);
	arrNumToName.push(emojiItem.name);
	arrNumToEmojiSymbol.push(emojiSymbol);
	// For group selecting
	groupIdToEmojiId[emojiItem.groupId].push(emojiItemId);
	// For subgroup selecting
	groupIdToSubgroupIdToEmojiId[emojiItem.groupId][emojiItem.subgroupId].push(emojiItemId);
	// For sequence selecting
	if (emojiItem.sequenceId != -1) {
		sequenceIdToEmojiId[emojiItem.sequenceId].push(emojiItemId);
	}
});

// Body html

let bodyHtml = `
	<!doctype html>
	<html lang='en'>
		<head>
			<meta charset='utf-8'>
			<meta name='viewport' content='width=device-width, initial-scale=1'>
			<link rel='icon' href='favicon.svg' sizes='any' type='image/svg+xml'>
			<link rel='stylesheet' href='css/style.css'>
			<script src='browser_modules/search.js' defer></script>
			<script src='browser_modules/group_select.js' defer></script>
			<script src='browser_modules/subgroup_select.js' defer></script>
			<script src='browser_modules/sequence_select.js' defer></script>
			<script src='browser_modules/update_search_select.js' defer></script>
			<script src='script.js' defer></script>
		</head>
		<body>
			<h1>Unicode emojis</h1>
			<div class='search_select_group'>
				${selectBlockHtml}
				${searchBlockHtml}
			</div>
			<div class='emojisWrapper'>
				${allEmojisHtml}
			</div>
			${emojiPopupHtml}
			<div class='overlay'></div>
			<br 
				class='bigData'  
				arrnumtoidjson='${JSON.stringify(arrNumToId)}' 
				arrnumtonamejson='${JSON.stringify(arrNumToName)}'
				groupidtoemojiid='${JSON.stringify(groupIdToEmojiId)}' 
				groupidtosubgroupidtoemojiid='${JSON.stringify(groupIdToSubgroupIdToEmojiId)}'
			    sequenceidtoemojiid='${JSON.stringify(sequenceIdToEmojiId)}'
			    arrnumtoemojisymboljson='${JSON.stringify(arrNumToEmojiSymbol)}'
			>
		</body>
	</html>
`;

// Write html to file

try {
	await writeFile('index.html', bodyHtml);
} catch(error) {
	console.error(error.message);
}