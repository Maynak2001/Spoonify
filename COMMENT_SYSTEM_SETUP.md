# Comment System Setup

## Database Update Required

To enable the enhanced comment system with likes and replies, you need to run the SQL script in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `comment-system-update.sql`
4. Run the script

## Features Added

- **User Names**: Comments now display the full name of the user who posted them
- **Like System**: Users can like/unlike comments with heart icon and count
- **Reply System**: Users can reply to comments creating threaded discussions
- **Nested Display**: Replies are visually indented and connected to parent comments
- **Real-time Updates**: All interactions update immediately

## Usage

- Click the heart icon to like/unlike a comment
- Click "Reply" to respond to a comment
- Press Enter or click Send to submit replies
- All comments show the author's name and posting date