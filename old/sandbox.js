"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mark = void 0;
var defaults = {};
function Mark(opts) {
    if (opts === void 0) { opts = {}; }
    opts = __assign(__assign({}, defaults), opts);
}
exports.Mark = Mark;
Mark.prototype.convert = function (markdown) {
    // return this.renderer.render(this.lexer.lex(markdown))
};
var ExampleRule = {
    name: 'example',
    match: /^[^\n*]+/,
    tokenize: function (match) {
        var text = match[0];
        this.text = text;
        var re = /foo/;
        re.exec('bar');
        return {
            render: function () {
                return '';
            }
        };
    }
};
var tokenizer = function (source, rules) {
    if (rules === void 0) { rules = [ExampleRule]; }
    var length = source.length;
    var i = 0;
    while (i < length) {
        for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
            var rule = rules_1[_i];
            var match = rule.match instanceof RegExp
                ? rule.match.exec(source.slice(i))
                : rule.match(source.slice(1));
            if (!match)
                continue;
            rule.tokenize(match);
        }
    }
};
var renderer = function (tokens) {
};
var tokens = {};
