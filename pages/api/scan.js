const BEARER = process.env.TWITTER_BEARER_TOKEN;

const ARC_KEYWORDS = [
  'arc','arcnetwork','arc network','arc_network',
  'arcprotocol','arc protocol','arcbuilders',
  'arcarchitects','arc architects','arccommunity',
  '#arc','#arcnetwork','#arcbuilders','#arcarchitects'
];

async function xFetch(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${BEARER}` }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.title || `X API error ${res.status}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Username required' });
  if (!BEARER) return res.status(500).json({ error: 'Add TWITTER_BEARER_TOKEN to Vercel environment variables' });

  try {
    const clean = username.replace('@', '').trim();

    const userUrl = `https://api.twitter.com/2/users/by/username/${clean}?user.fields=name,username,profile_image_url,public_metrics`;
    const userData = await xFetch(userUrl);
    if (!userData.data) return res.status(404).json({ error: `User @${clean} not found` });
    const user = userData.data;

    const tweetsUrl = `https://api.twitter.com/2/users/${user.id}/tweets?max_results=100&tweet.fields=text,created_at,public_metrics,in_reply_to_user_id`;
    const tweetsData = await xFetch(tweetsUrl);
    const tweets = tweetsData.data || [];

    let arcMatches = 0, replyCount = 0, retweetCount = 0, matched = [];
    for (const t of tweets) {
      const txt = (t.text || '').toLowerCase();
      const isArc = ARC_KEYWORDS.some(k => txt.includes(k.toLowerCase()));
      if (isArc) {
        arcMatches++;
        matched.push(t);
        if (txt.startsWith('rt @')) retweetCount++;
        else if (t.in_reply_to_user_id) replyCount++;
      }
    }

    const total = tweets.length;
    let score = total > 0 ? Math.round((arcMatches / total) * 100 * 2.5) : 0;
    score = Math.min(99, score + replyCount * 3 + retweetCount * 2);
    score = Math.max(0, Math.min(99, score));

    return res.status(200).json({
      user: {
        name: user.name,
        username: user.username,
        avatar: (user.profile_image_url || '').replace('_normal', '_bigger'),
        followers: user.public_metrics?.followers_count || 0,
        tweets: user.public_metrics?.tweet_count || 0,
      },
      analysis: {
        score, totalTweets: total, arcMatches,
        replyCount, retweetCount,
        matchedTweets: matched.slice(0, 5),
        engagementRate: total > 0 ? ((arcMatches / total) * 100).toFixed(1) : '0.0'
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
      }
