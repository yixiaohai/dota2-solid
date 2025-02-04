# 使用

```ts
const collapseItem: CollapseProps['items'] = [
    {
        key: 'test',
        label: '标题',
        children: () => (
            <Panel>
                <CButton>按钮</CButton>
            </Panel>
        )
    },
    {
        key: 'test2',
        label: 'testlabel2',
        children: () => (
            <Panel>
                <Label text={Math.random()} />
            </Panel>
        )
    }
];

<Collapse items={collapseItem}></Collapse>;
```

# 参数

| 参数      | 说明               | 类型                            | 默认值 |
| --------- | ------------------ | ------------------------------- | ------ |
| items     | 折叠项列表（必填） | [CollapseItem[]](#collapseitem) | `[]`   |
| activeKey | 当前激活的面板 key | `string`                        | -      |
| type      | 预设样式           | 1 \| 2                          | 1      |
| style     | 容器自定义样式     | `Partial<PanelStyle>`           | -      |

# CollapseItem

| 参数     | 说明               | 类型                           | 默认值 |
| -------- | ------------------ | ------------------------------ | ------ |
| key      | 唯一标识符（必填） | `string`                       | -      |
| label    | 面板标题（必填）   | `string`                       | -      |
| children | 面板内容（必填）   | `JSX.Element \| JSX.Element[]` | -      |
| style    | 单项容器样式       | `Partial<PanelStyle>`          | -      |
