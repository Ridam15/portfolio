# Toast Notifications Usage Guide

This guide provides examples for using toast notifications throughout the portfolio application with the custom futuristic glassmorphic theme.

## Import

Add this import at the top of any component where you want to use toast notifications:

```typescript
import { toast } from 'sonner';
```

## Basic Toast Types

### Success Toast
```typescript
toast.success('Project saved successfully!');
toast.success('Portfolio updated!');
toast.success('Changes published!');
```

### Error Toast
```typescript
toast.error('Failed to save project. Please try again.');
toast.error('Authentication failed');
toast.error('Network error. Please check your connection.');
```

### Info Toast
```typescript
toast.info('Changes will be published immediately.');
toast.info('This action cannot be undone.');
toast.info('New version available');
```

### Warning Toast
```typescript
toast.warning('Unsaved changes will be lost.');
toast.warning('Session expires in 5 minutes');
toast.warning('File size exceeds limit');
```

### Loading Toast
```typescript
const toastId = toast.loading('Saving changes...');
// Later, dismiss or update it:
toast.dismiss(toastId);
// Or update to success:
toast.success('Changes saved!', { id: toastId });
```

## Advanced Usage

### Promise-Based Toast
Automatically handles loading, success, and error states:

```typescript
toast.promise(
  saveToFirebase(data),
  {
    loading: 'Saving...',
    success: 'Saved successfully!',
    error: 'Failed to save',
  }
);
```

### Custom Duration
```typescript
// Short notification (2 seconds)
toast.success('Copied to clipboard!', { duration: 2000 });

// Long notification (10 seconds)
toast.error('Critical error occurred', { duration: 10000 });

// Infinite (until dismissed)
toast.info('Important notice', { duration: Infinity });
```

### With Action Button
```typescript
toast.success('Project deleted', {
  action: {
    label: 'Undo',
    onClick: () => restoreProject(),
  },
});

toast.info('New message received', {
  action: {
    label: 'View',
    onClick: () => router.push('/messages'),
  },
});
```

### With Description
```typescript
toast.success('Upload complete', {
  description: '3 files uploaded successfully',
});

toast.error('Upload failed', {
  description: 'File size must be less than 5MB',
});
```

### Custom ID (Prevent Duplicates)
```typescript
// Only one toast with this ID can exist at a time
toast.success('Form submitted', { id: 'form-submit' });
```

## Real-World Examples

### Form Submission
```typescript
const handleSubmit = async (formData) => {
  const toastId = toast.loading('Submitting form...');
  
  try {
    await submitContactForm(formData);
    toast.success('Message sent successfully!', { 
      id: toastId,
      description: 'We\'ll get back to you soon.',
    });
  } catch (error) {
    toast.error('Failed to send message', { 
      id: toastId,
      description: error.message,
    });
  }
};
```

### File Upload
```typescript
const handleFileUpload = async (file) => {
  if (file.size > 5 * 1024 * 1024) {
    toast.warning('File too large', {
      description: 'Maximum file size is 5MB',
    });
    return;
  }

  toast.promise(
    uploadFile(file),
    {
      loading: `Uploading ${file.name}...`,
      success: 'File uploaded successfully!',
      error: 'Upload failed. Please try again.',
    }
  );
};
```

### Data Fetching
```typescript
const fetchPortfolioData = async () => {
  try {
    const data = await getPortfolioContent();
    if (!data) {
      toast.info('No portfolio data found');
      return null;
    }
    return data;
  } catch (error) {
    toast.error('Failed to load portfolio data', {
      description: 'Please refresh the page',
      action: {
        label: 'Retry',
        onClick: () => fetchPortfolioData(),
      },
    });
  }
};
```

### Authentication
```typescript
const handleLogin = async (email, password) => {
  const toastId = toast.loading('Signing in...');
  
  try {
    await signInWithGoogle();
    toast.success('Welcome back!', { id: toastId });
    router.push('/admin');
  } catch (error) {
    if (error.message === 'Unauthorized: Admin access only') {
      toast.error('Access denied', { 
        id: toastId,
        description: 'Only admin users can access this area',
      });
    } else {
      toast.error('Sign in failed', { 
        id: toastId,
        description: error.message,
      });
    }
  }
};

const handleLogout = async () => {
  await logOut();
  toast.success('Signed out successfully');
  router.push('/');
};
```

