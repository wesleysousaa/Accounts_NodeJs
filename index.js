import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'


menuOff()

function menuOff(){
    inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'O que deseja fazer ',
        choices: ['Criar conta','Entrar','Sair']
    },
    
])
    .then((answer) =>{
        const action = answer['action']
        if(action === 'Criar conta'){
            createAccount()
        }else if(action === 'Entrar'){
            sigIn()
        }else if(action === 'Sair'){
            console.log(chalk.bgBlueBright.white("Obrigado por usar nosso sistema"))
            process.exit()
        }
            
    })
    .catch(err => console.log(err))
}

function sigIn(){
    inquirer.prompt([
        {
        name: 'sigin',
        message: 'Digite o nome da sua conta'
        }
    ])
    .then((answer) =>{
        let nome = answer['sigin']

        if(fs.existsSync(`accounts/${nome}.json`)){
            const conta = getAccount(nome)
            inquirer.prompt([
                {
                    name: 'senha',
                    message: 'Digite sua senha'
                }
        ]).then((senha)=>{
            let senhaL = senha['senha']
            if(conta.senha === senhaL){
                index(conta)
            }else{
                console.log(chalk.bgRed.white("Senha incorreta"))
                menuOff()
            }
            
        }).catch(err => console.log(err))
        }else{
            console.log(chalk.bgRed.white("Conta não existe"))
            menuOff()
        }
    }).catch(err => console.log(err))
    
}

function createAccount(){
    console.log(chalk.bgBlueBright.white('Digite as informações solicitadas'))

    inquirer.prompt([
    {
        type: 'input',
        name: 'criar',
        message: 'Digite o nome da conta',
        
    },
    
])
.then((answer) =>{
    const action = answer['criar']
    write(action)
})
.catch(err => console.log(err))
}

function write(dado){
    if(!fs.existsSync('accounts')){
        fs.mkdirSync("accounts")
    }
    if(fs.existsSync(`accounts/${dado}.json`)){
        console.log(chalk.bgRed.white(" Essa conta já existe, digite um nome diferente "))
        createAccount()
    }else{
        inquirer.prompt([
            {
                type: 'input',
                name: 'senha',
                message: 'Digite a senha',
                
            },
            
        ])
        .then((answer) =>{
            let senha = answer['senha']
            if(senha.length < 8){
                console.log(chalk.bgRed.white("Senha deve ter pelomenos 8 digitos"))
                write(dado)
            }else{
                fs.writeFileSync( `accounts/${dado}.json`, `{\n "nome":"${dado}",\n "senha":"${senha}",\n "saldo":"0"\n}`)
                console.log(chalk.bgGreen.white("CONTA CADASTRADA COM SUCESSO!"))
                menuOff()
            }
        })
        .catch(err => console.log(err))
    }
}

function index(conta){
    console.log(chalk.bgBlue.white(`Seja bem vindo Sr(a).${conta.nome}`))
    inquirer.prompt([
        {
            type: "list",
            name: "inicio",
            message: "O que vai querer fazer hoje?",
            choices: ['Consultar saldo', 'Depositar', 'Sacar', 'Log out']
        }
    ]).then((answer)=>{
        let r = answer['inicio']
        if(r === 'Consultar saldo'){
            console.log(chalk.greenBright(`Seu saldo atual é: R$ ${conta.saldo}`))
            index(conta)
        }else if(r === 'Depositar'){
            iValor(r, conta)
        }else if(r === 'Sacar'){
            iValor(r, conta)
        }else{
            menuOff()
        }

    }).catch(err => console.log(err))
}

function iValor(op, conta){
    inquirer.prompt([
        {
            type: 'input',
            name: 'valor',
            message: 'Digite o valor '
        }
    ]).then((answer) =>{
        if(op === 'Depositar'){
            conta.saldo = parseFloat(conta.saldo) + parseFloat(answer.valor);
            fs.writeFileSync( `accounts/${conta.nome}.json`, `{\n"nome":"${conta.nome}",\n "senha":"${conta.senha}",\n "saldo":"${conta.saldo}"\n}`)
            console.log(chalk.bgGreen.white("Valor depositado com sucesso!"))
        }else{
            if(parseFloat(conta.saldo) >= parseFloat(answer.valor)){
                conta.saldo = parseFloat(conta.saldo) - parseFloat(answer.valor);
                fs.writeFileSync( `accounts/${conta.nome}.json`, `{\n"nome":"${conta.nome}",\n "senha":"${conta.senha}",\n "saldo":"${conta.saldo}"\n}`)
                console.log(chalk.bgGreen.white("Valor resgatado com sucesso!"))
            }else{
                console.log(chalk.bgRed.white("Saldo insuficiente!"))
            }
        }
        index(conta)
        
    }).catch(err => console.log(err))
}

function getAccount(nome){
    return JSON.parse(fs.readFileSync(`accounts/${nome}.json`))
}