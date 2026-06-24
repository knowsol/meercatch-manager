#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/cli.ts
var fs = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);
var readline = __toESM(require("readline"), 1);
var DEFAULT_API_URL = process.env.SPECBRIDGE_API_URL || "https://sb-api.aiatti.com";
function ask(rl, question, def = "") {
  return new Promise((resolve) => {
    const prompt = def ? `${question} [${def}]: ` : `${question}: `;
    rl.question(prompt, (answer) => resolve(answer.trim() || def));
  });
}
function askHidden(rl, question) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    if (stdin.isTTY && typeof stdin.setRawMode === "function") {
      process.stdout.write(`${question}: `);
      let buf = "";
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding("utf8");
      const onData = (ch) => {
        for (const c of ch) {
          if (c === "\n" || c === "\r" || c === "") {
            stdin.setRawMode?.(false);
            stdin.pause();
            stdin.off("data", onData);
            process.stdout.write("\n");
            resolve(buf);
            return;
          }
          if (c === "") {
            process.stdout.write("\n");
            process.exit(130);
          }
          if (c === "\x7F" || c === "\b") {
            if (buf.length > 0) {
              buf = buf.slice(0, -1);
              process.stdout.write("\b \b");
            }
            continue;
          }
          buf += c;
          process.stdout.write("*");
        }
      };
      stdin.on("data", onData);
    } else {
      rl.question(`${question}: `, resolve);
    }
  });
}
async function httpJson(method, url, headers = {}, body) {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers
    },
    body: body === void 0 ? void 0 : JSON.stringify(body)
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = JSON.stringify(await res.json());
    } catch {
    }
    throw new Error(`${method} ${url} \u2192 ${res.status} ${detail}`);
  }
  if (res.status === 204) return void 0;
  return await res.json();
}
function detectViteProject(cwd) {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) return false;
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    return !!deps.vite;
  } catch {
    return false;
  }
}
function mergeEnv(envPath, pairs) {
  const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const lines = existing.split(/\r?\n/);
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const line of lines) {
    const m = /^([A-Z0-9_]+)=/.exec(line);
    if (m && pairs[m[1]] !== void 0) {
      out.push(`${m[1]}=${pairs[m[1]]}`);
      seen.add(m[1]);
    } else {
      out.push(line);
    }
  }
  for (const [k, v] of Object.entries(pairs)) {
    if (!seen.has(k)) out.push(`${k}=${v}`);
  }
  while (out.length > 1 && out[out.length - 1] === "" && out[out.length - 2] === "") out.pop();
  fs.writeFileSync(envPath, out.join("\n") + (out[out.length - 1] === "" ? "" : "\n"));
}
async function runInit() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const cwd = process.cwd();
  const isVite = detectViteProject(cwd);
  const envFile = isVite ? ".env" : ".env";
  const envVarApi = isVite ? "VITE_API_URL" : "SPECBRIDGE_API_URL";
  const envVarKey = isVite ? "VITE_SPECBRIDGE_KEY" : "SPECBRIDGE_KEY";
  console.log("");
  console.log("\u2500 SpecBridge SDK \xB7 Install \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  console.log(` \uD604\uC7AC \uD3F4\uB354: ${cwd}`);
  console.log(` \uD504\uB85C\uC81D\uD2B8 \uD0C0\uC785: ${isVite ? "Vite \uAC10\uC9C0\uB428 (VITE_ prefix \uC0AC\uC6A9)" : "\uC77C\uBC18"}`);
  console.log("\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  console.log("");
  try {
    const apiUrl = (await ask(rl, "API URL", DEFAULT_API_URL)).replace(/\/+$/, "");
    const adminPassword = process.env.SPECBRIDGE_ADMIN_PASSWORD || await askHidden(rl, "Admin \uBE44\uBC00\uBC88\uD638 (env SPECBRIDGE_ADMIN_PASSWORD \uB85C\uB3C4 \uC8FC\uC785 \uAC00\uB2A5)");
    const defaultName = path.basename(cwd);
    const projectName = await ask(rl, "\uD504\uB85C\uC81D\uD2B8 \uC774\uB984", defaultName);
    const keyName = await ask(rl, "API \uD0A4 \uB77C\uBCA8", `${projectName} Dev`);
    const env = { apiUrl, adminPassword, projectName, keyName };
    console.log("");
    console.log("\u2460 Admin \uB85C\uADF8\uC778 \u2026");
    const { token } = await httpJson("POST", `${env.apiUrl}/api/admin/login`, {}, {
      password: env.adminPassword
    });
    const auth = { Authorization: `Bearer ${token}` };
    console.log("\u2461 \uD504\uB85C\uC81D\uD2B8 \uC0DD\uC131 \u2026");
    let project;
    try {
      project = await httpJson("POST", `${env.apiUrl}/api/admin/projects`, auth, {
        name: env.projectName
      });
      console.log(`   \u2713 \uC0C8 \uD504\uB85C\uC81D\uD2B8 \uC0DD\uC131\uB428 (id: ${project.id}, slug: ${project.slug})`);
    } catch (e) {
      if (String(e).includes("409")) {
        console.log("   \u26A0 \uB3D9\uC77C slug \uC758 \uD504\uB85C\uC81D\uD2B8\uAC00 \uC774\uBBF8 \uC788\uC74C \u2014 \uAE30\uC874 \uAC83\uC744 \uC7AC\uC0AC\uC6A9\uD569\uB2C8\uB2E4");
        const list = await httpJson(
          "GET",
          `${env.apiUrl}/api/admin/projects`,
          auth
        );
        const found = list.find((p) => p.name === env.projectName);
        if (!found) throw e;
        project = found;
      } else {
        throw e;
      }
    }
    console.log("\u2462 API \uD0A4 \uBC1C\uAE09 \u2026");
    const keyRes = await httpJson(
      "POST",
      `${env.apiUrl}/api/admin/projects/${encodeURIComponent(project.id)}/keys`,
      auth,
      { name: env.keyName }
    );
    console.log(`   \u2713 \uD0A4 \uBC1C\uAE09\uB428 (\xB7\xB7\xB7${keyRes.tokenLast4})`);
    console.log(`\u2463 ${envFile} \uC791\uC131 \u2026`);
    const envPath = path.join(cwd, envFile);
    mergeEnv(envPath, {
      [envVarApi]: env.apiUrl,
      [envVarKey]: keyRes.token
    });
    console.log(`   \u2713 ${envPath}`);
    console.log(`     ${envVarApi}=${env.apiUrl}`);
    console.log(`     ${envVarKey}=sk_\u2026${keyRes.tokenLast4}`);
    console.log("");
    console.log("\uC644\uB8CC! \uB2E4\uC74C\uACFC \uAC19\uC774 SDK \uB97C import \uD574\uC11C \uC0AC\uC6A9\uD558\uC138\uC694:");
    console.log("");
    console.log(`  import { SpecBridgeAnnotation, httpAdapter } from '@specbridge-v1/sdk'`);
    console.log("");
    console.log(`  const storage = httpAdapter({`);
    console.log(`    baseUrl: import.meta.env.${envVarApi},`);
    console.log(`    apiKey:  import.meta.env.${envVarKey},`);
    console.log(`  })`);
    console.log("");
    console.log(`  <SpecBridgeAnnotation pageId="home" storage={storage}>`);
    console.log(`    {/* your content */}`);
    console.log(`  </SpecBridgeAnnotation>`);
    console.log("");
    console.log(`\uD504\uB85C\uC81D\uD2B8 '${project.name}' (${project.slug}) \uC5D0 \uC5F0\uACB0\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`);
    console.log("\uAD00\uB9AC\uB294 https://sb-admin.aiatti.com \uC5D0\uC11C \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
  } catch (e) {
    console.error("");
    console.error("\u2717 \uC124\uCE58 \uC2E4\uD328:", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}
async function runWhoami() {
  const apiUrl = (process.env.SPECBRIDGE_API_URL || DEFAULT_API_URL).replace(/\/+$/, "");
  const envFiles = [".env", ".env.local"];
  let apiKey = process.env.SPECBRIDGE_KEY || process.env.VITE_SPECBRIDGE_KEY || "";
  if (!apiKey) {
    for (const f of envFiles) {
      const p = path.join(process.cwd(), f);
      if (!fs.existsSync(p)) continue;
      const content = fs.readFileSync(p, "utf8");
      const m = /^(?:VITE_)?SPECBRIDGE_KEY=(.+)$/m.exec(content);
      if (m) {
        apiKey = m[1].trim();
        break;
      }
    }
  }
  if (!apiKey) {
    console.error("API \uD0A4\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC74C. .env \uB610\uB294 SPECBRIDGE_KEY \uD658\uACBD\uBCC0\uC218 \uD655\uC778.");
    process.exit(1);
  }
  try {
    const info = await httpJson(
      "GET",
      `${apiUrl}/api/whoami`,
      { Authorization: `Bearer ${apiKey}` }
    );
    console.log(JSON.stringify(info, null, 2));
  } catch (e) {
    console.error("whoami \uC2E4\uD328:", e instanceof Error ? e.message : e);
    process.exit(1);
  }
}
function help() {
  console.log(`SpecBridge SDK CLI

Usage:
  specbridge init       Admin \uB85C\uADF8\uC778 + \uD504\uB85C\uC81D\uD2B8 \uC790\uB3D9 \uC0DD\uC131 + .env \uC791\uC131
  specbridge whoami     \uD604\uC7AC API \uD0A4\uAC00 \uC18D\uD55C \uD504\uB85C\uC81D\uD2B8 \uD45C\uC2DC
  specbridge help       \uC774 \uB3C4\uC6C0\uB9D0

Env:
  SPECBRIDGE_API_URL           \uAE30\uBCF8 API URL
  SPECBRIDGE_ADMIN_PASSWORD    init \uC2DC Admin \uBE44\uBC00\uBC88\uD638 \uD504\uB86C\uD504\uD2B8 \uC0DD\uB7B5
  SPECBRIDGE_KEY               whoami \uC2DC \uD0A4 \uC9C0\uC815
`);
}
var cmd = process.argv[2] || "help";
switch (cmd) {
  case "init":
    runInit();
    break;
  case "whoami":
    runWhoami();
    break;
  case "help":
  case "--help":
  case "-h":
    help();
    break;
  default:
    console.error(`\uC54C \uC218 \uC5C6\uB294 \uBA85\uB839: ${cmd}`);
    help();
    process.exit(1);
}
