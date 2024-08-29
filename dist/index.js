#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const httpServer_1 = require("./httpServer");
const HOST = '127.0.0.1';
const PORT = 80;
const dir = path_1.default.join('./', 'www');
const createWebServer = (host = HOST, port = PORT, debug) => {
    const webServer = new httpServer_1.HttpServer(host, port);
    webServer.get('/', (request) => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((res) => setTimeout(res, 5000));
        request.sendFile(path_1.default.join(dir, 'index.html'));
    }));
    webServer.get('/index.html', (request) => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((res) => setTimeout(res, 5000));
        request.sendFile(path_1.default.join(dir, 'index.html'));
    }));
    webServer.get('/throw-error', () => __awaiter(void 0, void 0, void 0, function* () {
        throw new Error('Some error occurred');
    }));
    return webServer;
};
const server = createWebServer(HOST, PORT, true);
server.startServer();
//# sourceMappingURL=index.js.map