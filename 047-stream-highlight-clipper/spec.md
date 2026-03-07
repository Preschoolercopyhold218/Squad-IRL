# Stream Highlight Clipper — Specification

## Goal
Analyze a gaming stream transcript/VOD and identify the most highlight-worthy moments for clipping — the plays, reactions, and interactions that will drive views on YouTube, TikTok, and Twitch clips.

## Target Audience
Gaming streamers and content creators who stream for hours but need to efficiently identify and package their best moments into clips that grow their audience.

## Requirements
1. Identify 8-12 potential highlight moments from the stream, ranked by clip potential
2. Categorize each moment: Insane Play, Funny Reaction, Chat Interaction, Rage Moment, Clutch/Comeback, Wholesome Moment, Fail/Blooper
3. Provide timestamp ranges (start and end) for each clip with 5-10 seconds of lead-in context
4. Rate each clip's viral potential on a scale of 1-10 with reasoning
5. Suggest a clip title and 3-5 hashtags optimized for each platform (YouTube Shorts, TikTok, Twitch)
6. Recommend which moments to combine into a "best of" compilation vs standalone clips
7. Identify the single best "hook moment" — the first 3 seconds that stop someone from scrolling
8. Note any audio issues, dead air, or content that would need editing out
9. Suggest thumbnail freeze-frame timestamps for YouTube
10. Flag any content that might cause DMCA or ToS issues (copyrighted music, etc.)

## Output Format
Ranked clip list with timestamps → Per-clip details (category, title, hashtags, viral rating, hook moment) → Compilation recommendations → Technical notes → Thumbnail suggestions

## Quality Criteria
- Moments genuinely have entertainment value, not just "something happened"
- Titles are clickable without being clickbait — honest but compelling
- Hashtags are actually used and trending, not generic
- Clip boundaries include enough context to understand what happened
- Recommendations show understanding of what performs on each platform
