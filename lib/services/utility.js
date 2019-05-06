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
    _regenerator["default"].mark(function _callee2(status, details) {
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
                  details: details
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

    function track(_x3, _x4) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy91dGlsaXR5LmpzIl0sIm5hbWVzIjpbInV0aWxpdHkiLCJwcm9taXNpZnkiLCJpbm5lciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXJyIiwicmVzIiwid2FpdEZvclJlY2VpcHQiLCJoYXNoIiwicHJvdmlkZXIiLCJyZWNlaXB0IiwiZ2V0VHJhbnNhY3Rpb25SZWNlaXB0Iiwic2xlZXAiLCJnZXRUb2tlbkNvbnRyYWN0IiwidHJhZGUiLCJzaWduZXIiLCJ0b2tlbkFkZHJlc3MiLCJtZXRhZGF0YSIsImlucHV0IiwiYWRkcmVzcyIsImV0aGVycyIsIkNvbnRyYWN0IiwiZXJjMjBBYmkiLCJnZXRXZXRoQ29udHJhY3QiLCJ3ZXRoVG9rZW5BZGRyZXNzIiwid2V0aEFiaSIsImdldEV0aGVyVG9XcmFwIiwid2V0aEFtb3VudCIsImFtb3VudCIsIndldGhDb250cmFjdCIsImFjY291bnRBZGRyZXNzIiwid2V0aEJhbGFuY2UiLCJlbm91Z2hXZXRoIiwiZ2V0QWRkcmVzcyIsInRoZW4iLCJiYWxhbmNlT2YiLCJiYWxhbmNlIiwiZ2V0QmFsYW5jZSIsImd0ZSIsInRvdGFsQmFsYW5jZSIsImFkZCIsImx0IiwiZXRoVG9XcmFwIiwic3ViIiwibXVsIiwidG9TdHJpbmciLCJoYW5kbGVSZWNlaXB0Iiwic3RhdHVzIiwid2luZG93Iiwid2ViM1N0YXR1c0hhbmRsZXIiLCJ0cmFjayIsImRldGFpbHMiLCJmZXRjaCIsIm1ldGhvZCIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInJlc3BvbnNlIiwibXMiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBRUEsSUFBTUEsT0FBTyxHQUFHO0FBQ2ZDLEVBQUFBLFNBQVMsRUFBRSxtQkFBQ0MsS0FBRCxFQUFXO0FBQ3JCLFdBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixF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eUMsZUFBcEIsQ0FEdEI7O0FBQUE7QUFDQU8sY0FBQUEsUUFEQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUFGOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLEtBeEVVO0FBa0ZmOUMsRUFBQUEsS0FBSyxFQUFFLGVBQUMrQyxFQUFELEVBQU87QUFDYixXQUFPLElBQUl6RCxPQUFKLENBQVksVUFBQUMsT0FBTztBQUFBLGFBQUl5RCxVQUFVLENBQUN6RCxPQUFELEVBQVV3RCxFQUFWLENBQWQ7QUFBQSxLQUFuQixDQUFQO0FBQ0E7QUFwRmMsQ0FBaEI7ZUF1RmU1RCxPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXRoZXJzIH0gZnJvbSAnZXRoZXJzJztcclxuXHJcbmltcG9ydCBlcmMyMEFiaSBmcm9tICcuLi8uLi9hYmkvZXJjMjAuanNvbic7XHJcbmltcG9ydCB3ZXRoQWJpIGZyb20gJy4uLy4uL2FiaS93ZXRoLmpzb24nO1xyXG5cclxuY29uc3QgdXRpbGl0eSA9IHtcclxuXHRwcm9taXNpZnk6IChpbm5lcikgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0aW5uZXIoKGVyciwgcmVzKSA9PiB7XHJcblx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0cmVqZWN0KGVycik7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc29sdmUocmVzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHR3YWl0Rm9yUmVjZWlwdDogYXN5bmMoaGFzaCwgcHJvdmlkZXIpID0+IHtcclxuXHRcdGxldCByZWNlaXB0ID0gbnVsbDtcclxuXHRcdHdoaWxlICghcmVjZWlwdCkge1xyXG5cdFx0XHRyZWNlaXB0ID0gYXdhaXQgcHJvdmlkZXIuZ2V0VHJhbnNhY3Rpb25SZWNlaXB0KGhhc2gpO1xyXG5cdFx0XHRhd2FpdCB1dGlsaXR5LnNsZWVwKDIwMDApO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlY2VpcHQ7XHJcblx0fSxcclxuXHRnZXRUb2tlbkNvbnRyYWN0OiAodHJhZGUsIHNpZ25lcikgPT4ge1xyXG5cdFx0Y29uc3QgdG9rZW5BZGRyZXNzID0gdHJhZGUubWV0YWRhdGEuaW5wdXQuYWRkcmVzcztcclxuXHRcdHJldHVybiBuZXcgZXRoZXJzLkNvbnRyYWN0KHRva2VuQWRkcmVzcywgZXJjMjBBYmksIHNpZ25lcik7XHJcblx0fSxcclxuXHRnZXRXZXRoQ29udHJhY3Q6IChzaWduZXIpID0+IHtcclxuXHRcdGNvbnN0IHdldGhUb2tlbkFkZHJlc3MgPSAnMHhjMDJhYWEzOWIyMjNmZThkMGEwZTVjNGYyN2VhZDkwODNjNzU2Y2MyJztcclxuXHRcdHJldHVybiBuZXcgZXRoZXJzLkNvbnRyYWN0KHdldGhUb2tlbkFkZHJlc3MsIHdldGhBYmksIHNpZ25lcik7XHJcblx0fSxcclxuXHRnZXRFdGhlclRvV3JhcCh0cmFkZSwgcHJvdmlkZXIsIHNpZ25lcikge1xyXG5cdFx0Y29uc3Qgd2V0aFRva2VuQWRkcmVzcyA9ICcweGMwMmFhYTM5YjIyM2ZlOGQwYTBlNWM0ZjI3ZWFkOTA4M2M3NTZjYzInO1xyXG5cdFx0aWYgKCF0cmFkZS5tZXRhZGF0YS5pbnB1dCkge1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH1cclxuXHRcdGlmICh0cmFkZS5tZXRhZGF0YS5pbnB1dC5hZGRyZXNzICE9IHdldGhUb2tlbkFkZHJlc3MpIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRjb25zdCB3ZXRoQW1vdW50ID0gdHJhZGUubWV0YWRhdGEuaW5wdXQuYW1vdW50O1xyXG5cdFx0Y29uc3Qgd2V0aENvbnRyYWN0ID0gbmV3IGV0aGVycy5Db250cmFjdCh3ZXRoVG9rZW5BZGRyZXNzLCBlcmMyMEFiaSwgc2lnbmVyKTtcclxuXHRcdGxldCBhY2NvdW50QWRkcmVzcztcclxuXHRcdGxldCB3ZXRoQmFsYW5jZTtcclxuXHRcdGNvbnN0IGVub3VnaFdldGggPSBzaWduZXIuZ2V0QWRkcmVzcygpXHJcblx0XHRcdC50aGVuKGFkZHJlc3MgPT4ge1xyXG5cdFx0XHRcdGFjY291bnRBZGRyZXNzID0gYWRkcmVzcztcclxuXHRcdFx0XHRyZXR1cm4gd2V0aENvbnRyYWN0LmJhbGFuY2VPZihhY2NvdW50QWRkcmVzcyk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC50aGVuKGJhbGFuY2UgPT4ge1xyXG5cdFx0XHRcdHdldGhCYWxhbmNlID0gYmFsYW5jZTtcclxuXHRcdFx0XHRyZXR1cm4gcHJvdmlkZXIuZ2V0QmFsYW5jZShhY2NvdW50QWRkcmVzcyk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC50aGVuKGJhbGFuY2UgPT4ge1xyXG5cdFx0XHRcdGlmICh3ZXRoQmFsYW5jZS5ndGUod2V0aEFtb3VudCkpIHtcclxuXHRcdFx0XHRcdC8vIEVub3VnaCB3ZXRoLCBubyBuZWVkIHRvIHdyYXBcclxuXHRcdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb25zdCB0b3RhbEJhbGFuY2UgPSBiYWxhbmNlLmFkZCh3ZXRoQmFsYW5jZSk7XHJcblx0XHRcdFx0aWYgKHRvdGFsQmFsYW5jZS5sdCh3ZXRoQW1vdW50KSkge1xyXG5cdFx0XHRcdFx0Ly8gSW5zdWZmaWNpZW50IGJhbGFuY2VcclxuXHRcdFx0XHRcdHJldHVybiAtMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gZXRoIHRvIHdyYXAgPSB3ZXRoIHJlcXVpcmVkIGZvciB0cmFkZSAtIHdldGggYmFsYW5jZVxyXG5cdFx0XHRcdGNvbnN0IGV0aFRvV3JhcCA9IHdldGhCYWxhbmNlLnN1Yih3ZXRoQW1vdW50KS5tdWwoLTEpO1xyXG5cdFx0XHRcdHJldHVybiBldGhUb1dyYXAudG9TdHJpbmcoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRyZXR1cm4gZW5vdWdoV2V0aDtcclxuXHR9LFxyXG5cdGhhbmRsZVJlY2VpcHQ6IChzdGF0dXMsIHJlY2VpcHQpPT4ge1xyXG5cdFx0aWYocmVjZWlwdC5zdGF0dXM9PScweDEnKXtcclxuXHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdtaW5lZF90cmFkZScsIHN0YXR1cy5oYXNoKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ2ZhaWxlZCcsIHN0YXR1cy5oYXNoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHRyYWNrOiBhc3luYyhzdGF0dXMsIGRldGFpbHMpPT57XHJcblx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYXBpL3NlbmRfdHJhZGUnLCB7XHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0J0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcblx0XHRcdH0sXHJcblx0XHRcdGJvZHk6IEpTT04uc3RyaW5naWZ5KHtzdGF0dXMsIGRldGFpbHN9KVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRzbGVlcDogKG1zKT0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCB1dGlsaXR5O1xyXG4iXX0=