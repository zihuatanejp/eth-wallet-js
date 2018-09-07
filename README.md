# eth-wallet-js
A library for ethereumjs wallet ,  
import&amp;&amp;export wallet (support 3 ways: mnemonic , keystore,privatekey) ,   
send ether&amp;&amp;dapp tokens,etc..  

是一个以太坊轻钱包api,用于创建以太坊网络上的账户（地址/私钥对）,及导出和导入钱包，  
以及创建以太坊网络上的交易(以太坊转账和代币转账)  
以及查看账户信息(账户以太坊余额和代币余额等)  
以及交易追踪

### Email: skylake0010@hotmail.com

### Usage(how to use?)
----
首先引入dist/下的js文件到html中
```
<script type="text/javascript" src="your-path/dist/lightwallet.min.js" ></script>
<script src="your-path/dist/web3.min.js"></script>
<script src="your-path/dist/eth-wallet-js.js"></script>
```
查看示例:
```
> git clone https://github.com/zihuatanejp/eth-wallet-js.git
> cd eth-wallet-js
> npm install
> npm run example
```
// 然后在浏览器中打开 [http://127.0.0.1:8511/](http://127.0.0.1:8511/)

### Example
----
生成钱包(得到 `助记词`,`地址`，`私钥`，`keystore文件内容`)：
```javascript
eth_wallet_js.gen_wallet('123456789',function(w){
    console.log(w);
});
/*
{
    mnemonic:"segment grow next kit master vintage settle kiwi any erode describe other",

    address:"0x04123f13f9ee72e2b6f8085a6e9043962f254d66",

    privatekey:"0x61c593397e30cd0af70f203498ce7a0ac945d6649eb3a3cef5409222d02c3c3a",

    keystore:"{
        "encSeed":{
                "encStr":"z7oWY2YSb1ECuH+kq4FqBxkBHYo6RZBhxeYsdK4hIbSBaYeMRYo6dP8lYczi3LDUhJQo6whHXtSXBsBvN9LG1OYQFPKL9ivuSOZfmV5UYh3XM98zt9GF38tIIULGVvCRjvCPQQ7/hvrbsjwEduzhPMKvgNjLPRz/Gk8qL9DNw4ONIt/YJ0y9Rg==",
                "nonce":"s1fdommvmdWJqyS/MDk8eKFmUvC8zPbo"
            },
        "encHdRootPriv":{
            "encStr":"MKopfr7Aju3pofNKDSG5Qt01URDzmX/rXxp3wxafZnEDG4WANDY9gy5puVQPCcJZiAWY3NQmcMDX8IL8miNonfAsz2LGAwitkfIBjvDYB5kT7/V+4XFBKB5xUJLWIw5Eh40LKP4nKmLjqFWIxnajAVCfUwS2Qhdf/FqftovOUA==",
            "nonce":"2Ob+1sGd5OiaBbFDHJEf6rX0m/yM+Kkc"
        },
        "addresses":["63fda39d898c98b0124d3edbcac39fd39ea08f63"],
        "encPrivKeys":{
            "63fda39d898c98b0124d3edbcac39fd39ea08f63":{
                "key":"f3m7TU/7WhKvJ6JNJQwRQmjqPeqaXEDQebNCET+Doph4vYHbWh7re2lNn0wJaiF7",
                "nonce":"2jRgnD3MmqdD96GeVr5D8avHyehB5tds"
            }
        },
        "hdPathString":"m/44'/60'/0'/0/0",
        "salt":"if7NAc46pR7IkJeKuNzBJCGGWJRDEGoSPEiJWzkMcRQ=",
        "hdIndex":1,
        "version":3
    }"
}
*/

```

