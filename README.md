# CodeAs

> 一个基于 TypeScript 的 Node.js 命令行工具

[![Node.js CI](https://github.com/77micz/codeas/actions/workflows/ci.yml/badge.svg)](https://github.com/77micz/codeas/actions/workflows/ci.yml)

## 环境要求

- Node.js 20 或更高版本
- npm（随 Node.js 安装）

## 📦 安装

```bash
# 如果是作为全局命令行工具
git clone https://github.com/77micz/codeas.git
cd codeas
npm install -g .
```

## 使用

```bash
# 查看帮助
codeas --help

# 查看版本
codeas --version
```

## 退出码

| 退出码 | 含义 |
| --- | --- |
| `0` | 成功 |
| `1` | 路径不存在或无法访问 |
| `2` | 用法错误，例如缺少路径、参数过多或未知选项 |

## 本地开发
```bash
# 拉取代码并安装依赖
git clone https://github.com/77micz/codeas.git
cd codeas
npm install

# 运行测试
npm test
# 调试
npm link
```

## License

MIT