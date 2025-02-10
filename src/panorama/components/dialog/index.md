# 使用

```ts
dialog.open({
    title: '确认删除',
    describe: '您确定要删除此项目吗？',
    input: true,
    inputBig: true,
    defaultValue: 'abc',
    noCancel: true,
    onOk: () => console.log('确认删除')
});
```

# 参数

| 参数         | 说明                            | 类型     | 默认值 |
| ------------ | ------------------------------- | -------- | ------ |
| title        | 标题（必填）                    | string   | ''     |
| describe     | 描述（必填）                    | string   | ''     |
| input        | 是否打开输入框                  | boolean  | false  |
| inputBig     | 多行输入框                      | boolean  | false  |
| defaultValue | 输入框默认值                    | string   | ''     |
| noCancel     | 隐藏取消按钮                    | boolean  | false  |
| onOk         | 确定回调函数，会传回 input 的值 | Function | -      |
