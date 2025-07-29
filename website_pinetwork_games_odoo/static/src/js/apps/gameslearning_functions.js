// --- Lesson Data for Chess Learning Path ---
const chessLessonsData = [
    {
        "id": "c1",
        "title": "History and Objective of Chess",
        "description": "Learn about the origins of chess and its ultimate goal.",
        "level": "Beginner",
        "content": "<p>Chess is one of the oldest and most popular board games in the world. Its origins can be traced back to India in the 6th century AD, from a game called Chaturanga. It evolved through Persia and the Arab world before spreading to Europe, where it took on its modern form around the 15th century.</p><h3>Objective of Chess:</h3><p>The main objective in chess is to <strong>checkmate</strong> your opponent's king. Checkmate occurs when the king is under attack (in 'check') and there is no legal move to escape the attack. Once a king is checkmated, the game ends, and the player who delivered the checkmate wins.</p><p>Other ways a game can end include:</p><ul><li><strong>Resignation:</strong> A player may resign if they believe their position is hopeless.</li><li><strong>Stalemate:</strong> If a player has no legal moves but is NOT in check, the game is a draw.</li><li><strong>Draw by Agreement:</strong> Players can agree to a draw at any point.</li><li><strong>Draw by Repetition:</strong> If the same position occurs three times.</li><li><strong>Draw by Fifty-Move Rule:</strong> If no pawn has been moved and no piece has been captured for fifty consecutive moves.</li></ul>"
    },
    {
        "id": "c2",
        "title": "The Chessboard and Piece Setup",
        "description": "Understand the chessboard layout and how to set up the pieces.",
        "level": "Beginner",
        "content": "<p>The chessboard is an 8x8 grid of 64 squares, alternating between light and dark colors. It's crucial to set up the board correctly before starting a game.</p><h3>Board Orientation:</h3><ul><li>The square in the bottom-right corner for both players must be a light square. (Rule: 'white on the right')</li><li>The rows are called <strong>ranks</strong> (numbered 1 to 8 from White's side).</li><li>The columns are called <strong>files</strong> (lettered 'a' to 'h' from White's left).</li></ul><h3>Piece Setup:</h3><p>Each player starts with 16 pieces:</p><ul><li>One King (K)</li><li>One Queen (Q)</li><li>Two Rooks (R)</li><li>Two Knights (N)</li><li>Two Bishops (B)</li><li>Eight Pawns (P)</li></ul><p><strong>White's Setup:</strong></p><ul><li><strong>Rank 1:</strong> R, N, B, Q, K, B, N, R (from a1 to h1)</li><li><strong>Rank 2:</strong> Eight Pawns</li></ul><p><strong>Black's Setup:</strong></p><ul><li><strong>Rank 8:</strong> r, n, b, q, k, b, n, r (from a8 to h8)</li><li><strong>Rank 7:</strong> Eight Pawns</li></ul><p class=\"example-text\">Remember: The White Queen starts on a white square (d1), and the Black Queen starts on a black square (d8). ('Queen on her own color')</p>"
    },
    {
        "id": "c3",
        "title": "How Each Piece Moves (Part 1: Pawn, Rook, Bishop)",
        "description": "Learn the basic movements of pawns, rooks, and bishops.",
        "level": "Beginner",
        "content": "<h3>Pawn:</h3><ul><li>Moves forward one square at a time.</li><li>On its very first move, a pawn can move forward two squares.</li><li>Captures diagonally one square forward.</li><li>Cannot move backward.</li></ul><h3>Rook:</h3><ul><li>Moves any number of squares horizontally or vertically.</li><li>Cannot jump over other pieces.</li></ul><h3>Bishop:</h3><ul><li>Moves any number of squares diagonally.</li><li>Always stays on squares of the same color.</li><li>Cannot jump over other pieces.</li></ul>"
    },
    {
        "id": "c4",
        "title": "How Each Piece Moves (Part 2: Knight, Queen, King)",
        "description": "Learn the basic movements of knights, queens, and kings.",
        "level": "Beginner",
        "content": "<h3>Knight:</h3><ul><li>Moves in an 'L' shape: two squares in one direction (horizontal or vertical) and then one square perpendicular to that direction.</li><li>Is the only piece that can jump over other pieces.</li></ul><h3>Queen:</h3><ul><li>Combines the moves of a Rook and a Bishop.</li><li>Moves any number of squares horizontally, vertically, or diagonally.</li><li>Cannot jump over other pieces.</li></ul><h3>King:</h3><ul><li>Moves one square in any direction (horizontal, vertical, or diagonal).</li><li>The King is the most important piece; if it is checkmated, the game is lost.</li></ul>"
    },
    {
        "id": "c5",
        "title": "Basic Capturing Rules",
        "description": "Understand how pieces capture opponent's pieces.",
        "level": "Beginner",
        "content": "<p>When a piece moves to a square occupied by an opponent's piece, the opponent's piece is captured and removed from the board. Each piece captures according to its own movement rules.</p><ul><li><strong>Pawns:</strong> Capture diagonally one square forward. They are the only piece that moves differently than they capture.</li><li><strong>Rooks, Bishops, Queens, Kings, Knights:</strong> Capture by moving to the square occupied by an opponent's piece, following their regular movement rules.</li></ul><p class=\"example-text\">If a Rook moves horizontally and lands on an opponent's Knight, the Knight is captured. If a Pawn moves diagonally to a square occupied by an opponent's Pawn, that Pawn is captured.</p>"
    },
    {
        "id": "c6",
        "title": "Special Moves: Castling and En Passant",
        "description": "Learn two unique and often misunderstood moves in chess.",
        "level": "Beginner",
        "content": "<h3>Castling:</h3><p>Castling is a special move involving the King and one of the Rooks. It's the only move where two pieces move at once, and the only time the King moves more than one square.</p><ul><li><strong>Conditions:</strong> The King and Rook must not have moved yet. There must be no pieces between the King and the Rook. The King must not be in check, nor pass through a square that is attacked by an opponent's piece.</li><li><strong>How to:</strong> The King moves two squares towards the Rook, and the Rook moves to the square the King crossed.</li></ul><h3>En Passant (French for 'in passing'):</h3><p>This is a special pawn capture that can only occur immediately after a pawn moves two squares forward from its starting position, and lands beside an opponent's pawn.</p><ul><li><strong>Conditions:</strong> An opponent's pawn moves two squares from its starting rank, landing adjacent to your pawn on the same rank. Your pawn must be on its 5th rank (for White) or 4th rank (for Black).</li><li><strong>How to:</strong> Your pawn moves diagonally to the square the opponent's pawn *passed through*, capturing it as if it had only moved one square. This must be done immediately on the next turn, or the right to capture en passant is lost.</li></ul>"
    },
    {
        "id": "c7",
        "title": "Check and Checkmate Basics",
        "description": "Understand what 'check' and 'checkmate' mean and how to respond.",
        "level": "Beginner",
        "content": "<h3>Check:</h3><p>A King is in <strong>check</strong> when it is directly attacked by one or more of the opponent's pieces. When your King is in check, you must immediately make a move to get out of check. There are three ways to escape check:</p><ol><li><strong>Move the King:</strong> Move the King to a square where it is no longer attacked.</li><li><strong>Block the Attack:</strong> Place another one of your pieces between the attacking piece and your King (not possible if the attacking piece is a Knight or a Pawn).</li><li><strong>Capture the Attacking Piece:</strong> Capture the piece that is putting your King in check.</li></ol><h3>Checkmate:</h3><p><strong>Checkmate</strong> (often abbreviated as 'mate') occurs when the King is in check and there are no legal moves to escape the attack. When a King is checkmated, the game ends, and the player who delivered the checkmate wins. This is the ultimate goal of chess.</p>"
    },
    {
        "id": "c8",
        "title": "Opening Principles",
        "description": "Learn fundamental strategies for the beginning phase of a chess game.",
        "level": "Beginner",
        "content": "<p>The opening is the first phase of a chess game, typically the first 10-15 moves. Following these principles will help you develop a strong position:</p><ol><li><strong>Control the Center:</strong> The central squares (d4, e4, d5, e5) are the most important. Controlling them gives your pieces more mobility and influence over the board.</li><li><strong>Develop Your Pieces:</strong> Bring your Knights and Bishops out from their starting squares. Get them into active positions where they can control squares and attack.</li><li><strong>King Safety (Castle Early):</strong> Castling is a crucial move to get your King to safety behind a wall of pawns and bring a Rook into the game.</li><li><strong>Don't Move the Same Piece Twice:</strong> In the opening, try to develop new pieces rather than moving an already developed piece multiple times, unless there's a very good reason.</li><li><strong>Don't Bring Your Queen Out Too Early:</strong> The Queen is powerful, but bringing her out too early can make her a target for smaller pieces, forcing you to move her repeatedly and lose tempo.</li><li><strong>Connect Your Rooks:</strong> Once your King has castled and your minor pieces are developed, try to clear the way so your Rooks can see each other across the back rank.</li></ol>"
    },
    {
        "id": "ci1",
        "title": "Opening Strategies and Common Openings",
        "description": "Explore popular chess openings and their underlying ideas.",
        "level": "Intermediate",
        "content": "<p>Chess openings are sequences of initial moves that have been studied and analyzed for centuries. They aim to achieve specific strategic goals.</p><h3>Key Opening Goals:</h3><ul><li><strong>Rapid Development:</strong> Get your pieces off the back rank and into active positions quickly.</li><li><strong>Central Control:</strong> Dominate the center of the board with pawns and pieces.</li><li><strong>King Safety:</strong> Castle your king to a safe location.</li><li><strong>Pawn Structure:</strong> Create a healthy pawn structure without isolated, doubled, or backward pawns.</li></ul><h3>Common Openings (White's first move):</h3><ul><li><strong>1. e4 (King's Pawn Opening):</strong> The most popular opening. Opens lines for the Queen and King's Bishop. Leads to open, tactical games. Examples: Ruy Lopez, Italian Game, Sicilian Defense (Black's response).</li><li><strong>1. d4 (Queen's Pawn Opening):</strong> Leads to more closed, positional games. Examples: Queen's Gambit, Nimzo-Indian Defense, King's Indian Defense.</li><li><strong>1. c4 (English Opening):</strong> A flexible opening that can transpose into other openings.</li><li><strong>1. Nf3 (Reti Opening):</strong> Another flexible opening, often leading to hypermodern setups.</li></ul><p class=\"example-text\">Studying openings helps you understand the strategic ideas behind the moves, rather than just memorizing them.</p>"
    },
    {
        "id": "ci2",
        "title": "Tactics: Forks, Pins, Skewers",
        "description": "Learn common tactical motifs to win material or gain an advantage.",
        "level": "Intermediate",
        "content": "<p>Tactics are short-term sequences of moves that typically lead to a tangible gain, such as winning material or delivering checkmate. Recognizing tactical patterns is crucial for improving your game.</p><h3>Fork:</h3><ul><li>A single piece attacks two or more of the opponent's pieces simultaneously. The most common piece for a fork is the Knight, but Queens, Rooks, and Pawns can also deliver forks.</li></ul><p class=\"example-text\">A Knight on c7 attacking both the King on e8 and a Rook on a8 is a fork.</p><h3>Pin:</h3><ul><li>An attacking piece (usually a Rook, Bishop, or Queen) attacks a piece that cannot move without exposing a more valuable piece behind it.</li><li><strong>Absolute Pin:</strong> The pinned piece cannot move at all because moving it would expose the King to check.</li><li><strong>Relative Pin:</strong> The pinned piece can move, but doing so would expose a more valuable piece (e.g., Queen, Rook) behind it.</li></ul><h3>Skewer:</h3><ul><li>Similar to a pin, but the more valuable piece is in front of the less valuable piece. The attacking piece attacks both, forcing the more valuable piece to move and allowing the attacker to capture the less valuable piece behind it.</li></ul><p class=\"example-text\">A Rook on a1 attacking a King on a8 and a Queen on a5 is a skewer. The King must move, allowing the Rook to capture the Queen.</p>"
    },
    {
        "id": "ci3",
        "title": "Positional Play: Pawn Structure and Weak Squares",
        "description": "Understand how pawn structures influence the game and identify weak squares.",
        "level": "Intermediate",
        "content": "<p>Positional play focuses on long-term advantages and the overall structure of the game, rather than immediate tactical gains. Pawn structure is a key element of positional play.</p><h3>Pawn Structure:</h3><ul><li><strong>Isolated Pawn:</strong> A pawn with no friendly pawns on adjacent files. Can be a weakness as it cannot be defended by other pawns.</li><li><strong>Doubled Pawns:</strong> Two or more pawns of the same color on the same file. They are less mobile and can be a weakness.</li><li><strong>Backward Pawn:</strong> A pawn that is behind the pawns on adjacent files and cannot be advanced without being captured.</li><li><strong>Passed Pawn:</strong> A pawn with no opposing pawns on its file or adjacent files. It has a clear path to promotion and can be very dangerous in the endgame.</li></ul><h3>Weak Squares:</h3><ul><li>A square that cannot be easily defended by pawns and can be occupied by an opponent's piece, often a Knight, to create a strong outpost.</li><li>Often occur in front of backward pawns or in open files/diagonals.</li></ul><p class=\"example-text\">Understanding pawn structures helps you plan your moves to create weaknesses for your opponent and avoid creating them for yourself.</p>"
    },
    {
        "id": "ci4",
        "title": "Middlegame Planning",
        "description": "Develop strategies for the middle phase of the game.",
        "level": "Intermediate",
        "content": "<p>The middlegame is the phase after the opening, where most pieces are developed and the strategic battle intensifies. Planning is crucial in this phase.</p><h3>Key Middlegame Concepts:</h3><ul><li><strong>Piece Activity:</strong> Place your pieces on active squares where they control many squares, attack opponent's pieces, or defend your own.</li><li><strong>King Safety:</strong> Continue to ensure your King is safe from attacks.</li><li><strong>Pawn Breaks:</strong> Create pawn advances that open lines for your rooks or bishops, or create weaknesses in your opponent's pawn structure.</li><li><strong>Weaknesses:</strong> Identify and exploit weaknesses in your opponent's position (e.g., weak pawns, weak squares, undefended pieces).</li><li><strong>Attack and Defense:</strong> Balance your attacking plans with solid defense.</li><li><strong>Exchanges:</strong> Decide which pieces to exchange. Exchanging pieces can simplify the position, relieve pressure, or lead to a favorable endgame.</li></ul><p class=\"example-text\">A good middlegame plan often involves identifying a target (a weak pawn, a weak square, the enemy king) and coordinating your pieces to attack it.</p>"
    },
    {
        "id": "ci5",
        "title": "Basic Endgames: King and Rook vs. King",
        "description": "Learn how to force checkmate with a King and Rook against a lone King.",
        "level": "Intermediate",
        "content": "<p>Endgames are the final phase of a chess game, typically when few pieces remain on the board. King and Rook vs. King is a fundamental checkmate pattern.</p><h3>Objective:</h3><p>To force the opponent's lone King to the edge of the board and then deliver checkmate using your King and Rook.</p><h3>Key Principles:</h3><ol><li><strong>Cut Off the King:</strong> Use your Rook to restrict the opponent's King to a smaller and smaller area of the board (a 'box'). The Rook should ideally be on a file or rank that is one square away from the King.</li><li><strong>King Support:</strong> Bring your King to support the Rook and help push the opponent's King to the edge. Your King should try to achieve 'opposition' against the opponent's King.</li><li><strong>Opposition:</strong> When the two Kings are directly facing each other with an odd number of squares between them. This forces the opponent's King to move away, allowing your King to gain ground.</li><li><strong>Deliver Checkmate:</strong> Once the opponent's King is on the edge, use a check from the Rook to deliver checkmate, with your King supporting the Rook.</li></ol><p class=\"example-text\">Practice this endgame repeatedly. It teaches fundamental concepts of King activity, piece coordination, and forcing moves.</p>"
    },
    {
        "id": "ci6",
        "title": "Analyzing Your Games",
        "description": "Learn how to review your chess games to identify mistakes and improve.",
        "level": "Intermediate",
        "content": "<p>Analyzing your own games is one of the most effective ways to improve at chess. It helps you understand your strengths, weaknesses, and recurring mistakes.</p><h3>Steps for Game Analysis:</h3><ol><li><strong>Play Through Without Engine:</strong> First, play through your game without any computer assistance. Try to recall your thoughts during the game and identify critical moments.</li><li><strong>Identify Key Moments:</strong> Look for turns where you felt unsure, where the position changed significantly, or where you made a blunder.</li><li><strong>Find Your Mistakes:</strong> Be honest with yourself. Where did you miss a tactic? Where did you misjudge a position? What was your opponent's best move?</li><li><strong>Use a Chess Engine (Optional, but Recommended):</strong> After your own analysis, use a chess engine (like Stockfish, available online) to review your game. The engine will point out blunders, inaccuracies, and missed opportunities.</li><li><strong>Understand the Engine's Suggestions:</strong> Don't just blindly accept the engine's moves. Try to understand *why* the engine suggests a particular move. What tactical or strategic idea is behind it?</li><li><strong>Look for Patterns:</strong> Do you consistently make the same type of mistake (e.g., hanging pieces, missing forks, poor endgame technique)? Identifying patterns helps you focus your training.</li><li><strong>Take Notes:</strong> Keep a chess journal or notes on your analyzed games. This helps reinforce learning and track progress.</li></ol>"
    },
    {
        "id": "ci7",
        "title": "Basic Mates: King and Queen vs. King",
        "description": "Learn how to force checkmate with a King and Queen against a lone King.",
        "level": "Intermediate",
        "content": "<p>The King and Queen vs. King endgame is a fundamental checkmate pattern that every chess player should know. It's simpler than King and Rook vs. King because the Queen is much more powerful.</p><h3>Objective:</h3><p>To force the opponent's lone King to the edge of the board and then deliver checkmate using your King and Queen.</p><h3>Key Principles:</h3><ol><li><strong>The Queen's Box:</strong> The Queen can create a 'box' around the enemy King, restricting its movement. By moving the Queen closer, you shrink this box.</li><li><strong>King Support:</strong> Your King's role is to help the Queen by taking away squares from the enemy King, especially when it's on the edge of the board.</li><li><strong>Avoiding Stalemate:</strong> Be careful not to stalemate the opponent's King. A stalemate occurs if the King is not in check but has no legal moves. This results in a draw. Ensure the King always has at least one legal square to move to until checkmate is delivered.</li><li><strong>Forcing to the Edge:</strong> Use the Queen to push the enemy King towards any of the four edges of the board. Once it's on an edge, it's much easier to checkmate.</li><li><strong>Deliver Checkmate:</strong> Once the enemy King is on the edge, bring your King closer to support the Queen in delivering the final checkmate.</li></ol><p class=\"example-text\">Practice this checkmate pattern until you can execute it quickly and without stalemating the opponent's King.</p>"
    },
    {
        "id": "ci8",
        "title": "Understanding Material Advantage",
        "description": "Learn the relative values of chess pieces and how material advantage influences the game.",
        "level": "Intermediate",
        "content": "<p>In chess, 'material' refers to the pieces on the board. Understanding the relative value of each piece helps you make strategic decisions about exchanges and sacrifices.</p><h3>Approximate Piece Values (in Pawns):</h3><ul><li><strong>Pawn:</strong> 1 point</li><li><strong>Knight:</strong> 3 points</li><li><strong>Bishop:</strong> 3 points</li><li><strong>Rook:</strong> 5 points</li><li><strong>Queen:</strong> 9 points</li><li><strong>King:</strong> Infinite (as its loss means game over)</li></ul><p>These values are a guideline, not absolute. The actual value of a piece can change based on its activity, position, and the overall board state.</p><h3>Material Advantage:</h3><ul><li>Having more material than your opponent (e.g., a Rook for a Knight) is generally a significant advantage, especially in the endgame.</li><li>Players with a material advantage often try to simplify the position by exchanging pieces, as this makes their advantage more pronounced.</li><li>Sometimes, it's worth sacrificing material for a strong attack, a positional advantage, or to avoid checkmate. This is called a 'material sacrifice' or 'gambit'.</li></ul><p class=\"example-text\">Always consider the material balance when evaluating a position or planning an exchange. A small material advantage can often be converted into a win with good technique.</p>"
    },
    {
        "id": "ce1",
        "title": "Advanced Tactical Patterns",
        "description": "Explore more complex tactical motifs like discovered attacks, batteries, and deflection.",
        "level": "Expert",
        "content": "<p>Beyond basic tactics, advanced patterns involve multiple pieces and often require deeper calculation. Recognizing these patterns can lead to decisive advantages.</p><h3>Discovered Attack:</h3><ul><li>A move by one piece uncovers an attack by another piece. The piece that moves is usually not the one delivering the main attack.</li><li><strong>Discovered Check:</strong> A special type of discovered attack where the uncovered piece puts the opponent's King in check.</li></ul><p class=\"example-text\">Moving a Knight to open a line for a Rook to attack the opponent's Queen is a discovered attack.</p><h3>Battery:</h3><ul><li>Two or more pieces of the same color lined up on a rank, file, or diagonal, so that if the front piece moves, the piece behind it attacks. Common batteries include Queen + Rook, Queen + Bishop, or two Rooks.</li></ul><h3>Deflection:</h3><ul><li>Forcing an opponent's piece to move away from a critical square or defense, allowing you to achieve another goal (e.g., checkmate, material gain).</li></ul><h3>Decoy:</h3><ul><li>Luring an opponent's piece to a specific square, often to expose it to an attack or to set up a tactical combination.</li></ul><h3>Zwischenzug (Intermediate Move):</h3><ul><li>An unexpected move inserted into a sequence of forced moves, often to create a new threat or gain an advantage before responding to the opponent's immediate threat.</li></ul>"
    },
    {
        "id": "ce2",
        "title": "Strategic Concepts: Space, Initiative, Weaknesses",
        "description": "Deepen your understanding of long-term strategic elements in chess.",
        "level": "Expert",
        "content": "<p>Strategy in chess deals with long-term goals and planning, often involving the accumulation of small advantages that lead to a winning position.</p><h3>Space:</h3><ul><li>Refers to the number of squares your pieces control and the freedom of movement they have. More space generally means more active pieces and better development.</li><li>Gaining space can restrict your opponent's pieces and create targets for attack.</li></ul><h3>Initiative:</h3><ul><li>The ability to make threats and force your opponent to respond, rather than reacting to their threats. Having the initiative means you are dictating the flow of the game.</li><li>Gaining the initiative often involves making forcing moves (checks, captures, threats).</li></ul><h3>Weaknesses:</h3><ul><li>Any aspect of a position that can be exploited by the opponent. This includes weak pawns, weak squares, exposed King, undeveloped pieces, or poor coordination.</li><li>Identifying and targeting your opponent's weaknesses, while protecting your own, is a key strategic goal.</li></ul><h3>Piece Coordination:</h3><ul><li>How well your pieces work together. Well-coordinated pieces support each other, create threats, and defend against attacks.</li></ul><p class=\"example-text\">Strategic understanding allows you to play purposefully, even when there are no immediate tactical opportunities.</p>"
    },
    {
        "id": "ce3",
        "title": "Pawn Endgames",
        "description": "Master the intricacies of endgames with only Kings and Pawns.",
        "level": "Expert",
        "content": "<p>Pawn endgames are crucial because pawns can promote to Queens (or other pieces), which can be decisive. These endgames often involve precise calculation.</p><h3>Key Concepts:</h3><ul><li><strong>Opposition:</strong> A fundamental concept where the Kings are on the same rank, file, or diagonal with an odd number of squares between them. Gaining opposition often allows your King to control key squares.</li><li><strong>Key Squares:</strong> Squares that, if occupied by your King, guarantee a win or a draw. These are often squares in front of or around a passed pawn.</li><li><strong>Passed Pawns:</strong> Pawns that have no opposing pawns on their file or adjacent files. They are extremely dangerous in endgames as they can promote.</li><li><strong>King Activity:</strong> The King becomes a powerful attacking and defending piece in the endgame. Activating your King is often a top priority.</li><li><strong>Zugzwang:</strong> A situation where any legal move a player makes will worsen their position. Often occurs in pawn endgames, forcing a player to make a losing move.</li></ul><p class=\"example-text\">Pawn endgames are often about who can create a passed pawn first, or who can stop the opponent's passed pawn while promoting their own.</p>"
    },
    {
        "id": "ce4",
        "title": "Rook Endgames",
        "description": "Learn common techniques and principles for endgames involving Rooks.",
        "level": "Expert",
        "content": "<p>Rook endgames are the most common type of endgame in chess. They are often complex but follow certain fundamental principles.</p><h3>Key Concepts:</h3><ul><li><strong>Rook on the 7th Rank:</strong> A Rook on the 7th rank (the opponent's second rank) is extremely powerful, attacking pawns and restricting the enemy King.</li><li><strong>King Activity:</strong> The King needs to be active and participate in both offense and defense.</li><li><strong>Passed Pawns:</strong> Rooks are excellent at supporting their own passed pawns and stopping opponent's passed pawns.</li><li><strong>Lucena Position:</strong> A famous winning position in Rook and Pawn vs. Rook endgames, where the side with the pawn can force promotion.</li><li><strong>Philidor Position:</strong> A famous drawing position in Rook and Pawn vs. Rook endgames, where the defending Rook can prevent the pawn's promotion.</li><li><strong>Building a Bridge:</strong> A technique to create a path for your King to escort a pawn to promotion, often used in Lucena position.</li><li><strong>Cutting Off the King:</strong> Using the Rook to restrict the enemy King's movement.</li></ul><p class=\"example-text\">Rook endgames often come down to precise calculation and knowing key theoretical positions.</p>"
    },
    {
        "id": "ce5",
        "title": "Sacrifices and Counterplay",
        "description": "Understand when and how to sacrifice material for a greater advantage.",
        "level": "Expert",
        "content": "<p>Sacrifices are moves where a player gives up material (a pawn, a piece, or even the Queen) in exchange for a perceived greater advantage, such as a strong attack, positional gain, or to avoid a worse outcome.</p><h3>Types of Sacrifices:</h3><ul><li><strong>Positional Sacrifice:</strong> Giving up material for a long-term strategic advantage (e.g., open files, strong outposts, better pawn structure).</li><li><strong>Tactical Sacrifice:</strong> Giving up material to force a winning tactical combination (e.g., a checkmate, winning back more material, or a decisive attack).</li><li><strong>Defensive Sacrifice:</strong> Giving up material to escape a dangerous attack or to prevent a checkmate.</li></ul><h3>Counterplay:</h3><ul><li>Creating threats and attacking opportunities for yourself when your opponent is attacking you. This forces your opponent to defend, relieving pressure on your position.</li><li>Good counterplay can turn a defensive situation into an offensive one.</li></ul><p class=\"example-text\">Sacrifices require careful calculation and a deep understanding of the position. They are not random gambles, but calculated risks.</p>"
    },
    {
        "id": "ce6",
        "title": "Psychology in Chess",
        "description": "Explore the mental aspects of chess, including managing emotions and decision-making under pressure.",
        "level": "Expert",
        "content": "<p>Chess is not just about calculating moves; it's also a psychological battle. Understanding the mental aspects can significantly improve your performance.</p><h3>Key Psychological Elements:</h3><ul><li><strong>Managing Emotions:</strong> Staying calm under pressure, avoiding panic after a blunder, and not getting overconfident after a good move.</li><li><strong>Decision-Making Under Pressure:</strong> Making accurate decisions when time is short or the position is complex.</li><li><strong>Bluffing and Deception:</strong> Sometimes, a move might not be objectively the best, but it might trick your opponent into making a mistake.</li><li><strong>Time Management:</strong> Allocating your time effectively during a game, especially in timed games.</li><li><strong>Recognizing Opponent's Intentions:</strong> Trying to understand what your opponent is planning and why they made a particular move.</li><li><strong>Avoiding Tilt:</strong> Not letting frustration or anger affect your play after a mistake.</li><li><strong>Confidence:</strong> Believing in your abilities, but not to the point of arrogance.</li></ul><p class=\"example-text\">Developing mental toughness and emotional control is as important as improving your tactical and strategic skills.</p>"
    },
    {
        "id": "ce7",
        "title": "Chess Engines and Analysis",
        "description": "Learn how chess engines work and how to use them effectively for analysis.",
        "level": "Expert",
        "content": "<p>Chess engines are computer programs that can play chess at a very high level. They are invaluable tools for analyzing games and improving your understanding of chess.</p><h3>How Chess Engines Work:</h3><ul><li><strong>Search Algorithms:</strong> Engines use complex algorithms (like alpha-beta pruning) to search through millions or billions of possible moves and their consequences.</li><li><strong>Evaluation Functions:</strong> They have sophisticated evaluation functions that assign a numerical value to a position, indicating which side is better and by how much.</li><li><strong>Opening Books and Endgame Tablebases:</strong> Engines often use pre-computed opening databases and perfect endgame solutions to enhance their play.</li></ul><h3>Using Engines for Analysis:</h3><ul><li><strong>Post-Game Analysis:</strong> The primary use is to review your games. The engine will identify blunders, inaccuracies, and missed opportunities.</li><li><strong>Understanding Engine Lines:</strong> Don't just look at the engine's top move; try to understand the *why* behind it. What is the tactical or strategic idea?</li><li><strong>Deep Analysis:</strong> Use the engine to explore complex positions, verify your calculations, and find hidden resources.</li><li><strong>Opening Preparation:</strong> Engines can help you prepare openings by showing the strongest lines and potential traps.</li></ul><p class=\"example-text\">Engines are powerful tools, but they should be used to *understand* chess, not just to find the best move. Combine engine analysis with your own human intuition and understanding.</p>"
    },
    {
        "id": "ce8",
        "title": "Famous Chess Games and Players",
        "description": "Explore iconic chess games and learn about legendary players who shaped the game.",
        "level": "Expert",
        "content": "<p>Studying famous chess games and the lives of great players provides inspiration and deepens your appreciation for the game.</p><h3>Legendary Chess Players:</h3><ul><li><strong>Wilhelm Steinitz (1836–1900):</strong> The first undisputed World Chess Champion, known for his pioneering work on positional play.</li><li><strong>José Raúl Capablanca (1888–1942):</strong> Cuban chess prodigy, known for his effortless and clear style, often considered one of the most naturally talented players.</li><li><strong>Alexander Alekhine (1892–1946):</strong> Known for his aggressive, tactical, and complex style.</li><li><strong>Bobby Fischer (1943–2008):</strong> American chess legend, World Champion, known for his intense dedication and brilliant, uncompromising play.</li><li><strong>Garry Kasparov (b. 1963):</strong> Longest-reigning World Champion, known for his dynamic, aggressive style and deep preparation.</li><li><strong>Magnus Carlsen (b. 1990):</strong> Current World Champion, known for his versatile style, exceptional endgame technique, and ability to grind out wins from seemingly equal positions.</li></ul><h3>Famous Games:</h3><ul><li><strong>The Immortal Game (Anderssen vs. Kieseritzky, 1851):</strong> A classic example of romantic-era chess with a stunning sacrifice combination.</li><li><strong>The Evergreen Game (Anderssen vs. Dufresne, 1852):</strong> Another brilliant attacking game by Anderssen.</li><li><strong>Game of the Century (Byrne vs. Fischer, 1956):</strong> Bobby Fischer's masterpiece at age 13, featuring a stunning Queen sacrifice.</li></ul><p class=\"example-text\">Replaying and analyzing these games helps you learn from the masters and appreciate the beauty of chess.</p>"
    }
];

