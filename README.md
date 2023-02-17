# NestJS mircoservices

This project represents a backend for some alleged online school. It is split into microservices which communication is fully asyncronous and uses ```RabbitMQ``` as transport layer.

This application also follows ```CQRS``` (Command Query Responsibility Segregation) pattern for a better backend design.

## Brief overview
The following schema illustrates 2 microservices: API Gateway, Accounts and any possible relations between them:

![Schema](https://sun9-76.userapi.com/impg/l4f34MDawLcJIgnbPCbdOJFzhsnY8AC9Y9iUCw/8mCXtkDfrZ0.jpg?size=2087x1445&quality=95&sign=0b517a6cb078efee0d1c3fee32b893bd&type=album)

## Sagas
Data consistency is guaranteed by Sagas - a design pattern which helps to conveniently handle entities that can have multiple states.

![Schema](https://sun9-72.userapi.com/impg/3BuQ_Q01rxPJXmAodz6zSjco48kakXOaczlung/_nL-Tc8QSCY.jpg?size=1019x413&quality=95&sign=efc1cee58fd0e8c3da4f8f429ecaa96b&type=album)

Sagas can be found in ```/apps/account/src/app/user/sagas```

## Tech
- [NestJS](https://nestjs.com/) as the most progressive NodJS framework;
- [MongoDB](https://www.mongodb.com/) for data storage;
- [RabbitMQ](https://www.rabbitmq.com/) as nearly the most popular message broker;
- [Nx Monorepo](https://nx.dev) because why not?