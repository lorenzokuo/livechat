var express = require("express");
var app = express();

var bodyParser = require('body-parser');
var path = require("path");
var session = require( "express-session" );

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.use( session( {secret: "cdgogogo"} ) );

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    console.log("001");
    res.render( "index" );
})

var server = app.listen( 8000, function() {
    console.log( "listening on port 8000" );
});

var io = require( "socket.io" ).listen( server );

var chat = [];
var users_dict = {};

io.sockets.on( "connection", function( socket ){
    console.log("003");
    console.log( "Client/socket is connected");
    console.log( "Client/socket id is: ", socket.id );
    users_dict[socket.id] = "user";

    socket.on( "user_joined", function( data ){
        console.log("004");
        chat.push( {name: data, message: "*** joined ***"})
        users_dict[socket.id] = data;
        io.emit( "new_message", chat, users_dict )
        console.log( "USERS: ", users_dict );
    })

    socket.on( "message", function( data ){
        console.log("005");
        chat.push( {name: data.name, message: data.message} )
        console.log( "CHAT ARRAY: ", chat);
        io.emit( "new_message", chat, users_dict )
    })

    socket.on( "disconnect", function(){
        console.log("006");
        console.log( socket.id + " HAS DISCONNECTED" );
        chat.push( {name: users_dict[socket.id], message: "*** user has disconnected ***"} )
        console.log(users_dict[socket.id]);
        console.log(chat);
        delete users_dict[socket.id];
        console.log("007");
        console.log( "USERS: ", users_dict );
        io.emit( "new_message", chat, users_dict )
    })

})