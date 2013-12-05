
/*
 * GET home page.
 */

module.exports = {
	index: function(req, res){
 		res.render('index', { title: 'Corspedia' });
	},
	about: function(req, res) {
		res.render('about', { title: 'About - Corspedia' });	
	}
}