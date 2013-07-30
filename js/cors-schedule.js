var CORS_SCHEDULE = [
    {
        round: '0',
        open_bidding_start: 'July 25, 2013, 09:00:00',
        open_bidding_end: 'July 26, 2013, 17:00:00',
        closed_bidding_start: null,
        closed_bidding_end: null
    },
    {
        round: '1A',
        open_bidding_start: 'July 29, 2013, 09:00:00',
        open_bidding_end: 'July 30, 2013, 13:00:00',
        closed_bidding_start: 'July 30, 2013, 13:00:01',
        closed_bidding_end: 'July 30, 2013, 17:00:00'
    },
    {
        round: '1B',
        open_bidding_start: 'July 31, 2013, 09:00:00',
        open_bidding_end: 'July 31, 2013, 15:00:00',
        closed_bidding_start: 'July 31, 2013, 15:00:01',
        closed_bidding_end: 'July 31, 2013, 17:00:00'
    },
    {
        round: '1C',
        open_bidding_start: 'August 1, 2013, 09:00:00',
        open_bidding_end: 'August 2, 2013, 13:00:00',
        closed_bidding_start: 'August 2, 2013, 13:00:01',
        closed_bidding_end: 'August 2, 2013, 17:00:00'
    },
    {
        round: '2A',
        open_bidding_start: 'August 5, 2013, 09:00:00',
        open_bidding_end: 'August 6, 2013, 13:00:00',
        closed_bidding_start: 'August 6, 2013, 13:00:01',
        closed_bidding_end: 'August 6, 2013, 17:00:00'
    },
    {
        round: '2B',
        open_bidding_start: 'August 7, 2013, 09:00:00',
        open_bidding_end: 'August 7, 2013, 15:00:00',
        closed_bidding_start: 'August 7, 2013, 15:00:01',
        closed_bidding_end: 'August 7, 2013, 17:00:00'
    },
    {
        round: '3A',
        open_bidding_start: 'August 12, 2013, 09:00:00',
        open_bidding_end: 'August 12, 2013, 15:00:00',
        closed_bidding_start: 'August 12, 2013, 15:00:01',
        closed_bidding_end: 'August 12, 2013, 17:00:00'
    },
    {
        round: '3B',
        open_bidding_start: 'August 13, 2013, 09:00:00',
        open_bidding_end: 'August 13, 2013, 15:00:00',
        closed_bidding_start: 'August 13, 2013, 15:00:01',
        closed_bidding_end: 'August 13, 2013, 17:00:00'
    }
];

function toUTC(date) {
    var d = Date.UTC(date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                    date.getMilliseconds());
    return d - (8 * 60 * 60 * 1000);
}

function determineRound(now_date) {
    var start = 'The current round is ';
    for (var i = 0; i < CORS_SCHEDULE.length; i++) {
        var round = CORS_SCHEDULE[i].round;
        if (now_date < toUTC(new Date(CORS_SCHEDULE[i].open_bidding_start))) {
            return 'The next round is ' + CORS_SCHEDULE[i].round + ' Open Bidding at<br/>' + CORS_SCHEDULE[i].open_bidding_start;
        }
        console.log(i + ': ' + toUTC(new Date(CORS_SCHEDULE[i].open_bidding_end)));
        if (now_date >= toUTC(new Date(CORS_SCHEDULE[i].open_bidding_start)) &&
            now_date <= toUTC(new Date(CORS_SCHEDULE[i].open_bidding_end))) {
            round += ' Open Bidding';
            return start + round + ' till<br/>' + CORS_SCHEDULE[i].open_bidding_end;
        }
        if (CORS_SCHEDULE[i].open_bidding_start) {
            if (now_date >= toUTC(new Date(CORS_SCHEDULE[i].closed_bidding_start)) &&
                now_date <= toUTC(new Date(CORS_SCHEDULE[i].closed_bidding_end))) {
                round += ' Closed Bidding';
                return start + round + ' till<br/>' + CORS_SCHEDULE[i].closed_bidding_end;
            }
        }
    }
}

var curr_date = Date.now();
$('.current-round').html(determineRound(curr_date));
