const bodyParser = require("body-parser");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const acquireTimestamp = () => {
    let x = new Date();
    return x.toLocaleString('en-US', {hour12: false}) + ": ";
}

const pgp = require("pg-promise")();
const pgp_login = {
    host: 'localhost',
    port: 5432,
    database: "InvMgmt",
    user: "postgres",
    password: "password"
}
const db = pgp(pgp_login);

router.use(bodyParser.urlencoded({extended: false}));
router.use(express.json());

const SALT_ROUNDS = 10;




// ***** GET Requests ***** //

// GET: General API check
router.get("/api/", (req, res) => {
    console.log(acquireTimestamp()+"A user has accessed the server API endpoint.")
    const data = {message: `You have successfully accessed the server's API endpoint.`};
    res.json(data);
})


// GET: API Comm Check
router.get("/api/getcommcheck/", (req, res) => {
    console.log(acquireTimestamp()+"Comm check initiated by user.");
    res.json({message:'Active', content:{}});
})


// GET: Retrieve Name and Username for a specific user's account_id
router.get('/api/requestAccountDetails/', (req, res) => {// /api/requestAccountDetails/?account_id=XXX
    const account_id = req.query.account_id;

    console.log(acquireTimestamp()+`Received request for account info for account_id: ${account_id}`);

    if (account_id === undefined) {
        res.json({message:'No account_id received.', content:{}})
    }

    db.any(
        'SELECT first_name, last_name, username FROM accounts WHERE account_id=$1',[account_id]
    ).then(response => {
        if (response.length === 0) {
            res.json({message: 'No account found for that account_id.', content:{}});
        } else {
            res.json({message: 'Account details included in content.', content:response[0]});
        }
    }).catch(error=>console.log('Error: ', error));
})


// GET: Retrieve Account_id for a specific user's username
router.get('/api/requestAccountDetails/', (req, res) => {
    const username = req.body.username;

    console.log(acquireTimestamp()+`Received request for account_id info for username: ${username}`);

    if (username === undefined) {
        res.json({message:'No username received.', content:{account_id:null}})
    }

    db.any(
        'SELECT account_id FROM accounts WHERE username=$1',[username]
    ).then(response => {
        console.log(acquireTimestamp()+`AccountID for (username)${username} is ${response[0].account_id}. Responding to server.`);
        res.json({message: 'Account_id included in content.', content:response[0]});
    }).catch(error=>console.log('Error: ', error));
})


// GET: Listings created by a specific username
router.get("/api/requestListingsBy/", (req, res) => { // /api/requestListingsBy/?username=XXX
    const username= req.query.username;
    let account_id = 0;
    console.log(acquireTimestamp()+`Request received for listings by a specific account (username):${username}`);
    console.log(req.query);
    
    // First, we search for the corresponding account_id for the username submitted.
    db.one(
        "SELECT * FROM accounts WHERE username = $1;",[username]
    ).then( data => {
        account_id = data.account_id;
        console.log(acquireTimestamp()+`Account ID received was ${account_id}.`);

        // Then, once we have it (via .then()), we run a query for the items with a matching foreign key
        // and send that data to the client.
        db.any(
            'SELECT * FROM items WHERE listing_account = $1;', [account_id]
        ).then(data => {
            console.log(acquireTimestamp()+data);
            res.send(data);
        }).catch(error => {
            console.log('ERROR: ', error);
            res.json({message: "No entries available. If you believe this to be an error, please try again later."});
        });

    }).catch(error => {
        console.log('Error: ', error);
        res.json({message: 'No users match that username. If you believe this to be an error, please try again later.'});
    })
});


// GET: Details about a specific listing from its listing_id
router.get("/api/requestListingInfo/", (req, res) => {
    const listing_to_search = req.query.listing_id;

    console.log(acquireTimestamp()+`Received request for item details under listing_id: ${listing_to_search}`);

    db.any('SELECT * FROM items WHERE listing_id=$1',[listing_to_search])
    .then(response => {
        console.log(acquireTimestamp()+`Details received, sending to client.`);
        console.log(acquireTimestamp()+JSON.stringify(response[0]));
        const content_data = response[0];
        res.json({message: "Item details included in 'content'.", content:content_data});
    }).catch(error => console.log('Error: ', error))

})


// GET: Details about all existing listings
router.get("/api/requestAllListings/", (req, res) => {
    console.log(acquireTimestamp()+"Received request for all listings, sending all listings.");

    db.any(
        'SELECT * FROM items'
    ).then (data => {
        res.send(data);
    }).catch (error => {
        console.log('Error: ', error);
    });
})




// ***** POST Requests ***** //

// POST: API Comm Check
router.post("/api/postcommcheck/", (req, res) => {
    console.log(acquireTimestamp()+"Comm check initiated by user.");
    res.json({message:'Comm check successful.'});
})


// POST: Add a listing 
router.post("/api/addListing/", (req, res) => {
    const listing_account = parseInt(req.body.account_id);
    const item_name = req.body.item_name;
    const item_description = req.body.item_description;
    const quantity = parseInt(req.body.quantity);

    console.log(acquireTimestamp()+`Received request to create new item for account_id: `)

    if (isNaN(listing_account) || isNaN(quantity)) {
        res.send({message:"Error: Incomplete Item Information, No Item Added."});
        console.log(acquireTimestamp()+"Error: Incomplete Item Information, No Item Added.")
        return;
    }

    console.log(acquireTimestamp()+"Received request to add listing to database, details below.");

    console.log(acquireTimestamp()+"Adding item to database.")
    db.any(
        'INSERT INTO items (listing_account, item_name, item_description, quantity) '+
        'VALUES ($1, $2, $3, $4) RETURNING *', [listing_account, item_name, item_description, quantity]
    ).then(response=>{
        console.log(acquireTimestamp()+"Successful item entry, details entered below.");
        console.log(response);
        res.json({message:"Item added!", content:{}});
    }).catch(error => console.log('ERROR: ', error));
})


