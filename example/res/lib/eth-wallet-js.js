'use strict';

window.eth_wallet_js = {};
var log = console.log;

(function(ewj){
    
    // 初始化web3连接节点 默认使用 infura
    var web3 = new Web3( new Web3.providers.HttpProvider('https://mainnet.infura.io/') );    
    ewj.use_provider = function(x){
        web3 = new Web3( new Web3.providers.HttpProvider(x) );
        ewj.web3 = web3;
    }

    // 将web3对象挂载到ewj下
    ewj.web3 = web3;
    
    // 以太坊当前gas费价格
    ewj.gas_price = '';
    ewj.gas_price_gwei = ''
    function update_gas_price(){
        web3.eth.getGasPrice()
        .then(function(x){ 
            ewj.gas_price = x;
            var gweistr = web3.utils.fromWei(x,'gwei') ;
            if( gweistr.lastIndexOf('.') > 0 ){
                gweistr = gweistr.substring(0,gweistr.lastIndexOf('.') );
            }
            ewj.gas_price_gwei = gweistr;
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
            hdPathString: "m/44'/60'/0'/0" //"m/44'/60'/0'/0/0"
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
     * 参数1: file_name: 文件名(可选)，默认值：ethkeystore+当前毫秒级时间戳
     * 参数2: data: json-string格式的keystore内容
     */
    ewj.download_keystore_file =function(conf){
        
        var def_conf = {
            file_name: 'ethkeystore'+new Date().getTime().toString()
        };
        for(var prop in conf){
            if( !conf.hasOwnProperty(prop) ){ continue; }  // 跳过原型链上继承过来的属性
            def_conf[prop] = conf[prop]; 
        }
        conf = def_conf;
                
        var alink = document.createElement('a'); 
        alink.style.display = 'none';
        alink.download = conf.file_name;

        var blob = new Blob([conf.data]); 
        alink.href = URL.createObjectURL(blob);
        document.body.appendChild(alink);
        alink.click();
        setTimeout(function(){ document.body.removeChild(alink); },1000); 
    }
    
    /*
    *   导入钱包
    *   返回值:地址和私钥
    *   参数1：导入类型 mnemonic, privatekey, keystore
    *   参数2: 具体类型的数据 私钥前缀有无0x均可 {keystore,password}
    *   参数3: 回调函数 用于返回地址和私钥 cb({address:'0xaa',privatekey:'0xaa'})
    */   
    ewj.get_address_privatekey = function(import_type,data,cb){
        if(import_type=='mnemonic'){
            keystore.createVault(
                {
                    password:'',
                    seedPhrase:data,
                    hdPathString: "m/44'/60'/0'/0" //"m/44'/60'/0'/0/0"
                },
                function(err,ks){
                    if (err) throw err;
                    ks.keyFromPassword('', function (err, pwDerivedKey) {
                        if (err) throw err;
                        ks.generateNewAddress(pwDerivedKey, 1);
                        var address = ks.getAddresses()[0];
                        var privatekey = ks.exportPrivateKey(address, pwDerivedKey)
                        cb({ address:address, privatekey:'0x'+privatekey })
                    });
                }
            )
        }
        if(import_type=='privatekey'){
            if( data.indexOf("0x") < 0 ){ data = "0x"+data; }
            var account = web3.eth.accounts.privateKeyToAccount(data);
            cb({ address:account.address, privatekey:data })
        }
        if(import_type=='keystore'){
            var ks = keystore.deserialize(data.keystore);
            ks.keyFromPassword(data.password, function(err,pwDerivedKey){
                var res = {};
                if (err) { res.err = err; };
                var address = ks.getAddresses()[0];
                try {
                    var privatekey = ks.exportPrivateKey(address, pwDerivedKey)
                } catch(e){ 
                    res.err = e; 
                }
                if(!res.err){ res = { address:address, privatekey:'0x'+privatekey }; }
                cb(res);
            })
        }
    }

    /*
    *   得到web3上的以太坊账户 用于签名交易等
    *  参数1: 导入类型 mnemonic, privatekey, keystore, get_address_privatekey返回的地址和私钥对
    *  返回值:eth account
    */
    ewj.get_eth_account = function(import_type,data,cb){
        if(import_type=='mnemonic'){
            ewj.get_address_privatekey('mnemonic',data,function(res){
                var account = web3.eth.accounts.privateKeyToAccount(res.privatekey);
                cb(account);
            });
        }
        if(import_type=='privatekey'){
            if( data.indexOf("0x") < 0 ){ data = "0x"+data; }
            var account = web3.eth.accounts.privateKeyToAccount(data);
            cb(account);
        }
        if(import_type=='keystore'){
            ewj.get_address_privatekey(
                'keystore',
                {
                    password:data.password,
                    keystore:data.keystore
                },
                function(res){
                    var account = web3.eth.accounts.privateKeyToAccount(res.privatekey);
                    cb(account);
                }
            );
        }
    }

    /**
     * 得到指定账户地址指定代币的余额
     * 传入参数对象: 
     *   address:  账户以太坊地址
     *   contract: 合约对象 (可不传，默认查以太坊余额 通过调用ewj.get_contract得到合约对象)
     * 返回对象：
     * {
     *   gwei:xx,
     *   wei: xx,
     *   ether:xx,
     *   token:xx //如果传入第二个参数的话，则这个字段返回代币余额
     * }
     */
    ewj.get_balance = function(obj,cb){
        web3.eth.getBalance(obj.address)
        .then(function(res){
            var gweistr = web3.utils.fromWei(res,'gwei') ;
            if( gweistr.lastIndexOf('.') > 0 ){
                gweistr = gweistr.substring(0,gweistr.lastIndexOf('.') );
            }
            var etherstr = web3.utils.fromWei(res,'ether')
            var r = {
                gwei:gweistr,
                wei:res,
                ether:etherstr
            };
            if(obj.contract){
                obj.contract.methods.balanceOf(obj.address).call({},function(err,result){
                    if(err) { log(err);  }
                    if(!err){ 
                        r.token = web3.utils.fromWei(result)
                        cb(r); 
                    }
                })                
            }else{
                cb(r);
            }
        })
    }

    /**
     * 发送以太坊
     * 参数1: to: 发送以太坊的目标地址
     * 参数2: val:发送以太坊的单位数量
     * 参数3: privatekey: 账户私钥，用于签名交易 前缀带0x或者不带0x均可
     * 参数4: val_type:发送以太坊的单位 默认值wei,可选值:gwei,ether,wei 
     * 参数5: gas_price: 单位gas价格 n数量的wei 默认值当前以太坊网络的gas价格的中位数+5gwei，推荐使用默认值,不传入该参数
     * 参数6: gas: gas最大限制数量，默认值11w,推荐使用默认值，不必传参，稳妥，略过量防止失败，交易用不完的gas会自动退回
     * 返回: txhash 交易哈希号，用于追踪交易
     */
    ewj.send_eth = function(obj,cb){
        var privatekey = obj.privatekey;
        if( privatekey.indexOf("0x") < 0 ){ privatekey = "0x"+privatekey; }
        
        var send_eth_num = obj.val;
        if(obj.val_type){
            if(obj.val_type=='ether'){
                send_eth_num = web3.utils.toWei(send_eth_num,'ether'); 
            }
            if(obj.val_type =='gwei'){
                send_eth_num = web3.utils.toWei(send_eth_num,'gwei'); 
            }
        }
        
        var gas_price = ewj.gas_price;
        if(obj.gas_price){
            gas_price = obj.gas_price;
        }
        else{
            gas_price = ( parseInt( web3.utils.fromWei(gas_price,'gwei') ) + 5 ).toString();
            gas_price = web3.utils.toWei(gas_price,'gwei');
        }

        var gas = 110000;
        if(obj.gas){ gas = parseInt(obj.gas); }

        var tx ={
            to:obj.to,
            value: send_eth_num,
            gas:gas,
            gasPrice:gas_price
        };
        web3.eth.accounts.signTransaction(tx, privatekey )
        .then(function(res){
            web3.eth.sendSignedTransaction(res.rawTransaction)
            .on('transactionHash', function(txhash){
                // log('transactionHash',txhash)
                cb({ txhash:txhash });
            })
            .on('error',function(err,rece){ if(!rece){ var rece={}; }
                log('err',err)
                cb({ err:err, rece:rece, txhash:rece.transactionHash });
            })
            // .on('receipt',function(rece){
            //     log('receipt',rece)
            // })
            // .on('confirmation', function(confNumber, rece){
            //     log('confirmation',confNumber,rece)
            // })
        })
    }

    /** 得到合约对象
     * 参数1：合约地址
     * 返回值: 合约对象 
     */
    ewj.get_contract = function(address,cb){        
        var url = 'https://api.etherscan.io/api?module=contract&action=getabi&address='+address;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();

        xhr.onreadystatechange = function(){
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                var res = JSON.parse(xhr.responseText);
                var contract_json = JSON.parse(res.result)
                var contract = new web3.eth.Contract(contract_json,address);
                cb(contract);
            }
        }; 
    }

    /** 发送代币
     * 参数1: to: 发送合约的目标地址
     * 参数2: val:发送以太坊的单位数量
     * 参数3: privatekey: 账户私钥，用于签名交易 前缀带0x或者不带0x均可
     * 参数4: contract合约对象 要发送的token属于的contract
     * 参数5: gas_price: 单位gas价格 n数量的wei 默认值当前以太坊网络的gas价格的中位数+5gwei，推荐使用默认值,不传入该参数
     * 参数6: gas: gas最大限制数量，默认值11w,推荐使用默认值，不必传参，稳妥，略过量防止失败，交易用不完的gas会自动退回
     */
    ewj.send_token = function(obj,cb){
        var send_num = obj.val;
        send_num = web3.utils.toWei(send_num);
        var contract = obj.contract;
        var encode_abi = contract.methods.transfer(obj.to,send_num).encodeABI();

        var gas = 110000;
        if(obj.gas){ gas = parseInt(obj.gas); }
        
        var gas_price = ewj.gas_price;
        if(obj.gas_price){
            gas_price = obj.gas_price;
        }
        else{
            gas_price = ( parseInt( web3.utils.fromWei(gas_price,'gwei') ) + 5 ).toString();
            gas_price = web3.utils.toWei(gas_price,'gwei');
        }

        var tx ={
            to:contract.options.address,  // 代币转账发送到合约地址
            gas:gas,
            gasPrice:gas_price,
            data: encode_abi // 发送到合约地址处理的数据
        };

        var privatekey = obj.privatekey;

        web3.eth.accounts.signTransaction(tx, privatekey )
        .then(function(res){
            web3.eth.sendSignedTransaction(res.rawTransaction)
            .on('transactionHash', function(txhash){
                cb({ txhash:txhash });
            })
            .on('error',function(err,rece){ if(!rece){ var rece={}; }
                cb({ err:err, rece:rece, txhash:rece.transactionHash });
            })
        });
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
        setTimeout(update_self,26000);
        update_gas_price();
        log(ewj.gas_price);
    }
    setTimeout(update_self,1000);

})(window.eth_wallet_js);
