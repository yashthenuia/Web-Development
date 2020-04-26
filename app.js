var  express       = require("express"),
     mongoose      = require("mongoose"),
     app           = express(),
     bodyParser    = require("body-parser"),
     passport      = require("passport"),
     LocalStrategy = require("passport-local"),
     User          = require("./models/user"),
     Patient       = require("./models/patient")



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

 app.set("view engine", "ejs");
 mongoose.set('useUnifiedTopology',true);
mongoose.set('useNewUrlParser',true);
mongoose.connect("mongodb://localhost/bloodbank_3");


// PASSPORT CONFIGURATION ==============
app.use(require("express-session")({
    secret: "Blood bank is very important",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res, next){
  res.locals.currentUser = req.user;
  next();

})
   
/////===============================


var DonarScema = new mongoose.Schema({
	name : String,
	age: Number,
	address: String,
    blood_group: String,
    contact_no: Number,
    any_disease: String
});

var Donar = mongoose.model("donar",DonarScema);

// Patient.create(
// {
// 	name: "abhishek",
// 	age: 39,
// 	sex: "MALE",
//     Blood_group: "A+",
//     Disease: 9315670743,
//     requirement: 0

// },function(err,pat){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log("newly created bloodbank");
// 		console.log(pat);

// 	}
// });
// donar table =============================================================
 app.get("/",function(req,res){
 	res.render("front")
 });

 app.get("/about",function(req,res){
    res.render("about");
 });

app.get("/contact",function(req,res){
	res.render("contact");
})




///================================

app.get("/bloodbank", isLoggedIn ,function(req,res){
	Donar.find({},function(err,donarinfo){
		if(err){
			console.log(err);
		}
		else{
			res.render("index3",{donarinfo:donarinfo});
		}
	});


});
app.post("/bloodbank", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var age = req.body.age;
    var address = req.body.address;
    var blood_group = req.body.blood_group;
    var contact_no = req.body.contact_no;
    var any_disease = req.body.any_disease;

    var newdonar = {name: name, age: age, address: address, blood_group:blood_group, contact_no:contact_no, any_disease:any_disease };
    // create a new campground  and save it to the db
    Donar.create(newdonar,function(err,newlyCreated){
        if(err){
            console.log(err);
        } else{
            //redirect back to campgrounds page
            res.redirect("bloodbank");

        }
    })



 });
app.get("/bloodbank/new", isLoggedIn ,function(req, res){
   res.render("new.ejs"); 
});
//=======================================================================

app.get("/DonarDetails",function(req,res){
	res.render("donarpage");

})

app.get("/newdonation",function(req,res){
	res.render("newdonar");

})
app.post("/DonarDetails", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var age = req.body.age;
    var address = req.body.address;
    var blood_group = req.body.blood_group;
    var contact_no = req.body.contact_no;
    var any_disease = req.body.any_disease;

    var newdonars = {name: name, age: age, address: address, blood_group:blood_group, contact_no:contact_no, any_disease:any_disease };
    // create a new campground  and save it to the db
    Donar.create(newdonars,function(err,newlyCreated){
        if(err){
            console.log(err);
        } else{
            //redirect back to campgrounds page
            res.redirect("DonarDetails");

        }
    })



 });




// patient Details // ===================================================

app.get("/adminp",function(req,res){
    Patient.find({},function(err,pat_info){
        if(err){
            console.log(err);
        }
        else{
            res.render("indexs",{pat_info:pat_info});
        }
    })

})



app.post("/adminp", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var age = req.body.age;
    var sex = req.body.sex;
    var Blood_group = req.body.Blood_group;
    var Disease = req.body.Disease;
    var requirement = req.body.requirement;

    var newpatient = {name: name, age: age, sex: sex, Blood_group:Blood_group, Disease:Disease, requirement:requirement };
    // create a new campground  and save it to the db
    Patient.create(newpatient,function(err,newlyCreated){
        if(err){
            console.log(err);
        } else{
            //redirect back to campgrounds page
            res.redirect("adminp");

        }
    })



 });
app.get("/adminp/new", isLoggedIn ,function(req, res){
   res.render("news.ejs"); 
});











/////==========================================================
// AUTH ROUTES 
//==============
//show registration form

app.get("/register",function(req,res){
    res.render("register");
});
 // handle sign up logic

 app.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/bloodbank");
        });
    });
 });


// show login form
app.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/bloodbank",
        failureRedirect: "/login"
    }), function(req, res){
});
 app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
 });


 function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}







 app.listen(3000,function(){
 	console.log("server has started")
 })