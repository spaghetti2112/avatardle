// --- BOOT BEACON:  charcters.js ---
(function(){
  const stamp = new Date().toISOString();
  console.log("[Avatardle] charcters.js loaded at", stamp);
  const beacon = document.createElement("div");
  beacon.style.cssText = "position:fixed;right:12px;bottom:12px;background:#111827;color:#fff;padding:8px 10px;border-radius:8px;z-index:9999;font:12px/1.3 system-ui";
  beacon.textContent = "charcters.js loaded • " + stamp;
  document.body.appendChild(beacon);



window.characters = [
  // --- AVATAR: THE LAST AIRBENDER (Humans) ---
  { "name": "Aang", "bending": "Airbender/Avatar", "origin": "Southern Air Temple", "appearance": "ATLA", "type": "Avatar" },
  { "name": "Katara", "bending": "Waterbender", "origin": "Southern Water Tribe", "appearance": "ATLA", "type": "Human" },
  { "name": "Sokka", "bending": "Non-bender", "origin": "Southern Water Tribe", "appearance": "ATLA", "type": "Human" },
  { "name": "Toph", "bending": "Earthbender/Metalbender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Human" },
  { "name": "Zuko", "bending": "Firebender", "origin": "Fire Nation", "appearance": "ATLA", "type": "Human" },
  { "name": "Azula", "bending": "Firebender", "origin": "Fire Nation Capital", "appearance": "ATLA", "type": "Human" },
  { "name": "Iroh", "bending": "Firebender", "origin": "Fire Nation", "appearance": "ATLA", "type": "Human" },
  { "name": "Mai", "bending": "Non-bender", "origin": "Fire Nation", "appearance": "ATLA", "type": "Human" },
  { "name": "Ty Lee", "bending": "Non-bender", "origin": "Fire Nation", "appearance": "ATLA", "type": "Human" },
  { "name": "Suki", "bending": "Non-bender", "origin": "Kyoshi Island", "appearance": "ATLA", "type": "Human" },
  { "name": "Haru", "bending": "Earthbender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Human" },
  { "name": "The Boulder", "bending": "Earthbender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Human" },
  { "name": "Jet", "bending": "Non-bender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Human" },
  { "name": "Smellerbee", "bending": "Non-bender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Human" },
  { "name": "Pipsqueak", "bending": "Non-bender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Human" },
  { "name": "Longshot", "bending": "Non-bender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Human" },
  { "name": "June", "bending": "Non-bender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Human" },
  { "name": "Piandao", "bending": "Non-bender", "origin": "Shu Jing", "appearance": "ATLA", "type": "Human" },
  { "name": "Combustion Man", "bending": "Firebender (Combustionbender)", "origin": "Unknown", "appearance": "ATLA", "type": "Human" },
  { "name": "Long Feng", "bending": "Earthbender", "origin": "Ba Sing Se", "appearance": "ATLA", "type": "Human" },
  { "name": "Cabbage Merchant", "bending": "Non-bender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Human" },
  { "name": "Teo", "bending": "Non-bender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Human" },
  { "name": "Mechanist", "bending": "Non-bender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Human" },
  { "name": "General Fong", "bending": "Earthbender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Human" },
  { "name": "Hama", "bending": "Waterbender (Bloodbender)", "origin": "Southern Water Tribe", "appearance": "ATLA", "type": "Human" },
  { "name": "Master Pakku", "bending": "Waterbender", "origin": "Northern Water Tribe", "appearance": "ATLA", "type": "Human" },
  { "name": "Yue", "bending": "Non-bender", "origin": "Northern Water Tribe", "appearance": "ATLA", "type": "Human" },
  { "name": "Arnook", "bending": "Non-bender", "origin": "Northern Water Tribe", "appearance": "ATLA", "type": "Human" },
  { "name": "Hahn", "bending": "Non-bender", "origin": "Northern Water Tribe", "appearance": "ATLA", "type": "Human" },
  { "name": "Jin", "bending": "Non-bender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Human" },
  { "name": "Hakoda", "bending": "Non-bender", "origin": "Southern Water Tribe", "appearance": "ATLA", "type": "Human" },
  { "name": "Kanna", "bending": "Non-bender", "origin": "Southern Water Tribe", "appearance": "ATLA", "type": "Human" },
  { "name": "Kya", "bending": "Non-bender", "origin": "Southern Water Tribe", "appearance": "ATLA", "type": "Human" },
  { "name": "Jeong Jeong", "bending": "Firebender", "origin": "Fire Nation", "appearance": "ATLA", "type": "Human" },
  { "name": "King Bumi", "bending": "Earthbender", "origin": "Omashu", "appearance": "ATLA", "type": "Human" },
  { "name": "King Kuei", "bending": "Non-bender", "origin": "Ba Sing Se", "appearance": "ATLA", "type": "Human" },
  { "name": "Guru Pathik", "bending": "Non-bender", "origin": "Eastern Air Temple", "appearance": "ATLA", "type": "Human" },
  { "name": "Lo and Li", "bending": "Non-benders", "origin": "Fire Nation", "appearance": "ATLA", "type": "Human" },
  { "name": "Admiral Zhao", "bending": "Firebender", "origin": "Fire Nation", "appearance": "ATLA", "type": "Human" },
  { "name": "Ozai", "bending": "Firebender", "origin": "Fire Nation", "appearance": "ATLA", "type": "Human" },
  { "name": "Ursa", "bending": "Non-bender", "origin": "Fire Nation", "appearance": "ATLA", "type": "Human" },
  { "name": "Sozin", "bending": "Firebender", "origin": "Fire Nation", "appearance": "ATLA", "type": "Human" },
  { "name": "Azulon", "bending": "Firebender", "origin": "Fire Nation", "appearance": "ATLA", "type": "Human" },

  // Avatars in ATLA
  { "name": "Roku", "bending": "Firebender", "origin": "Fire Nation", "appearance": "ATLA", "type": "Avatar" },
  { "name": "Kyoshi", "bending": "Earthbender", "origin": "Earth Kingdom", "appearance": "ATLA", "type": "Avatar" },
  { "name": "Kuruk", "bending": "Waterbender", "origin": "Northern Water Tribe", "appearance": "ATLA", "type": "Avatar" },
  { "name": "Yangchen", "bending": "Airbender", "origin": "Air Nomads", "appearance": "ATLA", "type": "Avatar" },

  // Spirits & Animals (ATLA)
  { "name": "Appa", "bending": "Sky Bison (Air)", "origin": "Air Nomads", "appearance": "ATLA", "type": "Animal" },
  { "name": "Momo", "bending": "Flying Lemur", "origin": "Air Nomads", "appearance": "ATLA", "type": "Animal" },
  { "name": "Wan Shi Tong", "bending": "Spirit", "origin": "Spirit World", "appearance": "ATLA", "type": "Spirit" },
  { "name": "Koh", "bending": "Spirit", "origin": "Spirit World", "appearance": "ATLA", "type": "Spirit" },
  { "name": "Hei Bai", "bending": "Spirit", "origin": "Spirit World", "appearance": "ATLA", "type": "Spirit" },
  { "name": "Bosco", "bending": "Bear", "origin": "Ba Sing Se", "appearance": "ATLA", "type": "Animal" },

  // --- THE LEGEND OF KORRA (Humans) ---
  { "name": "Korra", "bending": "Waterbender/Avatar", "origin": "Southern Water Tribe", "appearance": "LoK", "type": "Avatar" },
  { "name": "Mako", "bending": "Firebender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "Bolin", "bending": "Earthbender (Lavabender)", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "Asami Sato", "bending": "Non-bender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "Hiroshi Sato", "bending": "Non-bender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "Tenzin", "bending": "Airbender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "Pema", "bending": "Non-bender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "Jinora", "bending": "Airbender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "Ikki", "bending": "Airbender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "Meelo", "bending": "Airbender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "Rohan", "bending": "Airbender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "Lin Beifong", "bending": "Earthbender/Metalbender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "Suyin Beifong", "bending": "Earthbender/Metalbender", "origin": "Zaofu", "appearance": "LoK", "type": "Human" },
  { "name": "Opal", "bending": "Airbender", "origin": "Zaofu", "appearance": "LoK", "type": "Human" },
  { "name": "Kuvira", "bending": "Earthbender/Metalbender", "origin": "Earth Kingdom", "appearance": "LoK", "type": "Human" },
  { "name": "Aiwei", "bending": "Earthbender (Truthseer)", "origin": "Zaofu", "appearance": "LoK", "type": "Human" },
  { "name": "Baatar Sr.", "bending": "Non-bender", "origin": "Zaofu", "appearance": "LoK", "type": "Human" },
  { "name": "Baatar Jr.", "bending": "Non-bender", "origin": "Zaofu", "appearance": "LoK", "type": "Human" },
  { "name": "Varrick", "bending": "Non-bender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "Zhu Li", "bending": "Non-bender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "President Raiko", "bending": "Non-bender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },
  { "name": "General Iroh", "bending": "Firebender", "origin": "Fire Nation", "appearance": "LoK", "type": "Human" },

  // Northern Water Tribe / Unalaq arc
  { "name": "Amon", "bending": "Waterbender (Bloodbender)", "origin": "Northern Water Tribe", "appearance": "LoK", "type": "Human" },
  { "name": "Tarrlok", "bending": "Waterbender (Bloodbender)", "origin": "Northern Water Tribe", "appearance": "LoK", "type": "Human" },
  { "name": "Tonraq", "bending": "Waterbender", "origin": "Northern Water Tribe", "appearance": "LoK", "type": "Human" },
  { "name": "Unalaq", "bending": "Waterbender", "origin": "Northern Water Tribe", "appearance": "LoK", "type": "Human" },
  { "name": "Desna", "bending": "Waterbender", "origin": "Northern Water Tribe", "appearance": "LoK", "type": "Human" },
  { "name": "Eska", "bending": "Waterbender", "origin": "Northern Water Tribe", "appearance": "LoK", "type": "Human" },

  // Red Lotus
  { "name": "Zaheer", "bending": "Airbender", "origin": "Earth Kingdom", "appearance": "LoK", "type": "Human" },
  { "name": "Ghazan", "bending": "Earthbender (Lavabender)", "origin": "Earth Kingdom", "appearance": "LoK", "type": "Human" },
  { "name": "P'Li", "bending": "Firebender (Combustionbender)", "origin": "Fire Nation", "appearance": "LoK", "type": "Human" },
  { "name": "Ming-Hua", "bending": "Waterbender", "origin": "Water Tribe", "appearance": "LoK", "type": "Human" },

  // Earth Kingdom / Earth Queen arc
  { "name": "Earth Queen Hou-Ting", "bending": "Non-bender", "origin": "Ba Sing Se", "appearance": "LoK", "type": "Human" },
  { "name": "Prince Wu", "bending": "Non-bender", "origin": "Earth Kingdom", "appearance": "LoK", "type": "Human" },
  { "name": "Kai", "bending": "Airbender", "origin": "Earth Kingdom", "appearance": "LoK", "type": "Human" },

  // Pro-bending / Republic City flavor
  { "name": "Shiro Shinobi", "bending": "Non-bender", "origin": "Republic City", "appearance": "LoK", "type": "Human" },

  // Spirits (LoK)
  { "name": "Raava", "bending": "Spirit of Light", "origin": "Spirit World", "appearance": "LoK", "type": "Spirit" },
  { "name": "Vaatu", "bending": "Spirit of Darkness", "origin": "Spirit World", "appearance": "LoK", "type": "Spirit" },

  // First Avatar
  { "name": "Wan", "bending": "Firebender/Avatar", "origin": "Lion Turtle City", "appearance": "LoK", "type": "Avatar" }
];
})();
