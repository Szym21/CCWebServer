import * as net from 'net';
import { getStatusMessage, IHttpRequest, IHttpServer } from './types';
import { HttpRequest } from './httpRequest';

export class HttpServer implements IHttpServer {
    host;
    port;
    server;
    private debug = false;
    private listeners;
  
    constructor(
      host: string = '127.0.0.1',
      port: number = 80,
      debug: boolean = false
    ) {
      this.host = host;
      this.port = port;
      this.server = new net.Server();
      this.listeners = new Map<string, (request: IHttpRequest) => void>();
      this.debug = debug;
    }
  
    startServer() {
      if (this.server.listening) {
        return;
      }
      this.server.listen(this.port, this.host, () => {
        console.log(`Started listening on ${this.host}:${this.port}`);
      });
  
      this.server.on('connection', (sock) => {
        sock.on('data', (data) => {
          const input = data.toString();
  
          const request = this.parseRequest(sock, input);
  
          this.forwardRequestToListener(request);
        });
  
        sock.on(
          'send',
          (
            request: IHttpRequest,
            responseData: string = '',
            statusCode: number = 200
          ) => {
            const response = this.prepareResponse(
              request,
              responseData,
              statusCode
            );
  
            if (this.debug) {
              console.log(
                `${request.method} ${request.path} ${request.version} ${statusCode}`
              );
            }
  
            sock.write(response);
            sock.end();
            sock.destroy();
          }
        );
      });
    }

    private async forwardRequestToListener(request: IHttpRequest) {
      const key = `${request.method.toUpperCase()} ${request.path}`;
  
      if (this.listeners.has(key)) {
        try {
          const cb = this.listeners.get(key)!;
          await cb(request);
        } catch (e) {
          if (this.debug) {
            console.error(e);
          }
          request.send(undefined, 500);
        }
        return;
      }
  
      request.send(undefined, 400);
    }

    get(path: string, cb: (request: IHttpRequest) => void): void {
      this.listeners.set('GET ' + path, cb);
    }
  
    private prepareResponseHeader(
      request: IHttpRequest,
      statusCode: number = 200
    ): string {
      let str = `${request.version} ${statusCode} `;
      str += getStatusMessage(statusCode);
      str += '\r\n\r\n';
      return str;
    }
  
    private prepareResponse(
      request: IHttpRequest,
      responseData: string = '',
      statusCode: number = 200
    ): string {
      const headers = this.prepareResponseHeader(request, statusCode);
      return `${headers}${responseData}\r\n`;
    }
  
    stopServer() {
      this.server.close();
    }
  
    
    private parseRequestHeaders(elements: string[]): Map<string, string> {
      const headers = new Map<string, string>();
      for (let i = 1; i < elements.length; i++) {
        const elem = elements[i].split(':');
        headers.set(elem[0], elem[1]);
      }
      return headers;
    }

    private parseRequest(sock: net.Socket, data: string): IHttpRequest {
      const lines = data.split(/\r\n|\n/);
      const elements = lines[0].split(' ');
  
      const method = elements[0],
        path = elements[1],
        httpVersion = elements[2];
      const headers = this.parseRequestHeaders(lines);
  
      return new HttpRequest(sock, method, path, headers, httpVersion);
    }
  }