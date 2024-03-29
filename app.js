// Module dependencies

var express    = require('express'),
    mysql      = require('mysql');

// Application initialization

var connection = mysql.createConnection({
    host     : 'cwolf.cs.sonoma.edu',
    user     : 'krangel',
    password : '3114181'
});

//var app = module.exports = express.createServer();
var app = express();

// Database setup
//connection.query('DROP DATABASE IF EXISTS krangel', function(err) {
//	if (err) throw err;
//	connection.query('CREATE DATABASE IF NOT EXISTS krangel', function (err) {
//	    if (err) throw err;
connection.query('USE krangel', function (err) {
    if (err) throw err;
    connection.query('CREATE TABLE IF NOT EXISTS patientInfo('
		     + 'PatientID INT NOT NULL AUTO_INCREMENT,'
        	     + 'PRIMARY KEY (PatientID),'
		     + 'pFName VARCHAR(25),'
		     + 'pLName VARCHAR(25),'
		     + 'homeAddress VARCHAR(50),'
		     + 'pPhoneNum INT'
	             +  ')', function (err) {
        	         if (err) throw err;
	             });
    
});

// Configuration
app.use(express.bodyParser());

// Static content directory
app.use(express.static('public'));

// Main route sends our HTML file

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/add_patient', function(req, res) {
  res.sendfile(__dirname + '/add_patient.html');
});

app.get('/add_doctor', function(req, res) {
  res.sendfile(__dirname + '/add_doctor.html');
});

app.get('/patient_info', function(req, res) {
  res.sendfile(__dirname + '/patient_info.html');
});

app.get('/doctor_info', function(req, res) {
  res.sendfile(__dirname + '/doctor_info.html');
});

// Update MySQL database


app.post('/patient_info', function (req, res) {
    console.log(req.body);
            connection.query('select PatientID, pFName, pLName, homeAddress, pPhoneNum from patientInfo where pLName = ?', req.body.pLName, 
		function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
  	              res.send('Last Name: ' + result[0].pLName + '<br />' +
		  	       'First Name: ' + result[0].pFName  + '<br />' +
			       'Address: ' + result[0].homeAddress  + '<br />' +
			       'Number: ' + result[0].pPhoneNum
		      );
                    }
                    else
                      res.send('User does not exist.');
		});
        
    });

app.post('/add_patient', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO patientInfo SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            connection.query('select PatientID, pFName, pLName, homeAddress, pPhoneNum from patientInfo where pLName = ?', req.body.pLName, 
		function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
  	              res.send('Last Name: ' + result[0].pLName + '<br />' +
		  	       'First Name: ' + result[0].pFName  + '<br />' +
			       'Address: ' + result[0].homeAddress  + '<br />' +
			       'Number: ' + result[0].pPhoneNum
		      );
                    }
                    else
                      res.send('User was not inserted.');
		});
        }
    );
});

app.post('/doctor_info', function (req, res) {
    console.log(req.body);
            connection.query('select DoctorID, drFName, drLName, workAddress, onCallNum from doctorInfo where drLName = ?', req.body.drLName,
                function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
                      res.send('Last Name: ' + result[0].drLName + '<br />' +
                               'First Name: ' + result[0].drFName  + '<br />' +
                               'Address: ' + result[0].workAddress  + '<br />' +
                               'Number: ' + result[0].onCallNum
                      );
                    }
                    else
                      res.send('User does not exist.');
                });

    });
app.post('/add_doctor', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO doctorInfo SET ?', req.body,
        function (err, result) {
            if (err) throw err;
            connection.query('select DoctorID, drFName, drLName, workAddress, onCallNum from doctorInfo where drLName = ?', req.body.drLName,
                function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
                      res.send('Last Name: ' + result[0].drLName + '<br />' +
                               'First Name: ' + result[0].drFName  + '<br />' +
                               'Address: ' + result[0].workAddress  + '<br />' +
                               'Number: ' + result[0].onCallNum
                      );
                    }
                    else
                      res.send('User was not inserted.');
		});
        }
    );

});

// Begin listening

app.listen(8017);
console.log("Express server listening on port %d in %s mode", app.settings.env);
