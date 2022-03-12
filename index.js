const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.json())

const redis=require('redis')

const client = redis.createClient();



app.get('/', async (req, res) => {
    res.send('Hello World!')
    await client.connect();

    client.set('name','prethiv1',function(err,resply){
        console.log(err,resply)
    })

    client.get('name',function(err,res){
        console.log(res,err)
    })

    const value = await client.get('name');
    console.log(value)
})

app.post('/submitLeave',async (req,res)=>{
    // console.log(req.body.input)
    console.log(req.body)
    res.send({
        status:"Leave Submitted Successfully"
    })

    await client.connect();

    const value = [];
    
    const v= await client.get('leaverequest')

    console.log(v)

    if(v==null){
        value.push(req.body)
        client.set('leaverequest',JSON.stringify(value),function(err,reply){
            console.log(err,reply)
        });
    }
    else{
        let t = JSON.parse(v);
        t.push(req.body);
        client.set('leaverequest',JSON.stringify(t),function(err,reply){
            console.log(err,reply)
        });
    }

    await client.quit();
    
});

app.post('/approveLeave',(req,res)=>{
    res.send({
        status:"Leave Approved Successfully"
    });
});
  

app.post('/rejectLeave',(req,res)=>{
    res.send({
        status:"Leave Rejected Successfully"
    });
});


app.get('/allLeave',async(req,res)=>{
    await client.connect();

    const value = [];
    
    const v= await client.get('leaverequest')

    console.log(v)

    res.send(v);
    await client.quit();
});


app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`)
})