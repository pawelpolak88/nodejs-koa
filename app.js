import * as dotenv from "dotenv";
import Koa from "koa";
import bodyParser from 'koa-bodyparser';
import Router from "koa-router";

dotenv.config();
const PORT = process.env.PORT

const app = new Koa();
const router = new Router()

app.use(bodyParser())


// middleware for time spent
async function logger(ctx, next) {
    const start_time = Date.now();

    await next()

    console.log('request:', ctx.method, ctx.url, 'time spent:', Date.now() - start_time, 'ms');
}

app.use(logger)

router.get('/', async (ctx, next) => {
    // custom delay
    await new Promise((resolve) => {
        setTimeout(resolve, 1000)
    })

    ctx.body = {foo: 'Hello koa'};
})

app.use(async (ctx, next) => {
    await next()

    if (ctx.status === 404 && ctx.body === undefined) {
        ctx.status = 404;
        ctx.body = 'unknown route'
    }
})

// get user response
// app.use(async (ctx, next) => {
//     const body = []
//
//     for await (const chunk of ctx.req) {
//         body.push(chunk)
//     }
//
//     ctx.body = JSON.parse(Buffer.concat(body).toString('utf-8'))
//
//     return next()
// })

router.post('/sum', async (ctx, next) => {
    ctx.body = ctx.request.body.a + ctx.request.body.b
})

router.post('/mul', async (ctx, next) => {
    ctx.body = ctx.request.body.a * ctx.request.body.b
})

app.use(router.routes()) // async (ctx, next)
app.listen(PORT || 3001);
