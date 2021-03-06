/**
 * EquationController
 *
 * @description :: Server-side logic for managing Equations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {
	
	/**
	* Upload HTML5 and convert all equations to mathml.
	*/
	upload: function  (req, res) {
		//We need to know what kind of output you want.
		if (typeof(req.param('outputFormat')) == "undefined" || !req.param('outputFormat') in ['svg', 'png', 'description', 'mml']) {
			return res.badRequest("Please specify output format.");	
		}
		var options = {};
		req.file('html5').upload(function (err, files) {
			
            if (err) {
	        	console.log(err);
			  	return res.badRequest(err);
		    }
			if (typeof(files[0]) == "undefined") {
				return res.badRequest("Please specify HTML5 file.");
			} 
            var html5 = files[0];
            var fs = require("fs");
            var path = require("path");
            if (path.extname(html5.filename) != ".html") {
                return res.badRequest("Only html files are supported.");
            }
	        

	        //Save HTML5. 
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            Html5.create({
            			source: fs.readFileSync(html5.fd), 
            			filename: html5.filename, 
            			outputFormat: req.param('outputFormat'),
            			status: 'accepted',
                        submittedBy: req.user,
                        ip_address: ip}).exec(function(err, dbHtml5) {
                if (err) {
                    console.log(err);
                    return res.badRequest(err);
                }
                //Submit job request.
                QueueService.submitHTML5ConversionJob(dbHtml5, function(err) {
                	if (typeof(err) != "undefined") {
                		console.log(err);
                		return res.badRequest(err);
                	}
                	res.accepted(dbHtml5);	
                });
            });
	    });
  	},

  	find: function(req, res) {
		var html5Id = req.param('id');
		Html5.findOne({ id: html5Id }).exec(function (err, html5) {
			if (err) {
				console.log(err);
				return res.badRequest(err);
			} 
			if (typeof(html5) != "undefined") {
                if (req.wantsJSON) {
                    res.json(html5);
                } else {
                    return res.redirect("#/html5/" + html5.id);
                }
			} else {
				res.notFound();
			}
		});
	},

	equations: function(req, res) {
		var html5Id = req.param('id');
		Equation.find({ html5: html5Id }).populate('components').exec(function(err, equations) {	
			if (err) return res.badRequest(err);
			res.json(equations);
		});
	},

	downloadSource: function(req, res) {
		Html5Service.download(req, res, true);	
	},

	downloadOutput: function(req, res) {
		Html5Service.download(req, res, false);
	},

    myUploads: function(req, res) {
        var offset = typeof req.param('offset') != 'undefined' ? req.param('offset') : 0;
        Html5.find({ submittedBy: req.user.id, skip: offset, limit: 10, sort: 'createdAt DESC' }).populate("equations").exec(function(err, html5) {
            if (err) return res.badRequest(err);
            res.json(html5);
        });
    }
	
};

