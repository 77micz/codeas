



/**
 * 收集所有命令，提供给cli调用
 */

// ======================= 导入所有命令 =======================
import { version } from '../commands/commands.js'
import { mainHelps } from '../commands/helps.js'
import type { ParseResult } from '../data/parse_result.js'
import { stat } from '../commands/commands.js'







// ======================= 全局变量 =======================

export const commandDict: Record<string, (args: ParseResult) => string | Promise<string>> = {
    // 全局选项当成子命令处理
    "--version": version,
    "--help": mainHelps,
    "stat": stat,
}