// --- Lesson Data for Sudoku Learning Path ---
const sudokuLessonsData = [
    {
        "id": "s_s1",
        "title": "What is Sudoku? Rules and Objective",
        "description": "Understand the basic rules and the goal of solving a Sudoku puzzle.",
        "level": "Beginner",
        "content": "<p>Sudoku is a logic-based, combinatorial number-placement puzzle. The word 'Sudoku' is a Japanese abbreviation for 'Suuji wa dokushin ni kagiru', which means 'the numbers must be single'.</p><h3>The Rules:</h3><p>The puzzle consists of a 9x9 grid, which is further divided into nine 3x3 subgrids (often called 'blocks', 'boxes', or 'regions'). Some cells are pre-filled with numbers (clues).</p><p>Your objective is to fill the remaining empty cells with digits from 1 to 9, ensuring that:</p><ol><li>Each <strong>row</strong> contains all of the digits from 1 to 9 exactly once.</li><li>Each <strong>column</strong> contains all of the digits from 1 to 9 exactly once.</li><li>Each of the nine <strong>3x3 blocks</strong> contains all of the digits from 1 to 9 exactly once.</li></ol><p>There is only one unique solution to a well-posed Sudoku puzzle.</p>"
    },
    {
        "id": "s_s2",
        "title": "Basic Terminology: Cell, Row, Column, Block",
        "description": "Familiarize yourself with the essential terms used in Sudoku.",
        "level": "Beginner",
        "content": "<p>To discuss Sudoku strategies effectively, it's helpful to know the common terminology:</p><ul><li><strong>Cell:</strong> A single square in the 9x9 grid. There are 81 cells in total.</li><li><strong>Row:</strong> A horizontal line of 9 cells. There are 9 rows, usually labeled 1-9 or A-I.</li><li><strong>Column:</strong> A vertical line of 9 cells. There are 9 columns, usually labeled 1-9 or A-I.</li><li><strong>Block (or Box/Region):</strong> A 3x3 subgrid within the main 9x9 grid. There are 9 blocks in total.</li><li><strong>Candidate:</strong> A possible number that could go into an empty cell.</li><li><strong>Clue (or Given):</strong> A number that is pre-filled in a cell at the start of the puzzle. These numbers cannot be changed.</li></ul><p class=\"example-text\">When solving, you'll often refer to 'the cell in row 3, column 5' or 'the top-left block'.</p>"
    },
    {
        "id": "s_s3",
        "title": "Single-Candidate Strategy (Hidden Singles, Naked Singles)",
        "description": "Learn the most fundamental and common Sudoku solving techniques.",
        "level": "Beginner",
        "content": "<p>Single-candidate strategies are the backbone of Sudoku solving. They involve finding cells where only one number can possibly go.</p><h3>Naked Single:</h3><ul><li>This is the easiest to spot. A cell is a Naked Single if, after eliminating all other possible numbers based on its row, column, and block, only one candidate remains for that cell.</li></ul><p class=\"example-text\">If a cell's row, column, and block already contain numbers 1, 2, 3, 4, 5, 6, 7, 8, then the only remaining number for that cell must be 9.</p><h3>Hidden Single:</h3><ul><li>A number is a Hidden Single in a row, column, or block if it is the only cell in that row, column, or block where a particular number can be placed, even if that cell has other candidates.</li></ul><p class=\"example-text\">In a specific row, if the number 7 can only be placed in one particular empty cell (because all other empty cells in that row already see a 7 in their respective columns or blocks), then that cell must be 7, even if it has other candidates.</p>"
    },
    {
        "id": "s_s4",
        "title": "Scanning Techniques (Cross-hatching, Slicing)",
        "description": "Discover effective visual scanning methods to find numbers quickly.",
        "level": "Beginner",
        "content": "<p>Scanning techniques help you quickly identify where numbers can or cannot go, often leading to singles.</p><h3>Cross-hatching (or Single-Block Scan):</h3><ul><li>This involves looking at a specific number (e.g., all the '1's) and using them to eliminate possibilities in other cells.</li><li><strong>How to:</strong> Pick a number (e.g., 1). Look for cells containing '1' in rows and columns that intersect a specific block. The '1's in those rows/columns will eliminate possibilities for '1' in that block, often leaving only one possible cell for '1' within that block.</li></ul><h3>Slicing (or Row/Column Scan):</h3><ul><li>This involves looking at a specific number (e.g., all the '1's) across the entire grid to determine where it must go in a particular row or column.</li><li><strong>How to:</strong> For a given row, look at all the blocks that intersect it. If you see a number (e.g., '5') in two of those blocks, then the '5' in the remaining block (that intersects that row) must be in the empty cells of that row.</li></ul><p class=\"example-text\">These techniques are about systematically eliminating candidates based on existing numbers.</p>"
    },
    {
        "id": "s_s5",
        "title": "Pencil Marks (Candidates)",
        "description": "Learn how to use pencil marks to keep track of possible numbers for each cell.",
        "level": "Beginner",
        "content": "<p>As puzzles become harder, you won't always find immediate singles. <strong>Pencil marks</strong> (or candidates) are small numbers written in the corner of a cell to denote all the possible numbers that *could* go into that cell.</p><h3>Why Use Pencil Marks?</h3><ul><li><strong>Organize Possibilities:</strong> Helps you keep track of all potential numbers for each empty cell.</li><li><strong>Identify Patterns:</strong> Makes it easier to spot more advanced strategies (like pairs, triples, etc.) that rely on the distribution of candidates.</li><li><strong>Avoid Mistakes:</strong> Reduces the chance of guessing or overlooking a possibility.</li></ul><h3>How to Use:</h3><ol><li>For each empty cell, consider its row, column, and block. Write down all numbers from 1-9 that are *not* already present in those regions.</li><li>As you solve more numbers, update your pencil marks by erasing candidates that are no longer possible.</li><li>When a cell has only one pencil mark left, it's a Naked Single.</li></ol><p class=\"example-text\">Pencil marking is essential for intermediate and expert-level Sudoku. It's like having a mini-checklist for every empty square.</p>"
    },
    {
        "id": "s_s6",
        "title": "How to Start a Puzzle",
        "description": "Get tips on the best approach to begin solving any Sudoku puzzle.",
        "level": "Beginner",
        "content": "<p>Starting a Sudoku puzzle efficiently can set you up for success. Here's a recommended approach:</p><ol><li><strong>Scan for Obvious Singles:</strong> Look for any cells that immediately stand out as having only one possible number (Naked Singles) based on the numbers already in their row, column, and block.</li><li><strong>Use Cross-hatching/Slicing:</strong> Systematically go through numbers 1-9. For each number, try to place it in the blocks where it's missing by using the cross-hatching technique (i.e., eliminating possibilities based on existing numbers in intersecting rows and columns).</li><li><strong>Focus on Dense Areas:</strong> Start with rows, columns, or blocks that have the most pre-filled numbers. These areas will have fewer empty cells and more constraints, making it easier to find initial placements.</li><li><strong>Pencil Mark (if needed):</strong> If you get stuck and can't find any more obvious singles, start filling in pencil marks for all empty cells. This will reveal Hidden Singles and set the stage for more advanced techniques.</li><li><strong>Iterate:</strong> Sudoku solving is an iterative process. After placing a new number, re-scan its row, column, and block for new singles that might have appeared.</li></ol><p class=\"example-text\">Don't be afraid to make pencil marks. They are your allies in solving harder puzzles.</p>"
    },
    {
        "id": "s_s7",
        "title": "Common Mistakes to Avoid",
        "description": "Learn about frequent errors Sudoku solvers make and how to prevent them.",
        "level": "Beginner",
        "content": "<p>Even experienced Sudoku players can make mistakes. Being aware of common pitfalls can help you avoid them.</p><ul><li><strong>Guessing:</strong> Never guess a number. Every placement in Sudoku must be logically deduced from the rules and existing numbers. A single wrong guess can ruin the entire puzzle.</li><li><strong>Incorrect Pencil Marks:</strong> Errors in pencil marking (missing a candidate or including an impossible one) will lead to incorrect deductions later. Double-check your candidates, especially when starting out.</li><li><strong>Not Updating Pencil Marks:</strong> Forgetting to erase candidates from cells after placing a new number is a common mistake. This can lead to missed singles or incorrect deductions.</li><li><strong>Tunnel Vision:</strong> Focusing too long on one cell or one region. If you get stuck, shift your focus to a different part of the grid. Sometimes, a fresh perspective helps.</li><li><strong>Misreading the Grid:</strong> Accidentally looking at the wrong row, column, or block when checking for numbers. Take your time and use your finger or a ruler to guide your eyes.</li><li><strong>Rushing:</strong> Sudoku is a game of logic and patience. Rushing can lead to careless mistakes.</li></ul><p class=\"example-text\">When you get stuck, take a break. A fresh mind often spots what a tired one misses.</p>"
    },
    {
        "id": "s_s8",
        "title": "Benefits of Playing Sudoku",
        "description": "Discover the cognitive and mental advantages of regularly solving Sudoku puzzles.",
        "level": "Beginner",
        "content": "<p>Beyond being an enjoyable pastime, regularly solving Sudoku puzzles offers several cognitive benefits:</p><ul><li><strong>Improves Logical Thinking:</strong> Sudoku is purely a game of logic and deduction. It trains your brain to identify patterns and make logical inferences.</li><li><strong>Enhances Concentration:</strong> Solving Sudoku requires sustained focus and attention to detail. This can help improve your overall concentration skills.</li><li><strong>Boosts Memory:</strong> Keeping track of numbers, candidates, and potential eliminations exercises your working memory.</li><li><strong>Reduces Stress:</strong> For many, the meditative nature of solving a Sudoku puzzle can be a relaxing and stress-reducing activity.</li><li><strong>Promotes Problem-Solving Skills:</strong> Sudoku teaches you to break down a complex problem into smaller, manageable steps.</li><li><strong>Sharpens Critical Thinking:</strong> It encourages you to evaluate multiple possibilities and choose the most effective path.</li><li><strong>Maintains Brain Health:</strong> Like any mental exercise, Sudoku can help keep your brain active and potentially reduce the risk of cognitive decline as you age.</li></ul><p class=\"example-text\">Sudoku is a workout for your brain, keeping it sharp and agile!</p>"
    },
    {
        "id": "s_i1",
        "title": "Hidden Pairs and Naked Pairs",
        "description": "Learn to identify pairs of numbers that must go into specific cells within a region.",
        "level": "Intermediate",
        "content": "<p>Once you've exhausted single-candidate strategies, 'pairs' are the next step in solving harder Sudoku puzzles. They involve identifying two numbers that are restricted to two specific cells within a row, column, or block.</p><h3>Naked Pair:</h3><ul><li>Two cells in a row, column, or block contain *only* the same two candidates, and no other candidates. These two numbers can then be eliminated from all other cells in that same row, column, or block.</li></ul><p class=\"example-text\">If cells (R1,C1) and (R1,C2) in a row have pencil marks {2,5} and {2,5} respectively, and no other candidates, then 2 and 5 must go into those two cells. You can then remove 2 and 5 as candidates from R1,C3-C9.</p><h3>Hidden Pair:</h3><ul><li>Two numbers are a Hidden Pair in a row, column, or block if those two numbers appear *only* in two specific cells within that region, even if those cells have other candidates. Once identified, all other candidates in those two cells can be eliminated.</li></ul><p class=\"example-text\">In a specific block, if the numbers 3 and 7 only appear as candidates in cells (R1,C1) and (R2,C1) (and nowhere else in that block), then 3 and 7 must go into those two cells. You can then remove any other candidates from (R1,C1) and (R2,C1).</p>"
    },
    {
        "id": "s_i2",
        "title": "Hidden Triples and Naked Triples",
        "description": "Extend the pair logic to identify three numbers restricted to three cells.",
        "level": "Intermediate",
        "content": "<p>Similar to pairs, 'triples' involve three numbers restricted to three specific cells within a row, column, or block.</p><h3>Naked Triple:</h3><ul><li>Three cells in a row, column, or block contain *only* the same three candidates (or a subset of them). These three numbers can then be eliminated from all other cells in that same row, column, or block.</li></ul><p class=\"example-text\">If cells (R1,C1), (R1,C2), and (R1,C3) in a row have pencil marks {1,2}, {1,3}, and {2,3} respectively, then 1, 2, and 3 must go into those three cells. You can then remove 1, 2, and 3 as candidates from R1,C4-C9.</p><h3>Hidden Triple:</h3><ul><li>Three numbers are a Hidden Triple in a row, column, or block if those three numbers appear *only* in three specific cells within that region, even if those cells have other candidates. Once identified, all other candidates in those three cells can be eliminated.</li></ul><p class=\"example-text\">In a specific block, if the numbers 1, 5, and 9 only appear as candidates in cells (R1,C1), (R2,C1), and (R3,C1), then 1, 5, and 9 must go into those three cells. You can then remove any other candidates from (R1,C1), (R2,C1), and (R3,C1).</p>"
    },
    {
        "id": "s_i3",
        "title": "Pointing Pairs/Triples",
        "description": "Use candidates in a block to eliminate possibilities in intersecting rows/columns.",
        "level": "Intermediate",
        "content": "<p>Pointing Pairs (or Triples) is a strategy that uses candidates within a block to eliminate possibilities in intersecting rows or columns.</p><h3>How it Works:</h3><ul><li>If a candidate number (e.g., '4') appears only in cells that are all within the same row (or column) *inside* a specific block, then that number 'points' to that row (or column).</li><li>This means that the candidate '4' can be eliminated from all other cells in that particular row (or column) that are *outside* of that block.</li></ul><p class=\"example-text\">Imagine a block where the number '4' can only be placed in cells (R1,C1) and (R1,C2). Both of these cells are in Row 1. This means that '4' must be in Row 1 within this block. Therefore, you can eliminate '4' as a candidate from all other cells in Row 1 (R1,C3 through R1,C9) that are outside this block.</p><p>This technique helps to narrow down candidates and often leads to new singles.</p>"
    },
    {
        "id": "s_i4",
        "title": "Claiming Pairs/Triples",
        "description": "Use candidates in a row/column to eliminate possibilities in intersecting blocks.",
        "level": "Intermediate",
        "content": "<p>Claiming Pairs (or Triples) is the inverse of Pointing Pairs/Triples. It uses candidates within a row or column to eliminate possibilities in intersecting blocks.</p><h3>How it Works:</h3><ul><li>If a candidate number (e.g., '7') appears only in cells that are all within the same block *inside* a specific row (or column), then that number 'claims' that block.</li><li>This means that the candidate '7' can be eliminated from all other cells in that particular block that are *outside* of that row (or column).</li></ul><p class=\"example-text\">Imagine a row where the number '7' can only be placed in cells (R1,C1) and (R1,C2). Both of these cells are in the top-left block. This means that '7' must be in the top-left block within this row. Therefore, you can eliminate '7' as a candidate from all other cells in the top-left block that are outside of Row 1.</p><p>This strategy is powerful for reducing candidates and uncovering hidden patterns.</p>"
    },
    {
        "id": "s_i5",
        "title": "X-Wing Strategy",
        "description": "Learn an advanced technique involving four cells in two rows/columns.",
        "level": "Intermediate",
        "content": "<p>The X-Wing is an intermediate-level strategy that relies on finding a specific pattern of candidates for a single number across two rows or two columns.</p><h3>How it Works:</h3><ul><li>Look for a specific candidate number (e.g., '1') that appears in exactly two cells in a specific row.</li><li>Then, find another row where the same candidate '1' also appears in exactly two cells, and these two cells are in the *same two columns* as the first row's candidates.</li><li>This forms a rectangular shape, or an 'X'.</li><li>Because the '1' must occupy one of the two cells in each of those rows, and they share the same columns, you can eliminate that candidate '1' from all other cells in those two columns (outside of the X-Wing rows).</li></ul><p class=\"example-text\">If candidate '1' is only in (R1,C2) and (R1,C7), AND candidate '1' is only in (R5,C2) and (R5,C7), then '1' can be eliminated from all other cells in Column 2 (R2,C2 to R4,C2, R6,C2 to R9,C2) and Column 7 (R2,C7 to R4,C7, R6,C7 to R9,C7).</p><p>This strategy is a powerful way to eliminate candidates and progress in harder puzzles.</p>"
    },
    {
        "id": "s_i6",
        "title": "Swordfish Strategy",
        "description": "An extension of X-Wing involving three rows/columns and three candidates.",
        "level": "Intermediate",
        "content": "<p>The Swordfish is an advanced technique, an extension of the X-Wing, involving three rows (or columns) and three candidates for a single number.</p><h3>How it Works:</h3><ul><li>Look for a specific candidate number (e.g., '2') that appears in exactly two or three cells in three different rows.</li><li>Crucially, these candidate cells must all be located within the *same three columns*.</li><li>This forms a pattern where the candidate '2' must occupy these specific cells in the three rows. As a result, you can eliminate the candidate '2' from all other cells in those three columns (outside of the Swordfish rows).</li></ul><p class=\"example-text\">If candidate '2' is in R1 (C2, C5, C8), R4 (C2, C5), and R7 (C2, C8), then '2' must be in those cells. You can then eliminate '2' from all other cells in columns C2, C5, and C8.</p><p>Swordfish can be challenging to spot but are very effective in expert-level puzzles.</p>"
    },
    {
        "id": "s_i7",
        "title": "Jellyfish Strategy",
        "description": "The largest of the 'fish' patterns, involving four rows/columns.",
        "level": "Intermediate",
        "content": "<p>The Jellyfish is the largest of the 'fish' patterns (X-Wing, Swordfish, Jellyfish). It's an advanced technique involving four rows (or columns) and four candidates for a single number.</p><h3>How it Works:</h3><ul><li>Look for a specific candidate number (e.g., '3') that appears in exactly two, three, or four cells in four different rows.</li><li>These candidate cells must all be located within the *same four columns*.</li><li>Similar to X-Wing and Swordfish, this pattern allows you to eliminate the candidate '3' from all other cells in those four columns (outside of the Jellyfish rows).</li></ul><p class=\"example-text\">If candidate '3' is in R1 (C2, C5, C7, C9), R3 (C2, C5), R6 (C7, C9), and R8 (C2, C7), then '3' must be in those cells. You can then eliminate '3' from all other cells in columns C2, C5, C7, and C9.</p><p>Jellyfish are rarely needed in typical puzzles but are a powerful tool for the most challenging ones.</p>"
    },
    {
        "id": "s_i8",
        "title": "Advanced Pencil Mark Techniques",
        "description": "Refine your pencil marking skills for complex puzzles.",
        "level": "Intermediate",
        "content": "<p>Efficient pencil marking is crucial for advanced Sudoku. Beyond simply listing all candidates, these techniques help you organize and use them more effectively.</p><h3>Candidate Grids:</h3><ul><li>Instead of writing small numbers in each cell, some solvers create separate 'candidate grids' where each grid represents a single number (1-9), and they mark possible locations for that number.</li></ul><h3>Coloring/Highlighting:</h3><ul><li>Using different colors or highlighting to mark specific candidate patterns (e.g., all candidates for an X-Wing in one color). This makes patterns easier to spot visually.</li></ul><h3>Sub-setting Candidates:</h3><ul><li>When you identify a pair or triple, you can circle or specially mark those candidates in the cells to remind yourself that those numbers are restricted to those cells.</li></ul><h3>What-If Scenarios:</h3><ul><li>For very difficult puzzles, you might temporarily assume a number goes into a cell and then follow the logical consequences. If it leads to a contradiction, your assumption was wrong. This is a form of 'trial and error' but based on logical deductions, not guessing.</li></ul><p class=\"example-text\">The goal of advanced pencil marking is to make the logical connections in the puzzle more apparent.</p>"
    },
    {
        "id": "s_e1",
        "title": "XY-Wing Strategy",
        "description": "Learn a powerful chaining technique involving three cells and three candidates.",
        "level": "Expert",
        "content": "<p>The XY-Wing is a powerful and frequently used advanced Sudoku strategy. It involves three cells (a 'pivot' and two 'pincers') and three candidates.</p><h3>How it Works:</h3><ul><li>Find three cells, let's call them A, B, and C.</li><li>Each of these three cells must have exactly two candidates.</li><li>The candidates must form a specific pattern:<ul><li>Cell A (the pivot) has candidates (X, Y).</li><li>Cell B (a pincer) has candidates (X, Z) and 'sees' (shares a row, column, or block with) cell A.</li><li>Cell C (the other pincer) has candidates (Y, Z) and 'sees' cell A.</li><li>Cells B and C must *not* see each other.</li></ul></li><li>If such a pattern exists, then any cell that 'sees' *both* pincer cells (B and C) and has candidate Z can have Z eliminated. This is because if A is X, then B must be Z. If A is Y, then C must be Z. In either case, Z must be in either B or C, so any cell that sees both cannot be Z.</li></ul><p class=\"example-text\">The XY-Wing is a form of 'coloring' or 'chaining' logic, allowing for significant candidate eliminations.</p>"
    },
    {
        "id": "s_e2",
        "title": "XYZ-Wing Strategy",
        "description": "An extension of XY-Wing with a more complex candidate pattern.",
        "level": "Expert",
        "content": "<p>The XYZ-Wing is an extension of the XY-Wing, involving three cells that all 'see' each other, and a slightly different candidate pattern.</p><h3>How it Works:</h3><ul><li>Find three cells, let's call them A, B, and C, that all share a common region (e.g., all in the same block, or two in a row and one in their shared block, etc.).</li><li>The candidates must form this pattern:<ul><li>Cell A (the pivot) has candidates (X, Y, Z).</li><li>Cell B has candidates (X, Y) and 'sees' cell A.</li><li>Cell C has candidates (Y, Z) and 'sees' cell A.</li></ul></li><li>If such a pattern exists, then any cell that 'sees' *all three* cells (A, B, and C) and has candidate Y can have Y eliminated. This is because if A is X, then B must be Y. If A is Z, then C must be Y. If A is Y, then Y is in A. In all cases, Y must be in A, B, or C. Therefore, any cell that sees all three cannot be Y.</li></ul><p class=\"example-text\">XYZ-Wings are harder to spot than XY-Wings but can be very effective in expert puzzles.</p>"
    },
    {
        "id": "s_e3",
        "title": "W-Wing Strategy",
        "description": "Another chaining technique involving two cells with specific candidate patterns.",
        "level": "Expert",
        "content": "<p>The W-Wing is an advanced chaining strategy that involves two cells (a 'conjugate pair') and two candidates. It's often used when an X-Wing or Swordfish isn't present.</p><h3>How it Works:</h3><ul><li>Find two cells, A and B, that each have exactly two candidates (X, Y).</li><li>Cells A and B must *not* see each other (i.e., they are not in the same row, column, or block).</li><li>For candidate X, there must be a 'conjugate pair' relationship in a row or column that connects to cell A. This means X only appears in two cells in that row/column, and one of them is cell A.</li><li>Similarly, for candidate X, there must be a 'conjugate pair' relationship in a row or column that connects to cell B. This means X only appears in two cells in that row/column, and one of them is cell B.</li><li>If this pattern holds, then any cell that 'sees' *both* cells A and B and has candidate Y can have Y eliminated. This is because if X is not in A, then Y must be in A. If X is not in B, then Y must be in B. Therefore, Y must be in either A or B, so any cell that sees both cannot be Y.</li></ul><p class=\"example-text\">W-Wings are complex but powerful for breaking through tough puzzles.</p>"
    },
    {
        "id": "s_e4",
        "title": "Remote Pairs",
        "description": "Identify chains of cells with two candidates to eliminate possibilities.",
        "level": "Expert",
        "content": "<p>Remote Pairs is an advanced chaining technique that involves a series of cells, each with exactly two candidates, forming a 'chain' across the grid.</p><h3>How it Works:</h3><ul><li>Find a chain of cells where each cell has the same two candidates (e.g., {1, 5}).</li><li>Each cell in the chain must 'see' the next cell in the chain (share a row, column, or block).</li><li>The key is that if the first cell in the chain is '1', then the second must be '5', the third '1', and so on. If the first cell is '5', then the second must be '1', the third '5', etc. This means the first and last cells in the chain will always have the same candidate value.</li><li>If the first and last cells in the chain are in a 'strong link' (e.g., they are the only two cells in a row/column/block that can contain that candidate), then you can eliminate that candidate from any cell that 'sees' both the first and last cells of the chain.</li></ul><p class=\"example-text\">Remote Pairs are a form of 'Alternating Inference Chain' and require careful tracking of candidates across multiple cells.</p>"
    },
    {
        "id": "s_e5",
        "title": "Chains and Loops (Alternating Inference Chains - AIC)",
        "description": "Understand the concept of logical chains to deduce number placements.",
        "level": "Expert",
        "content": "<p>Alternating Inference Chains (AIC) are a general and very powerful class of Sudoku strategies. They involve following a logical path of deductions across multiple cells and candidates.</p><h3>How it Works:</h3><ul><li>An AIC is a sequence of cells and candidates linked by 'strong' and 'weak' inferences.</li><li><strong>Strong Link:</strong> If A is true, then B *must* be true (e.g., if a cell is the only place for a candidate in its row, then that's a strong link).</li><li><strong>Weak Link:</strong> If A is true, then B *might* be true (e.g., if a cell has two candidates, if one is true, the other *might* be false, but not necessarily).</li><li>An AIC typically starts with a 'strong link' and alternates between strong and weak links.</li><li>If the start and end of the chain lead to a contradiction, then the initial assumption was false. If the chain shows that a candidate is true in one cell and false in another, it can lead to eliminations.</li></ul><p class=\"example-text\">AIC strategies are complex and often require specialized software or extensive practice to master. They represent the pinnacle of Sudoku logic.</p>"
    },
    {
        "id": "s_e6",
        "title": "Nishio Forcing Chains",
        "description": "A specific type of forcing chain for advanced eliminations.",
        "level": "Expert",
        "content": "<p>Nishio Forcing Chains are a specific type of Alternating Inference Chain, named after the Japanese puzzle designer, that involve testing a single candidate in a cell.</p><h3>How it Works:</h3><ul><li>Choose an empty cell and one of its candidates (let's say, 'X').</li><li>Assume that 'X' is the correct number for that cell.</li><li>Follow all the logical consequences of this assumption. If this assumption leads to a contradiction (e.g., a number appearing twice in a row, or a cell having no possible candidates), then your initial assumption was false, and 'X' can be eliminated from that cell.</li><li>If the assumption does not lead to a contradiction, but it leads to a situation where another candidate 'Y' is eliminated from a cell, and that elimination is valid regardless of whether 'X' was true or false, then 'Y' can be eliminated.</li></ul><p class=\"example-text\">Nishio Forcing Chains are a form of 'proof by contradiction' and are very powerful for solving the most difficult Sudoku puzzles. They require meticulous tracking of deductions.</p>"
    },
    {
        "id": "s_e7",
        "title": "Unique Rectangles",
        "description": "Identify patterns that prevent multiple solutions in a puzzle.",
        "level": "Expert",
        "content": "<p>Unique Rectangles are an advanced Sudoku strategy based on the principle that a well-formed Sudoku puzzle has only one unique solution. If a pattern exists that would allow for two solutions, then one of the candidates must be eliminated to ensure uniqueness.</p><h3>How it Works:</h3><ul><li>Look for four cells that form a rectangle (two rows, two columns).</li><li>All four cells must contain exactly the same two candidates (e.g., {1, 5}).</li><li>If such a rectangle exists, and if three of the four cells also have other candidates, but the fourth cell *only* has those two candidates, then the candidates in the fourth cell can be eliminated from that cell.</li></ul><p class=\"example-text\">The logic is that if the fourth cell also contained other candidates, and the unique rectangle was allowed to exist, it would lead to a puzzle with multiple solutions, which is not allowed in a valid Sudoku.</p><p>Unique Rectangles are a powerful tool for eliminating candidates in very challenging puzzles.</p>"
    },
    {
        "id": "s_e8",
        "title": "Brute Force and Backtracking (Conceptual)",
        "description": "Understand the computational methods used to solve Sudoku puzzles.",
        "level": "Expert",
        "content": "<p>While human Sudoku solving relies on logical deduction, computer programs often use 'brute force' and 'backtracking' algorithms to find solutions.</p><h3>Brute Force:</h3><ul><li>This method involves trying every possible number for every empty cell until a solution is found. It's computationally very expensive and inefficient for humans.</li></ul><h3>Backtracking Algorithm:</h3><ul><li>This is a more efficient computational method for solving Sudoku.</li><li><strong>How it Works:</strong><ol><li>Start at the first empty cell.</li><li>Try placing a number (1-9) in that cell.</li><li>Check if the number is valid according to Sudoku rules (no duplicates in row, column, block).</li><li>If valid, move to the next empty cell and repeat the process.</li><li>If no valid number can be placed in the current cell (or if a contradiction is found), 'backtrack' to the previous cell, change its number, and try again.</li><li>Repeat until all cells are filled (solution found) or all possibilities are exhausted (no solution, or initial puzzle was invalid).</li></ol></li></ul><p class=\"example-text\">While you don't use these methods to solve Sudoku by hand, understanding them provides insight into the computational complexity of the puzzle.</p>"
    }
];

