import express from 'express'
import {body, validationResult} from 'express-validator'
import { guest } from './data.js'
import fs from 'fs'

const app = express()
const PORT = 1989

app.set('view engine', 'ejs')

app.use(express.static('./public'))
app.use(express.urlencoded({extended: true}))

let objbackup = {} 

fs.readFile("./backup.json",(err,data) =>{
    if(err) console.log(err)

    objbackup = JSON.parse(data)
})

app.get('/', (_, res)=>{

    res.render('index',{objbackup, error:null})
})

app.post('/insert',

    body('name').isLength({min:3, max:20})
                .withMessage('Der Name muss min. 3 zeichen und max. 20 zeichen lang sein'),
    body('lastname').isLength({min:3, max:20})
                .withMessage('Der Nachname muss min. 3 zeichen und max. 20 zeichen lang sein'),
    body('email').isEmail()
                .withMessage('bitte eine richtige email eingeben'),
    body('entry').isLength({min:5, max:40})
                .withMessage('etwas mehr text wäre wünschenswert'),
    (req, res) => {

        const errors = validationResult(req)

        if(!errors.isEmpty()){
            console.log(errors)
            return res.render('index', {objbackup, error:errors})
        }
/*      // Das gehört zu Guestbook A
        guest.push({
            name:req.body.name,
            lastname:req.body.lastname,
            email:req.body.email,
            entry:req.body.entry
        }) */


    // Das gehört zu Guestbook B

        /* let objbackup = {}
        fs.readFile("./backup.json",(err,data) =>{
            if(err) console.log(err)

            objbackup = JSON.parse(data) */

            objbackup.push({name:req.body.name,
                lastname:req.body.lastname,
                email:req.body.email,
                entry:req.body.entry})

            let tojson = JSON.stringify(objbackup)

            fs.writeFile('./backup.json',tojson,(err)=>{
                if(err) console.log(err)
            })

            res.render('index', {objbackup, error:null})

        /* }) */

        // Guestbook B Ende


        //res.render('index', {objbackup, error:null})
})

app.listen(PORT, console.log('Das Gästebuch existiert seit ', PORT, '(siehe design :D)'))