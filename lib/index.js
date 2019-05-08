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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJERVhBRyIsIndpbmRvdyIsIndlYjMiLCJjdXJyZW50UHJvdmlkZXIiLCJwcm92aWRlciIsImV0aGVycyIsInByb3ZpZGVycyIsIldlYjNQcm92aWRlciIsInNpZ25lciIsImdldFNpZ25lciIsIndlYjNTdGF0dXNIYW5kbGVyIiwidHJhZGUiLCJkZXRhaWxzIiwidmFsdWUiLCJ1dGlscyIsImJpZ051bWJlcmlmeSIsInN0YXR1cyIsInR4IiwidG8iLCJkYXRhIiwiZ2FzTGltaXQiLCJkZXgiLCJ0cmFkaW5nIiwiZ2V0R2FzIiwiZmFzdF9nYXMiLCJnYXNQcmljZSIsIm1ldGFkYXRhIiwiZ2V0QWRkcmVzcyIsInNlbmRlciIsImVzdGltYXRlVHgiLCJmcm9tIiwiZXN0aW1hdGVHYXMiLCJlc3RpbWF0ZSIsInBhcnNlSW50IiwidG9TdHJpbmciLCJzZW5kVHJhbnNhY3Rpb24iLCJldGhlcmV1bSIsImlzSW1Ub2tlbiIsImVycm9yQ29kZSIsInRyYW5zYWN0aW9uSGFzaCIsImhhc2giLCJ1dGlsaXR5Iiwid2FpdEZvclJlY2VpcHQiLCJyZWNlaXB0IiwidHJhY2siLCJoYW5kbGVSZWNlaXB0IiwiYW1vdW50Iiwid2V0aENvbnRyYWN0IiwiZ2V0V2V0aENvbnRyYWN0IiwidW53cmFwIiwiZ2V0QmVzdCIsImJlc3RUcmFkZSIsImlucHV0Iiwib3V0cHV0Iiwic291cmNlIiwicGFpciIsImJhc2UiLCJxdW90ZSIsImlzQnV5aW5nIiwic2VuZFRyYWRlIiwidmFsaWRhdGUiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBSEE7SUFLYUEsSzs7O0FBRVosbUJBQWM7QUFBQTtBQUNiLFFBQUksQ0FBQ0MsTUFBTSxDQUFDQyxJQUFaLEVBQWtCRCxNQUFNLENBQUNDLElBQVAsR0FBYyxFQUFkO0FBREwsUUFFUEMsZUFGTyxHQUVhRixNQUFNLENB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UUFBMUIsRUFBb0MsS0FBS0ksTUFBekMsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FEQUdvQnFELE87Ozs7O0FBQzNCNUQsZ0JBQUFBLE1BQU0sQ0FBQ1MsaUJBQVAsR0FBMkJtRCxPQUEzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV0aGVycyB9IGZyb20gJ2V0aGVycyc7XG5cbi8vIFNlcnZpY2VzXG5pbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi9zZXJ2aWNlcy92YWxpZGF0ZSc7XG5pbXBvcnQgdHJhZGluZyBmcm9tICcuL3NlcnZpY2VzL3RyYWRpbmcnO1xuaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi9zZXJ2aWNlcy91dGlsaXR5JztcblxuZXhwb3J0IGNsYXNzIERFWEFHIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRpZiAoIXdpbmRvdy53ZWIzKSB3aW5kb3cud2ViMyA9IHt9O1xuXHRcdGxldCB7IGN1cnJlbnRQcm92aWRlciB9ID0gd2luZG93LndlYjM7XG5cdFx0aWYgKCFjdXJyZW50UHJvdmlkZXIpIHJldHVybjsgLy8gZXhpdCBpZiBubyB3ZWIzIGZvdW5kXG5cdFx0dGhpcy5wcm92aWRlciA9IG5ldyBldGhlcnMucHJvdmlkZXJzLldlYjNQcm92aWRlcihjdXJyZW50UHJvdmlkZXIpO1xuXHRcdHRoaXMuc2lnbmVyID0gdGhpcy5wcm92aWRlci5nZXRTaWduZXIoKTtcblx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIgPSAoKT0+e30gLy8gcHJlc2V0IHN0YXR1cyBoYW5kbGVyXG5cdH1cblxuXHRhc3luYyBzZW5kVHJhZGUodHJhZGUsIGRldGFpbHMpIHtcblx0XHRjb25zdCB2YWx1ZSA9IGV0aGVycy51dGlscy5iaWdOdW1iZXJpZnkodHJhZGUudmFsdWUpO1xuXHRcdGxldCBzdGF0dXMgPSB7fTtcblx0XHRjb25zdCB0eCA9IHtcblx0XHRcdHRvOiB0cmFkZS50byxcblx0XHRcdGRhdGE6IHRyYWRlLmRhdGEsXG5cdFx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0XHRnYXNMaW1pdDogNTAwMDAwXG5cdFx0fTtcblx0XHQvLyBTZXQgZ2FzIGFuZCBoYW5kbGUgYmFuY29yIGV4Y2VwdGlvblxuXHRcdGlmKGRldGFpbHMuZGV4IT0nYmFuY29yJyl7XG5cdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2luaXQnKTtcblx0XHRcdGNvbnN0IGZhc3RfZ2FzID0gYXdhaXQgdHJhZGluZy5nZXRHYXMoKTtcblx0XHRcdHR4Lmdhc1ByaWNlID0gZmFzdF9nYXM7XG5cdFx0fWVsc2V7XG5cdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2JhbmNvcl9ub3RpY2UnKTtcblx0XHRcdHR4Lmdhc1ByaWNlID0gZXRoZXJzLnV0aWxzLmJpZ051bWJlcmlmeSh0cmFkZS5tZXRhZGF0YS5nYXNQcmljZSk7XG5cdFx0fVxuXHRcdC8vIGVzdGltYXRlIGdhc1xuXHRcdHRyeXtcblx0XHRcdGNvbnN0IHNlbmRlciA9IGF3YWl0IHRoaXMuc2lnbmVyLmdldEFkZHJlc3MoKTtcblx0XHRcdGNvbnN0IGVzdGltYXRlVHggPSB7IC4uLnR4LCBmcm9tOiBzZW5kZXIgfTtcblx0XHRcdGNvbnN0IGVzdGltYXRlID0gYXdhaXQgdGhpcy5wcm92aWRlci5lc3RpbWF0ZUdhcyhlc3RpbWF0ZVR4KTtcblx0XHRcdHR4Lmdhc0xpbWl0ID0gcGFyc2VJbnQoZXN0aW1hdGUudG9TdHJpbmcoKSkqMS4yXG5cdFx0fWNhdGNoKGVycil7XG5cdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2JhZF90eCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBhdHRlbXB0IHNlbmRpbmcgdHJhZGVcblx0XHR0cnl7XG5cdFx0XHRzdGF0dXMgPSBhd2FpdCB0aGlzLnNpZ25lci5zZW5kVHJhbnNhY3Rpb24odHgpO1xuXHRcdH1jYXRjaChlcnIpe1xuXHRcdFx0Ly8gaXNzdWUgc2VuZGluZyB0eFxuXHRcdFx0aWYoIXdpbmRvdy5ldGhlcmV1bS5pc0ltVG9rZW4pe1xuXHRcdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ3JlamVjdGVkJyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmIChlcnIuZXJyb3JDb2RlID09IDEwMDEpIHtcblx0XHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdyZWplY3RlZCcpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIGVyci50cmFuc2FjdGlvbkhhc2ggPT0gJ3N0cmluZycpe1xuXHRcdFx0XHRzdGF0dXMuaGFzaCA9IGVyci50cmFuc2FjdGlvbkhhc2hcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gVHJhZGUgc2VudFxuXHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignc2VuZF90cmFkZScsIHN0YXR1cy5oYXNoKTtcblx0XHRjb25zdCByZWNlaXB0ID0gYXdhaXQgdXRpbGl0eS53YWl0Rm9yUmVjZWlwdChzdGF0dXMuaGFzaCwgdGhpcy5wcm92aWRlcik7XG5cdFx0dXRpbGl0eS50cmFjayhzdGF0dXMsIGRldGFpbHMsIHRyYWRlKVxuXHRcdHV0aWxpdHkuaGFuZGxlUmVjZWlwdChzdGF0dXMsIHJlY2VpcHQpO1xuXHR9XG5cblx0YXN5bmMgdW53cmFwKGFtb3VudCkge1xuXHRcdGNvbnN0IHdldGhDb250cmFjdCA9IHV0aWxpdHkuZ2V0V2V0aENvbnRyYWN0KHRoaXMuc2lnbmVyKTtcblx0XHR0cmFkaW5nLnVud3JhcCh3ZXRoQ29udHJhY3QsIGFtb3VudCk7XG5cdH1cblxuXHQvLyBQdWJsaWMgRnVuY3Rpb25zXG5cblx0YXN5bmMgZ2V0QmVzdCh7dG8sIGZyb20sIGFtb3VudCwgZGV4fSkge1xuXHRcdGNvbnN0IGJlc3RUcmFkZSA9IGF3YWl0IHRyYWRpbmcuZ2V0QmVzdCh7dG8sIGZyb20sIGFtb3VudCwgZGV4fSk7XG5cdFx0cmV0dXJuIGJlc3RUcmFkZVxuXHR9XG5cblx0YXN5bmMgdHJhZGVPcmRlcih7dHh9KSB7XG5cdFx0bGV0IHtpbnB1dCwgb3V0cHV0LCBzb3VyY2V9ID0gdHgubWV0YWRhdGE7XG5cdFx0dmFyIGRldGFpbHMgPSB7cGFpcjoge2Jhc2U6J3Rlc3RfYmFzZScsIHF1b3RlOid0ZXN0X3F1b3RlJ30sIGFtb3VudDogMSwgZGV4OiBzb3VyY2UuZGV4LCBpc0J1eWluZzogdHJ1ZX1cblx0XHR0aGlzLnNlbmRUcmFkZSh0eCwgZGV0YWlscylcblx0fVxuXG5cdGFzeW5jIHZhbGlkYXRlV2ViMyh0cmFkZSkge1xuXHRcdGlmKHRoaXMucHJvdmlkZXIpIHRoaXMuc2lnbmVyID0gdGhpcy5wcm92aWRlci5nZXRTaWduZXIoKTtcblx0XHRyZXR1cm4gdmFsaWRhdGUud2ViMyh0cmFkZSwgdGhpcy5wcm92aWRlciwgdGhpcy5zaWduZXIpO1xuXHR9XG5cblx0YXN5bmMgcmVnaXN0ZXJTdGF0dXNIYW5kbGVyKGhhbmRsZXIpIHtcblx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIgPSBoYW5kbGVyO1xuXHR9XG5cbn1cbiJdfQ==