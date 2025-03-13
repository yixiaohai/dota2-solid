# 使用

```ts
<Layer name="layer_view" type="center">
    <Panel>....</Panel>
</Layer>
```

# 参数

| 参数       | 说明                         | 类型     | 默认值 |
| ---------- | ---------------------------- | -------- | ------ |
| name       | 页面名称(必填)               | string   | ''     |
| type       | 类型，同类型面板只会打开一个 | string   | ''     |
| class      | css 类名                     | string   | ''     |
| shade      | 遮罩透明度                   | number   | 0      |
| shadeClose | 点击遮罩关闭页面             | boolean  | ''     |
| onOpen     | 打开时回调                   | Function | ''     |
| onClose    | 关闭时回调                   | Function | ''     |
