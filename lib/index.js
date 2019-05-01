"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DexAgSdk = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

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
  }

  (0, _createClass2["default"])(DexAgSdk, [{
    key: "validateWeb3",
    value: function () {
      var _validateWeb = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(trade) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.provider) this.signer = this.provider.getSigner();
                return _context.abrupt("return", _validate["default"].web3(trade, this.provider, this.signer));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function validateWeb3(_x) {
        return _validateWeb.apply(this, arguments);
      }

      return validateWeb3;
    }()
  }, {
    key: "registerStatusHandler",
    value: function () {
      var _registerStatusHandler = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(handler) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                window.web3StatusHandler = handler;

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function registerStatusHandler(_x2) {
        return _registerStatusHandler.apply(this, arguments);
      }

      return registerStatusHandler;
    }()
  }, {
    key: "sendTrade",
    value: function () {
      var _sendTrade = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(trade, details) {
        var value, status, tx, fast_gas, sender, estimateTx, estimate;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
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
                  _context3.next = 11;
                  break;
                }

                window.web3StatusHandler('init');
                _context3.next = 7;
                return _trading["default"].getGas();

              case 7:
                fast_gas = _context3.sent;
                tx.gasPrice = fast_gas;
                _context3.next = 13;
                break;

              case 11:
                window.web3StatusHandler('bancor_notice');
                tx.gasPrice = _ethers.ethers.utils.bigNumberify(trade.metadata.gasPrice);

              case 13:
                _context3.prev = 13;
                _context3.next = 16;
                return this.signer.getAddress();

              case 16:
                sender = _context3.sent;
                estimateTx = (0, _objectSpread2["default"])({}, tx, {
                  from: sender
                });
                _context3.next = 20;
                return this.provider.estimateGas(estimateTx);

              case 20:
                estimate = _context3.sent;
                tx.gasLimit = parseInt(estimate.toString()) * 1.2;
                _context3.next = 28;
                break;

              case 24:
                _context3.prev = 24;
                _context3.t0 = _context3["catch"](13);
                window.web3StatusHandler('bad_tx');
                return _context3.abrupt("return");

              case 28:
                _context3.prev = 28;
                _context3.next = 31;
                return this.signer.sendTransaction(tx);

              case 31:
                status = _context3.sent;
                _context3.next = 42;
                break;

              case 34:
                _context3.prev = 34;
                _context3.t1 = _context3["catch"](28);

                if (window.ethereum.isImToken) {
                  _context3.next = 41;
                  break;
                }

                window.web3StatusHandler('rejected');
                return _context3.abrupt("return");

              case 41:
                if (typeof _context3.t1.transactionHash == 'string') {
                  status.hash = _context3.t1.transactionHash;
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
                return _context3.stop();
            }
          }
        }, _callee3, this, [[13, 24], [28, 34]]);
      }));

      function sendTrade(_x3, _x4) {
        return _sendTrade.apply(this, arguments);
      }

      return sendTrade;
    }()
  }, {
    key: "unwrap",
    value: function () {
      var _unwrap = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(amount) {
        var wethContract;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                wethContract = _utility["default"].getWethContract(this.signer);

                _trading["default"].unwrap(wethContract, amount);

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function unwrap(_x5) {
        return _unwrap.apply(this, arguments);
      }

      return unwrap;
    }()
  }, {
    key: "getBest",
    value: function () {
      var _getBest = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(_ref) {
        var to, from, amount, bestTrade;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                to = _ref.to, from = _ref.from, amount = _ref.amount;
                _context5.next = 3;
                return _trading["default"].getBest({
                  to: to,
                  from: from,
                  amount: amount
                });

              case 3:
                bestTrade = _context5.sent;
                return _context5.abrupt("return", bestTrade);

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function getBest(_x6) {
        return _getBest.apply(this, arguments);
      }

      return getBest;
    }()
  }]);
  return DexAgSdk;
}();

