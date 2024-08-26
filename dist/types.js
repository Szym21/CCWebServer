"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatusCodes = void 0;
exports.getStatusMessage = getStatusMessage;
var HttpStatusCodes;
(function (HttpStatusCodes) {
    HttpStatusCodes[HttpStatusCodes["HTTP_200_OK"] = 200] = "HTTP_200_OK";
    HttpStatusCodes[HttpStatusCodes["HTTP_400_Not_Found"] = 400] = "HTTP_400_Not_Found";
    HttpStatusCodes[HttpStatusCodes["HTTP_401_Unauthorized"] = 401] = "HTTP_401_Unauthorized";
    HttpStatusCodes[HttpStatusCodes["HTTP_500_Server_error"] = 500] = "HTTP_500_Server_error";
})(HttpStatusCodes || (exports.HttpStatusCodes = HttpStatusCodes = {}));
function getStatusMessage(status) {
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
//# sourceMappingURL=types.js.map