import app from 'config/express';
import { port } from 'config/vars';

import connect from 'config/mongoose';

connect();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
