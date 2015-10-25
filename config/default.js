export default {
  server: {
    ip: '127.0.0.1',
    port: parseInt(process.env.PORT, 10) || 8080,
  },
  mongodb: {
    host: 'localhost',
    database: 'walkapp',
  },
  secret: 'whatdidyouwanttoseehere',
  jwt: {
    expires: 1440,
  },
};
