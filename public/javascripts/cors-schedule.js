var CORS_SCHEDULE = [
    {
        round: '0',
        open_bidding_start: 'January 2, 2014, 09:00:00',
        open_bidding_end: 'January 2, 2014, 17:00:00',
        closed_bidding_start: null,
        closed_bidding_end: null
    },
    {
        round: '1A',
        open_bidding_start: 'January 3, 2014, 09:00:00',
        open_bidding_end: 'January 6, 2014, 13:00:00',
        closed_bidding_start: 'January 6, 2014, 13:00:01',
        closed_bidding_end: 'January 6, 2014, 17:00:00'
    },
    {
        round: '1B',
        open_bidding_start: 'January 7, 2014, 09:00:00',
        open_bidding_end: 'January 7, 2014, 15:00:00',
        closed_bidding_start: 'January 7, 2014, 15:00:01',
        closed_bidding_end: 'January 7, 2014, 17:00:00'
    },
    // {
    //     round: '1C',
    //     open_bidding_start: 'August 1, 2013, 09:00:00',
    //     open_bidding_end: 'August 2, 2013, 13:00:00',
    //     closed_bidding_start: 'August 2, 2013, 13:00:01',
    //     closed_bidding_end: 'August 2, 2013, 17:00:00'
    // },
    {
        round: '2A',
        open_bidding_start: 'January 8, 2014, 09:00:00',
        open_bidding_end: 'January 9, 2014, 13:00:00',
        closed_bidding_start: 'January 9, 2014, 13:00:01',
        closed_bidding_end: 'January 9, 2014, 17:00:00'
    },
    {
        round: '2B',
        open_bidding_start: 'January 10, 2014, 09:00:00',
        open_bidding_end: 'January 10, 2014, 15:00:00',
        closed_bidding_start: 'January 10, 2014, 15:00:01',
        closed_bidding_end: 'January 10, 2014, 17:00:00'
    },
    {
        round: '3A',
        open_bidding_start: 'January 13, 2014, 09:00:00',
        open_bidding_end: 'January 13, 2014, 15:00:00',
        closed_bidding_start: 'January 13, 2014, 15:00:01',
        closed_bidding_end: 'January 13, 2014, 17:00:00'
    },
    {
        round: '3B',
        open_bidding_start: 'January 14, 2014, 09:00:00',
        open_bidding_end: 'January 14, 2014, 15:00:00',
        closed_bidding_start: 'January 14, 2014 15:00:01',
        closed_bidding_end: 'January 14, 2014, 17:00:00'
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
    var start = 'Current Round: ';
    for (var i = 0; i < CORS_SCHEDULE.length; i++) {
        var round = CORS_SCHEDULE[i].round;
        if (now_date < toUTC(new Date(CORS_SCHEDULE[i].open_bidding_start))) {
            return 'Next Round: ' + CORS_SCHEDULE[i].round + ' (Open) at ' + CORS_SCHEDULE[i].open_bidding_start;
        }
        if (now_date >= toUTC(new Date(CORS_SCHEDULE[i].open_bidding_start)) &&
            now_date <= toUTC(new Date(CORS_SCHEDULE[i].open_bidding_end))) {
            round += ' (Open)';
            return start + round + ' till ' + CORS_SCHEDULE[i].open_bidding_end;
        }
        if (CORS_SCHEDULE[i].open_bidding_start) {
            if (now_date >= toUTC(new Date(CORS_SCHEDULE[i].closed_bidding_start)) &&
                now_date <= toUTC(new Date(CORS_SCHEDULE[i].closed_bidding_end))) {
                round += ' (Closed)';
                return start + round + ' till ' + CORS_SCHEDULE[i].closed_bidding_end;
            }
        }
    }
}

var curr_date = Date.now();
$('.current-round').html(determineRound(curr_date));