exports.DexAgSdk = DexAgSdk;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJEZXhBZ1NkayIsIndpbmRvdyIsIndlYjMiLCJjdXJyZW50UHJvdmlkZXIiLCJwcm92aWRlciIsImV0aGVycyIsInByb3ZpZGVycyIsIldlYjNQcm92aWRlciIsInNpZ25lciIsImdldFNpZ25lciIsInRyYWRlIiwidmFsaWRhdGUiLCJoYW5kbGVyIiwid2ViM1N0YXR1c0hhbmRsZXIiLCJkZXRhaWxzIiwidmFsdWUiLCJ1dGlscyIsImJpZ051bWJlcmlmeSIsInN0YXR1cyIsInR4IiwidG8iLCJkYXRhIiwiZ2FzTGltaXQiLCJkZXgiLCJ0cmFkaW5nIiwiZ2V0R2FzIiwiZmFzdF9nYXMiLCJnYXNQcmljZSIsIm1ldGFkYXRhIiwiZ2V0QWRkcmVzcyIsInNlbmRlciIsImVzdGltYXRlVHgiLCJmcm9tIiwiZXN0aW1hdGVHYXMiLCJlc3RpbWF0ZSIsInBhcnNlSW50IiwidG9TdHJpbmciLCJzZW5kVHJhbnNhY3Rpb24iLCJldGhlcmV1bSIsImlzSW1Ub2tlbiIsInRyYW5zYWN0aW9uSGFzaCIsImhhc2giLCJ1dGlsaXR5Iiwid2FpdEZvclJlY2VpcHQiLCJyZWNlaXB0IiwidHJhY2siLCJoYW5kbGVSZWNlaXB0IiwiYW1vdW50Iiwid2V0aENvbnRyYWN0IiwiZ2V0V2V0aENvbnRyYWN0IiwidW53cmFwIiwiZ2V0QmVzdCIsImJlc3RUcmFkZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUdBOztBQUNBOztBQUNBOztBQUhBO0lBS2FBLFE7OztBQUVaLHNCQUFjO0FBQUE7QUFDYixRQUFJLENBQUNDLE1BQU0sQ0FBQ0MsSUFBWixFQUFrQkQsTUFBTSxDQUFDQyxJQUFQLEdBQWMsRUFBZDtBQURMLFFBRVBDLGVBRk8sR0FFYUYsTUFBTSxDQUFDQyxJQUZwQixDQUVQQyxlQUZPO0FBR2IsUUFBSSxDQUFDQSxlQUFMLEVBQXNCLE9BSFQsQ0FHaUI7O0FBQzlCLFNBQUtDLFFBQUwsR0FB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WSxHQUFlTixvQkFBUU8sZUFBUixDQUF3QixLQUFLekMsTUFBN0IsQzs7QUFDckJnQixvQ0FBUTBCLE1BQVIsQ0FBZUYsWUFBZixFQUE2QkQsTUFBN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdjM0IsZ0JBQUFBLEUsUUFBQUEsRSxFQUFJWSxJLFFBQUFBLEksRUFBTWUsTSxRQUFBQSxNOzt1QkFDQXZCLG9CQUFRMkIsT0FBUixDQUFnQjtBQUFDL0Isa0JBQUFBLEVBQUUsRUFBRkEsRUFBRDtBQUFLWSxrQkFBQUEsSUFBSSxFQUFKQSxJQUFMO0FBQVdlLGtCQUFBQSxNQUFNLEVBQU5BO0FBQVgsaUJBQWhCLEM7OztBQUFsQkssZ0JBQUFBLFM7a0RBQ0NBLFMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBldGhlcnMgfSBmcm9tICdldGhlcnMnO1xuXG4vLyBTZXJ2aWNlc1xuaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vc2VydmljZXMvdmFsaWRhdGUnO1xuaW1wb3J0IHRyYWRpbmcgZnJvbSAnLi9zZXJ2aWNlcy90cmFkaW5nJztcbmltcG9ydCB1dGlsaXR5IGZyb20gJy4vc2VydmljZXMvdXRpbGl0eSc7XG5cbmV4cG9ydCBjbGFzcyBEZXhBZ1NkayB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0aWYgKCF3aW5kb3cud2ViMykgd2luZG93LndlYjMgPSB7fTtcblx0XHRsZXQgeyBjdXJyZW50UHJvdmlkZXIgfSA9IHdpbmRvdy53ZWIzO1xuXHRcdGlmICghY3VycmVudFByb3ZpZGVyKSByZXR1cm47IC8vIGV4aXQgaWYgbm8gd2ViMyBmb3VuZFxuXHRcdHRoaXMucHJvdmlkZXIgPSBuZXcgZXRoZXJzLnByb3ZpZGVycy5XZWIzUHJvdmlkZXIoY3VycmVudFByb3ZpZGVyKTtcblx0XHR0aGlzLnNpZ25lciA9IHRoaXMucHJvdmlkZXIuZ2V0U2lnbmVyKCk7XG5cdH1cblxuXHRhc3luYyB2YWxpZGF0ZVdlYjModHJhZGUpIHtcblx0XHRpZih0aGlzLnByb3ZpZGVyKSB0aGlzLnNpZ25lciA9IHRoaXMucHJvdmlkZXIuZ2V0U2lnbmVyKCk7XG5cdFx0cmV0dXJuIHZhbGlkYXRlLndlYjModHJhZGUsIHRoaXMucHJvdmlkZXIsIHRoaXMuc2lnbmVyKTtcblx0fVxuXG5cdGFzeW5jIHJlZ2lzdGVyU3RhdHVzSGFuZGxlcihoYW5kbGVyKSB7XG5cdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyID0gaGFuZGxlcjtcblx0fVxuXG5cdGFzeW5jIHNlbmRUcmFkZSh0cmFkZSwgZGV0YWlscykge1xuXHRcdGNvbnN0IHZhbHVlID0gZXRoZXJzLnV0aWxzLmJpZ051bWJlcmlmeSh0cmFkZS52YWx1ZSk7XG5cdFx0bGV0IHN0YXR1cyA9IHt9O1xuXHRcdGNvbnN0IHR4ID0ge1xuXHRcdFx0dG86IHRyYWRlLnRvLFxuXHRcdFx0ZGF0YTogdHJhZGUuZGF0YSxcblx0XHRcdHZhbHVlOiB2YWx1ZSxcblx0XHRcdGdhc0xpbWl0OiA1MDAwMDBcblx0XHR9O1xuXHRcdC8vIFNldCBnYXMgYW5kIGhhbmRsZSBiYW5jb3IgZXhjZXB0aW9uXG5cdFx0aWYoZGV0YWlscy5kZXghPSdiYW5jb3InKXtcblx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignaW5pdCcpO1xuXHRcdFx0Y29uc3QgZmFzdF9nYXMgPSBhd2FpdCB0cmFkaW5nLmdldEdhcygpO1xuXHRcdFx0dHguZ2FzUHJpY2UgPSBmYXN0X2dhcztcblx0XHR9ZWxzZXtcblx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignYmFuY29yX25vdGljZScpO1xuXHRcdFx0dHguZ2FzUHJpY2UgPSBldGhlcnMudXRpbHMuYmlnTnVtYmVyaWZ5KHRyYWRlLm1ldGFkYXRhLmdhc1ByaWNlKTtcblx0XHR9XG5cdFx0Ly8gZXN0aW1hdGUgZ2FzXG5cdFx0dHJ5e1xuXHRcdFx0Y29uc3Qgc2VuZGVyID0gYXdhaXQgdGhpcy5zaWduZXIuZ2V0QWRkcmVzcygpO1xuXHRcdFx0Y29uc3QgZXN0aW1hdGVUeCA9IHsgLi4udHgsIGZyb206IHNlbmRlciB9O1xuXHRcdFx0Y29uc3QgZXN0aW1hdGUgPSBhd2FpdCB0aGlzLnByb3ZpZGVyLmVzdGltYXRlR2FzKGVzdGltYXRlVHgpO1xuXHRcdFx0dHguZ2FzTGltaXQgPSBwYXJzZUludChlc3RpbWF0ZS50b1N0cmluZygpKSoxLjJcblx0XHR9Y2F0Y2goZXJyKXtcblx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignYmFkX3R4Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vIGF0dGVtcHQgc2VuZGluZyB0cmFkZVxuXHRcdHRyeXtcblx0XHRcdHN0YXR1cyA9IGF3YWl0IHRoaXMuc2lnbmVyLnNlbmRUcmFuc2FjdGlvbih0eCk7XG5cdFx0fWNhdGNoKGVycil7XG5cdFx0XHQvLyBpc3N1ZSBzZW5kaW5nIHR4XG5cdFx0XHRpZighd2luZG93LmV0aGVyZXVtLmlzSW1Ub2tlbil7XG5cdFx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcigncmVqZWN0ZWQnKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fWVsc2UgaWYgKHR5cGVvZiBlcnIudHJhbnNhY3Rpb25IYXNoID09ICdzdHJpbmcnKXtcblx0XHRcdFx0c3RhdHVzLmhhc2ggPSBlcnIudHJhbnNhY3Rpb25IYXNoXG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIFRyYWRlIHNlbnRcblx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ3NlbmRfdHJhZGUnLCBzdGF0dXMuaGFzaCk7XG5cdFx0dXRpbGl0eS53YWl0Rm9yUmVjZWlwdChzdGF0dXMuaGFzaCwgZnVuY3Rpb24ocmVjZWlwdCkge1xuXHRcdFx0dXRpbGl0eS50cmFjayhzdGF0dXMsIGRldGFpbHMpXG5cdFx0XHR1dGlsaXR5LmhhbmRsZVJlY2VpcHQoc3RhdHVzLCByZWNlaXB0KTtcblx0XHR9KTtcblx0fVxuXG5cdGFzeW5jIHVud3JhcChhbW91bnQpIHtcblx0XHRjb25zdCB3ZXRoQ29udHJhY3QgPSB1dGlsaXR5LmdldFdldGhDb250cmFjdCh0aGlzLnNpZ25lcik7XG5cdFx0dHJhZGluZy51bndyYXAod2V0aENvbnRyYWN0LCBhbW91bnQpO1xuXHR9XG5cblx0YXN5bmMgZ2V0QmVzdCh7dG8sIGZyb20sIGFtb3VudH0pIHtcblx0XHRjb25zdCBiZXN0VHJhZGUgPSBhd2FpdCB0cmFkaW5nLmdldEJlc3Qoe3RvLCBmcm9tLCBhbW91bnR9KTtcblx0XHRyZXR1cm4gYmVzdFRyYWRlXG5cdH1cbn1cbiJdfQ==