# Zepp-Life-Steps

Zepp / 小米运动 / Zepp Life 登录接口 Python 库，支持账号登录并获取 `access`、`login_token`、`app_token`、`user_id`。

## 登录接口库

安装依赖：

```powershell
python -m pip install requests
```

库调用示例：

```python
from zepp登录接口 import zepp_login

result = zepp_login("your@email.com", "your-password")
print(result.login_token)
print(result.app_token)
print(result.user_id)
```

手机号默认按中国区处理，未带区号时会自动补 `+86`。

## 小程序入口

小程序已修复新账号无法同步的问题，可以绑定设备。

扫描下方二维码进入小程序。前往小程序绑定设备之前，请先在 Zepp 上解绑所有设备，否则小程序不会重新绑定设备。

![小程序二维码](https://steps.luozhinet.com/img/MiniProgramCode.png)

## 注意

- 接口频繁访问可能返回 `429`。
- 稳定运行建议缓存 token，避免重复登录。