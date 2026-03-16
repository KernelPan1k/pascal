import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@pascalmathieu-artiste.fr";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@Pascal2025!";

  // ─── Nettoyage ─────────────────────────────────────────────────────────────
  await prisma.article.deleteMany();
  await prisma.album.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.page.deleteMany();
  await prisma.siteSettings.deleteMany();
  console.log("Base nettoyée");

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: { email: adminEmail, password: hashedPassword, name: "Pascal Mathieu", role: Role.ADMIN },
    });
    console.log(`Admin créé : ${adminEmail}`);
  } else {
    console.log(`Admin déjà existant : ${adminEmail}`);
  }

  // ─── Biographie ────────────────────────────────────────────────────────────
  const biographieContent = `<h2>Pascal Mathieu (1961 – 2025)</h2>

<p>Pascal Mathieu naît le 12 avril 1961 à Besançon (Doubs). Chanteur, poète et parolier, il consacre quarante ans de sa vie à la chanson française à texte, tout en animant des ateliers d'écriture dans toute la région Bourgogne-Franche-Comté. Il s'éteint le 15 octobre 2025 à l'âge de 64 ans, des suites d'une maladie foudroyante.</p>

<h3>Les débuts (1985–1986)</h3>

<p>Pascal fait ses premières apparitions scéniques dès 1985 à Besançon, dans des concerts liés à la mouvance anarchiste bisontine — notamment une soirée organisée par le groupe Proudhon de la Fédération anarchiste. Il se forme dans l'effervescence punk et rock de la ville, posant des textes incisifs sur des musiques entre rock et proto-électronique. Il se décrit lui-même comme un <em>« ex-poète punk »</em> : <em>« Au début je ne chantais pas, je hurlais principalement. »</em></p>

<p>En 1986, il crée son premier spectacle, <em>Pascal Mathieu court à sa perte</em>, et sort une cassette du même titre. Il se produit cette année-là au <strong>Printemps de Bourges</strong> (10e édition, 125 000 spectateurs), dont il est la révélation. Ce soir-là reste, de son propre aveu, le souvenir le plus fort de sa vie d'artiste : <em>« Je suis sorti de là sur un nuage absolu. »</em></p>

<h3>Premier album et Prix Charles Cros (1995)</h3>

<p>Après neuf ans de concerts et d'écriture, Pascal sort son premier album en octobre 1995 : <em>En attendant des jours pires</em>, chez JPP Factories. L'Académie Charles Cros lui décerne immédiatement son <strong>Prix</strong> — première distinction d'une institution qui le récompensera une seconde fois douze ans plus tard. L'album, en quatorze titres, porte la marque d'une langue travaillée au corps : humour noir, révolte contenue, jeux de mots structurels.</p>

<h3>Parolier : Romain Didier, Pinocchio, Florent Marchet (2000–2008)</h3>

<p>Dans les années 2000, Pascal s'impose comme parolier pour d'autres artistes, sans jamais abandonner sa propre scène.</p>

<p>Avec <strong>Romain Didier</strong>, il co-écrit <em>Pinocchio court toujours</em> — un opéra pour enfants en 45 tableaux, commande de l'École de musique de Belfort. Le disque, enregistré avec l'Ensemble Orchestral des Hauts-de-Seine (34 musiciens) et 70 choristes, réunit <strong>Pierre Perret</strong> (Gepetto), <strong>Enzo Enzo</strong> (la Fée Bleue), <strong>Sanseverino</strong> (le Grillon), <strong>Mathias Malzieu</strong> de Dionysos (le Thon), <strong>Jean Guidoni</strong> (le Chat) et <strong>Kent</strong> (le Renard). Pascal y tient lui-même le rôle du Garçon. Publié en 2006 en livre-CD aux Éditions Éveil et Découvertes (illustrations de Flavia Sorrentino), il reçoit en 2007 le <strong>Grand Prix de l'Académie Charles Cros — catégorie jeune public</strong>.</p>

<p>En 2005, il signe dix des onze titres de <em>Chapitre Neuf</em>, neuvième album de Romain Didier (Tacet Production, 7 novembre 2005) — le onzième étant confié à <strong>Alain Leprest</strong>. Un spectacle est créé en décembre 2005 au Divan du Monde à Paris. Il collabore également avec <strong>Florent Marchet</strong> et <strong>Jean Guidoni</strong>.</p>

<h3>Le retour à sa propre voix (2008–2013)</h3>

<p>En 2008, treize ans après son premier album, paraît <em>Routines aventurières</em> (Mirabilis Production). Les compositions sont partagées entre <strong>Bernard Montrichard</strong> (guitare), Romain Didier et Florent Marchet. <strong>Flavien Van Landuyt</strong> assure la basse et la programmation, <strong>Emmanuelle Miton</strong> le violoncelle. L'album, en treize titres, marque un tournant vers une mélancolie plus apaisée.</p>

<p>Le 7 mars 2013, <em>Sans motif apparent</em> sort chez Troll's Production. Les musiques sont entièrement composées par <strong>Claude Mairet</strong> — guitariste historique d'Hubert-Félix Thiéfaine, qui compose à cette période l'essentiel du répertoire de concert de Pascal. La soirée de lancement a lieu à <strong>La Rodia</strong> (Besançon), mise en scène par Sébastien Barberon. L'album est unanimement salué comme son disque le plus abouti.</p>

<h3>L'écriture en scène et les ateliers (2017–2025)</h3>

<p>Le 22 avril 2017, Pascal crée l'association <strong>Pascal Mathieu, L'écriture en scène</strong> (loi 1901), domiciliée à l'Espace associatif des Bains Douches, 1 rue de l'École, Besançon. Son objet : développer des activités culturelles et artistiques autour de l'écriture en langue française, et promouvoir les pratiques de solidarité par la culture. Pascal anime des ateliers d'écriture dans toute la région Bourgogne-Franche-Comté, notamment à l'Université de Franche-Comté, et siège au jury du Tremplin d'écriture de textes de chansons de Besançon.</p>

<p>Le 24 février 2018, il réalise un concert en solo à l'<strong>Atelier de Petite Fleur</strong> (Besançon) — première fois qu'il monte seul sur scène, s'accompagnant à l'ukulélé électrique et acoustique, au kalimba basse et à la boîte à musique. Le même été, du 5 au 29 juillet 2018, <em>Chacun sa famille</em> — une vingtaine de chansons écrites par Pascal sur des musiques de Romain Didier, interprétées par <strong>Enzo Enzo</strong> et <strong>Laurent Viel</strong> — se joue au Théâtre Le Cabestan dans le cadre d'Avignon Off. Le spectacle, mis en scène par Gérard Morel, est jugé « incontournable » par <em>La Terrasse</em> et revient à Avignon l'été suivant (5–27 juillet 2019).</p>

<p>En février 2025, Pascal se produit encore à <strong>Baume-les-Dames</strong>. Il s'éteint le 15 octobre 2025. France 3 Bourgogne-Franche-Comté le décrit comme « l'un des plus grands paroliers français ».</p>

<h3>Discographie</h3>
<ul>
<li><em>Pascal Mathieu court à sa perte</em> — cassette, 1986</li>
<li><em>En attendant des jours pires</em> — JPP Factories, octobre 1995 · <strong>Prix Charles Cros</strong></li>
<li><em>Pinocchio court toujours</em> (livret) — Éveil et Découvertes, 2006 · <strong>Grand Prix Charles Cros Jeune Public 2007</strong></li>
<li><em>Routines aventurières</em> — Mirabilis Production, 2008</li>
<li><em>Sans motif apparent</em> — Troll's Production, 7 mars 2013</li>
</ul>

<h3>Principales collaborations</h3>
<ul>
<li><strong>Romain Didier</strong> — <em>Chapitre Neuf</em> (2005), <em>Pinocchio court toujours</em>, <em>Chacun sa famille</em> (2018)</li>
<li><strong>Florent Marchet</strong> — compositions partagées sur <em>Routines aventurières</em> et autres</li>
<li><strong>Claude Mairet</strong> — compositions de <em>Sans motif apparent</em> (2013) et répertoire de concert</li>
<li><strong>Jean Guidoni</strong> — textes de chansons (à partir de 2011)</li>
<li><strong>Bernard Montrichard</strong> — compositions et guitare sur <em>Routines aventurières</em></li>
</ul>`;
  await prisma.page.create({
    data: { slug: "biographie", title: "Biographie", content: biographieContent },
  });
  console.log("Page biographie mise à jour");

  // ─── Albums ────────────────────────────────────────────────────────────────
  const albums = [
    {
      slug: "en-attendant-des-jours-pires",
      title: "En attendant des jours pires",
      year: 1995,
      order: 1,
      description: `<p>Le titre lui-même est une déclaration de méthode : ni désespoir romantique ni provocation calculée, mais ce gallimatias particulier qui consiste à rire de ce qui fait mal, sans anesthésie. <em>En attendant des jours pires</em> paraît en octobre 1995 chez JPP Factories — neuf ans après la révélation du Printemps de Bourges, neuf ans d'affûtage silencieux.</p>
<p>L'Académie Charles Cros lui décerne son prix sans attendre. Les textes sont à l'image de la formation de Pascal : une scène punk bisontine qui n'avait pas la patience des nuances, des musiques entre rock et proto-électronique, et cette voix qui ne cherche pas à plaire mais à tenir — à tenir debout dans une langue qui résiste.</p>
<p>Quatorze titres. Pas un de trop.</p>
<ol>
<li>Jennifer</li>
<li>Vague ciné</li>
<li>Un étendard des étendus</li>
<li>En attendant des jours pires</li>
<li>Passages cloutés</li>
<li>En vous et contre terre</li>
<li>Nicole pas d'bol</li>
<li>La ville</li>
<li>Quand je sors</li>
<li>Des nuages sur les vitres</li>
<li>Les vies d'amants</li>
<li>Hip hop</li>
<li>La mer</li>
<li>Le rapt</li>
</ol>`,
    },
    {
      slug: "pinocchio-court-toujours",
      title: "Pinocchio court toujours",
      year: 2006,
      order: 2,
      description: `<p>À l'origine, une commande pédagogique de l'École de musique de Belfort — un outil pour les conservatoires et les chorales. Pascal écrit le livret, Romain Didier compose. Ce qui devait rester dans les salles de répétition finit sur disque, puis dans les librairies.</p>
<p>Le conte de Collodi est découpé en 45 tableaux alternant chansons et dialogues. Pinocchio court, grandit, résiste — et Pascal lui prête une langue qui fait de même. L'Ensemble Orchestral des Hauts-de-Seine (34 musiciens) et 70 choristes donnent à l'ensemble une ampleur inattendue pour une œuvre dite « jeune public ».</p>
<p>Le Grand Prix de l'Académie Charles Cros — catégorie jeune public — est décerné en 2007. C'est la deuxième fois que l'institution récompense Pascal, douze ans après le premier album. Même exigence, autre registre.</p>
<ul>
<li>Émile Allain (11 ans) — Pinocchio</li>
<li>Pierre Perret — Gepetto</li>
<li>Enzo Enzo — la Fée Bleue</li>
<li>Sanseverino — le Grillon</li>
<li>Mathias Malzieu (Dionysos) — le Thon</li>
<li>Jean Guidoni — le Chat</li>
<li>Romain Didier — Mangefeu</li>
<li>Pascal Mathieu — le Garçon</li>
<li>Kent — le Renard</li>
</ul>
<p>Direction : Laurent Brack. Publié en livre-CD aux Éditions Éveil et Découvertes, illustré par Flavia Sorrentino.</p>`,
    },
    {
      slug: "routines-aventurieres",
      title: "Routines aventurières",
      year: 2008,
      order: 3,
      description: `<p>Treize ans séparent ce deuxième album du premier. Treize ans de scène, de parolierat, de vie — et cela s'entend. La colère de 1995 ne s'est pas dissipée, elle a mûri en quelque chose de plus patient et, finalement, de plus dévastateur : une mélancolie qui sait exactement ce qu'elle fait.</p>
<p>Bernard Montrichard compose et joue de la guitare, Flavien Van Landuyt tient la basse et la programmation, Emmanuelle Miton le violoncelle. Romain Didier et Florent Marchet contribuent quelques compositions. L'ensemble est signé Mirabilis Production. Pascal, lui, résumera l'album avec la formule qu'on lui connaît : <em>« En quinze ans j'ai eu le temps de me faire larguer souvent. »</em></p>
<ol>
<li>T'es juste en retard</li>
<li>Salon</li>
<li>Avec Daisy</li>
<li>Que font les mains</li>
<li>L'amour le plus souvent</li>
<li>Ich love dich</li>
<li>Les liens sacrés</li>
<li>Le coin de verdure</li>
<li>Moi la mer</li>
<li>On revient</li>
<li>Remue</li>
<li>Radio hanneton</li>
<li>La noiraude</li>
</ol>`,
    },
    {
      slug: "sans-motif-apparent",
      title: "Sans motif apparent",
      year: 2013,
      order: 4,
      description: `<p>Dernier album personnel de Pascal, sorti le 7 mars 2013 chez Troll's Production. Les musiques sont de Claude Mairet — guitariste et compositeur dont la scène bisontine connaît l'importance, lui qui a longtemps collaboré avec Hubert-Félix Thiéfaine. Ensemble, ils trouvent l'équilibre exact : des mélodies qui ne dominent pas les textes, des textes qui n'écrasent pas la musique.</p>
<p>Trente-sept minutes, douze titres. Chaque chanson tient dans un espace réduit — pas de rembourrage, pas de longueur de confort. Le titre <em>S'aimer d'amour est un pléonasme</em> est à lui seul un programme : la langue prise au piège de ses propres redondances, retournée, désossée, rendue à quelque chose de plus vrai que le sens premier. Le dernier titre, <em>Vous qui êtes noyés</em>, sera relu autrement après sa disparition en 2025.</p>
<ol>
<li>Désir moins le quart</li>
<li>Autour du couteau</li>
<li>On transpire en commun</li>
<li>Avec Daisy</li>
<li>On se revoit lundi</li>
<li>Vers dix-huit heures</li>
<li>Ça fait du bien quand ça s'arrête</li>
<li>Senti mental</li>
<li>Sans motif apparent</li>
<li>Je vous suis à la lettre</li>
<li>S'aimer d'amour est un pléonasme</li>
<li>Vous qui êtes noyés</li>
</ol>`,
    },
  ];

  for (const album of albums) {
    await prisma.album.upsert({
      where: { slug: album.slug },
      update: { title: album.title, year: album.year, description: album.description, order: album.order },
      create: { ...album, coverImage: "/uploads/images/placeholder-album.jpg" },
    });
  }
  console.log("Albums mis à jour");

  // ─── Articles ──────────────────────────────────────────────────────────────
  const admin = await prisma.user.findFirst({
    where: { role: Role.ADMIN },
    orderBy: { id: "asc" },
  });
  if (admin) {
    const articles = [
      {
        slug: "printemps-de-bourges-1986",
        title: "1986 — Révélation au Printemps de Bourges",
        excerpt: "En 1986, Pascal crée son premier spectacle « Pascal Mathieu court à sa perte » et se produit au Printemps de Bourges, dont il est la révélation. Un tournant fondateur dans sa trajectoire.",
        content: `<p>Il y a des moments qui changent la trajectoire sans qu'on le sache encore. Pour Pascal, le Printemps de Bourges 1986 est de ceux-là. La dixième édition du festival, 125 000 spectateurs — il arrive de Besançon avec son premier spectacle, <em>Pascal Mathieu court à sa perte</em>, et sa première cassette.</p>
<p>Le titre mérite une pause. « Court à sa perte » : il court vers sa ruine, oui, mais il court. Le jeu est immédiat, le second degré tenu à distance juste ce qu'il faut pour rester debout. C'est déjà sa façon de faire — la langue comme terrain miné qu'on traverse en sachant où poser le pied.</p>
<p>Il remontera de scène, dira-t-il, <em>« sur un petit nuage absolu »</em>. Ce sera, de son propre aveu, le souvenir le plus fort de sa vie d'artiste. Avant cette nuit, il avait rodé ses textes dans les concerts de la scène anarchiste bisontine — <em>« Au début je ne chantais pas, je hurlais principalement »</em>, reconnaîtra-t-il plus tard. Bourges, c'est autre chose : une première confrontation avec un public qui ne le connaît pas et qui, ce soir-là, l'entend.</p>
<p>Il faudra encore neuf ans pour que le premier album paraisse. Neuf ans de patience, d'exigence, de concerts. Le Printemps de Bourges 1986 ne fait pas de Pascal une star — il fait de lui un artiste qui sait pourquoi il monte sur scène.</p>`,
        publishedAt: new Date("1986-04-01"),
      },
      {
        slug: "prix-charles-cros-1995",
        title: "1995 — Le Prix Charles Cros",
        excerpt: "Dès son premier album « En attendant des jours pires », Pascal est récompensé par l'Académie Charles Cros, l'une des distinctions les plus prestigieuses de la chanson française.",
        content: `<p>On ne sait jamais très bien ce que valent les prix. Ce qu'on sait, c'est ce que celui-ci dit du moment : en 1995, l'Académie Charles Cros choisit de distinguer un inconnu de Besançon dont c'est le premier disque. <em>En attendant des jours pires</em>, sorti en octobre chez JPP Factories, reçoit le prix sans délai.</p>
<p>L'album est le fruit de neuf ans de travail discret depuis la révélation de Bourges. Neuf ans pendant lesquels Pascal a continué à jouer, à écrire, à trouver sa voix — celle dont il dira lui-même qu'au début il hurlait plutôt qu'il ne chantait. Le Prix Charles Cros ne fait pas de lui un artiste reconnu du grand public. Il confirme, pour ceux qui savent lire ce genre de signal, qu'il y a là quelqu'un d'important.</p>
<p>L'Académie lui décernera une deuxième distinction, douze ans plus tard, pour <em>Pinocchio court toujours</em> — cette fois dans la catégorie jeune public. Deux prix, deux albums radicalement différents, une seule constante : l'exigence.</p>`,
        publishedAt: new Date("1995-11-01"),
      },
      {
        slug: "pinocchio-court-toujours",
        title: "Pinocchio court toujours — un opéra pour enfants",
        excerpt: "Pascal co-écrit avec Romain Didier un opéra pour enfants réunissant Pierre Perret, Enzo Enzo, Sanseverino et Mathias Malzieu. Commande de l'École de musique de Belfort, Grand Prix Charles Cros Jeune Public 2007.",
        content: `<p>L'École de musique de Belfort commande une œuvre pédagogique. Pascal écrit le livret, Romain Didier compose. Ce qui devait être un outil de conservatoire devient, au fil du travail, quelque chose d'autre — une œuvre à part entière, avec ses propres exigences et sa propre vie.</p>
<p>Le conte de Collodi est découpé en 45 tableaux. Pinocchio court, ment, grandit, résiste. Pascal lui prête une langue qui épouse ces mouvements sans les commenter : la chanson-tableau, le dialogue-charnière, le refrain qui revient comme une leçon qu'on n'a pas encore comprise. L'Ensemble Orchestral des Hauts-de-Seine — 34 musiciens — et 70 choristes (Chœur Curva Via, enfants du Conservatoire de Courbevoie) donnent à l'ensemble une dimension qui déborde largement le cadre pédagogique initial.</p>
<p>Le plateau réunit Pierre Perret (Gepetto), Enzo Enzo (la Fée Bleue), Sanseverino (le Grillon), Mathias Malzieu de Dionysos (le Thon), Jean Guidoni (le Chat), Kent (le Renard), Romain Didier (Mangefeu) — et Pascal lui-même dans le rôle du Garçon. Direction : Laurent Brack.</p>
<p>Le disque paraît en 2006, republié en livre-CD aux Éditions Éveil et Découvertes avec les illustrations de Flavia Sorrentino. En 2007, l'Académie Charles Cros lui décerne son Grand Prix jeune public — dans un registre que rien, dans sa trajectoire personnelle, ne laissait prévoir.</p>`,
        publishedAt: new Date("2007-06-01"),
      },
      {
        slug: "chapitre-neuf-romain-didier-2005",
        title: "Chapitre Neuf — parolier pour Romain Didier",
        excerpt: "En 2005, Pascal écrit dix des onze titres de l'album « Chapitre Neuf » de Romain Didier — le seul autre texte étant signé Alain Leprest. Une collaboration au sommet.",
        content: `<p>Romain Didier publie son neuvième album le 7 novembre 2005 chez Tacet Production. Sur onze titres, dix sont signés Pascal. Le onzième est d'Alain Leprest. C'est, sans autre commentaire, une indication du niveau auquel Pascal opère à cette période.</p>
<p>La collaboration entre les deux hommes est déjà ancienne — ils travaillent en parallèle sur <em>Pinocchio court toujours</em>. Mais <em>Chapitre Neuf</em> est autre chose : un album adulte, distribué nationalement, où les textes de Pascal rencontrent les mélodies et les arrangements soignés de Didier. L'humour et la précision de l'un, l'élégance mélodique de l'autre — la somme fonctionne.</p>
<p>Parmi les titres : <em>La flemme</em> (dont la ligne d'ouverture — « Je déclare que la flemme est l'avenir de l'homme » — circule encore dans les mémoires), <em>Le camping des tongs</em>, <em>Dès le redoux</em>, <em>Derrière ma Remington</em>. En décembre 2005, un spectacle est monté au Divan du Monde à Paris, avec Thierry Garcia à la guitare.</p>
<p>La collaboration entre Pascal et Didier se poursuivra plus d'une décennie, jusqu'à <em>Chacun sa famille</em> (2018). Une fidélité qui dit quelque chose sur les deux artistes.</p>`,
        publishedAt: new Date("2005-11-07"),
      },
      {
        slug: "sans-motif-apparent-sortie-2013",
        title: "Sans motif apparent — mars 2013",
        excerpt: "Le 7 mars 2013 sort le troisième album de Pascal, salué par la critique comme son œuvre la plus aboutie. Musiques de Claude Mairet, guitariste d'Hubert-Félix Thiéfaine.",
        content: `<p>Le 7 mars 2013, Pascal lance <em>Sans motif apparent</em> à La Rodia, à Besançon. La mise en scène est de Sébastien Barberon, Claude Mairet à la guitare. Ce guitariste-compositeur, figure de la scène bisontine dont la collaboration avec Hubert-Félix Thiéfaine est une référence, signe les musiques de l'album entier. Il compose à cette période l'essentiel du répertoire que Pascal interprète en concert.</p>
<p>L'album est sorti chez Troll's Production. Douze titres, trente-sept minutes. Chaque chanson tient dans un espace réduit — pas de rembourrage, pas de longueur de confort. Le titre <em>S'aimer d'amour est un pléonasme</em> est à lui seul un programme : la langue prise au piège de ses propres redondances, retournée, désossée, rendue à quelque chose de plus vrai que le sens premier.</p>
<p>Le dernier titre, <em>Vous qui êtes noyés</em>, prend une résonance particulière depuis la disparition de Pascal en octobre 2025. Mais ce serait lui faire un mauvais procès que d'y lire une prophétie — c'est d'abord une chanson, et une très bonne.</p>`,
        publishedAt: new Date("2013-03-07"),
      },
      {
        slug: "chacun-sa-famille-avignon-2018",
        title: "Chacun sa famille — Avignon Off 2018",
        excerpt: "Textes de Pascal, musique de Romain Didier, interprètes Enzo Enzo et Laurent Viel : « Chacun sa famille » triomphe à Avignon en 2018. La Terrasse le juge « incontournable ».",
        content: `<p>Textes de Pascal, musiques de Romain Didier, interprètes Enzo Enzo et Laurent Viel, guitare Thierry Garcia, mise en scène Gérard Morel. Du 5 au 29 juillet 2018, <em>Chacun sa famille</em> se joue au Théâtre Le Cabestan dans le cadre d'Avignon Off. Une heure cinq.</p>
<p>Le spectacle est une galerie : l'enfant-chéri déchu, le cousin qu'on ne voit jamais, l'adolescent qui n'en finit pas, la sœur jalouse, le grand-parent qui embarrasse. La famille comme institution que Pascal explore sans nostalgie ni règlement de comptes — avec cette précision clinique qui est sa façon d'aimer les gens, c'est-à-dire de les regarder vraiment.</p>
<p>La presse fait bon accueil au spectacle. <em>La Terrasse</em> le juge incontournable. Le spectacle revient l'été suivant, du 5 au 27 juillet 2019, dans la même salle. Pour Pascal, c'est une démonstration que son écriture tient la scène au-delà de sa propre voix — portée par d'autres, dans un autre registre, devant un public qui ne le connaît pas nécessairement, elle arrive quand même.</p>`,
        publishedAt: new Date("2018-07-30"),
      },
      {
        slug: "seul-en-scene-2018",
        title: "Seul en scène — ukulélé, kalimba et boîte à musique",
        excerpt: "Le 24 février 2018, Pascal réalise un rêve de longue date : un concert en solo, s'accompagnant lui-même à l'ukulélé électrique, au kalimba basse et à la boîte à musique.",
        content: `<p>Le 24 février 2018, à l'Atelier de Petite Fleur à Besançon, Pascal monte seul pour la première fois. Pas de guitariste, pas de bassiste — lui, l'ukulélé électrique et acoustique, le kalimba basse, la boîte à musique. Le concert est organisé par son association L'Écriture en Scène et la Compagnie Keichad.</p>
<p>Il parle de « rêve de longue date ». On peut l'entendre comme une modestie — lui qui a toujours été entouré de très bons musiciens, de Bernard Montrichard à Claude Mairet. Mais on peut aussi l'entendre comme ce qu'il est : une ambition précise. Tenir seul. Que le texte n'ait plus rien derrière quoi se cacher, ni rien pour le porter sauf la voix.</p>
<p>Le spectacle est annoncé comme « poético-théâtralo-chanté, désopilant et désespéré ». La formule est de lui — et elle est juste, comme d'habitude. Le répertoire traverse ses trois décennies de travail : Romain Didier, Florent Marchet, Jean-Pierre Pilot, Claude Mairet, et des textes lus à voix nue.</p>
<p>C'est une des dernières grandes soirées avant la fin. Il se produira encore — à Baume-les-Dames en 2025, quelques mois avant sa disparition. Mais ce concert de 2018 dit quelque chose d'essentiel sur ce que Pascal cherchait : la dépouille, le direct, le mot sans filet.</p>`,
        publishedAt: new Date("2018-02-24"),
      },
    ];

    for (const article of articles) {
      await prisma.article.upsert({
        where: { slug: article.slug },
        update: { title: article.title, excerpt: article.excerpt, content: article.content },
        create: { ...article, status: "PUBLISHED", authorId: admin.id },
      });
    }
    console.log("Articles mis à jour");
  }

  // ─── Settings ──────────────────────────────────────────────────────────────
  const settings = [
    { key: "site_title", value: "Pascal Mathieu — Chanteur · Poète · Parolier" },
    { key: "site_description", value: "Site officiel de Pascal Mathieu (1961–2025), chanteur et poète de Besançon. Prix Charles Cros 1995. Découvrez sa discographie, sa biographie et son œuvre." },
    { key: "contact_email", value: "contact@pascalmathieu-artiste.fr" },
    { key: "home_intro", value: "Besançon, 1961 — 2025. Chanteur, poète, parolier. Deux Prix de l'Académie Charles Cros. Des textes pour Romain Didier, Florent Marchet, Enzo Enzo, Pierre Perret. Trois albums personnels. Des ateliers d'écriture pendant trente ans. Une œuvre qui a choisi la précision plutôt que le bruit." },
    { key: "home_portrait_quote", value: "« Au début je ne chantais pas, je hurlais principalement. »\n— Pascal" },
    { key: "home_portrait_text", value: "Révélation du Printemps de Bourges en 1986, récompensé par l'Académie Charles Cros dès son premier album en 1995, Pascal a construit une œuvre à la marge du système — sans jamais en manquer d'exigence. Parolier pour les grands noms de la chanson française, auteur de trois albums personnels salués par la critique, il a également passé trente ans à transmettre son rapport à l'écriture à travers des ateliers en Bourgogne-Franche-Comté." },
    { key: "home_chanteur_text", value: "Trois albums en trente ans — En attendant des jours pires (1995, Prix Charles Cros), Routines aventurières (2008), Sans motif apparent (2013). Une voix qui ne cherche pas à séduire mais à tenir. Une présence scénique que ceux qui l'ont vu ne décrivent pas facilement — il faut l'avoir entendu." },
    { key: "home_dessinateur_text", value: "Pascal a écrit pour Romain Didier, Florent Marchet, Jean Guidoni — avec la même précision que pour lui-même. Dix des onze titres de Chapitre Neuf (2005), le livret de Pinocchio court toujours, les chansons de Chacun sa famille. Un parolier que ses pairs plaçaient dans la même ligne qu'Alain Leprest." },
    { key: "home_poete_text", value: "« S'aimer d'amour est un pléonasme. » « La flemme est l'avenir de l'homme. » « Pascal Mathieu court à sa perte. » Ses titres fonctionnent comme des poèmes complets — la chute est dans l'intitulé, le reste est la démonstration. Une façon de traiter la langue que la critique a comparée, selon les époques, à Nougaro et à Leprest." },
    { key: "home_region_quote", value: "« Je suis sorti de là sur un nuage absolu. »\n— Pascal, à propos du Printemps de Bourges 1986" },
    { key: "home_region_text", value: "Il y a des artistes qui partent de leur région et d'autres qui y restent parce qu'elle leur suffit. Pascal appartient à la seconde catégorie — non par manque d'ambition, mais parce que Besançon et la Franche-Comté lui ont toujours donné matière. Les concerts de la scène anarchiste bisontine dans les années 1980. La création de son association en 2017. Les ateliers d'écriture dans les villages du Doubs. Il n'a jamais eu besoin de Paris pour exister." },
    { key: "home_cta_title", value: "Quarante ans de travail" },
    { key: "home_cta_text", value: "Deux Prix Charles Cros. Quatre albums. Des dizaines de textes pour d'autres. Trente ans d'ateliers d'écriture. L'œuvre de Pascal est ici." },
  ];

  for (const s of settings) {
    await prisma.siteSettings.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log("Settings mis à jour");

  console.log("Seed terminé avec succès");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
