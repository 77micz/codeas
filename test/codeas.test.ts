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

// ---------- 集成测试 ----------

test('help prints usage and exits 0', async () => {
    const result = await run(['--help']);

    assert.equal(result.exitCode, 0);
    assert.match(result.stdout, /Usage:/);
    assert.match(result.stdout, /version/);
    assert.equal(result.stderr, '');
});

test('version prints the package version', async () => {
    const result = await run(['--version']);
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

    assert.equal(result.exitCode, 0);
    assert.equal(result.stdout, `codeas version ${packageJson.version}\n`);
    assert.equal(VERSION, packageJson.version);
});




test('test unknow command', async () => {
    const result = await run(['unknown-command']);

    assert.equal(result.exitCode, 2);
    assert.match(result.stderr, /Unknow command: unknown-command/);
    assert.equal(result.stdout, '');
});






test('no arguments exits with code 2', async () => {
    const result = await run([]);

    assert.equal(result.exitCode, 2);
    assert.match(result.stderr, /missing command/);
});




test('stat the project directory', async () => {
    const result = await run(['stat', './']);

    assert.equal(result.exitCode, 0);
    // 转为对象
    const stats = JSON.parse(result.stdout);
    assert.ok(stats);
    assert.equal(result.stderr, '');
});





test('list tree struct for target directory', async () => {
    const result = await run(['tree', '--auto', '--depth', '2', './']);

    assert.equal(result.exitCode, 0);


    // 检查标准输出是字符串
    assert.equal(typeof result.stdout, 'string');
    assert.equal(result.stderr, '');
});






// ---------- 真正的可执行入口 端到端测试 ----------

// 前面的测试直接调用 run()；这里启动一个真正的 Node 进程，
// 验证 src/codeas.ts 这层包装也能正确传参、输出和设置退出码。


test('show help with the executable wrapper', () => {
    const result = spawnSync(process.execPath, [binPath, '--help'], {
        encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    assert.match(result.stdout, /Usage:/);
    assert.equal(result.stderr, '');
});


test('show version with the executable wrapper', () => {
    const result = spawnSync(process.execPath, [binPath, '--version'], {
        encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout, `codeas version ${VERSION}\n`);
    assert.equal(result.stderr, '');
});

test('test unknow command with the executable wrapper', () => {
    const result = spawnSync(process.execPath, [binPath, 'unknown-command'], {
        encoding: 'utf8',
    });

    assert.equal(result.status, 2);
    assert.match(result.stderr, /Unknow command: unknown-command/);
    assert.doesNotMatch(result.stderr, /at .*\.js:\d+/);
});


test('stat the project directory with the executable wrapper', () => {
    const result = spawnSync(process.execPath, [binPath, 'stat', './'], {
        encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    // 转为对象
    const stats = JSON.parse(result.stdout);
    assert.ok(stats);
    assert.equal(result.stderr, '');
});




test('list the project directory with the executable wrapper', () => {
    const result = spawnSync(process.execPath, [binPath, 'tree', '--auto', '--depth', '2', './'], {
        encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    // 检查标准输出是字符串
    assert.equal(typeof result.stdout, 'string');
    assert.equal(result.stderr, '');
});



