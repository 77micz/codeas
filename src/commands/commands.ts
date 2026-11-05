


/**
 * 所有命令的函数
 */


// ======================= 导入 =======================
// 导入读取文件，写入文件，创建临时文件的模块
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
// 导入参数格式
import type { ParseResult } from '../data/parse_result.js'
// 导入fs模块，用于文件操作
import fs from 'fs/promises';
// 导入path模块，用于路径操作
import path from 'path';
// tmpdir 获取系统临时目录
import { tmpdir } from 'node:os';
// join 拼接路径
import { join } from 'node:path';
// 
import { type Dirent } from 'node:fs';






// ======================= 全局变量 =======================
// 读取package.json中的version字段
export const VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')).version







// ======================= 函数 =======================
/**
 * 版本命令函数
 * @param ParseResult parsed_args 命令参数解析结果
 * @returns string 版本号
 */
export function version(parsed_args: ParseResult): string {
    // // 判断参数是否为空
    // if (options.length !== 0) {
    //     // 把每个参数包裹上单引号
    //     options = options.map(opt => `'${opt}'`)
    //     throw new Error(`Options error: unknow option ${options.join(' ')}
    //     Please use "codeas --help" to show help page.
    //     `)
    // }


    // 完成基础功能,选项作为增强功能
    return `codeas version ${VERSION}\n`
}








/**
 * 扫描当前工作目录，找到.gitignore文件，读取文件内容，处理每一行把目录名称则作为string加入数组返回
 * @returns 返回一个 Promise，解析为包含目录名称的数组
 */
async function scanGitignore(): Promise<string[]> {
    // 1. 将相对路径基于当前工作目录 (cwd) 解析为绝对路径
    const absolutePath = path.resolve(process.cwd(), '.gitignore');

    // 用于收集结果的数组
    const result: string[] = [];
    try {
        // 读取文件内容
        const content = await fs.readFile(absolutePath, 'utf-8');
        // 按行处理
        const lines = content.split('\n');
        for (const line of lines) {
            // 去除首尾空白字符
            const trimmedLine = line.trim();
            // 跳过注释
            if (trimmedLine.startsWith('#')) {
                continue;
            }
            // 判断是不是目录
            if (trimmedLine.endsWith('/')) {
                // 去掉尾部斜杠
                let dir = trimmedLine.replace(/\/$/, '');
                // 加入结果数组
                result.push(dir);
            }
        }
    } catch (error) {
        // 检查error类型
        let msg = error instanceof Error ? error.message : 'Unknown error';

        process.stderr.write(`read file error: ${msg}\n`);
        // 根据业务需求，这里可以选择抛出错误或静默忽略（例如遇到权限问题）
    }
    return result;
}










/**
 * 递归统计指定目录下所有文件类型的数量
 * 
 * @param relativePath 相对路径，例如 './data'
 * @param ignoreDirs 懇定要忽略的目录，例如 ['node_modules', 'dist']
 * @returns 返回一个 Promise，解析为包含文件扩展名和对应数量的对象
 */
async function countFileTypes(relativePath: string, ignoreDirs: string[] = []): Promise<Record<string, number>> {
    // 1. 将相对路径基于当前工作目录 (cwd) 解析为绝对路径
    // 判断是相对路径or绝对路径
    const absolutePath = (relativePath.startsWith('/') || relativePath[1] === ':') ? relativePath : path.resolve(process.cwd(), relativePath);

    // 用于收集结果的字典
    const stats: Record<string, number> = {};

    /**
     * 内部递归函数
     */
    async function traverse(currentDir: string): Promise<void> {
        try {
            // 读取目录内容，withFileTypes: true 可以直接拿到 Dirent 对象，省去 stat 调用
            const entries = await fs.readdir(currentDir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);

                if (entry.isDirectory() && !ignoreDirs.includes(entry.name)) {
                    // 如果是目录且不在忽略列表中，递归进入
                    await traverse(fullPath);
                } else if (entry.isFile()) {
                    // 如果是文件，提取扩展名
                    let ext = path.extname(entry.name).toLowerCase();

                    // 处理没有扩展名的文件（例如 .gitignore, Makefile 等）
                    // path.extname('.gitignore') 返回 ''，这里统一归类
                    if (!ext) {
                        ext = '[no-extension]';
                    }

                    // 累加计数
                    stats[ext] = (stats[ext] || 0) + 1;
                }
                // 注意：如果是符号链接 (isSymbolicLink)，默认不处理，防止无限递归
            }
        } catch (error) {
            // 检查error类型
            let msg = error instanceof Error ? error.message : 'Unknown error';
            process.stderr.write(`read directory error: ${currentDir}\n
                message: ${msg}\n`);
            // 根据业务需求，这里可以选择抛出错误或静默忽略（例如遇到权限问题）
        }
    }

    // 开始递归遍历
    await traverse(absolutePath);

    return stats;
}








/**
 * 统计指定路径不同类型文件数量命令函数
 * @param ParseResult parsed_args 命令参数解析结果
 * @returns string 统计结果
 */
