# MuayadGen VS Code Extension

## Features

- **💬 Chat Sidebar** - محادثة مع AI مباشرة
- **🔍 Code Review** - مراجعة كود تلقائية
- **💡 Code Explanations** - شرح الكود
- **🔧 Quick Fixes** - إصلاحات سريعة
- **📊 Performance Insights** - معلومات الأداء
- **🌍 Arabic Support** - دعم كامل للعربية

## Installation

1. Install from VS Code Marketplace
2. Configure API key: `Ctrl+Shift+P` → "MuayadGen: Configure"
3. Start using: `Ctrl+Shift+M`

## Usage

### Open Chat
Press `Ctrl+Shift+M` (or `Cmd+Shift+M` on Mac)

### Review Code
Right-click → "MuayadGen: Review Code"

### Explain Code
Select code → Right-click → "MuayadGen: Explain"

## Commands

- `MuayadGen: Open Chat` - فتح المحادثة
- `MuayadGen: Review Code` - مراجعة الكود
- `MuayadGen: Explain Code` - شرح الكود
- `MuayadGen: Fix Error` - إصلاح خطأ

## Settings

```json
{
  "muayadgen.apiKey": "your-api-key",
  "muayadgen.model": "claude-sonnet-4-20250514",
  "muayadgen.language": "ar" // or "en"
}
```

## License

MIT
