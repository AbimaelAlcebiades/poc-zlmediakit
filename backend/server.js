const express = require('express');
const {exec} = require('child_process');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const PORT = 3000;
const secret = "QfQuhen4pUtG6zrwYRQkyTAo0IE143mU";
const zlMediaKitHost = "zlmediakit";

// Middleware para permitir parsing de JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Endpoint para lidar com on_stream_not_found
app.post('/api/stream_not_found', (req, res) => {
    const {app, stream} = req.body;

    // Verifica se os parâmetros necessários foram recebidos
    if (!app || !stream) {
        return res.status(400).json({code: 1, msg: 'Parâmetros inválidos'});
    }

    // Caminho do arquivo de origem (você pode adaptar conforme necessário)
    const inputFile = `/opt/media/bin/www/${app}/${stream}`;

    // URL de saída RTMP para o ZLMediaKit
    const outputUrl = `rtmp://${zlMediaKitHost}:1935/${app}/${stream}`;

    // Comando FFmpeg para publicar o stream
    const ffmpegCommand = `ffmpeg -re -i ${inputFile} -c:v copy -c:a copy -f flv ${outputUrl}`;

    console.log(`Iniciando stream: ${ffmpegCommand}`);

    // Executa o comando FFmpeg
    const ffmpegProcess = exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao iniciar o FFmpeg: ${error.message}`);
            return;
        }
        console.log(`FFmpeg stdout: ${stdout}`);
        console.error(`FFmpeg stderr: ${stderr}`);
    });

    // Retorna sucesso para o ZLMediaKit
    res.json({code: 0, msg: 'Stream iniciado com sucesso'});
});

app.post('/api/stream_none_reader', (req, res) => {
    const {app, stream} = req.body;

    // Verifica se os parâmetros necessários foram enviados
    if (!app || !stream) {
        return res.status(400).json({code: 1, msg: 'Parâmetros inválidos'});
    }

    console.log(`Stream sem leitores: app=${app}, stream=${stream}`);

    // Opcional: Lógica para decidir se deve encerrar o stream
    // Exemplo: Apenas encerre se o app for "live"
    if (app === "live") {
        const closeStreamUrl = `http://zlmediakit:80/index/api/close_streams`;

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${closeStreamUrl}?secret=${secret}&vhost=__defaultVhost__&app=${app}&stream=${stream}`,
            headers: {}
        };

        axios.request(config)
            .then(response => {
                console.log(JSON.stringify(response.data));
                console.log(`Stream encerrado: ${stream}`);
            })
            .catch(error => {
                console.error(`Erro ao encerrar o stream: ${error.message}`);
            });
    }

    // Retorna sucesso para o ZLMediaKit
    res.json({code: 0, msg: 'OK'});
});

app.post('/api/on_http_access', (req, res) => {

    const parsedParams = querystring.parse(req.body.params || '');

    const {file_path, save_name, user, password, app, stream} = parsedParams;

    console.log('Tentativa de acesso detectada:', {file_path, stream, user, password, app, save_name});

    // Lógica de autenticação/autorização
    if (user === 'abimael' && password === 'teste' && app === 'live') {
        // Permitir o acesso
        res.json({
            code: 0, // 0 = acesso permitido
            msg: "Acesso permitido"
        });
    } else {
        // Negar o acesso
        res.json({
            code: 1, // 1 = acesso negado
            msg: "Acesso negado"
        });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