export async function stat(parsed_args: ParseResult): Promise<string> {


    // ==================== 选项处理 ====================
    const options = parsed_args.options;

    // 1.忽略目录
    const ignoreDirs = options['--auto'] === undefined ? [] : await scanGitignore();
    // process.stdout.write(`当前忽略目录: ${ignoreDirs.join(', ')}\n`);



    // ==================== 基础功能 ====================

    // 将参数中的相对路径传给countFileTypes函数
    const relativePath = parsed_args.subArgs[0] || './';
    // 处理相对路径是number的错误情况
    if (typeof relativePath === 'number') {
        throw new Error('Args error: relativePath must be string');
    }
    // 调用countFileTypes函数
    const stats = await countFileTypes(relativePath, ignoreDirs);
    // 返回结果
    return JSON.stringify(stats, null, 2);
}










/**
 * 递归打印指定目录下的文件结构
 *
 * @param dirPath 当前目录路径，例如 './data'
 * @param currentDepth 当前递归深度，默认 0
 * @param ignoreDirs 忽略的目录名，例如 ['node_modules', 'dist']
 * @param maxDepth 最大递归深度，默认 2。根目录深度为 0。
 * @returns 返回树形字符串
 */
export async function printTree(
    dirPath: string,
    currentDepth = 0,
    ignoreDirs: string[] = [],
    maxDepth = 2,
): Promise<string> {
    // 1. 转为绝对路径
    const rootPath = path.resolve(dirPath);
    // 2. 提取根目录名，用于树形结构的根节点
    const rootName = path.basename(rootPath) || rootPath;

    // 3. 初始化树形结构，根目录为根节点
    const lines: string[] = [`${rootName}/`];

    async function walk(
        dir: string,
        prefix: string,
        depth: number,
    ): Promise<void> {
        // 存储当前目录下的文件和目录列表
        let entries: Dirent[];

        try {
            // 读取目录内容，withFileTypes: true 可以直接拿到 Dirent 对象，省去 stat 调用
            entries = await fs.readdir(dir, { withFileTypes: true });
        } catch {
            // 目录无法读取时直接跳过，也可以改成 throw err
            throw new Error(`file read error: read ${dir} fail.
                check permission`)
        }

        // 只忽略目录，不忽略同名文件
        entries = entries.filter(
            (entry) =>
                !(entry.isDirectory() && ignoreDirs.includes(entry.name)),
        );

        // 文件在前，目录在后；同类按名称排序
        entries.sort((a, b) => {
            const aIsDir = a.isDirectory();
            const bIsDir = b.isDirectory();

            if (aIsDir !== bIsDir) {
                return aIsDir ? 1 : -1;
            }

            return a.name.localeCompare(b.name, undefined, {
                sensitivity: 'base',
            });
        });

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const isLast = i === entries.length - 1;
            const branch = isLast ? '└── ' : '├── ';

            //   排除undefined
            if (entry === undefined) {
                throw new Error(`file read error: ${entry} is undefined`)
            }

            const name = entry.isDirectory()
                ? `${entry.name}/`
                : entry.name;

            lines.push(`${prefix}${branch}${name}`);

            // 递归遍历子目录，深度不超过 maxDepth - 1，更新前缀
            if (entry.isDirectory() && depth + 1 <= maxDepth) {
                const nextPrefix = prefix + (isLast ? '    ' : '│   ');

                await walk(
                    path.join(dir, entry.name),
                    nextPrefix,
                    depth + 1,
                );
            }
        }
    }

    await walk(rootPath, '', currentDepth);

    const result = lines.join('\n');

    return result;
}






/**
 * 显示指定目录下的文件结构命令函数
 * @param ParseResult parsed_args 命令参数解析结果
 * @returns string 目录结构结果
 */
export async function tree(parsed_args: ParseResult): Promise<string> {


    // ==================== 选项处理 ====================
    const options = parsed_args.options;

    // 1.忽略目录
    const ignoreDirs = options['--auto'] === undefined ? [] : await scanGitignore();
    // process.stdout.write(`当前忽略目录: ${ignoreDirs.join(', ')}\n`);
    // 2.递归深度
    const depth = options['--depth'] === undefined ? 2 : Number(options['--depth']);
    // process.stdout.write(`当前递归深度: ${depth}\n`);
    if (isNaN(depth) || depth <= 0 || depth > 10) {
        throw new Error(`Args error: depth must be number between 1 and 10 but depth is ${options['--depth']}`);
    }



    // ==================== 基础功能 ====================

    // 将参数中的相对路径传给countFileTypes函数
    const relativePath = parsed_args.subArgs[0] || './';
    // 处理相对路径是number的错误情况
    if (typeof relativePath === 'number') {
        throw new Error('Args error: relativePath must be string');
    }


    // 调用printTree函数
    const treeStr = await printTree(relativePath, 0, ignoreDirs, depth);
    // 返回结果
    return treeStr;
}












