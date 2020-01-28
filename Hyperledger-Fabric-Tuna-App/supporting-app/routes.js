//SPDX-License-Identifier: Apache-2.0

var tuna = require('./controller.js');

module.exports = function(app){

  app.get('/registerSupporter/:supporter', function(req, res){
    tuna.registerSupporter(req, res);
  });
  app.get('/get_all_supporter', function(req, res){
    tuna.get_all_supporter(req,res);
  })
  app.get('/get_supporter/:id', function(req, res){
    tuna.get_supporter(req, res);
  });
  app.get('/get_recipient/:id', function(req, res){
    tuna.get_recipient(req, res);
  });
  app.get('/add_tuna/:tuna', function(req, res){
    tuna.add_tuna(req, res);
  });
  app.get('/get_all_recipient', function(req, res){
    tuna.get_all_recipient(req, res);
  });
  app.get('/change_holder/:holder', function(req, res){
    tuna.change_holder(req, res);
  });
}
