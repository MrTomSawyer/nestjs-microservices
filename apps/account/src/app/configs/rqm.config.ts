import { ConfigModule, ConfigService } from "@nestjs/config"

export const getRMQconfig = () => ({
  inject: [ConfigService],
  import: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    exchangeName: configService.get('AMQP_EXCHANGE', ''),
    connections: [
      {
        login: configService.get('AMQP_USER', ''),
        password: configService.get('AMQP_PASSWORD', ''),
        host: configService.get('AMQP_HOST', ''),
      }
    ],
    queueName: configService.get('AMQP_QUEUE', ''),
    prefetchCount: 32,
    serviceName: 'school-account'
  })
});