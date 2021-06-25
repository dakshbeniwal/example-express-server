import App from './app';
import config from './src/config/config';

const app = new App(config.SERVER_PORT);

app.listen();