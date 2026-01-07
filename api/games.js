export default async function handler(req, res) {
  const gameIds = [
    "97933863292428",
    "130990743301006",
    "96718821566717",
    "74750654936860",
    "128691296330901"
  ];

  try {
    const statsRes = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${gameIds.join(",")}`
    );
    const statsData = await statsRes.json();

    const thumbsRes = await fetch(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${gameIds.join(",")}&size=512x512&format=Png&isCircular=false`
    );
    const thumbsData = await thumbsRes.json();

    const games = statsData.data.map(game => {
      const thumb = thumbsData.data.find(t => t.targetId === game.id);
      return {
        id: game.id,
        name: game.name,
        playing: game.playing,
        visits: game.visits,
        thumbnail: thumb?.imageUrl || "",
        link: `https://www.roblox.com/games/${game.id}`
      };
    });

    res.status(200).json(games);
  } catch {
    res.status(500).json({ error: "Failed to fetch Roblox data" });
  }
}
