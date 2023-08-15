const app = require('./app');
const dotenv = require('dotenv');
// Config
// Define the full path to your .env file
const envPath = path.join(__dirname, 'Backend', 'config', 'config.env');

dotenv.config({ path: envPath }); // Load environment variables from the specified path

console.log(process.env.PORT)
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});
