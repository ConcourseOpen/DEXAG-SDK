"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _utility = _interopRequireDefault(require("./utility"));

var account = {
  getERC20Balance: function () {
    var _getERC20Balance = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee(trade, provider, signer) {
      var tokenContract, address;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              tokenContract = _utility["default"].getTokenContract(trade, signer);
              _context.next = 3;
              return provider.getSigner().getAddress();

            case 3:
              address = _context.sent;
              return _context.abrupt("return", new Promise(function (resolve) {
                // get balance for token
                var promise = tokenContract.functions.balanceOf(address);
                promise.then(function (tokenBalance) {
                  var tokenAmount = trade.metadata.input.amount; // check if insufficient funds

                  resolve(tokenBalance.gte(tokenAmount));
                })["catch"](function (err) {
                  console.log(err);
                  resolve(false);
                });
              }));

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function getERC20Balance(_x, _x2, _x3) {
      return _getERC20Balance.apply(this, arguments);
    }

    return getERC20Balance;
  }(),
  getETHBalance: function () {
    var _getETHBalance = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2(trade) {
      var address, wei, ethBalance, ethAmount;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              address = window.web3.eth.accounts[0];
              wei = _utility["default"].promisify(function (cb) {
                return web3.eth.getBalance(address, cb);
              });
              _context2.prev = 2;
              _context2.next = 5;
              return wei;

            case 5:
              ethBalance = _context2.sent;
              ethAmount = trade.value;
              return _context2.abrupt("return", ethBalance.gte(ethAmount));

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](2);
              console.log(_context2.t0);
              return _context2.abrupt("return", false);

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[2, 10]]);
    }));

    function getETHBalance(_x4) {
      return _getETHBalance.apply(this, arguments);
    }

    return getETHBalance;
  }()
};
var _default = account;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9hY2NvdW50LmpzIl0sIm5hbWVzIjpbImFjY291bnQiLCJnZXRFUkMyMEJhbGFuY2UiLCJ0cmFkZSIsInByb3ZpZGVyIiwic2lnbmVyIiwidG9rZW5Db250cmFjdCIsInV0aWxpdHkiLCJnZXRUb2tlbkNvbnRyYWN0IiwiZ2V0U2lnbmVyIiwiZ2V0QWRkcmVzcyIsImFkZHJlc3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsInByb21pc2UiLCJmdW5jdGlvbnMiLCJiYWxhbmNlT2YiLCJ0aGVuIiwidG9rZW5CYWxhbmNlIiwidG9rZW5BbW91bnQiLCJtZXRhZGF0YSIsImlucHV0IiwiYW1vdW50IiwiZ3RlIiwiZXJyIiwiY29uc29sZSIsImxvZyIsImdldEVUSEJhbGFuY2UiLCJ3aW5kb3ciLCJ3ZWIzIiwiZXRoIiwiYWNjb3VudHMiLCJ3ZWkiLCJwcm9taXNpZnkiLCJjYiIsImdldEJhbGFuY2UiLCJldGhCYWxhbmNlIiwiZXRoQW1vdW50IiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFFQSxJQUFNQSxPQUFPLEdBQUc7QUFDZkMsRUFBQUEsZUFBZTtBQUFBO0FBQUE7QUFBQSxpQ0FBRSxpQkFBT0MsS0FBUCxFQUFjQyxRQUFkLEVBQXdCQyxNQUF4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDVkMsY0FBQUEsYUFEVSxHQUNNQyxvQkFBUUMsZ0JBQVIsQ0FBeUJMLEtBQXpCLEVBQWdDRSxNQUFoQyxDQUROO0FBQUE7QUFBQSxxQkFFTUQsUUFBUSxDQUFDSyxTQUFULEdBQXFCQyxVQUFyQixFQUZOOztBQUFBO0FBRVZDLGNBQUFBLE9BRlU7QUFBQSwrQ0FJVCxJQUFJQyxPQUFKLENBQVksVUFBQUMsT0FBTyxFQUFJO0FBQzdCO0FBQ0Esb0JBQU1DLE9BQU8sR0FBR1IsYUFBYSxDQUFDUyxTQUFkLENBQXdCQyxTQUF4QixDQUFrQ0wsT0FBbEMsQ0FBaEI7QUFDQUcsZ0JBQUFBLE9BQU8sQ0FBQ0csSUFBUixDQUFhLFVBQVNDLFlBQVQsRUFBdUI7QUFDbkMsc0JBQU1DLFdBQVcsR0FBR2hCLEtBQUssQ0FBQ2lCLFFBQU4sQ0FBZUMsS0FBZixDQUFxQkMsTUFBekMsQ0FEbUMsQ0FFbkM7O0FBQ0FULGtCQUFBQSxPQUFPLENBQUNLLFlBQVksQ0FBQ0ssR0FBYixDQUFpQkosV0FBakIsQ0FBRCxDQUFQO0FBQ0EsaUJBSkQsV0FJUyxVQUFTSyxHQUFULEVBQWM7QUFDdEJDLGtCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUYsR0FBWjtBQUNBWCxrQkFBQUEsT0FBTyxDQUFDLEtBQUQsQ0FBUDtBQUNBLGlCQVBEO0FBUUEsZUFYTSxDQUpTOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsS0FEQTtBQWtCZmMsRUFBQUEsYUFBYTtBQUFBO0FBQUE7QUFBQSxpQ0FBRSxrQkFBTXhCLEtBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1JRLGNBQUFBLE9BRFEsR0FDRWlCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZQyxHQUFaLENBQWdCQyxRQUFoQixDQUF5QixDQUF6QixDQURGO0FBRVJDLGNBQUFBLEdBRlEsR0FFRnpCLG9CQUFRMEIsU0FBUixDQUFrQixVQUFBQyxFQUFFO0FBQUEsdUJBQUlMLElBQUksQ0FBQ0MsR0FBTCxDQUFTSyxVQUFULENBQW9CeEIsT0FBcEIsRUFBNkJ1QixFQUE3QixDQUFKO0FBQUEsZUFBcEIsQ0FGRTtBQUFBO0FBQUE7QUFBQSxxQkFJWUYsR0FKWjs7QUFBQTtBQUlQSSxjQUFBQSxVQUpPO0FBS1BDLGNBQUFBLFNBTE8sR0FLS2xDLEtBQUssQ0FBQ21DLEtBTFg7QUFBQSxnREFNTEYsVUFBVSxDQUFDYixHQUFYLENBQWVjLFNBQWYsQ0FOSzs7QUFBQTtBQUFBO0FBQUE7QUFRYlosY0FBQUEsT0FBTyxDQUFDQyxHQUFSO0FBUmEsZ0RBU04sS0FUTTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUFGOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBbEJFLENBQWhCO2VBZ0NlekIsTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCaWdOdW1iZXIgZnJvbSAnYmlnbnVtYmVyLmpzJztcclxuXHJcbmltcG9ydCB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XHJcblxyXG5jb25zdCBhY2NvdW50ID0ge1xyXG5cdGdldEVSQzIwQmFsYW5jZTogYXN5bmMgKHRyYWRlLCBwcm92aWRlciwgc2lnbmVyKSA9PiB7XHJcblx0XHRjb25zdCB0b2tlbkNvbnRyYWN0ID0gdXRpbGl0eS5nZXRUb2tlbkNvbnRyYWN0KHRyYWRlLCBzaWduZXIpO1xyXG5cdFx0Y29uc3QgYWRkcmVzcyA9IGF3YWl0IHByb3ZpZGVyLmdldFNpZ25lcigpLmdldEFkZHJlc3MoKTtcclxuXHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcblx0XHRcdC8vIGdldCBiYWxhbmNlIGZvciB0b2tlblxyXG5cdFx0XHRjb25zdCBwcm9taXNlID0gdG9rZW5Db250cmFjdC5mdW5jdGlvbnMuYmFsYW5jZU9mKGFkZHJlc3MpO1xyXG5cdFx0XHRwcm9taXNlLnRoZW4oZnVuY3Rpb24odG9rZW5CYWxhbmNlKSB7XHJcblx0XHRcdFx0Y29uc3QgdG9rZW5BbW91bnQgPSB0cmFkZS5tZXRhZGF0YS5pbnB1dC5hbW91bnQ7XHJcblx0XHRcdFx0Ly8gY2hlY2sgaWYgaW5zdWZmaWNpZW50IGZ1bmRzXHJcblx0XHRcdFx0cmVzb2x2ZSh0b2tlbkJhbGFuY2UuZ3RlKHRva2VuQW1vdW50KSk7XHJcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRFVEhCYWxhbmNlOiBhc3luYyh0cmFkZSkgPT4ge1xyXG5cdFx0Y29uc3QgYWRkcmVzcyA9IHdpbmRvdy53ZWIzLmV0aC5hY2NvdW50c1swXTtcclxuXHRcdGNvbnN0IHdlaSA9IHV0aWxpdHkucHJvbWlzaWZ5KGNiID0+IHdlYjMuZXRoLmdldEJhbGFuY2UoYWRkcmVzcywgY2IpKTtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGNvbnN0IGV0aEJhbGFuY2UgPSBhd2FpdCB3ZWk7XHJcblx0XHRcdGNvbnN0IGV0aEFtb3VudCA9IHRyYWRlLnZhbHVlO1xyXG5cdFx0XHRyZXR1cm4gKGV0aEJhbGFuY2UuZ3RlKGV0aEFtb3VudCkpO1xyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhY2NvdW50O1xyXG4iXX0=