# j-panorama
此模版基于[solid-panorama](https://github.com/RobinCodeX/solid-panorama).

# 开始
## 克隆项目
会自动将项目链接至dota2项目文件夹，启动前确保dota2中没有同名的其他项目。
```
git clone https://github.com/yixiaohai/j-template <你的项目名>
```
## 启动:
```
pnpm start
```

# 前后端通用函数

## 控制台输出
只有ok和error，方法太多了记不住，唯一区别是前缀emoji不一样，会自动展开数组、对象
```
console.log('ok')
console.error('error')
```

## timer
创建一个定时器，返回一个id，通过id删除定时器
@callback 回调函数，根据返回的数字循环调用
@delay 延迟，不填立即执行
```
const t = timer.create(() => { return 1}, 3)
timer.remove(t)
```

# PUI组件
- [按钮](src/panorama/components/button/index.md)
- [折叠面板](src/panorama/components/collapse/index.md)
- [弹窗](src/panorama/components/dialog/index.md)
- [输入框](src/panorama/components/input/index.md)
- [弹出层](src/panorama/components/layer/index.md)
- [菜单](src/panorama/components/menu/index.md)

# Excel
## 本地化
\#xxx\# 会在addon_xxxx.txt中生成key_xxx,{}会替换成key
比如#schinese#{}_title 会在addon_schinese.txt中生成 key_title 的kv
## 嵌套
单元格'xxxx{'和单元格'}'中的列会被嵌套到xxxx中

# TODO
单选框
滑动输入条
开关
二维码
侧边提示
封装通信模块，统一防抖