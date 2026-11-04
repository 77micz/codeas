#!/usr/bin/env node


/**
 * 
 * cli入口文件，对接终端，输入终端命令，输出命令执行结果到终端，向运行命令函数提供服务
 * 负责连接终端、解析命令行，并调用运行命令函数
 * 约定退出码为0表示成功，非0表示失败
 * 
 */


// ========================= 导入 =========================


import { run } from './bin/cli.js'





// ========================= 主函数 =========================
try {
    // 运行命令，并解析返回值
    const result = await run(process.argv.slice(2)) // 获取终端输入的命令行参数数组，跳过前两个参数，即nodejs路径和脚本路径


    // 检查返回值，并输出到终端
    if (result.stdout) {
        // 命令执行成功，输出标准输出
        process.stdout.write(result.stdout)
    }
    if (result.stderr) {
        // 命令执行失败，输出错误信息
        process.stderr.write(result.stderr)
    }


    // 设置退出码
    process.exitCode = result.exitCode
} catch (error: any) {
    // 获取错误信息
    const err_msg = error instanceof Error ? error.message : String(error)
    // 输出错误信息
    process.stderr.write(`codeas: '${err_msg}' See 'codeas help'.\n`)

    // 意外错误属于运行时错误，退出码设为1
    process.exitCode = 1
}












