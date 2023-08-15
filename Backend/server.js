const app = require('./app');
const dotenv = require('dotenv');
// Config


dotenv.config({ path:"Backend/config/config.env" }); 

console.log(process.env.PORT)
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT || 4000}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});
