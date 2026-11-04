


/**
 * 所有命令的帮助信息
 */


// ======================= 导入 =======================
import { VERSION } from './commands.js'
// 导入参数格式
import type { ParseResult } from '../data/parse_result.js'



// ======================= 函数 =======================

/**
 * cli工具的帮助信息
 * @param ParseResult parsed_args 命令参数解析结果
 * @returns string 帮助信息
 */
export function mainHelps(parsed_args: ParseResult) {

  // // 判断参数是否为空
  // if (options.length !== 0) {
  //   // 把每个参数包裹上单引号
  //   options = options.map(opt => `'${opt}'`)
  //   // 把参数用空格隔开
  //   throw new Error(`Options error: unknow option ${options.join(' ')}
  //       Please use "codeas --help" to show help page.
  //       `)
  // }

  // 完成基础功能,选项作为增强功能
  return `codeas ${VERSION} - project analysis from the command line

Usage:
  codeas <command> [options] [args]

Commands:
  --help      Show this page
  --version   Show version for codeas
  stat     Stat the project directory

Examples:
  codeas --help
  codeas stat --auto ./
`
}




