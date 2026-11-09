



/**
 * 标准命令定义
 */

// ======================= 导入 =======================
// 导入命令定义
import type { CommandDefinition } from './command_definition.js'
// 导入参数格式
import type { ParseResult } from './parse_result.js'







// ======================= 定义 =======================
export interface StdCommand {
    // 包含命令定义，命令函数，命令帮助函数
    // 命令名称
    name: string
    // 命令定义
    definition: CommandDefinition
    // 命令函数
    command: (args: ParseResult) => Promise<string> | string
    // 命令帮助函数（可选，某些全局选项当作命令没有帮助信息）
    help?: () => string
}







