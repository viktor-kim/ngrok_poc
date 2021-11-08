import express from 'express';
import morgan from 'morgan';
import { WebSocketServer } from 'ws';
import ejs from 'ejs'

const restPort = 3000;
const wsPort = 8081;
const app = express();

app.use(morgan('dev'));
app.set('view engine', 'ejs')
app.engine('html', ejs.renderFile)
app.get('/', (req, res) => {
    res.render('./index.html')
});
app.get('/ping', (req, res) => {
    res.send('pong')
})
app.listen(restPort, () => {
	console.log(`========== [Node Test Server Start(port: ${restPort})] ==========`);
});

const wss = new WebSocketServer({port: wsPort})

wss.on('connection', (ws, req) => {
    console.log(`========== [WSS Test Server Start(port: ${wsPort})] ==========`);
    ws.on('message', (message) => { // 클라이언트로부터 메시지 수신 시
        console.log(message.toString('utf8'));
    });
    ws.on('error', (err) => { // 에러 발생 시
        console.error(err);
    });
    ws.on('close', () => { // 연결 종료 시
        console.log('클라이언트 접속 해제');
        clearInterval(ws.interval);
    });

    ws.interval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
        }
    }, 3000);
})
