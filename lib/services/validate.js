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
              if (!(window.web3.eth.accounts[0] == undefined)) {
                _context.next = 17;
                break;
              }

              window.web3StatusHandler('unlock_wallet');
              return _context.abrupt("return");

            case 17:
              if (!(trade.error == 'No trades')) {
                _context.next = 19;
                break;
              }

              return _context.abrupt("return", false);

            case 19:
              if (!(web3.version.network != 1)) {
                _context.next = 22;
                break;
              }

              window.web3StatusHandler('network');
              return _context.abrupt("return", false);

            case 22:
              _context.next = 24;
              return _utility["default"].getEtherToWrap(trade, provider, signer);

            case 24:
              etherToWrap = _context.sent;

              if (!(etherToWrap == -1)) {
                _context.next = 28;
                break;
              }

              window.web3StatusHandler('balance');
              return _context.abrupt("return", false);

            case 28:
              // wrap ether if necessary
              wethContract = _utility["default"].getWethContract(signer);
              _context.next = 31;
              return _trading["default"].wrap(wethContract, etherToWrap);

            case 31:
              wrapping = _context.sent;

              if (wrapping) {
                _context.next = 34;
                break;
              }

              return _context.abrupt("return", false);

            case 34:
              if (!trade.metadata.input) {
                _context.next = 40;
                break;
              }

              _context.next = 37;
              return _account["default"].getERC20Balance(trade, provider, signer);

            case 37:
              balance = _context.sent;
              _context.next = 43;
              break;

            case 40:
              _context.next = 42;
              return _account["default"].getETHBalance(trade);

            case 42:
              balance = _context.sent;

            case 43:
              if (balance) {
                _context.next = 46;
                break;
              }

              window.web3StatusHandler('balance');
              return _context.abrupt("return", false);

            case 46:
              if (!trade.metadata.input) {
                _context.next = 63;
                break;
              }

              // get contracts
              tokenContract = _utility["default"].getTokenContract(trade, signer);
              exchangeAddress = trade.metadata.input.spender; // get client address

              _context.next = 51;
              return provider.getSigner().getAddress();

            case 51:
              address = _context.sent;
              _context.next = 54;
              return tokenContract.allowance(address, exchangeAddress);

            case 54:
              allowance = _context.sent;
              tokenAmount = trade.metadata.input.amount;

              if (!allowance.lt(tokenAmount)) {
                _context.next = 63;
                break;
              }

              // allowance needs to be granted
              window.web3StatusHandler('allowance');
              _context.next = 60;
              return _trading["default"].setAllowance(tokenContract, exchangeAddress);

            case 60:
              trading_allowance = _context.sent;

              if (trading_allowance) {
                _context.next = 63;
                break;
              }

              return _context.abrupt("return", false);

            case 63:
              return _context.abrupt("return", true);

            case 64:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy92YWxpZGF0ZS5qcyJdLCJuYW1lcyI6WyJ2YWxpZGF0ZSIsIndlYjMiLCJ0cmFkZSIsInByb3ZpZGVyIiwic2lnbmVyIiwid2luZG93Iiwid2ViM1N0YXR1c0hhbmRsZXIiLCJ1bmRlZmluZWQiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiZXRoIiwiYWNjb3VudHMiLCJldGhlcmV1bSIsImVuYWJsZSIsImVycm9yIiwidmVyc2lvbiIsIm5ldHdvcmsiLCJ1dGlsaXR5IiwiZ2V0RXRoZXJUb1dyYXAiLCJldGhlclRvV3JhcCIsIndldGhDb250cmFjdCIsImdldFdldGhDb250cmFjdCIsInRyYWRpbmciLCJ3cmFwIiwid3JhcHBpbmciLCJtZXRhZGF0YSIsImlucHV0IiwiYWNjb3VudCIsImdldEVSQzIwQmFsYW5jZSIsImJhbGFuY2UiLCJnZXRFVEhCYWxhbmNlIiwidG9rZW5Db250cmFjdCIsImdldFRva2VuQ29udHJhY3QiLCJleGNoYW5nZUFkZHJlc3MiLCJzcGVuZGVyIiwiZ2V0U2lnbmVyIiwiZ2V0QWRkcmVzcyIsImFkZHJlc3MiLCJhbGxvd2FuY2UiLCJ0b2tlbkFtb3VudCIsImFtb3VudCIsImx0Iiwic2V0QWxsb3dhbmNlIiwidHJhZGluZ19hbGxvd2FuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQSxJQUFNQSxRQUFRLEdBQUc7QUFDZkMsRUFBQUEsSUFBSTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUNBQUUsaUJBQU9DLEtBQVAsRUFBY0MsUUFBZCxFQUF3QkMsTUFBeEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUpDLGNBQUFBLE1BQU0sQ0FBQ0MsaUJBQVAsQ0FBeUIsTUFBekIsRUFGSSxDQUlKOztBQUpJLG9CQUtBRCxNQUFNLENBQUNKLElBQVAsSUFBZU0sU0FBZixJ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QlEsT0FqRTNDLEVBa0VGOztBQWxFRTtBQUFBLHFCQW1Fb0JoQyxRQUFRLENBQUNpQyxTQUFULEdBQXFCQyxVQUFyQixFQW5FcEI7O0FBQUE7QUFtRUlDLGNBQUFBLE9BbkVKO0FBQUE7QUFBQSxxQkFxRXNCTixhQUFhLENBQUNPLFNBQWQsQ0FBd0JELE9BQXhCLEVBQWlDSixlQUFqQyxDQXJFdEI7O0FBQUE7QUFxRUlLLGNBQUFBLFNBckVKO0FBc0VJQyxjQUFBQSxXQXRFSixHQXNFa0J0QyxLQUFLLENBQUN3QixRQUFOLENBQWVDLEtBQWYsQ0FBcUJjLE1BdEV2Qzs7QUFBQSxtQkF3RUVGLFNBQVMsQ0FBQ0csRUFBVixDQUFhRixXQUFiLENBeEVGO0FBQUE7QUFBQTtBQUFBOztBQXlFQTtBQUNBbkMsY0FBQUEsTUFBTSxDQUFDQyxpQkFBUCxDQUF5QixXQUF6QjtBQTFFQTtBQUFBLHFCQTJFZ0NpQixvQkFBUW9CLFlBQVIsQ0FBcUJYLGFBQXJCLEVBQW9DRSxlQUFwQyxDQTNFaEM7O0FBQUE7QUEyRU1VLGNBQUFBLGlCQTNFTjs7QUFBQSxrQkE2RUlBLGlCQTdFSjtBQUFBO0FBQUE7QUFBQTs7QUFBQSwrQ0E2RThCLEtBN0U5Qjs7QUFBQTtBQUFBLCtDQWlGRyxJQWpGSDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUFGOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRFcsQ0FBakI7ZUFzRmU1QyxRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi91dGlsaXR5JztcbmltcG9ydCB0cmFkaW5nIGZyb20gJy4vdHJhZGluZyc7XG5pbXBvcnQgYWNjb3VudCBmcm9tICcuL2FjY291bnQnO1xuXG5jb25zdCB2YWxpZGF0ZSA9IHtcbiAgd2ViMzogYXN5bmMgKHRyYWRlLCBwcm92aWRlciwgc2lnbmVyKSA9PiB7XG5cbiAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2luaXQnKTtcblxuICAgIC8vIGNoZWNrIHRoYXQgd2ViMyBleGlzdHNcbiAgICBpZiAod2luZG93LndlYjMgPT0gdW5kZWZpbmVkIHx8IE9iamVjdC5rZXlzKHdpbmRvdy53ZWIzKS5sZW5ndGggPT0gMCkge1xuICAgICAgd2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCd3ZWIzX3VuZGVmaW5lZCcpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGFzayB1c2VyIHRvIHVubG9jayBhbmQgY29ubmVjdFxuICAgIGlmICh3aW5kb3cud2ViMyA9PSB1bmRlZmluZWQgfHwgd2luZG93LndlYjMuZXRoLmFjY291bnRzWzBdID09IHVuZGVmaW5lZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgd2luZG93LmV0aGVyZXVtLmVuYWJsZSgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyB1c2VyIHJlamVjdGVkIHNjcmVlblxuICAgICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2Nvbm5lY3RfcmVqZWN0ZWQnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF1dG8gdW5sb2NrIGRpZG50IHdvcmssIHdhbGxldCBpcyBzdGlsbCBsb2NrZWRcbiAgICBpZih3aW5kb3cud2ViMy5ldGguYWNjb3VudHNbMF0gPT0gdW5kZWZpbmVkKXtcbiAgICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcigndW5sb2NrX3dhbGxldCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIHdlYjMgdHJhZGluZyBpcyBzdXBwb3J0ZWQgZm9yIHRoaXMgZGV4XG4gICAgaWYgKHRyYWRlLmVycm9yID09ICdObyB0cmFkZXMnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHdlYjMudmVyc2lvbi5uZXR3b3JrICE9IDEpIHtcbiAgICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignbmV0d29yaycpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIGV0aGVyIGJhbGFuY2UgaXMgaW5zdWZmaWNpZW50XG4gICAgY29uc3QgZXRoZXJUb1dyYXAgPSBhd2FpdCB1dGlsaXR5LmdldEV0aGVyVG9XcmFwKHRyYWRlLCBwcm92aWRlciwgc2lnbmVyKTtcbiAgICBpZiAoZXRoZXJUb1dyYXAgPT0gLTEpIHtcbiAgICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignYmFsYW5jZScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyB3cmFwIGV0aGVyIGlmIG5lY2Vzc2FyeVxuICAgIGNvbnN0IHdldGhDb250cmFjdCA9IHV0aWxpdHkuZ2V0V2V0aENvbnRyYWN0KHNpZ25lcik7XG4gICAgY29uc3Qgd3JhcHBpbmcgPSBhd2FpdCB0cmFkaW5nLndyYXAod2V0aENvbnRyYWN0LCBldGhlclRvV3JhcCk7XG4gICAgaWYgKCF3cmFwcGluZykgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gQ2hlY2sgaWYgYmFsYW5jZSBpcyBpbnN1ZmZpY2llbnRcbiAgICBsZXQgYmFsYW5jZTtcbiAgICBpZih0cmFkZS5tZXRhZGF0YS5pbnB1dCl7XG4gICAgICAvLyBlcmMyMFxuICAgICAgYmFsYW5jZSA9IGF3YWl0IGFjY291bnQuZ2V0RVJDMjBCYWxhbmNlKHRyYWRlLCBwcm92aWRlciwgc2lnbmVyKTtcbiAgICB9ZWxzZXtcbiAgICAgIC8vIGV0aFxuICAgICAgYmFsYW5jZSA9IGF3YWl0IGFjY291bnQuZ2V0RVRIQmFsYW5jZSh0cmFkZSk7XG4gICAgfVxuICAgIGlmICghYmFsYW5jZSkge1xuICAgICAgd2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdiYWxhbmNlJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRyYWRlLm1ldGFkYXRhLmlucHV0KSB7XG4gICAgICAvLyBnZXQgY29udHJhY3RzXG4gICAgICBjb25zdCB0b2tlbkNvbnRyYWN0ID0gdXRpbGl0eS5nZXRUb2tlbkNvbnRyYWN0KHRyYWRlLCBzaWduZXIpO1xuICAgICAgY29uc3QgZXhjaGFuZ2VBZGRyZXNzID0gdHJhZGUubWV0YWRhdGEuaW5wdXQuc3BlbmRlcjtcbiAgICAgIC8vIGdldCBjbGllbnQgYWRkcmVzc1xuICAgICAgY29uc3QgYWRkcmVzcyA9IGF3YWl0IHByb3ZpZGVyLmdldFNpZ25lcigpLmdldEFkZHJlc3MoKTtcbiAgICAgIC8vIGdldCBhbGxvd2FuY2VzXG4gICAgICBjb25zdCBhbGxvd2FuY2UgPSBhd2FpdCB0b2tlbkNvbnRyYWN0LmFsbG93YW5jZShhZGRyZXNzLCBleGNoYW5nZUFkZHJlc3MpO1xuICAgICAgY29uc3QgdG9rZW5BbW91bnQgPSB0cmFkZS5tZXRhZGF0YS5pbnB1dC5hbW91bnQ7XG5cbiAgICAgIGlmIChhbGxvd2FuY2UubHQodG9rZW5BbW91bnQpKSB7XG4gICAgICAgIC8vIGFsbG93YW5jZSBuZWVkcyB0byBiZSBncmFudGVkXG4gICAgICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignYWxsb3dhbmNlJyk7XG4gICAgICAgIGNvbnN0IHRyYWRpbmdfYWxsb3dhbmNlID0gYXdhaXQgdHJhZGluZy5zZXRBbGxvd2FuY2UodG9rZW5Db250cmFjdCwgZXhjaGFuZ2VBZGRyZXNzKTtcbiAgICAgICAgLy8gY2hlY2sgaWYgdG9rZW4gYWxsb3dhbmNlIGlzIG5vdCBzZXRcbiAgICAgICAgaWYoIXRyYWRpbmdfYWxsb3dhbmNlKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRlO1xuIl19