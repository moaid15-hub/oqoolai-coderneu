# oqool VS Code Extension

## Features

- **💬 Chat Sidebar** - محادثة مع AI مباشرة
- **🔍 Code Review** - مراجعة كود تلقائية
- **💡 Code Explanations** - شرح الكود
- **🔧 Quick Fixes** - إصلاحات سريعة
- **📊 Performance Insights** - معلومات الأداء
- **🌍 Arabic Support** - دعم كامل للعربية

## Installation

1. Install from VS Code Marketplace
2. Configure API key: `Ctrl+Shift+P` → "oqool: Configure"
3. Start using: `Ctrl+Shift+M`

## Usage

### Open Chat
Press `Ctrl+Shift+M` (or `Cmd+Shift+M` on Mac)

### Review Code
Right-click → "oqool: Review Code"

### Explain Code
Select code → Right-click → "oqool: Explain"

## Commands

- `oqool: Open Chat` - فتح المحادثة
- `oqool: Review Code` - مراجعة الكود
- `oqool: Explain Code` - شرح الكود
- `oqool: Fix Error` - إصلاح خطأ

## Settings

```json
{
  "oqool.apiKey": "your-api-key",
  "oqool.model": "claude-sonnet-4-20250514",
  "oqool.language": "ar" // or "en"
}
```

## License

MIT
