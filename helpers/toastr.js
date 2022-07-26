"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToaStr = void 0;
class ToaStr {
}
exports.ToaStr = ToaStr;
ToaStr.set = (req, message, live = false) => {
    req.session.message = message;
};
