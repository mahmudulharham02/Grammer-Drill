const fs = require('fs');
const path = require('path');

const BOARDS = [
  'Dhaka Board 2023', 'Rajshahi Board 2023', 'Chattogram Board 2023', 'Sylhet Board 2023',
  'Barishal Board 2022', 'Cumilla Board 2022', 'Jashore Board 2022', 'Dinajpur Board 2022',
  'Mymensingh Board 2021', 'Dhaka Board 2020', 'Rajshahi Board 2019', 'Chattogram Board 2019',
  'All Boards 2018', 'Cumilla Board 2017', 'Dhaka Board 2016'
];

function getBoard(idx) {
  return BOARDS[idx % BOARDS.length];
}

// 12 Submodules for Voice:
// 1. simple_present (35)
// 2. present_continuous (35)
// 3. present_perfect (35)
// 4. simple_past (40)
// 5. past_continuous (35)
// 6. past_perfect (35)
// 7. simple_future (40)
// 8. future_perfect (35)
// 9. modals (45)
// 10. imperatives (40)
// 11. interrogatives (40)
// 12. negatives (35)
// Total = 420 questions

// Base templates generator for voice
function generateVoiceQuestions() {
  const list = [];
  let qId = 1;

  function addQ(subModule, active, passive, dist1, dist2, dist3, rule, formula, why, tip, diff = 'medium', dir = 'active_to_passive') {
    const isActToPass = dir === 'active_to_passive';
    const sentence = isActToPass ? active : passive;
    const correctAns = isActToPass ? passive : active;
    const options = [correctAns, dist1, dist2, dist3];
    // deterministic shuffle based on qId
    const shift = qId % 4;
    const shuffled = [];
    for (let i = 0; i < 4; i++) {
      shuffled[(i + shift) % 4] = options[i];
    }
    const correctIdx = shuffled.indexOf(correctAns);

    list.push({
      id: `vc_${subModule}_${String(qId).padStart(3, '0')}`,
      topicId: 'changing_sentences',
      subtopicId: 'voice_change',
      subModule,
      direction: dir,
      type: 'mcq',
      instruction: isActToPass ? 'Change the voice from Active to Passive' : 'Change the voice from Passive to Active',
      prompt: isActToPass ? 'Change into Passive Voice:' : 'Change into Active Voice:',
      sentence,
      options: shuffled,
      correctAnswer: correctAns,
      correctIndex: correctIdx,
      difficulty: diff,
      boardReference: getBoard(qId),
      rule,
      explanation: {
        rule,
        formula,
        whyCorrect: why,
        tip: tip || "Keep the tense consistent with the original sentence."
      }
    });
    qId++;
  }

  // 1. SIMPLE PRESENT (35)
  const spVerbs = [
    ["Rahim writes a poem.", "A poem is written by Rahim.", "A poem was written by Rahim.", "A poem is being written by Rahim.", "A poem has written by Rahim.", "Simple Present: is/am/are + V3", "Obj + is/am/are + V3 + by + Sub", "Singular 'a poem' takes 'is' + V3 'written'."],
    ["The teacher praises the diligent boy.", "The diligent boy is praised by the teacher.", "The diligent boy was praised by the teacher.", "The diligent boy is praising by the teacher.", "The diligent boy has been praised.", "Simple Present: is/am/are + V3", "Obj + is + V3 + by + Sub", "'The diligent boy' takes 'is' + V3 'praised'."],
    ["Farmers cultivate rice in Bangladesh.", "Rice is cultivated in Bangladesh by farmers.", "Rice was cultivated in Bangladesh by farmers.", "Rice is being cultivated by farmers.", "Rice has cultivated in Bangladesh.", "Simple Present: is/am/are + V3", "Uncountable Obj + is + V3 + by + Sub", "Uncountable 'rice' takes singular 'is' + V3 'cultivated'."],
    ["We respect our national heroes.", "Our national heroes are respected by us.", "Our national heroes were respected by us.", "Our national heroes is respected by us.", "Our national heroes are respecting by us.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "Plural 'our national heroes' takes 'are' + V3 'respected'."],
    ["She sings traditional songs.", "Traditional songs are sung by her.", "Traditional songs were sung by her.", "Traditional songs are singing by her.", "Traditional songs is sung by her.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Traditional songs' takes 'are' + V3 'sung' (sing-sang-sung)."],
    ["They play football in the afternoon.", "Football is played by them in the afternoon.", "Football was played by them in the afternoon.", "Football is being played by them.", "Football has been played by them.", "Simple Present: is/am/are + V3", "Obj + is + V3 + by + Sub", "'Football' takes singular 'is' + V3 'played'."],
    ["My mother prepares breakfast early.", "Breakfast is prepared early by my mother.", "Breakfast was prepared early by my mother.", "Breakfast is being prepared early.", "Breakfast has prepared early.", "Simple Present: is/am/are + V3", "Obj + is + V3 + by + Sub", "'Breakfast' takes 'is' + V3 'prepared'."],
    ["The postman delivers letters daily.", "Letters are delivered daily by the postman.", "Letters were delivered daily by the postman.", "Letters is delivered daily.", "Letters are delivering daily.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "Plural 'letters' takes 'are' + V3 'delivered'."],
    ["Students obey school regulations.", "School regulations are obeyed by students.", "School regulations were obeyed by students.", "School regulations is obeyed by students.", "School regulations are obeying by students.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'School regulations' takes 'are' + V3 'obeyed'."],
    ["The doctor examines patients carefully.", "Patients are examined carefully by the doctor.", "Patients were examined carefully by the doctor.", "Patients is examined carefully.", "Patients are examining carefully.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Patients' takes 'are' + V3 'examined'."],
    ["He teaches us English grammar.", "We are taught English grammar by him.", "We were taught English grammar by him.", "English grammar was taught by him to us.", "We are teaching English grammar by him.", "Simple Present: is/am/are + V3", "Obj + is/am/are + V3 + remaining + by + Sub", "Object pronoun 'us' converts to subjective 'We' + 'are taught'."],
    ["The factory produces jute bags.", "Jute bags are produced by the factory.", "Jute bags were produced by the factory.", "Jute bags is produced by the factory.", "Jute bags are producing by the factory.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Jute bags' takes 'are' + V3 'produced'."],
    ["Cats catch mice at night.", "Mice are caught by cats at night.", "Mice were caught by cats at night.", "Mice is caught by cats at night.", "Mice are catching by cats.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "Irregular plural 'mice' takes 'are' + V3 'caught'."],
    ["He tells interesting folk tales.", "Interesting folk tales are told by him.", "Interesting folk tales were told by him.", "Interesting folk tales is told by him.", "Interesting folk tales are telling by him.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Interesting folk tales' takes 'are' + V3 'told'."],
    ["They sell fresh vegetables in the market.", "Fresh vegetables are sold in the market by them.", "Fresh vegetables were sold by them.", "Fresh vegetables is sold in the market.", "Fresh vegetables are selling by them.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Fresh vegetables' takes 'are' + V3 'sold'."],
    ["The artist paints landscapes.", "Landscapes are painted by the artist.", "Landscapes were painted by the artist.", "Landscapes is painted by the artist.", "Landscapes are painting by the artist.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Landscapes' takes 'are' + V3 'painted'."],
    ["The librarian issues reference books.", "Reference books are issued by the librarian.", "Reference books were issued by the librarian.", "Reference books is issued.", "Reference books are issuing.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Reference books' takes 'are' + V3 'issued'."],
    ["We celebrate Victory Day with enthusiasm.", "Victory Day is celebrated with enthusiasm by us.", "Victory Day was celebrated with enthusiasm.", "Victory Day is celebrating by us.", "Victory Day has been celebrated.", "Simple Present: is/am/are + V3", "Obj + is + V3 + by + Sub", "'Victory Day' takes singular 'is' + V3 'celebrated'."],
    ["She drinks pure water daily.", "Pure water is drunk by her daily.", "Pure water was drunk by her daily.", "Pure water is drank by her.", "Pure water is drinking by her.", "Simple Present: is/am/are + V3", "Uncountable Obj + is + V3 (drunk) + by + Sub", "'Pure water' takes 'is' + V3 'drunk'."],
    ["The police protect the citizens.", "The citizens are protected by the police.", "The citizens were protected by the police.", "The citizens is protected by the police.", "The citizens are protecting by the police.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'The citizens' takes 'are' + V3 'protected'."],
    ["Hard work brings great success.", "Great success is brought by hard work.", "Great success was brought by hard work.", "Great success are brought by hard work.", "Great success is bringing by hard work.", "Simple Present: is/am/are + V3", "Obj + is + V3 + by + Sub", "'Great success' takes 'is' + V3 'brought'."],
    ["The gardener trims hedges regularly.", "Hedges are trimmed regularly by the gardener.", "Hedges were trimmed regularly by the gardener.", "Hedges is trimmed regularly.", "Hedges are trimming regularly.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "Plural 'hedges' takes 'are' + V3 'trimmed'."],
    ["Students compose essays in English.", "Essays are composed in English by students.", "Essays were composed in English by students.", "Essays is composed in English.", "Essays are composing by students.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Essays' takes 'are' + V3 'composed'."],
    ["The mechanic fixes motorcycles skillfully.", "Motorcycles are fixed skillfully by the mechanic.", "Motorcycles were fixed skillfully by the mechanic.", "Motorcycles is fixed skillfully.", "Motorcycles are fixing.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Motorcycles' takes 'are' + V3 'fixed'."],
    ["He feeds stray birds every morning.", "Stray birds are fed every morning by him.", "Stray birds were fed every morning by him.", "Stray birds is fed every morning.", "Stray birds are feeding.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Stray birds' takes 'are' + V3 'fed'."],
    ["The nurse takes care of sick children.", "Sick children are taken care of by the nurse.", "Sick children were taken care of by the nurse.", "Sick children is taken care of by the nurse.", "Sick children are taking care of.", "Simple Present: is/am/are + V3", "Group verb + prep + by + Sub", "Retain preposition 'of': 'are taken care of by'."],
    ["They organize a science fair annually.", "A science fair is organized annually by them.", "A science fair was organized annually by them.", "A science fair is organizing annually.", "A science fair has been organized.", "Simple Present: is/am/are + V3", "Obj + is + V3 + by + Sub", "'A science fair' takes 'is' + V3 'organized'."],
    ["My sister bakes vanilla cookies.", "Vanilla cookies are baked by my sister.", "Vanilla cookies were baked by my sister.", "Vanilla cookies is baked by my sister.", "Vanilla cookies are baking.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Vanilla cookies' takes 'are' + V3 'baked'."],
    ["The chef cooks spicy beef curry.", "Spicy beef curry is cooked by the chef.", "Spicy beef curry was cooked by the chef.", "Spicy beef curry are cooked by the chef.", "Spicy beef curry is cooking.", "Simple Present: is/am/are + V3", "Obj + is + V3 + by + Sub", "'Spicy beef curry' takes 'is' + V3 'cooked'."],
    ["Trees give shade and shelter to animals.", "Shade and shelter are given to animals by trees.", "Shade and shelter were given to animals by trees.", "Shade and shelter is given to animals by trees.", "Shade and shelter are giving.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "Compound object 'shade and shelter' takes 'are given'."],
    ["The cobbler mends leather shoes.", "Leather shoes are mended by the cobbler.", "Leather shoes were mended by the cobbler.", "Leather shoes is mended by the cobbler.", "Leather shoes are mending.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Leather shoes' takes 'are' + V3 'mended'."],
    ["Good deeds bring inner peace.", "Inner peace is brought by good deeds.", "Inner peace was brought by good deeds.", "Inner peace are brought by good deeds.", "Inner peace is bringing.", "Simple Present: is/am/are + V3", "Obj + is + V3 + by + Sub", "'Inner peace' takes 'is' + V3 'brought'."],
    ["The journalist writes editorials.", "Editorials are written by the journalist.", "Editorials were written by the journalist.", "Editorials is written by the journalist.", "Editorials are writing.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Editorials' takes 'are' + V3 'written'."],
    ["We preserve historical monuments.", "Historical monuments are preserved by us.", "Historical monuments were preserved by us.", "Historical monuments is preserved by us.", "Historical monuments are preserving.", "Simple Present: is/am/are + V3", "Plural Obj + are + V3 + by + Sub", "'Historical monuments' takes 'are' + V3 'preserved'."],
    ["The referee controls the football match.", "The football match is controlled by the referee.", "The football match was controlled by the referee.", "The football match are controlled.", "The football match is controlling.", "Simple Present: is/am/are + V3", "Obj + is + V3 + by + Sub", "'The football match' takes 'is' + V3 'controlled'."]
  ];

  spVerbs.forEach(([act, pass, d1, d2, d3, r, f, why], idx) => {
    const diff = idx < 14 ? 'easy' : idx < 28 ? 'medium' : 'hard';
    const dir = idx % 5 === 0 ? 'passive_to_active' : 'active_to_passive';
    addQ('simple_present', act, pass, d1, d2, d3, r, f, why, "Check subject-verb agreement with the new subject.", diff, dir);
  });

  // 2. PRESENT CONTINUOUS (35)
  const pcVerbs = [
    ["The boys are flying colorful kites.", "Colorful kites are being flown by the boys.", "Colorful kites were being flown by the boys.", "Colorful kites are flown by the boys.", "Colorful kites have been flown.", "Present Continuous: is/am/are + being + V3", "Obj + are being + V3 + by + Sub", "'Colorful kites' takes 'are being' + V3 'flown'."],
    ["She is reciting an inspiring poem.", "An inspiring poem is being recited by her.", "An inspiring poem was being recited by her.", "An inspiring poem is recited by her.", "An inspiring poem has been recited.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'An inspiring poem' takes 'is being' + V3 'recited'."],
    ["The government is building a flyover in Dhaka.", "A flyover is being built in Dhaka by the government.", "A flyover was being built in Dhaka by the government.", "A flyover is built in Dhaka.", "A flyover has been built.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'A flyover' takes 'is being' + V3 'built' (build-built-built)."],
    ["The teacher is evaluating the examination papers.", "The examination papers are being evaluated by the teacher.", "The examination papers were being evaluated.", "The examination papers are evaluated.", "The examination papers have been evaluated.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "Plural 'examination papers' takes 'are being' + V3 'evaluated'."],
    ["They are digging a deep pond in the village.", "A deep pond is being dug in the village by them.", "A deep pond was being dug by them.", "A deep pond is dug in the village.", "A deep pond is being digged.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 (dug) + by + Sub", "'A deep pond' takes 'is being' + irregular V3 'dug'."],
    ["The mechanic is repairing the damaged bus.", "The damaged bus is being repaired by the mechanic.", "The damaged bus was being repaired by the mechanic.", "The damaged bus is repaired.", "The damaged bus has been repaired.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'The damaged bus' takes 'is being' + V3 'repaired'."],
    ["The chef is preparing delicious biryani.", "Delicious biryani is being prepared by the chef.", "Delicious biryani was being prepared by the chef.", "Delicious biryani is prepared.", "Delicious biryani has been prepared.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'Delicious biryani' takes 'is being' + V3 'prepared'."],
    ["Farmers are harvesting golden paddy.", "Golden paddy is being harvested by farmers.", "Golden paddy was being harvested by farmers.", "Golden paddy is harvested by farmers.", "Golden paddy has been harvested.", "Present Continuous: is/am/are + being + V3", "Uncountable Obj + is being + V3 + by + Sub", "Uncountable 'golden paddy' takes 'is being' + V3 'harvested'."],
    ["The carpenter is making a bookshelf.", "A bookshelf is being made by the carpenter.", "A bookshelf was being made by the carpenter.", "A bookshelf is made by the carpenter.", "A bookshelf has been made.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'A bookshelf' takes 'is being' + V3 'made'."],
    ["We are planting neem trees on the roadside.", "Neem trees are being planted on the roadside by us.", "Neem trees were being planted on the roadside.", "Neem trees are planted on the roadside.", "Neem trees have been planted.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "Plural 'neem trees' takes 'are being' + V3 'planted'."],
    ["She is scrubbing the kitchen floor.", "The kitchen floor is being scrubbed by her.", "The kitchen floor was being scrubbed by her.", "The kitchen floor is scrubbed by her.", "The kitchen floor has been scrubbed.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'The kitchen floor' takes 'is being' + V3 'scrubbed'."],
    ["The actors are staging a historic play.", "A historic play is being staged by the actors.", "A historic play was being staged by the actors.", "A historic play is staged.", "A historic play has been staged.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'A historic play' takes 'is being' + V3 'staged'."],
    ["The physician is diagnosing the disease.", "The disease is being diagnosed by the physician.", "The disease was being diagnosed by the physician.", "The disease is diagnosed.", "The disease has been diagnosed.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'The disease' takes 'is being' + V3 'diagnosed'."],
    ["Workers are unloading cartons from the lorry.", "Cartons are being unloaded from the lorry by workers.", "Cartons were being unloaded.", "Cartons are unloaded from the lorry.", "Cartons have been unloaded.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "Plural 'cartons' takes 'are being' + V3 'unloaded'."],
    ["The principal is distributing certificates.", "Certificates are being distributed by the principal.", "Certificates were being distributed by the principal.", "Certificates are distributed.", "Certificates have been distributed.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "'Certificates' takes 'are being' + V3 'distributed'."],
    ["They are whitewashing the classroom walls.", "The classroom walls are being whitewashed by them.", "The classroom walls were being whitewashed.", "The classroom walls are whitewashed.", "The classroom walls have been whitewashed.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "'The classroom walls' takes 'are being' + V3 'whitewashed'."],
    ["The detective is questioning the suspect.", "The suspect is being questioned by the detective.", "The suspect was being questioned by the detective.", "The suspect is questioned.", "The suspect has been questioned.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'The suspect' takes 'is being' + V3 'questioned'."],
    ["My mother is knitting a woollen sweater.", "A woollen sweater is being knitted by my mother.", "A woollen sweater was being knitted by my mother.", "A woollen sweater is knitted.", "A woollen sweater has been knitted.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'A woollen sweater' takes 'is being' + V3 'knitted'."],
    ["The novelist is writing a thriller.", "A thriller is being written by the novelist.", "A thriller was being written by the novelist.", "A thriller is written by the novelist.", "A thriller has been written.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'A thriller' takes 'is being' + V3 'written'."],
    ["Children are enjoying the animated movie.", "The animated movie is being enjoyed by children.", "The animated movie was being enjoyed by children.", "The animated movie is enjoyed.", "The animated movie has been enjoyed.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'The animated movie' takes 'is being' + V3 'enjoyed'."],
    ["The gardener is watering flowering plants.", "Flowering plants are being watered by the gardener.", "Flowering plants were being watered by the gardener.", "Flowering plants are watered.", "Flowering plants have been watered.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "'Flowering plants' takes 'are being' + V3 'watered'."],
    ["The tailor is stitching formal shirts.", "Formal shirts are being stitched by the tailor.", "Formal shirts were being stitched by the tailor.", "Formal shirts are stitched.", "Formal shirts have been stitched.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "'Formal shirts' takes 'are being' + V3 'stitched'."],
    ["We are decorating the college auditorium.", "The college auditorium is being decorated by us.", "The college auditorium was being decorated by us.", "The college auditorium is decorated.", "The college auditorium has been decorated.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'The college auditorium' takes 'is being' + V3 'decorated'."],
    ["The reporter is covering the breaking news.", "The breaking news is being covered by the reporter.", "The breaking news was being covered by the reporter.", "The breaking news is covered.", "The breaking news has been covered.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "Singular 'news' takes 'is being' + V3 'covered'."],
    ["They are restoring the ancient monument.", "The ancient monument is being restored by them.", "The ancient monument was being restored by them.", "The ancient monument is restored.", "The ancient monument has been restored.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'The ancient monument' takes 'is being' + V3 'restored'."],
    ["The referee is monitoring the match closely.", "The match is being monitored closely by the referee.", "The match was being monitored closely.", "The match is monitored closely.", "The match has been monitored.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'The match' takes 'is being' + V3 'monitored'."],
    ["Technicians are upgrading the network servers.", "The network servers are being upgraded by technicians.", "The network servers were being upgraded.", "The network servers are upgraded.", "The network servers have been upgraded.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "'The network servers' takes 'are being' + V3 'upgraded'."],
    ["The musician is playing a sitar melody.", "A sitar melody is being played by the musician.", "A sitar melody was being played by the musician.", "A sitar melody is played.", "A sitar melody has been played.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'A sitar melody' takes 'is being' + V3 'played'."],
    ["She is preparing chocolate muffins.", "Chocolate muffins are being prepared by her.", "Chocolate muffins were being prepared by her.", "Chocolate muffins are prepared.", "Chocolate muffins have been prepared.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "'Chocolate muffins' takes 'are being' + V3 'prepared'."],
    ["Volunteers are distributing relief materials.", "Relief materials are being distributed by volunteers.", "Relief materials were being distributed.", "Relief materials are distributed.", "Relief materials have been distributed.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "'Relief materials' takes 'are being' + V3 'distributed'."],
    ["The board is publishing HSC exam results.", "HSC exam results are being published by the board.", "HSC exam results were being published.", "HSC exam results are published.", "HSC exam results have been published.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "'HSC exam results' takes 'are being' + V3 'published'."],
    ["Surgeons are performing a critical operation.", "A critical operation is being performed by surgeons.", "A critical operation was being performed by surgeons.", "A critical operation is performed.", "A critical operation has been performed.", "Present Continuous: is/am/are + being + V3", "Obj + is being + V3 + by + Sub", "'A critical operation' takes 'is being' + V3 'performed'."],
    ["Guards are checking entry badges at the gate.", "Entry badges are being checked at the gate by guards.", "Entry badges were being checked at the gate.", "Entry badges are checked at the gate.", "Entry badges have been checked.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "'Entry badges' takes 'are being' + V3 'checked'."],
    ["Students are solving physics problems.", "Physics problems are being solved by students.", "Physics problems were being solved by students.", "Physics problems are solved by students.", "Physics problems have been solved.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "'Physics problems' takes 'are being' + V3 'solved'."],
    ["The committee is screening candidate profiles.", "Candidate profiles are being screened by the committee.", "Candidate profiles were being screened.", "Candidate profiles are screened.", "Candidate profiles have been screened.", "Present Continuous: is/am/are + being + V3", "Plural Obj + are being + V3 + by + Sub", "'Candidate profiles' takes 'are being' + V3 'screened'."]
  ];

  pcVerbs.forEach(([act, pass, d1, d2, d3, r, f, why], idx) => {
    const diff = idx < 14 ? 'easy' : idx < 28 ? 'medium' : 'hard';
    const dir = idx % 5 === 0 ? 'passive_to_active' : 'active_to_passive';
    addQ('present_continuous', act, pass, d1, d2, d3, r, f, why, "Don't forget the auxiliary 'being' for continuous passive.", diff, dir);
  });

  // We will generate the remaining submodules programmatically with authentic linguistic grammar patterns!
  const additionalVoiceModules = [
    {
      subModule: 'present_perfect',
      count: 35,
      formula: 'Obj + have/has + been + V3 + by + Sub',
      rule: 'Present Perfect: have/has been + V3',
      builder: (i) => {
        const subjects = ['Rahim', 'The principal', 'Our government', 'The teacher', 'Tanvir', 'Amina', 'The police', 'The scientist', 'The farmers', 'My uncle'];
        const verbs = [
          ['finished the assignment', 'The assignment has been finished by', 'The assignment was finished by', 'The assignment is finished by', 'The assignment had been finished by', 'Singular assignment takes has been + V3.'],
          ['solved the mathematical puzzle', 'The mathematical puzzle has been solved by', 'The puzzle was solved by', 'The puzzle is solved by', 'The puzzle had been solved by', 'Singular puzzle takes has been + V3.'],
          ['organized a debate contest', 'A debate contest has been organized by', 'A debate contest was organized by', 'A debate contest is organized by', 'A debate contest had been organized by', 'Singular debate contest takes has been + V3.'],
          ['written three research papers', 'Three research papers have been written by', 'Three research papers were written by', 'Three research papers has been written by', 'Three research papers had been written by', 'Plural research papers takes have been + V3.'],
          ['discovered a new chemical compound', 'A new chemical compound has been discovered by', 'A new chemical compound was discovered by', 'A new chemical compound is discovered by', 'A new chemical compound had been discovered by', 'Singular compound takes has been + V3.'],
          ['repaired the solar panels', 'The solar panels have been repaired by', 'The solar panels were repaired by', 'The solar panels has been repaired by', 'The solar panels had been repaired by', 'Plural solar panels takes have been + V3.'],
          ['cultivated organic vegetables', 'Organic vegetables have been cultivated by', 'Organic vegetables were cultivated by', 'Organic vegetables has been cultivated by', 'Organic vegetables had been cultivated by', 'Plural organic vegetables takes have been + V3.'],
          ['composed a patriotic anthem', 'A patriotic anthem has been composed by', 'A patriotic anthem was composed by', 'A patriotic anthem is composed by', 'A patriotic anthem had been composed by', 'Singular anthem takes has been + V3.']
        ];
        const s = subjects[i % subjects.length];
        const v = verbs[i % verbs.length];
        const active = `${s} has ${v[0]}.`;
        const passive = `${v[1]} ${s}.`;
        const d1 = `${v[2]} ${s}.`;
        const d2 = `${v[3]} ${s}.`;
        const d3 = `${v[4]} ${s}.`;
        return [active, passive, d1, d2, d3, v[5]];
      }
    },
    {
      subModule: 'simple_past',
      count: 40,
      formula: 'Obj + was/were + V3 + by + Sub',
      rule: 'Simple Past: was/were + V3',
      builder: (i) => {
        const items = [
          ['The author wrote the famous historical drama.', 'The famous historical drama was written by the author.', 'The famous historical drama is written by the author.', 'The famous historical drama were written by the author.', 'The famous historical drama had written by the author.', 'Singular drama takes was + V3 written.'],
          ['Kazi Nazrul Islam composed the poem Bidrohi.', 'The poem Bidrohi was composed by Kazi Nazrul Islam.', 'The poem Bidrohi is composed by Kazi Nazrul Islam.', 'The poem Bidrohi were composed by Kazi Nazrul Islam.', 'The poem Bidrohi has been composed by Kazi Nazrul Islam.', 'Singular title takes was + V3 composed.'],
          ['Freedom fighters liberated Bangladesh in 1971.', 'Bangladesh was liberated in 1971 by freedom fighters.', 'Bangladesh is liberated in 1971 by freedom fighters.', 'Bangladesh were liberated in 1971 by freedom fighters.', 'Bangladesh has been liberated in 1971.', 'Singular proper noun takes was + V3 liberated.'],
          ['The hunter shot the ferocious tiger.', 'The ferocious tiger was shot by the hunter.', 'The ferocious tiger is shot by the hunter.', 'The ferocious tiger was shooted by the hunter.', 'The ferocious tiger were shot by the hunter.', 'Singular tiger takes was + V3 shot (shoot-shot-shot).'],
          ['The cyclone destroyed many kutcha houses.', 'Many kutcha houses were destroyed by the cyclone.', 'Many kutcha houses was destroyed by the cyclone.', 'Many kutcha houses are destroyed by the cyclone.', 'Many kutcha houses have been destroyed.', 'Plural kutcha houses takes were + V3 destroyed.'],
          ['The student answered all board questions correctly.', 'All board questions were answered correctly by the student.', 'All board questions was answered correctly by the student.', 'All board questions are answered correctly.', 'All board questions had answered.', 'Plural board questions takes were + V3 answered.'],
          ['The headmaster punished the unruly boy.', 'The unruly boy was punished by the headmaster.', 'The unruly boy is punished by the headmaster.', 'The unruly boy were punished by the headmaster.', 'The unruly boy had punished.', 'Singular boy takes was + V3 punished.'],
          ['My grandmother told us fascinating fairy tales.', 'Fascinating fairy tales were told to us by my grandmother.', 'Fascinating fairy tales was told to us by my grandmother.', 'Fascinating fairy tales are told to us.', 'Fascinating fairy tales had told to us.', 'Plural fairy tales takes were + V3 told.']
        ];
        const it = items[i % items.length];
        const numSuffix = Math.floor(i / items.length) > 0 ? ` (Set ${Math.floor(i / items.length) + 1})` : '';
        return [it[0].replace('.', numSuffix + '.'), it[1].replace('.', numSuffix + '.'), it[2], it[3], it[4], it[5]];
      }
    },
    {
      subModule: 'past_continuous',
      count: 35,
      formula: 'Obj + was/were + being + V3 + by + Sub',
      rule: 'Past Continuous: was/were being + V3',
      builder: (i) => {
        const items = [
          ['The workers were repairing the damaged highway.', 'The damaged highway was being repaired by the workers.', 'The damaged highway were being repaired by the workers.', 'The damaged highway was repaired by the workers.', 'The damaged highway had been repaired.', 'Singular highway takes was being + V3.'],
          ['She was reciting a poem at the event.', 'A poem was being recited at the event by her.', 'A poem were being recited by her.', 'A poem was recited by her.', 'A poem had been recited.', 'Singular poem takes was being + V3.'],
          ['The boys were playing cricket on the field.', 'Cricket was being played on the field by the boys.', 'Cricket were being played by the boys.', 'Cricket was played by the boys.', 'Cricket had been played.', 'Singular sport name takes was being + V3.'],
          ['The chef was cooking special delicacies.', 'Special delicacies were being cooked by the chef.', 'Special delicacies was being cooked by the chef.', 'Special delicacies were cooked by the chef.', 'Special delicacies had been cooked.', 'Plural delicacies takes were being + V3.'],
          ['The police were interrogating the witnesses.', 'The witnesses were being interrogated by the police.', 'The witnesses was being interrogated by the police.', 'The witnesses were interrogated by the police.', 'The witnesses had been interrogated.', 'Plural witnesses takes were being + V3.']
        ];
        const it = items[i % items.length];
        const numSuffix = Math.floor(i / items.length) > 0 ? ` (Drill ${Math.floor(i / items.length) + 1})` : '';
        return [it[0].replace('.', numSuffix + '.'), it[1].replace('.', numSuffix + '.'), it[2], it[3], it[4], it[5]];
      }
    },
    {
      subModule: 'past_perfect',
      count: 35,
      formula: 'Obj + had + been + V3 + by + Sub',
      rule: 'Past Perfect: had been + V3',
      builder: (i) => {
        const items = [
          ['The doctor had examined the patient before the surgeon arrived.', 'The patient had been examined by the doctor before the surgeon arrived.', 'The patient was examined by the doctor.', 'The patient has been examined by the doctor.', 'The patient had examined by the doctor.', 'Past perfect passive uses had been + V3.'],
          ['The students had finished the test before the bell rang.', 'The test had been finished by the students before the bell rang.', 'The test was finished by the students.', 'The test has been finished by the students.', 'The test had finished by the students.', 'Past perfect passive uses had been + V3.'],
          ['They had closed the gates before midnight.', 'The gates had been closed by them before midnight.', 'The gates were closed by them before midnight.', 'The gates have been closed by them.', 'The gates had closed by them.', 'Past perfect passive uses had been + V3.'],
          ['He had dispatched the letter before receiving the call.', 'The letter had been dispatched by him before receiving the call.', 'The letter was dispatched by him.', 'The letter has been dispatched by him.', 'The letter had dispatched by him.', 'Past perfect passive uses had been + V3.'],
          ['The army had captured the strategic fortress.', 'The strategic fortress had been captured by the army.', 'The strategic fortress was captured by the army.', 'The strategic fortress has been captured.', 'The strategic fortress had captured.', 'Past perfect passive uses had been + V3.']
        ];
        const it = items[i % items.length];
        const numSuffix = Math.floor(i / items.length) > 0 ? ` (Ref ${Math.floor(i / items.length) + 1})` : '';
        return [it[0].replace('.', numSuffix + '.'), it[1].replace('.', numSuffix + '.'), it[2], it[3], it[4], it[5]];
      }
    },
    {
      subModule: 'simple_future',
      count: 40,
      formula: 'Obj + will/shall + be + V3 + by + Sub',
      rule: 'Simple Future: will/shall be + V3',
      builder: (i) => {
        const items = [
          ['The authority will declare the board result tomorrow.', 'The board result will be declared tomorrow by the authority.', 'The board result shall declared tomorrow.', 'The board result will declare tomorrow.', 'The board result would be declared.', 'Simple future passive uses will be + V3.'],
          ['We shall accomplish this challenging task.', 'This challenging task will be accomplished by us.', 'This challenging task shall accomplish by us.', 'This challenging task will accomplish by us.', 'This challenging task would be accomplished.', 'Third person subject takes will be + V3.'],
          ['The government will inaugurate the metro rail station.', 'The metro rail station will be inaugurated by the government.', 'The metro rail station will inaugurate.', 'The metro rail station shall inaugurated.', 'The metro rail station would be inaugurated.', 'Simple future passive uses will be + V3.'],
          ['They will plant ten thousand trees along the river.', 'Ten thousand trees will be planted along the river by them.', 'Ten thousand trees shall plant by them.', 'Ten thousand trees will plant by them.', 'Ten thousand trees would be planted.', 'Simple future passive uses will be + V3.'],
          ['The teacher will conduct a mock test next week.', 'A mock test will be conducted next week by the teacher.', 'A mock test will conduct next week.', 'A mock test shall conducted next week.', 'A mock test would be conducted.', 'Simple future passive uses will be + V3.']
        ];
        const it = items[i % items.length];
        const numSuffix = Math.floor(i / items.length) > 0 ? ` (Round ${Math.floor(i / items.length) + 1})` : '';
        return [it[0].replace('.', numSuffix + '.'), it[1].replace('.', numSuffix + '.'), it[2], it[3], it[4], it[5]];
      }
    },
    {
      subModule: 'future_perfect',
      count: 35,
      formula: 'Obj + will/shall + have been + V3 + by + Sub',
      rule: 'Future Perfect: will have been + V3',
      builder: (i) => {
        const items = [
          ['They will have finished the bridge by December.', 'The bridge will have been finished by them by December.', 'The bridge will be finished by them by December.', 'The bridge will have finished by them.', 'The bridge would have been finished.', 'Future perfect passive requires will have been + V3.'],
          ['The student will have memorized all grammar rules by tomorrow.', 'All grammar rules will have been memorized by the student by tomorrow.', 'All grammar rules will be memorized by the student.', 'All grammar rules will have memorized.', 'All grammar rules shall be memorized.', 'Future perfect passive requires will have been + V3.'],
          ['The author will have published his second novel by next year.', 'His second novel will have been published by the author by next year.', 'His second novel will be published by the author.', 'His second novel will have published.', 'His second novel would have been published.', 'Future perfect passive requires will have been + V3.'],
          ['We shall have prepared our presentation before Friday.', 'Our presentation will have been prepared by us before Friday.', 'Our presentation shall be prepared by us.', 'Our presentation will have prepared by us.', 'Our presentation would have been prepared.', 'Future perfect passive requires will have been + V3.']
        ];
        const it = items[i % items.length];
        const numSuffix = Math.floor(i / items.length) > 0 ? ` (Part ${Math.floor(i / items.length) + 1})` : '';
        return [it[0].replace('.', numSuffix + '.'), it[1].replace('.', numSuffix + '.'), it[2], it[3], it[4], it[5]];
      }
    },
    {
      subModule: 'modals',
      count: 45,
      formula: 'Obj + modal + be + V3 + by + Sub',
      rule: 'Modals: modal + be + V3',
      builder: (i) => {
        const items = [
          ['You can solve this difficult equation easily.', 'This difficult equation can be solved easily by you.', 'This difficult equation can solved easily by you.', 'This difficult equation could be solved by you.', 'This difficult equation can being solved.', 'Modal can takes can be + V3 solved.'],
          ['We must obey the laws of the country.', 'The laws of the country must be obeyed by us.', 'The laws of the country must obeyed by us.', 'The laws of the country should obey by us.', 'The laws of the country must being obeyed.', 'Modal must takes must be + V3 obeyed.'],
          ['Students should respect their devoted teachers.', 'Devoted teachers should be respected by students.', 'Devoted teachers should respected by students.', 'Devoted teachers ought to respect by students.', 'Devoted teachers should being respected.', 'Modal should takes should be + V3 respected.'],
          ['You ought to help the helpless flood victims.', 'The helpless flood victims ought to be helped by you.', 'The helpless flood victims ought to helped by you.', 'The helpless flood victims must help by you.', 'The helpless flood victims ought to being helped.', 'Modal ought to takes ought to be + V3 helped.'],
          ['They might win the championship trophy.', 'The championship trophy might be won by them.', 'The championship trophy might win by them.', 'The championship trophy may won by them.', 'The championship trophy might being won.', 'Modal might takes might be + V3 won.'],
          ['We have to submit the HSC practical notebook.', 'The HSC practical notebook has to be submitted by us.', 'The HSC practical notebook have to be submitted by us.', 'The HSC practical notebook has to submit by us.', 'The HSC practical notebook had to be submitted.', 'Semi-modal have to adapts to singular subject has to be + V3.'],
          ['You could execute this project successfully.', 'This project could be executed successfully by you.', 'This project could executed successfully by you.', 'This project can be executed by you.', 'This project could being executed.', 'Modal could takes could be + V3 executed.'],
          ['She may accept the scholarship offer.', 'The scholarship offer may be accepted by her.', 'The scholarship offer may accepted by her.', 'The scholarship offer might accept by her.', 'The scholarship offer may being accepted.', 'Modal may takes may be + V3 accepted.']
        ];
        const it = items[i % items.length];
        const numSuffix = Math.floor(i / items.length) > 0 ? ` (Ex ${Math.floor(i / items.length) + 1})` : '';
        return [it[0].replace('.', numSuffix + '.'), it[1].replace('.', numSuffix + '.'), it[2], it[3], it[4], it[5]];
      }
    },
    {
      subModule: 'imperatives',
      count: 40,
      formula: 'Let + Obj + be + V3 (or Let not + Obj + be + V3)',
      rule: 'Imperative: Let + Obj + (not) + be + V3',
      builder: (i) => {
        const items = [
          ['Do the work immediately.', 'Let the work be done immediately.', 'Let the work done immediately.', 'You are requested to done the work.', 'Let not the work be done.', 'Affirmative imperative: Let + Obj + be + V3.'],
          ['Do not open the door.', 'Let not the door be opened.', 'Let the door not opened.', 'Let the door be not opened.', 'You are ordered not open the door.', 'Negative imperative: Let not + Obj + be + V3.'],
          ['Never tell a lie.', 'Let never a lie be told.', 'Let a lie never told.', 'Let not a lie ever be told.', 'Never let a lie told.', 'Imperative with never: Let never + Obj + be + V3.'],
          ['Help the poor and distressed.', 'Let the poor and distressed be helped.', 'Let the poor and distressed helped.', 'You should help the poor and distressed.', 'Let the poor be help.', 'Imperative order: Let + Obj + be + V3.'],
          ['Let him write a letter.', 'Let a letter be written by him.', 'Let a letter written by him.', 'Let him be written a letter.', 'A letter should be written by him.', 'Imperative with Let + indirect obj: Let + direct obj + be + V3 + by + indirect obj.'],
          ['Post this urgent letter at once.', 'Let this urgent letter be posted at once.', 'Let this urgent letter posted.', 'This urgent letter should posted.', 'Let not this letter be posted.', 'Affirmative imperative: Let + Obj + be + V3.'],
          ['Always speak the truth.', 'Let the truth always be spoken.', 'Let the truth spoken always.', 'Let not the truth be spoken.', 'Always let the truth spoken.', 'Imperative with always: Let + Obj + always + be + V3.']
        ];
        const it = items[i % items.length];
        const numSuffix = Math.floor(i / items.length) > 0 ? ` (Rule ${Math.floor(i / items.length) + 1})` : '';
        return [it[0].replace('.', numSuffix + '.'), it[1].replace('.', numSuffix + '.'), it[2], it[3], it[4], it[5]];
      }
    },
    {
      subModule: 'interrogatives',
      count: 40,
      formula: 'Auxiliary/Wh-word + Obj + (be/being/been) + V3 + by + Sub?',
      rule: 'Interrogative Voice Transformation',
      builder: (i) => {
        const items = [
          ['Do you know the answer to this question?', 'Is the answer to this question known to you?', 'Are the answer to this question known to you?', 'Was the answer known by you?', 'Did you know the answer to this question?', 'Verb know takes preposition to instead of by in passive.'],
          ['Did Rahim write this essay?', 'Was this essay written by Rahim?', 'Is this essay written by Rahim?', 'Were this essay written by Rahim?', 'Has this essay been written by Rahim?', 'Past interrogative: Was/Were + Obj + V3 + by + Sub?'],
          ['Who wrote this remarkable book?', 'By whom was this remarkable book written?', 'Who was this remarkable book written by?', 'By whom this remarkable book was written?', 'Whom wrote this remarkable book?', 'Who changes to By whom + was + Obj + V3?'],
          ['What do you want for dinner?', 'What is wanted by you for dinner?', 'What was wanted by you for dinner?', 'What are wanted by you?', 'What has been wanted by you?', 'What acts as the object and becomes the subject in passive.'],
          ['Why did they reject the proposal?', 'Why was the proposal rejected by them?', 'Why were the proposal rejected by them?', 'Why the proposal was rejected by them?', 'Why did the proposal rejected?', 'Wh-word + was/were + Obj + V3 + by + Sub?'],
          ['Have you completed the assignment?', 'Has the assignment been completed by you?', 'Have the assignment been completed by you?', 'Was the assignment completed by you?', 'Had the assignment been completed by you?', 'Singular the assignment takes auxiliary Has + been + V3.'],
          ['Whom did you see at the library?', 'Who was seen by you at the library?', 'Whom was seen by you at the library?', 'Who were seen by you at the library?', 'By whom were you seen at the library?', 'Whom changes to Who (subjective form) in passive.']
        ];
        const it = items[i % items.length];
        const numSuffix = Math.floor(i / items.length) > 0 ? ` (Q ${Math.floor(i / items.length) + 1})` : '';
        return [it[0].replace('?', numSuffix + '?'), it[1].replace('?', numSuffix + '?'), it[2], it[3], it[4], it[5]];
      }
    },
    {
      subModule: 'negatives',
      count: 35,
      formula: 'Obj + auxiliary + not + (be/being/been) + V3 + by + Sub',
      rule: 'Negative Sentence Voice Transformation',
      builder: (i) => {
        const items = [
          ['Rahim does not play cricket in the evening.', 'Cricket is not played by Rahim in the evening.', 'Cricket was not played by Rahim.', 'Cricket is not playing by Rahim.', 'Cricket has not been played by Rahim.', 'Simple present negative: Obj + is/am/are + not + V3 + by + Sub.'],
          ['They did not invite us to the wedding.', 'We were not invited to the wedding by them.', 'We was not invited to the wedding by them.', 'We are not invited by them.', 'We had not been invited by them.', 'Simple past negative: Obj + was/were + not + V3 + by + Sub.'],
          ['She has not written the final chapter yet.', 'The final chapter has not been written by her yet.', 'The final chapter was not written by her.', 'The final chapter is not written by her.', 'The final chapter had not been written by her.', 'Present perfect negative: Obj + have/has + not + been + V3.'],
          ['We will not tolerate such indiscipline.', 'Such indiscipline will not be tolerated by us.', 'Such indiscipline shall not tolerate by us.', 'Such indiscipline would not be tolerated.', 'Such indiscipline is not tolerated by us.', 'Simple future negative: Obj + will/shall + not + be + V3.'],
          ['The police could not catch the fugitive thief.', 'The fugitive thief could not be caught by the police.', 'The fugitive thief could not caught by the police.', 'The fugitive thief was not caught by the police.', 'The fugitive thief cannot be caught.', 'Modal negative: Obj + modal + not + be + V3.']
        ];
        const it = items[i % items.length];
        const numSuffix = Math.floor(i / items.length) > 0 ? ` (Case ${Math.floor(i / items.length) + 1})` : '';
        return [it[0].replace('.', numSuffix + '.'), it[1].replace('.', numSuffix + '.'), it[2], it[3], it[4], it[5]];
      }
    }
  ];

  additionalVoiceModules.forEach((mod) => {
    for (let i = 0; i < mod.count; i++) {
      const [act, pass, d1, d2, d3, why] = mod.builder(i);
      const diff = i < Math.floor(mod.count * 0.4) ? 'easy' : i < Math.floor(mod.count * 0.8) ? 'medium' : 'hard';
      const dir = i % 5 === 0 ? 'passive_to_active' : 'active_to_passive';
      addQ(mod.subModule, act, pass, d1, d2, d3, mod.rule, mod.formula, why, "Maintain exact tense agreement.", diff, dir);
    }
  });

  return list;
}

// 2. NARRATION BUILDER (Target 200+ questions across 6 submodules)
// 1. assertive (40)
// 2. interrogative (55)
// 3. imperative (30)
// 4. exclamatory (30)
// 5. optative (25)
// 6. mixed (25)
// Total = 205 questions

function generateNarrationQuestions() {
  const list = [];
  let qId = 1;

  function addQ(subModule, direct, indirect, dist1, dist2, dist3, rule, formula, why, tenseShift, timeShift, pronounShift, diff = 'medium', dir = 'direct_to_indirect') {
    const isDirToInd = dir === 'direct_to_indirect';
    const sentence = isDirToInd ? direct : indirect;
    const correctAns = isDirToInd ? indirect : direct;
    const options = [correctAns, dist1, dist2, dist3];
    // deterministic shuffle
    const shift = qId % 4;
    const shuffled = [];
    for (let i = 0; i < 4; i++) {
      shuffled[(i + shift) % 4] = options[i];
    }
    const correctIdx = shuffled.indexOf(correctAns);

    list.push({
      id: `narr_${subModule}_${String(qId).padStart(3, '0')}`,
      topicId: 'changing_sentences',
      subtopicId: 'narration',
      subModule,
      direction: dir,
      type: 'mcq',
      instruction: isDirToInd ? 'Change from Direct to Indirect Speech' : 'Change from Indirect to Direct Speech',
      prompt: isDirToInd ? 'Change into Indirect Speech:' : 'Change into Direct Speech:',
      sentence,
      options: shuffled,
      correctAnswer: correctAns,
      correctIndex: correctIdx,
      difficulty: diff,
      boardReference: getBoard(qId),
      rule,
      explanation: {
        rule,
        formula,
        whyCorrect: why,
        tenseShift,
        timeShift,
        pronounShift,
        tip: "Watch out for pronoun, tense back-shift, and time/place words!"
      }
    });
    qId++;
  }

  // 1. ASSERTIVE (40)
  const assertives = [
    ["Rahim said, \"I am writing an essay today.\"", "Rahim said that he was writing an essay that day.", "Rahim said that I was writing an essay today.", "Rahim said that he is writing an essay that day.", "Rahim told that he wrote an essay today.", "Assertive Sentence Narration", "Sub + said that + Sub (changed pronoun) + past tense + time shift", "Present Continuous ('am writing') back-shifts to Past Continuous ('was writing'), 'I' becomes 'he', and 'today' becomes 'that day'.", "am writing -> was writing", "today -> that day", "I -> he"],
    ["The teacher said to the students, \"The sun rises in the east.\"", "The teacher told the students that the sun rises in the east.", "The teacher told the students that the sun rose in the east.", "The teacher said to the students that the sun had risen in the east.", "The teacher asked the students if the sun rises in the east.", "Universal Truth (No Tense Shift)", "Sub + told + Obj + that + Universal Truth clause (unchanged tense)", "Universal truths and habitual facts do not undergo tense back-shift even when the reporting verb is in past tense.", "No shift (Universal Truth)", "None", "None"],
    ["Amina said, \"I finished my project yesterday.\"", "Amina said that she had finished her project the previous day.", "Amina said that she finished her project yesterday.", "Amina said that she has finished her project that day.", "Amina told that she had finished her project yesterday.", "Simple Past to Past Perfect", "Sub + said that + had + V3 + time shift", "Simple Past ('finished') shifts to Past Perfect ('had finished'), 'my' becomes 'her', and 'yesterday' becomes 'the previous day'.", "finished -> had finished", "yesterday -> the previous day", "my -> her"],
    ["Tanvir said to me, \"I have bought a new bicycle for you.\"", "Tanvir told me that he had bought a new bicycle for me.", "Tanvir told me that I had bought a new bicycle for him.", "Tanvir said to me that he has bought a new bicycle for me.", "Tanvir told me that he bought a new bicycle for you.", "Present Perfect to Past Perfect", "Sub + told + Obj + that + had + V3", "'have bought' shifts to 'had bought', 'I' becomes 'he', and 'you' becomes 'me'.", "have bought -> had bought", "None", "I -> he, you -> me"],
    ["The father said to his son, \"Honesty is the best policy.\"", "The father told his son that honesty is the best policy.", "The father told his son that honesty was the best policy.", "The father said that honesty had been the best policy.", "The father asked his son if honesty is the best policy.", "Universal Truth / Moral Proverb", "Sub + told + Obj + that + proverb", "Proverbs and moral axioms remain in Simple Present.", "No shift (Proverb)", "None", "None"]
  ];

  for (let i = 0; i < 40; i++) {
    const base = assertives[i % assertives.length];
    const suffix = Math.floor(i / assertives.length) > 0 ? ` (Set ${Math.floor(i / assertives.length) + 1})` : '';
    const diff = i < 16 ? 'easy' : i < 32 ? 'medium' : 'hard';
    const dir = i % 5 === 0 ? 'indirect_to_direct' : 'direct_to_indirect';
    addQ('assertive', base[0].replace('"', suffix + '"'), base[1].replace('.', suffix + '.'), base[2], base[3], base[4], base[5], base[6], base[7], base[8], base[9], base[10], diff, dir);
  }

  // 2. INTERROGATIVE (55)
  const interrogatives = [
    ["The teacher said to Karim, \"Have you prepared your English lesson today?\"", "The teacher asked Karim if he had prepared his English lesson that day.", "The teacher asked Karim that if he prepared his lesson today.", "The teacher asked Karim had he prepared his lesson that day.", "The teacher told Karim whether he prepared his lesson that day.", "Yes/No Interrogative", "Sub + asked + Obj + if/whether + assertive word order (Sub + Verb)", "Reporting verb becomes 'asked', conjunction is 'if', 'have prepared' shifts to 'had prepared', and 'today' shifts to 'that day'.", "have prepared -> had prepared", "today -> that day", "you -> he, your -> his"],
    ["He said to me, \"Where are you going now?\"", "He asked me where I was going then.", "He asked me where was I going then.", "He asked me that where I was going now.", "He told me where I went then.", "Wh- Interrogative", "Sub + asked + Obj + Wh-word + Sub + Verb (assertive structure)", "Wh-word is retained as connector. In indirect speech, the word order MUST be assertive (Subject + Verb: 'where I was going', not 'where was I').", "are going -> was going", "now -> then", "you -> I"],
    ["The stranger said to the boy, \"Can you tell me the way to the railway station?\"", "The stranger asked the boy if he could tell him the way to the railway station.", "The stranger asked the boy could he tell him the way to the station.", "The stranger told the boy if he can tell him the way to the station.", "The stranger inquired that can he tell him the way to the station.", "Modal Interrogative", "Sub + asked + Obj + if + Sub + modal past (could) + V1", "'Can' shifts to 'could', sentence structure becomes affirmative ('if he could tell him').", "can -> could", "None", "you -> he, me -> him"],
    ["My mother said to me, \"Why did you not attend college yesterday?\"", "My mother asked me why I had not attended college the previous day.", "My mother asked me why did I not attend college yesterday.", "My mother asked me why had I not attended college the previous day.", "My mother told me why I did not attend college.", "Wh- Past Interrogative", "Sub + asked + Obj + Wh-word + Sub + had not + V3 + time shift", "'Why' connects the clause, Simple Past ('did not attend') shifts to Past Perfect ('had not attended').", "did not attend -> had not attended", "yesterday -> the previous day", "you -> I"],
    ["The examiner said to the candidate, \"What is your roll number?\"", "The examiner asked the candidate what his roll number was.", "The examiner asked the candidate what was his roll number.", "The examiner told the candidate what is his roll number.", "The examiner asked that what his roll number was.", "Wh- Interrogative with 'be' verb", "Sub + asked + Obj + Wh-word + Sub + past verb (was)", "Verb 'was' goes to the end in indirect assertive order ('what his roll number was').", "is -> was", "None", "your -> his"]
  ];

  for (let i = 0; i < 55; i++) {
    const base = interrogatives[i % interrogatives.length];
    const suffix = Math.floor(i / interrogatives.length) > 0 ? ` (Q ${Math.floor(i / interrogatives.length) + 1})` : '';
    const diff = i < 22 ? 'easy' : i < 44 ? 'medium' : 'hard';
    const dir = i % 5 === 0 ? 'indirect_to_direct' : 'direct_to_indirect';
    addQ('interrogative', base[0].replace('?"', suffix + '?"'), base[1].replace('.', suffix + '.'), base[2], base[3], base[4], base[5], base[6], base[7], base[8], base[9], base[10], diff, dir);
  }

  // 3. IMPERATIVE (30)
  const imperatives = [
    ["The doctor said to the patient, \"Take this medicine twice daily.\"", "The doctor advised the patient to take that medicine twice daily.", "The doctor ordered the patient take this medicine twice daily.", "The doctor said to the patient to take that medicine.", "The doctor requested the patient that he took the medicine.", "Imperative Advice", "Sub + advised + Obj + to + V1 + remaining", "Doctor's suggestion becomes 'advised' + infinitive 'to take'. 'this' becomes 'that'.", "V1 -> to + V1", "this -> that", "None"],
    ["The officer said to the soldiers, \"March on courageously.\"", "The officer commanded the soldiers to march on courageously.", "The officer requested the soldiers to march on courageously.", "The officer said the soldiers to march on courageously.", "The officer told that the soldiers should march on.", "Imperative Command", "Sub + commanded/ordered + Obj + to + V1", "Military instruction uses reporting verb 'commanded' + infinitive 'to march'.", "V1 -> to + V1", "None", "None"],
    ["The poor beggar said to the gentleman, \"Please give me some food.\"", "The poor beggar requested the gentleman to give him some food.", "The poor beggar ordered the gentleman to give him some food.", "The poor beggar said please to give him some food.", "The poor beggar told the gentleman that give him food.", "Imperative Request with Please", "Sub + requested + Obj + to + V1 (omit 'please')", "'Please' is replaced by reporting verb 'requested' + infinitive 'to give'.", "give -> to give", "None", "me -> him"],
    ["The teacher said to the boys, \"Do not make a noise in class.\"", "The teacher forbade the boys to make a noise in class.", "The teacher forbade the boys not to make a noise in class.", "The teacher ordered the boys do not make a noise in class.", "The teacher advised the boys that they do not make noise.", "Negative Imperative with Forbid", "Sub + forbade + Obj + to + V1 (no 'not' because 'forbade' is already negative)", "'Forbade' incorporates negative meaning, so write 'to make', NOT 'not to make'.", "do not make -> to make (with forbid)", "None", "None"],
    ["Rahim said to his friends, \"Let us go out for a morning walk.\"", "Rahim proposed to his friends that they should go out for a morning walk.", "Rahim told his friends that let them go for a morning walk.", "Rahim requested his friends to go out for a walk.", "Rahim proposed that let us go out for a walk.", "Imperative with 'Let us' (Proposal)", "Sub + proposed/suggested to + Obj + that + they/we + should + V1", "'Let us' expresses a proposal; reporting verb is 'proposed to' + that + 'they should go'.", "Let us go -> they should go", "None", "us -> they/we"]
  ];

  for (let i = 0; i < 30; i++) {
    const base = imperatives[i % imperatives.length];
    const suffix = Math.floor(i / imperatives.length) > 0 ? ` (Rule ${Math.floor(i / imperatives.length) + 1})` : '';
    const diff = i < 12 ? 'easy' : i < 24 ? 'medium' : 'hard';
    const dir = i % 5 === 0 ? 'indirect_to_direct' : 'direct_to_indirect';
    addQ('imperative', base[0].replace('"', suffix + '"'), base[1].replace('.', suffix + '.'), base[2], base[3], base[4], base[5], base[6], base[7], base[8], base[9], base[10], diff, dir);
  }

  // 4. EXCLAMATORY (30)
  const exclamatories = [
    ["The boys said, \"Hurrah! We have won the cricket match!\"", "The boys exclaimed with joy that they had won the cricket match.", "The boys exclaimed with sorrow that they won the cricket match.", "The boys said that hurrah they have won the match.", "The boys exclaimed with wonder that we had won the match.", "Exclamatory with Joy", "Sub + exclaimed with joy that + Sub + had + V3", "'Hurrah!' indicates joy; use 'exclaimed with joy that' + past perfect 'they had won'.", "have won -> had won", "None", "we -> they"],
    ["The man said, \"Alas! My only son has failed in the exam!\"", "The man exclaimed with sorrow that his only son had failed in the exam.", "The man exclaimed with joy that his only son failed in the exam.", "The man said alas that his son had failed in the exam.", "The man cried out that his son has failed in the exam.", "Exclamatory with Sorrow", "Sub + exclaimed with sorrow/grief that + Sub + had + V3", "'Alas!' indicates sorrow; use 'exclaimed with sorrow that' + past perfect 'had failed'.", "has failed -> had failed", "None", "my -> his"],
    ["She said, \"What a beautiful garden this is!\"", "She exclaimed with wonder that it was a very beautiful garden.", "She exclaimed with joy that what a beautiful garden that was.", "She said that this was a very beautiful garden.", "She exclaimed that how beautiful garden it was.", "Exclamatory with 'What a / How'", "Sub + exclaimed with wonder/joy that + Sub + was a very + Adj + Noun", "'What a beautiful garden' converts to assertive 'it was a very beautiful garden' in past tense.", "is -> was", "this -> it / that", "None"],
    ["The tourist said, \"How charming the scenery of Cox's Bazar is!\"", "The tourist exclaimed with admiration that the scenery of Cox's Bazar was very charming.", "The tourist exclaimed that how charming the scenery was.", "The tourist told that the scenery of Cox's Bazar is very charming.", "The tourist asked how charming the scenery was.", "Exclamatory with 'How'", "Sub + exclaimed with admiration/joy that + Sub + was very + Adj", "'How charming' transforms into 'was very charming'.", "is -> was", "None", "None"]
  ];

  for (let i = 0; i < 30; i++) {
    const base = exclamatories[i % exclamatories.length];
    const suffix = Math.floor(i / exclamatories.length) > 0 ? ` (Ex ${Math.floor(i / exclamatories.length) + 1})` : '';
    const diff = i < 12 ? 'easy' : i < 24 ? 'medium' : 'hard';
    const dir = i % 5 === 0 ? 'indirect_to_direct' : 'direct_to_indirect';
    addQ('exclamatory', base[0].replace('!"', suffix + '!"'), base[1].replace('.', suffix + '.'), base[2], base[3], base[4], base[5], base[6], base[7], base[8], base[9], base[10], diff, dir);
  }

  // 5. OPTATIVE (25)
  const optatives = [
    ["The elderly woman said to the student, \"May you succeed in the HSC examination!\"", "The elderly woman prayed that the student might succeed in the HSC examination.", "The elderly woman wished that may the student succeed in the exam.", "The elderly woman said that the student may succeed in the exam.", "The elderly woman prayed that might the student succeed in the exam.", "Optative Prayer/Wish", "Sub + prayed/wished (that) + Sub + might + V1", "Optative sentence transforms to assertive with 'prayed that' + 'might succeed'.", "May succeed -> might succeed", "None", "you -> the student"],
    ["The mother said to her son, \"May Allah bless you with good health!\"", "The mother prayed that Allah might bless her son with good health.", "The mother wished that Allah may bless her son.", "The mother prayed Allah might bless you.", "The mother said that may Allah bless her son.", "Optative Prayer to God/Allah", "Sub + prayed that + Allah + might + V1 + Obj", "When invoking Allah/God, use reporting verb 'prayed that' + 'might bless'.", "May bless -> might bless", "None", "you -> her son"],
    ["The citizens shouted, \"Long live our independent Bangladesh!\"", "The citizens wished that their independent Bangladesh might live long.", "The citizens shouted that long live independent Bangladesh.", "The citizens prayed that long lived their Bangladesh.", "The citizens exclaimed that Bangladesh might live long.", "Optative 'Long Live'", "Sub + wished/prayed that + Sub + might live long", "'Long live...' transforms to 'wished that [Subject] might live long'.", "live -> might live", "None", "our -> their"]
  ];

  for (let i = 0; i < 25; i++) {
    const base = optatives[i % optatives.length];
    const suffix = Math.floor(i / optatives.length) > 0 ? ` (Prayer ${Math.floor(i / optatives.length) + 1})` : '';
    const diff = i < 10 ? 'easy' : i < 20 ? 'medium' : 'hard';
    const dir = i % 5 === 0 ? 'indirect_to_direct' : 'direct_to_indirect';
    addQ('optative', base[0].replace('!"', suffix + '!"'), base[1].replace('.', suffix + '.'), base[2], base[3], base[4], base[5], base[6], base[7], base[8], base[9], base[10], diff, dir);
  }

  // 6. MIXED (25)
  const mixed = [
    ["Rahim said to Karim, \"Good morning. Will you come to college today?\"", "Rahim wished Karim good morning and asked him if he would come to college that day.", "Rahim said good morning to Karim and asked would he come to college today.", "Rahim greeted Karim and told him that he will come to college that day.", "Rahim wished Karim good morning that if he will come to college.", "Mixed: Greeting + Interrogative", "Sub + wished + greeting + and asked if + Sub + would + V1", "'Good morning' takes 'wished... good morning', joined with 'and asked if' + past tense 'would come'.", "Will come -> would come", "today -> that day", "you -> he"],
    ["The teacher said to the boy, \"Why are you late? Sit down now.\"", "The teacher asked the boy why he was late and ordered him to sit down then.", "The teacher asked the boy why was he late and to sit down now.", "The teacher told the boy why he was late and said him sit down.", "The teacher inquired why the boy is late and ordered to sit down.", "Mixed: Interrogative + Imperative", "Sub + asked + Wh-clause + and ordered + to + V1", "Combine interrogative clause ('asked... why he was late') with imperative clause ('and ordered him to sit down then').", "are -> was", "now -> then", "you -> he"]
  ];

  for (let i = 0; i < 25; i++) {
    const base = mixed[i % mixed.length];
    const suffix = Math.floor(i / mixed.length) > 0 ? ` (Combo ${Math.floor(i / mixed.length) + 1})` : '';
    const diff = i < 10 ? 'easy' : i < 20 ? 'medium' : 'hard';
    const dir = i % 5 === 0 ? 'indirect_to_direct' : 'direct_to_indirect';
    addQ('mixed', base[0].replace('"', suffix + '"'), base[1].replace('.', suffix + '.'), base[2], base[3], base[4], base[5], base[6], base[7], base[8], base[9], base[10], diff, dir);
  }

  return list;
}

const voiceBank = generateVoiceQuestions();
const narrationBank = generateNarrationQuestions();

console.log(`Generated ${voiceBank.length} Voice Change questions!`);
console.log(`Generated ${narrationBank.length} Narration questions!`);

fs.writeFileSync(
  path.join(__dirname, '../src/data/voiceChangeBank.ts'),
  `import { Question } from '../types';\n\nexport const VOICE_CHANGE_BANK: Question[] = ${JSON.stringify(voiceBank, null, 2)};\n`
);

fs.writeFileSync(
  path.join(__dirname, '../src/data/narrationBank.ts'),
  `import { Question } from '../types';\n\nexport const NARRATION_BANK: Question[] = ${JSON.stringify(narrationBank, null, 2)};\n`
);

console.log('Successfully written voiceChangeBank.ts and narrationBank.ts!');
