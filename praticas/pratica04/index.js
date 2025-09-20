const express = require("express");

const tarefas = [
    {id: 1, nome: "Estudar middleware", concluida: false},
    {id: 2, nome: "Praticar Express", concluida:true}
];

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false }));

app.use((req, res, next) => {
    const timestamp = new Date().toLocalString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

const router = express.Router();
app.use('/tarefas', router);

router.get('/', (req, res) => {
    res.send(tarefas);
});

router.post('/', (req, res) => {
    console.log(req.body);
    const novaTarefa = {
        id: tarefas.length + 1,
        ...req.body
    };
    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
});

router.put('/:tarefaId', (req, res) => {
    const { tarefaId } = req.params;
    const tarefa = tarefas.find(t => t.id === parseInt(tarefaId));
    
    if (!tarefa) {
        return next(new Error('Tarefa não localizada'));
    };

    tarefa.nome = req.body.nome || tarefa.nome;
    tarefa.concluida = req.body.concluida == undefined ? req.body.concluida : tarefa.concluida;

    res.json(tarefa);
});

router.delete('/:tarefaId', (req, res) => {
    const { tarefaId } = req.params;
    const tarefaIndex = tarefas.findIndex(t => t.id === parseInt(tarefaId));

    if (tarefaIndex === -1) {
        return next(new Error ('Tarefa não localizada'));
    }

    tarefas.splice(tarefaIndex, 1);
    res.status(204).end();
});

app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message });
});

app.listen(3000, () => {
    console.log("App está on!");
});

module.exports = app;