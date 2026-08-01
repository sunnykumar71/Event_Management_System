import app from './api/index.js';

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Render Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
