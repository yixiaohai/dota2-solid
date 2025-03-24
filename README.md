# j-panorama

此模版基于[solid-panorama](https://github.com/RobinCodeX/solid-panorama).

# 开始

## 克隆项目

会自动将项目链接至 dota2 项目文件夹，启动前确保 dota2 中没有同名的其他项目。

```
git clone https://github.com/yixiaohai/j-template <你的项目名>
```

## 启动:

```
pnpm start
```

# 前后端通用函数

## 控制台输出

只有 log,error,warn,方法太多了记不住，唯一区别是前缀 emoji 不一样，会自动展开数组、对象

```
console.log('ok')
console.error('error')
console.warn('debug')
```

## timer

创建一个定时器，返回一个 id，通过 id 删除定时器  
timer.create(callback: (this: void) => void | number, delay?: number)  
@callback 回调函数，根据返回的数字循环调用  
@delay 延迟，不填立即执行

```
const t = timer.create(() => { return 1}, 3)
timer.remove(t)
```

# PUI 组件

-   [按钮](src/panorama/components/button/index.md)
-   [折叠面板](src/panorama/components/collapse/index.md)
-   [光标](src/panorama/components/cursor/index.md)
-   [默认面板](src/panorama/components/default_ui/index.md)
-   [弹窗](src/panorama/components/dialog/index.md)
-   [输入框](src/panorama/components/input/index.md)
-   [弹出层](src/panorama/components/layer/index.md)
-   [菜单](src/panorama/components/menu/index.md)

# Excel

## 本地化

\#aaa\#{}\_bbb 会在 addon_aaa.txt 中生成 key_bbb,{}会替换成 key  
比如\#schinese\#{}\_title 会在 addon_schinese.txt 中生成 key_title 的 kv

## 嵌套

单元格'xxx{'和单元格'}'中的列会被嵌套到 xxx 中
单元格内{}包括的内容也会生成 kv，左右括号必须单独一行，Key 和 value 必须包裹在双引号内，中间可以用空格分隔
不支持多重嵌套，嵌套太复杂时最好重新设计表格
| AbilityValue{ | CoolDown | ManaCost | } | nest |
| --- | --- | --- | --- |--- |
| | 50 | 100 | | {\n"a""123"\n} |
会生成

```
"AbilityValue" {
    "CoolDown" "50"
    "ManaCost" "100"
}
"nest" {
    "a" "123"
}
```

## 预加载
excel中的vpcf,vsndevts,vmdl会生成在kv/precache.json中

## 忽略的列
除了本地化的列，表头第二行的key不填写也会被忽略

# TODO

二维码
侧边提示
封装通信模块，统一防抖

单位
更换英雄

-   英雄 + 单位
单位信息 单位 KV
单位技能 单位物品
modifiers 状态
相机控制
