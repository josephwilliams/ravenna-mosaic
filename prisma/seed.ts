import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.cardTag.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.card.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.column.deleteMany();
  await prisma.board.deleteMany();

  // Tags
  const tagDefense = await prisma.tag.create({ data: { name: "Defense", color: "#b85c38" } });
  const tagDiplomacy = await prisma.tag.create({ data: { name: "Diplomacy", color: "#4a7c9b" } });
  const tagCoin = await prisma.tag.create({ data: { name: "Coin", color: "#b8963e" } });
  const tagSmallfolk = await prisma.tag.create({ data: { name: "Smallfolk", color: "#5e8a65" } });
  const tagInfra = await prisma.tag.create({ data: { name: "Infrastructure", color: "#8a7560" } });

  const board = await prisma.board.create({
    data: { title: "The Small Council" },
  });

  const petitions = await prisma.column.create({
    data: { boardId: board.id, title: "Petitions", position: 0 },
  });
  const inCouncil = await prisma.column.create({
    data: { boardId: board.id, title: "In Council", position: 1 },
  });
  const awaitingCrown = await prisma.column.create({
    data: { boardId: board.id, title: "Awaiting the Crown", position: 2 },
  });
  const decreed = await prisma.column.create({
    data: { boardId: board.id, title: "Decreed", position: 3 },
  });

  // Cards + tag assignments
  const c1 = await prisma.card.create({
    data: {
      columnId: petitions.id,
      title: "Investigate dragon sightings near the Kingswood",
      description: "Smallfolk report scorched fields and missing livestock. Likely a stray from Dragonstone, but could be worse.",
      position: 0,
      priority: "HIGH",
    },
  });
  await prisma.cardTag.createMany({ data: [{ cardId: c1.id, tagId: tagDefense.id }] });

  const c2 = await prisma.card.create({
    data: {
      columnId: petitions.id,
      title: "Settle the Bracken-Blackwood border dispute (again)",
      description: "Both houses claim the river fork. This is the fourth petition this year.",
      position: 1,
      priority: "MEDIUM",
    },
  });
  await prisma.cardTag.createMany({ data: [{ cardId: c2.id, tagId: tagDiplomacy.id }] });

  const c3 = await prisma.card.create({
    data: {
      columnId: petitions.id,
      title: "Ratify new tariffs on Essosi silk imports",
      description: "The Guilds are complaining. The Crown needs the revenue. Someone has to do the arithmetic.",
      position: 2,
      priority: "LOW",
    },
  });
  await prisma.cardTag.createMany({ data: [{ cardId: c3.id, tagId: tagCoin.id }] });

  const c4 = await prisma.card.create({
    data: {
      columnId: petitions.id,
      title: "Address smallfolk complaints about the tourney grounds",
      description: "Apparently the last melee destroyed three market stalls and a tavern.",
      position: 3,
      priority: "LOW",
    },
  });
  await prisma.cardTag.createMany({ data: [{ cardId: c4.id, tagId: tagSmallfolk.id }] });

  const c5 = await prisma.card.create({
    data: {
      columnId: inCouncil.id,
      title: "Find replacement Master of Coin",
      description: "The previous one met an unfortunate end involving a balcony. Applications are understandably slow.",
      position: 0,
      priority: "HIGH",
    },
  });
  await prisma.cardTag.createMany({ data: [{ cardId: c5.id, tagId: tagCoin.id }, { cardId: c5.id, tagId: tagDiplomacy.id }] });

  const c6 = await prisma.card.create({
    data: {
      columnId: inCouncil.id,
      title: "Repair the King's Road south of the Crossroads",
      description: "Bandits, potholes, and at least one collapsed bridge. The merchants are routing through the Neck instead.",
      position: 1,
      priority: "MEDIUM",
    },
  });
  await prisma.cardTag.createMany({ data: [{ cardId: c6.id, tagId: tagInfra.id }] });

  const c7 = await prisma.card.create({
    data: {
      columnId: awaitingCrown.id,
      title: "Commission new tapestries for the Great Hall",
      description: "The old ones depict a dynasty we're pretending never existed.",
      position: 0,
      priority: "MEDIUM",
    },
  });
  await prisma.cardTag.createMany({ data: [{ cardId: c7.id, tagId: tagCoin.id }, { cardId: c7.id, tagId: tagSmallfolk.id }] });

  const c8 = await prisma.card.create({
    data: {
      columnId: decreed.id,
      title: "Hire a new Hand's tournament master of ceremonies",
      description: "Done. Ser Gareth of Oldtown accepted. Gods help him.",
      position: 0,
      priority: "LOW",
    },
  });
  await prisma.cardTag.createMany({ data: [{ cardId: c8.id, tagId: tagSmallfolk.id }] });

  console.log("Seeded: The Small Council — 4 columns, 8 cards, 5 tags");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
