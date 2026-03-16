import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@pascalmathieu.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@Pascal2025!";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Pascal Mathieu",
        role: Role.ADMIN,
      },
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // Create biographie page
  const bioPage = await prisma.page.upsert({
    where: { slug: "biographie" },
    update: {},
    create: {
      slug: "biographie",
      title: "Biographie",
      content: `<h2>Pascal Mathieu</h2>
<p>Né à Besançon, Pascal Mathieu est un artiste aux multiples facettes. Chanteur, dessinateur et poète, il tisse depuis des décennies une œuvre à la fois intime et universelle, où les mots se marient aux mélodies et les images aux émotions.</p>
<p>Son univers artistique se nourrit des paysages franc-comtois, de la littérature française et d'une sensibilité poétique aiguisée. Ses chansons, à mi-chemin entre la chanson française traditionnelle et la poésie contemporaine, touchent au cœur de l'existence humaine.</p>
<h3>Parcours artistique</h3>
<p>Pascal Mathieu a commencé sa carrière musicale dans les années 1990, se produisant dans les cafés-théâtres et salles de spectacle de Franche-Comté. Son premier album, sorti en 1998, a révélé un auteur-compositeur doté d'une voix unique et d'une plume acérée.</p>
<p>Parallèlement à sa carrière musicale, Pascal développe une pratique du dessin et de la gravure, exposant régulièrement ses œuvres dans des galeries régionales et nationales. Cette double vie artistique nourrit son écriture et lui confère une profondeur visuelle rare.</p>
<h3>L'œuvre poétique</h3>
<p>Plusieurs recueils de poésie jalonnent son parcours, dont <em>Les Silences de Doubs</em> (2003) et <em>Fragments d'aurore</em> (2011), salués par la critique pour leur originalité et leur sensibilité.</p>`,
    },
  });
  console.log(`Page created/found: ${bioPage.slug}`);


  // Create site settings
  const settings = [
    {
      key: "site_title",
      value: "Pascal Mathieu — Chanteur · Dessinateur · Poète",
    },
    {
      key: "site_description",
      value:
        "Site officiel de Pascal Mathieu, artiste pluriel de Besançon. Découvrez son univers musical, poétique et graphique.",
    },
    { key: "contact_email", value: "contact@pascalmathieu.com" },
    // Page d'accueil — Héro
    {
      key: "home_intro",
      value:
        "Artiste pluriel ancré dans la terre franc-comtoise, Pascal Mathieu tisse depuis plus de trente ans un univers où la chanson, le dessin et la poésie se répondent et s'enrichissent mutuellement.",
    },
    // Page d'accueil — Portrait
    {
      key: "home_portrait_quote",
      value:
        "« Il y a dans la voix de Pascal Mathieu quelque chose d'indéfinissable — une façon de poser les mots qui fait résonner le silence autant que les notes. »",
    },
    {
      key: "home_portrait_text",
      value:
        "Né à Besançon, Pascal Mathieu grandit au contact d'une région dont il absorbe la rudesse douce, les paysages de brume et de forêt, les silences habités. Ce terreau devient la matière première d'une œuvre singulière, traversée par l'amour des mots, le soin du trait et l'exigence de la mélodie.",
    },
    // Page d'accueil — Trois univers
    {
      key: "home_chanteur_text",
      value:
        "Une voix grave et habitée, un répertoire de chansons originales en français qui puisent dans la tradition de la chanson à texte. Sur scène comme en studio, Pascal Mathieu fait du temps suspendu son territoire.",
    },
    {
      key: "home_dessinateur_text",
      value:
        "Le trait noir sur papier blanc — Pascal dessine depuis l'enfance des visages, des paysages intérieurs, des fragments de monde. Ses carnets sont le journal d'une sensibilité en éveil constant.",
    },
    {
      key: "home_poete_text",
      value:
        "Les mots débordent la mélodie. Pascal Mathieu écrit des textes qui circulent entre la chanson et le poème, habités par une quête du juste — celui qui dit sans trahir, qui nomme sans figer.",
    },
    // Page d'accueil — Région
    {
      key: "home_region_quote",
      value:
        "La Franche-Comté n'est pas un décor pour Pascal Mathieu — c'est une substance. Les lumières de la Boucle, les forêts du Doubs, la lenteur des saisons : tout cela transpire dans l'œuvre, sans folklore ni cliché.",
    },
    {
      key: "home_region_text",
      value:
        "Depuis plus de trente ans, il construit ici une œuvre discrète et persistante, loin des modes, fidèle à une certaine idée de l'artisanat artistique — où chaque chanson, chaque dessin, chaque poème est travaillé jusqu'à trouver sa forme juste.",
    },
    // Page d'accueil — CTA
    {
      key: "home_cta_title",
      value: "Entrer dans l'univers",
    },
    {
      key: "home_cta_text",
      value:
        "Concerts, albums, textes et dessins — tout est ici. Prenez le temps de vous perdre dans cet espace.",
    },
  ];

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
      },
    });
  }
  console.log("Site settings seeded");

  // Create sample album
  const sampleAlbum = await prisma.album.upsert({
    where: { slug: "les-silences-de-doubs" },
    update: {},
    create: {
      title: "Les Silences de Doubs",
      slug: "les-silences-de-doubs",
      year: 2003,
      description:
        "<p>Premier album de Pascal Mathieu, <em>Les Silences de Doubs</em> est une invitation au voyage intérieur. Onze chansons tissées de mots rares et de mélodies apaisantes, inspirées par les bords du Doubs et les lumières changeantes de Franche-Comté.</p><p>Un album fondateur qui révèle toute la singularité d'un artiste hors du commun.</p>",
      coverImage: "/images/placeholder-album.jpg",
      order: 1,
    },
  });
  console.log(`Album created/found: ${sampleAlbum.slug}`);

  // Create a sample article
  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (admin) {
    const sampleArticle = await prisma.article.upsert({
      where: { slug: "bienvenue-sur-le-nouveau-site" },
      update: {},
      create: {
        title: "Bienvenue sur le nouveau site",
        slug: "bienvenue-sur-le-nouveau-site",
        excerpt:
          "Le site officiel de Pascal Mathieu est désormais en ligne. Découvrez les actualités, la discographie et bien plus encore.",
        content:
          "<p>C'est avec une grande joie que je vous accueille sur ce nouveau site. Vous y trouverez toutes les actualités concernant mes créations musicales, poétiques et graphiques.</p><p>N'hésitez pas à me laisser vos impressions dans la section témoignages. Votre regard sur mon travail m'est précieux.</p><p>À très bientôt,</p><p><em>Pascal</em></p>",
        status: "PUBLISHED",
        authorId: admin.id,
        publishedAt: new Date(),
      },
    });
    console.log(`Article created/found: ${sampleArticle.slug}`);
  }

  // Create sample testimonials
  const testimonials = [
    {
      author: "Marie-Claire Dupont",
      role: "Journaliste culturelle",
      content:
        "L'univers de Pascal Mathieu est d'une rare cohérence. Sa voix, ses dessins, ses poèmes forment un tout indissociable, une œuvre qui marque durablement.",
      status: "APPROVED" as const,
    },
    {
      author: "Jean-Pierre Moreau",
      role: "Libraire",
      content:
        "Ses recueils de poésie sont parmi les plus beaux que j'aie eu la chance de lire ces dernières années. Une sensibilité à fleur de peau.",
      status: "APPROVED" as const,
    },
    {
      author: "Sophie Lefevre",
      role: "Spectatrice",
      content:
        "Un concert inoubliable à Besançon. La salle entière était suspendue à chacun de ses mots. Un artiste rare.",
      status: "APPROVED" as const,
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { author: t.author },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
      console.log(`Testimonial created for: ${t.author}`);
    }
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
