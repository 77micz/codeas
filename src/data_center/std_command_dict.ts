



/**
 * 标准命令字典
 */


// ======================= 导入 =======================
// 导入标准命令定义
import type { StdCommand } from '../interface/std_command.js'
// 导入命令定义
import * as definitions from './definitions.js'
// 导入命令函数
import * as commands from '../commands/commands.js'
// 导入帮助命令函数
import * as helps from '../commands/helps.js'


// ======================= 定义 =======================
// 标准命令字典，键为命令名称，值为命令对象
export const StdCommandDict: Record<string, StdCommand> = {
    "--help": {
        name: "--help",
        definition: definitions.help,
        command: commands.mainHelps,
    },
    "--version": {
        name: "--version",
        definition: definitions.version,
        command: commands.version,
    },
    "stat": {
        name: "stat",
        definition: definitions.stat,
        command: commands.stat,
        help: helps.statHelps,
    },
    "tree": {
        name: "tree",
        definition: definitions.tree,
        command: commands.tree,
        help: helps.treeHelps,
    },
}












