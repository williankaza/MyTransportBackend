import express, { request, response } from "express";
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3333

app.use(express.json());

var lsOnibus: Array<Onibus> = []

interface PontoDTO{
    latitude: number,
    longitude: number
}

interface Pontos{
    sequencial: number,
    latitude: number,
    longitude: number,
    ativo: boolean
}

interface Onibus{
    numero: string,
    ativo: boolean,
    pontos: Array<Pontos>
}

function cargaInicial(){
    let onibus01: Onibus = {
        numero: "201-2019",
        ativo: true,
        pontos: [
            {
                sequencial: 1,
                latitude: -23.583777,
                longitude: -46.611073,
                ativo: true
            },
            {
                sequencial: 2,
                latitude: -23.588442,
                longitude: -46.610605,
                ativo: true
            },
            {
                sequencial: 3,
                latitude: -23.588374, 
                longitude: -46.608311,
                ativo: true
            },
            {
                sequencial: 4,
                latitude: -23.584802,
                longitude: -46.608687,
                ativo: true
            },
            {
                sequencial: 5,
                latitude: -23.584674, 
                longitude: -46.607617,
                ativo: true
            },
            {
                sequencial: 6,
                latitude: -23.583502, 
                longitude: -46.607773,
                ativo: true
            }
        ]
    }
    lsOnibus.push(onibus01)

    let onibus02: Onibus = {
        numero: "119-2020",
        ativo: true,
        pontos: [
            {
                sequencial: 1,
                latitude: 12.0000,
                longitude: 13.0000,
                ativo: true
            },
            {
                sequencial: 2,
                latitude: 12.0012,
                longitude: 13.9980,
                ativo: true
            },
            {
                sequencial: 3,
                latitude: 12.0023,
                longitude: 13.9980,
                ativo: true
            }
        ]
    }
    lsOnibus.push(onibus02)
    
    let onibus03: Onibus = {
        numero: "010-2119",
        ativo: true,
        pontos: [
            {
                sequencial: 1,
                latitude: 42.0000,
                longitude: 42.0000,
                ativo: true
            },
            {
                sequencial: 2,
                latitude: 42.0012,
                longitude: 42.9980,
                ativo: true
            },
            {
                sequencial: 3,
                latitude: 42.0023,
                longitude: 42.9980,
                ativo: true
            }
        ]
    }
    lsOnibus.push(onibus03)

    
    let onibus04: Onibus = {
        numero: "140-3801",
        ativo: true,
        pontos: [
            {
                sequencial: 1,
                latitude: 54.0000,
                longitude: 10.0000,
                ativo: true
            },
            {
                sequencial: 2,
                latitude: 54.0012,
                longitude: 10.9980,
                ativo: true
            },
            {
                sequencial: 3,
                latitude: 54.0023,
                longitude: 10.9980,
                ativo: true
            }
        ]
    }
    lsOnibus.push(onibus04)
}

cargaInicial();
app.get('',(request, response)=>{
    return response.json({ hello: "Serviço iniciado!"})
})

app.get('/onibus', (request, response)=>{
    return response.status(200).json(lsOnibus)
})

app.get('/onibus/:numeroOnibus', ( request, response )=>{
    const { numeroOnibus } = request.params
    const indexOnibus = lsOnibus.findIndex(x => x.numero == numeroOnibus)

    if (indexOnibus > -1){
        return response.status(200).json(lsOnibus[indexOnibus])
    } else {
        return response.status(404).json({ error: 'Onibus não encontrado!' })
    }
})

app.post('/onibus', ( request, response )=>{
    const { body } = request
    const indexOnibus = lsOnibus.findIndex(x => x.numero == body.numero)
    let lsPontos: Array<Pontos> = []
    let indicePonto: number = -1
    if (indexOnibus == -1){
        if (body.pontos != null){
            indicePonto++;
            if (Array.isArray(body.pontos)){
                body.pontos.forEach((ponto : PontoDTO) => {
                    let newPonto: Pontos = {
                        latitude: ponto.latitude,
                        longitude: ponto.longitude,
                        ativo: true,
                        sequencial: indicePonto++
                    }

                    lsPontos.push(newPonto);
                });
            } else {
                let newPonto: Pontos = {
                    latitude: body.pontos.latitude,
                    longitude: body.pontos.longitude,
                    ativo: true,
                    sequencial: indicePonto++
                }
                lsPontos.push(newPonto);
            }
        }
        
        let novoOnibus = {
            numero: body.numero,
            ativo: true,
            pontos: lsPontos
        }

        lsOnibus.push(novoOnibus)
        
        return response.status(200).json( novoOnibus )
    } else {
        return response.status(400).json({ error: 'Numero do onibus informado já foi cadastrado!' })
    }
})

app.post('/onibus/:numero/ponto', ( request, response )=>{
    const { numeroOnibus } = request.params
    const { body } = request
    const indexOnibus = lsOnibus.findIndex(x => x.numero == numeroOnibus)

    let indicePonto = -1;
    if (indexOnibus > -1){
        let onibus = lsOnibus[indexOnibus]
        indicePonto = onibus.pontos.length;

        if (Array.isArray(body)){
            for (let indBody = 0; indBody < body.length; indBody++) {
                let ponto: Pontos = {
                    latitude : body[indBody].latitude,
                    longitude: body[indBody].longitude,
                    ativo: true,
                    sequencial: indicePonto++
                }

                onibus.pontos.push(ponto)
            }
        } else {
            let ponto: Pontos = {
                latitude : body.latitude,
                longitude: body.longitude,
                ativo: true,
                sequencial: indicePonto++
            }

            onibus.pontos.push(ponto)
        }

        lsOnibus[indexOnibus] = onibus;
        return response.status(200).json( onibus );
    } else {
        return response.status(400).json( { error: "Onibus informado não encontrado!" } )
    }
})

app.put('/onibus/:numero/ponto/:sequencial/desativar', (request,response)=>{
    const { numero, sequencial } = request.params
    const indexOnibus = lsOnibus.findIndex(x => x.numero == numero)

    if (indexOnibus > -1){
        let onibus = lsOnibus[indexOnibus]
        const indexPonto = onibus.pontos.findIndex(x => x.sequencial.toString() == sequencial)

        if (indexPonto > -1){
            onibus.pontos[indexPonto].ativo = !onibus.pontos[indexPonto].ativo
        }
        
        lsOnibus[indexOnibus] = onibus
        return response.status(200).json(onibus)
    } else {
        return response.status(400).json( { error: "Onibus informado não encontrado!" } )
    }
})

app.listen(PORT, function(){
    console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);
});