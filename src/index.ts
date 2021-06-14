import app from 'config/express';
import { port } from 'config/vars';

import 'config/mongoose';

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
