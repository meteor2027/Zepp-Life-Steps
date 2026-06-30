export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    let account, password, steps;
    if (req.method === 'GET') {
        account = req.query.account;
        password = req.query.password;
        steps = parseInt(req.query.steps, 10);
    } else {
        account = req.body.account;
        password = req.body.password;
        steps = parseInt(req.body.steps, 10);
    }

    if (!account || !password) {
        return res.status(400).json({ success: false, error: '账号和密码不能为空' });
    }
    if (isNaN(steps) || steps < 100 || steps > 99999) {
        return res.status(400).json({ success: false, error: '步数必须在100到99999之间' });
    }

    try {
        const loginResult = await zeppLogin(account, password);
        if (!loginResult.success) {
            return res.status(401).json({ success: false, error: loginResult.message });
        }
        const updateResult = await updateSteps(loginResult.data, steps);
        return res.status(200).json({
            success: true,
            message: `步数修改成功: ${steps}`,
            data: updateResult.data
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function zeppLogin(account, password) {
    const url = 'https://account.huami.com/v2.1/client/login';
    let loginAccount = /^\d+$/.test(account) ? '+86' + account : account;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'Zepp Life/6.6.0' },
            body: JSON.stringify({ account: loginAccount, password, country_code: 'CN' })
        });
        const data = await response.json();
        if (data.code === 0 && data.data) {
            return { success: true, data: { login_token: data.data.login_token, app_token: data.data.app_token, user_id: data.data.user_id } };
        }
        return { success: false, message: data.message || '登录失败' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function updateSteps(userData, steps) {
    const url = 'https://api-mifit.huami.com/v1/data/step/upload';
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'Zepp Life/6.6.0' },
            body: JSON.stringify({ user_id: userData.user_id, login_token: userData.login_token, app_token: userData.app_token, steps, timestamp: Math.floor(Date.now() / 1000) })
        });
        const data = await response.json();
        if (data.code === 0) {
            return { success: true, data: data.data };
        }
        return { success: false, message: data.message || '步数上报失败' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
