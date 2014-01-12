var YES = 'YES';
var NO = 'NO'
var SOMEWHAT = 'SW';

var mandatory_questions = [{
	question: 'createdAt',
	order: 0.1
},
{
	question: 'Cluster mentor',
	order: 0.2
},
{
	question: 'Room',
	order: 0.3
},
]

var individual_questions = 
[{
	question: 'Floor is clutter free?',
	options: [YES, SOMEWHAT, NO],
	order: 1.1
},
{
	question: 'Table is dust free?',
	options: [YES, SOMEWHAT, NO],
	order: 1.2
},
{
	question: 'Rubbish bin is emptied?',
	options: [YES, NO],
	order: 1.3
},
{
	question: 'Bedsheet on mattress?',
	options: [YES, NO],
	order: 1.4
},
{
	question: 'Bed made and free of clutter?',
	options: [YES, SOMEWHAT, NO],
	order: 1.5
},
{
	question: 'Clean clothes in cupboard?',
	options: [YES, NO],
	order: 1.6
},
{
	question: 'Dirty laundry properly organised?',
	options: [YES, NO],
	order: 1.7
}
];

var room_questions = 
[{
	question: 'Floor is dust free?',
	options: [YES, SOMEWHAT, NO],
	order: 2.1
},
{
	question: 'Door can be opened fully?',
	options: [YES, NO],
	order: 2.2
},
{
	question: 'Shoes on the shoe rack?',
	options: [YES, SOMEWHAT, NO],
	order: 2.3
},
{
	question: 'Corridor free of clutter?',
	options: [YES, NO],
	order: 2.4
}
];

var common_area_questions = 
[{
	section: 'Shower Stall',
	questions: [{
		question: 'Shower stall is clean?',
		options: [YES, SOMEWHAT, NO],
		order: 3.1
	}]
},
{
	section: 'Toilet Cubicle',
	questions: [{
		question: 'Toilet bowl is free from stains?',
		options: [YES, SOMEWHAT, NO],
		order: 3.2
	},
	{
		question: 'Toilet seat is clean?',
		options: [YES, NO],
		order: 3.3
	},
	{
		question: 'Free of toilet roll cores?',
		options: [YES, NO],
		order: 3.4
	}
	]
},
{
	section: 'Wash Area',
	questions: [{
		question: 'Pole rack in wash area?',
		options: [YES, NO],
		order: 3.5
	},
	{
		question: 'Shelf is free of stains?',
		options: [YES, NO],
		order: 3.6
	},
	{
		question: 'Sinks are clean?',
		options: [YES, NO],
		order: 3.7
	},
	{
		question: 'Wash area floor is free of rubbish?',
		options: [YES, NO],
		order: 3.8
	},
	{
		question: 'Wash area floor is free of clutter?',
		options: [YES, NO],
		order: 3.9
	}
	]
}
];

function sanitizeQuestion(question) {
	return question.replace(/ /g, "_").replace(/\?/g, "");
}