"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(graph, flagKey) {
        _classCallCheck(this, _class);

        this.graph = graph;
        this.flagKey = flagKey;
    }

    _createClass(_class, [{
        key: "clearFlags",
        value: function clearFlags(graph) {
            var _this = this;

            this.graph.forEachVertex(function (v) {
                delete v[_this.flagKey];
            });
        }
    }, {
        key: "getFlags",
        value: function getFlags(v) {
            return v[this.flagKey] || {};
        }
    }, {
        key: "setFlags",
        value: function setFlags(v, flags) {
            if (!v.hasOwnProperty(this.flagKey)) {
                v[this.flagKey] = {};
            }
            for (var key in flags) {
                v[this.flagKey][key] = flags[key];
            }
        }
    }]);

    return _class;
}();

exports.default = _class;
module.exports = exports['default'];
//# sourceMappingURL=nodeFlagger.js.map