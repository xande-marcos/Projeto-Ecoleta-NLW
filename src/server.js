//Express -> Facilita o desenvolvimento de um servidor em nodejs
const express = require("express") //Faz um pedido para  usar o express do node_modules
const server = express() //Executa a função express no server
//Configura pasta PUBLIC

// Pegar o banco de dados
const db = require("./database/db")


server.use(express.static("public"))

//Habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({extended: true}))


//Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server, //Ligou o nunjuckets ao express
    noCache: true//Salva coisas na memória para responder mais rápido
})


//Configurar caminhos da minha aplicação
//Página inicial
//Req: Requisição
//Res: Resposta
//Dirname variável global - Devolve o nome do diretório em que estamos
server.get("/",(req, res) =>{
    return res.render("index.html", {title: "Seu marketplace de coleta de resíduos"}) //sendFile and __dirname + "/views/index.html"
})

server.get("/create-point",(req, res) =>{
    //req.query: Query strings da URL
    /* console.log(req.query) */

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    /* console.log(req.body) */
    //req.body: O corpo do nosso formulário
    //Inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items,
    ]

    function afterInserData(err){
        if (err){
            console.log(err)
            return res.send("Erro no cadastro")
        }

        console.log('Cadastrado com sucesso')
        console.log(this) //This referencia a resposta do run, mas a function não pode ser arrow
        return res.render('create-point.html', {saved: true})
    }

    db.run(query, values, afterInserData)
    //Callback diz: Chame essa função de volta, enquanto outras aplicações estão acontecendo
})


server.get("/search",(req, res) =>{
    const search = req.query.search
    if (search == ""){
        //Pesquisa vazia
        return res.render("search-results.html", {total: 0})
    }
    // Pegar os dados do banco de dados
     db.all(`SELECT * FROM places WHERE city LIKE'%${search}%'`, function(err, rows){
        if (err){
            return console.log(err)
        }

        const total = rows.length
        //Mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total: total})
    }) 

    
})

server.listen(3000) //Liga o servidor e ouvi a porta 3K
//Depois de qualquer alteração é necessário reiniciar o servidor -  npm install nodemon -D (Para atualizar automaticamente)
