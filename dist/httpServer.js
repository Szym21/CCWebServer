"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServer = void 0;
const net = __importStar(require("net"));
const types_1 = require("./types");
const httpRequest_1 = require("./httpRequest");
class HttpServer {
    constructor(host = '127.0.0.1', port = 80, debug = false) {
        this.debug = false;
        this.host = host;
        this.port = port;
        this.server = new net.Server();
        this.listeners = new Map();
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
            sock.on('send', (request, responseData = '', statusCode = 200) => {
                const response = this.prepareResponse(request, responseData, statusCode);
                if (this.debug) {
                    console.log(`${request.method} ${request.path} ${request.version} ${statusCode}`);
                }
                sock.write(response);
                sock.end();
                sock.destroy();
            });
        });
    }
    forwardRequestToListener(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `${request.method.toUpperCase()} ${request.path}`;
            if (this.listeners.has(key)) {
                try {
                    const cb = this.listeners.get(key);
                    yield cb(request);
                }
                catch (e) {
                    if (this.debug) {
                        console.error(e);
                    }
                    request.send(undefined, 500);
                }
                return;
            }
            request.send(undefined, 400);
        });
    }
    get(path, cb) {
        this.listeners.set('GET ' + path, cb);
    }
    prepareResponseHeader(request, statusCode = 200) {
        let str = `${request.version} ${statusCode} `;
        str += (0, types_1.getStatusMessage)(statusCode);
        str += '\r\n\r\n';
        return str;
    }
    prepareResponse(request, responseData = '', statusCode = 200) {
        const headers = this.prepareResponseHeader(request, statusCode);
        return `${headers}${responseData}\r\n`;
    }
    stopServer() {
        this.server.close();
    }
    parseRequestHeaders(elements) {
        const headers = new Map();
        for (let i = 1; i < elements.length; i++) {
            const elem = elements[i].split(':');
            headers.set(elem[0], elem[1]);
        }
        return headers;
    }
    parseRequest(sock, data) {
        const lines = data.split(/\r\n|\n/);
        const elements = lines[0].split(' ');
        const method = elements[0], path = elements[1], httpVersion = elements[2];
        const headers = this.parseRequestHeaders(lines);
        return new httpRequest_1.HttpRequest(sock, method, path, headers, httpVersion);
    }
}
exports.HttpServer = HttpServer;
//# sourceMappingURL=httpServer.js.map