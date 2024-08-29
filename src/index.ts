#! /usr/bin/env node

import path from 'path';
import { HttpServer } from './httpServer';
const HOST = '127.0.0.1';
const PORT = 80;
const dir = path.join('./', 'www');


const createWebServer = (
    host: string = HOST,
    port: number = PORT,
    debug? : boolean
  ): HttpServer => {
    const webServer: HttpServer = new HttpServer(host, port);
  
    webServer.get('/', async (request) => {
      await new Promise((res) => setTimeout(res, 5000));
      request.sendFile(path.join(dir, 'index.html'));
    });
  
    webServer.get('/index.html', async (request) => {
      await new Promise((res) => setTimeout(res, 5000));
      request.sendFile(path.join(dir, 'index.html'));
    });
  
    webServer.get('/throw-error', async () => {
      throw new Error('Some error occurred');
    });
  return webServer;
};

const server = createWebServer(HOST, PORT, true)
server.startServer();