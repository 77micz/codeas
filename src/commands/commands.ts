


/**
 * 所有命令的函数
 */


// ======================= 导入 =======================
// 导入readFileSync模块，用于读取文件内容
import { readFileSync } from 'node:fs'
// 导入参数格式
import type { ParseResult } from '../data/parse_result.js'
// 导入fs模块，用于文件操作
import fs from 'fs/promises';
// 导入path模块，用于路径操作
import path from 'path';






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










