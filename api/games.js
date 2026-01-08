export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Universe → Place mapping
  const GAME_MAP = {
    "7126264355": "130990743301006",
    "7150991427": "97933863292428",
    "7439503251": "96718821566717",
    "7242199945": "74750654936860",
    "9352802009": "128691296330901"
  };

  const universeIds = Object.keys(GAME_MAP);

  try {
    // Fetch stats
    const statsRes = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${universeIds.join(",")}`
    );
    const statsData = await statsRes.json();

    // Fetch thumbnails
    const thumbsRes = await fetch(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeIds.join(",")}&size=512x512&format=Png&isCircular=false`
    );
    const thumbsData = await thumbsRes.json();

    const games = statsData.data.map(game => {
      const thumb = thumbsData.data.find(t => t.targetId === game.id);
      const placeId = GAME_MAP[String(game.id)];

      return {
        universeId: game.id,
        placeId: placeId,
        name: game.name,
        playing: game.playing,
        visits: game.visits,
        thumbnail: thumb?.imageUrl || "",
        playUrl: `https://www.roblox.com/games/${placeId}`
      };
    });

    res.status(200).json(games);
  } catch (err) {
    console.error("Roblox API failed:", err);
    res.status(500).json({ error: "Failed to fetch Roblox data" });
  }
}
