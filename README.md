## GradForce - Talented Students, managed by Us, Working for You

In this app, graduated students from the IT sector, and future employers, have the possibility to upload their profiles: personal information, educational records, work history (for students) and company’s data and roles information for employers. It looks like, but it is not LinkedIn!
In addition, the administrator can manage all that information in a customized Admin Panel with the following features: 
- Get notified when students completed their profiles.
- Send an email with a link to a calendar invite include. 
- Perform CRUD operations (Create/Read/Update/Delete).
- Redact and send customized emails
- and more.

Give it a try and enjoy! This is the link: http://gradforcenz.herokuapp.com/
or follow the instuctions below if you want to play around

## Setting up the server, database and admin panel to run the app locally 

### 1, 2 and 3- Node.js, MongoDB Community Server and Robo3T installation
Download their latest versions according to your OS version:

- https://nodejs.org/en/download/
- https://www.mongodb.com/download-center/community
- https://robomongo.org/download

Then open the exe files, install the applications, and follow the instructions

### 4 - Close this repository and prepare de Node server
In the terminal run:

`` git clone https://github.com/diegoevangelisti/gradforce ``

Run the following statement:

`` cd gradforce ``

`` npm init ``

`` npm install --save``

### 5 - Set up mongodb server
Open another terminal and go to the folder where Mongodb server is installed - in windows:
``C:\Program Files\MongoDB\Server\4.0\bin``

Then run: ``./mongod``

After that the server should be properly running and we can connect our app to mongodb

### 6 - Robo3T setup (if you want to play with the data)
Open the Robo3T application nd create a new database named SSA and then connect to it

### 7 - Run application
In the terminal type:

``node index.js``

### 8 - Back office login

Open the browser and go to: 
``http://localhost:5000/``

Enjoy! You can register setting up a new account filling in a simple form or using your Google or Facebook details 
(But don't forget to select if you're either a student or you want to hire!)

### 9 - Extra notes
If you want to take a look at the admin panel...
Let me know, contact me and I give your the magic words

## Created by 
Diego Evangelisti. August, 2019
