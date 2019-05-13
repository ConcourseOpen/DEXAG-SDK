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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy91dGlsaXR5LmpzIl0sIm5hbWVzIjpbInV0aWxpdHkiLCJwcm9taXNpZnkiLCJpbm5lciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXJyIiwicmVzIiwid2FpdEZvclJlY2VpcHQiLCJoYXNoIiwicHJvdmlkZXIiLCJyZWNlaXB0IiwiZ2V0VHJhbnNhY3Rpb25SZWNlaXB0Iiwic2xlZXAiLCJnZXRUb2tlbkNvbnRyYWN0IiwidHJhZGUiLCJzaWduZXIiLCJ0b2tlbkFkZHJlc3MiLCJtZXRhZGF0YSIsImlucHV0IiwiYWRkcmVzcyIsImV0aGVycyIsIkNvbnRyYWN0IiwiZXJjMjBBYmkiLCJnZXRXZXRoQ29udHJhY3QiLCJ3ZXRoVG9rZW5BZGRyZXNzIiwid2V0aEFiaSIsImdldEV0aGVyVG9XcmFwIiwid2V0aEFtb3VudCIsImFtb3VudCIsIndldGhDb250cmFjdCIsImFjY291bnRBZGRyZXNzIiwid2V0aEJhbGFuY2UiLCJlbm91Z2hXZXRoIiwiZ2V0QWRkcmVzcyIsInRoZW4iLCJiYWxhbmNlT2YiLCJiYWxhbmNlIiwiZ2V0QmFsYW5jZSIsImd0ZSIsInRvdGFsQmFsYW5jZSIsImFkZCIsImx0IiwiZXRoVG9XcmFwIiwic3ViIiwibXVsIiwidG9TdHJpbmciLCJoYW5kbGVSZWNlaXB0Iiwic3RhdHVzIiwid2luZG93Iiwid2ViM1N0YXR1c0hhbmRsZXIiLCJ0cmFjayIsImRldGFpbHMiLCJmZXRjaCIsIm1ldGhvZCIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInJlc3BvbnNlIiwibXMiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBRUEsSUFBTUEsT0FBTyxHQUFHO0FBQ2RDLEVBQUFBLFNBQVMsRUFBRSxtQkFBQ0MsS0FBRCxFQUFXO0FBQ3BCLFdBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0Q0gsTUFBQUEsS0FBSyxDQUFDLFVBQUNJLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ2xCLFlBQUlELEdBQUosRUFBUztBQUNQRCxVQUFBQSxNQUFNLENBQUNDLEdBQUQsQ0FBTjtBQUNELFNBRkQsTUFFTztBQUNMRixVQUFBQSxPQUFPLENBQUNHLEdBQUQsQ0FBUDtBQUNEO0FBQ0YsT0FOSSxDQUFMO0FBT0QsS0FSTSxDQUFQO0FBU0QsR0FYYTtBQVlkQyxFQUFBQSxjQUFjO0FBQUE7QUFBQTtBQUFBLGlDQUFFLGlCQUFNQyxJQUFOLEVBQVlDLFFBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1ZDLGNBQUFBLE9BRFUsR0FDQSxJQURBOztBQUFBO0FBQUEsa0JBRU5BLE9BRk07QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxxQkFHSUQsUUFBUSxDQUFDRSxxQkFBVCxDQUErQkgsSUFBL0IsQ0FISjs7QUFBQTtBQUdaRSxjQUFBQSxPQUhZO0FBQUE7QUFBQSxxQkFJTlgsT0FBTyxDQUFDYSxLQUFSLENBQWMsSUFBZCxDQUpNOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLCtDQU1QRixPQU5POztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsS0FaQTtBQW9CZEcsRUFBQUEsZ0JBQWdCLEVBQUUsMEJBQUNDLEtBQUQsRUFBUUMsTUFBUixFQUFtQjtBQUNuQyxRQUFNQyxZQUFZLEdBQUdGLEtBQUssQ0FBQ0csUUFBTixDQUFlQyxLQUFmLENBQXFCQyxPQUExQztBQUNBLFdBQU8sSUFBSUMsZUFBT0MsUUFBWCxDQUFvQkwsWUFBcEIsRUFBa0NNLGVBQWxDLEVBQTRDUCxNQUE1QyxDQUFQO0FBQ0QsR0F2QmE7QUF3QmRRLEVBQUFBLGVBQWUsRUFBRSx5QkFBQ1IsTUFBRCxFQUFZO0FBQzNCLFFBQU1TLGdCQUFnQixHQUFHLDRDQUF6QjtBQUNBLFdBQU8sSUFBSUosZUFBT0MsUUFBWCxDQUFvQkcsZ0JBQXBCLEVBQXNDQyxnQkFBdEMsRUFBK0NWLE1BQS9DLENBQVA7QUFDRCxHQTNCYTtBQTRCZFcsRUFBQUEsY0E1QmMsMEJBNEJDWixLQTVCRCxFQTRCUUwsUUE1QlIsRUE0QmtCTSxNQTVCbEIsRUE0QjBCO0FBQ3RDLFFBQU1TLGdCQUFnQixHQUFHLDRDQUF6Qjs7QUFDQSxRQUFJLENBQUNWLEtBQUssQ0FBQ0csUUFBTixDQUFlQyxLQUFwQixFQUEyQjtBQUN6QixhQUFPLENBQVA7QUFDRDs7QUFDRCxRQUFJSixLQUFLLENBQUNHLFFBQU4sQ0FBZUMsS0FBZixDQUFxQkMsT0FBckIsSUFBZ0NLLGdCQUFwQyxFQUFzRDtBQUNwRCxhQUFPLENBQVA7QUFDRDs7QUFDRCxRQUFNRyxVQUFVLEdBQUdiLEtBQUssQ0FBQ0csUUFBTixDQUFlQyxLQUFmLENBQXFCVSxNQUF4QztBQUNBLFFBQU1DLFlBQVksR0FBRyxJQUFJVCxlQUFPQyxRQUFYLENBQW9CRyxnQkFBcEIsRUFBc0NGLGVBQXRDLEVBQWdEUCxNQUFoRCxDQUFyQjtBQUNBLFFBQUllLGNBQUo7QUFDQSxRQUFJQyxXQUFKO0FBQ0EsUUFBTUMsVUFBVSxHQUFHakIsTUFBTSxDQUFDa0IsVUFBUCxHQUNsQkMsSUFEa0IsQ0FDYixVQUFBZixPQUFPLEVBQUk7QUFDZlcsTUFBQUEsY0FBYyxHQUFHWCxPQUFqQjtBQUNBLGFBQU9VLFlBQVksQ0FBQ00sU0FBYixDQUF1QkwsY0FBdkIsQ0FBUDtBQUNELEtBSmtCLEVBS2xCSSxJQUxrQixDQUtiLFVBQUFFLE9BQU8sRUFBSTtBQUNmTCxNQUFBQSxXQUFXLEdBQUdLLE9BQWQ7QUFDQSxhQUFPM0IsUUFBUSxDQUFDNEIsVUFBVCxDQUFvQlAsY0FBcEIsQ0FBUDtBQUNELEtBUmtCLEVBU2xCSSxJQVRrQixDQVNiLFVBQUFFLE9BQU8sRUFBSTtBQUNmLFVBQUlMLFdBQVcsQ0FBQ08sR0FBWixDQUFnQlgsVUFBaEIsQ0FBSixFQUFpQztBQUMvQjtBQUNBLGVBQU8sQ0FBUDtBQUNEOztBQUNELFVBQU1ZLFlBQVksR0FBR0gsT0FBTyxDQUFDSSxHQUFSLENBQVlULFdBQVosQ0FBckI7O0FBQ0EsVUFBSVEsWUFBWSxDQUFDRSxFQUFiLENBQWdCZCxVQUFoQixDQUFKLEVBQWlDO0FBQy9CO0FBQ0EsZUFBTyxDQUFDLENBQVI7QUFDRCxPQVRjLENBVWY7OztBQUNBLFVBQU1lLFNBQVMsR0FBR1gsV0FBVyxDQUFDWSxHQUFaLENBQWdCaEIsVUFBaEIsRUFBNEJpQixHQUE1QixDQUFnQyxDQUFDLENBQWpDLENBQWxCO0FBQ0EsYUFBT0YsU0FBUyxDQUFDRyxRQUFWLEVBQVA7QUFDRCxLQXRCa0IsQ0FBbkI7QUF1QkEsV0FBT2IsVUFBUDtBQUNELEdBaEVhO0FBaUVkYyxFQUFBQSxhQUFhLEVBQUUsdUJBQUNDLE1BQUQsRUFBU3JDLE9BQVQsRUFBb0I7QUFDakMsUUFBR0EsT0FBTyxDQUFDcUMsTUFBUixJQUFnQixLQUFuQixFQUF5QjtBQUN2QkMsTUFBQUEsTUFBTSxDQUFDQyxpQkFBUCxDQUF5QixhQUF6QixFQUF3Q0YsTUFBTSxDQUFDdkMsSUFBL0M7QUFDRCxLQUZELE1BRUs7QUFDSHdDLE1BQUFBLE1BQU0sQ0FBQ0MsaUJBQVAsQ0FBeUIsUUFBekIsRUFBbUNGLE1BQU0sQ0FBQ3ZDLElBQTFDO0FBQ0Q7QUFDRixHQXZFYTtBQXdFZDBDLEVBQUFBLEtBQUs7QUFBQTtBQUFBO0FBQUEsaUNBQUUsa0JBQU1ILE1BQU4sRUFBY0ksT0FBZCxFQUF1QnJDLEtBQXZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBQ2tCc0MsS0FBSyxDQUFDLGlCQUFELEVBQW9CO0FBQzlDQyxnQkFBQUEsTUFBTSxFQUFFLE1BRHNDO0FBRTlDQyxnQkFBQUEsT0FBTyxFQUFFO0FBQ1QsNEJBQVUsa0JBREQ7QUFFVCxrQ0FBZ0I7QUFGUCxpQkFGcUM7QUFNOUNDLGdCQUFBQSxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQUNWLGtCQUFBQSxNQUFNLEVBQU5BLE1BQUQ7QUFBU0ksa0JBQUFBLE9BQU8sRUFBUEEsT0FBVDtBQUFrQnJDLGtCQUFBQSxLQUFLLEVBQUxBO0FBQWxCLGlCQUFmO0FBTndDLGVBQXBCLENBRHZCOztBQUFBO0FBQ0M0QyxjQUFBQSxRQUREOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsS0F4RVM7QUFrRmQ5QyxFQUFBQSxLQUFLLEVBQUUsZUFBQytDLEVBQUQsRUFBTztBQUNaLFdBQU8sSUFBSXpELE9BQUosQ0FBWSxVQUFBQyxPQUFPO0FBQUEsYUFBSXlELFVBQVUsQ0FBQ3pELE9BQUQsRUFBVXdELEVBQVYsQ0FBZDtBQUFBLEtBQW5CLENBQVA7QUFDRDtBQXBGYSxDQUFoQjtlQXVGZTVELE8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBldGhlcnMgfSBmcm9tICdldGhlcnMnO1xyXG5cclxuaW1wb3J0IGVyYzIwQWJpIGZyb20gJy4uLy4uL2FiaS9lcmMyMC5qc29uJztcclxuaW1wb3J0IHdldGhBYmkgZnJvbSAnLi4vLi4vYWJpL3dldGguanNvbic7XHJcblxyXG5jb25zdCB1dGlsaXR5ID0ge1xyXG4gIHByb21pc2lmeTogKGlubmVyKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBpbm5lcigoZXJyLCByZXMpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzb2x2ZShyZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIHdhaXRGb3JSZWNlaXB0OiBhc3luYyhoYXNoLCBwcm92aWRlcikgPT4ge1xyXG4gICAgbGV0IHJlY2VpcHQgPSBudWxsO1xyXG4gICAgd2hpbGUgKCFyZWNlaXB0KSB7XHJcbiAgICAgIHJlY2VpcHQgPSBhd2FpdCBwcm92aWRlci5nZXRUcmFuc2FjdGlvblJlY2VpcHQoaGFzaCk7XHJcbiAgICAgIGF3YWl0IHV0aWxpdHkuc2xlZXAoMjAwMCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVjZWlwdDtcclxuICB9LFxyXG4gIGdldFRva2VuQ29udHJhY3Q6ICh0cmFkZSwgc2lnbmVyKSA9PiB7XHJcbiAgICBjb25zdCB0b2tlbkFkZHJlc3MgPSB0cmFkZS5tZXRhZGF0YS5pbnB1dC5hZGRyZXNzO1xyXG4gICAgcmV0dXJuIG5ldyBldGhlcnMuQ29udHJhY3QodG9rZW5BZGRyZXNzLCBlcmMyMEFiaSwgc2lnbmVyKTtcclxuICB9LFxyXG4gIGdldFdldGhDb250cmFjdDogKHNpZ25lcikgPT4ge1xyXG4gICAgY29uc3Qgd2V0aFRva2VuQWRkcmVzcyA9ICcweGMwMmFhYTM5YjIyM2ZlOGQwYTBlNWM0ZjI3ZWFkOTA4M2M3NTZjYzInO1xyXG4gICAgcmV0dXJuIG5ldyBldGhlcnMuQ29udHJhY3Qod2V0aFRva2VuQWRkcmVzcywgd2V0aEFiaSwgc2lnbmVyKTtcclxuICB9LFxyXG4gIGdldEV0aGVyVG9XcmFwKHRyYWRlLCBwcm92aWRlciwgc2lnbmVyKSB7XHJcbiAgICBjb25zdCB3ZXRoVG9rZW5BZGRyZXNzID0gJzB4YzAyYWFhMzliMjIzZmU4ZDBhMGU1YzRmMjdlYWQ5MDgzYzc1NmNjMic7XHJcbiAgICBpZiAoIXRyYWRlLm1ldGFkYXRhLmlucHV0KSB7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG4gICAgaWYgKHRyYWRlLm1ldGFkYXRhLmlucHV0LmFkZHJlc3MgIT0gd2V0aFRva2VuQWRkcmVzcykge1xyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuICAgIGNvbnN0IHdldGhBbW91bnQgPSB0cmFkZS5tZXRhZGF0YS5pbnB1dC5hbW91bnQ7XHJcbiAgICBjb25zdCB3ZXRoQ29udHJhY3QgPSBuZXcgZXRoZXJzLkNvbnRyYWN0KHdldGhUb2tlbkFkZHJlc3MsIGVyYzIwQWJpLCBzaWduZXIpO1xyXG4gICAgbGV0IGFjY291bnRBZGRyZXNzO1xyXG4gICAgbGV0IHdldGhCYWxhbmNlO1xyXG4gICAgY29uc3QgZW5vdWdoV2V0aCA9IHNpZ25lci5nZXRBZGRyZXNzKClcclxuICAgIC50aGVuKGFkZHJlc3MgPT4ge1xyXG4gICAgICBhY2NvdW50QWRkcmVzcyA9IGFkZHJlc3M7XHJcbiAgICAgIHJldHVybiB3ZXRoQ29udHJhY3QuYmFsYW5jZU9mKGFjY291bnRBZGRyZXNzKTtcclxuICAgIH0pXHJcbiAgICAudGhlbihiYWxhbmNlID0+IHtcclxuICAgICAgd2V0aEJhbGFuY2UgPSBiYWxhbmNlO1xyXG4gICAgICByZXR1cm4gcHJvdmlkZXIuZ2V0QmFsYW5jZShhY2NvdW50QWRkcmVzcyk7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oYmFsYW5jZSA9PiB7XHJcbiAgICAgIGlmICh3ZXRoQmFsYW5jZS5ndGUod2V0aEFtb3VudCkpIHtcclxuICAgICAgICAvLyBFbm91Z2ggd2V0aCwgbm8gbmVlZCB0byB3cmFwXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgdG90YWxCYWxhbmNlID0gYmFsYW5jZS5hZGQod2V0aEJhbGFuY2UpO1xyXG4gICAgICBpZiAodG90YWxCYWxhbmNlLmx0KHdldGhBbW91bnQpKSB7XHJcbiAgICAgICAgLy8gSW5zdWZmaWNpZW50IGJhbGFuY2VcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgIH1cclxuICAgICAgLy8gZXRoIHRvIHdyYXAgPSB3ZXRoIHJlcXVpcmVkIGZvciB0cmFkZSAtIHdldGggYmFsYW5jZVxyXG4gICAgICBjb25zdCBldGhUb1dyYXAgPSB3ZXRoQmFsYW5jZS5zdWIod2V0aEFtb3VudCkubXVsKC0xKTtcclxuICAgICAgcmV0dXJuIGV0aFRvV3JhcC50b1N0cmluZygpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZW5vdWdoV2V0aDtcclxuICB9LFxyXG4gIGhhbmRsZVJlY2VpcHQ6IChzdGF0dXMsIHJlY2VpcHQpPT4ge1xyXG4gICAgaWYocmVjZWlwdC5zdGF0dXM9PScweDEnKXtcclxuICAgICAgd2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdtaW5lZF90cmFkZScsIHN0YXR1cy5oYXNoKTtcclxuICAgIH1lbHNle1xyXG4gICAgICB3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2ZhaWxlZCcsIHN0YXR1cy5oYXNoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIHRyYWNrOiBhc3luYyhzdGF0dXMsIGRldGFpbHMsIHRyYWRlKT0+e1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2FwaS9zZW5kX3RyYWRlJywge1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtzdGF0dXMsIGRldGFpbHMsIHRyYWRlfSlcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgc2xlZXA6IChtcyk9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdXRpbGl0eTtcclxuIl19