// --- Lesson Data for Snake Learning Path ---
const snakeLessonsData = [
    {
        "id": "sn1",
        "title": "History and Evolution of Snake Game",
        "description": "Explore the origins and development of the classic Snake game.",
        "level": "Beginner",
        "content": "<p>The Snake game is one of the oldest and most enduring video game concepts. Its roots can be traced back to the 1970s, with early arcade games like 'Blockade' (1976) by Gremlin Industries.</p><h3>Early Versions:</h3><ul><li><strong>Blockade (1976):</strong> A two-player arcade game where each player controls a line that grows, trying to trap the opponent.</li><li><strong>Snake (1979):</strong> A single-player version released for the TRS-80 computer, popularizing the concept.</li></ul><h3>Rise to Prominence:</h3><ul><li>The game gained massive popularity in the late 1990s, particularly with its inclusion on Nokia mobile phones (starting with the Nokia 6110 in 1997). This made it one of the most widely played video games of all time.</li><li>Its simple mechanics, addictive gameplay, and low processing requirements made it ideal for early mobile devices.</li></ul><h3>Modern Adaptations:</h3><p>Today, countless variations of Snake exist across various platforms, from web browsers to modern smartphones. Despite its simplicity, the core concept remains engaging and challenging.</p>"
    },
    {
        "id": "sn2",
        "title": "Basic Gameplay Mechanics: Movement, Eating Food, Growing",
        "description": "Understand the fundamental actions and interactions in the Snake game.",
        "level": "Beginner",
        "content": "<p>The core mechanics of the Snake game are straightforward, yet they create a challenging and addictive experience.</p><ul><li><strong>Movement:</strong> You control a 'snake' that continuously moves in one of four cardinal directions (up, down, left, right). You can change its direction, but it cannot immediately reverse course (e.g., if moving right, you can't instantly move left).</li><li><strong>Eating Food:</strong> Scattered on the game board is a 'food' item (often a dot or a fruit). When the snake's head moves over this food, it 'eats' it.</li><li><strong>Growing:</strong> Upon eating food, the snake grows longer by one segment. This is usually implemented by not removing the tail segment after the head moves, effectively adding a new segment.</li><li><strong>Scoring:</strong> Each time the snake eats food, your score increases. The goal is to get the highest score possible.</li></ul><p class=\"example-text\">The longer the snake gets, the more challenging the game becomes, as you have less space to maneuver.</p>"
    },
    {
        "id": "sn3",
        "title": "Objective and Scoring",
        "description": "Learn the primary goal of the game and how points are accumulated.",
        "level": "Beginner",
        "content": "<h3>Objective:</h3><p>The primary objective of the Snake game is to get the highest score possible before the game ends. The game ends when the snake 'crashes'.</p><h3>How the Game Ends (Crashing):</h3><ul><li><strong>Hitting a Wall:</strong> If the snake's head collides with any of the game board's boundaries (walls), the game is over.</li><li><strong>Hitting Its Own Tail:</strong> As the snake grows, its body becomes an obstacle. If the snake's head collides with any part of its own body, the game is over.</li></ul><h3>Scoring:</h3><p>Points are awarded each time the snake successfully eats a food item. Typically, each food item eaten adds a fixed number of points to your score (e.g., 10 points per food item). The game continues as long as you avoid crashing.</p><p class=\"example-text\">The challenge lies in balancing aggressive food collection with careful navigation to avoid self-collision or hitting walls as your snake becomes longer and faster.</p>"
    },
    {
        "id": "sn4",
        "title": "Controls: Arrow Keys and Swipe Gestures",
        "description": "Understand how to control the snake's movement on different devices.",
        "level": "Beginner",
        "content": "<p>Controlling the snake is simple, but precise input is key to high scores.</p><h3>Desktop Controls (Keyboard):</h3><ul><li>Most Snake games use the <strong>Arrow Keys</strong> (Up, Down, Left, Right) to change the snake's direction.</li><li>Pressing an arrow key changes the snake's direction of movement. Remember, you cannot instantly reverse direction (e.g., if moving right, pressing left will not work; you must first go up or down).</li></ul><h3>Mobile/Touch Controls (Swipe Gestures):</h3><ul><li>On touch-enabled devices, you typically control the snake by <strong>swiping</strong> your finger across the screen.</li><li>Swipe Up: Move snake upwards.</li><li>Swipe Down: Move snake downwards.</li><li>Swipe Left: Move snake to the left.</li><li>Swipe Right: Move snake to the right.</li><li>Similar to keyboard controls, you cannot immediately reverse direction with a swipe.</li></ul><p class=\"example-text\">Practice smooth and timely inputs. A slight delay or misdirection can lead to a crash.</p>"
    },
    {
        "id": "sn5",
        "title": "Avoiding Walls",
        "description": "Learn basic strategies to prevent crashing into the game boundaries.",
        "level": "Beginner",
        "content": "<p>One of the most common ways to end a Snake game is by hitting a wall. Avoiding the boundaries is a fundamental survival skill.</p><h3>Tips for Wall Avoidance:</h3><ul><li><strong>Maintain Distance:</strong> Always try to keep a safe distance from the edges of the game board, especially when the snake is moving quickly.</li><li><strong>Plan Your Turns:</strong> Don't make sudden, unplanned turns near walls. Look ahead a few moves to ensure you have enough space to maneuver.</li><li><strong>Use Corners Wisely:</strong> Corners can be tricky. If you're approaching a corner, ensure you have enough space to turn before you hit the wall.</li><li><strong>Slow Down (if possible):</strong> In some versions of Snake, the speed increases as you score. Be extra cautious when the snake is moving fast, as reaction time decreases.</li><li><strong>Focus on the Center:</strong> Especially when the snake is short, try to keep it in the central area of the board, as this gives you maximum maneuverability.</li></ul><p class=\"example-text\">Think of the walls as invisible barriers that grow with your snake's length. The less space you have, the more dangerous they become.</p>"
    },
    {
        "id": "sn6",
        "title": "Basic Strategy: Staying in the Open",
        "description": "Learn the initial approach to maximize space and minimize risks.",
        "level": "Beginner",
        "content": "<p>For beginners, a key strategy is to keep the snake in open areas of the board, maximizing available space and minimizing the risk of collision.</p><h3>Why Stay in the Open?</h3><ul><li><strong>More Maneuverability:</strong> Larger open areas give you more room to turn and react to food spawns, reducing the chance of hitting walls or your own tail.</li><li><strong>Easier Food Access:</strong> Food is often easier to reach when you're not constrained by tight spaces.</li><li><strong>Reduced Stress:</strong> Playing in open areas is less stressful and allows you to focus on getting comfortable with the controls and basic mechanics.</li></ul><h3>How to Implement:</h3><ul><li><strong>Avoid Edges:</strong> Don't hug the walls unless necessary to get food.</li><li><strong>Don't Trap Yourself:</strong> Be mindful of how your growing tail is creating new 'walls'. Don't create enclosed spaces that you can't escape from.</li><li><strong>Prioritize Safety:</strong> In the early stages, prioritize not crashing over getting every piece of food.</li></ul><p class=\"example-text\">Think of the snake as a car. You want to drive on the open highway, not in a crowded parking lot, especially when you're just learning!</p>"
    },
    {
        "id": "sn7",
        "title": "Understanding Game Speed",
        "description": "Learn how game speed affects gameplay and strategies.",
        "level": "Beginner",
        "content": "<p>In many versions of the Snake game, the speed of the snake increases as you collect more food and your score rises. Understanding this dynamic is crucial for adapting your strategy.</p><h3>Impact of Speed:</h3><ul><li><strong>Reduced Reaction Time:</strong> As the snake moves faster, you have less time to react to sudden changes, such as new food spawns or unexpected tail positions.</li><li><strong>Increased Risk of Collision:</strong> Faster movement means you cover more ground quickly, increasing the likelihood of hitting walls or your own tail if you're not precise with your controls.</li><li><strong>Higher Stakes:</strong> Every move becomes more critical at higher speeds. A small miscalculation can lead to an instant game over.</li></ul><h3>Adapting to Speed:</h3><ul><li><strong>Anticipation:</strong> Try to anticipate where food will appear and plan your path accordingly, rather than reacting only when it appears.</li><li><strong>Smooth Movements:</strong> Aim for smooth, deliberate turns rather than jerky, last-second changes in direction.</li><li><strong>Focus:</strong> Maintain high levels of concentration, especially as the game progresses.</li></ul><p class=\"example-text\">Speed is the ultimate test in Snake. It forces you to be more precise, more anticipatory, and more focused.</p>"
    },
    {
        "id": "sn8",
        "title": "Restarting the Game",
        "description": "Learn how to reset the game and start a new attempt after a game over.",
        "level": "Beginner",
        "content": "<p>After the snake crashes and the 'Game Over' screen appears, you'll typically have an option to restart the game. This brings the game back to its initial state, allowing you to try for a new high score.</p><h3>What Happens on Restart:</h3><ul><li><strong>Snake Resets:</strong> The snake returns to its initial short length and starting position.</li><li><strong>Score Resets:</strong> Your score is reset to zero.</li><li><strong>Food Respawns:</strong> New food is generated at a random location.</li><li><strong>Speed Resets:</strong> The game speed usually resets to its initial, slower pace.</li></ul><h3>Why Restart?</h3><ul><li><strong>Practice:</strong> Each game is an opportunity to practice your skills and learn from previous mistakes.</li><li><strong>New Challenge:</strong> Every new game presents a fresh puzzle of food placement and tail management.</li><li><strong>Aim for High Score:</strong> The primary motivation for many players is to beat their previous high score or compete with friends.</li></ul><p class=\"example-text\">Don't be discouraged by a 'Game Over'. Every crash is a lesson learned. Just hit restart and try again!</p>"
    },
    {
        "id": "sn_i1",
        "title": "Advanced Movement Techniques: Cornering and Tight Spaces",
        "description": "Master precise movements to navigate confined areas without crashing.",
        "level": "Intermediate",
        "content": "<p>As your snake grows longer, the game board becomes increasingly crowded, forcing you to navigate tight spaces and sharp corners. Mastering these movements is crucial for high scores.</p><h3>Cornering Techniques:</h3><ul><li><strong>The 'U' Turn:</strong> When approaching a wall or your own tail, plan your turns to create a smooth 'U' shape. This involves turning early enough to avoid collision, then turning again to parallel the obstacle.</li><li><strong>One-Square Clearance:</strong> Always aim to leave at least one square of clearance between your snake's head and any obstacle (wall or tail) when turning. This gives you a crucial buffer.</li></ul><h3>Navigating Tight Spaces:</h3><ul><li><strong>Look Ahead:</strong> Before entering a narrow passage, quickly scan the path ahead to ensure there's an exit or enough room to turn. Don't enter a dead end.</li><li><strong>Slow and Steady (if possible):</strong> If the game speed allows, make slower, more deliberate turns in tight spots.</li><li><strong>The 'Tunnel' Strategy:</strong> Sometimes, you'll create a long 'tunnel' with your body. Be extremely careful when moving through these, as a single misstep means game over.</li></ul><p class=\"example-text\">Precision is paramount in tight spaces. A single wrong move can be fatal.</p>"
    },
    {
        "id": "sn_i2",
        "title": "Strategic Food Collection",
        "description": "Learn to choose food strategically to optimize growth and avoid traps.",
        "level": "Intermediate",
        "content": "<p>It's not just about eating every piece of food; it's about eating the *right* food at the *right* time and in the *right* way.</p><h3>Prioritize Safe Food:</h3><ul><li>Always go for food that is in an open area or that allows you to move into an open area after eating it.</li><li>Avoid food that is located in a tight corner or near your tail if it means you'll trap yourself.</li></ul><h3>The 'Edge' Strategy:</h3><ul><li>Many advanced players try to keep their snake along the edges of the board, creating a large open space in the middle. This allows them to collect food more safely as it appears in the open.</li><li>When food appears in the middle, they can quickly go in, eat it, and return to the edge.</li></ul><h3>Don't Chase Recklessly:</h3><ul><li>If food appears in a dangerous spot, it's often better to let it go and wait for a safer spawn. A few lost points are better than a game over.</li><li>Consider the path you'll take *after* eating the food. Will you be trapped? Will you be able to turn?</li></ul><p class=\"example-text\">Think of food as bait. Sometimes, it's a trap. Always evaluate the risk before you commit to a path.</p>"
    },
    {
        "id": "sn_i3",
        "title": "Creating 'Walls' with Your Body",
        "description": "Understand how your growing tail forms new obstacles and how to manage them.",
        "level": "Intermediate",
        "content": "<p>As the snake grows, its own body becomes the primary obstacle. Effectively managing your tail and understanding how it creates 'walls' is crucial.</p><h3>The Moving Wall:</h3><ul><li>Your tail is constantly moving and changing position. What was an open path a moment ago might become blocked by your tail.</li><li>This dynamic nature is what makes Snake challenging.</li></ul><h3>Avoiding Self-Collision:</h3><ul><li><strong>Look Behind:</strong> Always be aware of where your tail is and where it's going. Don't turn into a segment of your own body.</li><li><strong>Create Paths:</strong> Instead of randomly moving, try to create clear paths for your snake to follow. This often involves moving in a 'sweeping' motion to clear out sections of the board.</li><li><strong>The 'S' Curve:</strong> When moving through open areas, sometimes creating a gentle 'S' curve can help manage your tail and keep space open.</li></ul><h3>Utilizing Your Tail:</h3><ul><li>Paradoxically, sometimes you can use your tail to your advantage by creating a 'funnel' to guide food towards you, or to block off areas for the AI food generator.</li></ul><p class=\"example-text\">Your tail is both your biggest challenge and, with careful management, a tool for strategic play.</p>"
    },
    {
        "id": "sn_i4",
        "title": "Avoiding Your Own Tail",
        "description": "Specific techniques to prevent crashing into your growing body.",
        "level": "Intermediate",
        "content": "<p>Crashing into your own tail is the most common cause of game over in Snake. Here are specific techniques to avoid it:</p><ul><li><strong>The 'Four-Square Rule':</strong> When making a turn, ensure there are at least four squares of open space in the direction you're turning before your tail catches up. This gives you room to maneuver.</li><li><strong>Perimeter Play:</strong> Many advanced players try to keep the snake moving along the perimeter of the board, spiraling inwards as it grows. This keeps the majority of the board open and reduces the chance of self-collision.</li><li><strong>Don't Trap Your Head:</strong> Be very careful not to move your head into a position where it's completely surrounded by your own tail with no escape route.</li><li><strong>Anticipate Tail Movement:</strong> Remember that your tail follows your head. If you make a sharp turn, the tail will eventually follow that path. Plan your subsequent turns considering where your tail *will be*, not just where it is now.</li><li><strong>Avoid 'Snake Piles':</strong> Don't let your snake's body bunch up in a small area. This drastically reduces maneuverability and increases crash risk.</li></ul><p class=\"example-text\">The longer the snake, the more disciplined your movement needs to be. Every segment matters.</p>"
    },
    {
        "id": "sn_i5",
        "title": "Planning Ahead for Food Spawns",
        "description": "Develop the ability to anticipate where food might appear and position yourself advantageously.",
        "level": "Intermediate",
        "content": "<p>While food spawns are usually random, experienced players often develop an intuition for where food *might* appear and position their snake to react quickly and safely.</p><h3>Understanding Randomness:</h3><ul><li>Food will typically not spawn directly on the snake's body. This means open areas are more likely to have food.</li><li>Some games might favor spawning food closer to the snake or in certain quadrants. Observe the game's patterns.</li></ul><h3>Strategic Positioning:</h3><ul><li><strong>Central Control:</strong> Keeping your snake in a relatively central, open area allows you to reach newly spawned food quickly, regardless of where it appears.</li><li><strong>Edge Play:</strong> If you're using an 'edge' strategy, you'll be well-positioned for food that spawns along the perimeter. For food in the middle, you'll need to quickly enter and exit.</li><li><strong>Creating 'Food Traps':</strong> Sometimes, by strategically moving your snake, you can create a small, enclosed area where food is likely to spawn, making it easy to collect.</li></ul><h3>Prioritize Safety over Speed:</h3><ul><li>Even if food appears far away, don't take reckless risks to get to it immediately. Plan a safe route.</li></ul><p class=\"example-text\">The best Snake players don't just react; they anticipate and position themselves for future opportunities.</p>"
    },
    {
        "id": "sn_i6",
        "title": "Maximizing Score Efficiency",
        "description": "Learn techniques to get the highest score possible in each game.",
        "level": "Intermediate",
        "content": "<p>Maximizing your score involves more than just eating food; it's about playing efficiently and surviving longer.</p><h3>Key Score Optimization Tips:</h3><ul><li><strong>Longer Survival:</strong> The longer you survive, the more food you can eat, and thus the higher your score will be. Prioritize survival over risky food grabs.</li><li><strong>Consistent Food Collection:</strong> Aim for a steady rate of food collection. Don't let too much time pass between eating, as this means lost potential points.</li><li><strong>Minimize Unnecessary Movement:</strong> Every square you move without eating food is 'wasted' movement. While sometimes necessary for positioning, try to make your path to food as direct as safely possible.</li><li><strong>Adapt to Speed Increases:</strong> As the game speeds up, your points per second generally increase. The challenge is to maintain control at these higher speeds.</li><li><strong>Learn the Game's Physics:</strong> Understand how the snake turns, how fast it moves, and how food spawns. This knowledge allows for more precise and efficient play.</li><li><strong>Focus on Clean Play:</strong> Avoid getting into situations where you have to make desperate, last-second turns. Clean, controlled play reduces errors and extends game time.</li></ul><p class=\"example-text\">High scores in Snake are a testament to patience, precision, and strategic thinking.</p>"
    },
    {
        "id": "sn_i7",
        "title": "Dealing with Different Game Speeds",
        "description": "Adjust your playstyle as the snake's speed increases.",
        "level": "Intermediate",
        "content": "<p>Many Snake games increase in speed as you progress, adding a significant challenge. Adapting your playstyle to these speed changes is vital.</p><h3>Adjusting Your Play:</h3><ul><li><strong>Early Turns:</strong> At higher speeds, you need to initiate your turns earlier. If you wait until the last moment, you'll likely hit a wall or your tail.</li><li><strong>Smaller Movements:</strong> When the snake is very fast, focus on making smaller, more controlled movements. Avoid large, sweeping turns that can quickly lead to a collision.</li><li><strong>Increased Focus:</strong> Higher speeds demand absolute concentration. Minimize distractions and keep your eyes glued to the screen.</li><li><strong>Anticipate More:</strong> You have less time to react, so predicting where food will appear and planning your path even further in advance becomes critical.</li><li><strong>Controlled Panic:</strong> It's natural to feel a rush of adrenaline at high speeds. Try to maintain a calm and steady hand, focusing on the next immediate safe move.</li></ul><p class=\"example-text\">Think of it like driving a car: you drive differently on a quiet street than on a busy highway. Adjust your 'driving' speed and style accordingly.</p>"
    },
    {
        "id": "sn_i8",
        "title": "Playing on Smaller/Larger Boards",
        "description": "Understand how different board sizes impact gameplay and strategy.",
        "level": "Intermediate",
        "content": "<p>While most Snake games use a standard board size, some variations offer different dimensions. The size of the playing area significantly impacts strategy.</p><h3>Smaller Boards:</h3><ul><li><strong>Less Room to Maneuver:</strong> Every segment of the snake takes up a larger percentage of the available space.</li><li><strong>Faster Congestion:</strong> The board fills up much quicker, leading to tighter situations earlier in the game.</li><li><strong>Emphasis on Precision:</strong> Mistakes are punished more severely due to limited space.</li><li><strong>Strategy:</strong> Focus on very precise movements, efficient food collection, and avoiding self-traps. Perimeter play might be less effective if the snake grows too long too quickly.</li></ul><h3>Larger Boards:</h3><ul><li><strong>More Room to Maneuver:</strong> Provides more breathing room, especially in the early game.</li><li><strong>Slower Congestion:</strong> It takes longer for the snake to fill up the board, allowing for longer games and higher scores.</li><li><strong>Emphasis on Endurance:</strong> The challenge shifts from immediate precision to sustained focus and long-term planning.</li><li><strong>Strategy:</strong> Perimeter play, creating large open areas, and planning long routes to food become more viable.</li></ul><p class=\"example-text\">Adapting to board size is about understanding the constraints and opportunities each provides.</p>"
    },
    {
        "id": "sn_e1",
        "title": "The 'Closing the Loop' Strategy",
        "description": "Learn a common advanced strategy for maximizing space and controlling food spawns.",
        "level": "Expert",
        "content": "<p>The 'Closing the Loop' strategy is a common advanced technique used by high-scoring Snake players. It involves systematically filling a portion of the board with your snake's body to create a large, open area for future play.</p><h3>How it Works:</h3><ul><li>The snake moves along the perimeter of the board, creating a large rectangular or spiral shape.</li><li>As it grows, it 'closes off' a section of the board, leaving a smaller, open area inside the loop.</li><li>The goal is to trap food within this open area, making it easy to collect.</li></ul><h3>Advantages:</h3><ul><li><strong>Controlled Food Spawns:</strong> Food is more likely to spawn in the large open area you've created.</li><li><strong>Predictable Movement:</strong> Your snake's path becomes more predictable, reducing the risk of accidental self-collision.</li><li><strong>Efficient Collection:</strong> You can quickly collect food within the loop without having to navigate the entire board.</li></ul><h3>Risks:</h3><ul><li><strong>Trapping Yourself:</strong> If the loop is too tight or you miscalculate, you can easily trap your head inside a small area with no escape.</li><li><strong>Initial Setup:</strong> The initial phase of creating the loop can be risky, especially at higher speeds.</li></ul><p class=\"example-text\">This strategy requires excellent spatial awareness and precise control, but it's key to achieving very high scores.</p>"
    },
    {
        "id": "sn_e2",
        "title": "Creating a 'Path' for Future Food",
        "description": "Learn to manipulate the board to guide food spawns to advantageous locations.",
        "level": "Expert",
        "content": "<p>Beyond simply reacting to food, advanced players actively try to influence where food will appear by strategically positioning their snake's body.</p><h3>How to Influence Spawns:</h3><ul><li><strong>Fill Unwanted Areas:</strong> By occupying certain areas of the board with your snake's body, you make it less likely for food to spawn there. This 'forces' the food to appear in the remaining open spaces.</li><li><strong>Create 'Funnel' Shapes:</strong> You can create narrow pathways or 'funnels' with your body that lead to a specific open area. Food is then more likely to spawn in that accessible area.</li><li><strong>Leave Large Open Areas:</strong> Food generally prefers large, open, empty spaces. By maintaining one or two large open areas, you increase the probability of food appearing where you want it.</li></ul><h3>Benefits:</h3><ul><li><strong>Reduced Travel Time:</strong> Food appears closer to your snake, minimizing the distance you need to travel.</li><li><strong>Safer Collection:</strong> You can guide food to areas that are easier and safer to navigate.</li><li><strong>Increased Efficiency:</strong> More efficient food collection leads to higher scores.</li></ul><p class=\"example-text\">This technique turns the random food spawn into a somewhat predictable event, giving you a significant advantage.</p>"
    },
    {
        "id": "sn_e3",
        "title": "Advanced Tail Trapping Avoidance",
        "description": "Master techniques to prevent your tail from blocking your escape routes.",
        "level": "Expert",
        "content": "<p>As the snake grows very long, the risk of trapping your head with your own tail becomes extremely high. Advanced players employ specific techniques to avoid this fatal error.</p><h3>Key Techniques:</h3><ul><li><strong>The 'Always Leave an Exit' Rule:</strong> Before entering any enclosed space (even one created by your own body), always ensure there is a clear escape route for your head. Never move into a dead end.</li><li><strong>The 'Two-Square Rule' (for turns):</strong> When turning, ensure there are at least two open squares *beyond* your turn in the direction you are going. This prevents your tail from immediately blocking your path.</li><li><strong>The 'Sweeping' Motion:</strong> Instead of making sharp, sudden turns, try to make broader, sweeping movements that keep a larger area open behind your head. This gives your tail more room to follow without creating immediate traps.</li><li><strong>Predicting Tail Movement:</strong> Always be thinking about where your tail *will be* in the next few seconds, not just where it is now. Your tail follows your head's path.</li><li><strong>Avoid 'Folding':</strong> Don't let your snake's body fold back on itself in a tight, compact manner. This creates very dangerous, small enclosed areas.</li></ul><p class=\"example-text\">Mastering tail avoidance is the hallmark of an expert Snake player; it's the ultimate test of spatial reasoning and foresight.</p>"
    },
    {
        "id": "sn_e4",
        "title": "High Score Optimization Techniques",
        "description": "Learn strategies to push your scores to the absolute maximum.",
        "level": "Expert",
        "content": "<p>Achieving truly massive scores in Snake requires a combination of all learned techniques, executed with near-perfect precision and consistency.</p><h3>Key Optimization Strategies:</h3><ul><li><strong>Perfect Loop Management:</strong> Consistently and efficiently create and manage large loops or spirals to control food spawns and maximize open space.</li><li><strong>Minimal Wasted Movement:</strong> Every single square your snake moves without eating food is a wasted opportunity. Plan routes that are as direct as possible while remaining safe.</li><li><strong>Aggressive but Safe Food Grabs:</strong> Be quick to react to new food, but never at the expense of safety. A missed food is better than a game over.</li><li><strong>Sustained Concentration:</strong> High scores require prolonged periods of intense focus. Minimize distractions and maintain mental clarity.</li><li><strong>Adapt to Speed:</strong> Seamlessly adjust your turning and planning as the game speed increases. The fastest speeds are where the most points are earned.</li><li><strong>Pattern Recognition:</strong> Over time, you'll start to recognize common board patterns and how to best navigate them.</li><li><strong>Patience:</strong> Don't rush. Wait for the optimal moment to make a move, especially in tight situations.</li></ul><p class=\"example-text\">High scores are not just about luck; they are the result of disciplined practice and strategic mastery.</p>"
    },
    {
        "id": "sn_e5",
        "title": "Understanding Collision Detection (Conceptual)",
        "description": "Gain insight into how the game detects collisions with walls and the snake's body.",
        "level": "Expert",
        "content": "<p>While you don't need to code the game, understanding the underlying concept of collision detection can help you visualize the game's boundaries and your snake's movement more accurately.</p><h3>How Collision is Detected:</h3><ul><li><strong>Grid-Based Movement:</strong> Snake games are typically grid-based. The game board is divided into discrete squares, and the snake moves from one square to another.</li><li><strong>Head Position Check:</strong> In each game frame (or 'tick'), the game calculates the new position of the snake's head.</li><li><strong>Wall Collision:</strong> The game checks if the new head position falls outside the defined boundaries of the game canvas (e.g., if x < 0, x > canvasWidth, y < 0, y > canvasHeight). If it does, a wall collision is detected.</li><li><strong>Self-Collision:</strong> The game also checks if the new head position overlaps with any of the existing segments of the snake's body (excluding the very first segment, which is the current head). If an overlap is found, a self-collision is detected.</li></ul><p class=\"example-text\">Visualizing the game as a grid and understanding that collisions are checked at discrete points helps you make more precise movements.</p>"
    },
    {
        "id": "sn_e6",
        "title": "Adapting to Random Food Spawns",
        "description": "Develop strategies to efficiently collect food despite its unpredictable appearance.",
        "level": "Expert",
        "content": "<p>Food in Snake games typically spawns at random locations, making it impossible to predict exactly where the next food item will appear. Expert players develop strategies to adapt to this randomness.</p><h3>Key Adaptation Strategies:</h3><ul><li><strong>Maintain Flexibility:</strong> Avoid creating situations where your snake is stuck in a corner or a very narrow path. Keep your options open so you can quickly divert to new food locations.</li><li><strong>Central Tendency:</strong> While food is random, it's often more efficient to keep your snake in a relatively central location, as this minimizes the maximum distance to any potential food spawn.</li><li><strong>Quick Pathfinding:</strong> When new food appears, quickly assess the safest and most efficient path to reach it. This involves a rapid mental calculation of turns and potential obstacles.</li><li><strong>Controlled Aggression:</strong> Be aggressive in pursuing food, but always within the bounds of safety. Don't take unnecessary risks for a single food item.</li><li><strong>Perimeter Control:</strong> If you're using a perimeter strategy, you'll be able to quickly sweep along the edges for new food.</li></ul><p class=\"example-text\">Randomness is part of the challenge. The best players don't fight it; they adapt to it with flexible and efficient movement.</p>"
    },
    {
        "id": "sn_e7",
        "title": "Mental Mapping of the Board",
        "description": "Develop the ability to visualize the entire board and your snake's position mentally.",
        "level": "Expert",
        "content": "<p>As the snake grows longer and the game speeds up, relying solely on visual input for your immediate surroundings becomes insufficient. Expert players develop a 'mental map' of the entire board.</p><h3>What is Mental Mapping?</h3><ul><li>It's the ability to visualize the entire game grid, including the precise location of every segment of your snake's body, the walls, and potential food spawns, without having to consciously look at every part of the screen.</li><li>This allows you to plan several moves ahead, anticipating where your tail will be and where the safest paths are.</li></ul><h3>How to Develop It:</h3><ul><li><strong>Practice:</strong> Consistent play helps you internalize the grid and snake movements.</li><li><strong>Focus on the Whole:</strong> Instead of just looking at the snake's head, try to take in the entire board with your peripheral vision.</li><li><strong>Visualize Paths:</strong> Before making a turn, mentally trace the path your snake will take and where its tail will end up.</li><li><strong>Understand Relative Positions:</strong> Know where your head is in relation to your tail, and where both are in relation to the walls and food.</li></ul><p class=\"example-text\">Mental mapping is like having an internal GPS for the Snake game, allowing for fluid and strategic movement.</p>"
    },
    {
        "id": "sn_e8",
        "title": "Competitive Snake Strategies",
        "description": "Explore techniques used by top players to achieve world-record scores.",
        "level": "Expert",
        "content": "<p>For those aiming for the highest scores or competitive play, specific strategies are employed to maximize efficiency and survival.</p><h3>Key Competitive Strategies:</h3><ul><li><strong>Optimal Pathing:</strong> Calculating the absolute shortest and safest path to every food item, minimizing wasted movement.</li><li><strong>Grid Filling:</strong> Systematically filling the entire board with the snake's body, leaving only a small, controlled area for the head to move in. This is extremely high-risk but allows for maximum length and score.</li><li><strong>'Hole' Creation:</strong> Deliberately leaving small, one-square 'holes' in your snake's body to allow for quick turns or to access food in tight spots.</li><li><strong>Near-Perfect Execution:</strong> Competitive play demands almost flawless execution of movements, especially at maximum speed.</li><li><strong>Understanding Game Engine Quirks:</strong> Some competitive players will analyze the specific game's food spawning algorithms or collision detection nuances to gain an edge.</li><li><strong>Endurance:</strong> Maintaining peak concentration and reaction time for very long periods.</li></ul><p class=\"example-text\">Competitive Snake is a test of ultimate precision, foresight, and mental endurance.</p>"
    }
];

