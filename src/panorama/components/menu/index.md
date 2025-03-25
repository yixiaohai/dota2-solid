# 使用

```ts
const [menuItem, setMenuItem] = createStore<MenuItem[]>([
    {
        icon: 's2r://panorama/images/control_icons/return_to_game_png.vtex',
        onactivate: () => {
            $.DispatchEvent('DOTAHUDShowDashboard');
        },
        label: '#backToDashboard',
        style: {
            width: '30px',
            height: '30px',
            transform: 'scaleY(-1)'
        }
    },
    {
        icon: 's2r://panorama/images/control_icons/gear_png.vtex',
        onactivate: () => {
            $.DispatchEvent('DOTAShowSettingsPopup');
        },
        label: '#settings',
        style: {
            width: '26px',
            height: '26px'
        }
    },
    {
        icon: 's2r://panorama/images/control_icons/hamburger_png.vtex',
        onactivate: () => {
            $.DispatchEvent('DOTAHUDToggleScoreboard');
        },
        label: '#scoreboard',
        style: {
            width: '27px',
            height: '27px'
        },
        show: false
    },
    {
        icon: 's2r://panorama/images/control_icons/24px/tool.vsvg',
        onactivate: () => {
            layer.toggle('tool_common', 'left');
        },
        label: '#tool_common',
        style: {
            width: '24px',
            height: '24px'
        }
    },
    {
        icon: 's2r://panorama/images/control_icons/24px/debut_tool.vsvg',
        onactivate: () => {
            layer.toggle('tooldeveloper', 'left');
        },
        label: '#tooldeveloper',
        style: {
            width: '24px',
            height: '24px'
        }
    }
]);

<Menu items={menuItem} mode="horizontal" />;
```

# 参数

| 参数   | 说明         | 类型                       | 默认值       |
| ------ | ------------ | -------------------------- | ------------ |
| items  | 菜单项(必填) | MenuItem[]                 | []           |
| mode   | 菜单模式     | 'horizontal' \| 'vertical' | 'horizontal' |
| show   | 显示         | boolean                    | true         |
| height | 高度         | number                     | 30           |

# MenuItem

| 参数  | 说明           | 类型          | 默认值   |
| ----- | -------------- | ------------- | -------- |
| icon  | 图标(必填)     | string        | ''       |
| func  | 点击事件(必填) | () => void    | () => {} |
| show  | 显示           | boolean       | true     |
| label | 标签           | string        | ''       |
| style | 样式           | CSSProperties | {}       |
