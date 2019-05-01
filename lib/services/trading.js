"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ethers = require("ethers");

var _utility = _interopRequireDefault(require("./utility"));

var _bignumber = require("bignumber.js");

var trading = {
  getGas: function () {
    var _getGas = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", new Promise(function (resolve) {
                try {
                  fetch('https://ethgasstation.info/json/ethgasAPI.json').then(function (response) {
                    return response.json();
                  }).then(function (data) {
                    resolve(_ethers.ethers.utils.bigNumberify(web3.toWei(data.fast / 10, 'gwei')));
                  });
                } catch (err) {
                  // default to 5 if error
                  resolve(_ethers.ethers.utils.bigNumberify(web3.toWei(5, 'gwei')));
                }
              }));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function getGas() {
      return _getGas.apply(this, arguments);
    }

    return getGas;
  }(),
  setAllowance: function () {
    var _setAllowance = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2(tokenContract, exchangeAddress) {
      var fast_gas;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return trading.getGas();

            case 2:
              fast_gas = _context2.sent;
              return _context2.abrupt("return", new Promise(function (resolve) {
                try {
                  var uintMax = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
                  console.log(fast_gas);
                  var promise = tokenContract.functions.approve(exchangeAddress, uintMax, {
                    gasPrice: fast_gas
                  });
                  promise.then(function (status) {
                    console.log(status);
                    window.web3StatusHandler('send_trade', status.hash);

                    _utility["default"].waitForReceipt(status.hash, function () {
                      window.web3StatusHandler('mined_approve', status.hash);
                      resolve(true);
                    });
                  })["catch"](function (err) {
                    resolve(false);
                    console.log('Transaction rejected ' + err);
                  });
                } catch (e) {
                  resolve(false);
                  console.log(e);
                }
              }));

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function setAllowance(_x, _x2) {
      return _setAllowance.apply(this, arguments);
    }

    return setAllowance;
  }(),
  wrap: function () {
    var _wrap = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3(wethContract, amount) {
      var fast_gas;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return trading.getGas();

            case 2:
              fast_gas = _context3.sent;
              return _context3.abrupt("return", new Promise(function (resolve) {
                try {
                  if (amount == 0) {
                    resolve(true);
                  } else {
                    // show wrap init message
                    window.web3StatusHandler('request_wrap');

                    var value = _ethers.ethers.utils.bigNumberify(amount);

                    var txOptions = {
                      value: value,
                      gasPrice: fast_gas
                    };
                    var promise = wethContract.deposit(txOptions); // wrap sent

                    promise.then(function (status) {
                      window.web3StatusHandler('send_wrap', status.hash);

                      _utility["default"].waitForReceipt(status.hash, function () {
                        // wrap mined
                        window.web3StatusHandler('mined_wrap', status.hash);
                        resolve(true);
                      });
                    })["catch"](function (err) {
                      resolve(false);
                    });
                  }
                } catch (e) {
                  resolve(false);
                  console.log(e);
                }
              }));

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function wrap(_x3, _x4) {
      return _wrap.apply(this, arguments);
    }

    return wrap;
  }(),
  unwrap: function unwrap(wethContract, amount) {
    return new Promise(function (resolve) {
      try {
        if (amount == 0) {
          resolve(true);
        } else {
          var promise = wethContract.withdraw(amount);
          promise.then(function (status) {
            console.log(status);

            _utility["default"].waitForReceipt(status.hash, function () {
              resolve(true);
            });
          })["catch"](function (err) {
            resolve(false);
          });
        }
      } catch (e) {
        resolve(false);
        console.log(e);
      }
    });
  },
  getBest: function () {
    var _getBest = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee4() {
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", new Promise(function (resolve) {
                try {
                  fetch('https://dex.ag/api/trade?from=ETH&to=DAI&fromAmount=100&dex=best', {
                    headers: {
                      'Accept': 'application/json'
                    }
                  }).then(function (response) {
                    return response.json();
                  }).then(function (data) {
                    resolve(data);
                  });
                } catch (err) {
                  // default to 5 if error
                  resolve('err');
                  console.log('api error');
                }
              }));

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function getBest() {
      return _getBest.apply(this, arguments);
    }

    return getBest;
  }()
};
var _default = trading;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy90cmFkaW5nLmpzIl0sIm5hbWVzIjpbInRyYWRpbmciLCJnZXRHYXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsImRhdGEiLCJldGhlcnMiLCJ1dGlscyIsImJpZ051bWJlcmlmeSIsIndlYjMiLCJ0b1dlaSIsImZhc3QiLCJlcnIiLCJzZXRBbGxvd2FuY2UiLCJ0b2tlbkNvbnRyYWN0IiwiZXhjaGFuZ2VBZGRyZXNzIiwiZmFzdF9nYXMiLCJ1aW50TWF4IiwiY29uc29sZSIsImxvZyIsInByb21pc2UiLCJmdW5jdGlvbnMiLCJhcHByb3ZlIiwiZ2FzUHJpY2UiLCJzdGF0dXMiLCJ3aW5kb3ciLCJ3ZWIzU3RhdHVzSGFuZGxlciIsImhhc2giLCJ1dGlsaXR5Iiwid2FpdEZvclJlY2VpcHQiLCJlIiwid3JhcCIsIndldGhDb250cmFjdCIsImFtb3VudCIsInZhbHVlIiwidHhPcHRpb25zIiwiZGVwb3NpdCIsInVud3JhcCIsIndpdGhkcmF3IiwiZ2V0QmVzdCIsImhlYWRlcnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFHQSxJQUFNQSxPQUFPLEdBQUc7QUFDZkMsRUFBQUEsTUFBTTtBQUFBO0FBQUE7QUFBQSxpQ0FBRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsK0NBQ0EsSUFBSUMsT0FBSixDQUFZLFVBQUFDLE9BQU8sRUFBSTtBQUM3QixvQkFBSTtBQUNIQyxrQkFBQUEsS0FBSyxDQUFDLGdEQUFELENBQUwsQ0FDRUMsSUFERixDQUNPLFVBQUFDLFFBQVE7QUFBQSwyQkFBSUEsUUFBUSxDQUFDQyxJQUFULEVBQUo7QUFBQSxtQkFEZixFQUVFRixJQUZGLENBRU8sVUFBQUcsSUFBSSxFQUFJO0FBQ2JMLG9CQUFBQSxPQUFPLENBQUNNLGVBQU9DLEtBQVAsQ0FBYUMsWUFBYixDQUEwQkMsSUFBSSxDQUFDQyxLQUFMLENBQVdM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QUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFdBQVo7QUFDQTtBQUNELGVBWk0sQ0FEQzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUFGOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBbkdRLENBQWhCO2VBb0hldEIsTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV0aGVycyB9IGZyb20gJ2V0aGVycyc7XG5cbmltcG9ydCB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XG5pbXBvcnQgeyBCaWdOdW1iZXIgYXMgQk4gfSBmcm9tICdiaWdudW1iZXIuanMnO1xuXG5cbmNvbnN0IHRyYWRpbmcgPSB7XG5cdGdldEdhczogYXN5bmMgKCkgPT4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGZldGNoKCdodHRwczovL2V0aGdhc3N0YXRpb24uaW5mby9qc29uL2V0aGdhc0FQSS5qc29uJylcblx0XHRcdFx0XHQudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG5cdFx0XHRcdFx0LnRoZW4oZGF0YSA9PiB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGV0aGVycy51dGlscy5iaWdOdW1iZXJpZnkod2ViMy50b1dlaShkYXRhLmZhc3QgLyAxMCwgJ2d3ZWknKSkpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdC8vIGRlZmF1bHQgdG8gNSBpZiBlcnJvclxuXHRcdFx0XHRyZXNvbHZlKGV0aGVycy51dGlscy5iaWdOdW1iZXJpZnkod2ViMy50b1dlaSg1LCAnZ3dlaScpKSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdHNldEFsbG93YW5jZTogYXN5bmModG9rZW5Db250cmFjdCwgZXhjaGFuZ2VBZGRyZXNzKSA9PiB7XG5cdFx0Y29uc3QgZmFzdF9nYXMgPSBhd2FpdCB0cmFkaW5nLmdldEdhcygpO1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IHVpbnRNYXggPSAnMTE1NzkyMDg5MjM3MzE2MTk1NDIzNTcwOTg1MDA4Njg3OTA3ODUzMjY5OTg0NjY1NjQwNTY0MDM5NDU3NTg0MDA3OTEzMTI5NjM5OTM1Jztcblx0XHRcdFx0Y29uc29sZS5sb2coZmFzdF9nYXMpO1xuXHRcdFx0XHRjb25zdCBwcm9taXNlID0gdG9rZW5Db250cmFjdC5mdW5jdGlvbnMuYXBwcm92ZShleGNoYW5nZUFkZHJlc3MsIHVpbnRNYXgsIHtnYXNQcmljZTogZmFzdF9nYXN9KTtcblxuXHRcdFx0XHRwcm9taXNlLnRoZW4oZnVuY3Rpb24oc3RhdHVzKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc3RhdHVzKTtcblx0XHRcdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ3NlbmRfdHJhZGUnLCBzdGF0dXMuaGFzaCk7XG5cblx0XHRcdFx0XHR1dGlsaXR5LndhaXRGb3JSZWNlaXB0KHN0YXR1cy5oYXNoLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignbWluZWRfYXBwcm92ZScsIHN0YXR1cy5oYXNoKTtcblx0XHRcdFx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdUcmFuc2FjdGlvbiByZWplY3RlZCAnICsgZXJyKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0d3JhcDogYXN5bmMod2V0aENvbnRyYWN0LCBhbW91bnQpID0+IHtcblx0XHRjb25zdCBmYXN0X2dhcyA9IGF3YWl0IHRyYWRpbmcuZ2V0R2FzKCk7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKGFtb3VudCA9PSAwKSB7XG5cdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBzaG93IHdyYXAgaW5pdCBtZXNzYWdlXG5cdFx0XHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdyZXF1ZXN0X3dyYXAnKTtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IGV0aGVycy51dGlscy5iaWdOdW1iZXJpZnkoYW1vdW50KTtcblx0XHRcdFx0XHRjb25zdCB0eE9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSxcblx0XHRcdFx0XHRcdGdhc1ByaWNlOiBmYXN0X2dhc1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0Y29uc3QgcHJvbWlzZSA9IHdldGhDb250cmFjdC5kZXBvc2l0KHR4T3B0aW9ucyk7XG5cblx0XHRcdFx0XHQvLyB3cmFwIHNlbnRcblx0XHRcdFx0XHRwcm9taXNlLnRoZW4oZnVuY3Rpb24oc3RhdHVzKSB7XG5cdFx0XHRcdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ3NlbmRfd3JhcCcsIHN0YXR1cy5oYXNoKTtcblx0XHRcdFx0XHRcdHV0aWxpdHkud2FpdEZvclJlY2VpcHQoc3RhdHVzLmhhc2gsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHQvLyB3cmFwIG1pbmVkXG5cdFx0XHRcdFx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignbWluZWRfd3JhcCcsIHN0YXR1cy5oYXNoKTtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHR1bndyYXA6ICh3ZXRoQ29udHJhY3QsIGFtb3VudCkgPT4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmIChhbW91bnQgPT0gMCkge1xuXHRcdFx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgcHJvbWlzZSA9IHdldGhDb250cmFjdC53aXRoZHJhdyhhbW91bnQpO1xuXG5cdFx0XHRcdFx0cHJvbWlzZS50aGVuKGZ1bmN0aW9uKHN0YXR1cykge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coc3RhdHVzKTtcblxuXHRcdFx0XHRcdFx0dXRpbGl0eS53YWl0Rm9yUmVjZWlwdChzdGF0dXMuaGFzaCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRnZXRCZXN0OiBhc3luYyAoKSA9PiB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0ZmV0Y2goJ2h0dHBzOi8vZGV4LmFnL2FwaS90cmFkZT9mcm9tPUVUSCZ0bz1EQUkmZnJvbUFtb3VudD0xMDAmZGV4PWJlc3QnLCB7IGhlYWRlcnM6IHsnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfSB9KVxuXHRcdFx0XHRcdC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcblx0XHRcdFx0XHQudGhlbihkYXRhID0+IHtcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0Ly8gZGVmYXVsdCB0byA1IGlmIGVycm9yXG5cdFx0XHRcdHJlc29sdmUoJ2VycicpXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdhcGkgZXJyb3InKVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB0cmFkaW5nO1xuIl19