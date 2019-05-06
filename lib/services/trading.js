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
    _regenerator["default"].mark(function _callee4(_ref) {
      var to, from, amount;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              to = _ref.to, from = _ref.from, amount = _ref.amount;
              return _context4.abrupt("return", new Promise(function (resolve) {
                try {
                  fetch("https://dex.ag/api/trade?from=".concat(from, "&to=").concat(to, "&toAmount=").concat(amount, "&dex=best"), {
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

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function getBest(_x5) {
      return _getBest.apply(this, arguments);
    }

    return getBest;
  }()
};
var _default = trading;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy90cmFkaW5nLmpzIl0sIm5hbWVzIjpbInRyYWRpbmciLCJnZXRHYXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsImRhdGEiLCJldGhlcnMiLCJ1dGlscyIsImJpZ051bWJlcmlmeSIsIndlYjMiLCJ0b1dlaSIsImZhc3QiLCJlcnIiLCJzZXRBbGxvd2FuY2UiLCJ0b2tlbkNvbnRyYWN0IiwiZXhjaGFuZ2VBZGRyZXNzIiwiZmFzdF9nYXMiLCJ1aW50TWF4IiwiY29uc29sZSIsImxvZyIsInByb21pc2UiLCJmdW5jdGlvbnMiLCJhcHByb3ZlIiwiZ2FzUHJpY2UiLCJzdGF0dXMiLCJ3aW5kb3ciLCJ3ZWIzU3RhdHVzSGFuZGxlciIsImhhc2giLCJ1dGlsaXR5Iiwid2FpdEZvclJlY2VpcHQiLCJlIiwid3JhcCIsIndldGhDb250cmFjdCIsImFtb3VudCIsInZhbHVlIiwidHhPcHRpb25zIiwiZGVwb3NpdCIsInVud3JhcCIsIndpdGhkcmF3IiwiZ2V0QmVzdCIsInRvIiwiZnJvbSIsImhlYWRlcnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFHQSxJQUFNQSxPQUFPLEdBQUc7QUFDZkMsRUFBQUEsTUFBTTtBQUFBO0FBQUE7QUFBQSxpQ0FBRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsK0NBQ0EsSUFBSUMsT0FBSixDQUFZLFVBQUFDLE9BQU8sRUFBSTtBQUM3QixvQkFBSTtBQUNIQyxrQkFBQUEsS0FBSyxDQUFDLGdEQUFELENBQUwsQ0FDRUMsSUFERixDQUNPLFVBQUFDLFFBQVE7QUFBQSwyQkFBSUEsUUFBUSxDQUFDQyxJQUFULEVBQUo7QUFBQSxtQkFEZixFQUVFRixJQUZGLENBRU8sVUFBQUcsSUFBSSxFQUFJO0FBQ2JMLG9CQUFBQSxPQUFPLENBQUNNLGVBQU9DLEtBQVAsQ0FBYUMsWUFBYixDQUEwQkMsSUFBSSxDQUFD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QUFDYkwsb0JBQUFBLE9BQU8sQ0FBQ0ssSUFBRCxDQUFQO0FBQ0EsbUJBSkY7QUFLQSxpQkFORCxDQU1FLE9BQU9PLEdBQVAsRUFBWTtBQUNiO0FBQ0FaLGtCQUFBQSxPQUFPLENBQUMsS0FBRCxDQUFQO0FBQ0FrQixrQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksV0FBWjtBQUNBO0FBQ0QsZUFaTSxDQURDOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFuR1EsQ0FBaEI7ZUFvSGV0QixPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXRoZXJzIH0gZnJvbSAnZXRoZXJzJztcclxuXHJcbmltcG9ydCB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XHJcbmltcG9ydCB7IEJpZ051bWJlciBhcyBCTiB9IGZyb20gJ2JpZ251bWJlci5qcyc7XHJcblxyXG5cclxuY29uc3QgdHJhZGluZyA9IHtcclxuXHRnZXRHYXM6IGFzeW5jICgpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRmZXRjaCgnaHR0cHM6Ly9ldGhnYXNzdGF0aW9uLmluZm8vanNvbi9ldGhnYXNBUEkuanNvbicpXHJcblx0XHRcdFx0XHQudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcblx0XHRcdFx0XHQudGhlbihkYXRhID0+IHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShldGhlcnMudXRpbHMuYmlnTnVtYmVyaWZ5KHdlYjMudG9XZWkoZGF0YS5mYXN0IC8gMTAsICdnd2VpJykpKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHQvLyBkZWZhdWx0IHRvIDUgaWYgZXJyb3JcclxuXHRcdFx0XHRyZXNvbHZlKGV0aGVycy51dGlscy5iaWdOdW1iZXJpZnkod2ViMy50b1dlaSg1LCAnZ3dlaScpKSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0c2V0QWxsb3dhbmNlOiBhc3luYyh0b2tlbkNvbnRyYWN0LCBleGNoYW5nZUFkZHJlc3MpID0+IHtcclxuXHRcdGNvbnN0IGZhc3RfZ2FzID0gYXdhaXQgdHJhZGluZy5nZXRHYXMoKTtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRjb25zdCB1aW50TWF4ID0gJzExNTc5MjA4OTIzNzMxNjE5NTQyMzU3MDk4NTAwODY4NzkwNzg1MzI2OTk4NDY2NTY0MDU2NDAzOTQ1NzU4NDAwNzkxMzEyOTYzOTkzNSc7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZmFzdF9nYXMpO1xyXG5cdFx0XHRcdGNvbnN0IHByb21pc2UgPSB0b2tlbkNvbnRyYWN0LmZ1bmN0aW9ucy5hcHByb3ZlKGV4Y2hhbmdlQWRkcmVzcywgdWludE1heCwge2dhc1ByaWNlOiBmYXN0X2dhc30pO1xyXG5cclxuXHRcdFx0XHRwcm9taXNlLnRoZW4oZnVuY3Rpb24oc3RhdHVzKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzdGF0dXMpO1xyXG5cdFx0XHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdzZW5kX3RyYWRlJywgc3RhdHVzLmhhc2gpO1xyXG5cclxuXHRcdFx0XHRcdHV0aWxpdHkud2FpdEZvclJlY2VpcHQoc3RhdHVzLmhhc2gsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ21pbmVkX2FwcHJvdmUnLCBzdGF0dXMuaGFzaCk7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUodHJ1ZSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuXHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ1RyYW5zYWN0aW9uIHJlamVjdGVkICcgKyBlcnIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0d3JhcDogYXN5bmMod2V0aENvbnRyYWN0LCBhbW91bnQpID0+IHtcclxuXHRcdGNvbnN0IGZhc3RfZ2FzID0gYXdhaXQgdHJhZGluZy5nZXRHYXMoKTtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRpZiAoYW1vdW50ID09IDApIHtcclxuXHRcdFx0XHRcdHJlc29sdmUodHJ1ZSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIHNob3cgd3JhcCBpbml0IG1lc3NhZ2VcclxuXHRcdFx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcigncmVxdWVzdF93cmFwJyk7XHJcblx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IGV0aGVycy51dGlscy5iaWdOdW1iZXJpZnkoYW1vdW50KTtcclxuXHRcdFx0XHRcdGNvbnN0IHR4T3B0aW9ucyA9IHtcclxuXHRcdFx0XHRcdFx0dmFsdWUsXHJcblx0XHRcdFx0XHRcdGdhc1ByaWNlOiBmYXN0X2dhc1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGNvbnN0IHByb21pc2UgPSB3ZXRoQ29udHJhY3QuZGVwb3NpdCh0eE9wdGlvbnMpO1xyXG5cclxuXHRcdFx0XHRcdC8vIHdyYXAgc2VudFxyXG5cdFx0XHRcdFx0cHJvbWlzZS50aGVuKGZ1bmN0aW9uKHN0YXR1cykge1xyXG5cdFx0XHRcdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ3NlbmRfd3JhcCcsIHN0YXR1cy5oYXNoKTtcclxuXHRcdFx0XHRcdFx0dXRpbGl0eS53YWl0Rm9yUmVjZWlwdChzdGF0dXMuaGFzaCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gd3JhcCBtaW5lZFxyXG5cdFx0XHRcdFx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignbWluZWRfd3JhcCcsIHN0YXR1cy5oYXNoKTtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHVud3JhcDogKHdldGhDb250cmFjdCwgYW1vdW50KSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0aWYgKGFtb3VudCA9PSAwKSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb25zdCBwcm9taXNlID0gd2V0aENvbnRyYWN0LndpdGhkcmF3KGFtb3VudCk7XHJcblxyXG5cdFx0XHRcdFx0cHJvbWlzZS50aGVuKGZ1bmN0aW9uKHN0YXR1cykge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhzdGF0dXMpO1xyXG5cclxuXHRcdFx0XHRcdFx0dXRpbGl0eS53YWl0Rm9yUmVjZWlwdChzdGF0dXMuaGFzaCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldEJlc3Q6IGFzeW5jICh7dG8sIGZyb20sIGFtb3VudH0pID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRmZXRjaChgaHR0cHM6Ly9kZXguYWcvYXBpL3RyYWRlP2Zyb209JHtmcm9tfSZ0bz0ke3RvfSZ0b0Ftb3VudD0ke2Ftb3VudH0mZGV4PWJlc3RgLCB7IGhlYWRlcnM6IHsnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfSB9KVxyXG5cdFx0XHRcdFx0LnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG5cdFx0XHRcdFx0LnRoZW4oZGF0YSA9PiB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Ly8gZGVmYXVsdCB0byA1IGlmIGVycm9yXHJcblx0XHRcdFx0cmVzb2x2ZSgnZXJyJylcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnYXBpIGVycm9yJylcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdHJhZGluZztcclxuIl19