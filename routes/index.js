
/*
 * GET home page.
 */

var corsdata = require('../cors-data');

module.exports = {
	index: function(req, res){
 		res.render('index', { title: 'Corspedia - NUS CORS Bidding Archive' });
	},
	about: function(req, res) {
		res.render('about', { title: 'About - Corspedia' });
	},
    catalogue: function(req, res) {
        res.render('catalogue', { title: 'Catalogue - Corspedia' });
    },
	search: function(req, res) {
        var modCode = req.body.modCode;
        var faculty = req.body.faculty;
        var accType = req.body.accType;
        var newStudent = req.body.newStudent;

        // In case of lower letters
        modCode = modCode.toUpperCase();
        faculty = faculty.toUpperCase();

        // Check for validity of Module Code - if Valid, proceed, else return error
        var error_messages = [];
        var code = modCode.match(/[a-zA-Z]{2,3}[\d]{4}[a-zA-Z]{0,1}/);
        if (!code) {
            error_messages.push('Invalid Module Code');
        }

        res.redirect('http://nusmods.com/modules/' + code + '/corspedia');

        if (faculty == '0') {
            error_messages.push('Invalid Faculty');
        }
        if (accType == '0') {
            error_messages.push('Invalid Account Type');
        }

        if (error_messages.length == 0) {
            var url = '/module/' + code + '?fac=' + faculty + '&acc=' + accType + '&new=';
            if (newStudent == "1") {
                url += '1';
            } else {
                url += '0';
            }
            res.redirect(url);
        } else {
        	// If invalid, redirect back to homepage with error messages
	        res.render('index', { 
	        	title: 'Corspedia - NUS CORS Bidding Archive',
	        	error: error_messages.join(', '),
	        	faculty: faculty
	        });
        }
	},	
    results: function(req, res) {
        var modCode = req.query.code;
        var faculty = req.query.fac;
        var accType = req.query.acc;
        var newStudent = req.query.new;

        res.redirect('/module/' + modCode + '?fac=' + faculty + '&acc=' + accType + '&new=' + newStudent);        
    },
    module: function(req, res) {
        var modCode = req.params.code;
        var faculty = req.query.fac;
        var accType = req.query.acc;
        var newStudent = req.query.new;

        // In case of lower letters
        modCode = modCode.toUpperCase();
        faculty = faculty.toUpperCase();

        if (!modCode.match(/[a-zA-Z]{2,3}[\d]{4}[a-zA-Z]{0,1}/) || 
            faculty == '0' || 
            accType == '0') {
            res.redirect('/');
        }
        
        res.redirect('http://nusmods.com/modules/' + modCode + '/corspedia');

        // res.render('results', { 
        //     title: 'Results for ' + modCode,
        //     output_modCode: modCode,
        //     output_faculty: faculty,
        //     output_accType: accType,
        //     output_newStudent: newStudent
        // });
    },
	api: function(req, res) {
        var type = req.params.type;
        if (type == 'module') {
    		var modCode = req.query.code;
            var faculty = req.query.fac;
            var accType = req.query.acc;
            var newStudent = req.query.new;

            modCode = modCode.toUpperCase();
            faculty = faculty.toUpperCase();
            if (!modCode.match(/[a-zA-Z]{2,3}[\d]{4}[a-zA-Z]{0,1}/) || faculty == '0' || accType == '0') {
                res.redirect('/');
            }
        		
            var data = corsdata.extract(modCode, faculty, accType, newStudent);
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        } else if (type == 'catalogue') {
            var data = corsdata.extractModulesCatalogue(modCode, faculty, accType, newStudent);
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        }

	}
}