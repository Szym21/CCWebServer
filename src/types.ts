import * as net from 'net';

interface IHttpRequest {
    method : string;
    path : string;
    headers : Map<string, string>;
    version : string;
    send(data? : string) : void;
    send(data? : string, statusCode? : number) : void;
    sendFile(path: string) : void;
}

interface IHttpServer {
    host : string;
    port : number;
    server : net.Server;
    startServer() : void;
    stopServer() : void;
    get(path: string, callback : (request: IHttpRequest) => void) : void;
}

enum HttpStatusCodes {
    HTTP_200_OK = 200,
  
    HTTP_400_Not_Found = 400,
    HTTP_401_Unauthorized = 401,
  
    HTTP_500_Server_error = 500
}

function getStatusMessage(status?: number): string {
    switch (status) {
      case 200:
        return 'OK';
      case 400:
        return 'Not Found';
      case 401:
        return 'Unauthorized';
      case 500:
        return 'Server Error!';
    }
    return 'OK';
  }

export { IHttpRequest, IHttpServer, HttpStatusCodes, getStatusMessage}