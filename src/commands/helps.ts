


/**
 * 所有命令的帮助信息
 */


// ======================= 导入 =======================
import { VERSION } from '../common/constant.js'
// 导入参数格式
import type { ParseResult } from '../interface/parse_result.js'




// ======================= 函数 =======================








/**
 * stat命令的帮助信息
 * @returns string 帮助信息
 */
export function statHelps(): string {

  // 完成基础功能,选项作为增强功能
  return `stat - Stat number of files of different types in the project directory

Usage:
  codeas stat [options] <directory>

Options:
  --auto      Auto ignore files/directories in .gitignore
  --help      Show this page


Examples:
  codeas stat --help
  codeas stat --auto ./
`
}





/**
 * tree命令的帮助信息
 * @returns string 帮助信息
 */
export function treeHelps(): string {

  // 完成基础功能,选项作为增强功能
  return `tree - Show tree struct of the project directory

Usage:
  codeas tree [options] <directory>

Options:
  --auto              Auto ignore files/directories in .gitignore
  --depth <depth>     Specify the depth of recursion, default is 2
  --help              Show this page


Examples:
  codeas tree --help
  codeas tree --auto ./
  codeas tree --auto --depth 2 ./
`
}





// ======================= 全局变量 =======================
// 命令帮助字典
export const helpsDict: Record<string, () => string> = {
  stat: statHelps,
  tree: treeHelps,
}









