


/**
 * 工具包
 */


// ======================= 导入 =======================
import { commandDefinitionDict } from '../data_model/definitions_dict.js'
// 导入解析结果数据结构
import type { ParseResult } from '../data_model/parse_result.js'




// ===================== 全局变量 =====================
const sourcePath = '../data/for_parser.js'

// 只在帮助信息调用时使用的常量
const helpResult: ParseResult = {
    options: {
        '--help': [],
    },
    subArgs: [],
}







// ======================= 函数 =======================


/**
 * 解析命令行参数数组，提取命令参数对象典对象
 * @param string command 子命令名称
 * @param string[] args 命令行参数数组
 * @returns ParseResult 命令参数解析结果
 */
export function argsParser(command: string, args: string[]): ParseResult {

    // 返回结果
    const result: ParseResult = {
        options: {},
        subArgs: [],
    }
    // 存储选项字典
    const res: Record<string, Array<string | number>> = {}

    // 收集选项及其参数

    // 获取命令对应的数据结构
    const command_definition = commandDefinitionDict[command]
    if (!command_definition) {
        throw new Error(`Definition missing: command '${command}' definition not found.
            Please check source.
            Source path: ${sourcePath}
            `)
    }
    // 获取选项定义
    const options = command_definition.options

    // 初始化选项参数数量
    let option_param_num = 0
    // 记录上一次的选项
    let last_option = ''

    // 处理子命令选项
    let i = 0
    for (; i < args.length; i++) {
        const arg = args[i]
        if (arg === undefined) {
            throw new Error(`Args error: arg can't be undefined.
            Please use "codeas ${command} --help" to show help page.
            `)
        }

        // 检查是不是选项结束符
        if (arg === '--') {
            break
        }
        if (arg.startsWith('--') || arg.startsWith('-')) {
            // 检查上一个选项参数是否足够
            if (option_param_num > 0) {
                // 上一个选项参数未传递完，当前位置是选项，说明参数传递错误
                throw new Error(`Option error: option '${last_option}' has not enough params.
                    Please use "codeas ${command} --help" to show help page.
                    `)
            }
            // 从选项定义中查找选项名称
            const option = options[arg]
            if (!option) {
                throw new Error(`Option error: option '${arg}' not found.
                    Please use "codeas ${command} --help" to show help page.
                    `)
            }

            // 特殊情况：检查选项是否是--help
            // 如果是--help，只有在args长度为1时才显示帮助信息
            if (arg === '--help' && args.length === 1) {
                // 显示帮助信息
                return helpResult
            } else if (arg === '--help') {
                // 如果是--help，且长度不为1，说明参数传递错误
                throw new Error(`Usage error: too many option or arg.
                    Please use "codeas ${command} --help" to show help page.
                    `)
            }

            // 记录上一次的选项
            last_option = arg
            // 初始化选项参数列表
            res[option.name] = []
            // 检查选项是否有参数
            if (option.paramNum > 0) {
                // 有参数，记录参数数量
                option_param_num = option.paramNum
            }
        } else if (option_param_num > 0) {
            // 不是选项且上一个选项需要参数，作为参数传递给上一个选项
            (res[last_option] ||= []).push(arg);
            option_param_num--
        } else {
            // 不是选项且上一个选项没有参数了，子命令的参数
            break
        }
    }
    // 更新选项结果
    result.options = res

    // 处理子命令参数
    // 获取子命令的参数
    const sub_args = command_definition.args
    // 子命令参数数组索引
    let j = 0
    // 收集参数
    const sub_params: Array<string | number> = []
    while (i < args.length && j < sub_args.length) {
        // 实际参数
        const arg = args[i]
        // 子命令参数
        const sub_arg = sub_args[j]
        if (arg === undefined) {
            throw new Error(`Args error: arg '${sub_arg}' can't be undefined.
                Please use "codeas ${command} --help" to show help page.
                `)
        }
        sub_params.push(arg)
        i++
        j++
    }
    // 更新子命令参数结果
    result.subArgs = sub_params

    // 检查参数是否过多
    if (i < args.length) {
        throw new Error(`Args error: extra arg '${args[i]}'.
            Please use "codeas ${command} --help" to show help page.
            `)
    }

    // 检查是否有必须参数未传递
    while (j < sub_args.length) {
        const sub_arg = sub_args[j]
        if (sub_arg === undefined) {
            throw new Error(`Definition error: arg '${sub_arg}' is undefined.
                Please check source.
                Source path: ${sourcePath}
            `)
        }
        if (sub_arg.required) {
            throw new Error(`Args error: arg '${sub_arg}' is required.
            Please use "codeas ${command} --help" to show help page.
            `)
        }
        j++
    }



    return result
}







