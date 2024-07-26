const userRoutes = require("./users");
const applicationRoutes = require("./applications");
const tableRoutes = require("./tables");

const appRouter = (app, fs) => {
  app.get("/", (req, res) => {
    res.send("welcome to the development api-server");
  });

  userRoutes(app, fs);
  applicationRoutes(app, fs);
  tableRoutes(app, fs);
};

module.exports = appRouter;
