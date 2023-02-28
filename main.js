const express = require('express')
const fs = require('fs')
const session = require('express-session')
const path = require('path');
const app = express();
const port = 3000;
const hostName = '127.0.0.1';

app.use(session({
    secret:"test of best",
    resave:false,
    saveUninitialized: true
}))

app.use(express.json());
app.use(express.static('public'));
app.set('view engine','ejs');


app.route('/')
.get((req,res)=>{
    console.log(req.url);
    // res.setHeader('Content-Type','text/html');
    res.render(path.join(__dirname,"views/index.ejs"),{user: req.session.user});
})
app.route('/user')
.get((req,res)=>{
    if(req.session.logged_in){
        fs.readFile('./data.json',function(err,data){
            if(!err){
                if(data.length == 0){
                    data = []
                }else{
                    data = JSON.parse(data);
                }
                res.render("user.ejs",{user:req.session.user,"data": data});
            }
        })
    }else{
        res.redirect('/login');
    }
})

app.route('/login')
.get((req,res)=>{
    if(req.session.logged_in){
        res.statusCode = 303;
        res.redirect('/user');
    }else{
        res.sendFile(path.join(__dirname, 'public/login/login.html'));
    }
})
.post((req,res)=>{;
    let data = req.body;
    res.setHeader('Content-Type','text/plain');
    if(data.user == '' || data.password == ''){
        res.statusCode = 400;
        res.end('');
    }
    else{
        fs.readFile('./user.json',function(err,fdata){
            if(err){
                res.statusCode = 404;
                res.end('');
            }else{
                if(fdata.length == 0){
                    res.statusCode = 404;
                    res.end('');
                }else{
                    fdata = JSON.parse(fdata);
                    res.statusCode = 403;
                    let match = false;
                    fdata.forEach((element)=>{
                        if(element.user == data.user && element.password == data.password){
                            if(match == false){
                                match = true;
                                req.session.logged_in = true;
                                req.session.user = data.user;
                                return true;
                            }
                        }
                    })
                    if(match){
                        res.statusCode = 200;
                        res.end('');
                    }else{
                        res.statusCode = 401;
                        res.end('');
                    }
                }
            }
        })
    }
})

app.route('/signup')
.get((req,res)=>{
    if(req.session.logged_in){
        res.statusCode = 303;
        res.redirect('/user');
    }else{
        res.sendFile(path.join(__dirname, 'public/signup/signup.html'));
    }
})
.post((req,res)=>{
    let data = req.body;
    // res.statusCode = 100;
    if(data.user == '' || data.password == ''){
        res.statusCode = 400;
        res.end();
    }
    else{
        fs.readFile('./user.json',(err,fdata)=>{
            if(err || fdata.length == 0 ){
                res.statusCode = 404;
                res.end('');
            }else{
                fdata = JSON.parse(fdata);
                let match = false;
                fdata.forEach((element)=>{
                    if(element.user == data.user){
                        match = true;
                    }
                });
                if(!match){
                    fdata.push(data);
                    console.log(fdata);
                    fs.writeFile('./user.json',JSON.stringify(fdata),function(err){
                        if(err){
                            res.statusCode = 404;
                            res.end('');
                        }else{
                            // console.log("in-login");
                            res.statusCode = 200;
                            req.session.logged_in = true;
                            req.session.user = data.user;
                            res.end('');
                        }
                    })
                }else{
                    res.statusCode = 305;
                    res.end('');
                }
            }
        })
    }
    console.log(res.statusCode);
    
})

app.get('/userAuth.js',function(req,res){
    res.sendFile(path.join(__dirname,"public/userAuth.js"));
});

app.listen(port,hostName);

app.get('/index.css',(req,res)=>[
    res.sendFile(path.join(__dirname,'public/'))
])


app.get('/logout',(req,res)=>[
    req.session.destroy(function(err){
        if(!err){
            res.redirect('/');
        }
    })
])

// .post((req,res)=>{
    //     let data = req.body;
    //     fs.readFile('./user.json',function(err,fdata){
        //         if(err){
            //             res.statusCode = 404;
            //             res.end();
            //         }else{
                //             if(fdata.length == 0){
                    //                 res.statusCode = 404;
                    //                 res.end();
                    //             }else{
                        //                 let match = false;
                        //                 fdata = JSON.parse(fdata);
                        //                 fdata.forEach(function(element){
                            //                     if(element.user == data.user ){
                                //                         match = true;
                                //                     }
                                //                 })
                                //                 if(!match){
                                    //                     let newUser = {
                                        //                         user: req.body.user,
                                        //                         password: req.body.password
                                        //                     }
                                        //                     fdata.push(newUser);
//                     fs.writeFile('./user.json',JSON.stringify(fdata),function(err){
//                         if(!err){
//                             res.statusCode = 200;
//                             req.session.logged_in = true;
//                             req.session.user = data.user;
//                             res.send();
//                         }else{
//                             res.statusCode = 403;
//                             res.end();
//                         }
//                     })
//                 }else{
//                     res.statusCode = 305;
//                     res.end();
//                 }
//             }
//         }
//     })
// })
