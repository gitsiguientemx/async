/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Queue consumer: a Worker that can consume from a
 * Queue: https://developers.cloudflare.com/queues/get-started/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { EdgeRuntime } from 'edge-runtime'
 

export default {
	async fetch(req, env, ctx): Promise<Response> {
		await env.MY_QUEUE.send({
			eval: "fetch(\"https://www.google.com\")"
		});
		return new Response('Sent message to the queue');
	},
	async queue(batch, env): Promise<void> {
		const runtime = new EdgeRuntime()

		const result = await Promise.all(
			batch.messages.map(m => runtime.evaluate(JSON.parse(m.body.message)["eval"]))
		)
		
		console.log(result)
	},
} satisfies ExportedHandler<Env, Error>;
