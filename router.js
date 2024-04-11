const express=require("express");
const sqlDBConnect=require("./dbconnect");
const Router=express.Router();
const multer  = require('multer');
//const upload = multer();
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  });
  
  const upload = multer({ storage });

Router.get("/api/user",(req,res)=>{

    sqlDBConnect.query("select * from tbl_user",(err,rows)=>{
        if(!err)
        {
            res.send(rows);
        }
        else
        {
            console.log(err);
        }
    });
});


Router.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Check if email and password exist in the database
    const query = `SELECT * FROM tbl_user WHERE user_email = '${email}' AND user_password = '${password}'`;
    sqlDBConnect.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query: ', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (results.length > 0) {
                // User found, send success response
                res.status(200).json({ message: 'Login successful', user: results[0] });
            } else {
                // User not found, send error response
                res.status(401).json({ message: 'Invalid email or password' });
            }
        }
    });
});


Router.get("/api/country",(req,res)=>{

    sqlDBConnect.query("select * from tbl_country",(err,rows)=>{
        if(!err)
        {
            res.send(rows);
        }
        else
        {
            console.log(err);
        }
    });
});

Router.get("/api/country",(req,res)=>{

    sqlDBConnect.query("select * from tbl_country",(err,rows)=>{
        if(!err)
        {
            res.send(rows);
        }
        else
        {
            console.log(err);
        }
    });
});

Router.get("/api/state/:id",(req,res)=>{

    sqlDBConnect.query("select * from tbl_state where countryid='"+req.params.id+"'",(err,rows)=>{
        if(!err)
        {
            res.send(rows);
        }
        else
        {
            console.log(err);
        }
    });
});

Router.post("/api/adduser",(req,res)=>{
    const name=req.body.name;
    const phone=req.body.phone;
    const email=req.body.email;
    const address=req.body.address;
   
    var sql="Insert into tbl_user (user_name,user_email,user_phone,user_address) values ('"+name+"','"+email+"','"+phone+"','"+address+"')";

    sqlDBConnect.query(sql,(err,result)=>{{
        if(!err)
        {
            res.status(200).json("User registration completed successfully");
        }
        else
        {
            console.log(err);
        }
    }});

});

//YBF ADD BLOG API
Router.post("/api/addblog",upload.single('image'),(req,res)=>{
    const formData = req.body;
  //console.log(formData);  
  console.log(req.file.filename);
    // File was uploaded successfully
 //   res.send('File uploaded successfully.');
 var imagePath="";
  if (req.file) {
    // If file is uploaded successfully, send back the file path
    imagePath = '/uploads/' + req.file.filename;
    //res.send(imagePath);
  } else {
    res.status(400).send('No file uploaded');
  }
  //console.log(formData.title);
    const title=formData.title;  
    const path=imagePath;
    const description=formData.description;
    const slug=formData.slug;
    const date=formData.date;
   
    
  
  //  var sql="Insert into tbl_blog (blog_title,image_path,blog_upload_date,blog_description,blog_slug) values ('title','path','"+formattedDate+"','description','slug-slug-title')";

  var sql="Insert into tbl_blog (blog_title,image_path,blog_upload_date,blog_description,blog_slug) values ('"+title+"','"+path+"','"+date+"','"+description+"','"+slug+"')";

    sqlDBConnect.query(sql,(err,result)=>{{
        if(!err)
        {
            res.status(200).json("User registration completed successfully "+imagePath+req.file.filename);
        }
        else
        {
            console.log(err);
        }
    }});

});

//YBF GET BLOGS API
Router.get("/api/allBlogs",(req,res)=>{

    sqlDBConnect.query("select * from tbl_blog",(err,rows)=>{
        if(!err)
        {
            res.send(rows);
        }
        else
        {
            console.log(err);
        }
    });
});

//YBF DELETE BLOG API

