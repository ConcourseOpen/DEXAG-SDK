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
      var to, from, amount, dex;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              to = _ref.to, from = _ref.from, amount = _ref.amount, dex = _ref.dex;
              return _context4.abrupt("return", new Promise(function (resolve) {
                try {
                  fetch("https://dex.ag/api/trade?from=".concat(from, "&to=").concat(to, "&toAmount=").concat(amount, "&dex=").concat(dex || 'best'), {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy90cmFkaW5nLmpzIl0sIm5hbWVzIjpbInRyYWRpbmciLCJnZXRHYXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsImRhdGEiLCJldGhlcnMiLCJ1dGlscyIsImJpZ051bWJlcmlmeSIsIndlYjMiLCJ0b1dlaSIsImZhc3QiLCJlcnIiLCJzZXRBbGxvd2FuY2UiLCJ0b2tlbkNvbnRyYWN0IiwiZXhjaGFuZ2VBZGRyZXNzIiwiZmFzdF9nYXMiLCJ1aW50TWF4IiwiY29uc29sZSIsImxvZyIsInByb21pc2UiLCJmdW5jdGlvbnMiLCJhcHByb3ZlIiwiZ2FzUHJpY2UiLCJzdGF0dXMiLCJ3aW5kb3ciLCJ3ZWIzU3RhdHVzSGFuZGxlciIsImhhc2giLCJ1dGlsaXR5Iiwid2FpdEZvclJlY2VpcHQiLCJlIiwid3JhcCIsIndldGhDb250cmFjdCIsImFtb3VudCIsInZhbHVlIiwidHhPcHRpb25zIiwiZGVwb3NpdCIsInVud3JhcCIsIndpdGhkcmF3IiwiZ2V0QmVzdCIsInRvIiwiZnJvbSIsImRleCIsImhlYWRlcnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFHQSxJQUFNQSxPQUFPLEdBQUc7QUFDZEMsRUFBQUEsTUFBTTtBQUFBO0FBQUE7QUFBQSxpQ0FBRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsK0NBQ0MsSUFBSUMsT0FBSixDQUFZLFVBQUFDLE9BQU8sRUFBSTtBQUM1QixvQkFBSTtBQUNGQyxrQkFBQUEsS0FBSyxDQUFDLGdEQUFELENBQUwsQ0FDQ0MsSUFERCxDQUNNLFVBQUFDLFFBQVE7QUFBQSwyQkFBSUEsUUFBUSxDQUFDQyxJQUFULEVBQUo7QUFBQSxtQkFEZCxFQUVDRixJQUZELENBRU0sVUFBQUcsSUFBSSxFQUFJO0FBQ1pMLG9CQUFBQSxPQUFPLENBQUNNLGVBQU9DLEtBQVAsQ0FBYUMsWUFBYixDQUEwQkMsSUFBSSxDQUFDQyxLQUFMLENBQVdMLElBQUksQ0FBQ00sSUFBTCxHQUFZLEVBQXZCLEVBQTJCLE1BQTNCLENBQTFCLENBQUQsQ0FBUDtBQUNELG1CQUpEO0FBS0QsaUJBTkQsQ0FNRSxPQUFPQyxHQUFQLEVBQVk7QUFDWjtBQUNBWixrQkFBQUEsT0FBTyxDQUFDTSxlQUFPQyxLQUFQLENBQWFDLFlBQWIsQ0FBMEJDLElBQUksQ0FBQ0MsS0FBTCxDQUFXLENBQVgsRUFBYyxNQUFkLENBQTFCLENBQUQsQ0FBUDtBQUNEO0FBQ0YsZUFYTSxDQUREOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsS0FEUTtBQWVkRyxFQUFBQSxZQUFZO0FBQUE7QUFBQTtBQUFBLGlDQUFFLGtCQUFNQyxhQUFOLEVBQXFCQyxlQUFyQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUNXbEIsT0FBTyxDQUFDQyxNQUFSLEVBRFg7O0FBQUE7QUFDTmtCLGNBQUFBLFFBRE07QUFBQSxnREFFTCxJQUFJakIsT0FBSixDQUFZLFVBQUFDLE9BQU8sRUFBSTtBQUM1QixvQkFBSTtBQUNGLHNCQUFNaUIsT0FBTyxHQUFHLGdGQUFoQjtBQUNBQyxrQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlILFFBQVo7QUFDQSxzQkFBTUksT0FBTyxHQUFHTixhQUFhLENBQUNPLFNBQWQsQ0FBd0JDLE9BQXhCLENBQWdDUCxlQUFoQyxFQUFpREUsT0FBakQsRUFBMEQ7QUFBQ00sb0JBQUFBLFFBQVEsRUFBRVA7QUFBWCxtQkFBMUQsQ0FBaEI7QUFFQUksa0JBQUFBLE9BQU8sQ0FBQ2xCLElBQVIsQ0FBYSxVQUFTc0IsTUFBVCxFQUFpQjtBQUM1Qk4sb0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSyxNQUFaO0FBQ0FDLG9CQUFBQSxNQUFNLENBQUNDLGlCQUFQLENBQXlCLFlBQXpCLEVBQXVDRixNQUFNLENBQUNHLElBQTlDOztBQUVBQyx3Q0FBUUMsY0FBUixDQUF1QkwsTUFBTSxDQUFDRyxJQUE5QixFQUFvQyxZQUFXO0FBQzdDRixzQkFBQUEsTUFBTSxDQUFDQyxpQkFBUCxDQUF5QixlQUF6QixFQUEwQ0YsTUFBTSxDQUFDRyxJQUFqRDtBQUNBM0Isc0JBQUFBLE9BQU8sQ0FBQyxJQUFELENBQVA7QUFDRCxxQkFIRDtBQUlELG1CQVJELFdBUVMsVUFBU1ksR0FBVCxFQUFjO0FBQ3JCWixvQkFBQUEsT0FBTyxDQUFDLEtBQUQsQ0FBUDtBQUNBa0Isb0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLDBCQUEwQlAsR0FBdEM7QUFDRCxtQkFYRDtBQVlELGlCQWpCRCxDQWlCRSxPQUFPa0IsQ0FBUCxFQUFVO0FBQ1Y5QixrQkFBQUEsT0FBTyxDQUFDLEtBQUQsQ0FBUDtBQUNBa0Isa0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZVyxDQUFaO0FBQ0Q7QUFDRixlQXRCTSxDQUZLOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsS0FmRTtBQXlDZEMsRUFBQUEsSUFBSTtBQUFBO0FBQUE7QUFBQSxpQ0FBRSxrQkFBTUMsWUFBTixFQUFvQkMsTUFBcEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFDbUJwQyxPQUFPLENBQUNDLE1BQVIsRUFEbkI7O0FBQUE7QUFDRWtCLGNBQUFBLFFBREY7QUFBQSxnREFFRyxJQUFJakIsT0FBSixDQUFZLFVBQUFDLE9BQU8sRUFBSTtBQUM5QixvQkFBSTtBQUNGLHNCQUFJaUMsTUFBTSxJQUFJLENBQWQsRUFBaUI7QUFDZmpDLG9CQUFBQSxPQUFPLENBQUMsSUFBRCxDQUFQO0FBQ0QsbUJBRkQsTUFFTztBQUNMO0FBQ0F5QixvQkFBQUEsTUFBTSxDQUFDQyxpQkFBUCxDQUF5QixjQUF6Qjs7QUFDQSx3QkFBTVEsS0FBSyxHQUFHNUIsZUFBT0MsS0FBUCxDQUFhQyxZQUFiLENBQTBCeUIsTUFBMUIsQ0FBZDs7QUFDQSx3QkFBTUUsU0FBUyxHQUFHO0FBQ2hCRCxzQkFBQUEsS0FBSyxFQUFMQSxLQURnQjtBQUVoQlgsc0JBQUFBLFFBQVEsRUFBRVA7QUFGTSxxQkFBbEI7QUFJQSx3QkFBTUksT0FBTyxHQUFHWSxZQUFZLENBQUNJLE9BQWIsQ0FBcUJELFNBQXJCLENBQWhCLENBUkssQ0FVTDs7QUFDQWYsb0JBQUFBLE9BQU8sQ0FBQ2xCLElBQVIsQ0FBYSxVQUFTc0IsTUFBVCxFQUFpQjtBQUM1QkMsc0JBQUFBLE1BQU0sQ0FBQ0MsaUJBQVAsQ0FBeUIsV0FBekIsRUFBc0NGLE1BQU0sQ0FBQ0csSUFBN0M7O0FBQ0FDLDBDQUFRQyxjQUFSLENBQXVCTCxNQUFNLENBQUNHLElBQTlCLEVBQW9DLFlBQVc7QUFDN0M7QUFDQUYsd0JBQUFBLE1BQU0sQ0FBQ0MsaUJBQVAsQ0FBeUIsWUFBekIsRUFBdUNGLE1BQU0sQ0FBQ0csSUFBOUM7QUFDQTNCLHdCQUFBQSxPQUFPLENBQUMsSUFBRCxDQUFQO0FBQ0QsdUJBSkQ7QUFLRCxxQkFQRCxXQU9TLFVBQVNZLEdBQVQsRUFBYztBQUNyQlosc0JBQUFBLE9BQU8sQ0FBQyxLQUFELENBQVA7QUFDRCxxQkFURDtBQVVEO0FBQ0YsaUJBekJELENBeUJFLE9BQU84QixDQUFQLEVBQVU7QUFDVjlCLGtCQUFBQSxPQUFPLENBQUMsS0FBRCxDQUFQO0FBQ0FrQixrQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlXLENBQVo7QUFDRDtBQUNBLGVBOUJNLENBRkg7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBRjs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxLQXpDVTtBQTJFZE8sRUFBQUEsTUFBTSxFQUFFLGdCQUFDTCxZQUFELEVBQWVDLE1BQWYsRUFBMEI7QUFDaEMsV0FBTyxJQUFJbEMsT0FBSixDQUFZLFVBQUFDLE9BQU8sRUFBSTtBQUM1QixVQUFJO0FBQ0YsWUFBSWlDLE1BQU0sSUFBSSxDQUFkLEVBQWlCO0FBQ2ZqQyxVQUFBQSxPQUFPLENBQUMsSUFBRCxDQUFQO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsY0FBTW9CLE9BQU8sR0FBR1ksWUFBWSxDQUFDTSxRQUFiLENBQXNCTCxNQUF0QixDQUFoQjtBQUVBYixVQUFBQSxPQUFPLENBQUNsQixJQUFSLENBQWEsVUFBU3NCLE1BQVQsRUFBaUI7QUFDNUJOLFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSyxNQUFaOztBQUNBSSxnQ0FBUUMsY0FBUixDQUF1QkwsTUFBTSxDQUFDRyxJQUE5QixFQUFvQyxZQUFXO0FBQzdDM0IsY0FBQUEsT0FBTyxDQUFDLElBQUQsQ0FBUDtBQUNELGFBRkQ7QUFHRCxXQUxELFdBS1MsVUFBU1ksR0FBVCxFQUFjO0FBQ3JCWixZQUFBQSxPQUFPLENBQUMsS0FBRCxDQUFQO0FBQ0QsV0FQRDtBQVFEO0FBQ0YsT0FmRCxDQWVFLE9BQU04QixDQUFOLEVBQVM7QUFDVDlCLFFBQUFBLE9BQU8sQ0FBQyxLQUFELENBQVA7QUFDQWtCLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZVyxDQUFaO0FBQ0Q7QUFDRixLQXBCTSxDQUFQO0FBcUJELEdBakdhO0FBa0dkUyxFQUFBQSxPQUFPO0FBQUE7QUFBQTtBQUFBLGlDQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFRQyxjQUFBQSxFQUFSLFFBQVFBLEVBQVIsRUFBWUMsSUFBWixRQUFZQSxJQUFaLEVBQWtCUixNQUFsQixRQUFrQkEsTUFBbEIsRUFBMEJTLEdBQTFCLFFBQTBCQSxHQUExQjtBQUFBLGdEQUNBLElBQUkzQyxPQUFKLENBQVksVUFBQUMsT0FBTyxFQUFJO0FBQzVCLG9CQUFJO0FBQ0ZDLGtCQUFBQSxLQUFLLHlDQUFrQ3dDLElBQWxDLGlCQUE2Q0QsRUFBN0MsdUJBQTREUCxNQUE1RCxrQkFBMEVTLEdBQUcsSUFBRSxNQUEvRSxHQUF5RjtBQUFFQyxvQkFBQUEsT0FBTyxFQUFFO0FBQUMsZ0NBQVU7QUFBWDtBQUFYLG1CQUF6RixDQUFMLENBQ0N6QyxJQURELENBQ00sVUFBQUMsUUFBUTtBQUFBLDJCQUFJQSxRQUFRLENBQUNDLElBQVQsRUFBSjtBQUFBLG1CQURkLEVBRUNGLElBRkQsQ0FFTSxVQUFBRyxJQUFJLEVBQUk7QUFDWkwsb0JBQUFBLE9BQU8sQ0FBQ0ssSUFBRCxDQUFQO0FBQ0QsbUJBSkQ7QUFLRCxpQkFORCxDQU1FLE9BQU9PLEdBQVAsRUFBWTtBQUNaO0FBQ0FaLGtCQUFBQSxPQUFPLENBQUMsS0FBRCxDQUFQO0FBQ0FrQixrQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksV0FBWjtBQUNEO0FBQ0YsZUFaTSxDQURBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFsR08sQ0FBaEI7ZUFtSGV0QixPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXRoZXJzIH0gZnJvbSAnZXRoZXJzJztcclxuXHJcbmltcG9ydCB1dGlsaXR5IGZyb20gJy4vdXRpbGl0eSc7XHJcbmltcG9ydCB7IEJpZ051bWJlciBhcyBCTiB9IGZyb20gJ2JpZ251bWJlci5qcyc7XHJcblxyXG5cclxuY29uc3QgdHJhZGluZyA9IHtcclxuICBnZXRHYXM6IGFzeW5jICgpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBmZXRjaCgnaHR0cHM6Ly9ldGhnYXNzdGF0aW9uLmluZm8vanNvbi9ldGhnYXNBUEkuanNvbicpXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgcmVzb2x2ZShldGhlcnMudXRpbHMuYmlnTnVtYmVyaWZ5KHdlYjMudG9XZWkoZGF0YS5mYXN0IC8gMTAsICdnd2VpJykpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgLy8gZGVmYXVsdCB0byA1IGlmIGVycm9yXHJcbiAgICAgICAgcmVzb2x2ZShldGhlcnMudXRpbHMuYmlnTnVtYmVyaWZ5KHdlYjMudG9XZWkoNSwgJ2d3ZWknKSkpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIHNldEFsbG93YW5jZTogYXN5bmModG9rZW5Db250cmFjdCwgZXhjaGFuZ2VBZGRyZXNzKSA9PiB7XHJcbiAgICBjb25zdCBmYXN0X2dhcyA9IGF3YWl0IHRyYWRpbmcuZ2V0R2FzKCk7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgdWludE1heCA9ICcxMTU3OTIwODkyMzczMTYxOTU0MjM1NzA5ODUwMDg2ODc5MDc4NTMyNjk5ODQ2NjU2NDA1NjQwMzk0NTc1ODQwMDc5MTMxMjk2Mzk5MzUnO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGZhc3RfZ2FzKTtcclxuICAgICAgICBjb25zdCBwcm9taXNlID0gdG9rZW5Db250cmFjdC5mdW5jdGlvbnMuYXBwcm92ZShleGNoYW5nZUFkZHJlc3MsIHVpbnRNYXgsIHtnYXNQcmljZTogZmFzdF9nYXN9KTtcclxuXHJcbiAgICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHN0YXR1cykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKTtcclxuICAgICAgICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignc2VuZF90cmFkZScsIHN0YXR1cy5oYXNoKTtcclxuXHJcbiAgICAgICAgICB1dGlsaXR5LndhaXRGb3JSZWNlaXB0KHN0YXR1cy5oYXNoLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgd2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdtaW5lZF9hcHByb3ZlJywgc3RhdHVzLmhhc2gpO1xyXG4gICAgICAgICAgICByZXNvbHZlKHRydWUpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdUcmFuc2FjdGlvbiByZWplY3RlZCAnICsgZXJyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIHdyYXA6IGFzeW5jKHdldGhDb250cmFjdCwgYW1vdW50KSA9PiB7XHJcbiAgICBjb25zdCBmYXN0X2dhcyA9IGF3YWl0IHRyYWRpbmcuZ2V0R2FzKCk7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoYW1vdW50ID09IDApIHtcclxuICAgICAgICByZXNvbHZlKHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIHNob3cgd3JhcCBpbml0IG1lc3NhZ2VcclxuICAgICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ3JlcXVlc3Rfd3JhcCcpO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZXRoZXJzLnV0aWxzLmJpZ051bWJlcmlmeShhbW91bnQpO1xyXG4gICAgICAgIGNvbnN0IHR4T3B0aW9ucyA9IHtcclxuICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgZ2FzUHJpY2U6IGZhc3RfZ2FzXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBwcm9taXNlID0gd2V0aENvbnRyYWN0LmRlcG9zaXQodHhPcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gd3JhcCBzZW50XHJcbiAgICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHN0YXR1cykge1xyXG4gICAgICAgICAgd2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdzZW5kX3dyYXAnLCBzdGF0dXMuaGFzaCk7XHJcbiAgICAgICAgICB1dGlsaXR5LndhaXRGb3JSZWNlaXB0KHN0YXR1cy5oYXNoLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gd3JhcCBtaW5lZFxyXG4gICAgICAgICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ21pbmVkX3dyYXAnLCBzdGF0dXMuaGFzaCk7XHJcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHJlc29sdmUoZmFsc2UpO1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgdW53cmFwOiAod2V0aENvbnRyYWN0LCBhbW91bnQpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAoYW1vdW50ID09IDApIHtcclxuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IHByb21pc2UgPSB3ZXRoQ29udHJhY3Qud2l0aGRyYXcoYW1vdW50KTtcclxuXHJcbiAgICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24oc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cyk7XHJcbiAgICAgICAgICAgIHV0aWxpdHkud2FpdEZvclJlY2VpcHQoc3RhdHVzLmhhc2gsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICByZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBnZXRCZXN0OiBhc3luYyAoe3RvLCBmcm9tLCBhbW91bnQsIGRleH0pID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBmZXRjaChgaHR0cHM6Ly9kZXguYWcvYXBpL3RyYWRlP2Zyb209JHtmcm9tfSZ0bz0ke3RvfSZ0b0Ftb3VudD0ke2Ftb3VudH0mZGV4PSR7ZGV4fHwnYmVzdCd9YCwgeyBoZWFkZXJzOiB7J0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ30gfSlcclxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAvLyBkZWZhdWx0IHRvIDUgaWYgZXJyb3JcclxuICAgICAgICByZXNvbHZlKCdlcnInKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdhcGkgZXJyb3InKVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0cmFkaW5nO1xyXG4iXX0=