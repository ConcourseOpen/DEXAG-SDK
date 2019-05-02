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
  waitForReceipt: function waitForReceipt(hash, cb) {
    web3.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (err) {
        console.log('Error');
        console.log(err);
      }

      if (receipt !== null) {
        // Transaction went through
        if (cb) {
          cb(receipt);
        }
      } else {
        // Try again in 1 second
        window.setTimeout(function () {
          utility.waitForReceipt(hash, cb);
        }, 2000);
      }
    });
  },
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
    _regenerator["default"].mark(function _callee(status, details) {
      var response;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
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
              response = _context.sent;

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function track(_x, _x2) {
      return _track.apply(this, arguments);
    }

    return track;
  }()
};
var _default = utility;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy91dGlsaXR5LmpzIl0sIm5hbWVzIjpbInV0aWxpdHkiLCJwcm9taXNpZnkiLCJpbm5lciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXJyIiwicmVzIiwid2FpdEZvclJlY2VpcHQiLCJoYXNoIiwiY2IiLCJ3ZWIzIiwiZXRoIiwiZ2V0VHJhbnNhY3Rpb25SZWNlaXB0IiwicmVjZWlwdCIsImNvbnNvbGUiLCJsb2ciLCJ3aW5kb3ciLCJzZXRUaW1lb3V0IiwiZ2V0VG9rZW5Db250cmFjdCIsInRyYWRlIiwic2lnbmVyIiwidG9rZW5BZGRyZXNzIiwibWV0YWRhdGEiLCJpbnB1dCIsImFkZHJlc3MiLCJldGhlcnMiLCJDb250cmFjdCIsImVyYzIwQWJpIiwiZ2V0V2V0aENvbnRyYWN0Iiwid2V0aFRva2VuQWRkcmVzcyIsIndldGhBYmkiLCJnZXRFdGhlclRvV3JhcCIsInByb3ZpZGVyIiwid2V0aEFtb3VudCIsImFtb3VudCIsIndldGhDb250cmFjdCIsImFjY291bnRBZGRyZXNzIiwid2V0aEJhbGFuY2UiLCJlbm91Z2hXZXRoIiwiZ2V0QWRkcmVzcyIsInRoZW4iLCJiYWxhbmNlT2YiLCJiYWxhbmNlIiwiZ2V0QmFsYW5jZSIsImd0ZSIsInRvdGFsQmFsYW5jZSIsImFkZCIsImx0IiwiZXRoVG9XcmFwIiwic3ViIiwibXVsIiwidG9TdHJpbmciLCJoYW5kbGVSZWNlaXB0Iiwic3RhdHVzIiwid2ViM1N0YXR1c0hhbmRsZXIiLCJ0cmFjayIsImRldGFpbHMiLCJmZXRjaCIsIm1ldGhvZCIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInJlc3BvbnNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBRUEsSUFBTUEsT0FBTyxHQUFHO0FBQ2ZDLEVBQUFBLFNBQVMsRUFBRSxtQkFBQ0MsS0FBRCxFQUFXO0FBQ3JCLFdBQU8sSUFBSUMsT0FBSixDQUFZLFVB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REg7QUFFUCxrQ0FBZ0I7QUFGVCxpQkFGbUM7QUFNNUNDLGdCQUFBQSxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQUNULGtCQUFBQSxNQUFNLEVBQU5BLE1BQUQ7QUFBU0csa0JBQUFBLE9BQU8sRUFBUEE7QUFBVCxpQkFBZjtBQU5zQyxlQUFwQixDQUR0Qjs7QUFBQTtBQUNBTyxjQUFBQSxRQURBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFuRlUsQ0FBaEI7ZUErRmVoRSxPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXRoZXJzIH0gZnJvbSAnZXRoZXJzJztcblxuaW1wb3J0IGVyYzIwQWJpIGZyb20gJy4uLy4uL2FiaS9lcmMyMC5qc29uJztcbmltcG9ydCB3ZXRoQWJpIGZyb20gJy4uLy4uL2FiaS93ZXRoLmpzb24nO1xuXG5jb25zdCB1dGlsaXR5ID0ge1xuXHRwcm9taXNpZnk6IChpbm5lcikgPT4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRpbm5lcigoZXJyLCByZXMpID0+IHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlc29sdmUocmVzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdHdhaXRGb3JSZWNlaXB0OiAoaGFzaCwgY2IpID0+IHtcblx0XHR3ZWIzLmV0aC5nZXRUcmFuc2FjdGlvblJlY2VpcHQoaGFzaCwgZnVuY3Rpb24oZXJyLCByZWNlaXB0KSB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdFcnJvcicpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHJlY2VpcHQgIT09IG51bGwpIHtcblx0XHRcdFx0Ly8gVHJhbnNhY3Rpb24gd2VudCB0aHJvdWdoXG5cdFx0XHRcdGlmIChjYikge1xuXHRcdFx0XHRcdGNiKHJlY2VpcHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBUcnkgYWdhaW4gaW4gMSBzZWNvbmRcblx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dXRpbGl0eS53YWl0Rm9yUmVjZWlwdChoYXNoLCBjYik7XG5cdFx0XHRcdH0sIDIwMDApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRnZXRUb2tlbkNvbnRyYWN0OiAodHJhZGUsIHNpZ25lcikgPT4ge1xuXHRcdGNvbnN0IHRva2VuQWRkcmVzcyA9IHRyYWRlLm1ldGFkYXRhLmlucHV0LmFkZHJlc3M7XG5cdFx0cmV0dXJuIG5ldyBldGhlcnMuQ29udHJhY3QodG9rZW5BZGRyZXNzLCBlcmMyMEFiaSwgc2lnbmVyKTtcblx0fSxcblx0Z2V0V2V0aENvbnRyYWN0OiAoc2lnbmVyKSA9PiB7XG5cdFx0Y29uc3Qgd2V0aFRva2VuQWRkcmVzcyA9ICcweGMwMmFhYTM5YjIyM2ZlOGQwYTBlNWM0ZjI3ZWFkOTA4M2M3NTZjYzInO1xuXHRcdHJldHVybiBuZXcgZXRoZXJzLkNvbnRyYWN0KHdldGhUb2tlbkFkZHJlc3MsIHdldGhBYmksIHNpZ25lcik7XG5cdH0sXG5cdGdldEV0aGVyVG9XcmFwKHRyYWRlLCBwcm92aWRlciwgc2lnbmVyKSB7XG5cdFx0Y29uc3Qgd2V0aFRva2VuQWRkcmVzcyA9ICcweGMwMmFhYTM5YjIyM2ZlOGQwYTBlNWM0ZjI3ZWFkOTA4M2M3NTZjYzInO1xuXHRcdGlmICghdHJhZGUubWV0YWRhdGEuaW5wdXQpIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblx0XHRpZiAodHJhZGUubWV0YWRhdGEuaW5wdXQuYWRkcmVzcyAhPSB3ZXRoVG9rZW5BZGRyZXNzKSB7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cdFx0Y29uc3Qgd2V0aEFtb3VudCA9IHRyYWRlLm1ldGFkYXRhLmlucHV0LmFtb3VudDtcblx0XHRjb25zdCB3ZXRoQ29udHJhY3QgPSBuZXcgZXRoZXJzLkNvbnRyYWN0KHdldGhUb2tlbkFkZHJlc3MsIGVyYzIwQWJpLCBzaWduZXIpO1xuXHRcdGxldCBhY2NvdW50QWRkcmVzcztcblx0XHRsZXQgd2V0aEJhbGFuY2U7XG5cdFx0Y29uc3QgZW5vdWdoV2V0aCA9IHNpZ25lci5nZXRBZGRyZXNzKClcblx0XHRcdC50aGVuKGFkZHJlc3MgPT4ge1xuXHRcdFx0XHRhY2NvdW50QWRkcmVzcyA9IGFkZHJlc3M7XG5cdFx0XHRcdHJldHVybiB3ZXRoQ29udHJhY3QuYmFsYW5jZU9mKGFjY291bnRBZGRyZXNzKTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihiYWxhbmNlID0+IHtcblx0XHRcdFx0d2V0aEJhbGFuY2UgPSBiYWxhbmNlO1xuXHRcdFx0XHRyZXR1cm4gcHJvdmlkZXIuZ2V0QmFsYW5jZShhY2NvdW50QWRkcmVzcyk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oYmFsYW5jZSA9PiB7XG5cdFx0XHRcdGlmICh3ZXRoQmFsYW5jZS5ndGUod2V0aEFtb3VudCkpIHtcblx0XHRcdFx0XHQvLyBFbm91Z2ggd2V0aCwgbm8gbmVlZCB0byB3cmFwXG5cdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3QgdG90YWxCYWxhbmNlID0gYmFsYW5jZS5hZGQod2V0aEJhbGFuY2UpO1xuXHRcdFx0XHRpZiAodG90YWxCYWxhbmNlLmx0KHdldGhBbW91bnQpKSB7XG5cdFx0XHRcdFx0Ly8gSW5zdWZmaWNpZW50IGJhbGFuY2Vcblx0XHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gZXRoIHRvIHdyYXAgPSB3ZXRoIHJlcXVpcmVkIGZvciB0cmFkZSAtIHdldGggYmFsYW5jZVxuXHRcdFx0XHRjb25zdCBldGhUb1dyYXAgPSB3ZXRoQmFsYW5jZS5zdWIod2V0aEFtb3VudCkubXVsKC0xKTtcblx0XHRcdFx0cmV0dXJuIGV0aFRvV3JhcC50b1N0cmluZygpO1xuXHRcdFx0fSk7XG5cdFx0cmV0dXJuIGVub3VnaFdldGg7XG5cdH0sXG5cdGhhbmRsZVJlY2VpcHQ6IChzdGF0dXMsIHJlY2VpcHQpPT4ge1xuXHRcdGlmKHJlY2VpcHQuc3RhdHVzPT0nMHgxJyl7XG5cdFx0XHR3aW5kb3cud2ViM1N0YXR1c0hhbmRsZXIoJ21pbmVkX3RyYWRlJywgc3RhdHVzLmhhc2gpO1xuXHRcdH1lbHNle1xuXHRcdFx0d2luZG93LndlYjNTdGF0dXNIYW5kbGVyKCdmYWlsZWQnLCBzdGF0dXMuaGFzaCk7XG5cdFx0fVxuXHR9LFxuXHR0cmFjazogYXN5bmMoc3RhdHVzLCBkZXRhaWxzKT0+e1xuXHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9hcGkvc2VuZF90cmFkZScsIHtcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdCAgICBoZWFkZXJzOiB7XG5cdFx0ICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcblx0XHQgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG5cdFx0ICAgIH0sXG5cdFx0ICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtzdGF0dXMsIGRldGFpbHN9KVxuXHRcdH0pO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB1dGlsaXR5O1xuIl19