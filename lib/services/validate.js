"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utility = _interopRequireDefault(require("./utility"));

var _trading = _interopRequireDefault(require("./trading"));

var _account = _interopRequireDefault(require("./account"));

var validate = {
  web3: function (_web) {
    function web3(_x, _x2, _x3) {
      return _web.apply(this, arguments);
    }

    web3.toString = function () {
      return _web.toString();
    };

    return web3;
  }(
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee(trade, provider, signer) {
      var etherToWrap, wethContract, wrapping, balance, tokenContract, exchangeAddress, address, allowance, tokenAmount, trading_allowance;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              window.web3StatusHandler('init'); // check that web3 exists

              if (!(window.web3 == undefined || Object.keys(window.web3).length == 0)) {
                _context.next = 4;
                break;
              }

              window.web3StatusHandler('web3_undefined');
              return _context.abrupt("return", false);

            case 4:
              if (!(window.web3 == undefined || window.web3.eth.accounts[0] == undefined)) {
                _context.next = 14;
                break;
              }

              _context.prev = 5;
              _context.next = 8;
              return window.ethereum.enable();

            case 8:
              _context.next = 14;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](5);
              // user rejected screen
              window.web3StatusHandler('connect_rejected');
              return _context.abrupt("return", false);

            case 14:
              if (!(trade.error == 'No trades')) {
                _context.next = 16;
                break;
              }

              return _context.abrupt("return", false);

            case 16:
              if (!(web3.version.network != 1)) {
                _context.next = 19;
                break;
              }

              window.web3StatusHandler('network');
              return _context.abrupt("return", false);

            case 19:
              _context.next = 21;
              return _utility["default"].getEtherToWrap(trade, provider, signer);

            case 21:
              etherToWrap = _context.sent;

              if (!(etherToWrap == -1)) {
                _context.next = 25;
                break;
              }

              window.web3StatusHandler('balance');
              return _context.abrupt("return", false);

            case 25:
              // wrap ether if necessary
              wethContract = _utility["default"].getWethContract(signer);
              _context.next = 28;
              return _trading["default"].wrap(wethContract, etherToWrap);

            case 28:
              wrapping = _context.sent;

              if (wrapping) {
                _context.next = 31;
                break;
              }

              return _context.abrupt("return", false);

            case 31:
              if (!trade.metadata.input) {
                _context.next = 37;
                break;
              }

              _context.next = 34;
              return _account["default"].getERC20Balance(trade, provider, signer);

            case 34:
              balance = _context.sent;
              _context.next = 40;
              break;

            case 37:
              _context.next = 39;
              return _account["default"].getETHBalance(trade);

            case 39:
              balance = _context.sent;

            case 40:
              if (balance) {
                _context.next = 43;
                break;
              }

              window.web3StatusHandler('balance');
              return _context.abrupt("return", false);

            case 43:
              if (!trade.metadata.input) {
                _context.next = 60;
                break;
              }

              // get contracts
              tokenContract = _utility["default"].getTokenContract(trade, signer);
              exchangeAddress = trade.metadata.input.spender; // get client address

              _context.next = 48;
              return provider.getSigner().getAddress();

            case 48:
              address = _context.sent;
              _context.next = 51;
              return tokenContract.allowance(address, exchangeAddress);

            case 51:
              allowance = _context.sent;
              tokenAmount = trade.metadata.input.amount;

              if (!allowance.lt(tokenAmount)) {
                _context.next = 60;
                break;
              }

              // allowance needs to be granted
              window.web3StatusHandler('allowance');
              _context.next = 57;
              return _trading["default"].setAllowance(tokenContract, exchangeAddress);

            case 57:
              trading_allowance = _context.sent;

              if (trading_allowance) {
                _context.next = 60;
                break;
              }

              return _context.abrupt("return", false);

            case 60:
              return _context.abrupt("return", true);

            case 61:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[5, 10]]);
    }));

    return function (_x4, _x5, _x6) {
      return _ref.apply(this, arguments);
    };
  }())
};
var _default = validate;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy92YWxpZGF0ZS5qcyJdLCJuYW1lcyI6WyJ2YWxpZGF0ZSIsIndlYjMiLCJ0cmFkZSIsInByb3ZpZGVyIiwic2lnbmVyIiwid2luZG93Iiwid2ViM1N0YXR1c0hhbmRsZXIiLCJ1bmRlZmluZWQiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiZXRoIiwiYWNjb3VudHMiLCJldGhlcmV1bSIsImVuYWJsZSIsImVycm9yIiwidmVyc2lvbiIsIm5ldHdvcmsiLCJ1dGlsaXR5IiwiZ2V0RXRoZXJUb1dyYXAiLCJldGhlclRvV3JhcCIsIndldGhDb250cmFjdCIsImdldFdldGhDb250cmFjdCIsInRyYWRpbmciLCJ3cmFwIiwid3JhcHBpbmciLCJtZXRhZGF0YSIsImlucHV0IiwiYWNjb3VudCIsImdldEVSQzIwQmFsYW5jZSIsImJhbGFuY2UiLCJnZXRFVEhCYWxhbmNlIiwidG9rZW5Db250cmFjdCIsImdldFRva2VuQ29udHJhY3QiLCJleGNoYW5nZUFkZHJlc3MiLCJzcGVuZGVyIiwiZ2V0U2lnbmVyIiwiZ2V0QWRkcmVzcyIsImFkZHJlc3MiLCJhbGxvd2FuY2UiLCJ0b2tlbkFtb3VudCIsImFtb3VudCIsImx0Iiwic2V0QWxsb3dhbmNlIiwidHJhZGluZ19hbGxvd2FuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQSxJQUFNQSxRQUFRLEdBQUc7QUFDaEJDLEVBQUFBLElBQUk7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlDQUFFLGlCQUFPQyxLQUFQLEVBQWNDLFFBQWQsRUFBd0JDLE1BQXhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVMQyxjQUFBQSxNQUFNLENBQUNDLGlCQUFQLENBQXlCLE1BQXpCLEVBRkssQ0FJTDs7QUFKSyxvQkFLREQsTUFBTSxDQUFDSixJQUFQLElBQWVNLFNBQWYs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QUFpQ0osZUFBakMsQ0E5RHBCOztBQUFBO0FBOERFSyxjQUFBQSxTQTlERjtBQStERUMsY0FBQUEsV0EvREYsR0ErRGdCdEMsS0FBSyxDQUFDd0IsUUFBTixDQUFlQyxLQUFmLENBQXFCYyxNQS9EckM7O0FBQUEsbUJBaUVBRixTQUFTLENBQUNHLEVBQVYsQ0FBYUYsV0FBYixDQWpFQTtBQUFBO0FBQUE7QUFBQTs7QUFrRUg7QUFDQW5DLGNBQUFBLE1BQU0sQ0FBQ0MsaUJBQVAsQ0FBeUIsV0FBekI7QUFuRUc7QUFBQSxxQkFvRTZCaUIsb0JBQVFvQixZQUFSLENBQXFCWCxhQUFyQixFQUFvQ0UsZUFBcEMsQ0FwRTdCOztBQUFBO0FBb0VHVSxjQUFBQSxpQkFwRUg7O0FBQUEsa0JBc0VDQSxpQkF0RUQ7QUFBQTtBQUFBO0FBQUE7O0FBQUEsK0NBc0UyQixLQXRFM0I7O0FBQUE7QUFBQSwrQ0EwRUUsSUExRUY7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBRjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURZLENBQWpCO2VBK0VlNUMsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XG5pbXBvcnQgdHJhZGluZyBmcm9tICcuL3RyYWRpbmcnO1xuaW1wb3J0IGFjY291bnQgZnJvbSAnLi9hY2NvdW50JztcblxuY29uc3QgdmFsaWRhdGUgPSB7XG5cdHdlYjM6IGFzeW5jICh0cmFkZSwgcHJvdmlkZXIsIHNpZ25lcikgPT4ge1xuXG5cdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdpbml0Jyk7XG5cblx0XHQvLyBjaGVjayB0aGF0IHdlYjMgZXhpc3RzXG5cdFx0aWYgKHdpbmRvdy53ZWIzID09IHVuZGVmaW5lZCB8fCBPYmplY3Qua2V5cyh3aW5kb3cud2ViMykubGVuZ3RoID09IDApIHtcblx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignd2ViM191bmRlZmluZWQnKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBBc2sgdXNlciB0byB1bmxvY2sgYW5kIGNvbm5lY3Rcblx0XHRpZiAod2luZG93LndlYjMgPT0gdW5kZWZpbmVkIHx8IHdpbmRvdy53ZWIzLmV0aC5hY2NvdW50c1swXSA9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGF3YWl0IHdpbmRvdy5ldGhlcmV1bS5lbmFibGUoKTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0Ly8gdXNlciByZWplY3RlZCBzY3JlZW5cblx0XHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdjb25uZWN0X3JlamVjdGVkJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gY2hlY2sgd2ViMyB0cmFkaW5nIGlzIHN1cHBvcnRlZCBmb3IgdGhpcyBkZXhcblx0XHRpZiAodHJhZGUuZXJyb3IgPT0gJ05vIHRyYWRlcycpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAod2ViMy52ZXJzaW9uLm5ldHdvcmsgIT0gMSkge1xuXHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCduZXR3b3JrJyk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gY2hlY2sgaWYgZXRoZXIgYmFsYW5jZSBpcyBpbnN1ZmZpY2llbnRcblx0XHRjb25zdCBldGhlclRvV3JhcCA9IGF3YWl0IHV0aWxpdHkuZ2V0RXRoZXJUb1dyYXAodHJhZGUsIHByb3ZpZGVyLCBzaWduZXIpO1xuXHRcdGlmIChldGhlclRvV3JhcCA9PSAtMSkge1xuXHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdiYWxhbmNlJyk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdC8vIHdyYXAgZXRoZXIgaWYgbmVjZXNzYXJ5XG5cdFx0Y29uc3Qgd2V0aENvbnRyYWN0ID0gdXRpbGl0eS5nZXRXZXRoQ29udHJhY3Qoc2lnbmVyKTtcblx0XHRjb25zdCB3cmFwcGluZyA9IGF3YWl0IHRyYWRpbmcud3JhcCh3ZXRoQ29udHJhY3QsIGV0aGVyVG9XcmFwKTtcblx0XHRpZiAoIXdyYXBwaW5nKSByZXR1cm4gZmFsc2U7XG5cblx0XHQvLyBDaGVjayBpZiBiYWxhbmNlIGlzIGluc3VmZmljaWVudFxuXHRcdGxldCBiYWxhbmNlO1xuXHRcdGlmKHRyYWRlLm1ldGFkYXRhLmlucHV0KXtcblx0XHRcdC8vIGVyYzIwXG5cdFx0XHRiYWxhbmNlID0gYXdhaXQgYWNjb3VudC5nZXRFUkMyMEJhbGFuY2UodHJhZGUsIHByb3ZpZGVyLCBzaWduZXIpO1xuXHRcdH1lbHNle1xuXHRcdFx0Ly8gZXRoXG5cdFx0XHRiYWxhbmNlID0gYXdhaXQgYWNjb3VudC5nZXRFVEhCYWxhbmNlKHRyYWRlKTtcblx0XHR9XG5cdFx0aWYgKCFiYWxhbmNlKSB7XG5cdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2JhbGFuY2UnKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAodHJhZGUubWV0YWRhdGEuaW5wdXQpIHtcblx0XHRcdC8vIGdldCBjb250cmFjdHNcblx0XHRcdGNvbnN0IHRva2VuQ29udHJhY3QgPSB1dGlsaXR5LmdldFRva2VuQ29udHJhY3QodHJhZGUsIHNpZ25lcik7XG5cdFx0XHRjb25zdCBleGNoYW5nZUFkZHJlc3MgPSB0cmFkZS5tZXRhZGF0YS5pbnB1dC5zcGVuZGVyO1xuXHRcdFx0Ly8gZ2V0IGNsaWVudCBhZGRyZXNzXG5cdFx0XHRjb25zdCBhZGRyZXNzID0gYXdhaXQgcHJvdmlkZXIuZ2V0U2lnbmVyKCkuZ2V0QWRkcmVzcygpO1xuXHRcdFx0Ly8gZ2V0IGFsbG93YW5jZXNcblx0XHRcdGNvbnN0IGFsbG93YW5jZSA9IGF3YWl0IHRva2VuQ29udHJhY3QuYWxsb3dhbmNlKGFkZHJlc3MsIGV4Y2hhbmdlQWRkcmVzcyk7XG5cdFx0XHRjb25zdCB0b2tlbkFtb3VudCA9IHRyYWRlLm1ldGFkYXRhLmlucHV0LmFtb3VudDtcblxuXHRcdFx0aWYgKGFsbG93YW5jZS5sdCh0b2tlbkFtb3VudCkpIHtcblx0XHRcdFx0Ly8gYWxsb3dhbmNlIG5lZWRzIHRvIGJlIGdyYW50ZWRcblx0XHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdhbGxvd2FuY2UnKTtcblx0XHRcdFx0Y29uc3QgdHJhZGluZ19hbGxvd2FuY2UgPSBhd2FpdCB0cmFkaW5nLnNldEFsbG93YW5jZSh0b2tlbkNvbnRyYWN0LCBleGNoYW5nZUFkZHJlc3MpO1xuXHRcdFx0XHQvLyBjaGVjayBpZiB0b2tlbiBhbGxvd2FuY2UgaXMgbm90IHNldFxuXHRcdFx0XHRpZighdHJhZGluZ19hbGxvd2FuY2UpIHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGU7XG4iXX0=