app.get('/admin', authorize([1]), (req, res) => {
    res.send('Welcome to the Admin page.');
  });
  
  app.get('/main-user', authorize([2]), (req, res) => {
    res.send('Welcome to the Main User page.');
  });

  app.get('/user', authorize([3]), (req, res) => {
    res.send('Welcome to the User page.');
  });
  