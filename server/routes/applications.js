const applicationRoutes = (app, fs) => {

    const readFile = (
        callback,
        returnJson = false,
        filePath = dataPath,
        encoding = 'utf8'
      ) => {
        fs.readFile(filePath, encoding, (err, data) => {
          if (err) {
            throw err;
          }
    
          callback(returnJson ? JSON.parse(data) : data);
        });
      };
    
      const writeFile = (
        fileData,
        callback,
        filePath = dataPath,
        encoding = 'utf8'
      ) => {
        fs.writeFile(filePath, fileData, encoding, (err) => {
          if (err) {
            throw err;
          }
    
          callback();
        });
      };

    const dataPath = './data/applications.json';

    app.post('/applications', (req, res) => {
        
        readFile((data) => {
          // Note: this needs to be more robust for production use.
          // e.g. use a UUID or some kind of GUID for a unique ID value.
          const newUserId = Date.now().toString();
      
          // add the new user
          data[newUserId] = req.body;
          
      
          writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send('new application added');
          });
        }, true);
      });
      
  
      app.put('/applications/:id', (req, res) => {
        readFile((data) => {
     
          const userId = req.params['id'];
          data[userId] = req.body;
      
          writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send(`users id:${userId} updated`);
          });
        }, true);
      });
  

      app.delete('/applications/:id', (req, res) => {
        readFile((data) => {
    
          const userId = req.params['id'];
          delete data[userId];
      
          writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send(`users id:${userId} removed`);
          });
        }, true);
      });
      
    app.get('/applications', (req, res) => {
      fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        res.header('Access-Control-Allow-Origin', "*");
        res.send(JSON.parse(data));
      });
    });
  };
  
  module.exports = applicationRoutes;