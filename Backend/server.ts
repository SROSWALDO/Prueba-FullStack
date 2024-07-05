import express from 'express';
import cors from 'cors';
import multer from 'multer'
import csvToJson from 'convert-csv-to-json';

const app = express();
const port = process.env.PORT ?? 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

let userData:Array<Record<string, string>>  = []

app.use(cors())

app.post('/api/files',upload.single('file') , async (req, res) => {
    // 1. Extract file from request
    const { file } = req
    // 2. Validate that we have file
    if (!file) {
        return res.status(500).json({message: 'El archivo no se cargo correctamente' })
    }
    // 3. Validate the mimetype (csv)
    if (file.mimetype !== 'text/csv' ){
        return res.status(500).json({message: 'El archivo no se cargo correctamente' })
    }
    // 4. Transform file  to string
    let json:Array<Record<string, string>>  = []
    try {
       const csv = Buffer.from(file.buffer).toString('utf-8')
       // 5. Transform csv to json 
        json = csvToJson.csvStringToJson(csv)
        
    } catch (error) {
        return res.status(500).json({message: 'El archivo no se cargo correctamente' })
    }
    // 6. Save the JSON to db 
    userData = json
    // 7. Return 200 with the message ande the JSON
    return res.status(200).json({ data: json, message: 'El archivo se cargo correctamente' })

});

app.get('/api/users', async (req, res) => {
    // 1. Extract the query param q from the request
    const { q } = req.query
    // 2. Validate that we have the query param
    if (!q) {
        return res.status(500).json({
            message: 'El archivo no se cargo correctamente'
        })
    }

    if (Array.isArray(q)) {
        return res.status(500).json({
            message: 'Query param q must be a string'
        })
    }
    // 3. Filter the data from the db with the query param
    const search = q.toString().toLowerCase();

    const filterData = userData.filter(row => {
        return Object.values(row).some(value => value.toLowerCase().includes(search) )
    })
    // 4. Return 200 with the filetered data
    return res.status(200).json({ data: filterData})

})

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
    
} )