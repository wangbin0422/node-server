import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import * as fs from "fs";
import * as p from 'path';
import * as url from 'url';

const server = http.createServer()
const publicDir = p.resolve(__dirname, 'public')

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  console.info('request method', request.method)
  console.info('request headers', request.headers)
  const {method, url: path, headers} = request;
  const { pathname, search } = url.parse(path);
  let cacheTime = 3600 * 24 *365

  let filename = pathname.substr(1);
  if(filename === '') {
    filename = 'index.html'
  }
  fs.readFile(p.resolve(publicDir, filename), (error, data) => {
    if (error) {
      console.info(error)
      if(error.errno === -4058) {
        response.statusCode = 404
        fs.readFile(p.resolve(publicDir, '404.html'), (error, data) => {
          response.end(data)
        })
      } else {
        response.statusCode = 500;
        response.end('Internal Error')
      }
    } else {
      // set cache
      response.setHeader('Cache-Control', `public, max-age=${cacheTime}`)
      response.end(data)
    }
  })
})


server.listen(8088);

