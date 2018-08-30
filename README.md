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