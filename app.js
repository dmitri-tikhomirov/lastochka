const http = require('http');

const config = require('./config');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(config.transporter);

const server = http.createServer((req, res) => {
  if (req.url === '/message' && req.method === 'POST') {
    const body = [];

    req.on('data', chunk => {
      body.push(chunk);
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const phone = decodeURIComponent(parsedBody.split('&')[0].split('=')[1]
        .replace(/\+/g, ' '));
      const name = decodeURIComponent(parsedBody.split('&')[1].split('=')[1]
        .replace(/\+/g, ' '));
      const message = decodeURIComponent(parsedBody.split('&')[2].split('=')[1]
        .replace(/\+/g, ' '));

      transporter.sendMail({
        to: 'lastochkakrd@yandex.ru',
        from: config.from,
        subject: 'Заявка с сайта',
        html:
          '<div style="' +
          'display: inline-block;' +
          'padding: 24px;' +
          'background-color: #e9eae4;' +
          'color: #111;' +
          'border: 1px solid #111;">' +
          '<b>Заявка с сайта:</b><br><br>' +
          '<b>Телефон:</b> ' + phone + '<br>' +
          '<b>Имя:</b> ' + name + '<br>' +
          '<b>Комментарий:</b> ' + message +
          '</div>'
      }, (error, info) => {
        if (error) {
          res.statusCode = 502;
          res.write('Email not sent');
          res.end();

          console.log(error);
        } else {
          res.statusCode = 200;
          res.write('Email sent');
          res.end();

          console.log('Email sent: ' + info.response);
        }
      });
    });
  }
});

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});