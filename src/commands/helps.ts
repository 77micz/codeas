


/**
 * 所有命令的帮助信息
 */


// ======================= 导入 =======================
import { VERSION } from './commands.js'



// ======================= 函数 =======================

/**
 * cli工具的帮助信息
 * @param string[] options 命令行参数数组
 * @returns string 帮助信息
 */
export function main_helps(...options: string[]) {

  // 判断参数是否为空
  if (options.length != 0) {
    // 把每个参数包裹上单引号
    options = options.map(opt => `'${opt}'`)
    // 把参数用空格隔开
    throw new Error(`Options error: unknow option ${options.join(' ')}
        Please use "codeas help" to show help page.
        `)
  }

  return `codeas ${VERSION} - project analysis from the command line

Usage:
  codeas <command> [options]

Commands:
  help      Show this page
  version   Show version for codeas

Options:
  -h, --help       Show help
  -v, --version    Show version

Examples:
  codeas help
  codeas version
`
}




