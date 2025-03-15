# 使用

```ts
    <CButton text="默认" type={2} />
    <CButton text="禁用" type={2} disabled />
    <CButton text="红色" type={2} color="red" />
    <CButton text="橙色" type={2} color="orange" />
    <CButton text="黄色" type={2} color="yellow" />
    <CButton text="绿色" type={2} color="green" />
    <CButton text="青色" type={2} color="cyan" />
    <CButton text="蓝色" type={2} color="blue" />
    <CButton text="紫色" type={2} color="purple" />
    <CButton text="灰色" type={2} color="grey" />
```

# 参数

| 参数         | 说明                                                         | 类型                                                                               | 默认值 |
| ------------ | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ------ |
| icon         | 按钮图标资源路径                                             | string                                                                             | ''     |
| text         | 按钮显示文本                                                 | string                                                                             | ''     |
| tooltip_text | 鼠标移上去时显示文本                                         | string                                                                             | ''     |
| type         | 预设样式类型：1-纯色背景，2-纹理背景                         | 1 \| 2                                                                             | 1      |
| color        | 可选值：red, green, blue, grey, yellow, orange, cyan, purple | 'red' \| 'green' \| 'blue' \| 'grey' \| 'yellow' \| 'orange' \| 'cyan' \| 'purple' |        |
| flow         | 均分占满容器宽度                                             | boolean                                                                            | false  |
| disabled     | 是否禁用按钮                                                 | boolean                                                                            | false  |
| onClick      | 点击事件回调函数                                             | Function                                                                           | -      |
| style        | 自定义样式对象（会覆盖预设样式）                             | Partial<PanelStyle>                                                                | -      |
| fontsize     | 字体大小                                                     | number                                                                             | 17     |
| toggle       | 可以选中                                                     | boolean                                                                            | -      |
| checked      | 默认是否选中                                                 | boolean                                                                            | false  |
