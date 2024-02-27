# Demo Song store backend

- [Checkout the frontend repository](https://github.com/fikireab-m/song-store-frontend)  OR

- [See how it looks live](https://song-store-frontend.vercel.app/)

## Getting started 

- Clone or fork this repository. If you wish to clone, you can use
```
git clone https://github.com/fikireab-m/song-store-backend.git
```
- Install the dependencies
```
npm i
```
- Configure your environment variable for mongoDB like bellow. Don't forget to update your username and password
```
DB_CONN_STRING="mongodb+srv://<fikireabmekuriaw>:<my_password>@cluster0.dybncf7.mongodb.net/"
DB_NAME="songsDB"
```
- Now you are ready, fire up your server using 
```
npm start
```
- If you open up your browser and goto [http://localhost:5000/](http://localhost:5000/), you will get an html page with information about which route does which tasks.



