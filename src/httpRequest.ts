import * as net from 'net';
import * as fs from 'fs';
import { IHttpRequest } from './types';

class HttpRequest implements IHttpRequest {
    private sock: net.Socket;
    method;
    path;
    headers;
    version;
  
    constructor(
      sock: net.Socket,
      method: string,
      path: string,
      headers: Map<string, string> = new Map<string, string>(),
      version: string
    ) {
      this.sock = sock;
      this.method = method;
      this.path = path;
      this.headers = headers;
      this.version = version;
    }
  
    send(data = '', statusCode = 200) {
      this.sock.emit('send', this, data, statusCode);
    }
  
    sendFile(path: string) {
      if (fs.existsSync(path)) {
        this.sock.emit('send', this, fs.readFileSync(path).toString(), 200);
        return;
      }
  
      this.sock.emit('send', this, undefined, 404);
      throw new Error('File does not exists: ' + path);
    }
  }

  export { HttpRequest }