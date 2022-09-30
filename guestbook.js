import express from 'express'
import {body, validationResult} from 'express-validator'
import { guest } from './data.js'

const app = express()
const PORT = 1989

app.set('view engine', 'ejs')

app.use(express.static('./public'))
app.use(express.urlencoded({extended: true}))

app.get('/', (_, res)=>{
    res.render('index',{guest, error:null})
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
            return res.render('index', {guest, error:errors})
        }

        guest.push({
            name:req.body.name,
            lastname:req.body.lastname,
            email:req.body.email,
            entry:req.body.entry
        })

        res.render('index', {guest, error:null})
})

app.listen(PORT, console.log('Das Gästebuch existiert seit ', PORT, '(siehe design :D)'))