导入钱包（支持三种方式：‘助记词’，‘私钥’，‘keystore内容和密码’）
回调函数返回一对 { 账户地址,私钥  }组成的对象
```javascript

/** 返回res格式如下所示
 {
    address: "0xca83d7ff4bb20f5e25c101a0c6ab515469d2fcba", 
    privatekey: "0x4f3c86b1d4e4f471cb1c0b05d4402ff793d374bbe3c0855d27b0e9b0a3624218"
 }
*/
var ewj = eth_wallet_js;
//助记词导入
ewj.get_address_privatekey(
    'mnemonic',
    'pulp misery inmate wheat hero absent modify sock carry record top movie',
    function(res){ log(res); }
);
//私钥导入
ewj.get_address_privatekey(
    'privatekey',
    '5eb43a8c0ae8d7b105085c7d81abcffc16802106296318ac69b7670b9d4124bb',
    function(res){ log(res); }
);
//keystore导入 如果keystore生成时没有设置密码将password值传为''
ewj.get_address_privatekey(
    'keystore',
    {
        password:'123456789',
        keystore:`{"encSeed":{"encStr":"kBkCtUiDBmtTBLYqjJ/oggt0QmLl7dwi9e14scBX9z2CCBGfKoKwVoQn04prZSbkyzBVrMmt3ibdbk228aD54Lx1utJVDTjZwfaqlU8v/8uysgQCCm0b+/9jeFMbsNyJA2nuvRIFqtubE+1xQszn7zuSbY6598my05QNzCec0C/o0sliT0LGtA==","nonce":"NKDC1uxeJjwn3fEdvLjrA3AI3Aumuz7T"},"encHdRootPriv":{"encStr":"QeTjkJJTleeZNvb43aKgQXxI51NG9Yl92iYX6wbgx5QcvpVnBrbh5Gow+NPDbFkZQqrgFnBE0GpbeFbqM/8qaSXJfUqQOmT3olZL2JZ9vJgw+85SdMxaTWZB5Vmwz7zlyD5g8kVdF3lzsnQ4ddyKiXljLzSPHV9LKJ9OXXJ5DA==","nonce":"4ZG0q0o8p4Ym7GZxpOmfOPUcks5jeWn7"},"addresses":["ca83d7ff4bb20f5e25c101a0c6ab515469d2fcba"],"encPrivKeys":{"ca83d7ff4bb20f5e25c101a0c6ab515469d2fcba":{"key":"0EnU9wD+Veo0kKAKZceXsj4STOAOjOg0T/BxT2u6DCTO4nXpI4iuWZ6I13dGTaVy","nonce":"sA8MaIfMviiNuZYToTc3t/CJFdq0TJVs"}},"hdPathString":"m/44'/60'/0'/0/0","salt":"kVKX/fOAHtvfCVL5Rz8HaEA4recKAwGDt6cmpCGJoUs=","hdIndex":1,"version":3}`
    },
    function(res){ log(res); }
);

```

以太坊网络当前的gas价格 默认是wei,你可以在需要的任何时候访问这个属性：
```
eth_wallet_js.gas_price // '3500000000'  
```

下载keystore文件到本地 （在浏览器端创建一个下载任务）
```javascript
eth_wallet_js.download_keystore_file(
    {
        file_name:`xxx`, // 该字段可选，默认值：ethkeystore+当前毫秒级时间戳，推荐不传它，但也可以指定
        data:`xxxx`// keystore的json-字符串 keystore文件内容
    }
)
```

得到web3的account对象，import_type:'mnemonic||privatekey||keystore' 参数同导入账户。  
eth_wallet_js.get_eth_account((import_type,data,function(account){})

得到指定账户地址指定代币的余额
```javascript
eth_wallet_js.get_balance(
    { 
        address:'xxx',
        contract:{} // 该字段可选，合约对象 (可不传，默认查以太坊余额 通过调用get_contract得到合约对象)
    },
    function(res){/*  返回res 对象类似如下
        {
        gwei:xx,
        wei: xx,
        ether:xx,
        token:xx //如果传入第二个参数的话，则这个字段返回代币余额
        } */
    }
);
```

### 发送以太坊
var ewj = eth_wallet_js  
ewj.send_eth( obj, cb )  
传入参数obj如下:
```
{  
    to: 发送以太坊的目标地址  
    val:发送以太坊的单位数量  
    privatekey: 账户私钥，用于签名交易 前缀带0x或者不带0x均可  
    val_type:发送以太坊的单位 默认值wei,可选值:gwei,ether,wei   
    gas_price: 单位gas价格 n数量的wei 默认值当前以太坊网络的gas价格的中位数+5gwei，推荐使用默认值,不传入该参数  
    gas: gas最大限制数量，默认值11w,推荐使用默认值，不必传参，稳妥，略过量防止失败，交易用不完的gas会自动退回   
}  
```
回调函数返回对象:
`{txhash 交易哈希号，用于追踪交易 }`  
如果遇到错误则返回  
`{ err:err, rece:rece, txhash:xxxx }`  

### 发送代币
1.得到合约对象 
```
ewj.get_contract(adress,cb)  
```
传入参数address :合约地址
cb(callback/回调函数)  
function(contract){ }  
返回 web3-contract对象

2.发送合约代币
```
ewj.send_token( obj,cb )
```
传入参数obj如下：
```  
{  
   to: 发送合约的目标地址  
   val:发送以太坊的单位数量  
   privatekey: 账户私钥，用于签名交易 前缀带0x或者不带0x均可  
   contract合约对象 要发送的token属于的contract  
   gas_price: 单位gas价格 n数量的wei 默认值当前以太坊网络的gas价格的中位数+5gwei，推荐使用默认值,不传入该参数  
   gas: gas最大限制数量，默认值11w,推荐使用默认值，不必传参，稳妥，略过量防止失败，交易用不完的gas会自动退回  
}  
```
返回：回调函数返回对象
`{txhash 交易哈希号，用于追踪交易 }`  
如果遇到错误则返回  
`{ err:err, rece:rece, txhash:xxxx }`  

 
 
 
 
 
 