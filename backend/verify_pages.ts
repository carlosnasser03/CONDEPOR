const API = "http://localhost:4000";

async function verifyPages() {
  console.log("Checking Root Endpoint...");
  const root: any = await fetch(API, { headers: { Accept: "application/json" } }).then(r => r.json());
  console.log("Root JSON activeCategory:", JSON.stringify(root.activeCategory));
  
  for (const [name, path] of Object.entries(root.endpoints)) {
    console.log(`\nTesting endpoint: ${name} -> ${path}`);
    try {
      const res = await fetch(API + path);
      console.log("  Status:", res.status);
      const data: any = await res.json();
      console.log("  Response keys:", Object.keys(data));
      if (data.error) console.log("  ERROR IN RESPONSE:", data.error);
      if (name === "standings" && data.standings) {
        console.log("  First standing team:", data.standings[0]?.teamName);
      }
      if (name === "topScorers" && data.scorers) {
        console.log("  First scorer:", data.scorers[0]?.playerName);
      }
      if (name === "matches" && data.data) {
        console.log("  Matches found:", data.data.length);
      }
      if (name === "teams" && data.teams) {
        console.log("  Teams found:", data.teams.length, "in category:", data.categoryName);
      }
    } catch (e: any) {
      console.log("  FETCH ERROR:", e.message);
    }
  }
}

verifyPages();
