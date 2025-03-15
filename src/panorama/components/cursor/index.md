# 使用

```ts
const think = (pos: [number, number, number]) => {};

const handleClick = (
    eventType: MouseEvent,
    button: MouseButton | MouseScrollDirection,
    pos: [number, number, number]
) => {
    if (eventType !== 'pressed' || button !== 0) {
        return;
    }
    removeListener();
};

// 注册监听
const removeListener = cursor.start(handleClick, think, 'cast');
```

# 方法

start()
| 参数 | 说明 | 类型 | 默认值 |
| --------- | ---------------------------- | ------------------------------- | ------ |
| callback | 鼠标点击（左键）时触发的回调函数。 | MouseCallback | - |
| think | 监听启动后，每帧调用的函数。 | (pos: [number, number, number]) => void | - |
| cursorType | 设置鼠标样式 | cursorStyle | - |

#cursorStyle

| 参数        | 说明                                 | 类型   | 默认值 |
| ----------- | ------------------------------------ | ------ | ------ |
| cursorStyle | 光标样式，是个枚举值，目前只写了一个 | 'cast' | -      |

# MouseCallback

| 参数      | 说明       | 类型                                                    | 默认值 |
| --------- | ---------- | ------------------------------------------------------- | ------ |
| eventType | 点击类型   | "pressed" \| "doublepressed" \| "released" \| "wheeled" | -      |
| button    | 点击的按钮 | MouseButton \| MouseScrollDirection                     | -      |
| pos       | 位置       | [number, number, number]                                | -      |

# MouseButton说明
type MouseButton = 0 | 1 | 2 | 3 | 4 | 5 | 6  
0 - Left 1 - Right 2 - Middle 3 - Mouse 4 4 - Mouse 5 5 - Scroll up 6 - Scroll down