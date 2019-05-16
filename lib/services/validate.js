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
              _context.next = 49;
              break;

            case 40:
              _context.prev = 40;
              _context.next = 43;
              return _account["default"].getETHBalance(trade);

            case 43:
              balance = _context.sent;
              _context.next = 49;
              break;

            case 46:
              _context.prev = 46;
              _context.t1 = _context["catch"](40);
              console.log(_context.t1);

            case 49:
              if (balance) {
                _context.next = 52;
                break;
              }

              window.web3StatusHandler('balance');
              return _context.abrupt("return", false);

            case 52:
              if (!trade.metadata.input) {
                _context.next = 69;
                break;
              }

              // get contracts
              tokenContract = _utility["default"].getTokenContract(trade, signer);
              exchangeAddress = trade.metadata.input.spender; // get client address

              _context.next = 57;
              return provider.getSigner().getAddress();

            case 57:
              address = _context.sent;
              _context.next = 60;
              return tokenContract.allowance(address, exchangeAddress);

            case 60:
              allowance = _context.sent;
              tokenAmount = trade.metadata.input.amount;

              if (!allowance.lt(tokenAmount)) {
                _context.next = 69;
                break;
              }

              // allowance needs to be granted
              window.web3StatusHandler('allowance');
              _context.next = 66;
              return _trading["default"].setAllowance(tokenContract, exchangeAddress);

            case 66:
              trading_allowance = _context.sent;

              if (trading_allowance) {
                _context.next = 69;
                break;
              }

              return _context.abrupt("return", false);

            case 69:
              return _context.abrupt("return", true);

            case 70:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[5, 10], [40, 46]]);
    }));

    return function (_x4, _x5, _x6) {
      return _ref.apply(this, arguments);
    };
  }())
};
var _default = validate;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy92YWxpZGF0ZS5qcyJdLCJuYW1lcyI6WyJ2YWxpZGF0ZSIsIndlYjMiLCJ0cmFkZSIsInByb3ZpZGVyIiwic2lnbmVyIiwid2luZG93Iiwid2ViM1N0YXR1c0hhbmRsZXIiLCJ1bmRlZmluZWQiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiZXRoIiwiYWNjb3VudHMiLCJldGhlcmV1bSIsImVuYWJsZSIsImVycm9yIiwidmVyc2lvbiIsIm5ldHdvcmsiLCJ1dGlsaXR5IiwiZ2V0RXRoZXJUb1dyYXAiLCJldGhlclRvV3JhcCIsIndldGhDb250cmFjdCIsImdldFdldGhDb250cmFjdCIsInRyYWRpbmciLCJ3cmFwIiwid3JhcHBpbmciLCJtZXRhZGF0YSIsImlucHV0IiwiYWNjb3VudCIsImdldEVSQzIwQmFsYW5jZSIsImJhbGFuY2UiLCJnZXRFVEhCYWxhbmNlIiwiY29uc29sZSIsImxvZyIsInRva2VuQ29udHJhY3QiLCJnZXRUb2tlbkNvbnRyYWN0IiwiZXhjaGFuZ2VBZGRyZXNzIiwic3BlbmRlciIsImdldFNpZ25lciIsImdldEFkZHJlc3MiLCJhZGRyZXNzIiwiYWxsb3dhbmNlIiwidG9rZW5BbW91bnQiLCJhbW91bnQiLCJsdCIsInNldEFsbG93YW5jZSIsInRyYWRpbmdfYWxsb3dhbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUEsSUFBTUEsUUFBUSxHQUFHO0FBQ2ZDLEVBQUFBLElBQUk7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlDQUFFLGlCQUFPQyxLQUFQLEVBQWNDLFFBQWQsRUFBd0JDLE1BQXhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVKQyxjQUFBQSxNQUFNLENBQUNDLGlCQUFQLENBQXlCLE1BQXpCLEVBRkksQ0FJSjs7QUFKSSxvQkFLQUQsTUFBTSxDQUFDSixJ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RUFBZ0NFLE1BQWhDLENBcEVwQjtBQXFFSWdDLGNBQUFBLGVBckVKLEdBcUVzQmxDLEtBQUssQ0FBQ3dCLFFBQU4sQ0FBZUMsS0FBZixDQUFxQlUsT0FyRTNDLEVBc0VGOztBQXRFRTtBQUFBLHFCQXVFb0JsQyxRQUFRLENBQUNtQyxTQUFULEdBQXFCQyxVQUFyQixFQXZFcEI7O0FBQUE7QUF1RUlDLGNBQUFBLE9BdkVKO0FBQUE7QUFBQSxxQkF5RXNCTixhQUFhLENBQUNPLFNBQWQsQ0FBd0JELE9BQXhCLEVBQWlDSixlQUFqQyxDQXpFdEI7O0FBQUE7QUF5RUlLLGNBQUFBLFNBekVKO0FBMEVJQyxjQUFBQSxXQTFFSixHQTBFa0J4QyxLQUFLLENBQUN3QixRQUFOLENBQWVDLEtBQWYsQ0FBcUJnQixNQTFFdkM7O0FBQUEsbUJBNEVFRixTQUFTLENBQUNHLEVBQVYsQ0FBYUYsV0FBYixDQTVFRjtBQUFBO0FBQUE7QUFBQTs7QUE2RUE7QUFDQXJDLGNBQUFBLE1BQU0sQ0FBQ0MsaUJBQVAsQ0FBeUIsV0FBekI7QUE5RUE7QUFBQSxxQkErRWdDaUIsb0JBQVFzQixZQUFSLENBQXFCWCxhQUFyQixFQUFvQ0UsZUFBcEMsQ0EvRWhDOztBQUFBO0FBK0VNVSxjQUFBQSxpQkEvRU47O0FBQUEsa0JBaUZJQSxpQkFqRko7QUFBQTtBQUFBO0FBQUE7O0FBQUEsK0NBaUY4QixLQWpGOUI7O0FBQUE7QUFBQSwrQ0FxRkcsSUFyRkg7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBRjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURXLENBQWpCO2VBMEZlOUMsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XG5pbXBvcnQgdHJhZGluZyBmcm9tICcuL3RyYWRpbmcnO1xuaW1wb3J0IGFjY291bnQgZnJvbSAnLi9hY2NvdW50JztcblxuY29uc3QgdmFsaWRhdGUgPSB7XG4gIHdlYjM6IGFzeW5jICh0cmFkZSwgcHJvdmlkZXIsIHNpZ25lcikgPT4ge1xuXG4gICAgd2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdpbml0Jyk7XG5cbiAgICAvLyBjaGVjayB0aGF0IHdlYjMgZXhpc3RzXG4gICAgaWYgKHdpbmRvdy53ZWIzID09IHVuZGVmaW5lZCB8fCBPYmplY3Qua2V5cyh3aW5kb3cud2ViMykubGVuZ3RoID09IDApIHtcbiAgICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignd2ViM191bmRlZmluZWQnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBhc2sgdXNlciB0byB1bmxvY2sgYW5kIGNvbm5lY3RcbiAgICBpZiAod2luZG93LndlYjMgPT0gdW5kZWZpbmVkIHx8IHdpbmRvdy53ZWIzLmV0aC5hY2NvdW50c1swXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5ldGhlcmV1bS5lbmFibGUoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gdXNlciByZWplY3RlZCBzY3JlZW5cbiAgICAgICAgd2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdjb25uZWN0X3JlamVjdGVkJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdXRvIHVubG9jayBkaWRudCB3b3JrLCB3YWxsZXQgaXMgc3RpbGwgbG9ja2VkXG4gICAgaWYod2luZG93LndlYjMuZXRoLmFjY291bnRzWzBdID09IHVuZGVmaW5lZCl7XG4gICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ3VubG9ja193YWxsZXQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBjaGVjayB3ZWIzIHRyYWRpbmcgaXMgc3VwcG9ydGVkIGZvciB0aGlzIGRleFxuICAgIGlmICh0cmFkZS5lcnJvciA9PSAnTm8gdHJhZGVzJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh3ZWIzLnZlcnNpb24ubmV0d29yayAhPSAxKSB7XG4gICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ25ldHdvcmsnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiBldGhlciBiYWxhbmNlIGlzIGluc3VmZmljaWVudFxuICAgIGNvbnN0IGV0aGVyVG9XcmFwID0gYXdhaXQgdXRpbGl0eS5nZXRFdGhlclRvV3JhcCh0cmFkZSwgcHJvdmlkZXIsIHNpZ25lcik7XG4gICAgaWYgKGV0aGVyVG9XcmFwID09IC0xKSB7XG4gICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2JhbGFuY2UnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gd3JhcCBldGhlciBpZiBuZWNlc3NhcnlcbiAgICBjb25zdCB3ZXRoQ29udHJhY3QgPSB1dGlsaXR5LmdldFdldGhDb250cmFjdChzaWduZXIpO1xuICAgIGNvbnN0IHdyYXBwaW5nID0gYXdhaXQgdHJhZGluZy53cmFwKHdldGhDb250cmFjdCwgZXRoZXJUb1dyYXApO1xuICAgIGlmICghd3JhcHBpbmcpIHJldHVybiBmYWxzZTtcblxuICAgIC8vIENoZWNrIGlmIGJhbGFuY2UgaXMgaW5zdWZmaWNpZW50XG4gICAgbGV0IGJhbGFuY2U7XG4gICAgaWYodHJhZGUubWV0YWRhdGEuaW5wdXQpe1xuICAgICAgLy8gZXJjMjBcbiAgICAgIGJhbGFuY2UgPSBhd2FpdCBhY2NvdW50LmdldEVSQzIwQmFsYW5jZSh0cmFkZSwgcHJvdmlkZXIsIHNpZ25lcik7XG4gICAgfWVsc2V7XG4gICAgICAvLyBldGhcbiAgICAgIHRyeXtcbiAgICAgICAgYmFsYW5jZSA9IGF3YWl0IGFjY291bnQuZ2V0RVRIQmFsYW5jZSh0cmFkZSk7XG4gICAgICB9Y2F0Y2goZXJyKXtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWJhbGFuY2UpIHtcbiAgICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignYmFsYW5jZScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0cmFkZS5tZXRhZGF0YS5pbnB1dCkge1xuICAgICAgLy8gZ2V0IGNvbnRyYWN0c1xuICAgICAgY29uc3QgdG9rZW5Db250cmFjdCA9IHV0aWxpdHkuZ2V0VG9rZW5Db250cmFjdCh0cmFkZSwgc2lnbmVyKTtcbiAgICAgIGNvbnN0IGV4Y2hhbmdlQWRkcmVzcyA9IHRyYWRlLm1ldGFkYXRhLmlucHV0LnNwZW5kZXI7XG4gICAgICAvLyBnZXQgY2xpZW50IGFkZHJlc3NcbiAgICAgIGNvbnN0IGFkZHJlc3MgPSBhd2FpdCBwcm92aWRlci5nZXRTaWduZXIoKS5nZXRBZGRyZXNzKCk7XG4gICAgICAvLyBnZXQgYWxsb3dhbmNlc1xuICAgICAgY29uc3QgYWxsb3dhbmNlID0gYXdhaXQgdG9rZW5Db250cmFjdC5hbGxvd2FuY2UoYWRkcmVzcywgZXhjaGFuZ2VBZGRyZXNzKTtcbiAgICAgIGNvbnN0IHRva2VuQW1vdW50ID0gdHJhZGUubWV0YWRhdGEuaW5wdXQuYW1vdW50O1xuXG4gICAgICBpZiAoYWxsb3dhbmNlLmx0KHRva2VuQW1vdW50KSkge1xuICAgICAgICAvLyBhbGxvd2FuY2UgbmVlZHMgdG8gYmUgZ3JhbnRlZFxuICAgICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2FsbG93YW5jZScpO1xuICAgICAgICBjb25zdCB0cmFkaW5nX2FsbG93YW5jZSA9IGF3YWl0IHRyYWRpbmcuc2V0QWxsb3dhbmNlKHRva2VuQ29udHJhY3QsIGV4Y2hhbmdlQWRkcmVzcyk7XG4gICAgICAgIC8vIGNoZWNrIGlmIHRva2VuIGFsbG93YW5jZSBpcyBub3Qgc2V0XG4gICAgICAgIGlmKCF0cmFkaW5nX2FsbG93YW5jZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0ZTtcbiJdfQ==