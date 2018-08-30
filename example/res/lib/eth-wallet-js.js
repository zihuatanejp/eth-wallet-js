'use strict';

window.eth_wallet_js = {};
var log = console.log;

(function(ewj){
    
    // 初始化web3连接节点 默认使用 infura
    var web3 = new Web3( new Web3.providers.HttpProvider('https://mainnet.infura.io/') );    
    ewj.use_provider = function(x){
        web3 = new Web3( new Web3.providers.HttpProvider(x) );
    }
    
    // 以太坊当前gas费价格
    ewj.gas_price = '';
    function update_gas_price(){
        web3.eth.getGasPrice()
        .then(function(x){ 
            ewj.gas_price = x;
        });
    }

    // 生成钱包
    var keystore = lightwallet.keystore;  
    var tx_utils = lightwallet.txutils; 
    
    ewj.gen_wallet= function(pwd,cb){
        var seed_phrase = keystore.generateRandomSeed();
        keystore.createVault({
            password: pwd,
            seedPhrase:seed_phrase,
            hdPathString: "m/44'/60'/0'/0/0"
        },
        function(err, ks){
            if(err){ throw err; }
            ks.keyFromPassword(pwd, function (err, pwDerivedKey) {
                if (err) throw err;
                ks.generateNewAddress(pwDerivedKey, 1);
                var addrs = ks.getAddresses();
                var jsontext = ks.serialize();
                var privatekey = ks.exportPrivateKey(addrs[0], pwDerivedKey);
                cb({
                    mnemonic:seed_phrase,       // 导出的助记词
                    address:addrs[0],           // 导出的钱包地址
                    privatekey:"0x"+privatekey, // 导出的私钥
                    keystore:jsontext           // 导出的keystore
                });
            });
        });
    }
    
    /*
    *    导入钱包
    *   返回值:地址和私钥
    *   参数1：导入类型 mnemonic, privatekey, keystore
    *   参数2: 具体类型的数据
    */   
    ewj.get_address_privatekey = function(import_type,data){

    }

    /*
    *   得到web3上的以太坊账户 用于签名交易等
    *  参数1: 导入类型 mnemonic, privatekey, keystore, get_address_privatekey返回的地址和私钥对
    */
    ewj.get_eth_account = function(import_type,data){

    }

    /**
     * 得到指定账户地址指定代币的余额
     * 传入参数对象: 
     *      address: 账户以太坊地址
     */
    ewj.get_balance = function(obj){

    }


    // 轮询任务
    function update_self(){
        setTimeout(update_self,26000);
        update_gas_price();
        log(ewj.gas_price);
    }
    setTimeout(update_self,1000);

})(window.eth_wallet_js);
