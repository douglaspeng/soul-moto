# Coming Soon Feature

This application includes a coming soon page feature that can be controlled via an environment variable.

## How to Use

### To Show Coming Soon Page:
Set the environment variable in your `.env.local` file or Vercel environment:
```
NEXT_PUBLIC_SHOW_COMING_SOON=true
```

### To Show Normal Site:
Set the environment variable to `false` or leave it unset:
```
NEXT_PUBLIC_SHOW_COMING_SOON=false
```

## Features

- **Background Image**: Uses `public/images/coming_soon.png` as the full-screen background
- **White Text**: Displays "COMING SOON" in white text at the bottom center
- **Responsive Design**: Adapts to different screen sizes
- **Clean Layout**: Minimal design focused on the message

## Files Created/Modified

- `app/components/ComingSoon.tsx` - The coming soon page component
- `app/config.ts` - Configuration file for the flag
- `app/layout.tsx` - Updated to conditionally render based on the flag

## Deployment

When deploying to Vercel, add the environment variable in your project settings:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add `NEXT_PUBLIC_SHOW_COMING_SOON` with value `true` or `false`
4. Redeploy your application
