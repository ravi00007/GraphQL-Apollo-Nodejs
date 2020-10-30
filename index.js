const express = require('express');
const {ApolloServer,gql} = require('apollo-server-express');
const mongoose = require('mongoose');
const {User , Address} = require('./schema');
const faker = require('faker');

mongoose.connect('mongodb://localhost:27017/graphql',{useNewUrlParser:true, useUnifiedTopology: true  },(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('MongoDB Connected Succefuly')
    }
    
})

// construct a schema  using GraphQL Schema Langauge 

const typeDefs = gql`
type Query{
    getUser(_id: ID):User,
    getUsers:[User],
    getAddresses:[Address],
    hello:String,
    hey:String,
    randomPerson:Person
}

type User{
    _id:String,
    name:String,
    email:String
},
type Address {
    _id:String,
    city:String,
    country:String
    user:User
},


type Person {
    name: String,
    email: String,
    lat: Float,
    lng: Float,
    street: String
}
`;
// resolvers used to retrive data

const resolvers ={
    Query:{
        async getUser(parent, agrs , context, info ){
            
            return await User.findById(agrs).populate('address')
        },
        async getUsers(){
            // console.log(await User.find({}.populate('address')))
            return await User.find({})
        },
        async getAddresses(){
            return await Address.find({}).populate('user')
        },
        hello() {
            return 'Hi World'
        },
        hey() {
            return "GraphQL is fun"
        },
        randomPerson() {
            return {
                name: faker.name.firstName(),
                email: faker.internet.email(),
                lat: faker.address.latitude(),
                lng: faker.address.longitude(),
                street: faker.address.streetAddress
            }
        }
    },
};

const server = new ApolloServer({typeDefs,resolvers})

const app = express()

server.applyMiddleware({app})

app.listen({port:4000},()=>{
    console.log('server started at 4000')
})