/// <reference types="node" />
// 这些测试验证 CLI 的“对外行为”：输出到哪、退出码是多少。
// 测试不依赖真实项目目录，所有示例文件都放在系统临时目录里。

// ======================= 导入 =======================

// assert 检查断言是否成立
import assert from 'node:assert/strict';
// spawnSync 执行子进程
import { spawnSync } from 'node:child_process';
// mkdtempSync 创建临时目录, mkdirSync 创建目录,  readFileSync 读取文件, rmSync 删除文件, writeFileSync 写入文件
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
// tmpdir 获取系统临时目录
import { tmpdir } from 'node:os';
// join 拼接路径
import { join } from 'node:path';
// after 测试完成后执行, test 测试函数
import { after, test } from 'node:test';
// fileURLToPath 转换 URL 为路径
import { fileURLToPath } from 'node:url';

import { run } from '../src/bin/cli.js';
import { VERSION } from '../src/commands/commands.js';

// 每个测试共用一套临时目录和示例文件。
// mkdtempSync 会创建一个带随机后缀的目录，避免不同测试互相覆盖。
const tempDir = mkdtempSync(join(tmpdir(), 'codeas-test-'));
const projectDir = join(tempDir, 'project');
const filePath = join(tempDir, 'notes.txt');
const binPath = fileURLToPath(new URL('../dist/codeas.js', import.meta.url));
const packagePath = fileURLToPath(new URL('../package.json', import.meta.url));

mkdirSync(projectDir);
writeFileSync(filePath, 'hello\n');

// 所有测试跑完后，删除临时目录，保持机器干净。
after(() => {
    rmSync(tempDir, { recursive: true, force: true });
});

// ---------- 基础命令：help 和 version ----------

test('help prints usage and exits 0', () => {
    const result = run(['help']);

    assert.equal(result.exit_code, 0);
    assert.match(result.stdout, /Usage:/);
    assert.match(result.stdout, /version/);
    assert.equal(result.stderr, '');
});

test('version prints the package version', () => {
    const result = run(['version']);
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

    assert.equal(result.exit_code, 0);
    assert.equal(result.stdout, `codeas version ${packageJson.version}\n`);
    assert.equal(VERSION, packageJson.version);
});




// ---------- 其他全局错误 ----------

test('no arguments exits with code 2', () => {
    const result = run([]);

    assert.equal(result.exit_code, 2);
    assert.match(result.stderr, /missing command/);
});

// ---------- 真正的可执行入口 ----------

// 前面的测试直接调用 run()；这里启动一个真正的 Node 进程，
// 验证 bin/devpilot.js 这层包装也能正确传参、输出和设置退出码。
test('the executable wrapper forwards output and exit codes', () => {
    const result = spawnSync(process.execPath, [binPath, 'version'], {
        encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout, `codeas version ${VERSION}\n`);
    assert.equal(result.stderr, '');
});

test('the executable wrapper reports usage errors without a stack trace', () => {
    const result = spawnSync(process.execPath, [binPath, 'analyze'], {
        encoding: 'utf8',
    });

    assert.equal(result.status, 2);
    assert.match(result.stderr, /Unknow command: analyze/);
    assert.doesNotMatch(result.stderr, /at .*\.js:\d+/);
});
