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

    /**
     * 下载keystore文件
     */
    ewj.download_keystore_file =function(conf){
        var def_conf = {};
        for(prop in conf){
            if( !conf.hasOwnProperty(prop) ){ continue; }  // 跳过原型链上继承过来的属性
            def_conf[prop] = conf[prop]; 
        }
        conf = def_conf;
    }
    
    /*
    *   导入钱包
    *   返回值:地址和私钥
    *   参数1：导入类型 mnemonic, privatekey, keystore
    *   参数2: 具体类型的数据
    */   
    ewj.get_address_privatekey = function(import_type,data){

    }

    /*
    *   得到web3上的以太坊账户 用于签名交易等
    *  参数1: 导入类型 mnemonic, privatekey, keystore, get_address_privatekey返回的地址和私钥对
    *  返回值:eth account
    */
    ewj.get_eth_account = function(import_type,data){

    }

    /**
     * 得到指定账户地址指定代币的余额
     * 传入参数对象: 
     *   address:  账户以太坊地址
     *   contract: 合约对象
     */
    ewj.get_balance = function(obj){

    }

    /**
     * 发送以太坊
     * 参数1: to: 发送以太坊的目标地址
     * 参数2: val:发送以太坊的单位数量
     * 参数3: privatekey: 账户私钥，用于签名交易 前缀带0x或者不带0x均可
     * 参数4: val_type:发送以太坊的单位 默认值wei,可选值:gwei,ether,wei 
     * 参数5: gas_price: 单位gas价格 n数量的wei 默认值当前以太坊网络的gas价格的中位数+5gwei，推荐使用默认值,不传入该参数
     * 参数6: gas: gas最大限制数量，默认值11w,推荐使用默认值，不必传参，稳妥，略过量防止失败，交易用不完的gas会自动退回
     *  
     */
    ewj.send_eth = function(obj){

    }

    /** 得到合约对象
     * 参数1：合约地址
     * 返回值: 合约对象 
     */
    ewj.get_contract = function(obj){

    }

    /** 发送代币
     * 参数1: to: 发送合约的目标地址
     * 参数2: val:发送以太坊的单位数量
     * 参数3: privatekey: 账户私钥，用于签名交易 前缀带0x或者不带0x均可
     * 参数4: 合约对象 要发送的token属于的contract
     * 参数5: val_type:发送以太坊的单位 默认值wei,可选值:gwei,ether,wei 
     * 参数6: gas_price: 单位gas价格 n数量的wei 默认值当前以太坊网络的gas价格的中位数+5gwei，推荐使用默认值,不传入该参数
     * 参数7: gas: gas最大限制数量，默认值11w,推荐使用默认值，不必传参，稳妥，略过量防止失败，交易用不完的gas会自动退回
     */
    ewj.send_token = function(obj){

    }

    /**
     * 监听指定地址，指定以太坊或代币 的余额变动，
     * 一旦发生改变时触发 回调两个值之前的值和当前值
     */
    ewj.listen_address_balance= function(addr,cb,contract){
        if(true){
            cb(prev,current)
        }
    }

    // 轮询任务
    function update_self(){
        setTimeout(update_self,2600);
        update_gas_price();
        log(ewj.gas_price);
    }
    setTimeout(update_self,100);

})(window.eth_wallet_js);
