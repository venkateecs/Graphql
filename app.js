const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP =require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');
const graphQlResolvers = require('./graphql/resolvers/index');
const graphQlSchema = require('./graphql/schema/index');
const app = express();
const isAuth = require('./middleware/is-auth');

app.use(bodyParser.json());
app.use((req,res,next)=> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AUTHORIZATION');
  if(req.method === 'OPTIONS') {
   return res.sendStatus(200);
  }
   next();
})
app.use(isAuth);

app.use('/graphql', graphqlHTTP({
  schema: graphQlSchema,
  rootValue:graphQlResolvers,
  graphiql: true
}))
app.get('/',(req,res)=> {
   res.send('Hello World')
})

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0.uwahx.mongodb.net/test?retryWrites=true&w=majority`).then((data)=>{
  console.log('Connected to DataBase');
}).catch((err)=> {
  console.log(err);
})

app.listen(8000, ()=> {
  console.log('This App is running under port 8000');
})