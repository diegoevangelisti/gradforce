## GradForce - Talented Students, managed by Us, Working for You

### Application Setup to run it locally

### 1 - Node.js installation

Download the latest version according to your OS version here: https://nodejs.org/en/download/

Then open the exe file and install the application following the instructions

### 2 - MongoDB Community Server installation

Download the latest version according to your OS version here: https://www.mongodb.com/download-center/community

Then open the exe file and install the application following the instructions

### 3 - Robo3T installation

Download the latest version according to your OS version here: https://robomongo.org/download

Then open the exe file and install the application following the instructions

Robo3T allows us to manage MondoDB databases locally


### 4 - Node.js first steps

Open the back-end-code folder in Visual Studio Code or similar source-code editor (download VSC here: https://code.visualstudio.com/download)

Open a new terminal inside Visual Studio Code

Delete the ``package.json`` file situated in the main folder

Run the following statement:

`` npm start ``


### 4 -  Installing packages with npm

Now all the external dependencies should be installed. Run the following statement in the terminal:

``npm install -d --save``

### 5 - Set up mongodb server

Open another terminal and go to the folder where Mongodb server is install, specifically to this location:
``C:\Program Files\MongoDB\Server\4.0\bin``

Then run the following: ``./mongod``

After that the server should be initiated properly and we can connect our app with mongodb

### 6 - Robo3T setup

Open the Robo3T application nd create a new database named SSA and the connect to it


### 7 - Run application

Write the following statement in the first terminal:
``nodemon index.js``


### Created by Diego Evangelisti. August, 2019

