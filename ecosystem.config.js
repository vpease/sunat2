module.exports = {
    apps: [
      {
        name: 'Sunat',
        script: './bin/www.js',
        instances: '4',
        exec_mode: 'cluster',
        max_memory_restart: '100M',
        wait_ready: true,
        restart_delay: 3000,
        autorestart: true,
        shutdown_with_message: true,
        watch: false,
        env: {
          UV_THREADPOOL_SIZE: 10,
          NODE_ENV: 'PRODUCTION',          
          PORT: 7070,
          NETWORK: '0.0.0.0',          
          homeUrl: "https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/",
          postUrl: "jcrS00Alias",
          pagePoolSize: 5,
          ocrPoolSize: 2,
          separador: '|',
          datos: 'padron_reducido_ruc.txt'
        },
        pmx: false,
      },
    ],
    deploy: {
      production: {
        user: 'control',
        key: '',
      },
    },
  };
  