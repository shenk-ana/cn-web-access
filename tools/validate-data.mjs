#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = resolve(root, "src/data/sites.json");
const errors = [];

function fail(message) {
  errors.push(message);
}

let data;
try {
  data = JSON.parse(readFileSync(dataPath, "utf8"));
} catch (error) {
  console.error(`无法解析 ${dataPath}: ${error.message}`);
  process.exit(1);
}

const allowedStatus = new Set(["blocked", "partial", "region"]);
const allowedTypes = new Set(["alternative", "mirror"]);

if (!data.schemaVersion) fail("缺少 schemaVersion");
if (!data.updatedAt) fail("缺少 updatedAt");
if (!data.categories || typeof data.categories !== "object") {
  fail("缺少 categories");
}
if (!Array.isArray(data.sites)) fail("sites 必须是数组");

const categoryKeys = new Set(Object.keys(data.categories || {}));
const ids = new Set();

for (const [key, category] of Object.entries(data.categories || {})) {
  for (const field of ["code", "title", "description"]) {
    if (!category?.[field]) fail(`分类 ${key} 缺少字段 ${field}`);
  }
}

for (const [index, site] of (data.sites || []).entries()) {
  const label = site?.id || site?.name || `#${index}`;

  for (const field of [
    "id",
    "category",
    "name",
    "initials",
    "intro",
    "status",
    "accessSummary",
  ]) {
    if (!site?.[field]) fail(`网站 ${label} 缺少字段 ${field}`);
  }

  if (site?.id) {
    if (ids.has(site.id)) fail(`重复的 id: ${site.id}`);
    ids.add(site.id);
  }

  if (site?.category && !categoryKeys.has(site.category)) {
    fail(`网站 ${label} 的分类不存在: ${site.category}`);
  }

  if (site?.status && !allowedStatus.has(site.status)) {
    fail(`网站 ${label} 的 status 无效: ${site.status}`);
  }

  if (!site?.official?.name || !site?.official?.url) {
    fail(`网站 ${label} 缺少 official.name 或 official.url`);
  }

  if (!Array.isArray(site?.alternatives)) {
    fail(`网站 ${label} 的 alternatives 必须是数组`);
    continue;
  }

  for (const [altIndex, link] of site.alternatives.entries()) {
    if (!allowedTypes.has(link?.type)) {
      fail(`网站 ${label} 的 alternatives[${altIndex}] type 无效`);
    }
    if (!link?.name || !link?.url) {
      fail(`网站 ${label} 的 alternatives[${altIndex}] 缺少 name 或 url`);
    }
    try {
      // 仅校验 URL 格式，不发起网络请求
      new URL(link.url);
    } catch {
      fail(`网站 ${label} 的 alternatives[${altIndex}] URL 无效: ${link?.url}`);
    }
  }

  try {
    new URL(site.official.url);
  } catch {
    fail(`网站 ${label} 的 official.url 无效: ${site.official?.url}`);
  }
}

if (errors.length) {
  console.error(`数据校验失败，共 ${errors.length} 项：`);
  for (const message of errors) console.error(`- ${message}`);
  process.exit(1);
}

console.log(
  `数据校验通过：${categoryKeys.size} 个分类，${data.sites.length} 个网站。`,
);
