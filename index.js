const express = require('express');
const app = express();
const db = require("./db.js");
const db_rel_use = require('./db_use.js');
app.use(express.json());
app.use((req, res, next) => {
    console.log(`收到請求：${req.method} ${req.url}`);
    next();
});

app.use(express.static('public'));
app.post('/api/expenses', (req, res) => {
    try{
        let {amount, text, time, type} = req.body;

        let stmt = db_rel_use.write();
        
        let result = stmt.run(amount, text, time, type);

        res.status(201).json({
            success: true,
            id: result.lastInsertRowid,
            message:"写入成功"
        });
    }catch(err){
        console.error('写入失败',err);
        res.status(500).json({
            success: false,
            message:'服务器内部错误'
        });
    }
}
);

app.get('/api/expenses',(req,res) => {
    try{
        let stmt = db_rel_use.serach();
        let rows = stmt.all();
        Data_process();
          function Data_process (){
            let process_type = rows.map(item => item.type);
            let e = 0, s = 0, a = 0, o = 0;
            for(let i=0; i < process_type.length; i++){
                if(process_type[i] === "eat"){
                    e++;
                }
                else if(process_type[i] === "shoping"){
                    s++;
                }
                else if(process_type[i] === "amusement"){
                    a++;
                }
                else{
                    o++;
                }
            }
            let type_sum = [e, s, a, o];
            let eat = type_sum[0] / (process_type.length) * 100;
            let shop = type_sum[1] / (process_type.length) * 100;
            let amu = type_sum[2] / (process_type.length) * 100;
            let other = type_sum[3] / (process_type.length) * 100;
            let pt = {
                eat : eat,
                shop : shop,
                amu : amu,
                other : other
            };
            /*  初写
            let process_type = rows.map(item => item.type);
            let type_eat = {};
            let type_shoping = {};
            let type_amu = {};
            let type_other = {};
            let change;
            for(const array_type of process_type){
                if(array_type === "eat"){
                    ({ type_eat: {type:change}} = array_type);
                }
                else if(array_type === "shoping"){
                    ({type_shoping: {type:change}} = array_type);
                }
                else if(arra_type === "amusement"){
                    ({type_amu: {type:change}} = array_type);
                }else{
                    ({type_other: {type:change}} = array_type);
                }
            }
            let eat = (type_eat.length + 1) / (process_type + 1) * 100;
            let shoping = (type_shoping.length + 1) / (process_type + 1) * 100;
            let amu = (type_amu.length + 1) / (process_type + 1) * 100;
            let other = (type_other.length + 1) / (process_type + 1) * 100;
            let ps = {
                eat : eat,
                shoping : shoping,
                amu : amu,
                other : other
            };
            */
            res.json({success:true, data: pt});
        }
}
catch(err){
        console.error('查询失败',err);
        res.status(500).json({success:false, message:'服务器错误'});
    }
});

app.delete('/api/expenses',(req,res) => {
    try{
        let s_d = db_rel_use.sd();
        res.json({succress:true,data:s_d});
    }
    catch(e){
        console.error("查询失败",e);
        res.status(500).json({success:false,message:'服务器错误'});
    }
})

app.listen(3000, () =>{
    console.log("server is running on port 3000");
});