// Global variables for the app
let currentCourse = 'chess'; // Default to Chess
let lessonsData = chessLessonsData; // Initially set to Chess lessons
let progress = {};

// Get references to DOM elements
const appTitle = document.getElementById('appTitle');
const mainTitle = document.getElementById('mainTitle');
const mainSubtitle = document.getElementById('mainSubtitle');
const learningContent = document.getElementById('learningContent');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const resetProgressBtn = document.getElementById('resetProgressBtn');

const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const confirmButton = document.getElementById('confirmButton');
const cancelButton = document.getElementById('cancelButton');
const overlay = document.getElementById('overlay');

// Course selector buttons
const chessCourseBtn = document.getElementById('chessCourseBtn');
const sudokuCourseBtn = document.getElementById('sudokuCourseBtn');
const snakeCourseBtn = document.getElementById('snakeCourseBtn');

const allCourseButtons = [chessCourseBtn, sudokuCourseBtn, snakeCourseBtn];

// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

/**
 * Shows a custom confirmation dialog.
 * @param {string} message - The message to display.
 * @returns {Promise<boolean>} - A promise that resolves to true if confirmed, false if canceled.
 */
function showConfirmation(message) {
    return new Promise((resolve) => {
        messageText.textContent = message;
        messageBox.style.display = 'block';
        overlay.style.display = 'block';

        const onConfirm = () => {
            messageBox.style.display = 'none';
            overlay.style.display = 'none';
            confirmButton.removeEventListener('click', onConfirm);
            cancelButton.removeEventListener('click', onCancel);
            resolve(true);
        };

        const onCancel = () => {
            messageBox.style.display = 'none';
            overlay.style.display = 'none';
            confirmButton.removeEventListener('click', onConfirm);
            cancelButton.removeEventListener('click', onCancel);
            resolve(false);
        };

        confirmButton.addEventListener('click', onConfirm);
        cancelButton.addEventListener('click', onCancel);
    });
}

