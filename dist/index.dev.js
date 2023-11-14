"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __createBinding = void 0 && (void 0).__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);

  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function get() {
        return m[k];
      }
    };
  }

  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = void 0 && (void 0).__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = void 0 && (void 0).__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var crypto = __importStar(require("crypto")); // Transaction class


var Transaction =
/*#__PURE__*/
function () {
  function Transaction(amount, payer, payee) {
    _classCallCheck(this, Transaction);

    this.amount = amount;
    this.payer = payer;
    this.payee = payee;
  } // Serialise transaction as a string


  _createClass(Transaction, [{
    key: "toString",
    value: function toString() {
      return JSON.stringify(this);
    }
  }]);

  return Transaction;
}(); // Block class


var Block =
/*#__PURE__*/
function () {
  function Block(prevHash, transaction) {
    var ts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Date.now();

    _classCallCheck(this, Block);

    this.prevHash = prevHash;
    this.transaction = transaction;
    this.ts = ts; // Number only used once, used as the solution for mining

    this.numOnlyUsedOnce = Math.round(Math.random() * 999999999);
  } // Getter method to return a hash of this block


  _createClass(Block, [{
    key: "hash",
    get: function get() {
      var str = JSON.stringify(this);
      var hash = crypto.createHash('SHA256');
      hash.update(str).end();
      return hash.digest('hex');
    }
  }]);

  return Block;
}(); // Chain class


var Chain =
/*#__PURE__*/
function () {
  // Create genesis block
  function Chain() {
    _classCallCheck(this, Chain);

    this.chain = [new Block('', new Transaction(100, 'genesis', 'godwin'))];
  } // Return the last block in the chain


  _createClass(Chain, [{
    key: "mine",
    // Mine a block to confirm it as a transaction on the blockchain
    value: function mine(numOnlyUsedOnce) {
      var solution = 1;
      console.log('🐢 Mining transaction...'); // Keep looping until solution is found

      while (true) {
        var hash = crypto.createHash('MD5');
        hash.update((numOnlyUsedOnce + solution).toString()).end();
        var attempt = hash.digest('hex'); // Add more 0's to make it harder

        if (attempt.substr(0, 4) === '0000') {
          console.log("---> Solved transaction with solution: ".concat(solution, ". Block is confirmed!\n"));
          return solution;
        }

        solution += 1;
      }
    } // Add a block to the blockchain

  }, {
    key: "addBlock",
    value: function addBlock(transaction, senderPublicKey, signature) {
      console.log("🐢 Sending TurtleCoin..."); // Verify a transaction before adding it

      var verifier = crypto.createVerify('SHA256');
      verifier.update(transaction.toString());
      var isValid = verifier.verify(senderPublicKey, signature); // If it is valid, create a block, mine it and add it to the blockchain

      if (isValid) {
        console.log("🐢 Transaction is valid!");
        var newBlock = new Block(this.lastBlock.hash, transaction);
        this.mine(newBlock.numOnlyUsedOnce);
        this.chain.push(newBlock);
      }
    }
  }, {
    key: "lastBlock",
    get: function get() {
      return this.chain[this.chain.length - 1];
    }
  }]);

  return Chain;
}(); // Singleton instance as we only want 1 chain


Chain.instance = new Chain(); // Wallet class

var Wallet =
/*#__PURE__*/
function () {
  // Generate key pair when a new wallet is created
  function Wallet() {
    _classCallCheck(this, Wallet);

    var keypair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  } // Send money from users wallet to another


  _createClass(Wallet, [{
    key: "sendMoney",
    value: function sendMoney(amount, payeePublicKey) {
      var transaction = new Transaction(amount, this.publicKey, payeePublicKey);
      var sign = crypto.createSign('SHA256');
      sign.update(transaction.toString()).end();
      var signature = sign.sign(this.privateKey);
      Chain.instance.addBlock(transaction, this.publicKey, signature);
    }
  }]);

  return Wallet;
}();

var sergio = new Wallet();
var tlale = new Wallet();
var kgotso = new Wallet();
sergio.sendMoney(50, tlale.publicKey);
tlale.sendMoney(23, kgotso.publicKey);
kgotso.sendMoney(5, tlale.publicKey);
console.log(Chain.instance);