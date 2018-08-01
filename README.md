# Hardy-Bot
A dashboard for loading real-time data widgets to an IoT display

<img width="1680" alt="hardy-bot" src="https://user-images.githubusercontent.com/15896597/43548214-09c3e002-95a3-11e8-8d78-1d56dc893607.png">

**Tools/Technologies Used**

* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [Material UI](https://material-ui.com/)
* [Node.js](https://nodejs.org/en/) + [Express](http://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org/) + [Sequelize](http://docs.sequelizejs.com/)
* [Socket.io](https://socket.io/)
* [Webpack](https://webpack.js.org/)
* [Streamdata.io](https://streamdata.io/)

# Setup

You will to need to register for a few APIs for the widgets, as well as Streamdata.io (link above), a real-time cache proxy allowing you to poll JSON REST APIs and push updates to your dashboard and IoT display. In Streamdata, you will then need to add you

Examples of the APIs we are using:
* Weather: [OpenWeatherMap](https://openweathermap.org/api)
* Stocks: [IEX Group](https://iextrading.com/developer/)
* News: [News API](https://newsapi.org/)
* Traffic: [Bing Maps](https://msdn.microsoft.com/en-us/library/ff701717.aspx)

Run:

```sh
$ npm install

```

Create a .env in the root directory with the following variables:

```sh

```

Also, there is a (Maps API - Mapping) API Key embedded in the Google Maps React component that is restricted and will need to be replaced.

Scripts:
```sh
$ npm run server-dev #for server 
$ npm run react-dev  #for client
```
# Usage
