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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy92YWxpZGF0ZS5qcyJdLCJuYW1lcyI6WyJ2YWxpZGF0ZSIsIndlYjMiLCJ0cmFkZSIsInByb3ZpZGVyIiwic2lnbmVyIiwid2luZG93Iiwid2ViM1N0YXR1c0hhbmRsZXIiLCJ1bmRlZmluZWQiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiZXRoIiwiYWNjb3VudHMiLCJldGhlcmV1bSIsImVuYWJsZSIsImVycm9yIiwidmVyc2lvbiIsIm5ldHdvcmsiLCJ1dGlsaXR5IiwiZ2V0RXRoZXJUb1dyYXAiLCJldGhlclRvV3JhcCIsIndldGhDb250cmFjdCIsImdldFdldGhDb250cmFjdCIsInRyYWRpbmciLCJ3cmFwIiwid3JhcHBpbmciLCJtZXRhZGF0YSIsImlucHV0IiwiYWNjb3VudCIsImdldEVSQzIwQmFsYW5jZSIsImJhbGFuY2UiLCJnZXRFVEhCYWxhbmNlIiwidG9rZW5Db250cmFjdCIsImdldFRva2VuQ29udHJhY3QiLCJleGNoYW5nZUFkZHJlc3MiLCJzcGVuZGVyIiwiZ2V0U2lnbmVyIiwiZ2V0QWRkcmVzcyIsImFkZHJlc3MiLCJhbGxvd2FuY2UiLCJ0b2tlbkFtb3VudCIsImFtb3VudCIsImx0Iiwic2V0QWxsb3dhbmNlIiwidHJhZGluZ19hbGxvd2FuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQSxJQUFNQSxRQUFRLEdBQUc7QUFDaEJDLEVBQUFBLElBQUk7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlDQUFFLGlCQUFPQyxLQUFQLEVBQWNDLFFBQWQsRUFBd0JDLE1BQXhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVMQyxjQUFBQSxNQUFNLENBQUNDLGlCQUFQLENBQXlCLE1BQXpCLEVBRkssQ0FJTDs7QUFKSyxvQkFLREQsTUFBTSxDQUFDSixJQUFQLElBQWVNLFNBQWYs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QUFpQ0osZUFBakMsQ0E5RHBCOztBQUFBO0FBOERFSyxjQUFBQSxTQTlERjtBQStERUMsY0FBQUEsV0EvREYsR0ErRGdCdEMsS0FBSyxDQUFDd0IsUUFBTixDQUFlQyxLQUFmLENBQXFCYyxNQS9EckM7O0FBQUEsbUJBaUVBRixTQUFTLENBQUNHLEVBQVYsQ0FBYUYsV0FBYixDQWpFQTtBQUFBO0FBQUE7QUFBQTs7QUFrRUg7QUFDQW5DLGNBQUFBLE1BQU0sQ0FBQ0MsaUJBQVAsQ0FBeUIsV0FBekI7QUFuRUc7QUFBQSxxQkFvRTZCaUIsb0JBQVFvQixZQUFSLENBQXFCWCxhQUFyQixFQUFvQ0UsZUFBcEMsQ0FwRTdCOztBQUFBO0FBb0VHVSxjQUFBQSxpQkFwRUg7O0FBQUEsa0JBc0VDQSxpQkF0RUQ7QUFBQTtBQUFBO0FBQUE7O0FBQUEsK0NBc0UyQixLQXRFM0I7O0FBQUE7QUFBQSwrQ0EwRUUsSUExRUY7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBRjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURZLENBQWpCO2VBK0VlNUMsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XHJcbmltcG9ydCB0cmFkaW5nIGZyb20gJy4vdHJhZGluZyc7XHJcbmltcG9ydCBhY2NvdW50IGZyb20gJy4vYWNjb3VudCc7XHJcblxyXG5jb25zdCB2YWxpZGF0ZSA9IHtcclxuXHR3ZWIzOiBhc3luYyAodHJhZGUsIHByb3ZpZGVyLCBzaWduZXIpID0+IHtcclxuXHJcblx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2luaXQnKTtcclxuXHJcblx0XHQvLyBjaGVjayB0aGF0IHdlYjMgZXhpc3RzXHJcblx0XHRpZiAod2luZG93LndlYjMgPT0gdW5kZWZpbmVkIHx8IE9iamVjdC5rZXlzKHdpbmRvdy53ZWIzKS5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ3dlYjNfdW5kZWZpbmVkJyk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBc2sgdXNlciB0byB1bmxvY2sgYW5kIGNvbm5lY3RcclxuXHRcdGlmICh3aW5kb3cud2ViMyA9PSB1bmRlZmluZWQgfHwgd2luZG93LndlYjMuZXRoLmFjY291bnRzWzBdID09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGF3YWl0IHdpbmRvdy5ldGhlcmV1bS5lbmFibGUoKTtcclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdC8vIHVzZXIgcmVqZWN0ZWQgc2NyZWVuXHJcblx0XHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdjb25uZWN0X3JlamVjdGVkJyk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBjaGVjayB3ZWIzIHRyYWRpbmcgaXMgc3VwcG9ydGVkIGZvciB0aGlzIGRleFxyXG5cdFx0aWYgKHRyYWRlLmVycm9yID09ICdObyB0cmFkZXMnKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAod2ViMy52ZXJzaW9uLm5ldHdvcmsgIT0gMSkge1xyXG5cdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ25ldHdvcmsnKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNoZWNrIGlmIGV0aGVyIGJhbGFuY2UgaXMgaW5zdWZmaWNpZW50XHJcblx0XHRjb25zdCBldGhlclRvV3JhcCA9IGF3YWl0IHV0aWxpdHkuZ2V0RXRoZXJUb1dyYXAodHJhZGUsIHByb3ZpZGVyLCBzaWduZXIpO1xyXG5cdFx0aWYgKGV0aGVyVG9XcmFwID09IC0xKSB7XHJcblx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignYmFsYW5jZScpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHQvLyB3cmFwIGV0aGVyIGlmIG5lY2Vzc2FyeVxyXG5cdFx0Y29uc3Qgd2V0aENvbnRyYWN0ID0gdXRpbGl0eS5nZXRXZXRoQ29udHJhY3Qoc2lnbmVyKTtcclxuXHRcdGNvbnN0IHdyYXBwaW5nID0gYXdhaXQgdHJhZGluZy53cmFwKHdldGhDb250cmFjdCwgZXRoZXJUb1dyYXApO1xyXG5cdFx0aWYgKCF3cmFwcGluZykgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdC8vIENoZWNrIGlmIGJhbGFuY2UgaXMgaW5zdWZmaWNpZW50XHJcblx0XHRsZXQgYmFsYW5jZTtcclxuXHRcdGlmKHRyYWRlLm1ldGFkYXRhLmlucHV0KXtcclxuXHRcdFx0Ly8gZXJjMjBcclxuXHRcdFx0YmFsYW5jZSA9IGF3YWl0IGFjY291bnQuZ2V0RVJDMjBCYWxhbmNlKHRyYWRlLCBwcm92aWRlciwgc2lnbmVyKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQvLyBldGhcclxuXHRcdFx0YmFsYW5jZSA9IGF3YWl0IGFjY291bnQuZ2V0RVRIQmFsYW5jZSh0cmFkZSk7XHJcblx0XHR9XHJcblx0XHRpZiAoIWJhbGFuY2UpIHtcclxuXHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdiYWxhbmNlJyk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHJhZGUubWV0YWRhdGEuaW5wdXQpIHtcclxuXHRcdFx0Ly8gZ2V0IGNvbnRyYWN0c1xyXG5cdFx0XHRjb25zdCB0b2tlbkNvbnRyYWN0ID0gdXRpbGl0eS5nZXRUb2tlbkNvbnRyYWN0KHRyYWRlLCBzaWduZXIpO1xyXG5cdFx0XHRjb25zdCBleGNoYW5nZUFkZHJlc3MgPSB0cmFkZS5tZXRhZGF0YS5pbnB1dC5zcGVuZGVyO1xyXG5cdFx0XHQvLyBnZXQgY2xpZW50IGFkZHJlc3NcclxuXHRcdFx0Y29uc3QgYWRkcmVzcyA9IGF3YWl0IHByb3ZpZGVyLmdldFNpZ25lcigpLmdldEFkZHJlc3MoKTtcclxuXHRcdFx0Ly8gZ2V0IGFsbG93YW5jZXNcclxuXHRcdFx0Y29uc3QgYWxsb3dhbmNlID0gYXdhaXQgdG9rZW5Db250cmFjdC5hbGxvd2FuY2UoYWRkcmVzcywgZXhjaGFuZ2VBZGRyZXNzKTtcclxuXHRcdFx0Y29uc3QgdG9rZW5BbW91bnQgPSB0cmFkZS5tZXRhZGF0YS5pbnB1dC5hbW91bnQ7XHJcblxyXG5cdFx0XHRpZiAoYWxsb3dhbmNlLmx0KHRva2VuQW1vdW50KSkge1xyXG5cdFx0XHRcdC8vIGFsbG93YW5jZSBuZWVkcyB0byBiZSBncmFudGVkXHJcblx0XHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdhbGxvd2FuY2UnKTtcclxuXHRcdFx0XHRjb25zdCB0cmFkaW5nX2FsbG93YW5jZSA9IGF3YWl0IHRyYWRpbmcuc2V0QWxsb3dhbmNlKHRva2VuQ29udHJhY3QsIGV4Y2hhbmdlQWRkcmVzcyk7XHJcblx0XHRcdFx0Ly8gY2hlY2sgaWYgdG9rZW4gYWxsb3dhbmNlIGlzIG5vdCBzZXRcclxuXHRcdFx0XHRpZighdHJhZGluZ19hbGxvd2FuY2UpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRlO1xyXG4iXX0=