module.exports = (router) => {
  if (process.env.NODE_ENV !== 'production') {
    router.get('*', (req, res) => res.render('index'));
  }
};
