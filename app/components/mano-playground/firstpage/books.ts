export const moods = ["Something Mysterious", "Make Me Think", "Feel Something", "Take Me Away", "Surprise Me"] as const
export type Mood = typeof moods[number]
export interface Book {
  id: string
  title: string
  author: string
  genre: string
  moods: readonly Mood[]
  description: string
  color: string
  accent: string
  artwork: "house" | "orbit" | "letters" | "window" | "orchard" | "river"
  chapter: string
  quote: string
  pages: readonly (readonly string[])[]
}

/** Original fictional books and excerpts written for FirstPage. No external text or ratings. */
export const books: readonly Book[] = [
  {
    id: "house", title: "The Silent Room", author: "Elena Marlowe", genre: "Mystery", chapter: "The Letter", quote: "Some doors should never be opened. But here you are.",
    moods: ["Something Mysterious", "Feel Something"], color: "#203c3b", accent: "#d7c38d", artwork: "house",
    description: "A mysterious letter. A forgotten past. A truth that was never meant to be found. The Silent Room is a haunting novel about secrets, second chances, and the courage to uncover what lies beneath.",
    pages: [
      ["The envelope arrived on a rainy Tuesday, the kind of day when the city seemed to speak in whispers. No stamp. No return address. Just my name, written in a hand I thought I would never see again.",
       "For a long moment, I simply held it, feeling the weight of a past I had tried so carefully to forget. The paper was thicker than ordinary mail, almost like something meant to last. When I finally opened it, a single sheet slid out, and with it, a question that changed everything."],
      ["I read the words again, and again. They felt like a warning, and an invitation, both at the same time. My hands were shaking, not from fear, but from the strange sense that this letter had been waiting for me all along.",
       "Outside, the rain grew heavier, tapping against the window as if urging me to decide. I folded the letter and placed it on the table, but I knew there was no putting curiosity back in its box. Some mysteries, it seems, have a way of finding you, no matter how far you run."],
      ["At the end of Bellwether Lane, a single lamp was still burning. I had passed that house every morning for seven years without noticing the narrow door between its windows. Tonight the door stood open, and the rain stopped at its threshold.",
       "Inside, someone had laid out two cups. The second held a folded photograph of me as a child, standing in a room I had never seen. Behind the child was a man with his face scratched away.",
       "A floorboard moved upstairs. I turned to leave, but a familiar voice spoke from the darkness. ‘You remembered the letter,’ it said. ‘Now you must remember who sent it.’"],
      ["I knew the voice. That was the thing I had kept from myself through every empty year: not its sound, but the fact that I could still recognise it. I stepped into the hallway and closed the door gently behind me.", "On the stairs, the lamp lit a line of wet footprints. They were smaller than mine. They led upward to a room whose handle was wrapped in the same blue ribbon my brother had worn around his wrist the day he vanished.", "I took the letter from my pocket. For the first time, I looked at its other side. There, beneath a smear of rain, were four words: This time, come alone."],
    ],
  },
  {
    id: "stars", title: "The Last Equation", author: "Adrian Sol", genre: "Science Fiction", chapter: "Eight Seconds", quote: "The universe had answered. We had not yet asked the question.",
    moods: ["Make Me Think", "Take Me Away"], color: "#202840", accent: "#e3ac76", artwork: "orbit",
    description: "At the edge of inhabited space, a maintenance engineer receives a message from a future that should not exist.",
    pages: [
      ["At 04:12, the stars went out for eight seconds. Mina noticed because she was washing a spoon. In the black kitchen window, her own face appeared suddenly and completely, as if somebody had turned on a light in a room she had forgotten she lived in.",
       "The station reported no fault. It reported this in the kind voice reserved for people who had spent too long alone. Mina dried the spoon, counted the remaining tins of peaches, and filed an incident anyway.",
       "At 04:13, a reply arrived. It was signed by her. The date was twenty-seven years from now. Please, it said, do not repair the window."],
      ["Mina read the message three times. Then she checked the transmission delay. A reply from Earth took forty-six minutes. A reply from anywhere else took longer. This one had taken less than a second.",
       "She asked the station to identify the sender. ‘Local maintenance engineer,’ it said. ‘Mina Orrel.’ Its confidence was ninety-nine point nine percent. Mina disliked the remaining fraction more than she disliked the impossible number.",
       "She put the spoon beside the window. On the other side of the glass, one star blinked. Not off and on, but nearer and farther. Like a person deciding whether to knock."],
      ["There was a recording attached to the message. Mina had not opened it because the thumbnail showed her kitchen with two chairs. She had ordered one. She had assembled one. She had never needed another.",
       "In the recording, an older woman sat with her back to the camera. Across from her was a child, peeling an orange in one unbroken ribbon. ‘This is not a warning,’ the woman said. ‘It’s an invitation. I know those sound alike to you.’",
       "The child looked straight at the camera. Mina paused the recording. On the counter behind them lay her spoon, bent carefully into the shape of a key."],
      ["Mina carried the recording to the observation room. The station offered to make tea, then offered to call Earth, then stopped offering things. Beyond the glass, the strange star had grown large enough to show a shadow moving across its surface.", "She opened her maintenance log and wrote down everything she was certain of. Her name. The date. The number of chairs in the kitchen. After a while she crossed out the date. Then she crossed out the chairs.", "From the corridor came the unmistakable sound of an orange rolling across the floor. Mina turned slowly. Somewhere on the other side of the window, a child began to laugh."],
    ],
  },
  {
    id: "letters", title: "Under the Same Sky", author: "Clara Bennett", genre: "Romance", chapter: "Unsent", quote: "Some distances are measured in the things we never say.",
    moods: ["Feel Something"], color: "#773e3e", accent: "#f2d6b7", artwork: "letters",
    description: "Two strangers inherit a box of unfinished letters—and discover that some conversations are worth beginning again.",
    pages: [
      ["There were forty-three letters in the biscuit tin, and none of them had been sent. Every envelope carried a name in my grandmother’s handwriting. Every stamp was a little crooked. She had always been impatient with things that needed to be straight.",
       "I was sorting them into decades when a man knocked on the open door. He held the other half of the tin’s lid. A blue flower matched the broken one in my hands.",
       "‘I think,’ he said, with the caution of someone offering bad news, ‘our grandparents may have been keeping the same secret.’ I had already put the kettle on. I put out another cup."],
      ["His name was Daniel. He apologised to the chair before moving it, which made me like him against my better judgement. He had brought twelve letters and a photograph of a woman laughing at something outside the frame.",
       "The woman was my grandmother. I had known her for thirty years and had never seen that particular laugh. It was untidy, unguarded. It belonged to someone who had not yet learned which parts of herself to put away.",
       "‘Should we read them?’ Daniel asked. I looked at the envelopes between us. ‘Maybe just one.’ Neither of us reached for it."],
      ["We chose the oldest letter. It began, I am writing this instead of doing the sensible thing. Daniel smiled at the ceiling. ‘That sounds like him.’ I watched his expression change as I read the next line aloud.",
       "They had agreed to meet at a station that no longer existed. One had arrived early; one had arrived at the wrong station. Between those two small mistakes lay sixty years and two quite different lives.",
       "Outside, rain began to darken the pavement. Daniel checked his watch, then turned it face down. ‘I don’t have to leave yet,’ he said. For some reason, I believed he was telling me more than the time."],
      ["We stayed until the rain thinned into a soft silver light. Daniel read the next letter while I washed the cups, stopping now and then over a phrase that sounded impossibly familiar. Our grandparents had written around the truth for years, leaving it in the spaces between ordinary things.", "When he finally stood to leave, he put one envelope beside my keys. It was empty. ‘For the sensible thing,’ he said, smiling at the floor. I thought about all the stations people arrived at too early, or too late.", "At the door I asked whether he would come back tomorrow. This time, neither of us pretended we were only talking about the letters."],
    ],
  },
  {
    id: "inventory", title: "The Paper Kingdom", author: "Noah Ellis", genre: "Literary Fiction", chapter: "What Remains", quote: "A life is also made of everything we choose to keep.",
    moods: ["Make Me Think", "Feel Something"], color: "#bba888", accent: "#293f43", artwork: "window",
    description: "After his father’s death, a son returns to an ordinary flat and finds an extraordinary account of everything left unsaid.",
    pages: [
      ["My father left me a list of everything he did not own. No car. No good winter coat. No opinion about the sea. The list was written on the back of a gas bill and folded twice, as if he had intended to carry it somewhere important.",
       "I found it in the drawer where he kept elastic bands, dead batteries, and the keys to houses we had already left. At the bottom, in smaller writing, was one final item: enough time.",
       "The estate agent was due at two. I sat on the kitchen floor and began, for the first time in my life, to be late for something on purpose."],
      ["At school I had been asked what my father did. ‘Repairs,’ I said. It seemed sufficient. He repaired radios, doorbells, the small misunderstandings between neighbours. He could find a fault by listening to the silence around it.",
       "But the kitchen clock had been broken for as long as I could remember. Its hands rested at twenty past six. I had assumed he liked the hour. Now I took it off the wall and found a photograph tucked behind the battery cover.",
       "My mother stood beside a bus with her shoes in her hand. On the back, he had written: The minute before she came home."],
      ["The estate agent called to say she was running late. ‘That’s fine,’ I told her, and meant it so completely that it surprised me. I set the clock on the table without replacing its battery.",
       "In the cupboard were six jars of screws, sorted by size, and one jar of things he had not been able to name. A shell. A red button. A piece of pale glass with all its edges softened. I poured them into my palm.",
       "I had spent years learning to describe what I did. My father had spent years learning what to keep. For once, his work seemed the more difficult of the two."],
      ["The estate agent arrived carrying a folder full of possible futures. Open-plan kitchen. Fresh paint. A wall removed to bring in the light. I let her finish before asking whether she had ever noticed how a room changes when you know who has sat in it.", "She closed the folder. For a moment she was simply another person standing in my father's kitchen. ‘You don't have to decide today,’ she said. Outside, the afternoon bus pulled away from the stop where he used to wait for me.", "I put the small red button back in its jar. Then I took out the gas bill and began, on the empty side, a list of things I did."],
    ],
  },
  {
    id: "orchard", title: "The Ember Crown", author: "Lyra Ashford", genre: "Fantasy", chapter: "In the Margins", quote: "The world had misplaced a kingdom. It had not forgotten its heir.",
    moods: ["Take Me Away", "Something Mysterious"], color: "#34473d", accent: "#e3bd7a", artwork: "orchard",
    description: "An apprentice mapmaker finds a forest that grows forgotten places, and a fruit containing her own lost home.",
    pages: [
      ["The orchard appeared in the margin. Tessa was copying a map of the southern provinces when a branch pushed through the ink and scattered wet leaves across her desk. By the time she fetched a cloth, it had grown an apple.",
       "The apple was the colour of a house she no longer remembered. She knew this with the same certainty she knew her own name, although the house itself remained stubbornly out of reach.",
       "Master Pell came to the doorway, saw the branch, and locked the door behind him. ‘Whatever it offers you,’ he said, ‘ask what it has already taken.’"],
      ["Pell brought a map with no edges. It unfolded once, then again, then into a space larger than the room. Tessa could see roads turning slowly in the paper, looking for villages that had moved in the night.",
       "‘We don’t make maps,’ he said. ‘We negotiate with them.’ The orchard was a place for things the world had misplaced. A harbour without ships. A school without children. Her house, perhaps, without her.",
       "Tessa touched the apple. A sound came from inside it: someone setting plates on a table, making room for one more."],
      ["She waited until Pell slept. It was easier than waiting until she was brave. The branch had thickened into a narrow path, and she stepped onto it with a candle and the smallest map she could find.",
       "Beyond the desk lay a field of paper grass. Every blade held a word. Some were names; some were apologies. She tried not to read them. At the edge of the orchard, a boy stood beside a tree hung with little brass doors.",
       "‘What have you lost?’ he asked. Tessa lifted the apple. The boy stepped back. ‘No,’ he said. ‘What lost you?’"],
      ["Tessa looked down at the apple. In its skin she could see a window, and beyond the window a girl asleep at a table covered in maps. The girl had her face. Beside her, a candle had burned nearly to its holder.", "‘Everyone thinks being lost means they must find a way back,’ the boy said. He opened one of the brass doors. Beyond it, a city of tall black towers glowed as if a fire were being kept carefully behind every window. ‘Sometimes the way back is what lost you.’", "For the first time, Tessa noticed the mark beneath the apple's leaf: a small crown, drawn in ink that was still warm."],
    ],
  },
  {
    id: "river", title: "Beyond the Map", author: "Rowan Hale", genre: "Adventure", chapter: "Upriver", quote: "The map ended. The journey did not.",
    moods: ["Take Me Away"], color: "#a65d3c", accent: "#f0d9ac", artwork: "river",
    description: "A reluctant guide and a cartographer follow a river inland, carrying a boat named after a promise neither intends to keep.",
    pages: [
      ["We were three days upriver when the compass began pointing at me. I turned it over. I tapped the glass. I gave it to Ada, who held it at arm’s length and laughed once, without pleasure.",
       "‘That’s inconvenient,’ she said. She had hired me because I knew the river. I had accepted because I owed money to a man who knew where I lived. Neither fact seemed useful now.",
       "Ahead of us, the water divided around a white stone. Ada’s map showed a single channel. On the stone, fresh paint spelled my name. Beneath it was a date: tomorrow."],
      ["Ada wanted to take the left channel. Her map was clear about that, though it had been clear about several things that were no longer true. I wanted to turn back. The river, without asking either of us, began flowing uphill.",
       "We pulled the boat onto the bank and argued quietly, because the forest had gone quiet first. Then Ada opened the case she had kept dry through every storm. Inside was a map drawn by her mother, who had died before Ada was born.",
       "In one corner, a small boat carried two figures. One wore my coat."],
      ["We carried the boat past the white stone. It was named Almost Home, a joke I had stopped finding funny years ago. Ada took the heavier end without comment. I was grateful for that, and more frightened because of it.",
       "At the top of the hill, the river waited in a bowl of dark rock. Stars moved on its surface, though it was still afternoon. On the far bank stood a woman wearing Ada’s face at a different age.",
       "She raised a hand. Ada let go of the boat. The compass in my pocket turned, slowly, away from me."],
      ["The woman on the far bank lowered her hand. Ada took one step toward the water, then stopped. The river showed us three reflections where only two people stood. In the third, someone was already crossing.", "I set the compass on a stone and watched its needle settle toward the place we had come from. It was the first sensible thing it had done all day, which made me trust it less. Ada unfolded her mother's map. A new line was drying across the empty margin.", "‘We can still go home,’ I said. She looked at the waiting woman. ‘I know.’ Then she picked up her end of the boat."],
    ],
  },
]