### CRUD Operations
```typescript
// Create
const createProject = async (projectData) => {
  toast.promise(
    addDocument('projects', projectData),
    {
      loading: 'Creating project...',
      success: 'Project created!',
      error: 'Failed to create project',
    }
  );
};

// Update
const updateProject = async (id, updates) => {
  toast.promise(
    updateDocument('projects', id, updates),
    {
      loading: 'Saving changes...',
      success: 'Project updated!',
      error: 'Failed to update project',
    }
  );
};

// Delete
const deleteProject = async (id) => {
  const confirmed = window.confirm('Delete this project?');
  if (!confirmed) return;

  try {
    await deleteDocument('projects', id);
    toast.success('Project deleted', {
      action: {
        label: 'Undo',
        onClick: () => restoreProject(id),
      },
    });
  } catch (error) {
    toast.error('Failed to delete project');
  }
};
```

### Clipboard Copy
```typescript
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', { duration: 2000 });
  } catch (error) {
    toast.error('Failed to copy');
  }
};
```

### Image Upload with Progress
```typescript
const uploadImage = async (file) => {
  const toastId = toast.loading('Uploading image...');
  
  try {
    const url = await uploadFileWithProgress(
      `images/${file.name}`,
      file,
      (progress) => {
        toast.loading(`Uploading... ${progress}%`, { id: toastId });
      }
    );
    
    toast.success('Image uploaded!', { 
      id: toastId,
      description: 'Image is now available',
    });
    
    return url;
  } catch (error) {
    toast.error('Upload failed', { id: toastId });
    throw error;
  }
};
```

### Multiple Operations
```typescript
const publishAllChanges = async () => {
  const toastId = toast.loading('Publishing changes...');
  
  try {
    await updatePortfolioSection('hero', heroData);
    await updatePortfolioSection('about', aboutData);
    await updatePortfolioSection('projects', projectsData);
    
    toast.success('All changes published!', { 
      id: toastId,
      description: '3 sections updated',
    });
  } catch (error) {
    toast.error('Publish failed', { 
      id: toastId,
      description: 'Some changes may not have been saved',
    });
  }
};
```

### Validation Errors
```typescript
const validateForm = (data) => {
  const result = contactFormSchema.safeParse(data);
  
  if (!result.success) {
    const firstError = result.error.errors[0];
    toast.error('Validation failed', {
      description: firstError.message,
    });
    return false;
  }
  
  return true;
};
```

### Network Status
```typescript
// Monitor online/offline status
useEffect(() => {
  const handleOnline = () => {
    toast.success('Back online', { duration: 3000 });
  };
  
  const handleOffline = () => {
    toast.error('Connection lost', {
      description: 'Some features may not work',
      duration: Infinity,
    });
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);
```

## Component-Specific Examples

### Hero Editor
```typescript
const saveHeroSection = async (data) => {
  toast.promise(
    updatePortfolioSection('hero', data),
    {
      loading: 'Updating hero section...',
      success: 'Hero section updated!',
      error: 'Failed to update hero section',
    }
  );
};
```

### Project Editor
```typescript
const saveProject = async (projectData) => {
  const toastId = toast.loading('Saving project...');
  
  try {
    // Upload images first
    if (projectData.images) {
      toast.loading('Uploading images...', { id: toastId });
      // Upload logic...
    }
    
    // Save project
    await setDocument('projects', projectData.id, projectData);
    
    toast.success('Project saved!', { 
      id: toastId,
      action: {
        label: 'View',
        onClick: () => router.push(`/projects/${projectData.id}`),
      },
    });
  } catch (error) {
    toast.error('Failed to save project', { id: toastId });
  }
};
```

### Skill Editor
```typescript
const updateSkills = async (skills) => {
  if (skills.length === 0) {
    toast.warning('No skills to save');
    return;
  }
  
  toast.promise(
    updatePortfolioSection('skills', skills),
    {
      loading: `Saving ${skills.length} skills...`,
      success: `${skills.length} skills saved!`,
      error: 'Failed to save skills',
    }
  );
};
```

## Best Practices

1. **Use appropriate toast types** - Success for successful operations, error for failures, info for neutral messages
2. **Provide context** - Use descriptions to give more details about what happened
3. **Handle loading states** - Show loading toasts for async operations
4. **Allow dismissal** - Don't make toasts stay forever unless critical
5. **Avoid spam** - Use IDs to prevent duplicate toasts
6. **Be concise** - Keep messages short and actionable
7. **Add actions when helpful** - Provide undo/retry buttons when appropriate
8. **Use promises** - Let toast.promise handle state automatically

## Styling

The toast component is pre-styled with a futuristic glassmorphic theme:
- Dark background with transparency
- Cyan border glow
- Backdrop blur effect
- Matches the overall portfolio design

No additional styling needed - just use the toast functions!

