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
                value = _ethers.ethers.utils.bigNumberify(trade.trade.value);
                status = {};
                tx = {
                  to: trade.trade.to,
                  data: trade.trade.data,
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
    key: "getTrade",
    value: function () {
      var _getTrade = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(_ref) {
        var to, from, amount, dex, trade;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                to = _ref.to, from = _ref.from, amount = _ref.amount, dex = _ref.dex;
                _context3.next = 3;
                return _trading["default"].getTrade({
                  to: to,
                  from: from,
                  amount: amount,
                  dex: dex
                });

              case 3:
                trade = _context3.sent;
                return _context3.abrupt("return", trade);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function getTrade(_x4) {
        return _getTrade.apply(this, arguments);
      }

      return getTrade;
    }()
  }, {
    key: "getPrice",
    value: function () {
      var _getPrice = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(_ref2) {
        var to, from, amount, dex, trade;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                to = _ref2.to, from = _ref2.from, amount = _ref2.amount, dex = _ref2.dex;
                _context4.next = 3;
                return _trading["default"].getPrice({
                  to: to,
                  from: from,
                  amount: amount,
                  dex: dex
                });

              case 3:
                trade = _context4.sent;
                return _context4.abrupt("return", trade);

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function getPrice(_x5) {
        return _getPrice.apply(this, arguments);
      }

      return getPrice;
    }()
  }, {
    key: "tradeOrder",
    value: function () {
      var _tradeOrder = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(_ref3) {
        var tx, _tx$metadata, input, output, source, query, details;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                tx = _ref3.tx;
                _tx$metadata = tx.metadata, input = _tx$metadata.input, output = _tx$metadata.output, source = _tx$metadata.source, query = _tx$metadata.query;
                details = {
                  pair: {
                    base: query.to,
                    quote: query.from
                  },
                  amount: query.fromAmount || query.toAmount,
                  dex: source.dex,
                  isBuying: true
                };
                console.log(details);
                this.sendTrade(tx, details);

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function tradeOrder(_x6) {
        return _tradeOrder.apply(this, arguments);
      }

      return tradeOrder;
    }()
  }, {
    key: "validateWeb3",
    value: function () {
      var _validateWeb = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(trade) {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (this.provider) this.signer = this.provider.getSigner();
                return _context6.abrupt("return", _validate["default"].web3(trade, this.provider, this.signer));

              case 2:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function validateWeb3(_x7) {
        return _validateWeb.apply(this, arguments);
      }

      return validateWeb3;
    }()
  }, {
    key: "registerStatusHandler",
    value: function () {
      var _registerStatusHandler = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(handler) {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                window.web3StatusHandler = handler;

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function registerStatusHandler(_x8) {
        return _registerStatusHandler.apply(this, arguments);
      }

      return registerStatusHandler;
    }()
  }]);
  return DEXAG;
}();

exports.DEXAG = DEXAG;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJERVhBRyIsIndpbmRvdyIsIndlYjMiLCJjdXJyZW50UHJvdmlkZXIiLCJwcm92aWRlciIsImV0aGVycyIsInByb3ZpZGVycyIsIldlYjNQcm92aWRlciIsInNpZ25lciIsImdldFNpZ25lciIsIndlYjNTdGF0dXNIYW5kbGVyIiwidHJhZGUiLCJkZXRhaWxzIiwidmFsdWUiLCJ1dGlscyIsImJpZ051bWJlcmlmeSIsInN0YXR1cyIsInR4IiwidG8iLCJkYXRhIiwiZ2FzTGltaXQiLCJkZXgiLCJ0cmFkaW5nIiwiZ2V0R2FzIiwiZmFzdF9nYXMiLCJnYXNQcmljZSIsIm1ldGFkYXRhIiwiZ2V0QWRkcmVzcyIsInNlbmRlciIsImVzdGltYXRlVHgiLCJmcm9tIiwiZXN0aW1hdGVHYXMiLCJlc3RpbWF0ZSIsInBhcnNlSW50IiwidG9TdHJpbmciLCJzZW5kVHJhbnNhY3Rpb24iLCJldGhlcmV1bSIsImlzSW1Ub2tlbiIsImVycm9yQ29kZSIsInRyYW5zYWN0aW9uSGFzaCIsImhhc2giLCJ1dGlsaXR5Iiwid2FpdEZvclJlY2VpcHQiLCJyZWNlaXB0IiwidHJhY2siLCJoYW5kbGVSZWNlaXB0IiwiYW1vdW50Iiwid2V0aENvbnRyYWN0IiwiZ2V0V2V0aENvbnRyYWN0IiwidW53cmFwIiwiZ2V0VHJhZGUiLCJnZXRQcmljZSIsImlucHV0Iiwib3V0cHV0Iiwic291cmNlIiwicXVlcnkiLCJwYWlyIiwiYmFzZSIsInF1b3RlIiwiZnJvbUFtb3VudCIsInRvQW1vdW50IiwiaXNCdXlpbmciLCJjb25zb2xlIiwibG9nIiwic2VuZFRyYWRlIiwidmFsaWRhdGUiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBSEE7SUFLYUEsSzs7O0FBRVgsbUJBQWM7QUFBQTtBQUNaLFFBQUksQ0FBQ0MsTUFBTSxDQUFDQyxJQUFaLEVBQWtCRCxNQUFNLENB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QUEsSUFBSSxFQUFFO0FBQUNDLG9CQUFBQSxJQUFJLEVBQUNGLEtBQUssQ0FBQ3JDLEVBQVo7QUFBZ0J3QyxvQkFBQUEsS0FBSyxFQUFDSCxLQUFLLENBQUN6QjtBQUE1QixtQkFBUDtBQUEwQ2dCLGtCQUFBQSxNQUFNLEVBQUVTLEtBQUssQ0FBQ0ksVUFBTixJQUFrQkosS0FBSyxDQUFDSyxRQUExRTtBQUFvRnZDLGtCQUFBQSxHQUFHLEVBQUVpQyxNQUFNLENBQUNqQyxHQUFoRztBQUFxR3dDLGtCQUFBQSxRQUFRLEVBQUU7QUFBL0csaUI7QUFDZEMsZ0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZbkQsT0FBWjtBQUNBLHFCQUFLb0QsU0FBTCxDQUFlL0MsRUFBZixFQUFtQkwsT0FBbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxREFHaUJELEs7Ozs7O0FBQ2pCLG9CQUFHLEtBQUtQLFFBQVIsRUFBa0IsS0FBS0ksTUFBTCxHQUFjLEtBQUtKLFFBQUwsQ0FBY0ssU0FBZCxFQUFkO2tEQUNYd0QscUJBQVMvRCxJQUFULENBQWNTLEtBQWQsRUFBcUIsS0FBS1AsUUFBMUIsRUFBb0MsS0FBS0ksTUFBekMsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FEQUdtQjBELE87Ozs7O0FBQzFCakUsZ0JBQUFBLE1BQU0sQ0FBQ1MsaUJBQVAsR0FBMkJ3RCxPQUEzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV0aGVycyB9IGZyb20gJ2V0aGVycyc7XG5cbi8vIFNlcnZpY2VzXG5pbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi9zZXJ2aWNlcy92YWxpZGF0ZSc7XG5pbXBvcnQgdHJhZGluZyBmcm9tICcuL3NlcnZpY2VzL3RyYWRpbmcnO1xuaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi9zZXJ2aWNlcy91dGlsaXR5JztcblxuZXhwb3J0IGNsYXNzIERFWEFHIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAoIXdpbmRvdy53ZWIzKSB3aW5kb3cud2ViMyA9IHt9O1xuICAgIGxldCB7IGN1cnJlbnRQcm92aWRlciB9ID0gd2luZG93LndlYjM7XG4gICAgaWYgKCFjdXJyZW50UHJvdmlkZXIpIHJldHVybjsgLy8gZXhpdCBpZiBubyB3ZWIzIGZvdW5kXG4gICAgdGhpcy5wcm92aWRlciA9IG5ldyBldGhlcnMucHJvdmlkZXJzLldlYjNQcm92aWRlcihjdXJyZW50UHJvdmlkZXIpO1xuICAgIHRoaXMuc2lnbmVyID0gdGhpcy5wcm92aWRlci5nZXRTaWduZXIoKTtcbiAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIgPSAoKT0+e30gLy8gcHJlc2V0IHN0YXR1cyBoYW5kbGVyXG4gIH1cblxuICBhc3luYyBzZW5kVHJhZGUodHJhZGUsIGRldGFpbHMpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGV0aGVycy51dGlscy5iaWdOdW1iZXJpZnkodHJhZGUudHJhZGUudmFsdWUpO1xuICAgIGxldCBzdGF0dXMgPSB7fTtcbiAgICBjb25zdCB0eCA9IHtcbiAgICAgIHRvOiB0cmFkZS50cmFkZS50byxcbiAgICAgIGRhdGE6IHRyYWRlLnRyYWRlLmRhdGEsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBnYXNMaW1pdDogNTAwMDAwXG4gICAgfTtcbiAgICAvLyBTZXQgZ2FzIGFuZCBoYW5kbGUgYmFuY29yIGV4Y2VwdGlvblxuICAgIGlmKGRldGFpbHMuZGV4IT0nYmFuY29yJyl7XG4gICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2luaXQnKTtcbiAgICAgIGNvbnN0IGZhc3RfZ2FzID0gYXdhaXQgdHJhZGluZy5nZXRHYXMoKTtcbiAgICAgIHR4Lmdhc1ByaWNlID0gZmFzdF9nYXM7XG4gICAgfWVsc2V7XG4gICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2JhbmNvcl9ub3RpY2UnKTtcbiAgICAgIHR4Lmdhc1ByaWNlID0gZXRoZXJzLnV0aWxzLmJpZ051bWJlcmlmeSh0cmFkZS5tZXRhZGF0YS5nYXNQcmljZSk7XG4gICAgfVxuICAgIC8vIGVzdGltYXRlIGdhc1xuICAgIHRyeXtcbiAgICAgIGNvbnN0IHNlbmRlciA9IGF3YWl0IHRoaXMuc2lnbmVyLmdldEFkZHJlc3MoKTtcbiAgICAgIGNvbnN0IGVzdGltYXRlVHggPSB7IC4uLnR4LCBmcm9tOiBzZW5kZXIgfTtcbiAgICAgIGNvbnN0IGVzdGltYXRlID0gYXdhaXQgdGhpcy5wcm92aWRlci5lc3RpbWF0ZUdhcyhlc3RpbWF0ZVR4KTtcbiAgICAgIHR4Lmdhc0xpbWl0ID0gcGFyc2VJbnQoZXN0aW1hdGUudG9TdHJpbmcoKSkqMS4yXG4gICAgfWNhdGNoKGVycil7XG4gICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2JhZF90eCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBhdHRlbXB0IHNlbmRpbmcgdHJhZGVcbiAgICB0cnl7XG4gICAgICBzdGF0dXMgPSBhd2FpdCB0aGlzLnNpZ25lci5zZW5kVHJhbnNhY3Rpb24odHgpO1xuICAgIH1jYXRjaChlcnIpe1xuICAgICAgLy8gaXNzdWUgc2VuZGluZyB0eFxuICAgICAgaWYoIXdpbmRvdy5ldGhlcmV1bS5pc0ltVG9rZW4pe1xuICAgICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ3JlamVjdGVkJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChlcnIuZXJyb3JDb2RlID09IDEwMDEpIHtcbiAgICAgICAgd2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdyZWplY3RlZCcpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGVyci50cmFuc2FjdGlvbkhhc2ggPT0gJ3N0cmluZycpe1xuICAgICAgICBzdGF0dXMuaGFzaCA9IGVyci50cmFuc2FjdGlvbkhhc2hcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gVHJhZGUgc2VudFxuICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignc2VuZF90cmFkZScsIHN0YXR1cy5oYXNoKTtcbiAgICBjb25zdCByZWNlaXB0ID0gYXdhaXQgdXRpbGl0eS53YWl0Rm9yUmVjZWlwdChzdGF0dXMuaGFzaCwgdGhpcy5wcm92aWRlcik7XG4gICAgdXRpbGl0eS50cmFjayhzdGF0dXMsIGRldGFpbHMsIHRyYWRlKVxuICAgIHV0aWxpdHkuaGFuZGxlUmVjZWlwdChzdGF0dXMsIHJlY2VpcHQpO1xuICB9XG5cbiAgYXN5bmMgdW53cmFwKGFtb3VudCkge1xuICAgIGNvbnN0IHdldGhDb250cmFjdCA9IHV0aWxpdHkuZ2V0V2V0aENvbnRyYWN0KHRoaXMuc2lnbmVyKTtcbiAgICB0cmFkaW5nLnVud3JhcCh3ZXRoQ29udHJhY3QsIGFtb3VudCk7XG4gIH1cblxuICAvLyBQdWJsaWMgRnVuY3Rpb25zXG5cbiAgYXN5bmMgZ2V0VHJhZGUoe3RvLCBmcm9tLCBhbW91bnQsIGRleH0pIHtcbiAgICBjb25zdCB0cmFkZSA9IGF3YWl0IHRyYWRpbmcuZ2V0VHJhZGUoe3RvLCBmcm9tLCBhbW91bnQsIGRleH0pO1xuICAgIHJldHVybiB0cmFkZVxuICB9XG5cbiAgYXN5bmMgZ2V0UHJpY2Uoe3RvLCBmcm9tLCBhbW91bnQsIGRleH0pIHtcbiAgICBjb25zdCB0cmFkZSA9IGF3YWl0IHRyYWRpbmcuZ2V0UHJpY2Uoe3RvLCBmcm9tLCBhbW91bnQsIGRleH0pO1xuICAgIHJldHVybiB0cmFkZVxuICB9XG5cbiAgYXN5bmMgdHJhZGVPcmRlcih7dHh9KSB7XG4gICAgbGV0IHtpbnB1dCwgb3V0cHV0LCBzb3VyY2UsIHF1ZXJ5fSA9IHR4Lm1ldGFkYXRhO1xuICAgIHZhciBkZXRhaWxzID0ge3BhaXI6IHtiYXNlOnF1ZXJ5LnRvLCBxdW90ZTpxdWVyeS5mcm9tfSwgYW1vdW50OiBxdWVyeS5mcm9tQW1vdW50fHxxdWVyeS50b0Ftb3VudCwgZGV4OiBzb3VyY2UuZGV4LCBpc0J1eWluZzogdHJ1ZX1cbiAgICBjb25zb2xlLmxvZyhkZXRhaWxzKVxuICAgIHRoaXMuc2VuZFRyYWRlKHR4LCBkZXRhaWxzKVxuICB9XG5cbiAgYXN5bmMgdmFsaWRhdGVXZWIzKHRyYWRlKSB7XG4gICAgaWYodGhpcy5wcm92aWRlcikgdGhpcy5zaWduZXIgPSB0aGlzLnByb3ZpZGVyLmdldFNpZ25lcigpO1xuICAgIHJldHVybiB2YWxpZGF0ZS53ZWIzKHRyYWRlLCB0aGlzLnByb3ZpZGVyLCB0aGlzLnNpZ25lcik7XG4gIH1cblxuICBhc3luYyByZWdpc3RlclN0YXR1c0hhbmRsZXIoaGFuZGxlcikge1xuICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlciA9IGhhbmRsZXI7XG4gIH1cblxufVxuIl19