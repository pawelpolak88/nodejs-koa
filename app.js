import * as dotenv from "dotenv";
import Koa from "koa";
import Router from "koa-router";
import bodyparser from "koa-bodyparser";
import User from "./model/User.js";
import mongoose from "mongoose";

dotenv.config();
const PORT = process.env.PORT;

const app = new Koa();
app.use(bodyparser());

const router = new Router({ prefix: "/users" });

async function handleValidationError(ctx, next) {
  try {
    await next();
  } catch (error) {
    if (error.name !== "ValidationError") throw error;

    ctx.status = 400;
    ctx.body = Object.keys(error.errors).reduce(
      (acc, val) => ({
        ...acc,
        [val]: error.errors[val].message,
      }),
      {}
    );
  }
}

function handleIternalObjectId(ctx, next) {
  if (!mongoose.isValidObjectId(ctx.params.id)) {
    ctx.throw(404, "user not found");
  }

  return next();
}

// get user
router.get("/:id", handleIternalObjectId, async (ctx, next) => {
  // ctx.params.id

  const user = await User.findById(ctx.params.id);

  if (!user) {
    ctx.throw(404, "no user");
  } else {
    ctx.body = user;
  }
});

// edit user
router.put(
  "/:id",
  handleIternalObjectId,
  handleValidationError,
  async (ctx, next) => {
    const user = await User.findByIdAndUpdate(
      ctx.params.id,
      {
        email: ctx.request.body.email,
        name: ctx.request.body.name,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    ctx.body = user;
  }
);

// create user
router.post(
  "/",
  handleIternalObjectId,
  handleValidationError,
  async (ctx, next) => {
    const user = await User.create({
      email: ctx.request.body.email,
      name: ctx.request.body.name,
    });

    ctx.body = user;
  }
);

app.use(router.routes()); // async (ctx, next)
app.listen(PORT || 3001);
