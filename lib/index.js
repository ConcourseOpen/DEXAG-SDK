"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DexAgSdk = void 0;

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
var DexAgSdk =
/*#__PURE__*/
function () {
  function DexAgSdk() {
    (0, _classCallCheck2["default"])(this, DexAgSdk);
    if (!window.web3) window.web3 = {};
    var currentProvider = window.web3.currentProvider;
    if (!currentProvider) return; // exit if no web3 found

    this.provider = new _ethers.ethers.providers.Web3Provider(currentProvider);
    this.signer = this.provider.getSigner();

    window.web3StatusHandler = function () {}; // preset status handler

  }

  (0, _createClass2["default"])(DexAgSdk, [{
    key: "sendTrade",
    value: function () {
      var _sendTrade = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(trade, details) {
        var value, status, tx, fast_gas, sender, estimateTx, estimate;
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
                _context.next = 42;
                break;

              case 34:
                _context.prev = 34;
                _context.t1 = _context["catch"](28);

                if (window.ethereum.isImToken) {
                  _context.next = 41;
                  break;
                }

                window.web3StatusHandler('rejected');
                return _context.abrupt("return");

              case 41:
                if (typeof _context.t1.transactionHash == 'string') {
                  status.hash = _context.t1.transactionHash;
                }

              case 42:
                // Trade sent
                window.web3StatusHandler('send_trade', status.hash);

                _utility["default"].waitForReceipt(status.hash, function (receipt) {
                  _utility["default"].track(status, details);

                  _utility["default"].handleReceipt(status, receipt);
                });

              case 44:
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
        var to, from, amount, bestTrade;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                to = _ref.to, from = _ref.from, amount = _ref.amount;
                _context3.next = 3;
                return _trading["default"].getBest({
                  to: to,
                  from: from,
                  amount: amount
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
                console.log(tx.metadata, DexAgSdk);
                details = {
                  pair: {
                    base: input.address,
                    quote: output.address
                  },
                  amount: 1,
                  dex: source.dex,
                  isBuying: true
                };
                DexAgSdk.sendTrade(tx, details);

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
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
  return DexAgSdk;
}();

exports.DexAgSdk = DexAgSdk;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJEZXhBZ1NkayIsIndpbmRvdyIsIndlYjMiLCJjdXJyZW50UHJvdmlkZXIiLCJwcm92aWRlciIsImV0aGVycyIsInByb3ZpZGVycyIsIldlYjNQcm92aWRlciIsInNpZ25lciIsImdldFNpZ25lciIsIndlYjNTdGF0dXNIYW5kbGVyIiwidHJhZGUiLCJkZXRhaWxzIiwidmFsdWUiLCJ1dGlscyIsImJpZ051bWJlcmlmeSIsInN0YXR1cyIsInR4IiwidG8iLCJkYXRhIiwiZ2FzTGltaXQiLCJkZXgiLCJ0cmFkaW5nIiwiZ2V0R2FzIiwiZmFzdF9nYXMiLCJnYXNQcmljZSIsIm1ldGFkYXRhIiwiZ2V0QWRkcmVzcyIsInNlbmRlciIsImVzdGltYXRlVHgiLCJmcm9tIiwiZXN0aW1hdGVHYXMiLCJlc3RpbWF0ZSIsInBhcnNlSW50IiwidG9TdHJpbmciLCJzZW5kVHJhbnNhY3Rpb24iLCJldGhlcmV1bSIsImlzSW1Ub2tlbiIsInRyYW5zYWN0aW9uSGFzaCIsImhhc2giLCJ1dGlsaXR5Iiwid2FpdEZvclJlY2VpcHQiLCJyZWNlaXB0IiwidHJhY2siLCJoYW5kbGVSZWNlaXB0IiwiYW1vdW50Iiwid2V0aENvbnRyYWN0IiwiZ2V0V2V0aENvbnRyYWN0IiwidW53cmFwIiwiZ2V0QmVzdCIsImJlc3RUcmFkZSIsImlucHV0Iiwib3V0cHV0Iiwic291cmNlIiwiY29uc29sZSIsImxvZyIsInBhaXIiLCJiYXNlIiwiYWRkcmVzcyIsInF1b3RlIiwiaXNCdXlpbmciLCJzZW5kVHJhZGUiLCJ2YWxpZGF0ZSIsImhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFHQTs7QUFDQTs7QUFDQTs7QUFIQTtJQUthQSxROzs7QUFFWixzQkFBYztBQUFBO0FBQ2IsUUFBSSxDQUFDQyxNQUFNLENBQUNDLElBQVosRUFBa0JELE1BQU0sQ0FBQ0MsSUFBUCxHQUFjLEVBQWQ7QUFETCxRQUVQQyxl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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FEQUdvQnVELE87Ozs7O0FBQzNCOUQsZ0JBQUFBLE1BQU0sQ0FBQ1MsaUJBQVAsR0FBMkJxRCxPQUEzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV0aGVycyB9IGZyb20gJ2V0aGVycyc7XG5cbi8vIFNlcnZpY2VzXG5pbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi9zZXJ2aWNlcy92YWxpZGF0ZSc7XG5pbXBvcnQgdHJhZGluZyBmcm9tICcuL3NlcnZpY2VzL3RyYWRpbmcnO1xuaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi9zZXJ2aWNlcy91dGlsaXR5JztcblxuZXhwb3J0IGNsYXNzIERleEFnU2RrIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRpZiAoIXdpbmRvdy53ZWIzKSB3aW5kb3cud2ViMyA9IHt9O1xuXHRcdGxldCB7IGN1cnJlbnRQcm92aWRlciB9ID0gd2luZG93LndlYjM7XG5cdFx0aWYgKCFjdXJyZW50UHJvdmlkZXIpIHJldHVybjsgLy8gZXhpdCBpZiBubyB3ZWIzIGZvdW5kXG5cdFx0dGhpcy5wcm92aWRlciA9IG5ldyBldGhlcnMucHJvdmlkZXJzLldlYjNQcm92aWRlcihjdXJyZW50UHJvdmlkZXIpO1xuXHRcdHRoaXMuc2lnbmVyID0gdGhpcy5wcm92aWRlci5nZXRTaWduZXIoKTtcblx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIgPSAoKT0+e30gLy8gcHJlc2V0IHN0YXR1cyBoYW5kbGVyXG5cdH1cblxuXHRhc3luYyBzZW5kVHJhZGUodHJhZGUsIGRldGFpbHMpIHtcblx0XHRjb25zdCB2YWx1ZSA9IGV0aGVycy51dGlscy5iaWdOdW1iZXJpZnkodHJhZGUudmFsdWUpO1xuXHRcdGxldCBzdGF0dXMgPSB7fTtcblx0XHRjb25zdCB0eCA9IHtcblx0XHRcdHRvOiB0cmFkZS50byxcblx0XHRcdGRhdGE6IHRyYWRlLmRhdGEsXG5cdFx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0XHRnYXNMaW1pdDogNTAwMDAwXG5cdFx0fTtcblx0XHQvLyBTZXQgZ2FzIGFuZCBoYW5kbGUgYmFuY29yIGV4Y2VwdGlvblxuXHRcdGlmKGRldGFpbHMuZGV4IT0nYmFuY29yJyl7XG5cdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2luaXQnKTtcblx0XHRcdGNvbnN0IGZhc3RfZ2FzID0gYXdhaXQgdHJhZGluZy5nZXRHYXMoKTtcblx0XHRcdHR4Lmdhc1ByaWNlID0gZmFzdF9nYXM7XG5cdFx0fWVsc2V7XG5cdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2JhbmNvcl9ub3RpY2UnKTtcblx0XHRcdHR4Lmdhc1ByaWNlID0gZXRoZXJzLnV0aWxzLmJpZ051bWJlcmlmeSh0cmFkZS5tZXRhZGF0YS5nYXNQcmljZSk7XG5cdFx0fVxuXHRcdC8vIGVzdGltYXRlIGdhc1xuXHRcdHRyeXtcblx0XHRcdGNvbnN0IHNlbmRlciA9IGF3YWl0IHRoaXMuc2lnbmVyLmdldEFkZHJlc3MoKTtcblx0XHRcdGNvbnN0IGVzdGltYXRlVHggPSB7IC4uLnR4LCBmcm9tOiBzZW5kZXIgfTtcblx0XHRcdGNvbnN0IGVzdGltYXRlID0gYXdhaXQgdGhpcy5wcm92aWRlci5lc3RpbWF0ZUdhcyhlc3RpbWF0ZVR4KTtcblx0XHRcdHR4Lmdhc0xpbWl0ID0gcGFyc2VJbnQoZXN0aW1hdGUudG9TdHJpbmcoKSkqMS4yXG5cdFx0fWNhdGNoKGVycil7XG5cdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2JhZF90eCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBhdHRlbXB0IHNlbmRpbmcgdHJhZGVcblx0XHR0cnl7XG5cdFx0XHRzdGF0dXMgPSBhd2FpdCB0aGlzLnNpZ25lci5zZW5kVHJhbnNhY3Rpb24odHgpO1xuXHRcdH1jYXRjaChlcnIpe1xuXHRcdFx0Ly8gaXNzdWUgc2VuZGluZyB0eFxuXHRcdFx0aWYoIXdpbmRvdy5ldGhlcmV1bS5pc0ltVG9rZW4pe1xuXHRcdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ3JlamVjdGVkJyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1lbHNlIGlmICh0eXBlb2YgZXJyLnRyYW5zYWN0aW9uSGFzaCA9PSAnc3RyaW5nJyl7XG5cdFx0XHRcdHN0YXR1cy5oYXNoID0gZXJyLnRyYW5zYWN0aW9uSGFzaFxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBUcmFkZSBzZW50XG5cdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdzZW5kX3RyYWRlJywgc3RhdHVzLmhhc2gpO1xuXHRcdHV0aWxpdHkud2FpdEZvclJlY2VpcHQoc3RhdHVzLmhhc2gsIGZ1bmN0aW9uKHJlY2VpcHQpIHtcblx0XHRcdHV0aWxpdHkudHJhY2soc3RhdHVzLCBkZXRhaWxzKVxuXHRcdFx0dXRpbGl0eS5oYW5kbGVSZWNlaXB0KHN0YXR1cywgcmVjZWlwdCk7XG5cdFx0fSk7XG5cdH1cblxuXHRhc3luYyB1bndyYXAoYW1vdW50KSB7XG5cdFx0Y29uc3Qgd2V0aENvbnRyYWN0ID0gdXRpbGl0eS5nZXRXZXRoQ29udHJhY3QodGhpcy5zaWduZXIpO1xuXHRcdHRyYWRpbmcudW53cmFwKHdldGhDb250cmFjdCwgYW1vdW50KTtcblx0fVxuXG5cdC8vIFB1YmxpYyBGdW5jdGlvbnNcblxuXHRhc3luYyBnZXRCZXN0KHt0bywgZnJvbSwgYW1vdW50fSkge1xuXHRcdGNvbnN0IGJlc3RUcmFkZSA9IGF3YWl0IHRyYWRpbmcuZ2V0QmVzdCh7dG8sIGZyb20sIGFtb3VudH0pO1xuXHRcdHJldHVybiBiZXN0VHJhZGVcblx0fVxuXG5cdGFzeW5jIHRyYWRlT3JkZXIoe3R4fSkge1xuXHRcdGxldCB7aW5wdXQsIG91dHB1dCwgc291cmNlfSA9IHR4Lm1ldGFkYXRhO1xuXHRcdGNvbnNvbGUubG9nKHR4Lm1ldGFkYXRhLCBEZXhBZ1Nkaylcblx0XHR2YXIgZGV0YWlscyA9IHtwYWlyOiB7YmFzZTppbnB1dC5hZGRyZXNzLCBxdW90ZTpvdXRwdXQuYWRkcmVzc30sIGFtb3VudDogMSwgZGV4OiBzb3VyY2UuZGV4LCBpc0J1eWluZzogdHJ1ZX1cblx0XHREZXhBZ1Nkay5zZW5kVHJhZGUodHgsIGRldGFpbHMpXG5cdH1cblxuXHRhc3luYyB2YWxpZGF0ZVdlYjModHJhZGUpIHtcblx0XHRpZih0aGlzLnByb3ZpZGVyKSB0aGlzLnNpZ25lciA9IHRoaXMucHJvdmlkZXIuZ2V0U2lnbmVyKCk7XG5cdFx0cmV0dXJuIHZhbGlkYXRlLndlYjModHJhZGUsIHRoaXMucHJvdmlkZXIsIHRoaXMuc2lnbmVyKTtcblx0fVxuXG5cdGFzeW5jIHJlZ2lzdGVyU3RhdHVzSGFuZGxlcihoYW5kbGVyKSB7XG5cdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyID0gaGFuZGxlcjtcblx0fVxuXG59XG4iXX0=