/**
 * Loads the user's progress from LocalStorage based on the current course.
 * If no progress is found, initializes an empty object.
 */
function loadProgress() {
    try {
        const storageKey = `${currentCourse}LearningProgress`;
        const storedProgress = localStorage.getItem(storageKey);
        if (storedProgress) {
            progress = JSON.parse(storedProgress);
        } else {
            progress = {}; // Initialize empty if nothing found
        }
    } catch (e) {
        console.error("Failed to load progress from LocalStorage:", e);
        progress = {}; // Fallback to empty progress on error
    }
}

/**
 * Saves the current progress object to LocalStorage based on the current course.
 */
function saveProgress() {
    try {
        const storageKey = `${currentCourse}LearningProgress`;
        localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch (e) {
        console.error("Failed to save progress to LocalStorage:", e);
    }
}

/**
 * Updates the progress display (text and progress bar).
 */
function updateProgressDisplay() {
    const completedLessons = Object.values(progress).filter(status => status).length;
    const totalLessons = lessonsData.length;
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    progressText.textContent = `${percentage}% Complete (${completedLessons}/${totalLessons} Lessons)`;
    progressBar.style.width = `${percentage}%`;
}

/**
 * Toggles the completion status of a lesson.
 * @param {string} lessonId - The ID of the lesson to toggle.
 */
function toggleLessonCompletion(lessonId) {
    // Toggle the status
    progress[lessonId] = !progress[lessonId];
    saveProgress(); // Save updated progress
    renderLessons(); // Re-render to update UI
    updateProgressDisplay(); // Update progress text and bar
}

/**
 * Opens the lightbox with specific lesson content.
 * @param {object} lesson - The lesson object containing title and content.
 */
function openLightbox(lesson) {
    lightboxTitle.textContent = lesson.title;
    lightboxContent.innerHTML = lesson.content; // Use innerHTML for rich content
    lightbox.style.display = 'block';
    overlay.style.display = 'block';
}

/**
 * Closes the lightbox.
 */
function closeLightbox() {
    lightbox.style.display = 'none';
    overlay.style.display = 'none';
}

/**
 * Renders all lessons dynamically into the HTML.
 * Groups lessons by their level.
 */
function renderLessons() {
    learningContent.innerHTML = ''; // Clear existing content

    // Group lessons by level
    const groupedLessons = lessonsData.reduce((acc, lesson) => {
        if (!acc[lesson.level]) {
            acc[lesson.level] = [];
        }
        acc[lesson.level].push(lesson);
        return acc;
    }, {});

    // Define order of levels
    const levelOrder = ["Beginner", "Intermediate", "Expert"];

    // Iterate over each level in defined order and create its section
    levelOrder.forEach(level => {
        if (groupedLessons[level]) {
            const levelSection = document.createElement('section');
            levelSection.className = 'mb-8'; // Margin below each level section

            const levelTitle = document.createElement('h2');
            levelTitle.className = 'level-title';
            levelTitle.textContent = `${level} Level`;
            levelSection.appendChild(levelTitle);

            // Create a grid for lessons within each level for better responsiveness
            const lessonsGrid = document.createElement('div');
            lessonsGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'; // Responsive grid

            groupedLessons[level].forEach(lesson => {
                const lessonCard = document.createElement('div');
                lessonCard.className = 'card'; // Apply card styling
                lessonCard.setAttribute('data-lesson-id', lesson.id); // Store lesson ID for easy lookup

                // Add click listener to the card itself to open the lightbox
                lessonCard.addEventListener('click', (event) => {
                    // Prevent click on the button from also opening the lightbox
                    if (!event.target.classList.contains('complete-button')) {
                        openLightbox(lesson);
                    }
                });

                const lessonTitle = document.createElement('h3');
                lessonTitle.className = 'lesson-title';
                lessonTitle.textContent = lesson.title;
                lessonCard.appendChild(lessonTitle);

                const lessonDescription = document.createElement('p');
                lessonDescription.className = 'lesson-description';
                lessonDescription.textContent = lesson.description;
                lessonCard.appendChild(lessonDescription);

                const completeButton = document.createElement('button');
                completeButton.id = `btn-${lesson.id}`;
                completeButton.className = 'complete-button w-full'; // Full width button

                // Check if the lesson is completed and set button text/class accordingly
                if (progress[lesson.id]) {
                    completeButton.textContent = 'Mark as Incomplete';
                    completeButton.classList.add('completed');
                } else {
                    completeButton.textContent = 'Mark as Complete';
                    completeButton.classList.remove('completed');
                }

                // Add event listener to toggle completion status
                completeButton.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent card's click event from firing
                    toggleLessonCompletion(lesson.id);
                });
                lessonCard.appendChild(completeButton);

                lessonsGrid.appendChild(lessonCard);
            });
            levelSection.appendChild(lessonsGrid);
            learningContent.appendChild(levelSection);
        }
    });
}