Router.delete("/api/deleteBlog/:id",(req,res)=>{


    sqlDBConnect.query('SELECT image_path FROM tbl_blog WHERE blog_id = ?', [resourceId], (err, results) => {
        if (err) {
          console.error('Error fetching data from database:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
    
        if (results.length === 0) {
          res.status(404).json({ error: 'Resource not found' });
          return;
        }
    
        const imagePath = results[0].image_path;
    
    
    sqlDBConnect.query("delete from tbl_blog where blog_id='"+req.params.id+"'",(err,result)=>{
        
        if (err) {
            return res.status(500).json({ message: 'Failed to delete blog', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        fs.unlink(path.join(__dirname, 'uploads', imagePath), err => {
            if (err) {
              console.error('Error deleting image:', err);
              res.status(500).json({ error: 'Internal server error' });
              return;
            }
            console.log('Resource deleted successfully');
            res.status(200).json({ message: 'Blog deleted successfully' });
          });
       // res.json({ message: 'Blog deleted successfully' });
    });
})
});




let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

Router.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;

    // Find the user by ID
    const user = users.find(user => user.id === userId);

    // If user not found, return 404 Not Found
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    user.name = updatedUser.name || user.name;
    user.email = updatedUser.email || user.email;

    // Return updated user
    res.json(user);
});

Router.delete("/api/deleteUser/:phoneNo",(req,res)=>{

    
    sqlDBConnect.query("delete from tbl_user where user_phone='"+req.params.phoneNo+"'",(err,result)=>{
        
        if (err) {
            return res.status(500).json({ message: 'Failed to delete user', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    });
});

//YBF UPDATE blog API
Router.put('/api/updateBlog/:id', upload.single('image'), (req, res) => {
    const resourceId = req.params.id;
    const newImage = req.file;
    const title=req.params.title;
    const description=req.params.description;
    const slug=req.params.slug;

    // Fetch existing image path from the database
    connection.query('SELECT image_path FROM tbl_blog WHERE blog_id = ?', [resourceId], (err, results) => {
      if (err) {
        console.error('Error fetching data from database:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Resource not found' });
        return;
      }
  
      const oldImagePath = results[0].image_path;
  
      // Update database with new image path
      const imagePath = newImage ? newImage.path : oldImagePath;
      connection.query('UPDATE tbl_blog SET image_path = ?,blog_title=?,blog_description=?,blog_slug=?  WHERE id = ?', [imagePath,title,description,slug,resourceId], (err, _) => {
        if (err) {
          console.error('Error updating data in database:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
  
        // If a new image is provided, delete the old image
        if (newImage) {
          fs.unlink(path.join(__dirname, 'uploads', oldImagePath), err => {
            if (err) {
              console.error('Error deleting old image:', err);
              res.status(500).json({ error: 'Internal server error' });
              return;
            }
            console.log('Old image deleted successfully');
          });
        }
  
        console.log('Resource updated successfully');
        res.status(200).json({ message: 'Resource updated successfully' });
      });
    });
  });
  


//YBF ADD EVENT API
Router.post("/api/addEvent",upload.single('image'),(req,res)=>{
    const formData = req.body;
  //console.log(formData);  
    // File was uploaded successfully
 //   res.send('File uploaded successfully.');
 var imagePath="";
  if (req.file) {
    // If file is uploaded successfully, send back the file path
    imagePath = '/uploads/' + req.file.filename;
    //res.send(imagePath);
  } else {
    res.status(400).send('No file uploaded');
  }
  //console.log(formData.title);
    const title=formData.title;  
    const path=imagePath;
    const description=formData.description;
    const date=formData.date;
    const starttime=formData.starttime;
    const endtime=formData.endtime;
    const location=formData.location;
    const status=formData.status;
    
  
  //  var sql="Insert into tbl_blog (blog_title,image_path,blog_upload_date,blog_description,blog_slug) values ('title','path','"+formattedDate+"','description','slug-slug-title')";

  var sql="Insert into tbl_event_info (event_name,event_description,event_date,event_start_time,event_end_time,event_location,event_status,event_image_path) values "+
  "('"+title+"','"+description+"','"+date+"','"+starttime+"','"+endtime+"','"+location+"','"+status+"','"+imagePath+"')";

    sqlDBConnect.query(sql,(err,result)=>{{
        if(!err)
        {
            res.status(200).json("Event added successfully "+imagePath);
        }
        else
        {
            console.log(err);
        }
    }});

});

//YBF GET EVENTS API
Router.get("/api/allEvents",(req,res)=>{

    sqlDBConnect.query("select * from tbl_event_info",(err,rows)=>{
        if(!err)
        {
            res.send(rows);
        }
        else
        {
            console.log(err);
        }
    });
});

//YBF UPDATE event API
Router.put('/api/updateEvent/:id', upload.single('image'), (req, res) => {
    const resourceId = req.params.id;
    const newImage = req.file;
    const title=req.params.title;
    const description=req.params.description;
    const date=req.params.date;
    const starttime=req.params.starttime;
    const endtime=req.params.endtime;
    const location=req.params.location;
    const status=req.params.status;
    // Fetch existing image path from the database
    connection.query('SELECT event_image_path FROM tbl_event_info WHERE event_id = ?', [resourceId], (err, results) => {
      if (err) {
        console.error('Error fetching data from database:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Resource not found' });
        return;
      }
  
      const oldImagePath = results[0].image_path;
  
      // Update database with new image path
      const imagePath = newImage ? newImage.path : oldImagePath;
      connection.query('UPDATE tbl_event_info SET event_image_path = ?,event_name=?,event_description=?,event_date=?,event_start_time=?,event_end_time=?,event_location=?,event_status=?  WHERE id = ?', [imagePath,title,description,date,starttime,endtime,location,status,resourceId], (err, _) => {
        if (err) {
          console.error('Error updating data in database:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
  
        // If a new image is provided, delete the old image
        if (newImage) {
          fs.unlink(path.join(__dirname, 'uploads', oldImagePath), err => {
            if (err) {
              console.error('Error deleting old image:', err);
              res.status(500).json({ error: 'Internal server error' });
              return;
            }
            console.log('Old image deleted successfully');
          });
        }
  
        console.log('Resource updated successfully');
        res.status(200).json({ message: 'Resource updated successfully' });
      });
    });
  });


//YBF DELETE EVENT API

Router.delete("/api/deleteEvent/:id",(req,res)=>{
    sqlDBConnect.query('SELECT event_image_path FROM tbl_event_info WHERE event_id = ?', [resourceId], (err, results) => {
        if (err) {
          console.error('Error fetching data from database:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
    
        if (results.length === 0) {
          res.status(404).json({ error: 'Resource not found' });
          return;
        }
    
        const imagePath = results[0].image_path;
    
    sqlDBConnect.query("delete from tbl_event_info where event_id="+req.params.id,(err,result)=>{
        
        if (err) {
            return res.status(500).json({ message: 'Failed to delete event', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        fs.unlink(path.join(__dirname, 'uploads', imagePath), err => {
            if (err) {
              console.error('Error deleting image:', err);
              res.status(500).json({ error: 'Internal server error' });
              return;
            }
            console.log('Resource deleted successfully');
            res.status(200).json({ message: 'Event deleted successfully' });
          });
    });
});
});
//YBF GET WAITLIST API
Router.get("/api/allWaitlist",(req,res)=>{

    sqlDBConnect.query("SELECT waitlist_id,user_name,user_email,user_contact,event_name FROM tbl_event_waitlist JOIN tbl_event_info ON tbl_event_waitlist.event_id = tbl_event_info.event_id"
    ,(err,rows)=>{
        if(!err)
        {
            res.send(rows);
        }
        else
        {
            res.sendStatus(405);
            console.log(err);
        }
    });
});

//YBF GET BOOKINGS API
Router.get("/api/allEventBooking",(req,res)=>{

    sqlDBConnect.query("select teb.user_name,teb.user_email,teb.user_phone , tei.event_name, teti.event_ticket_type, teti.event_ticket_price  from tbl_event_booking teb JOIN tbl_event_info tei on teb.event_id=tei.event_id JOIN tbl_event_ticket_info teti on teb.event_bkg_type_id=teti.event_tkt_id",(err,rows)=>{
        if(!err)
        {
            res.send(rows);
        }
        else
        {
            res.sendStatus(405);
            console.log(err);
        }
    });
});

module.exports=Router;