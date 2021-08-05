import { RequestHandler } from "express";
import { render } from '@lit-labs/ssr/lib/render-with-global-dom-shim.js';


export const CardHandler: RequestHandler = (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send("<div>test</div>")
}