# Toast Notifications - Quick Reference

## Import
```typescript
import { toast } from 'sonner';
```

## Basic Usage

| Type | Code | Use Case |
|------|------|----------|
| ✅ Success | `toast.success('Done!')` | Successful operations |
| ❌ Error | `toast.error('Failed!')` | Errors and failures |
| ℹ️ Info | `toast.info('Note: ...')` | Informational messages |
| ⚠️ Warning | `toast.warning('Careful!')` | Warnings and cautions |
| ⏳ Loading | `toast.loading('Wait...')` | Loading states |

## Common Patterns

### 1. Form Submission
```typescript
const toastId = toast.loading('Submitting...');
try {
  await submit();
  toast.success('Submitted!', { id: toastId });
} catch (error) {
  toast.error('Failed!', { id: toastId });
}
```

### 2. Promise-Based (Auto-handling)
```typescript
toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed!',
});
```

### 3. With Action Button
```typescript
toast.success('Deleted', {
  action: {
    label: 'Undo',
    onClick: () => restore(),
  },
});
```

### 4. Custom Duration
```typescript
toast.success('Copied!', { duration: 2000 }); // 2 seconds
```

### 5. With Description
```typescript
toast.error('Upload failed', {
  description: 'File size must be < 5MB',
});
```

## Styling
Pre-configured with futuristic glassmorphic theme:
- ✨ Dark background with transparency
- 🔷 Cyan border glow
- 🌫️ Backdrop blur effect
- 🎨 Matches portfolio design

## Full Documentation
See `TOAST_USAGE.md` for comprehensive examples.

