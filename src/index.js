const {ApolloServer} = require('apollo-server')
const fs = require('fs')
const path = require('path')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()







//resolvers - implementation of the graphQL schema


const resolvers = {
    Query: {
        info: () => `This is the API graphql project`,

        //access prisma object via context argument
        feed: async (parent, args, context) => {
          return context.prisma.link.findMany()
        },
      },
    Mutation: {
        //call create method on link from prisma client api
        //as arguments, passing the data that the resolvers receive via the args parameter
        post:(parent,args, context,info)=>{
            const newLink = context.prisma.link.create({
                data:{
                    url:args.url,
                    description: args.description,
                },
            })
            return newLink
        },
        delete:(parent,args, context, info)=>{
            return context.prisma.link.delete({
                where: {id: args.id}
            },
            info
            )
        }
    }
}

//schema and resolvers passed to ApolloServer. 
//tells the server what API operations are accepted and how they should be resolved
const server = new ApolloServer ({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    //the context object that's passed  into the graphql resolvers is initialized here bc attaching prisma
    context:{
        prisma,
    }
})


server
    .listen()
    .then(({url})=>
        console.log(`Server is running on ${url}`)
    )
