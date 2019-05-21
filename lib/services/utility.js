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
              return fetch('https://api.dex.ag/send_trade', {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy91dGlsaXR5LmpzIl0sIm5hbWVzIjpbInV0aWxpdHkiLCJwcm9taXNpZnkiLCJpbm5lciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXJyIiwicmVzIiwid2FpdEZvclJlY2VpcHQiLCJoYXNoIiwicHJvdmlkZXIiLCJyZWNlaXB0IiwiZ2V0VHJhbnNhY3Rpb25SZWNlaXB0Iiwic2xlZXAiLCJnZXRUb2tlbkNvbnRyYWN0IiwidHJhZGUiLCJzaWduZXIiLCJ0b2tlbkFkZHJlc3MiLCJtZXRhZGF0YSIsImlucHV0IiwiYWRkcmVzcyIsImV0aGVycyIsIkNvbnRyYWN0IiwiZXJjMjBBYmkiLCJnZXRXZXRoQ29udHJhY3QiLCJ3ZXRoVG9rZW5BZGRyZXNzIiwid2V0aEFiaSIsImdldEV0aGVyVG9XcmFwIiwid2V0aEFtb3VudCIsImFtb3VudCIsIndldGhDb250cmFjdCIsImFjY291bnRBZGRyZXNzIiwid2V0aEJhbGFuY2UiLCJlbm91Z2hXZXRoIiwiZ2V0QWRkcmVzcyIsInRoZW4iLCJiYWxhbmNlT2YiLCJiYWxhbmNlIiwiZ2V0QmFsYW5jZSIsImd0ZSIsInRvdGFsQmFsYW5jZSIsImFkZCIsImx0IiwiZXRoVG9XcmFwIiwic3ViIiwibXVsIiwidG9TdHJpbmciLCJoYW5kbGVSZWNlaXB0Iiwic3RhdHVzIiwid2luZG93Iiwid2ViM1N0YXR1c0hhbmRsZXIiLCJ0cmFjayIsImRldGFpbHMiLCJmZXRjaCIsIm1ldGhvZCIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInJlc3BvbnNlIiwibXMiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBRUEsSUFBTUEsT0FBTyxHQUFHO0FBQ2RDLEVBQUFBLFNBQVMsRUFBRSxtQkFBQ0MsS0FBRCxFQUFXO0FBQ3BCLFdBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixF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VDtBQUFrQnJDLGtCQUFBQSxLQUFLLEVBQUxBO0FBQWxCLGlCQUFmO0FBTnNELGVBQWxDLENBRHZCOztBQUFBO0FBQ0M0QyxjQUFBQSxRQUREOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsS0F4RVM7QUFrRmQ5QyxFQUFBQSxLQUFLLEVBQUUsZUFBQytDLEVBQUQsRUFBTztBQUNaLFdBQU8sSUFBSXpELE9BQUosQ0FBWSxVQUFBQyxPQUFPO0FBQUEsYUFBSXlELFVBQVUsQ0FBQ3pELE9BQUQsRUFBVXdELEVBQVYsQ0FBZDtBQUFBLEtBQW5CLENBQVA7QUFDRDtBQXBGYSxDQUFoQjtlQXVGZTVELE8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBldGhlcnMgfSBmcm9tICdldGhlcnMnO1xuXG5pbXBvcnQgZXJjMjBBYmkgZnJvbSAnLi4vLi4vYWJpL2VyYzIwLmpzb24nO1xuaW1wb3J0IHdldGhBYmkgZnJvbSAnLi4vLi4vYWJpL3dldGguanNvbic7XG5cbmNvbnN0IHV0aWxpdHkgPSB7XG4gIHByb21pc2lmeTogKGlubmVyKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlubmVyKChlcnIsIHJlcykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgd2FpdEZvclJlY2VpcHQ6IGFzeW5jKGhhc2gsIHByb3ZpZGVyKSA9PiB7XG4gICAgbGV0IHJlY2VpcHQgPSBudWxsO1xuICAgIHdoaWxlICghcmVjZWlwdCkge1xuICAgICAgcmVjZWlwdCA9IGF3YWl0IHByb3ZpZGVyLmdldFRyYW5zYWN0aW9uUmVjZWlwdChoYXNoKTtcbiAgICAgIGF3YWl0IHV0aWxpdHkuc2xlZXAoMjAwMCk7XG4gICAgfVxuICAgIHJldHVybiByZWNlaXB0O1xuICB9LFxuICBnZXRUb2tlbkNvbnRyYWN0OiAodHJhZGUsIHNpZ25lcikgPT4ge1xuICAgIGNvbnN0IHRva2VuQWRkcmVzcyA9IHRyYWRlLm1ldGFkYXRhLmlucHV0LmFkZHJlc3M7XG4gICAgcmV0dXJuIG5ldyBldGhlcnMuQ29udHJhY3QodG9rZW5BZGRyZXNzLCBlcmMyMEFiaSwgc2lnbmVyKTtcbiAgfSxcbiAgZ2V0V2V0aENvbnRyYWN0OiAoc2lnbmVyKSA9PiB7XG4gICAgY29uc3Qgd2V0aFRva2VuQWRkcmVzcyA9ICcweGMwMmFhYTM5YjIyM2ZlOGQwYTBlNWM0ZjI3ZWFkOTA4M2M3NTZjYzInO1xuICAgIHJldHVybiBuZXcgZXRoZXJzLkNvbnRyYWN0KHdldGhUb2tlbkFkZHJlc3MsIHdldGhBYmksIHNpZ25lcik7XG4gIH0sXG4gIGdldEV0aGVyVG9XcmFwKHRyYWRlLCBwcm92aWRlciwgc2lnbmVyKSB7XG4gICAgY29uc3Qgd2V0aFRva2VuQWRkcmVzcyA9ICcweGMwMmFhYTM5YjIyM2ZlOGQwYTBlNWM0ZjI3ZWFkOTA4M2M3NTZjYzInO1xuICAgIGlmICghdHJhZGUubWV0YWRhdGEuaW5wdXQpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBpZiAodHJhZGUubWV0YWRhdGEuaW5wdXQuYWRkcmVzcyAhPSB3ZXRoVG9rZW5BZGRyZXNzKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgY29uc3Qgd2V0aEFtb3VudCA9IHRyYWRlLm1ldGFkYXRhLmlucHV0LmFtb3VudDtcbiAgICBjb25zdCB3ZXRoQ29udHJhY3QgPSBuZXcgZXRoZXJzLkNvbnRyYWN0KHdldGhUb2tlbkFkZHJlc3MsIGVyYzIwQWJpLCBzaWduZXIpO1xuICAgIGxldCBhY2NvdW50QWRkcmVzcztcbiAgICBsZXQgd2V0aEJhbGFuY2U7XG4gICAgY29uc3QgZW5vdWdoV2V0aCA9IHNpZ25lci5nZXRBZGRyZXNzKClcbiAgICAudGhlbihhZGRyZXNzID0+IHtcbiAgICAgIGFjY291bnRBZGRyZXNzID0gYWRkcmVzcztcbiAgICAgIHJldHVybiB3ZXRoQ29udHJhY3QuYmFsYW5jZU9mKGFjY291bnRBZGRyZXNzKTtcbiAgICB9KVxuICAgIC50aGVuKGJhbGFuY2UgPT4ge1xuICAgICAgd2V0aEJhbGFuY2UgPSBiYWxhbmNlO1xuICAgICAgcmV0dXJuIHByb3ZpZGVyLmdldEJhbGFuY2UoYWNjb3VudEFkZHJlc3MpO1xuICAgIH0pXG4gICAgLnRoZW4oYmFsYW5jZSA9PiB7XG4gICAgICBpZiAod2V0aEJhbGFuY2UuZ3RlKHdldGhBbW91bnQpKSB7XG4gICAgICAgIC8vIEVub3VnaCB3ZXRoLCBubyBuZWVkIHRvIHdyYXBcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICBjb25zdCB0b3RhbEJhbGFuY2UgPSBiYWxhbmNlLmFkZCh3ZXRoQmFsYW5jZSk7XG4gICAgICBpZiAodG90YWxCYWxhbmNlLmx0KHdldGhBbW91bnQpKSB7XG4gICAgICAgIC8vIEluc3VmZmljaWVudCBiYWxhbmNlXG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIC8vIGV0aCB0byB3cmFwID0gd2V0aCByZXF1aXJlZCBmb3IgdHJhZGUgLSB3ZXRoIGJhbGFuY2VcbiAgICAgIGNvbnN0IGV0aFRvV3JhcCA9IHdldGhCYWxhbmNlLnN1Yih3ZXRoQW1vdW50KS5tdWwoLTEpO1xuICAgICAgcmV0dXJuIGV0aFRvV3JhcC50b1N0cmluZygpO1xuICAgIH0pO1xuICAgIHJldHVybiBlbm91Z2hXZXRoO1xuICB9LFxuICBoYW5kbGVSZWNlaXB0OiAoc3RhdHVzLCByZWNlaXB0KT0+IHtcbiAgICBpZihyZWNlaXB0LnN0YXR1cz09JzB4MScpe1xuICAgICAgd2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdtaW5lZF90cmFkZScsIHN0YXR1cy5oYXNoKTtcbiAgICB9ZWxzZXtcbiAgICAgIHdpbmRvdy53ZWIzU3RhdHVzSGFuZGxlcignZmFpbGVkJywgc3RhdHVzLmhhc2gpO1xuICAgIH1cbiAgfSxcbiAgdHJhY2s6IGFzeW5jKHN0YXR1cywgZGV0YWlscywgdHJhZGUpPT57XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hcGkuZGV4LmFnL3NlbmRfdHJhZGUnLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtzdGF0dXMsIGRldGFpbHMsIHRyYWRlfSlcbiAgICB9KTtcbiAgfSxcbiAgc2xlZXA6IChtcyk9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB1dGlsaXR5O1xuIl19