// POST: Check login details against the database and respond with SuccessStatus
router.post("/api/checkLoginInfo", (req, res) => {
    let username_attempt = req.body.username;
    let password_attempt = req.body.password;
    
    // get user info from databasee
    db.any(
        'SELECT account_id, password FROM accounts WHERE username = $1;',[username_attempt]
    ).then(response => {
        console.log(acquireTimestamp()+"User attempting to log in with username: "+username_attempt);
        // console.log(response);

        if (response[0] === null || response[0] === undefined) {
            console.log(acquireTimestamp()+"No user found for that username.");
            res.json({message:"Invalid username or password.",content:{account_id:null, loginSuccess: false}})
        } else {

            // check password_attempt against the encrypted password
            let isSuccessfulAttempt = false;
            bcrypt.compare(password_attempt, response[0].password, (err, result) => {
                isSuccessfulAttempt = result;
                if (isSuccessfulAttempt) {
                    console.log(acquireTimestamp()+"User "+username_attempt+" entered the correct password and has logged on.");
                    res.json({message:"Successfully logged on.", content: {account_id:response[0].account_id, loginSuccess: true}});
                } else {
                    console.log(acquireTimestamp()+"Unsuccessful login attempt for username: "+username_attempt)
                    res.json({message:"Invalid username or password.", content: {account_id:null, loginSuccess: false}});
                }
            })
            
            
        }
    })

    
})


// POST: Register a user
router.post("/api/registerAccount/", (req, res) => {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let username = req.body.username;
    let password = req.body.password;

    // check that username does not already exist
    db.any('SELECT account_id FROM accounts WHERE username=$1',[username])
    .then(response=>{
        console.log(acquireTimestamp()+"Request made to create account under username: "+username);

        if (Object.keys(response).length !== 0) {
            res.json({message:'Username already exists.',content:{}})
            console.log(acquireTimestamp()+`(username)${username} already exists in database.`);
        } else {
            // add user with encrypted password to database if username doesn't exist
            bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
                db.any(
                    'INSERT INTO accounts (first_name, last_name, username, password) VALUES ($1,$2,$3,$4) RETURNING account_id;',
                    [first_name, last_name, username, hash]
                ). then(response=>{
                    console.log(acquireTimestamp()+"User added under account_id: "+response[0].account_id);
                    res.json({message:"User added.", content:response});
                })
            })
        }
    })
})




// *** Put/Patch Requests
// Note: I will only be using put requests for simplicity.

// PUT: Update an existing listing record
router.put('/api/updateListing/', (req, res) => { // /api/updateListing/?listing_id=XXX
    const update_listing_id = req.query.listing_id;

    const item_name_new = req.body.item_name;
    const item_description_new = req.body.item_description;
    const quantity_new = req.body.quantity;

    console.log(acquireTimestamp()+`Received put request to overwrite data for listing_id: ${update_listing_id}`);

    // check is listing exists
    db.any(
        'SELECT listing_id FROM items WHERE listing_id=$1',[update_listing_id]
    ).then(response=>{
        // send back error if listing doesn't exist
        if (response.length !== 1) {
            console.log(acquireTimestamp()+`Error: Item (listing_id)${update_listing_id} does not exist or there are multiple instances.`);
            res.json({message:"Server-side Error: Listing ID does not exist in database.", content:{}});
        }
    });

    // If listing_id exists, then update/overwrite the record
    db.any(
        'UPDATE items SET item_name=$1, item_description=$2, quantity=$3 WHERE listing_id = $4',
        [item_name_new, item_description_new, quantity_new, update_listing_id]
    ).then(response=>{
        console.log(acquireTimestamp()+`Successful updated record (listing_id):${update_listing_id}.`);
        res.json({message:"Successfully updated record.", content:{}});
    }).catch(error=>{
        console.log('Error: ',error);
        res.json({messaage:"There was a server-side error. Please try again later.",content:{}});
    });

})



// *** Delete Requests


// DELETE: Delete an existing record
router.delete('/api/deleteRecord/', (req, res) => {
    // Send delete request to endpoint: 'http://localhost:8080/api/deleteRecord/'
    // and put the listing_id into the body. Using a body instead of a query makes
    // it harder for someone to access the api and delete something by accident

    const listing_to_delete = req.body.listing_id;

    console.log(acquireTimestamp()+`Received request to delete data for listing_id: ${listing_to_delete}`);

    // check is listing exists
    db.any(
        'SELECT listing_id FROM items WHERE listing_id=$1',[listing_to_delete]
    ).then(response=>{
        // send back error if listing doesn't exist
        if (response.length !== 1) {
            console.log(acquireTimestamp()+`Error: Item (listing_id)${listing_to_delete} does not exist or there are multiple instances.`);
            res.json({message:"Server-side Error: Listing ID does not exist in database.", content:{}});
        }
    });

    db.any(
        'DELETE FROM items WHERE listing_id=$1',[listing_to_delete]
    ).then(response => {
        console.log(acquireTimestamp()+"Listing successfully deleted.");
        res.json({message:"Listing successfully deleted.", content:{}});
    }).catch(error=>{
        console.log('Error: ',error);
        res.json({messaage:"There was a server-side error. Please try again later.",content:{}});
    });

})


module.exports = router;