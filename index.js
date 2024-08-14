const express = require('express')
const dotenv = require('dotenv')
const {google} = require('googleapis')
const scopes = ['https://www.googleapis.com/calendar']

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)

const calendar = goolgle.calendar({
    version : 'v3',
    auth: oauth2Client
})

const event = {
    summary:'Nasreen Tutorial',
    location: 'Google Meet',
    description:'Demo project',
    start: {
        dateTime: '2024-08-14T19:30:00+05:30',
        timeZone: 'Asia/Karachi'
    },
    end:{
        dateTime: '2024-08-14T20:30:00+05:30',
        timeZone: 'Asia/Karachi'
    }
}

const app = express();

dotenv.config();

const port = process.env.PORT || 8000;

app.get('/', (req,res) => {
    res.send("hello world")
})


app.get('/auth' , (req,res) =>{
    const url = oauth2Client.generateAuthUrl({
        access_type:'offline',
        scope:scopes
    })
    res.redirect(url)
})

app.get('/auth/redirect', async (req,res) => {
    const {tokens} = await oauth2Client.getToken(req.query.code)
    oauth2Client.setCredentials(tokens);
    res.send('Authentication successful!!') 
})


app.get('create-event' , async(req,res) =>{
    try{
        const result = await calendar.events.insert({
            calendarId: 'primary',
            auth:oauth2Client,
            resource:event
        });
        res.send({
            status:200,
            message:'Event created'
        });

    } catch(err) {
        console.log(err)
        res.send(err)
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})