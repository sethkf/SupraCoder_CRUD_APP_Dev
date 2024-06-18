# SupraCoder_CRUD_APP_Dev

Hello there! Thank you for viewing the CRUD app for Seth Finley.

This REPO is split into two parts, with one folder being the backend using ExpressJS and one being the front end using React. The instructions for the database setup are included in Step 01 below.

It is recommended that you clone this repo in its entirety, install PostGreSQL on your machine on port 5432 and make note of the password created for the default superuser (username: postgres), and then follow the instructions below for the best experience setting up the database, backend, and front end.


--------------------------------------------------------------------------------------------

# 01. Database Setup Instructions
This app is designed to run off of a PostgreSQL database off of port 5432.
Assuming that you have postgresql installed on your computer / local machine and have enabled psql in the CLI, open a terminal window and run the following command (on windows) to log into postgres with the default admin user account:

psql -U postgres

And press enter. When you set up the PostgreSQL on your computer, you created a password that was assigned to the user "postgres". This is what you will need to enter when next prompted for the password. You should be in the postgres CLI environment, normally denoted by "postgres=#" before your text entry. You will want to run the following commands to setup our environment.

a. First run the command to create our database(and make sure to include the semicolon). Feel free to copy and paste into the CLI:

CREATE DATABASE "InvMgmt";

b. You will then press Ctrl+C to exit the psql CLI, and we will re-login into our new database. Insert the following and press enter, then enter "password" and press enter. This should log you into our new database.

psql -U postgres -d InvMgmt

c. Once you are logged in, we can create our first table for our users. Insert the following and press enter after each line. The commands won't be executed until you press enter after a semicolon. Feel free to copy and paste into the CLI:

CREATE TABLE accounts (
account_id SERIAL PRIMARY KEY,
first_name VARCHAR(255),
last_name VARCHAR(255),
username VARCHAR(255),
password VARCHAR(255)
);

This will set up our first user/account table with a primary key which the items table will later use as a foreign key.

d. Now we must create the table for our items/listings. Let's do so via the following commands as with above. Feel free to copy and paste into the CLI:

CREATE TABLE items (
listing_id SERIAL PRIMARY KEY,
listing_account INT,
item_name VARCHAR(255),
item_description VARCHAR(255),
quantity INT,
FOREIGN KEY (listing_account) REFERENCES accounts(account_id)
);

e. This should create the database as it is needed. If you have a database viewer like pgAdmin or DBeaver, it is recommended to go through and verify that it is running on port 5432 (which should be set during setup of postgresql on the machine), and has the table and column names exactly as written, else the API will be unable to perform the CRUD operations as required.


--------------------------------------------------------------------------------------------

# 02. Backend API Instructions
In order to best run the backend, you should navigate to 
[02. backend - ExpressJS/]
in the repository and run the backend.js file via nodemon or node.

However, you first need to run the following to install the dependencies included in the package.json file. Run the following in the CLI:

npm install

Next, you need to adjust the database login information in the router.js file under "02. backend - ExpressJS/". Change the password around line 17 to be whatever password you set for user "postgres" when PostGreSQL was set up. This should be the same password you login with in the database setup instructions in the previous section.

Then run the backend file with the following:
Ex (in CLI after cd to the above folder):   

node backend.js

Throughout your use of the app, this will display diagnostic messages about its communications to and from the user and the database.


--------------------------------------------------------------------------------------------

# 03. Front End Instructions
In order to best run the front end, you should navigate to 
[01. frontend - React/frontend-react/] 
in the repository and run the app.js file via nodemon, node, or npm start.

However, you first need to run the following to install the dependencies included in the package.json file. Run the following in the CLI:

npm install

Then run the front end file with the following:
Ex (in CLI after cd to the above folder): 

npm start

The front end is going to run on localhost:3000, and is linked via proxy to localhost:8080 for the API.

When you run the front end and navigate to the page, there is a debug feature above the menu buttons which specifies a couple of global variables for testing and your ease of use. Specifically, the "Server Status" shows whether or not it can access the API. If the API has not been started, this should say Inactive. 