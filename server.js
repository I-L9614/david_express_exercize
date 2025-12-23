import express from 'express';
import fs from 'fs/promises';

const app = express()
const PORT = 3000
app.use(express.json())

app.get('/users', async(req,res) => {
    let users = await fs.readFile('users.json','utf8')
    users = JSON.parse(users)
    res.json(users)
})

app.get('/users/search', async(req,res) => {
    let users = await fs.readFile('users.json','utf8')
    users = JSON.parse(users)
    const {city} = req.query
    const user = users.filter(user => user.city===city)
    if (!user) {
        return res.status(404).json({message:"User not found"})
    }
    res.send(user)
})

app.get('/users/:id', async(req,res) => {
    let users = await fs.readFile('users.json','utf8')
    users = JSON.parse(users)
    const {id} = req.params
    const intId = parseInt(id)
    const user = users.find(user => user.id===intId)
    if (!user) {
        return res.status(404).json({message:"User not found"})
    }
    res.send(user)
})

app.post('/users', async(req,res) => {
    let users = await fs.readFile('users.json','utf8')
    users = JSON.parse(users)
    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0
    const newUser = {
        id:maxId + 1,
        ...req.body
    }
    users.push(newUser)
    await fs.writeFile('users.json',JSON.stringify(users,null,2))
    res.send(newUser)

})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});