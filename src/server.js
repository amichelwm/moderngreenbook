const { createApp } = require('./app');

const app = createApp();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  process.stdout.write(`moderngreenbook starter app listening on http://localhost:${port}\n`);
});
