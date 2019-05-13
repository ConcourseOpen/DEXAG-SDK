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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy92YWxpZGF0ZS5qcyJdLCJuYW1lcyI6WyJ2YWxpZGF0ZSIsIndlYjMiLCJ0cmFkZSIsInByb3ZpZGVyIiwic2lnbmVyIiwid2luZG93Iiwid2ViM1N0YXR1c0hhbmRsZXIiLCJ1bmRlZmluZWQiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiZXRoIiwiYWNjb3VudHMiLCJldGhlcmV1bSIsImVuYWJsZSIsImVycm9yIiwidmVyc2lvbiIsIm5ldHdvcmsiLCJ1dGlsaXR5IiwiZ2V0RXRoZXJUb1dyYXAiLCJldGhlclRvV3JhcCIsIndldGhDb250cmFjdCIsImdldFdldGhDb250cmFjdCIsInRyYWRpbmciLCJ3cmFwIiwid3JhcHBpbmciLCJtZXRhZGF0YSIsImlucHV0IiwiYWNjb3VudCIsImdldEVSQzIwQmFsYW5jZSIsImJhbGFuY2UiLCJnZXRFVEhCYWxhbmNlIiwidG9rZW5Db250cmFjdCIsImdldFRva2VuQ29udHJhY3QiLCJleGNoYW5nZUFkZHJlc3MiLCJzcGVuZGVyIiwiZ2V0U2lnbmVyIiwiZ2V0QWRkcmVzcyIsImFkZHJlc3MiLCJhbGxvd2FuY2UiLCJ0b2tlbkFtb3VudCIsImFtb3VudCIsImx0Iiwic2V0QWxsb3dhbmNlIiwidHJhZGluZ19hbGxvd2FuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQSxJQUFNQSxRQUFRLEdBQUc7QUFDZkMsRUFBQUEsSUFBSTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUNBQUUsaUJBQU9DLEtBQVAsRUFBY0MsUUFBZCxFQUF3QkMsTUFBeEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUpDLGNBQUFBLE1BQU0sQ0FBQ0MsaUJBQVAsQ0FBeUIsTUFBekIsRUFGSSxDQUlKOztBQUpJLG9CQUtBRCxNQUFNLENBQUNKLElBQVAsSUFBZU0sU0FBZixJQUE0QkMsTUFBTSxDQUFDQyxJQUFQLENBQVlKLE1BQU0sQ0FBQ0osSUFBbkIsRUFBeUJTLE1BQXpCLElBQW1DLENBTC9EO0FBQUE7QUFBQTtBQUFBOztBQU1GTCxjQUFBQSxNQUFNLENBQUNDLGlCQUFQLENBQXlCLGdCQUF6QjtBQU5FLCtDQU9LLEtBUEw7O0FBQUE7QUFBQSxvQkFXQUQsTUFBTSxDQUFDSixJQUFQLElBQWVNLFNBQWYsSUFBNEJGLE1BQU0sQ0FBQ0osSUFBUCxDQUFZVSxHQUFaLENBQWdCQyxRQUFoQixDQUF5QixDQUF6QixLQUErQkwsU0FYM0Q7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLHFCQWFNRixNQUFNLENBQUNRLFFBQVAsQ0FBZ0JDLE1BQWhCLEVBYk47O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQWVBO0FBQ0FULGNBQUFBLE1BQU0sQ0FBQ0MsaUJBQVAsQ0FBeUIsa0JBQXpCO0FBaEJBLCtDQWlCTyxLQWpCUDs7QUFBQTtBQUFBLG9CQXFCQUosS0FBSyxDQUFDYSxLQUFOLElBQWUsV0FyQmY7QUFBQTtBQUFBO0FBQUE7O0FBQUEsK0NBc0JLLEtBdEJMOztBQUFBO0FBQUEsb0JBeUJBZCxJQUFJLENBQUNlLE9BQUwsQ0FBYUMsT0FBYixJQUF3QixDQXpCeEI7QUFBQTtBQUFBO0FBQUE7O0FBMEJGWixjQUFBQSxNQUFNLENBQUNDLGlCQUFQLENBQXlCLFNBQXpCO0FBMUJFLCtDQTJCSyxLQTNCTDs7QUFBQTtBQUFBO0FBQUEscUJBK0JzQlksb0JBQVFDLGNBQVIsQ0FBdUJqQixLQUF2QixFQUE4QkMsUUFBOUIsRUFBd0NDLE1BQXhDLENBL0J0Qjs7QUFBQTtBQStCRWdCLGNBQUFBLFdBL0JGOztBQUFBLG9CQWdDQUEsV0FBVyxJQUFJLENBQUMsQ0FoQ2hCO0FBQUE7QUFBQTtBQUFBOztBQWlDRmYsY0FBQUEsTUFBTSxDQUFDQyxpQkFBUCxDQUF5QixTQUF6QjtBQWpDRSwrQ0FrQ0ssS0FsQ0w7O0FBQUE7QUFvQ0o7QUFDTWUsY0FBQUEsWUFyQ0YsR0FxQ2lCSCxvQkFBUUksZUFBUixDQUF3QmxCLE1BQXhCLENBckNqQjtBQUFBO0FBQUEscUJBc0NtQm1CLG9CQUFRQyxJQUFSLENBQWFILFlBQWIsRUFBMkJELFdBQTNCLENBdENuQjs7QUFBQTtBQXNDRUssY0FBQUEsUUF0Q0Y7O0FBQUEsa0JBdUNDQSxRQXZDRDtBQUFBO0FBQUE7QUFBQTs7QUFBQSwrQ0F1Q2tCLEtBdkNsQjs7QUFBQTtBQUFBLG1CQTJDRHZCLEtBQUssQ0FBQ3dCLFFBQU4sQ0FBZUMsS0EzQ2Q7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxxQkE2Q2NDLG9CQUFRQyxlQUFSLENBQXdCM0IsS0FBeEIsRUFBK0JDLFFBQS9CLEVBQXlDQyxNQUF6QyxDQTdDZDs7QUFBQTtBQTZDRjBCLGNBQUFBLE9BN0NFO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEscUJBZ0RjRixvQkFBUUcsYUFBUixDQUFzQjdCLEtBQXRCLENBaERkOztBQUFBO0FBZ0RGNEIsY0FBQUEsT0FoREU7O0FBQUE7QUFBQSxrQkFrRENBLE9BbEREO0FBQUE7QUFBQTtBQUFBOztBQW1ERnpCLGNBQUFBLE1BQU0sQ0FBQ0MsaUJBQVAsQ0FBeUIsU0FBekI7QUFuREUsK0NBb0RLLEtBcERMOztBQUFBO0FBQUEsbUJBdURBSixLQUFLLENBQUN3QixRQUFOLENBQWVDLEtBdkRmO0FBQUE7QUFBQTtBQUFBOztBQXdERjtBQUNNSyxjQUFBQSxhQXpESixHQXlEb0JkLG9CQUFRZSxnQkFBUixDQUF5Qi9CLEtBQXpCLEVBQWdDRSxNQUFoQyxDQXpEcEI7QUEwREk4QixjQUFBQSxlQTFESixHQTBEc0JoQyxLQUFLLENBQUN3QixRQUFOLENBQWVDLEtBQWYsQ0FBcUJRLE9BMUQzQyxFQTJERjs7QUEzREU7QUFBQSxxQkE0RG9CaEMsUUFBUSxDQUFDaUMsU0FBVCxHQUFxQkMsVUFBckIsRUE1RHBCOztBQUFBO0FBNERJQyxjQUFBQSxPQTVESjtBQUFBO0FBQUEscUJBOERzQk4sYUFBYSxDQUFDTyxTQUFkLENBQXdCRCxPQUF4QixFQUFpQ0osZUFBakMsQ0E5RHRCOztBQUFBO0FBOERJSyxjQUFBQSxTQTlESjtBQStESUMsY0FBQUEsV0EvREosR0ErRGtCdEMsS0FBSyxDQUFDd0IsUUFBTixDQUFlQyxLQUFmLENBQXFCYyxNQS9EdkM7O0FBQUEsbUJBaUVFRixTQUFTLENBQUNHLEVBQVYsQ0FBYUYsV0FBYixDQWpFRjtBQUFBO0FBQUE7QUFBQTs7QUFrRUE7QUFDQW5DLGNBQUFBLE1BQU0sQ0FBQ0MsaUJBQVAsQ0FBeUIsV0FBekI7QUFuRUE7QUFBQSxxQkFvRWdDaUIsb0JBQVFvQixZQUFSLENBQXFCWCxhQUFyQixFQUFvQ0UsZUFBcEMsQ0FwRWhDOztBQUFBO0FBb0VNVSxjQUFBQSxpQkFwRU47O0FBQUEsa0JBc0VJQSxpQkF0RUo7QUFBQTtBQUFBO0FBQUE7O0FBQUEsK0NBc0U4QixLQXRFOUI7O0FBQUE7QUFBQSwrQ0EwRUcsSUExRUg7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBRjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURXLENBQWpCO2VBK0VlNUMsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XHJcbmltcG9ydCB0cmFkaW5nIGZyb20gJy4vdHJhZGluZyc7XHJcbmltcG9ydCBhY2NvdW50IGZyb20gJy4vYWNjb3VudCc7XHJcblxyXG5jb25zdCB2YWxpZGF0ZSA9IHtcclxuICB3ZWIzOiBhc3luYyAodHJhZGUsIHByb3ZpZGVyLCBzaWduZXIpID0+IHtcclxuXHJcbiAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2luaXQnKTtcclxuXHJcbiAgICAvLyBjaGVjayB0aGF0IHdlYjMgZXhpc3RzXHJcbiAgICBpZiAod2luZG93LndlYjMgPT0gdW5kZWZpbmVkIHx8IE9iamVjdC5rZXlzKHdpbmRvdy53ZWIzKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ3dlYjNfdW5kZWZpbmVkJyk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBc2sgdXNlciB0byB1bmxvY2sgYW5kIGNvbm5lY3RcclxuICAgIGlmICh3aW5kb3cud2ViMyA9PSB1bmRlZmluZWQgfHwgd2luZG93LndlYjMuZXRoLmFjY291bnRzWzBdID09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHdpbmRvdy5ldGhlcmV1bS5lbmFibGUoKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIC8vIHVzZXIgcmVqZWN0ZWQgc2NyZWVuXHJcbiAgICAgICAgd2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdjb25uZWN0X3JlamVjdGVkJyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBjaGVjayB3ZWIzIHRyYWRpbmcgaXMgc3VwcG9ydGVkIGZvciB0aGlzIGRleFxyXG4gICAgaWYgKHRyYWRlLmVycm9yID09ICdObyB0cmFkZXMnKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAod2ViMy52ZXJzaW9uLm5ldHdvcmsgIT0gMSkge1xyXG4gICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ25ldHdvcmsnKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNoZWNrIGlmIGV0aGVyIGJhbGFuY2UgaXMgaW5zdWZmaWNpZW50XHJcbiAgICBjb25zdCBldGhlclRvV3JhcCA9IGF3YWl0IHV0aWxpdHkuZ2V0RXRoZXJUb1dyYXAodHJhZGUsIHByb3ZpZGVyLCBzaWduZXIpO1xyXG4gICAgaWYgKGV0aGVyVG9XcmFwID09IC0xKSB7XHJcbiAgICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignYmFsYW5jZScpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvLyB3cmFwIGV0aGVyIGlmIG5lY2Vzc2FyeVxyXG4gICAgY29uc3Qgd2V0aENvbnRyYWN0ID0gdXRpbGl0eS5nZXRXZXRoQ29udHJhY3Qoc2lnbmVyKTtcclxuICAgIGNvbnN0IHdyYXBwaW5nID0gYXdhaXQgdHJhZGluZy53cmFwKHdldGhDb250cmFjdCwgZXRoZXJUb1dyYXApO1xyXG4gICAgaWYgKCF3cmFwcGluZykgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIC8vIENoZWNrIGlmIGJhbGFuY2UgaXMgaW5zdWZmaWNpZW50XHJcbiAgICBsZXQgYmFsYW5jZTtcclxuICAgIGlmKHRyYWRlLm1ldGFkYXRhLmlucHV0KXtcclxuICAgICAgLy8gZXJjMjBcclxuICAgICAgYmFsYW5jZSA9IGF3YWl0IGFjY291bnQuZ2V0RVJDMjBCYWxhbmNlKHRyYWRlLCBwcm92aWRlciwgc2lnbmVyKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAvLyBldGhcclxuICAgICAgYmFsYW5jZSA9IGF3YWl0IGFjY291bnQuZ2V0RVRIQmFsYW5jZSh0cmFkZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWJhbGFuY2UpIHtcclxuICAgICAgd2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdiYWxhbmNlJyk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHJhZGUubWV0YWRhdGEuaW5wdXQpIHtcclxuICAgICAgLy8gZ2V0IGNvbnRyYWN0c1xyXG4gICAgICBjb25zdCB0b2tlbkNvbnRyYWN0ID0gdXRpbGl0eS5nZXRUb2tlbkNvbnRyYWN0KHRyYWRlLCBzaWduZXIpO1xyXG4gICAgICBjb25zdCBleGNoYW5nZUFkZHJlc3MgPSB0cmFkZS5tZXRhZGF0YS5pbnB1dC5zcGVuZGVyO1xyXG4gICAgICAvLyBnZXQgY2xpZW50IGFkZHJlc3NcclxuICAgICAgY29uc3QgYWRkcmVzcyA9IGF3YWl0IHByb3ZpZGVyLmdldFNpZ25lcigpLmdldEFkZHJlc3MoKTtcclxuICAgICAgLy8gZ2V0IGFsbG93YW5jZXNcclxuICAgICAgY29uc3QgYWxsb3dhbmNlID0gYXdhaXQgdG9rZW5Db250cmFjdC5hbGxvd2FuY2UoYWRkcmVzcywgZXhjaGFuZ2VBZGRyZXNzKTtcclxuICAgICAgY29uc3QgdG9rZW5BbW91bnQgPSB0cmFkZS5tZXRhZGF0YS5pbnB1dC5hbW91bnQ7XHJcblxyXG4gICAgICBpZiAoYWxsb3dhbmNlLmx0KHRva2VuQW1vdW50KSkge1xyXG4gICAgICAgIC8vIGFsbG93YW5jZSBuZWVkcyB0byBiZSBncmFudGVkXHJcbiAgICAgICAgd2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdhbGxvd2FuY2UnKTtcclxuICAgICAgICBjb25zdCB0cmFkaW5nX2FsbG93YW5jZSA9IGF3YWl0IHRyYWRpbmcuc2V0QWxsb3dhbmNlKHRva2VuQ29udHJhY3QsIGV4Y2hhbmdlQWRkcmVzcyk7XHJcbiAgICAgICAgLy8gY2hlY2sgaWYgdG9rZW4gYWxsb3dhbmNlIGlzIG5vdCBzZXRcclxuICAgICAgICBpZighdHJhZGluZ19hbGxvd2FuY2UpIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRlO1xyXG4iXX0=