/**
 * Resets all progress for the current course.
 */
async function resetProgress() {
    const confirmed = await showConfirmation(`Are you sure you want to reset all your progress for the current course? This action cannot be undone.`);
    if (confirmed) {
        const storageKey = `${currentCourse}LearningProgress`;
        localStorage.removeItem(storageKey);
        progress = {}; // Reset the progress object
        renderLessons(); // Re-render to reflect reset
        updateProgressDisplay(); // Update progress display
    }
}

/**
 * Switches the active learning course.
 * @param {string} courseName - 'chess', 'sudoku', or 'snake'.
 */
function switchCourse(courseName) {
    // if (currentCourse === courseName) return; // No change needed

    currentCourse = courseName;

    // Update main titles and subtitles and set lessonsData
    switch (currentCourse) {
        case 'chess':
            lessonsData = chessLessonsData;
            mainTitle.textContent = 'Chess Learning Path';
            mainSubtitle.textContent = 'Your journey to becoming a Chess master!';
            appTitle.textContent = 'Chess Learning Path';
            break;
        case 'sudoku':
            lessonsData = sudokuLessonsData;
            mainTitle.textContent = 'Sudoku Learning Path';
            mainSubtitle.textContent = 'Master the art of Sudoku puzzles!';
            appTitle.textContent = 'Sudoku Learning Path';
            break;
        case 'snake':
            lessonsData = snakeLessonsData;
            mainTitle.textContent = 'Snake Game Learning Path';
            mainSubtitle.textContent = 'Learn strategies to achieve high scores in Snake!';
            appTitle.textContent = 'Snake Learning Path';
            break;
        default:
            lessonsData = chessLessonsData; // Fallback
            mainTitle.textContent = 'Game Learning Path';
            mainSubtitle.textContent = 'Choose your game to learn!';
            appTitle.textContent = 'Game Learning Path';
    }

    // Update active button styling
    allCourseButtons.forEach(button => {
        if (button.id.startsWith(currentCourse)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    loadProgress(); // Load progress for the new course
    renderLessons(); // Render lessons for the new course
    updateProgressDisplay(); // Update progress display for the new course

    localStorage.setItem('lastActiveCourse', currentCourse);
}

// Event listeners for course selector buttons
chessCourseBtn.addEventListener('click', () => switchCourse('chess'));
sudokuCourseBtn.addEventListener('click', () => switchCourse('sudoku'));
snakeCourseBtn.addEventListener('click', () => switchCourse('snake'));

// Event listener for the reset button
resetProgressBtn.addEventListener('click', resetProgress);

// Event listeners for lightbox close button and overlay
lightboxCloseBtn.addEventListener('click', closeLightbox);
overlay.addEventListener('click', closeLightbox); // Close lightbox when clicking outside

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Determine initial course based on previous state or default to Chess
    const lastCourse = localStorage.getItem('lastActiveCourse');
    const validCourses = ['chess', 'sudoku', 'snake'];
    if (lastCourse && validCourses.includes(lastCourse)) {
        switchCourse(lastCourse);
    } else {
        switchCourse('chess'); // Default to Chess
    }
    // Save the last active course when the page is closed or reloaded
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('lastActiveCourse', currentCourse);
    });
});
