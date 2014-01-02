var YES = 'YES';
var NO = 'NO'
var SOMEWHAT = 'SW';

var individual_questions = 
[{
	question: 'Floor is clutter free?',
	options: [YES, SOMEWHAT, NO]
},
{
	question: 'Table is dust free?',
	options: [YES, SOMEWHAT, NO]
},
{
	question: 'Rubbish bin is emptied?',
	options: [YES, NO]
},
{
	question: 'Bedsheet on mattress?',
	options: [YES, NO]
},
{
	question: 'Bed made and free of clutter?',
	options: [YES, SOMEWHAT, NO]
},
{
	question: 'Clean clothes in cupboard?',
	options: [YES, NO]
},
{
	question: 'Dirty laundry properly organised?',
	options: [YES, NO]
}
];

var room_questions = 
[{
	question: 'Floor is dust free?',
	options: [YES, SOMEWHAT, NO]
},
{
	question: 'Door can be opened fully?',
	options: [YES, NO]
},
{
	question: 'Shoes on the shoe rack?',
	options: [YES, SOMEWHAT, NO]
},
{
	question: 'Corridor free of clutter?',
	options: [YES, NO]
}
];

var common_area_questions = 
[{
	section: 'Shower Stall',
	questions: [{
		question: 'Shower stall is clean?',
		options: [YES, SOMEWHAT, NO]
	}]
},
{
	section: 'Toilet Cubicle',
	questions: [{
		question: 'Toilet bowl is free from stains?',
		options: [YES, SOMEWHAT, NO]
	},
	{
		question: 'Toilet seat is clean?',
		options: [YES, NO]
	},
	{
		question: 'Free of toilet roll cores?',
		options: [YES, NO]
	}
	]
},
{
	section: 'Wash Area',
	questions: [{
		question: 'Pole rack in wash area?',
		options: [YES, NO]
	},
	{
		question: 'Shelf is free of stains?',
		options: [YES, NO]
	},
	{
		question: 'Sinks are clean?',
		options: [YES, NO]
	},
	{
		question: 'Wash area floor is free of rubbish?',
		options: [YES, NO]
	},
	{
		question: 'Wash area floor is free of clutter?',
		options: [YES, NO]
	}
	]
}
]