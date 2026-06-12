import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "9ircbu89",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const properties = [
  { title: "Uitzonderlijke woning", city: "Riemst", price: 499900, beds: 3, area: 184, type: "Woning", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/37a82c560dbb96f18b8873a9caf0162fd6f6afe6ac0c2afd1215f32039d45275.jpg" },
  { title: "Woning", city: "Hasselt", price: 497500, beds: 4, area: 317, type: "Woning", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/172665be853b9304b85d3d9985b5a173ac20790519bde98a2443df865ba08931.jpg" },
  { title: "Residentie Heritage", city: "Hasselt", price: 335000, beds: null, area: null, type: "Nieuwbouw", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/ea934139bf4f647fc640fb059a1c2453416cf61cdf88c0efa74e129f5e83ac2c.jpg" },
  { title: "Woning", city: "Houthalen", price: 497500, beds: 4, area: 227, type: "Woning", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/eb950f7b3db404337c9b22c41b363b424694552f45c2e2c0e0c083edd0cbef2a.jpg" },
  { title: "Appartement", city: "Wellen", price: 299000, beds: 2, area: 89, type: "Appartement", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/d72d2215d780bda4d55af4274e9ca054d2ee8a54845fc60e02b050190ccef31f.JPG" },
  { title: "Appartement", city: "Maasmechelen", price: 349000, beds: 2, area: 100, type: "Appartement", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/23982381d1c36c34473e13cb3821ef8c9bd7ecae6d33cf13ffd141ecf729cfa6.jpg" },
  { title: "Handelspand met woonst", city: "Zoutleeuw", price: 349900, beds: 3, area: 170, type: "Handelspand", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/9bc922ece9d7463a4e56f8eb9b3fccdc58529a833ed60b6f21c84a575bf23a33.jpg" },
  { title: "Eengezinswoning", city: "As", price: 419000, beds: 4, area: 201, type: "Woning", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/f4256c67a33c0dd15ff516d17e1cdb685f445b3a9c2bc65852d12b2e57e8fbd4.jpg" },
  { title: "Penthouse", city: "Diest", price: 419000, beds: 2, area: 122, type: "Appartement", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/f6020e0eab0f558ac9bafc45a369043429d8e9dee14c026d102f95481d8aea5f.jpg" },
  { title: "Appartement", city: "Hasselt", price: 274900, beds: 2, area: 90, type: "Appartement", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/81003d90c9693a5488b220c6e328e442d5d3af920a9c2d71d473856e198780e7.jpg" },
  { title: "Appartement", city: "Heusden-Zolder", price: 339000, beds: 3, area: 117, type: "Appartement", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/32c4be2155f1a352726851e801315331baafab5971a69cc2aa22c35279086a42.jpg" },
  { title: "Eengezinswoning", city: "Genk", price: 397000, beds: 4, area: 173, type: "Woning", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/5141383175ed9dca26f1f77aab0a4307bf98064df137b1ca586b26a30a0ff471.jpg" },
  { title: "Hof ter Linden", city: "Diepenbeek", price: 250000, beds: null, area: null, type: "Nieuwbouw", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/359a2ebb561a90b0455e5b2e88a3143fadd79922fa73e8235eb715ef07de2dd9.jpg" },
  { title: "Appartement", city: "Hasselt", price: 436500, beds: 2, area: 95, type: "Appartement", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/0d0a5c55152680c8dba6bbabb7c811a8b41044965c1926aa535caeca0228a4e7.jpg" },
  { title: "Residentie Thonis", city: "Hasselt", price: 440000, beds: null, area: null, type: "Nieuwbouw", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/7f9c76e698137b02ea52a2b1f024087423f0fa129c54b1f9f4238ac3953987d1.jpg" },
  { title: "Villa58", city: "Sint-Truiden", price: 325000, beds: null, area: null, type: "Nieuwbouw", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/2c46a7e2d9c3985540b8f63c2e2e2a32f0e62184d95d7634b73e4a871bfcce26.jpg" },
  { title: "Eengezinswoning", city: "Bilzen", price: 274900, beds: 4, area: 179, type: "Woning", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/3d81abf824556f4d0f1c4e136740b32bbc4756b933df5bd7f4caf7ed49fa7b0f.jpg" },
  { title: "Residentie Diesterhof", city: "Tessenderlo", price: 395000, beds: null, area: null, type: "Nieuwbouw", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/ac1f34883e8d731941cf91862b73b4921a9f6f285f296e4ff6920622aae2e788.jpg" },
  { title: "Handelspand met woonst", city: "Hasselt", price: 449000, beds: 4, area: 310, type: "Handelspand", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/c02eded065ff5b18314979d66e349aa28952e6735cfc98cf2a8bae6ccfc5f523.JPG" },
  { title: "Appartement", city: "Hasselt", price: 559000, beds: 2, area: 135, type: "Appartement", status: "Te koop", image: "https://files.zabun.be/upload/3489/images/c09361f19f98398a6e541d48a8965b048eca0ef9cca7a815ec4c47707e9e1a72.JPG" },
];

async function importProperties() {
  console.log(`Importing ${properties.length} properties to Sanity...`);

  const mutations = properties.map((p, i) => ({
    createOrReplace: {
      _type: "property",
      _id: `som-property-${i + 1}`,
      title: p.title,
      city: p.city,
      price: p.price,
      priceLabel: `€ ${p.price.toLocaleString("nl-BE")}`,
      beds: p.beds,
      area: p.area,
      type: p.type,
      status: p.status,
      imageUrl: p.image,
      slug: { _type: "slug", current: `${p.title.toLowerCase().replace(/\s+/g, "-")}-${p.city.toLowerCase()}-${i + 1}` },
    },
  }));

  try {
    const result = await client.mutate(mutations);
    console.log(`✅ Imported ${result.results.length} properties successfully!`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

importProperties();
