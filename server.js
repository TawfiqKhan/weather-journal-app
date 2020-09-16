const express     = require('express'),
      app         = express(),
      bodyParser  = require('body-parser'),
      cors        = require('cors'),
      path        = require('path'),
      port        = process.env.PORT || "8000";


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
app.use(cors())


app.use(express.static('public'))

let projectData = []

// app.get('/blog', (req, res)=> {
//  res.sendFile(path.join(__dirname+'/public/blog.html'));
// })

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.get('/all', getData)

function getData(req, res) {
  res.send(projectData)
}


app.post('/addWeatherData', addWeatherData);

function addWeatherData(req, res) {

  const {
    name,
    date,
    icon,
    temperature,
    cloudLevel,
    humidity,
    sunrise,
    sunset,
    content
  } = req.body

  newEntry = {
    name: name,
    date: date,
    icon: icon,
    temperature: temperature,
    cloudLevel: cloudLevel,
    humidity: humidity,
    sunrise: sunrise,
    sunset: sunset,
    content: content
  }

  projectData = []
  projectData.push(newEntry)
  res.send(projectData)
}


app.listen(port, () => {
  console.log(`Server is Running at http://localhost:${port}`)
})