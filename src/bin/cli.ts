

/**
 * 
 * 运行命令的文件，负责解析命令行参数、调用具体命令函数、组织命令执行结果
 * 负责解析命令行参数、调用具体命令函数、组织命令执行结果
 * 约定退出码为0表示成功，1表示运行时错误，2表示命令/选项/用法错误
 * 
 */
// ======================= 导入 =======================
import { commandDict } from '../data/for_cli.js'
// 导入解析器
import { argsParser } from '../util/utils.js'



// ========================== 全局变量 ==========================


// 命令结果类型
type CommandResult = {
    exitCode: number
    stdout: string
    stderr: string
}



// 退出码为2的错误类型
const ERROR_TYPE = ['Options error', 'Unknown command', 'Usage error']





// ======================= 函数 =======================

/**
 * cli运行指定命令，决定调用哪个命令函数
 * @param string[] arg_vec 命令行参数数组
 * @returns CommandResult 命令执行结果
 */
export async function run(arg_vec: string[]): Promise<CommandResult> {

    // 检查参数是否是数组
    if (!Array.isArray(arg_vec)) {
        throw new TypeError(`arg_vec must be an array.arg_vec: ${arg_vec}`)
    }

    // 检查数组是否有值
    if (arg_vec.length === 0) {
        return { exitCode: 2, stdout: '', stderr: 'missing command: arg_vec must not be empty' }
    }

    // 拆分命令行参数数组，将第一个参数作为命令名，其他参数作为命令参数
    const [command, ...options] = arg_vec


    // 检查命令是否为空字符串
    if (!command) {
        return { exitCode: 2, stdout: '', stderr: 'Unknow command: Command must not be empty' }
    }

    // 检查命令是否存在
    if (!(command in commandDict)) {
        return { exitCode: 2, stdout: '', stderr: `Unknow command: ${command}` }
    }

    // 调用命令函数
    const func = commandDict[command]

    // 检查命令函数是否存在
    if (!func) {
        throw new Error(`Command function for command: '${command}' is not defined`)
    }

    // 解析命令行参数
    const parsed_args = argsParser(options, command)

    try {
        const result = await func(parsed_args)
        return { exitCode: 0, stdout: result, stderr: '' }
    } catch (error: any) {
        // 检查error类型
        const err_msg = error instanceof Error ? error.message : String(error)
        // 判断是否参数错误
        let flag = false
        for (let type of ERROR_TYPE) {
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




