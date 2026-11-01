



/**
 * 收集所有命令，提供给cli调用
 */

// ======================= 导入所有命令 =======================
import {version} from '../commands/commands.js'
import {main_helps} from '../commands/helps.js'






// ======================= 全局变量 =======================

export const command_dict: Record<string, (...args: string[]) => string> = {
    "version": version,
    "help": main_helps,
}



