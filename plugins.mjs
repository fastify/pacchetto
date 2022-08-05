export default {
  Scalability: [
    'fastify-healthcheck',
    '@fastify/under-pressure',
    'fastify-graceful-shutdown',
    'fastify-custom-healthcheck',
    '@gquittet/graceful-server',
    '@mgcrea/fastify-graceful-exit',
    '@dnlup/fastify-traps',
    '@fastify/rate-limit'
  ],
  Compatibility: [
    '@fastify/middie',
    '@fastify/express',
    'fastify-normalize-request-reply'
  ],
  Configuration: [
    'fastify-rob-config',
    'env-schema',
    '@fastify/env',
    'fastify-envalid'
  ],
  Essentials: ['@fastify/sensible', '@fastify/static'],
  TypeScript: [
    '@coobaha/typed-fastify',
    'fastify-decorators',
    'fastify-schema-to-typescript'
  ],
  Validation: [
    '@fastify/response-validation',
    'fastify-no-additional-properties',
    'fastify-schema-constraint',
    'fastify-split-validator'
  ],
  Routing: [
    'fastify-register-routes',
    'fastify-route-group',
    '@fastify/funky',
    '@fastify/circuit-breaker',
    '@fastify/routes',
    '@fastify/autoload',
    'fastify-autocrud',
    'fastify-autoroutes',
    'fastify-print-routes',
    'fastify-now',
    'fastify-loader',
    'fastify-reverse-routes',
    'oas-fastify',
    'openapi-validator-middleware',
    'fastify-file-routes',
    'fastify-crud-generator',
    '@fastify-resty/core'
  ],
  HTTP: [
    '@fastify/compress',
    '@fastify/cookie',
    '@fastify/cors',
    '@fastify/csrf-protection',
    '@fastify/accepts',
    '@fastify/accepts-serializer',
    '@fastify/multipart',
    '@fastify/helmet',
    '@fastify/http-proxy',
    '@fastify/formbody',
    'fastify-raw-body',
    'fastify-qs',
    '@fastify/url-data',
    'fastify-405',
    'fastify-http-context',
    'fastify-http2https',
    'fastify-http-errors-enhanced',
    'fastify-https-redirect',
    'fastify-multer',
    'fastify-method-override',
    'fastify-allow',
    'fastify-early-hints',
    'fastify-get-head',
    'fastify-get-only',
    'fastify-formidable',
    'fastify-file-upload'
  ],
  Frontend: [
    'fastify-vite',
    '@fastify/view',
    '@applicazza/fastify-nextjs',
    '@fastify/nextjs',
    'fastify-nuxtjs',
    'fastify-webpack-hmr',
    'fastify-vue-plugin',
    'fastify-bankai',
    'fastify-angular-universal',
    'fastify-minify',
    'fastify-babel'
  ],
  Databases: [
    '@fastify/postgres',
    'fastify-slonik',
    '@fastify/leveldb',
    '@fastify/mongodb',
    'fastify-oracle',
    'fastify-orientdb',
    'fastify-couchdb',
    'fastify-influxdb',
    'fastify-cockroachdb',
    'fast-water',
    'fastify-typeorm-plugin',
    'fastify-mongoose-api',
    'fastify-mongoose-driver',
    'fastify-bookshelf',
    'fastify-objectionjs',
    'fastify-objectionjs-classes',
    'fastify-knexjs',
    'sequelize-fastify'
  ],
  Redis: [
    '@fastify/redis',
    'fastify-redis-channels',
    '@mgcrea/fastify-session-redis-store',
    'fastify-lured'
  ],
  Caching: [
    '@fastify/caching',
    'fastify-response-caching',
    'async-cache-dedupe',
    'fastify-disablecache',
    'fastify-peekaboo'
  ],
  Authentication: [
    '@fastify/jwt',
    'fastify-jwt-authz',
    'fastify-jwt-webapp',
    '@fastify/oauth2',
    '@fastify/basic-auth',
    '@fastify/bearer-auth',
    'fastify-totp',
    '@fastify/auth',
    'fastify-auth0-verify',
    'fastify-esso',
    'fastify-api-key',
    'fastify-casbin',
    'fastify-casbin-rest',
    'fastify-casl',
    'fastify-tokenize',
    'fastify-rbac',
    'fastify-recaptcha',
    'fastify-grant',
    'fastify-guard'
  ],
  Messaging: [
    'fastify-nats',
    'fastify-hemera',
    'fastify-msgpack',
    'fastify-protobufjs',
    'fastify-amqp'
  ],
  Logging: [
    'fastify-response-time',
    '@mgcrea/fastify-request-logger',
    '@mgcrea/pino-pretty-compact',
    'cls-rtracer',
    'fastify-cloudevents'
  ],
  Networking: [
    '@fastify/reply-from',
    'fastify-vhost',
    'k-fastify-gateway',
    'fastify-tls-keygen',
    'fastify-http-client'
  ],
  Session: [
    '@fastify/secure-session',
    '@fastify/flash',
    '@fastify/session',
    'fastify-server-session',
    'fastify-good-sessions',
    '@mgcrea/fastify-session'
  ],
  Hashing: ['fastify-bcrypt'],
  Search: ['@fastify/elasticsearch'],
  Firebase: ['fastify-firebase-auth'],
  Kubernetes: ['arecibo', 'fastify-kubernetes'],
  AWS: ['fastify-xray', 'fastify-dynamodb'],
  'Google Cloud': ['fastify-gcloud-trace', 'fastify-google-cloud-storage'],
  Scheduling: ['fastify-piscina', '@fastify/schedule', 'fastify-bree'],
  SSE: ['fastify-sse', 'fastify-sse-v2'],
  XML: ['fastify-xml-body-parser', '@fastify/soap-client'],
  I18N: [
    'i18next-http-middleware',
    'fastify-polyglot',
    'fastify-language-parser'
  ],
  GraphQL: [
    'mercurius',
    'fastify-postgraphile',
    'fastify-hasura',
    'apollo-server-fastify'
  ],
  WebSocket: [
    'fastify-ws',
    '@fastify/websocket',
    'fastify-socket.io',
    'fastify-wamp-router'
  ],
  'Dependency Injection': ['@fastify/awilix'],
  Debugging: [
    'fastify-error-page',
    'fastify-boom',
    '@fastify/diagnostics-channel',
    'fastify-sentry'
  ],
  Documentation: [
    '@fastify/swagger',
    'fastify-openapi-docs',
    'fastify-openapi-glue',
    'fastify-oas'
  ],
  Observability: [
    '@dnlup/fastify-doc',
    'fastify-opentelemetry',
    'fastify-metrics',
    'nstats',
    '@immobiliarelabs/fastify-metrics'
  ],
  Testing: ['fastify-mongo-memory', 'fastify-knexjs-mock', 'fastify-explorer'],
  Email: ['fastify-mailer', 'fastify-nodemailer'],
  Others: [
    '@fastify/request-context',
    'fastify-prettier',
    'fastify-no-icon',
    'fastify-favicon',
    '@chonla/fastify-qrcode',
    'fastify-markdown',
    'fastify-blipp',
    'fastify-feature-flags',
    '@trubavuong/fastify-seaweedfs',
    'fastify-dynareg',
    'fastify-appwrite',
    'fastify-twitch-ebs-tools',
    'fastify-stripe',
    'fastify-supabase',
    'fastify-secrets-hashicorp'
  ]
}
