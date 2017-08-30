const express = require('express');
const morgan = require('morgan');
const basicAuth = require('express-basic-auth');
const randomstring = require("randomstring");
const bodyParser = require('body-parser');

const app = express();

const data = [
  {logUrl : 'http://goolge.com', id: randomstring.generate(6)}
];

const authMiddleware = basicAuth({
  users: { 'admin': '1q2w3e' },
  challenge: true,
  realm: 'Imb4T3st4pp'
});
const bodyParserMiddleware = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.use('/static', express.static('public'));
app.use(morgan('tiny'));
/*
app.use(basicAuth({
  users: { 'admin': '1q2w3e' },
  challenge: true,
  realm: 'Imb4T3st4pp'
}););
app.use(bodyParser.urlencoded({ extended: false }));
*/

app.get('/', authMiddleware, (req, res) => {
  res.render('index.ejs', {data});
});

app.get('/:id', (req, res) => {
  const id = req.params.id;
  const matched = data.find(item => item.id === id);

  if(matched){
    res.redirect(301, matched.logUrl);
  }else{
    res.status(404);
    res.send('404 Not Found');
  }
});

app.post('/', authMiddleware, bodyParserMiddleware, (req, res) => {
  const logUrl = req.body.longUrl;
  let id;
  
  while(true){
    const candidate = randomstring.generate(6);
    const matched = data.find(item => item.id === candidate);
    if(!matched){
      id = candidate;
      break; 
    }
  }

  //console.log('[ longUrl, id ] >>', logUrl, id );
  data.push({id, logUrl});
  res.redirect('/'); // 302
});

app.listen(3000, () => {
  console.log('[ listening... ]');
});