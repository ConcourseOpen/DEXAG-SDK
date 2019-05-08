"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ethers = require("ethers");

var _erc = _interopRequireDefault(require("../../abi/erc20.json"));

var _weth = _interopRequireDefault(require("../../abi/weth.json"));

var utility = {
  promisify: function promisify(inner) {
    return new Promise(function (resolve, reject) {
      inner(function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  waitForReceipt: function () {
    var _waitForReceipt = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee(hash, provider) {
      var receipt;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              receipt = null;

            case 1:
              if (receipt) {
                _context.next = 9;
                break;
              }

              _context.next = 4;
              return provider.getTransactionReceipt(hash);

            case 4:
              receipt = _context.sent;
              _context.next = 7;
              return utility.sleep(2000);

            case 7:
              _context.next = 1;
              break;

            case 9:
              return _context.abrupt("return", receipt);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function waitForReceipt(_x, _x2) {
      return _waitForReceipt.apply(this, arguments);
    }

    return waitForReceipt;
  }(),
  getTokenContract: function getTokenContract(trade, signer) {
    var tokenAddress = trade.metadata.input.address;
    return new _ethers.ethers.Contract(tokenAddress, _erc["default"], signer);
  },
  getWethContract: function getWethContract(signer) {
    var wethTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    return new _ethers.ethers.Contract(wethTokenAddress, _weth["default"], signer);
  },
  getEtherToWrap: function getEtherToWrap(trade, provider, signer) {
    var wethTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

    if (!trade.metadata.input) {
      return 0;
    }

    if (trade.metadata.input.address != wethTokenAddress) {
      return 0;
    }

    var wethAmount = trade.metadata.input.amount;
    var wethContract = new _ethers.ethers.Contract(wethTokenAddress, _erc["default"], signer);
    var accountAddress;
    var wethBalance;
    var enoughWeth = signer.getAddress().then(function (address) {
      accountAddress = address;
      return wethContract.balanceOf(accountAddress);
    }).then(function (balance) {
      wethBalance = balance;
      return provider.getBalance(accountAddress);
    }).then(function (balance) {
      if (wethBalance.gte(wethAmount)) {
        // Enough weth, no need to wrap
        return 0;
      }

      var totalBalance = balance.add(wethBalance);

      if (totalBalance.lt(wethAmount)) {
        // Insufficient balance
        return -1;
      } // eth to wrap = weth required for trade - weth balance


      var ethToWrap = wethBalance.sub(wethAmount).mul(-1);
      return ethToWrap.toString();
    });
    return enoughWeth;
  },
  handleReceipt: function handleReceipt(status, receipt) {
    if (receipt.status == '0x1') {
      window.web3StatusHandler('mined_trade', status.hash);
    } else {
      window.web3StatusHandler('failed', status.hash);
    }
  },
  track: function () {
    var _track = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2(status, details, trade) {
      var response;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return fetch('/api/send_trade', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  status: status,
                  details: details,
                  trade: trade
                })
              });

            case 2:
              response = _context2.sent;

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function track(_x3, _x4, _x5) {
      return _track.apply(this, arguments);
    }

    return track;
  }(),
  sleep: function sleep(ms) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }
};
var _default = utility;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy91dGlsaXR5LmpzIl0sIm5hbWVzIjpbInV0aWxpdHkiLCJwcm9taXNpZnkiLCJpbm5lciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXJyIiwicmVzIiwid2FpdEZvclJlY2VpcHQiLCJoYXNoIiwicHJvdmlkZXIiLCJyZWNlaXB0IiwiZ2V0VHJhbnNhY3Rpb25SZWNlaXB0Iiwic2xlZXAiLCJnZXRUb2tlbkNvbnRyYWN0IiwidHJhZGUiLCJzaWduZXIiLCJ0b2tlbkFkZHJlc3MiLCJtZXRhZGF0YSIsImlucHV0IiwiYWRkcmVzcyIsImV0aGVycyIsIkNvbnRyYWN0IiwiZXJjMjBBYmkiLCJnZXRXZXRoQ29udHJhY3QiLCJ3ZXRoVG9rZW5BZGRyZXNzIiwid2V0aEFiaSIsImdldEV0aGVyVG9XcmFwIiwid2V0aEFtb3VudCIsImFtb3VudCIsIndldGhDb250cmFjdCIsImFjY291bnRBZGRyZXNzIiwid2V0aEJhbGFuY2UiLCJlbm91Z2hXZXRoIiwiZ2V0QWRkcmVzcyIsInRoZW4iLCJiYWxhbmNlT2YiLCJiYWxhbmNlIiwiZ2V0QmFsYW5jZSIsImd0ZSIsInRvdGFsQmFsYW5jZSIsImFkZCIsImx0IiwiZXRoVG9XcmFwIiwic3ViIiwibXVsIiwidG9TdHJpbmciLCJoYW5kbGVSZWNlaXB0Iiwic3RhdHVzIiwid2luZG93Iiwid2ViM1N0YXR1c0hhbmRsZXIiLCJ0cmFjayIsImRldGFpbHMiLCJmZXRjaCIsIm1ldGhvZCIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInJlc3BvbnNlIiwibXMiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBRUEsSUFBTUEsT0FBTyxHQUFHO0FBQ2ZDLEVBQUFBLFNBQVMsRUFBRSxtQkFBQ0MsS0FBRCxFQUFXO0FBQ3JCLFdBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN2Q0gsTUFBQUEsS0FBSyxDQUFDLFVBQUNJLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ25CLFlBQUlELEdBQUosRUFBUztBQUNSRCxVQUFBQSxNQUFNLENBQUNDLEdBQUQsQ0FBTjtBQUNBLFNBRkQsTUFFTztBQUNORixVQUFBQSxPQUFPLENBQUNHLEdBQUQsQ0FBUDtBQUNBO0FBQ0QsT0FOSSxDQUFMO0FBT0EsS0FSTSxDQUFQO0FBU0EsR0FYYztBQVlmQyxFQUFBQSxjQUFjO0FBQUE7QUFBQTtBQUFBLGlDQUFFLGlCQUFNQyxJQUFOLEVBQVlDLFFBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1hDLGNBQUFBLE9BRFcsR0FDRCxJQURDOztBQUFBO0FBQUEsa0JBRVBBLE9BRk87QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxxQkFHRUQsUUFBUSxDQUFDRSxxQkFBVCxDQUErQkgsSUFBL0IsQ0FIRjs7QUFBQTtBQUdkRSxjQUFBQSxPQUhjO0FBQUE7QUFBQSxxQkFJUlgsT0FBTyxDQUFDYSxLQUFSLENBQWMsSUFBZCxDQUpROztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLCtDQU1SRixPQU5ROztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsS0FaQztBQW9CZkcsRUFBQUEsZ0JBQWdCLEVBQUUsMEJBQUNDLEtBQUQsRUFBUUMsTUFBUixFQUFtQjtBQUNwQyxRQUFNQyxZQUFZLEdBQUdGLEtBQUssQ0FBQ0csUUFBTixDQUFlQyxLQUFmLENBQXFCQyxPQUExQztBQUNBLFdBQU8sSUFBSUMsZUFBT0MsUUFBWCxDQUFvQkwsWUFBcEIsRUFBa0NNLGVBQWxDLEVBQTRDUCxNQUE1QyxDQUFQO0FBQ0EsR0F2QmM7QUF3QmZRLEVBQUFBLGVBQWUsRUFBRSx5QkFBQ1IsTUFBRCxFQUFZO0FBQzVCLFFBQU1TLGdCQUFnQixHQUFHLDRDQUF6QjtBQUNBLFdBQU8sSUFBSUosZUFBT0MsUUFBWCxDQUFvQkcsZ0JBQXBCLEVBQXNDQyxnQkFBdEMsRUFBK0NWLE1BQS9DLENBQVA7QUFDQSxHQTNCYztBQTRCZlcsRUFBQUEsY0E1QmUsMEJBNEJBWixLQTVCQSxFQTRCT0wsUUE1QlAsRUE0QmlCTSxNQTVCakIsRUE0QnlCO0FBQ3ZDLFFBQU1TLGdCQUFnQixHQUFHLDRDQUF6Qjs7QUFDQSxRQUFJLENBQUNWLEtBQUssQ0FBQ0csUUFBTixDQUFlQyxLQUFwQixFQUEyQjtBQUMxQixhQUFPLENBQVA7QUFDQTs7QUFDRCxRQUFJSixLQUFLLENBQUNHLFFBQU4sQ0FBZUMsS0FBZixDQUFxQkMsT0FBckIsSUFBZ0NLLGdCQUFwQyxFQUFzRDtBQUNyRCxhQUFPLENBQVA7QUFDQTs7QUFDRCxRQUFNRyxVQUFVLEdBQUdiLEtBQUssQ0FBQ0csUUFBTixDQUFlQyxLQUFmLENBQXFCVSxNQUF4QztBQUNBLFFBQU1DLFlBQVksR0FBRyxJQUFJVCxlQUFPQyxRQUFYLENBQW9CRyxnQkFBcEIsRUFBc0NGLGVBQXRDLEVBQWdEUCxNQUFoRCxDQUFyQjtBQUNBLFFBQUllLGNBQUo7QUFDQSxRQUFJQyxXQUFKO0FBQ0EsUUFBTUMsVUFBVSxHQUFHakIsTUFBTSxDQUFDa0IsVUFBUCxHQUNqQkMsSUFEaUIsQ0FDWixVQUFBZixPQUFPLEVBQUk7QUFDaEJXLE1BQUFBLGNBQWMsR0FBR1gsT0FBakI7QUFDQSxhQUFPVSxZQUFZLENBQUNNLFNBQWIsQ0FBdUJMLGNBQXZCLENBQVA7QUFDQSxLQUppQixFQUtqQkksSUFMaUIsQ0FLWixVQUFBRSxPQUFPLEVBQUk7QUFDaEJMLE1BQUFBLFdBQVcsR0FBR0ssT0FBZDtBQUNBLGFBQU8zQixRQUFRLENBQUM0QixVQUFULENBQW9CUCxjQUFwQixDQUFQO0FBQ0EsS0FSaUIsRUFTakJJLElBVGlCLENBU1osVUFBQUUsT0FBTyxFQUFJO0FBQ2hCLFVBQUlMLFdBQVcsQ0FBQ08sR0FBWixDQUFnQlgsVUFBaEIsQ0FBSixFQUFpQztBQUNoQztBQUNBLGVBQU8sQ0FBUDtBQUNBOztBQUNELFVBQU1ZLFlBQVksR0FBR0gsT0FBTyxDQUFDSSxHQUFSLENBQVlULFdBQVosQ0FBckI7O0FBQ0EsVUFBSVEsWUFBWSxDQUFDRSxFQUFiLENBQWdCZCxVQUFoQixDQUFKLEVBQWlDO0FBQ2hDO0FBQ0EsZUFBTyxDQUFDLENBQVI7QUFDQSxPQVRlLENBVWhCOzs7QUFDQSxVQUFNZSxTQUFTLEdBQUdYLFdBQVcsQ0FBQ1ksR0FBWixDQUFnQmhCLFVBQWhCLEVBQTRCaUIsR0FBNUIsQ0FBZ0MsQ0FBQyxDQUFqQyxDQUFsQjtBQUNBLGFBQU9GLFNBQVMsQ0FBQ0csUUFBVixFQUFQO0FBQ0EsS0F0QmlCLENBQW5CO0FBdUJBLFdBQU9iLFVBQVA7QUFDQSxHQWhFYztBQWlFZmMsRUFBQUEsYUFBYSxFQUFFLHVCQUFDQyxNQUFELEVBQVNyQyxPQUFULEVBQW9CO0FBQ2xDLFFBQUdBLE9BQU8sQ0FBQ3FDLE1BQVIsSUFBZ0IsS0FBbkIsRUFBeUI7QUFDeEJDLE1BQUFBLE1BQU0sQ0FBQ0MsaUJBQVAsQ0FBeUIsYUFBekIsRUFBd0NGLE1BQU0sQ0FBQ3ZDLElBQS9DO0FBQ0EsS0FGRCxNQUVLO0FBQ0p3QyxNQUFBQSxNQUFNLENBQUNDLGlCQUFQLENBQXlCLFFBQXpCLEVBQW1DRixNQUFNLENBQUN2QyxJQUExQztBQUNBO0FBQ0QsR0F2RWM7QUF3RWYwQyxFQUFBQSxLQUFLO0FBQUE7QUFBQTtBQUFBLGlDQUFFLGtCQUFNSCxNQUFOLEVBQWNJLE9BQWQsRUFBdUJyQyxLQUF2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUNpQnNDLEtBQUssQ0FBQyxpQkFBRCxFQUFvQjtBQUMvQ0MsZ0JBQUFBLE1BQU0sRUFBRSxNQUR1QztBQUUvQ0MsZ0JBQUFBLE9BQU8sRUFBRTtBQUNSLDRCQUFVLGtCQURGO0FBRVIsa0NBQWdCO0FBRlIsaUJBRnNDO0FBTS9DQyxnQkFBQUEsSUFBSSxFQUFFQyxJQUFJLENBQUNDLFNBQUwsQ0FBZTtBQUFDVixrQkFBQUEsTUFBTSxFQUFOQSxNQUFEO0FBQVNJLGtCQUFBQSxPQUFPLEVBQVBBLE9BQVQ7QUFBa0JyQyxrQkFBQUEsS0FBSyxFQUFMQTtBQUFsQixpQkFBZjtBQU55QyxlQUFwQixDQUR0Qjs7QUFBQTtBQUNBNEMsY0FBQUEsUUFEQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUFGOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLEtBeEVVO0FBa0ZmOUMsRUFBQUEsS0FBSyxFQUFFLGVBQUMrQyxFQUFELEVBQU87QUFDYixXQUFPLElBQUl6RCxPQUFKLENBQVksVUFBQUMsT0FBTztBQUFBLGFBQUl5RCxVQUFVLENBQUN6RCxPQUFELEVBQVV3RCxFQUFWLENBQWQ7QUFBQSxLQUFuQixDQUFQO0FBQ0E7QUFwRmMsQ0FBaEI7ZUF1RmU1RCxPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXRoZXJzIH0gZnJvbSAnZXRoZXJzJztcblxuaW1wb3J0IGVyYzIwQWJpIGZyb20gJy4uLy4uL2FiaS9lcmMyMC5qc29uJztcbmltcG9ydCB3ZXRoQWJpIGZyb20gJy4uLy4uL2FiaS93ZXRoLmpzb24nO1xuXG5jb25zdCB1dGlsaXR5ID0ge1xuXHRwcm9taXNpZnk6IChpbm5lcikgPT4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRpbm5lcigoZXJyLCByZXMpID0+IHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlc29sdmUocmVzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdHdhaXRGb3JSZWNlaXB0OiBhc3luYyhoYXNoLCBwcm92aWRlcikgPT4ge1xuXHRcdGxldCByZWNlaXB0ID0gbnVsbDtcblx0XHR3aGlsZSAoIXJlY2VpcHQpIHtcblx0XHRcdHJlY2VpcHQgPSBhd2FpdCBwcm92aWRlci5nZXRUcmFuc2FjdGlvblJlY2VpcHQoaGFzaCk7XG5cdFx0XHRhd2FpdCB1dGlsaXR5LnNsZWVwKDIwMDApO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVjZWlwdDtcblx0fSxcblx0Z2V0VG9rZW5Db250cmFjdDogKHRyYWRlLCBzaWduZXIpID0+IHtcblx0XHRjb25zdCB0b2tlbkFkZHJlc3MgPSB0cmFkZS5tZXRhZGF0YS5pbnB1dC5hZGRyZXNzO1xuXHRcdHJldHVybiBuZXcgZXRoZXJzLkNvbnRyYWN0KHRva2VuQWRkcmVzcywgZXJjMjBBYmksIHNpZ25lcik7XG5cdH0sXG5cdGdldFdldGhDb250cmFjdDogKHNpZ25lcikgPT4ge1xuXHRcdGNvbnN0IHdldGhUb2tlbkFkZHJlc3MgPSAnMHhjMDJhYWEzOWIyMjNmZThkMGEwZTVjNGYyN2VhZDkwODNjNzU2Y2MyJztcblx0XHRyZXR1cm4gbmV3IGV0aGVycy5Db250cmFjdCh3ZXRoVG9rZW5BZGRyZXNzLCB3ZXRoQWJpLCBzaWduZXIpO1xuXHR9LFxuXHRnZXRFdGhlclRvV3JhcCh0cmFkZSwgcHJvdmlkZXIsIHNpZ25lcikge1xuXHRcdGNvbnN0IHdldGhUb2tlbkFkZHJlc3MgPSAnMHhjMDJhYWEzOWIyMjNmZThkMGEwZTVjNGYyN2VhZDkwODNjNzU2Y2MyJztcblx0XHRpZiAoIXRyYWRlLm1ldGFkYXRhLmlucHV0KSB7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cdFx0aWYgKHRyYWRlLm1ldGFkYXRhLmlucHV0LmFkZHJlc3MgIT0gd2V0aFRva2VuQWRkcmVzcykge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXHRcdGNvbnN0IHdldGhBbW91bnQgPSB0cmFkZS5tZXRhZGF0YS5pbnB1dC5hbW91bnQ7XG5cdFx0Y29uc3Qgd2V0aENvbnRyYWN0ID0gbmV3IGV0aGVycy5Db250cmFjdCh3ZXRoVG9rZW5BZGRyZXNzLCBlcmMyMEFiaSwgc2lnbmVyKTtcblx0XHRsZXQgYWNjb3VudEFkZHJlc3M7XG5cdFx0bGV0IHdldGhCYWxhbmNlO1xuXHRcdGNvbnN0IGVub3VnaFdldGggPSBzaWduZXIuZ2V0QWRkcmVzcygpXG5cdFx0XHQudGhlbihhZGRyZXNzID0+IHtcblx0XHRcdFx0YWNjb3VudEFkZHJlc3MgPSBhZGRyZXNzO1xuXHRcdFx0XHRyZXR1cm4gd2V0aENvbnRyYWN0LmJhbGFuY2VPZihhY2NvdW50QWRkcmVzcyk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYmFsYW5jZSA9PiB7XG5cdFx0XHRcdHdldGhCYWxhbmNlID0gYmFsYW5jZTtcblx0XHRcdFx0cmV0dXJuIHByb3ZpZGVyLmdldEJhbGFuY2UoYWNjb3VudEFkZHJlc3MpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKGJhbGFuY2UgPT4ge1xuXHRcdFx0XHRpZiAod2V0aEJhbGFuY2UuZ3RlKHdldGhBbW91bnQpKSB7XG5cdFx0XHRcdFx0Ly8gRW5vdWdoIHdldGgsIG5vIG5lZWQgdG8gd3JhcFxuXHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHRvdGFsQmFsYW5jZSA9IGJhbGFuY2UuYWRkKHdldGhCYWxhbmNlKTtcblx0XHRcdFx0aWYgKHRvdGFsQmFsYW5jZS5sdCh3ZXRoQW1vdW50KSkge1xuXHRcdFx0XHRcdC8vIEluc3VmZmljaWVudCBiYWxhbmNlXG5cdFx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGV0aCB0byB3cmFwID0gd2V0aCByZXF1aXJlZCBmb3IgdHJhZGUgLSB3ZXRoIGJhbGFuY2Vcblx0XHRcdFx0Y29uc3QgZXRoVG9XcmFwID0gd2V0aEJhbGFuY2Uuc3ViKHdldGhBbW91bnQpLm11bCgtMSk7XG5cdFx0XHRcdHJldHVybiBldGhUb1dyYXAudG9TdHJpbmcoKTtcblx0XHRcdH0pO1xuXHRcdHJldHVybiBlbm91Z2hXZXRoO1xuXHR9LFxuXHRoYW5kbGVSZWNlaXB0OiAoc3RhdHVzLCByZWNlaXB0KT0+IHtcblx0XHRpZihyZWNlaXB0LnN0YXR1cz09JzB4MScpe1xuXHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdtaW5lZF90cmFkZScsIHN0YXR1cy5oYXNoKTtcblx0XHR9ZWxzZXtcblx0XHRcdHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignZmFpbGVkJywgc3RhdHVzLmhhc2gpO1xuXHRcdH1cblx0fSxcblx0dHJhY2s6IGFzeW5jKHN0YXR1cywgZGV0YWlscywgdHJhZGUpPT57XG5cdFx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2FwaS9zZW5kX3RyYWRlJywge1xuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdCdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0XHRcdH0sXG5cdFx0XHRib2R5OiBKU09OLnN0cmluZ2lmeSh7c3RhdHVzLCBkZXRhaWxzLCB0cmFkZX0pXG5cdFx0fSk7XG5cdH0sXG5cdHNsZWVwOiAobXMpPT4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgdXRpbGl0eTtcbiJdfQ==