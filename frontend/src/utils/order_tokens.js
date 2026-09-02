const TOKEN_KEY = 'globuy_order_tokens';

export const tokenManager = {
  // 获取所有 Token（自动处理 JSON 解析和异常）
  getAll() {
    try {
      const tokens = JSON.parse(localStorage.getItem(TOKEN_KEY)) || [];
      return Array.isArray(tokens) ? tokens : [];
    } catch (e) {
      return [];
    }
  },

  // 添加新 Token（自动去重）
  add(token) {
    if (!token) return;
    const tokens = this.getAll();
    if (!tokens.includes(token)) {
      tokens.unshift(token); // 最新的放最前面
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    }
  },

  // 检查是否有订单（用于弹窗判断）
  hasOrders() {
    return this.getAll().length > 0;
  },

  // 清空所有 Token（退出或清理时使用）
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  }
};