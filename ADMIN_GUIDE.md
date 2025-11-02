# Admin User Guide - Trinetra Digital Studio

## Getting Started

### Admin Login
1. Navigate to `/admin/login` in your browser
2. Enter your admin credentials (email and password)
3. Click "Login" to access the admin dashboard

**Default Admin Setup:**
To create your first admin account, you'll need to sign up using Lovable Cloud's authentication:
- Go to the Cloud tab in Lovable
- Navigate to Authentication
- Enable email/password authentication
- Create your admin user account

## Admin Dashboard

After logging in, you'll see the admin dashboard with:
- **Statistics Cards**: Quick overview of gallery items, events, and messages
- **Quick Action Cards**: Links to main admin functions

## Managing Gallery

### Adding Gallery Items
1. Click "Manage Gallery" from the dashboard
2. Click "Add New Item"
3. Fill in the details:
   - **Title**: Name of the photo/video
   - **Description**: Brief description (optional)
   - **Media URL**: Upload or paste image/video URL
   - **Thumbnail URL**: For videos, provide a thumbnail
   - **Tags**: Add categories (e.g., Wedding, Portrait, Event)
   - **Type**: Select Image or Video
4. Click "Save"

### Editing Gallery Items
1. Click on any gallery item
2. Update the information
3. Click "Update" to save changes

### Organizing Gallery
- Use the **Display Order** field to control the order items appear
- Higher numbers appear first
- Items can be filtered by tags on the public gallery page

## Managing Events

### Creating Events
1. Click "Manage Events" from the dashboard
2. Click "Create New Event"
3. Enter event details:
   - **Title**: Event name
   - **Date & Time**: When the event occurs
   - **Location**: Venue address
   - **Summary**: Short description
   - **Full Description**: Detailed HTML content
   - **Thumbnail**: Event preview image
   - **YouTube URL**: For live streaming or recordings
   - **Status**: Upcoming, Past, or Live
   - **Tags**: Categories for filtering

### Managing Event Status
- **Upcoming**: Shows in the upcoming events section
- **Past**: Moved to past events archive
- **Live**: Indicates event is currently happening

### YouTube Integration
- Paste any YouTube video URL in the "YouTube URL" field
- The "Watch Live" button will appear on the event page
- Opens in a modal or new tab when clicked

## Viewing Contact Messages

### Managing Inquiries
1. Click "View Messages" from the dashboard
2. See all contact form submissions
3. **New messages** are highlighted with a badge
4. Click "Mark as Read" to update status
5. Click "Reply via Email" to respond directly

### Message Information
Each message shows:
- Sender name and email
- Subject line (if provided)
- Message content
- Date and time received
- Read/Unread status

## Site Settings

### Updating Studio Information
1. Click "Site Settings" from the dashboard
2. Update:
   - Studio name
   - Owner name
   - Contact email and phone
   - Physical address
   - Social media links
   - Google Maps coordinates
   - Owner photo
   - Studio logo

### Changing Page Content
1. Navigate to "Manage Pages"
2. Select the page to edit (Home, About, Contact)
3. Update the HTML content
4. Toggle visibility on/off
5. Save changes

## Media Management

### Storage Best Practices
- **Images**: Use high-quality JPG or PNG files
- **Videos**: Host on YouTube or Vimeo for best performance
- **Thumbnails**: Create thumbnails at 400x300px for consistency
- **File Naming**: Use descriptive names for easy organization

### Recommended Image Sizes
- **Hero Images**: 1920x1080px (16:9)
- **Gallery Images**: 800-1200px width
- **Thumbnails**: 400x300px
- **Portrait Photos**: 800x1000px (4:5)

## SEO Optimization

### Meta Tags
Update meta titles and descriptions in the site settings for better search engine visibility.

### Image Alt Text
Always add descriptive titles and descriptions to gallery items for accessibility and SEO.

## Analytics Integration

To add Google Analytics:
1. Get your Google Analytics tracking ID
2. Add it in Site Settings
3. The code will be automatically included

## Security Notes

### Password Management
- Use a strong, unique password for admin access
- Change your password regularly
- Never share admin credentials

### Session Security
- You'll be automatically logged out after inactivity
- Always log out when finished
- Admin pages are protected and require authentication

## Troubleshooting

### Can't Upload Images?
- Check file size (max 5MB recommended)
- Ensure proper file format (JPG, PNG, WebP)
- Check storage limits in Cloud settings

### Gallery Not Updating?
- Clear browser cache
- Check that items are marked as visible
- Verify display order numbers

### Contact Form Not Working?
- Verify Lovable Cloud is connected
- Check database permissions
- Review contact message logs

## Getting Help

For additional support:
- Review the Lovable documentation at docs.lovable.dev
- Check the Lovable Discord community
- Contact support through the Lovable dashboard

## Deployment

When ready to deploy:
1. Test all functionality in preview mode
2. Click "Publish" in Lovable
3. Configure custom domain if desired
4. Test on production URL

## Maintenance Checklist

Weekly:
- [ ] Review and respond to contact messages
- [ ] Check for outdated events (move to past)
- [ ] Add new gallery items from recent shoots

Monthly:
- [ ] Update site content and information
- [ ] Review and optimize image files
- [ ] Check analytics and adjust content strategy

Quarterly:
- [ ] Backup important data
- [ ] Review and update SEO metadata
- [ ] Add new features or sections as needed
