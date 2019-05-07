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

                _utility["default"].track(status, details);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJERVhBRyIsIndpbmRvdyIsIndlYjMiLCJjdXJyZW50UHJvdmlkZXIiLCJwcm92aWRlciIsImV0aGVycyIsInByb3ZpZGVycyIsIldlYjNQcm92aWRlciIsInNpZ25lciIsImdldFNpZ25lciIsIndlYjNTdGF0dXNIYW5kbGVyIiwidHJhZGUiLCJkZXRhaWxzIiwidmFsdWUiLCJ1dGlscyIsImJpZ051bWJlcmlmeSIsInN0YXR1cyIsInR4IiwidG8iLCJkYXRhIiwiZ2FzTGltaXQiLCJkZXgiLCJ0cmFkaW5nIiwiZ2V0R2FzIiwiZmFzdF9nYXMiLCJnYXNQcmljZSIsIm1ldGFkYXRhIiwiZ2V0QWRkcmVzcyIsInNlbmRlciIsImVzdGltYXRlVHgiLCJmcm9tIiwiZXN0aW1hdGVHYXMiLCJlc3RpbWF0ZSIsInBhcnNlSW50IiwidG9TdHJpbmciLCJzZW5kVHJhbnNhY3Rpb24iLCJldGhlcmV1bSIsImlzSW1Ub2tlbiIsImVycm9yQ29kZSIsInRyYW5zYWN0aW9uSGFzaCIsImhhc2giLCJ1dGlsaXR5Iiwid2FpdEZvclJlY2VpcHQiLCJyZWNlaXB0IiwidHJhY2siLCJoYW5kbGVSZWNlaXB0IiwiYW1vdW50Iiwid2V0aENvbnRyYWN0IiwiZ2V0V2V0aENvbnRyYWN0IiwidW53cmFwIiwiZ2V0QmVzdCIsImJlc3RUcmFkZSIsImlucHV0Iiwib3V0cHV0Iiwic291cmNlIiwicGFpciIsImJhc2UiLCJxdW90ZSIsImlzQnV5aW5nIiwic2VuZFRyYWRlIiwidmFsaWRhdGUiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBSEE7SUFLYUEsSzs7O0FBRVosbUJBQWM7QUFBQTtBQUNiLFFBQUksQ0FBQ0MsTUFBTSxDQUFDQyxJQUFaLEVBQWtCRCxNQUFNLENBQUNDLElBQVAsR0FBYyxFQUFkO0FBREwsUUFFUEMsZUFGTyxHQUVhRixNQUFNLENB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QUFLSSxNQUF6QyxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cURBR29CcUQsTzs7Ozs7QUFDM0I1RCxnQkFBQUEsTUFBTSxDQUFDUyxpQkFBUCxHQUEyQm1ELE9BQTNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXRoZXJzIH0gZnJvbSAnZXRoZXJzJztcblxuLy8gU2VydmljZXNcbmltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3NlcnZpY2VzL3ZhbGlkYXRlJztcbmltcG9ydCB0cmFkaW5nIGZyb20gJy4vc2VydmljZXMvdHJhZGluZyc7XG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuL3NlcnZpY2VzL3V0aWxpdHknO1xuXG5leHBvcnQgY2xhc3MgREVYQUcge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdGlmICghd2luZG93LndlYjMpIHdpbmRvdy53ZWIzID0ge307XG5cdFx0bGV0IHsgY3VycmVudFByb3ZpZGVyIH0gPSB3aW5kb3cud2ViMztcblx0XHRpZiAoIWN1cnJlbnRQcm92aWRlcikgcmV0dXJuOyAvLyBleGl0IGlmIG5vIHdlYjMgZm91bmRcblx0XHR0aGlzLnByb3ZpZGVyID0gbmV3IGV0aGVycy5wcm92aWRlcnMuV2ViM1Byb3ZpZGVyKGN1cnJlbnRQcm92aWRlcik7XG5cdFx0dGhpcy5zaWduZXIgPSB0aGlzLnByb3ZpZGVyLmdldFNpZ25lcigpO1xuXHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlciA9ICgpPT57fSAvLyBwcmVzZXQgc3RhdHVzIGhhbmRsZXJcblx0fVxuXG5cdGFzeW5jIHNlbmRUcmFkZSh0cmFkZSwgZGV0YWlscykge1xuXHRcdGNvbnN0IHZhbHVlID0gZXRoZXJzLnV0aWxzLmJpZ051bWJlcmlmeSh0cmFkZS52YWx1ZSk7XG5cdFx0bGV0IHN0YXR1cyA9IHt9O1xuXHRcdGNvbnN0IHR4ID0ge1xuXHRcdFx0dG86IHRyYWRlLnRvLFxuXHRcdFx0ZGF0YTogdHJhZGUuZGF0YSxcblx0XHRcdHZhbHVlOiB2YWx1ZSxcblx0XHRcdGdhc0xpbWl0OiA1MDAwMDBcblx0XHR9O1xuXHRcdC8vIFNldCBnYXMgYW5kIGhhbmRsZSBiYW5jb3IgZXhjZXB0aW9uXG5cdFx0aWYoZGV0YWlscy5kZXghPSdiYW5jb3InKXtcblx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignaW5pdCcpO1xuXHRcdFx0Y29uc3QgZmFzdF9nYXMgPSBhd2FpdCB0cmFkaW5nLmdldEdhcygpO1xuXHRcdFx0dHguZ2FzUHJpY2UgPSBmYXN0X2dhcztcblx0XHR9ZWxzZXtcblx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignYmFuY29yX25vdGljZScpO1xuXHRcdFx0dHguZ2FzUHJpY2UgPSBldGhlcnMudXRpbHMuYmlnTnVtYmVyaWZ5KHRyYWRlLm1ldGFkYXRhLmdhc1ByaWNlKTtcblx0XHR9XG5cdFx0Ly8gZXN0aW1hdGUgZ2FzXG5cdFx0dHJ5e1xuXHRcdFx0Y29uc3Qgc2VuZGVyID0gYXdhaXQgdGhpcy5zaWduZXIuZ2V0QWRkcmVzcygpO1xuXHRcdFx0Y29uc3QgZXN0aW1hdGVUeCA9IHsgLi4udHgsIGZyb206IHNlbmRlciB9O1xuXHRcdFx0Y29uc3QgZXN0aW1hdGUgPSBhd2FpdCB0aGlzLnByb3ZpZGVyLmVzdGltYXRlR2FzKGVzdGltYXRlVHgpO1xuXHRcdFx0dHguZ2FzTGltaXQgPSBwYXJzZUludChlc3RpbWF0ZS50b1N0cmluZygpKSoxLjJcblx0XHR9Y2F0Y2goZXJyKXtcblx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignYmFkX3R4Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vIGF0dGVtcHQgc2VuZGluZyB0cmFkZVxuXHRcdHRyeXtcblx0XHRcdHN0YXR1cyA9IGF3YWl0IHRoaXMuc2lnbmVyLnNlbmRUcmFuc2FjdGlvbih0eCk7XG5cdFx0fWNhdGNoKGVycil7XG5cdFx0XHQvLyBpc3N1ZSBzZW5kaW5nIHR4XG5cdFx0XHRpZighd2luZG93LmV0aGVyZXVtLmlzSW1Ub2tlbil7XG5cdFx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcigncmVqZWN0ZWQnKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGVyci5lcnJvckNvZGUgPT0gMTAwMSkge1xuXHRcdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ3JlamVjdGVkJyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgZXJyLnRyYW5zYWN0aW9uSGFzaCA9PSAnc3RyaW5nJyl7XG5cdFx0XHRcdHN0YXR1cy5oYXNoID0gZXJyLnRyYW5zYWN0aW9uSGFzaFxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBUcmFkZSBzZW50XG5cdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdzZW5kX3RyYWRlJywgc3RhdHVzLmhhc2gpO1xuXHRcdGNvbnN0IHJlY2VpcHQgPSBhd2FpdCB1dGlsaXR5LndhaXRGb3JSZWNlaXB0KHN0YXR1cy5oYXNoLCB0aGlzLnByb3ZpZGVyKTtcblx0XHR1dGlsaXR5LnRyYWNrKHN0YXR1cywgZGV0YWlscylcblx0XHR1dGlsaXR5LmhhbmRsZVJlY2VpcHQoc3RhdHVzLCByZWNlaXB0KTtcblx0fVxuXG5cdGFzeW5jIHVud3JhcChhbW91bnQpIHtcblx0XHRjb25zdCB3ZXRoQ29udHJhY3QgPSB1dGlsaXR5LmdldFdldGhDb250cmFjdCh0aGlzLnNpZ25lcik7XG5cdFx0dHJhZGluZy51bndyYXAod2V0aENvbnRyYWN0LCBhbW91bnQpO1xuXHR9XG5cblx0Ly8gUHVibGljIEZ1bmN0aW9uc1xuXG5cdGFzeW5jIGdldEJlc3Qoe3RvLCBmcm9tLCBhbW91bnQsIGRleH0pIHtcblx0XHRjb25zdCBiZXN0VHJhZGUgPSBhd2FpdCB0cmFkaW5nLmdldEJlc3Qoe3RvLCBmcm9tLCBhbW91bnQsIGRleH0pO1xuXHRcdHJldHVybiBiZXN0VHJhZGVcblx0fVxuXG5cdGFzeW5jIHRyYWRlT3JkZXIoe3R4fSkge1xuXHRcdGxldCB7aW5wdXQsIG91dHB1dCwgc291cmNlfSA9IHR4Lm1ldGFkYXRhO1xuXHRcdHZhciBkZXRhaWxzID0ge3BhaXI6IHtiYXNlOid0ZXN0X2Jhc2UnLCBxdW90ZTondGVzdF9xdW90ZSd9LCBhbW91bnQ6IDEsIGRleDogc291cmNlLmRleCwgaXNCdXlpbmc6IHRydWV9XG5cdFx0dGhpcy5zZW5kVHJhZGUodHgsIGRldGFpbHMpXG5cdH1cblxuXHRhc3luYyB2YWxpZGF0ZVdlYjModHJhZGUpIHtcblx0XHRpZih0aGlzLnByb3ZpZGVyKSB0aGlzLnNpZ25lciA9IHRoaXMucHJvdmlkZXIuZ2V0U2lnbmVyKCk7XG5cdFx0cmV0dXJuIHZhbGlkYXRlLndlYjModHJhZGUsIHRoaXMucHJvdmlkZXIsIHRoaXMuc2lnbmVyKTtcblx0fVxuXG5cdGFzeW5jIHJlZ2lzdGVyU3RhdHVzSGFuZGxlcihoYW5kbGVyKSB7XG5cdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyID0gaGFuZGxlcjtcblx0fVxuXG59XG4iXX0=