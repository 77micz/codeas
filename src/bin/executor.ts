

/**
 * 
 * 负责运行具体命令函数的文件
 * 
 * 约定退出码为0表示成功，1表示服务本身错误，2表示用户端错误
 * 服务本身错误：服务在运行过程中出现的错误，例如服务内部逻辑错误、数据库错误等
 * 用户端错误：用户在使用服务过程中出现的错误，例如命令不存在、选项错误、参数错误等
 */
// ======================= 导入 =======================
import { commandDict } from '../data_model/commands_dict.js'
// 导入解析器
import { argsParser } from '../base/arg_parser.js'
// 导入程序运行结果类型
import type { ProcessResult } from '../data_model/process_result.js'
// 导入异常类型
import { CLIENT_ERROR } from '../exception/exceptions.js'







// ======================= 函数 =======================

/**
 * cli运行指定命令，决定调用哪个命令函数
 * @param string[] arg_vec 命令行参数数组
 * @returns CommandResult 命令执行结果
 */
export async function run(arg_vec: string[]): Promise<ProcessResult> {

    // 检查参数是否是数组
    if (!Array.isArray(arg_vec)) {
        return { exitCode: 2, stdout: '', stderr: 'arg_vec must be an array' }
    }

    // 检查数组是否有值
    if (arg_vec.length === 0) {
        return { exitCode: 2, stdout: '', stderr: 'arg_vec must not be empty' }
    }

    // 拆分命令行参数数组，将第一个参数作为命令名，其他参数作为命令参数
    const [command, ...options] = arg_vec


    // 检查命令是否为空字符串
    if (command === undefined || command === '') {
        return { exitCode: 2, stdout: '', stderr: 'command must not be empty' }
    }

    // 检查命令是否存在
    if (!(command in commandDict)) {
        return { exitCode: 2, stdout: '', stderr: `unknow command: ${command}` }
    }

    // 调用命令函数
    const func = commandDict[command]

    // 检查命令函数是否存在
    if (func === undefined) {
        return { exitCode: 1, stdout: '', stderr: `service error: '${command}' function is not defined` }
    }

    try {
        // 解析命令行参数
        const parsed_args = argsParser(command, options)
        const result = await func(parsed_args)
        return { exitCode: 0, stdout: result, stderr: '' }
    } catch (error: any) {
        // 检查error类型
        const err_msg = error instanceof Error ? error.message : String(error)
        // 判断是否参数错误
        let flag = false
        for (let type of CLIENT_ERROR) {
            if (err_msg.startsWith(type)) {
                flag = true
                break
            }
        }
        if (flag) {
            return { exitCode: 2, stdout: '', stderr: err_msg }
        } else {
            return { exitCode: 1, stdout: '', stderr: err_msg }
        }
    }

}




