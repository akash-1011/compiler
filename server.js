const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const server = http.createServer(app);
const fs = require("fs");

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const { generateFile } = require("./generateFile.js");
const { executeCpp } = require("./executeCpp.js");
const { executePy } = require("./executePy.js");
const { executeJava } = require("./executeJava.js");
const { executeJs } = require("./executeJs.js");
app.get("/",(req,res)=>{
    return res.send("world");
});

app.post("/run", async (req,res)=>{

    const {language="cpp",code} = req.body;
    if(code === undefined){
        return res.status(400).json({success:false,error:"Empty code!"})
    }
    let output;
    try {
        const filepath = await generateFile(language,code);
        if(language == 'cpp') {
            output = await executeCpp(filepath);
        } else if(language == 'py') {
            output = await executePy(filepath);
        } else if(language == 'java') {
            output = await executeJava(filepath);
        } else if(language == 'js') {
            output = await executeJs(filepath);
        }
        
        // const dirCodes = path.join(__dirname, "codes");
        // if (fs.existsSync(dirCodes)) {
        //     fs.rmSync(dirCodes, { recursive: true, force: true });
        // }

        // const dirOutput = path.join(__dirname, "output");
        // if (fs.existsSync(dirOutput)) {
        //     fs.rmSync(dirOutput, { recursive: true, force: true });
        // }

        return res.json({filepath,output});
    } catch (error) {

        // const dirCodes = path.join(__dirname, "codes");
        // if (fs.existsSync(dirCodes)) {
        //     fs.rmSync(dirCodes, { recursive: true, force: true });
        // }

        // const dirOutput = path.join(__dirname, "output");
        // if (fs.existsSync(dirOutput)) {
        //     fs.rmSync(dirOutput, { recursive: true, force: true });
        // }

        res.status(500).json({error})
    }
        
});

app.post("/delete", async (req,res) => {
    fs.unlink(req.body.filepath,(err) => {
        if(err){
            console.log(err)
            res.status(500).json({err})
        } else {
            res.send("deleted")
        }
    })
})

server.listen(9000, () => console.log('server is running on port 9000'));