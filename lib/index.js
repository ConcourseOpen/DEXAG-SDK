"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEXAG = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _ethers = require("ethers");

var _validate = _interopRequireDefault(require("./services/validate"));

var _trading = _interopRequireDefault(require("./services/trading"));

var _utility = _interopRequireDefault(require("./services/utility"));

// Services
var DEXAG =
/*#__PURE__*/
function () {
  function DEXAG() {
    (0, _classCallCheck2["default"])(this, DEXAG);
    if (!window.web3) window.web3 = {};
    var currentProvider = window.web3.currentProvider;
    if (!currentProvider) return; // exit if no web3 found

    this.provider = new _ethers.ethers.providers.Web3Provider(currentProvider);
    this.signer = this.provider.getSigner();

    window.web3StatusHandler = function () {}; // preset status handler

  }

  (0, _createClass2["default"])(DEXAG, [{
    key: "sendTrade",
    value: function () {
      var _sendTrade = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(trade, details) {
        var value, status, tx, fast_gas, sender, estimateTx, estimate, receipt;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                value = _ethers.ethers.utils.bigNumberify(trade.value);
                status = {};
                tx = {
                  to: trade.to,
                  data: trade.data,
                  value: value,
                  gasLimit: 500000
                }; // Set gas and handle bancor exception

                if (!(details.dex != 'bancor')) {
                  _context.next = 11;
                  break;
                }

                window.web3StatusHandler('init');
                _context.next = 7;
                return _trading["default"].getGas();

              case 7:
                fast_gas = _context.sent;
                tx.gasPrice = fast_gas;
                _context.next = 13;
                break;

              case 11:
                window.web3StatusHandler('bancor_notice');
                tx.gasPrice = _ethers.ethers.utils.bigNumberify(trade.metadata.gasPrice);

              case 13:
                _context.prev = 13;
                _context.next = 16;
                return this.signer.getAddress();

              case 16:
                sender = _context.sent;
                estimateTx = (0, _objectSpread2["default"])({}, tx, {
                  from: sender
                });
                _context.next = 20;
                return this.provider.estimateGas(estimateTx);

              case 20:
                estimate = _context.sent;
                tx.gasLimit = parseInt(estimate.toString()) * 1.2;
                _context.next = 28;
                break;

              case 24:
                _context.prev = 24;
                _context.t0 = _context["catch"](13);
                window.web3StatusHandler('bad_tx');
                return _context.abrupt("return");

              case 28:
                _context.prev = 28;
                _context.next = 31;
                return this.signer.sendTransaction(tx);

              case 31:
                status = _context.sent;
                _context.next = 43;
                break;

              case 34:
                _context.prev = 34;
                _context.t1 = _context["catch"](28);

                if (window.ethereum.isImToken) {
                  _context.next = 39;
                  break;
                }

                window.web3StatusHandler('rejected');
                return _context.abrupt("return");

              case 39:
                if (!(_context.t1.errorCode == 1001)) {
                  _context.next = 42;
                  break;
                }

                window.web3StatusHandler('rejected');
                return _context.abrupt("return");

              case 42:
                if (typeof _context.t1.transactionHash == 'string') {
                  status.hash = _context.t1.transactionHash;
                }

              case 43:
                // Trade sent
                window.web3StatusHandler('send_trade', status.hash);
                _context.next = 46;
                return _utility["default"].waitForReceipt(status.hash, this.provider);

              case 46:
                receipt = _context.sent;

                _utility["default"].track(status, details, trade);

                _utility["default"].handleReceipt(status, receipt);

              case 49:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[13, 24], [28, 34]]);
      }));

      function sendTrade(_x, _x2) {
        return _sendTrade.apply(this, arguments);
      }

      return sendTrade;
    }()
  }, {
    key: "unwrap",
    value: function () {
      var _unwrap = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(amount) {
        var wethContract;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                wethContract = _utility["default"].getWethContract(this.signer);

                _trading["default"].unwrap(wethContract, amount);

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function unwrap(_x3) {
        return _unwrap.apply(this, arguments);
      }

      return unwrap;
    }() // Public Functions

  }, {
    key: "getBest",
    value: function () {
      var _getBest = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(_ref) {
        var to, from, amount, dex, bestTrade;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                to = _ref.to, from = _ref.from, amount = _ref.amount, dex = _ref.dex;
                _context3.next = 3;
                return _trading["default"].getBest({
                  to: to,
                  from: from,
                  amount: amount,
                  dex: dex
                });

              case 3:
                bestTrade = _context3.sent;
                return _context3.abrupt("return", bestTrade);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function getBest(_x4) {
        return _getBest.apply(this, arguments);
      }

      return getBest;
    }()
  }, {
    key: "tradeOrder",
    value: function () {
      var _tradeOrder = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(_ref2) {
        var tx, _tx$metadata, input, output, source, details;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                tx = _ref2.tx;
                _tx$metadata = tx.metadata, input = _tx$metadata.input, output = _tx$metadata.output, source = _tx$metadata.source;
                details = {
                  pair: {
                    base: 'test_base',
                    quote: 'test_quote'
                  },
                  amount: 1,
                  dex: source.dex,
                  isBuying: true
                };
                this.sendTrade(tx, details);

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function tradeOrder(_x5) {
        return _tradeOrder.apply(this, arguments);
      }

      return tradeOrder;
    }()
  }, {
    key: "validateWeb3",
    value: function () {
      var _validateWeb = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(trade) {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.provider) this.signer = this.provider.getSigner();
                return _context5.abrupt("return", _validate["default"].web3(trade, this.provider, this.signer));

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function validateWeb3(_x6) {
        return _validateWeb.apply(this, arguments);
      }

      return validateWeb3;
    }()
  }, {
    key: "registerStatusHandler",
    value: function () {
      var _registerStatusHandler = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(handler) {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                window.web3StatusHandler = handler;

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function registerStatusHandler(_x7) {
        return _registerStatusHandler.apply(this, arguments);
      }

      return registerStatusHandler;
    }()
  }]);
  return DEXAG;
}();

exports.DEXAG = DEXAG;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJERVhBRyIsIndpbmRvdyIsIndlYjMiLCJjdXJyZW50UHJvdmlkZXIiLCJwcm92aWRlciIsImV0aGVycyIsInByb3ZpZGVycyIsIldlYjNQcm92aWRlciIsInNpZ25lciIsImdldFNpZ25lciIsIndlYjNTdGF0dXNIYW5kbGVyIiwidHJhZGUiLCJkZXRhaWxzIiwidmFsdWUiLCJ1dGlscyIsImJpZ051bWJlcmlmeSIsInN0YXR1cyIsInR4IiwidG8iLCJkYXRhIiwiZ2FzTGltaXQiLCJkZXgiLCJ0cmFkaW5nIiwiZ2V0R2FzIiwiZmFzdF9nYXMiLCJnYXNQcmljZSIsIm1ldGFkYXRhIiwiZ2V0QWRkcmVzcyIsInNlbmRlciIsImVzdGltYXRlVHgiLCJmcm9tIiwiZXN0aW1hdGVHYXMiLCJlc3RpbWF0ZSIsInBhcnNlSW50IiwidG9TdHJpbmciLCJzZW5kVHJhbnNhY3Rpb24iLCJldGhlcmV1bSIsImlzSW1Ub2tlbiIsImVycm9yQ29kZSIsInRyYW5zYWN0aW9uSGFzaCIsImhhc2giLCJ1dGlsaXR5Iiwid2FpdEZvclJlY2VpcHQiLCJyZWNlaXB0IiwidHJhY2siLCJoYW5kbGVSZWNlaXB0IiwiYW1vdW50Iiwid2V0aENvbnRyYWN0IiwiZ2V0V2V0aENvbnRyYWN0IiwidW53cmFwIiwiZ2V0QmVzdCIsImJlc3RUcmFkZSIsImlucHV0Iiwib3V0cHV0Iiwic291cmNlIiwicGFpciIsImJhc2UiLCJxdW90ZSIsImlzQnV5aW5nIiwic2VuZFRyYWRlIiwidmFsaWRhdGUiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBSEE7SUFLYUEsSzs7O0FBRVgsbUJBQWM7QUFBQTtBQUNaLFFBQUksQ0FBQ0MsTUFBTSxDQUFDQyxJQUFaLEVBQWtCRCxNQUFNLENBQUNDLElBQVAsR0FBYyxFQUFkO0FBRE4sUUFFTkMsZUFGTSxHQUVjRixNQUFNLENB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QUExQixFQUFvQyxLQUFLSSxNQUF6QyxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cURBR21CcUQsTzs7Ozs7QUFDMUI1RCxnQkFBQUEsTUFBTSxDQUFDUyxpQkFBUCxHQUEyQm1ELE9BQTNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXRoZXJzIH0gZnJvbSAnZXRoZXJzJztcblxuLy8gU2VydmljZXNcbmltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3NlcnZpY2VzL3ZhbGlkYXRlJztcbmltcG9ydCB0cmFkaW5nIGZyb20gJy4vc2VydmljZXMvdHJhZGluZyc7XG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuL3NlcnZpY2VzL3V0aWxpdHknO1xuXG5leHBvcnQgY2xhc3MgREVYQUcge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICghd2luZG93LndlYjMpIHdpbmRvdy53ZWIzID0ge307XG4gICAgbGV0IHsgY3VycmVudFByb3ZpZGVyIH0gPSB3aW5kb3cud2ViMztcbiAgICBpZiAoIWN1cnJlbnRQcm92aWRlcikgcmV0dXJuOyAvLyBleGl0IGlmIG5vIHdlYjMgZm91bmRcbiAgICB0aGlzLnByb3ZpZGVyID0gbmV3IGV0aGVycy5wcm92aWRlcnMuV2ViM1Byb3ZpZGVyKGN1cnJlbnRQcm92aWRlcik7XG4gICAgdGhpcy5zaWduZXIgPSB0aGlzLnByb3ZpZGVyLmdldFNpZ25lcigpO1xuICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlciA9ICgpPT57fSAvLyBwcmVzZXQgc3RhdHVzIGhhbmRsZXJcbiAgfVxuXG4gIGFzeW5jIHNlbmRUcmFkZSh0cmFkZSwgZGV0YWlscykge1xuICAgIGNvbnN0IHZhbHVlID0gZXRoZXJzLnV0aWxzLmJpZ051bWJlcmlmeSh0cmFkZS52YWx1ZSk7XG4gICAgbGV0IHN0YXR1cyA9IHt9O1xuICAgIGNvbnN0IHR4ID0ge1xuICAgICAgdG86IHRyYWRlLnRvLFxuICAgICAgZGF0YTogdHJhZGUuZGF0YSxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGdhc0xpbWl0OiA1MDAwMDBcbiAgICB9O1xuICAgIC8vIFNldCBnYXMgYW5kIGhhbmRsZSBiYW5jb3IgZXhjZXB0aW9uXG4gICAgaWYoZGV0YWlscy5kZXghPSdiYW5jb3InKXtcbiAgICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignaW5pdCcpO1xuICAgICAgY29uc3QgZmFzdF9nYXMgPSBhd2FpdCB0cmFkaW5nLmdldEdhcygpO1xuICAgICAgdHguZ2FzUHJpY2UgPSBmYXN0X2dhcztcbiAgICB9ZWxzZXtcbiAgICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignYmFuY29yX25vdGljZScpO1xuICAgICAgdHguZ2FzUHJpY2UgPSBldGhlcnMudXRpbHMuYmlnTnVtYmVyaWZ5KHRyYWRlLm1ldGFkYXRhLmdhc1ByaWNlKTtcbiAgICB9XG4gICAgLy8gZXN0aW1hdGUgZ2FzXG4gICAgdHJ5e1xuICAgICAgY29uc3Qgc2VuZGVyID0gYXdhaXQgdGhpcy5zaWduZXIuZ2V0QWRkcmVzcygpO1xuICAgICAgY29uc3QgZXN0aW1hdGVUeCA9IHsgLi4udHgsIGZyb206IHNlbmRlciB9O1xuICAgICAgY29uc3QgZXN0aW1hdGUgPSBhd2FpdCB0aGlzLnByb3ZpZGVyLmVzdGltYXRlR2FzKGVzdGltYXRlVHgpO1xuICAgICAgdHguZ2FzTGltaXQgPSBwYXJzZUludChlc3RpbWF0ZS50b1N0cmluZygpKSoxLjJcbiAgICB9Y2F0Y2goZXJyKXtcbiAgICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignYmFkX3R4Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGF0dGVtcHQgc2VuZGluZyB0cmFkZVxuICAgIHRyeXtcbiAgICAgIHN0YXR1cyA9IGF3YWl0IHRoaXMuc2lnbmVyLnNlbmRUcmFuc2FjdGlvbih0eCk7XG4gICAgfWNhdGNoKGVycil7XG4gICAgICAvLyBpc3N1ZSBzZW5kaW5nIHR4XG4gICAgICBpZighd2luZG93LmV0aGVyZXVtLmlzSW1Ub2tlbil7XG4gICAgICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcigncmVqZWN0ZWQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGVyci5lcnJvckNvZGUgPT0gMTAwMSkge1xuICAgICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ3JlamVjdGVkJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgZXJyLnRyYW5zYWN0aW9uSGFzaCA9PSAnc3RyaW5nJyl7XG4gICAgICAgIHN0YXR1cy5oYXNoID0gZXJyLnRyYW5zYWN0aW9uSGFzaFxuICAgICAgfVxuICAgIH1cbiAgICAvLyBUcmFkZSBzZW50XG4gICAgd2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdzZW5kX3RyYWRlJywgc3RhdHVzLmhhc2gpO1xuICAgIGNvbnN0IHJlY2VpcHQgPSBhd2FpdCB1dGlsaXR5LndhaXRGb3JSZWNlaXB0KHN0YXR1cy5oYXNoLCB0aGlzLnByb3ZpZGVyKTtcbiAgICB1dGlsaXR5LnRyYWNrKHN0YXR1cywgZGV0YWlscywgdHJhZGUpXG4gICAgdXRpbGl0eS5oYW5kbGVSZWNlaXB0KHN0YXR1cywgcmVjZWlwdCk7XG4gIH1cblxuICBhc3luYyB1bndyYXAoYW1vdW50KSB7XG4gICAgY29uc3Qgd2V0aENvbnRyYWN0ID0gdXRpbGl0eS5nZXRXZXRoQ29udHJhY3QodGhpcy5zaWduZXIpO1xuICAgIHRyYWRpbmcudW53cmFwKHdldGhDb250cmFjdCwgYW1vdW50KTtcbiAgfVxuXG4gIC8vIFB1YmxpYyBGdW5jdGlvbnNcblxuICBhc3luYyBnZXRCZXN0KHt0bywgZnJvbSwgYW1vdW50LCBkZXh9KSB7XG4gICAgY29uc3QgYmVzdFRyYWRlID0gYXdhaXQgdHJhZGluZy5nZXRCZXN0KHt0bywgZnJvbSwgYW1vdW50LCBkZXh9KTtcbiAgICByZXR1cm4gYmVzdFRyYWRlXG4gIH1cblxuICBhc3luYyB0cmFkZU9yZGVyKHt0eH0pIHtcbiAgICBsZXQge2lucHV0LCBvdXRwdXQsIHNvdXJjZX0gPSB0eC5tZXRhZGF0YTtcbiAgICB2YXIgZGV0YWlscyA9IHtwYWlyOiB7YmFzZTondGVzdF9iYXNlJywgcXVvdGU6J3Rlc3RfcXVvdGUnfSwgYW1vdW50OiAxLCBkZXg6IHNvdXJjZS5kZXgsIGlzQnV5aW5nOiB0cnVlfVxuICAgIHRoaXMuc2VuZFRyYWRlKHR4LCBkZXRhaWxzKVxuICB9XG5cbiAgYXN5bmMgdmFsaWRhdGVXZWIzKHRyYWRlKSB7XG4gICAgaWYodGhpcy5wcm92aWRlcikgdGhpcy5zaWduZXIgPSB0aGlzLnByb3ZpZGVyLmdldFNpZ25lcigpO1xuICAgIHJldHVybiB2YWxpZGF0ZS53ZWIzKHRyYWRlLCB0aGlzLnByb3ZpZGVyLCB0aGlzLnNpZ25lcik7XG4gIH1cblxuICBhc3luYyByZWdpc3RlclN0YXR1c0hhbmRsZXIoaGFuZGxlcikge1xuICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlciA9IGhhbmRsZXI7XG4gIH1cbiAgXG59XG4iXX0=