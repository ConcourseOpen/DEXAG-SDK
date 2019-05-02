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

    window.web3StatusHandler = function () {}; // preset status handler

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
    }() // Public Functions

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJEZXhBZ1NkayIsIndpbmRvdyIsIndlYjMiLCJjdXJyZW50UHJvdmlkZXIiLCJwcm92aWRlciIsImV0aGVycyIsInByb3ZpZGVycyIsIldlYjNQcm92aWRlciIsInNpZ25lciIsImdldFNpZ25lciIsIndlYjNTdGF0dXNIYW5kbGVyIiwidHJhZGUiLCJ2YWxpZGF0ZSIsImhhbmRsZXIiLCJkZXRhaWxzIiwidmFsdWUiLCJ1dGlscyIsImJpZ051bWJlcmlmeSIsInN0YXR1cyIsInR4IiwidG8iLCJkYXRhIiwiZ2FzTGltaXQiLCJkZXgiLCJ0cmFkaW5nIiwiZ2V0R2FzIiwiZmFzdF9nYXMiLCJnYXNQcmljZSIsIm1ldGFkYXRhIiwiZ2V0QWRkcmVzcyIsInNlbmRlciIsImVzdGltYXRlVHgiLCJmcm9tIiwiZXN0aW1hdGVHYXMiLCJlc3RpbWF0ZSIsInBhcnNlSW50IiwidG9TdHJpbmciLCJzZW5kVHJhbnNhY3Rpb24iLCJldGhlcmV1bSIsImlzSW1Ub2tlbiIsInRyYW5zYWN0aW9uSGFzaCIsImhhc2giLCJ1dGlsaXR5Iiwid2FpdEZvclJlY2VpcHQiLCJyZWNlaXB0IiwidHJhY2siLCJoYW5kbGVSZWNlaXB0IiwiYW1vdW50Iiwid2V0aENvbnRyYWN0IiwiZ2V0V2V0aENvbnRyYWN0IiwidW53cmFwIiwiZ2V0QmVzdCIsImJlc3RUcmFkZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUdBOztBQUNBOztBQUNBOztBQUhBO0lBS2FBLFE7OztBQUVaLHNCQUFjO0FBQUE7QUFDYixRQUFJLENBQUNDLE1BQU0sQ0FBQ0MsSUFBWixFQUFrQkQsTUFBTSxDQUFDQyxJQUFQLEdBQWMsRUFBZDtBQURMLFFBRVBDLGVBRk8sR0FFYUYsTUFBTSxDQUFDQyxJQUZwQixDQUVQQyxlQUZPO0FBR2IsUUFBSSxDQUFDQSxlQUFMLEVBQXNCLE9BSFQsQ0FHaUI7O0FBQzlCLFNBQUtDLFFBQUwsR0FB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LE9BQTlCO0FBQ0EsaUJBSEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxREFNWUcsTTs7Ozs7O0FBQ05DLGdCQUFBQSxZLEdBQWVOLG9CQUFRTyxlQUFSLENBQXdCLEtBQUt6QyxNQUE3QixDOztBQUNyQmdCLG9DQUFRMEIsTUFBUixDQUFlRixZQUFmLEVBQTZCRCxNQUE3Qjs7Ozs7Ozs7Ozs7Ozs7O1FBR0Q7Ozs7Ozs7Ozs7Ozs7QUFFZTNCLGdCQUFBQSxFLFFBQUFBLEUsRUFBSVksSSxRQUFBQSxJLEVBQU1lLE0sUUFBQUEsTTs7dUJBQ0F2QixvQkFBUTJCLE9BQVIsQ0FBZ0I7QUFBQy9CLGtCQUFBQSxFQUFFLEVBQUZBLEVBQUQ7QUFBS1ksa0JBQUFBLElBQUksRUFBSkEsSUFBTDtBQUFXZSxrQkFBQUEsTUFBTSxFQUFOQTtBQUFYLGlCQUFoQixDOzs7QUFBbEJLLGdCQUFBQSxTO2tEQUNDQSxTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXRoZXJzIH0gZnJvbSAnZXRoZXJzJztcblxuLy8gU2VydmljZXNcbmltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3NlcnZpY2VzL3ZhbGlkYXRlJztcbmltcG9ydCB0cmFkaW5nIGZyb20gJy4vc2VydmljZXMvdHJhZGluZyc7XG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuL3NlcnZpY2VzL3V0aWxpdHknO1xuXG5leHBvcnQgY2xhc3MgRGV4QWdTZGsge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdGlmICghd2luZG93LndlYjMpIHdpbmRvdy53ZWIzID0ge307XG5cdFx0bGV0IHsgY3VycmVudFByb3ZpZGVyIH0gPSB3aW5kb3cud2ViMztcblx0XHRpZiAoIWN1cnJlbnRQcm92aWRlcikgcmV0dXJuOyAvLyBleGl0IGlmIG5vIHdlYjMgZm91bmRcblx0XHR0aGlzLnByb3ZpZGVyID0gbmV3IGV0aGVycy5wcm92aWRlcnMuV2ViM1Byb3ZpZGVyKGN1cnJlbnRQcm92aWRlcik7XG5cdFx0dGhpcy5zaWduZXIgPSB0aGlzLnByb3ZpZGVyLmdldFNpZ25lcigpO1xuXHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlciA9ICgpPT57fSAvLyBwcmVzZXQgc3RhdHVzIGhhbmRsZXJcblx0fVxuXG5cdGFzeW5jIHZhbGlkYXRlV2ViMyh0cmFkZSkge1xuXHRcdGlmKHRoaXMucHJvdmlkZXIpIHRoaXMuc2lnbmVyID0gdGhpcy5wcm92aWRlci5nZXRTaWduZXIoKTtcblx0XHRyZXR1cm4gdmFsaWRhdGUud2ViMyh0cmFkZSwgdGhpcy5wcm92aWRlciwgdGhpcy5zaWduZXIpO1xuXHR9XG5cblx0YXN5bmMgcmVnaXN0ZXJTdGF0dXNIYW5kbGVyKGhhbmRsZXIpIHtcblx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIgPSBoYW5kbGVyO1xuXHR9XG5cblx0YXN5bmMgc2VuZFRyYWRlKHRyYWRlLCBkZXRhaWxzKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSBldGhlcnMudXRpbHMuYmlnTnVtYmVyaWZ5KHRyYWRlLnZhbHVlKTtcblx0XHRsZXQgc3RhdHVzID0ge307XG5cdFx0Y29uc3QgdHggPSB7XG5cdFx0XHR0bzogdHJhZGUudG8sXG5cdFx0XHRkYXRhOiB0cmFkZS5kYXRhLFxuXHRcdFx0dmFsdWU6IHZhbHVlLFxuXHRcdFx0Z2FzTGltaXQ6IDUwMDAwMFxuXHRcdH07XG5cdFx0Ly8gU2V0IGdhcyBhbmQgaGFuZGxlIGJhbmNvciBleGNlcHRpb25cblx0XHRpZihkZXRhaWxzLmRleCE9J2JhbmNvcicpe1xuXHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdpbml0Jyk7XG5cdFx0XHRjb25zdCBmYXN0X2dhcyA9IGF3YWl0IHRyYWRpbmcuZ2V0R2FzKCk7XG5cdFx0XHR0eC5nYXNQcmljZSA9IGZhc3RfZ2FzO1xuXHRcdH1lbHNle1xuXHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdiYW5jb3Jfbm90aWNlJyk7XG5cdFx0XHR0eC5nYXNQcmljZSA9IGV0aGVycy51dGlscy5iaWdOdW1iZXJpZnkodHJhZGUubWV0YWRhdGEuZ2FzUHJpY2UpO1xuXHRcdH1cblx0XHQvLyBlc3RpbWF0ZSBnYXNcblx0XHR0cnl7XG5cdFx0XHRjb25zdCBzZW5kZXIgPSBhd2FpdCB0aGlzLnNpZ25lci5nZXRBZGRyZXNzKCk7XG5cdFx0XHRjb25zdCBlc3RpbWF0ZVR4ID0geyAuLi50eCwgZnJvbTogc2VuZGVyIH07XG5cdFx0XHRjb25zdCBlc3RpbWF0ZSA9IGF3YWl0IHRoaXMucHJvdmlkZXIuZXN0aW1hdGVHYXMoZXN0aW1hdGVUeCk7XG5cdFx0XHR0eC5nYXNMaW1pdCA9IHBhcnNlSW50KGVzdGltYXRlLnRvU3RyaW5nKCkpKjEuMlxuXHRcdH1jYXRjaChlcnIpe1xuXHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdiYWRfdHgnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly8gYXR0ZW1wdCBzZW5kaW5nIHRyYWRlXG5cdFx0dHJ5e1xuXHRcdFx0c3RhdHVzID0gYXdhaXQgdGhpcy5zaWduZXIuc2VuZFRyYW5zYWN0aW9uKHR4KTtcblx0XHR9Y2F0Y2goZXJyKXtcblx0XHRcdC8vIGlzc3VlIHNlbmRpbmcgdHhcblx0XHRcdGlmKCF3aW5kb3cuZXRoZXJldW0uaXNJbVRva2VuKXtcblx0XHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdyZWplY3RlZCcpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9ZWxzZSBpZiAodHlwZW9mIGVyci50cmFuc2FjdGlvbkhhc2ggPT0gJ3N0cmluZycpe1xuXHRcdFx0XHRzdGF0dXMuaGFzaCA9IGVyci50cmFuc2FjdGlvbkhhc2hcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gVHJhZGUgc2VudFxuXHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignc2VuZF90cmFkZScsIHN0YXR1cy5oYXNoKTtcblx0XHR1dGlsaXR5LndhaXRGb3JSZWNlaXB0KHN0YXR1cy5oYXNoLCBmdW5jdGlvbihyZWNlaXB0KSB7XG5cdFx0XHR1dGlsaXR5LnRyYWNrKHN0YXR1cywgZGV0YWlscylcblx0XHRcdHV0aWxpdHkuaGFuZGxlUmVjZWlwdChzdGF0dXMsIHJlY2VpcHQpO1xuXHRcdH0pO1xuXHR9XG5cblx0YXN5bmMgdW53cmFwKGFtb3VudCkge1xuXHRcdGNvbnN0IHdldGhDb250cmFjdCA9IHV0aWxpdHkuZ2V0V2V0aENvbnRyYWN0KHRoaXMuc2lnbmVyKTtcblx0XHR0cmFkaW5nLnVud3JhcCh3ZXRoQ29udHJhY3QsIGFtb3VudCk7XG5cdH1cblxuXHQvLyBQdWJsaWMgRnVuY3Rpb25zXG5cblx0YXN5bmMgZ2V0QmVzdCh7dG8sIGZyb20sIGFtb3VudH0pIHtcblx0XHRjb25zdCBiZXN0VHJhZGUgPSBhd2FpdCB0cmFkaW5nLmdldEJlc3Qoe3RvLCBmcm9tLCBhbW91bnR9KTtcblx0XHRyZXR1cm4gYmVzdFRyYWRlXG5cdH1cblxufVxuIl19