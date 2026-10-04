/**
 * NEXUS//IRC — Real RFC 1459 + IRCv3 WebSocket Client Engine
 * Connects to real IRC servers over WSS (e.g., wss://testnet.ergo.chat/webirc, wss://irc.ergo.chat/webirc)
 * and streams live Pi Network (PI) & cryptocurrency market data.
 */
const CRYPTO_CHANNEL_DIRECTORY = [
  {
    name: '#latinchain',
    category: 'LatinChain Platform',
    badgeColor: 'text-purple-300 border-purple-500/40 bg-purple-500/15',
    defaultTopic: 'LatinChain Platform & ecosystem dApps.'
  },
  {
    name: '#pi-network',
    category: 'Not Pi Core Team related',
    badgeColor: 'text-purple-300 border-purple-500/40 bg-purple-500/15',
    defaultTopic: 'Pi Network Open Mainnet, Pioneers hub, Stellar Consensus Protocol (SCP), Pi Wallet & ecosystem dApps.'
  },
  {
    name: '#pi-node',
    category: 'Not Pi Core Team related',
    badgeColor: 'text-amber-300 border-amber-500/30 bg-purple-500/10',
    defaultTopic: 'Pi Node operators, Docker consensus containers, port-forwarding 31400-31409, SuperNodes & Horizon API.'
  },
  {
    name: '#bitcoin',
    category: 'Layer-1 / PoW',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    defaultTopic: 'Bitcoin Core protocol, BIPs, UTXO management, Lightning Network & Mempool fee dynamics.'
  },
  {
    name: '#ethereum',
    category: 'EVM & L2 Rollups',
    badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    defaultTopic: 'Ethereum mainnet, Solidity smart contracts, ZK/Optimistic Rollups, MEV & EIP discussions.'
  },
  {
    name: '#monero',
    category: 'Privacy / XMR',
    badgeColor: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    defaultTopic: 'Monero (XMR), RingCT, Stealth Addresses, FCMP++, RandomX mining & zero-knowledge privacy.'
  },
  {
    name: '#defi',
    category: 'DEX & Yield',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    defaultTopic: 'Decentralized Finance, AMM liquidity pools, lending protocols, perpetuals & smart contract security.'
  },
  {
    name: '#blockchain',
    category: 'Consensus & Dev',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    defaultTopic: 'Distributed systems, BFT/SCP consensus algorithms, cryptographic primitives & cross-chain bridges.'
  },
  {
    name: '#crypto-trading',
    category: 'Orderflow & TA',
    badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    defaultTopic: 'Real-time spot/derivatives orderflow, Pi/Crypto market liquidity, on-chain whale tracking & macro.'
  }
];

const SLASH_COMMANDS = [
  { cmd: '/join', syntax: '/join #channel', desc: 'Join a real IRC channel on the server' },
  { cmd: '/part', syntax: '/part [#channel] [reason]', desc: 'Leave the current or specified IRC channel' },
  /*{ cmd: '/nick', syntax: '/nick <new_nickname>', desc: 'Change your active IRC nickname' },*/
  { cmd: '/msg', syntax: '/msg <target> <message>', desc: 'Send a private PRIVMSG to a user or channel' },
  { cmd: '/me', syntax: '/me <action text>', desc: 'Send a CTCP ACTION message to the channel' },
  { cmd: '/whois', syntax: '/whois <nickname>', desc: 'Query real server WHOIS details for a user' },
  { cmd: '/topic', syntax: '/topic [new topic]', desc: 'View or set the channel topic on the server' },
  { cmd: '/names', syntax: '/names [#channel]', desc: 'Request updated channel member list (353)' },
  { cmd: '/list', syntax: '/list', desc: 'List all active public channels on the IRC server' },
  { cmd: '/history', syntax: '/history [count]', desc: 'Fetch IRCv3 CHATHISTORY from the server' },
  { cmd: '/ticker', syntax: '/ticker <PI|BTC|ETH|SOL|XMR>', desc: 'Broadcast live Pi Network or Crypto price to channel' },
  { cmd: '/dev', syntax: '/dev', desc: 'View Developer info (César Cordero Rodríguez & LatinChain)' },
  { cmd: '/ping', syntax: '/ping', desc: 'Measure live round-trip latency to the IRC server' },
  { cmd: '/raw', syntax: '/raw <IRC COMMAND>', desc: 'Send a raw RFC 1459 command directly over WSS' },
  { cmd: '/clear', syntax: '/clear', desc: 'Clear messages in the active buffer view' },
  { cmd: '/help', syntax: '/help', desc: 'Display IRC commands and protocol tips' }
];

const STORAGE_KEYS = {
  NICK: 'nexus_irc_nick',
  USERNAME: 'nexus_irc_username'
};

class IRCClientApp {
  constructor() {
    // Load last chosen nickname/username from LocalStorage, or generate a default Pioneer nickname
    const randSuffix = Math.floor(100 + Math.random() * 899);
    let savedNick = null;
    let savedUsername = null;
    try {

        savedNick = localStorage.getItem(STORAGE_KEYS.NICK);
        savedUsername = localStorage.getItem(STORAGE_KEYS.USERNAME);
        
    } catch (e) {}

    const initialNick = (savedNick && savedNick.trim()) ? savedNick.trim() : `Pioneer_${randSuffix}`;
    const initialUsername = (savedUsername && savedUsername.trim()) ? savedUsername.trim() : 'pinode';

    this.state = {
      serverUrl: 'wss://testnet.ergo.chat/webirc',
      subprotocolMode: 'ircv3', // 'ircv3' or 'plain'
      nick: initialNick,
      pendingNick: null,
      previousNicks: new Set(),
      username: initialUsername,
      realname: 'NEXUS//IRC Pi Network & Crypto WebSocket Client',
      autoChannels: ['#latinchain', '#pi-network', '#pi-node', '#bitcoin', '#ethereum', '#monero', '#defi', '#blockchain', '#crypto-trading'],
      connected: false,
      connecting: false,
      registered: false,
      activeBuffer: '#latinchain',
      buffers: {},
      serverChannelsList: [],
      enabledCaps: new Set(),
      lastPingSentAt: 0,
      latencyMs: null,
      cmdHistory: [],
      cmdHistoryIndex: -1,
      usedFallbackSubprotocol: false
    };

    this.ws = null;
    this.pingInterval = null;

    // Optional 2nd Real WebSocket Peer Connection (for live multi-client round-trip verification)
    this.peerWs = null;
    this.peerNick = `PiOracle_${Math.floor(10 + Math.random() * 89)}`;
    this.peerConnected = false;

    // Live Crypto & Pi Network Prices state
    this.tickers = {
      PI: { price: null, change24h: null },
      BTC: { price: null, change24h: null },
      ETH: { price: null, change24h: null },
      SOL: { price: null, change24h: null },
      XMR: { price: null, change24h: null }
    };
    this.krakenWs = null;

    this.initBuffers();
    this.bindScrollListener();

    // Cleanly quit IRC session on page unload/refresh so old nickname doesn't linger as a ghost
    window.addEventListener('beforeunload', () => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try { this.ws.send('QUIT :Client reload'); } catch (e) {}
      }
    });
  }

  initBuffers() {
    // Create *server console buffer
    this.ensureBuffer('*status', 'server', 'IRC Network Console — Raw RFC 1459 & IRCv3 negotiation logs');
    // Pre-create the crypto channels so UI is immediately rich and navigable
    CRYPTO_CHANNEL_DIRECTORY.forEach(ch => {
      this.ensureBuffer(ch.name, 'channel', ch.defaultTopic, ch.category);
    });
  }

  ensureBuffer(name, type = 'channel', defaultTopic = '', category = '') {
    const key = name.toLowerCase();
    if (!this.state.buffers[key]) {
      const dirMeta = CRYPTO_CHANNEL_DIRECTORY.find(c => c.name.toLowerCase() === key);
      this.state.buffers[key] = {
        key,
        name,
        type, // 'server', 'channel', 'query'
        topic: defaultTopic || (dirMeta ? dirMeta.defaultTopic : ''),
        category: category || (dirMeta ? dirMeta.category : (type === 'channel' ? 'Crypto Channel' : 'Direct Message')),
        modes: '+nt',
        users: new Map(), // nickLower -> { nick, prefix: '@'|'+'|'' }
        messages: [],
        unread: 0,
        hasMention: false,
        joined: false
      };
    }
    return this.state.buffers[key];
  }

  init() {
    // Populate modal & header defaults from state (loaded from LocalStorage)
    document.getElementById('inputNickname').value = this.state.nick;
    document.getElementById('inputUsername').value = this.state.username;
    document.getElementById('sidebarNickDisplay').textContent = `nick: ${this.state.nick}`;
    document.getElementById('composerNickBadge').textContent = this.state.nick;

    this.renderCryptoDirectory();
    this.renderAllBufferLists();
    this.switchBuffer('#latinchain');

    // Start real WebSocket connection to IRC server
    this.connect();

    // Start real Crypto & Pi Network Market Ticker Stream
    this.initCryptoMarketStream();
  }

  connect() {
    if (this.ws) {
      try {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send('QUIT :Reconnecting');
        }
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    clearInterval(this.pingInterval);

    // Reset channel peer lists before establishing a new connection so old nicknames don't persist
    Object.values(this.state.buffers).forEach(buf => {
      if (buf.users) buf.users.clear();
      if (buf.type === 'channel') buf.joined = false;
    });
    this.renderUserList();

    this.state.connecting = true;
    this.state.connected = false;
    this.state.registered = false;
    this.state.enabledCaps.clear();
    this.updateConnectionStatusUI('CONNECTING...', 'amber');

    const url = this.state.serverUrl.trim();
    const useIrcv3Proto = this.state.subprotocolMode === 'ircv3' && !this.state.usedFallbackSubprotocol;

    this.addSystemMessage('*status', `Opening real TLS WebSocket connection to ${url} ...`);
    this.addSystemMessage(this.state.activeBuffer, `Connecting to ${url} as ${this.state.nick}...`);

    try {
      if (useIrcv3Proto) {
        this.ws = new WebSocket(url, ['text.ircv3.net', 'binary.ircv3.net']);
      } else {
        this.ws = new WebSocket(url);
      }
    } catch (err) {
      this.handleConnectionError(`Failed to initialize WebSocket: ${err.message}`);
      return;
    }

    this.ws.addEventListener('open', () => {
      this.state.connecting = false;
      this.state.connected = true;
      this.state.usedFallbackSubprotocol = false;
      this.updateConnectionStatusUI('HANDSHAKE', 'cyan');

      const protoUsed = this.ws.protocol || 'raw-irc';
      this.addSystemMessage('*status', `WebSocket connected (subprotocol: ${protoUsed}). Starting IRCv3 capability negotiation...`);

      // Send IRCv3 CAP LS 302 + NICK + USER registration sequence
      this.state.pendingNick = this.state.nick;
      this.sendRaw('CAP LS 302');
      this.sendRaw(`NICK ${this.state.nick}`);
      this.sendRaw(`USER ${this.state.username} 0 * :${this.state.realname}`);

      // Start periodic latency PING
      this.pingInterval = setInterval(() => {
        if (this.state.connected && this.state.registered) {
          this.sendRawPing();
        }
      }, 35000);
    });

    this.ws.addEventListener('message', async (event) => {
      let rawText = '';
      if (typeof event.data === 'string') {
        rawText = event.data;
      } else if (event.data instanceof Blob) {
        rawText = await event.data.text();
      } else if (event.data instanceof ArrayBuffer) {
        rawText = new TextDecoder('utf-8').decode(event.data);
      }

      const lines = rawText.split(/\r?\n/);
      for (const line of lines) {
        if (line.trim().length > 0) {
          this.logRawFrame('<<', line);
          this.parseAndHandleIrcLine(line);
        }
      }
    });

    this.ws.addEventListener('error', () => {
      // If IRCv3 subprotocol was rejected by a legacy server, automatically retry with plain WebSocket
      if (this.state.subprotocolMode === 'ircv3' && !this.state.usedFallbackSubprotocol && !this.state.connected) {
        this.state.usedFallbackSubprotocol = true;
        this.addSystemMessage('*status', 'Retrying WebSocket handshake without IRCv3 subprotocol header...');
        setTimeout(() => this.connect(), 300);
      }
    });

    this.ws.addEventListener('close', (ev) => {
      clearInterval(this.pingInterval);
      const wasConnected = this.state.connected;
      this.state.connecting = false;
      this.state.connected = false;
      this.state.registered = false;
      this.updateConnectionStatusUI('DISCONNECTED', 'red');

      if (wasConnected) {
        this.addSystemMessage(this.state.activeBuffer, `Disconnected from IRC server (code ${ev.code}). Click "Connect WSS" to reconnect.`);
      } else if (!this.state.usedFallbackSubprotocol) {
        this.addSystemMessage('*status', `Connection closed (code ${ev.code}). Verify the wss:// endpoint is reachable.`);
      }
    });
  }

  sendRaw(commandLine) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.showToast('WebSocket is not connected. Click Connect WSS.', 'amber');
      return false;
    }
    const cleanLine = commandLine.replace(/[\r\n]+/g, '');
    this.ws.send(cleanLine);
    this.logRawFrame('>>', cleanLine);
    return true;
  }

  sendRawPing() {
    this.state.lastPingSentAt = performance.now();
    this.sendRaw(`PING :nexus-${Date.now()}`);
  }

  /**
   * Full RFC 1459 + IRCv3 @message-tags parser
   * Format: [@tags] [:prefix] COMMAND [params...] [:trailing]
   */
  parseAndHandleIrcLine(rawLine) {
    let line = rawLine.trim();
    const tags = {};

    // 1. Parse optional IRCv3 @tags
    if (line.startsWith('@')) {
      const spaceIdx = line.indexOf(' ');
      if (spaceIdx !== -1) {
        const tagStr = line.slice(1, spaceIdx);
        line = line.slice(spaceIdx + 1).trimStart();
        tagStr.split(';').forEach(pair => {
          const eqIdx = pair.indexOf('=');
          if (eqIdx !== -1) {
            tags[pair.slice(0, eqIdx)] = pair.slice(eqIdx + 1).replace(/\\s/g, ' ');
          } else {
            tags[pair] = true;
          }
        });
      }
    }

    // 2. Parse optional :prefix
    let prefix = '';
    let nick = '';
    let userHost = '';
    if (line.startsWith(':')) {
      const spaceIdx = line.indexOf(' ');
      if (spaceIdx !== -1) {
        prefix = line.slice(1, spaceIdx);
        line = line.slice(spaceIdx + 1).trimStart();
        const bangIdx = prefix.indexOf('!');
        if (bangIdx !== -1) {
          nick = prefix.slice(0, bangIdx);
          userHost = prefix.slice(bangIdx + 1);
        } else {
          nick = prefix;
        }
      }
    }

    // 3. Parse command and parameters
    const params = [];
    let trailing = '';
    const trailIdx = line.indexOf(' :');
    let mainPart = line;

    if (trailIdx !== -1) {
      mainPart = line.slice(0, trailIdx);
      trailing = line.slice(trailIdx + 2);
    } else if (line.startsWith(':')) {
      mainPart = '';
      trailing = line.slice(1);
    }

    const parts = mainPart.split(/\s+/).filter(Boolean);
    const command = (parts.shift() || '').toUpperCase();
    params.push(...parts);
    if (trailIdx !== -1 || (line.startsWith(':') && !command)) {
      params.push(trailing);
    }

    // Timestamp from IRCv3 server-time tag or current clock
    const msgTime = tags.time ? new Date(tags.time) : new Date();

    this.dispatchIrcCommand({ rawLine, tags, prefix, nick, userHost, command, params, msgTime });
  }

  dispatchIrcCommand(pkt) {
    const { command, params, nick, userHost, tags, msgTime } = pkt;

    switch (command) {
      case 'PING': {
        const token = params[0] || 'keepalive';
        this.sendRaw(`PONG :${token}`);
        break;
      }

      case 'PONG': {
        if (this.state.lastPingSentAt > 0) {
          const rtt = Math.round(performance.now() - this.state.lastPingSentAt);
          this.state.latencyMs = rtt;
          const badge = document.getElementById('topPingBadge');
          if (badge) badge.textContent = `${rtt} ms`;
        }
        break;
      }

      case 'CAP': {
        // Format: :server CAP <nick|*> <LS|ACK|NAK> :caps...
        const subcmd = (params[1] || '').toUpperCase();
        const capTail = params[params.length - 1] || '';
        if (subcmd === 'LS') {
          const isMultiline = params[2] === '*';
          const offered = capTail.split(/\s+/);
          const desired = ['message-tags', 'server-time', 'echo-message', 'batch', 'chathistory', 'labeled-response'];
          const toReq = [];
          offered.forEach(c => {
            const cleanCap = c.split('=')[0];
            if (desired.includes(cleanCap)) toReq.push(cleanCap);
          });
          if (toReq.length > 0) {
            this.sendRaw(`CAP REQ :${toReq.join(' ')}`);
          } else if (!isMultiline) {
            this.sendRaw('CAP END');
          }
        } else if (subcmd === 'ACK') {
          capTail.split(/\s+/).filter(Boolean).forEach(c => this.state.enabledCaps.add(c));
          document.getElementById('capsCountBadge').textContent = `${this.state.enabledCaps.size} CAPS`;
          this.addSystemMessage('*status', `Negotiated IRCv3 Capabilities: ${Array.from(this.state.enabledCaps).join(', ')}`);
          this.sendRaw('CAP END');
        } else if (subcmd === 'NAK') {
          this.sendRaw('CAP END');
        }
        break;
      }

      case '001': { // RPL_WELCOME
        this.state.registered = true;
        if (params[0]) {
          this.updateOwnNickname(params[0]);
        }
        this.updateConnectionStatusUI('WSS:// LIVE', 'emerald');
        this.addSystemMessage('*status', params[params.length - 1] || 'Welcome to IRC!');
        this.showToast(`Connected to IRC as ${this.state.nick}`, 'emerald');

        // Automatically join configured Crypto & Blockchain channels
        this.state.autoChannels.forEach((ch, idx) => {
          setTimeout(() => {
            this.sendRaw(`JOIN ${ch}`);
          }, idx * 180);
        });

        // Measure initial ping
        setTimeout(() => this.sendRawPing(), 800);
        break;
      }

      case '002':
      case '003':
      case '004':
      case '005':
      case '251':
      case '252':
      case '254':
      case '255':
      case '265':
      case '266':
      case '375':
      case '372':
      case '376': {
        const text = params.slice(1).join(' ');
        this.addSystemMessage('*status', text, msgTime);
        break;
      }

      case '433': { // ERR_NICKNAMEINUSE (:server 433 <current_nick|*> <attempted_nick> :Nickname is already in use)
        const attemptedNick = (params[1] && !params[1].includes(' ')) ? params[1] : (this.state.pendingNick || this.state.nick);
        this.removeNickFromAllPeerLists(attemptedNick);
        const baseNick = attemptedNick.replace(/_\d+$/, '');
        const altNick = `${baseNick}_${Math.floor(10 + Math.random() * 89)}`;
        this.state.pendingNick = altNick;
        this.addSystemMessage('*status', `Nickname ${attemptedNick} is in use; switching to ${altNick}...`);
        if (this.state.activeBuffer !== '*status') {
          this.addSystemMessage(this.state.activeBuffer, `Nickname ${attemptedNick} is in use; switching to ${altNick}...`);
        }
        this.updateOwnNickname(altNick);
        this.sendRaw(`NICK ${altNick}`);
        break;
      }

      case 'JOIN': {
        const chanName = params[0];
        if (!chanName) break;
        const buf = this.ensureBuffer(chanName, 'channel');
        const isSelf = nick.toLowerCase() === this.state.nick.toLowerCase();

        if (isSelf) {
          buf.joined = true;
          buf.users.clear();
          buf.users.set(this.state.nick.toLowerCase(), { nick: this.state.nick, prefix: '' });
          this.addSystemMessage(chanName, `You joined ${chanName} over live WSS (${this.state.serverUrl})`, msgTime);
          // If server supports IRCv3 chathistory, request recent messages automatically
          if (this.state.enabledCaps.has('chathistory')) {
            this.sendRaw(`CHATHISTORY LATEST ${chanName} * 35`);
          }
        } else {
          if (!this.state.previousNicks.has(nick.toLowerCase())) {
            buf.users.set(nick.toLowerCase(), { nick, prefix: '' });
          }
          this.addEventMessage(chanName, 'join', `${nick} (${userHost || 'peer'}) joined ${chanName}`, msgTime);
        }
        this.renderAllBufferLists();
        if (this.state.activeBuffer.toLowerCase() === chanName.toLowerCase()) {
          this.renderUserList();
        }
        break;
      }

      case 'PART': {
        const chanName = params[0];
        const reason = params[1] || '';
        const buf = this.ensureBuffer(chanName, 'channel');
        const isSelf = nick.toLowerCase() === this.state.nick.toLowerCase();
        if (isSelf) {
          buf.joined = false;
          buf.users.clear();
          this.addSystemMessage(chanName, `You left ${chanName}${reason ? ` (${reason})` : ''}`, msgTime);
        } else {
          buf.users.delete(nick.toLowerCase());
          this.addEventMessage(chanName, 'part', `${nick} left ${chanName}${reason ? ` (${reason})` : ''}`, msgTime);
        }
        if (this.state.activeBuffer.toLowerCase() === chanName.toLowerCase()) {
          this.renderUserList();
        }
        break;
      }

      case 'QUIT': {
        const reason = params[0] || 'Client Quit';
        Object.values(this.state.buffers).forEach(buf => {
          if (buf.users && buf.users.has(nick.toLowerCase())) {
            buf.users.delete(nick.toLowerCase());
            this.addEventMessage(buf.name, 'quit', `${nick} quit (${reason})`, msgTime);
          }
        });
        this.renderUserList();
        break;
      }

      case 'NICK': {
        const newNick = params[0];
        if (!newNick) break;
        const oldNickLower = nick.toLowerCase();
        const isSelf =
          oldNickLower === this.state.nick.toLowerCase() ||
          (this.state.pendingNick && oldNickLower === this.state.pendingNick.toLowerCase()) ||
          this.state.previousNicks.has(oldNickLower);

        Object.values(this.state.buffers).forEach(buf => {
          if (buf.users && buf.users.has(oldNickLower)) {
            const existing = buf.users.get(oldNickLower);
            buf.users.delete(oldNickLower);
            buf.users.set(newNick.toLowerCase(), { nick: newNick, prefix: existing.prefix });
            this.addEventMessage(buf.name, 'nick', `${nick} is now known as ${newNick}`, msgTime);
          }
        });

        if (isSelf) {
          this.removeNickFromAllPeerLists(nick);
          this.updateOwnNickname(newNick);
        } else {
          this.renderUserList();
        }
        break;
      }

      case 'TOPIC':
      case '332': { // RPL_TOPIC
        const chanName = command === '332' ? params[1] : params[0];
        const topicText = command === '332' ? params[2] : params[1];
        if (chanName) {
          const buf = this.ensureBuffer(chanName, 'channel');
          buf.topic = topicText || '';
          this.addEventMessage(chanName, 'topic', `Topic for ${chanName}: ${topicText}`, msgTime);
          if (this.state.activeBuffer.toLowerCase() === chanName.toLowerCase()) {
            this.updateActiveHeaderUI();
          }
        }
        break;
      }

      case '353': { // RPL_NAMREPLY (:server 353 nick = #channel :@op +voice user1 user2)
        const chanName = params[2];
        const namesStr = params[params.length - 1] || '';
        if (chanName) {
          const buf = this.ensureBuffer(chanName, 'channel');
          namesStr.split(/\s+/).filter(Boolean).forEach(rawToken => {
            // Strip optional userhost-in-names !user@host
            const token = rawToken.split('!')[0];
            let prefix = '';
            let cleanNick = token;
            if (/^[~&@%+]/.test(token)) {
              prefix = token[0];
              cleanNick = token.slice(1);
            }
            if (cleanNick) {
              const lower = cleanNick.toLowerCase();
              // Skip any retired/previous nicknames of this user so they don't appear in the peer list
              if (lower !== this.state.nick.toLowerCase() && this.state.previousNicks.has(lower)) {
                buf.users.delete(lower);
                return;
              }
              buf.users.set(lower, { nick: cleanNick, prefix });
            }
          });
        }
        break;
      }

      case '366': { // RPL_ENDOFNAMES
        const chanName = params[1];
        if (chanName && this.state.activeBuffer.toLowerCase() === chanName.toLowerCase()) {
          this.renderUserList();
        }
        break;
      }

      case 'PRIVMSG':
      case 'NOTICE': {
        const target = params[0] || '*status';
        let text = params[params.length - 1] || '';
        const isChannel = target.startsWith('#') || target.startsWith('&');
        const bufferTarget = isChannel
          ? target
          : (nick.toLowerCase() === this.state.nick.toLowerCase() ? target : (nick || '*status'));

        // Check for CTCP (\x01...\x01)
        if (text.startsWith('\x01') && text.endsWith('\x01')) {
          const ctcpContent = text.slice(1, -1);
          if (ctcpContent.toUpperCase().startsWith('ACTION ')) {
            const actionText = ctcpContent.slice(7);
            this.addChatMessage(bufferTarget, nick || 'Server', actionText, {
              isAction: true,
              msgTime,
              msgid: tags.msgid
            });
          } else if (ctcpContent.toUpperCase() === 'VERSION' && command === 'PRIVMSG') {
            this.sendRaw(`NOTICE ${nick} :\x01VERSION NEXUS//IRC Crypto HTML5 WebSocket Client v3.2\x01`);
          }
          break;
        }

        // Avoid duplicate echo if echo-message is enabled and we already rendered locally
        if (tags.msgid && this.hasMsgId(bufferTarget, tags.msgid)) {
          break;
        }

        this.addChatMessage(bufferTarget, nick || 'Server', text, {
          isNotice: command === 'NOTICE',
          msgTime,
          msgid: tags.msgid
        });
        break;
      }

      case '321': { // RPL_LISTSTART
        this.state.serverChannelsList = [];
        break;
      }

      case '322': { // RPL_LIST (:server 322 nick #channel count :topic)
        const chName = params[1];
        const userCount = parseInt(params[2] || '0', 10);
        const chTopic = params[3] || '';
        if (chName) {
          this.state.serverChannelsList.push({ name: chName, count: userCount, topic: chTopic });
        }
        break;
      }

      case '323': { // RPL_LISTEND
        this.renderServerChannelList();
        break;
      }

      case '311': // RPL_WHOISUSER
      case '312': // RPL_WHOISSERVER
      case '317': // RPL_WHOISIDLE
      case '319': // RPL_WHOISCHANNELS
      case '318': { // RPL_ENDOFWHOIS
        const info = params.slice(1).join(' ');
        this.addSystemMessage(this.state.activeBuffer, `[WHOIS] ${info}`, msgTime);
        break;
      }

      default: {
        // Error numerics (4xx / 5xx)
        if (/^[45]\d\d$/.test(command)) {
          const errText = params.slice(1).join(' ');
          this.addSystemMessage(this.state.activeBuffer, `[IRC ${command}] ${errText}`, msgTime);
        }
        break;
      }
    }
  }

  hasMsgId(bufferName, msgid) {
    const buf = this.state.buffers[bufferName.toLowerCase()];
    if (!buf) return false;
    return buf.messages.some(m => m.msgid && m.msgid === msgid);
  }

  nickColorClass(nick) {
    const palette = [
      'text-amber-400',
      'text-cyan-400',
      'text-emerald-400',
      'text-indigo-400',
      'text-pink-400',
      'text-purple-400',
      'text-orange-400',
      'text-teal-400',
      'text-lime-400',
      'text-sky-400'
    ];
    let hash = 0;
    for (let i = 0; i < nick.length; i++) {
      hash = nick.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
  }

  addChatMessage(bufferName, senderNick, text, opts = {}) {
    const isQuery = !bufferName.startsWith('#') && !bufferName.startsWith('&') && bufferName !== '*status';
    const buf = this.ensureBuffer(bufferName, isQuery ? 'query' : (bufferName === '*status' ? 'server' : 'channel'));

    const isSelf = senderNick.toLowerCase() === this.state.nick.toLowerCase();
    const isMention = !isSelf && text.toLowerCase().includes(this.state.nick.toLowerCase());

    const msgObj = {
      id: `${Date.now()}-${Math.random()}`,
      msgid: opts.msgid || null,
      type: opts.isAction ? 'action' : (opts.isNotice ? 'notice' : 'chat'),
      nick: senderNick,
      text,
      time: opts.msgTime || new Date(),
      isSelf,
      isMention
    };

    buf.messages.push(msgObj);
    if (buf.messages.length > 300) buf.messages.shift();

    if (this.state.activeBuffer.toLowerCase() !== buf.key) {
      buf.unread++;
      if (isMention) buf.hasMention = true;
      this.renderAllBufferLists();
    } else {
      this.appendMessageElement(msgObj);
    }
  }

  addSystemMessage(bufferName, text, time = new Date()) {
    const buf = this.ensureBuffer(bufferName);
    const msgObj = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'system',
      nick: '♦',
      text,
      time
    };
    buf.messages.push(msgObj);
    if (this.state.activeBuffer.toLowerCase() === buf.key) {
      this.appendMessageElement(msgObj);
    }
  }

  addEventMessage(bufferName, subtype, text, time = new Date()) {
    const buf = this.ensureBuffer(bufferName);
    const msgObj = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'event',
      subtype,
      nick: subtype === 'join' ? '→' : (subtype === 'part' || subtype === 'quit' ? '←' : '•'),
      text,
      time
    };
    buf.messages.push(msgObj);
    if (this.state.activeBuffer.toLowerCase() === buf.key) {
      this.appendMessageElement(msgObj);
    }
  }

  formatTimestamp(dateObj) {
    const d = dateObj instanceof Date && !isNaN(dateObj) ? dateObj : new Date();
    return d.toTimeString().slice(0, 8);
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  formatMessageHtml(rawText) {
    let safe = this.escapeHtml(rawText);

    // Linkify URLs
    safe = safe.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline hover:text-cyan-300 break-all">$1</a>'
    );

    // Make #channel references clickable to join/switch
    safe = safe.replace(
      /(^|\s)(#[a-zA-Z0-9_-]{2,32})/g,
      '$1<button type="button" onclick="app.joinOrSwitchChannel(\'$2\')" class="text-amber-400 hover:underline font-semibold">$2</button>'
    );

    // Highlight $PI, $BTC, $ETH, $SOL, $XMR cashtags
    safe = safe.replace(
      /(\$(?:PI|BTC|ETH|SOL|XMR|USDT|USDC|DEF|ZEC|ADA|DOT))\b/gi,
      '<span class="px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">$1</span>'
    );

    return safe;
  }

  appendMessageElement(msg) {
    const container = document.getElementById('messageScrollContainer');
    if (!container) return;

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    const row = document.createElement('div');
    const timeStr = this.formatTimestamp(msg.time);

    if (msg.type === 'system') {
      row.className = 'py-1 px-2 rounded bg-obsidian-800/60 border-l-2 border-cyan-500/70 text-xs text-slate-300 flex items-start gap-2';
      row.innerHTML = `
        <span class="text-slate-500 tabular-nums shrink-0">[${timeStr}]</span>
        <span class="text-cyan-400 font-bold shrink-0">⚡</span>
        <span class="break-words">${this.formatMessageHtml(msg.text)}</span>
      `;
    } else if (msg.type === 'event') {
      const iconColor = msg.subtype === 'join' ? 'text-emerald-400' : (msg.subtype === 'part' || msg.subtype === 'quit' ? 'text-rose-400' : 'text-amber-400');
      row.className = 'py-0.5 px-2 text-[11px] text-slate-400 flex items-start gap-2';
      row.innerHTML = `
        <span class="text-slate-600 tabular-nums shrink-0">[${timeStr}]</span>
        <span class="${iconColor} font-bold shrink-0">${msg.nick}</span>
        <span class="break-words">${this.escapeHtml(msg.text)}</span>
      `;
    } else if (msg.type === 'action') {
      row.className = 'py-1 px-2 rounded text-amber-300/90 italic flex items-start gap-2';
      row.innerHTML = `
        <span class="text-slate-500 tabular-nums shrink-0 not-italic">[${timeStr}]</span>
        <span>* <strong>${this.escapeHtml(msg.nick)}</strong> ${this.formatMessageHtml(msg.text)}</span>
      `;
    } else {
      const rowHighlight = msg.isMention ? 'irc-mention-row' : (msg.isSelf ? 'irc-self-row' : 'hover:bg-obsidian-800/40');
      const nickColor = msg.isSelf ? 'text-cyan-300' : this.nickColorClass(msg.nick);
      row.className = `py-1 px-2 rounded transition flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2.5 ${rowHighlight}`;
      row.innerHTML = `
        <div class="flex items-baseline gap-2 shrink-0">
          <span class="text-[11px] text-slate-500 tabular-nums">[${timeStr}]</span>
          <button type="button" onclick="app.insertNickMention('${this.escapeHtml(msg.nick)}')" class="font-bold ${nickColor} hover:underline text-left sm:w-28 sm:text-right truncate" title="Click to mention ${this.escapeHtml(msg.nick)}">
            &lt;${this.escapeHtml(msg.nick)}&gt;
          </button>
        </div>
        <div class="text-slate-100 break-words flex-1 min-w-0">${this.formatMessageHtml(msg.text)}</div>
      `;
    }

    container.appendChild(row);
    if (isNearBottom) {
      this.scrollToBottom();
    } else {
      document.getElementById('scrollToBottomBtn').classList.remove('hidden');
    }
  }

  switchBuffer(bufferName) {
    const buf = this.ensureBuffer(bufferName);
    this.state.activeBuffer = buf.name;
    buf.unread = 0;
    buf.hasMention = false;

    this.updateActiveHeaderUI();
    this.renderAllBufferLists();
    this.renderUserList();

    // Render all messages in buffer
    const container = document.getElementById('messageScrollContainer');
    container.innerHTML = '';
    buf.messages.forEach(m => this.appendMessageElement(m));
    this.scrollToBottom(true);

    // Close mobile drawers after selecting a channel
    this.closeDrawers();
  }

  updateActiveHeaderUI() {
    const buf = this.ensureBuffer(this.state.activeBuffer);
    document.getElementById('activeBufferTitle').textContent = buf.name;
    document.getElementById('activeBufferTopic').textContent = buf.topic || 'No channel topic set. Use /topic <text> to set one.';
    document.getElementById('rightDrawerChannelLabel').textContent = buf.name;

    const catPill = document.getElementById('activeCategoryPill');
    if (buf.category) {
      catPill.textContent = buf.category;
      catPill.classList.remove('hidden');
    } else {
      catPill.classList.add('hidden');
    }

    const input = document.getElementById('ircMessageInput');
    if (input) {
      input.placeholder = `Message ${buf.name} or type /help, /join, /whois, /ticker BTC...`;
    }
  }

  renderAllBufferLists() {
    const serverContainer = document.getElementById('serverBufferList');
    const channelContainer = document.getElementById('channelBufferList');
    const queryContainer = document.getElementById('queryBufferList');

    serverContainer.innerHTML = '';
    channelContainer.innerHTML = '';
    queryContainer.innerHTML = '';

    let totalUnread = 0;

    Object.values(this.state.buffers).forEach(buf => {
      totalUnread += buf.unread;
      const isActive = this.state.activeBuffer.toLowerCase() === buf.key;
      const btn = document.createElement('div');
      btn.className = `group flex items-center justify-between px-2.5 py-1.5 rounded-lg font-mono text-xs cursor-pointer transition ${
        isActive
          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
          : 'text-slate-300 hover:bg-obsidian-700/70'
      }`;
      btn.onclick = () => this.switchBuffer(buf.name);

      const statusDot = buf.type === 'channel'
        ? `<span class="w-1.5 h-1.5 rounded-full ${buf.joined ? 'bg-emerald-400' : 'bg-slate-600'}"></span>`
        : `<span class="text-amber-400">⚡</span>`;

      const unreadBadge = buf.unread > 0
        ? `<span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold ${buf.hasMention ? 'bg-amber-500 text-obsidian-950' : 'bg-cyan-500/20 text-cyan-300'}">${buf.unread}</span>`
        : '';

      const closeBtn = buf.type !== 'server'
        ? `<button type="button" onclick="event.stopPropagation(); app.partAndCloseBuffer('${buf.name}')" title="Part/Close ${buf.name}" class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 px-1">×</button>`
        : '';

      btn.innerHTML = `
        <div class="flex items-center gap-2 truncate">
          ${statusDot}
          <span class="truncate">${this.escapeHtml(buf.name)}</span>
        </div>
        <div class="flex items-center gap-1">
          ${unreadBadge}
          ${closeBtn}
        </div>
      `;

      if (buf.type === 'server') serverContainer.appendChild(btn);
      else if (buf.type === 'channel') channelContainer.appendChild(btn);
      else queryContainer.appendChild(btn);
    });

    const mobileDot = document.getElementById('mobileUnreadDot');
    if (mobileDot) {
      mobileDot.classList.toggle('hidden', totalUnread === 0);
    }
  }

  renderCryptoDirectory() {
    const container = document.getElementById('cryptoDirectoryList');
    if (!container) return;
    container.innerHTML = '';

    CRYPTO_CHANNEL_DIRECTORY.forEach(item => {
      const card = document.createElement('button');
      card.type = 'button';
      card.onclick = () => this.joinOrSwitchChannel(item.name);
      card.className = 'w-full text-left p-2 rounded-lg bg-obsidian-900/70 hover:bg-obsidian-700 border border-obsidian-600/80 transition flex items-center justify-between gap-2';
      card.innerHTML = `
        <div class="min-w-0">
          <div class="font-mono text-xs font-bold text-slate-100 truncate">${item.name}</div>
          <div class="text-[10px] text-slate-400 truncate">${item.defaultTopic}</div>
        </div>
        <span class="text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${item.badgeColor}">${item.category}</span>
      `;
      container.appendChild(card);
    });
  }

  renderUserList() {
    const container = document.getElementById('channelUserListContainer');
    const countBadge = document.getElementById('headerUserCount');
    if (!container) return;

    const buf = this.ensureBuffer(this.state.activeBuffer);
    const filterVal = (document.getElementById('userFilterInput')?.value || '').toLowerCase();

    const allUsers = Array.from(buf.users.values());
    if (countBadge) countBadge.textContent = String(allUsers.length);

    const filtered = allUsers.filter(u => u.nick.toLowerCase().includes(filterVal));

    const ops = filtered.filter(u => ['~', '&', '@', '%'].includes(u.prefix)).sort((a, b) => a.nick.localeCompare(b.nick));
    const voiced = filtered.filter(u => u.prefix === '+').sort((a, b) => a.nick.localeCompare(b.nick));
    const regular = filtered.filter(u => !u.prefix).sort((a, b) => a.nick.localeCompare(b.nick));

    container.innerHTML = '';

    const renderSection = (title, list, badgeClass) => {
      if (list.length === 0) return;
      const sec = document.createElement('div');
      sec.innerHTML = `<div class="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">${title} (${list.length})</div>`;
      const ul = document.createElement('div');
      ul.className = 'space-y-0.5';

      list.forEach(u => {
        const item = document.createElement('div');
        item.className = 'px-2 py-1.5 rounded-lg hover:bg-obsidian-700/80 flex items-center justify-between group cursor-pointer transition';
        item.onclick = () => this.openPrivateQuery(u.nick);
        item.innerHTML = `
          <div class="flex items-center gap-1.5 truncate">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            ${u.prefix ? `<span class="font-bold ${badgeClass}">${u.prefix}</span>` : ''}
            <span class="${this.nickColorClass(u.nick)} truncate">${this.escapeHtml(u.nick)}</span>
          </div>
          <button type="button" onclick="event.stopPropagation(); app.sendWhois('${this.escapeHtml(u.nick)}')" class="opacity-0 group-hover:opacity-100 text-[10px] px-1.5 py-0.5 rounded bg-obsidian-900 text-cyan-400 hover:bg-obsidian-600">WHOIS</button>
        `;
        ul.appendChild(item);
      });
      sec.appendChild(ul);
      container.appendChild(sec);
    };

    renderSection('Operators', ops, 'text-amber-400');
    renderSection('Voiced', voiced, 'text-cyan-400');
    renderSection('Peers', regular, 'text-slate-400');

    if (allUsers.length === 0) {
      container.innerHTML = `
        <div class="p-4 text-center text-slate-500 text-xs">
          ${buf.type === 'channel' ? 'No NAMES list loaded yet. Connect to WSS or click Refresh /NAMES.' : 'Network Console buffer.'}
        </div>
      `;
    }
  }

  handleComposerInput(val) {
    const popover = document.getElementById('slashAutocomplete');
    const listEl = document.getElementById('slashAutocompleteList');

    if (!val.startsWith('/') || val.includes(' ')) {
      popover.classList.add('hidden');
      return;
    }

    const q = val.toLowerCase();
    const matches = SLASH_COMMANDS.filter(c => c.cmd.startsWith(q));
    if (matches.length === 0) {
      popover.classList.add('hidden');
      return;
    }

    listEl.innerHTML = '';
    matches.forEach(m => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'w-full text-left px-3 py-2 hover:bg-obsidian-700 flex items-center justify-between gap-2 transition font-mono text-xs';
      row.onclick = () => {
        const input = document.getElementById('ircMessageInput');
        input.value = m.cmd + ' ';
        input.focus();
        popover.classList.add('hidden');
      };
      row.innerHTML = `
        <span class="text-cyan-400 font-bold">${m.syntax}</span>
        <span class="text-[11px] text-slate-400 truncate">${m.desc}</span>
      `;
      listEl.appendChild(row);
    });
    popover.classList.remove('hidden');
  }

  handleComposerKeydown(ev) {
    const input = ev.target;
    if (ev.key === 'Tab') {
      if (input.value.startsWith('/') && !input.value.includes(' ')) {
        ev.preventDefault();
        const match = SLASH_COMMANDS.find(c => c.cmd.startsWith(input.value.toLowerCase()));
        if (match) {
          input.value = match.cmd + ' ';
          document.getElementById('slashAutocomplete').classList.add('hidden');
        }
      }
    } else if (ev.key === 'ArrowUp') {
      if (this.state.cmdHistory.length > 0 && this.state.cmdHistoryIndex < this.state.cmdHistory.length - 1) {
        ev.preventDefault();
        this.state.cmdHistoryIndex++;
        input.value = this.state.cmdHistory[this.state.cmdHistory.length - 1 - this.state.cmdHistoryIndex];
      }
    } else if (ev.key === 'ArrowDown') {
      if (this.state.cmdHistoryIndex > 0) {
        ev.preventDefault();
        this.state.cmdHistoryIndex--;
        input.value = this.state.cmdHistory[this.state.cmdHistory.length - 1 - this.state.cmdHistoryIndex];
      } else if (this.state.cmdHistoryIndex === 0) {
        ev.preventDefault();
        this.state.cmdHistoryIndex = -1;
        input.value = '';
      }
    }
  }

  handleComposerSubmit(ev) {
    ev.preventDefault();
    const input = document.getElementById('ircMessageInput');
    const text = input.value.trim();
    if (!text) return;

    this.state.cmdHistory.push(text);
    this.state.cmdHistoryIndex = -1;
    input.value = '';
    document.getElementById('slashAutocomplete').classList.add('hidden');

    if (text.startsWith('/')) {
      this.executeSlashCommand(text);
      return;
    }

    const target = this.state.activeBuffer;
    if (target === '*status') {
      if (/^nick(\s|$)/i.test(text)) {
        this.showToast('Raw NICK command is disabled.', 'red');
        this.addSystemMessage('*status', 'Command denied: NICK changes are disabled.');
        return;
      }
      // Allow typing other raw IRC commands in *status console
      this.sendRaw(text);
      return;
    }

    if (this.sendRaw(`PRIVMSG ${target} :${text}`)) {
      // Render message immediately if server does not echo-message back
      if (!this.state.enabledCaps.has('echo-message')) {
        this.addChatMessage(target, this.state.nick, text);
      }
    }
  }

  executeSlashCommand(rawInput) {
    const parts = rawInput.slice(1).split(/\s+/);
    const cmd = (parts.shift() || '').toLowerCase();
    const rest = parts.join(' ');

    switch (cmd) {
      case 'join':
      case 'j': {
        let ch = parts[0] || '';
        if (!ch) {
          this.openJoinChannelModal();
          return;
        }
        if (!ch.startsWith('#') && !ch.startsWith('&')) ch = '#' + ch;
        this.joinOrSwitchChannel(ch);
        break;
      }

      case 'part':
      case 'leave': {
        const ch = (parts[0] && parts[0].startsWith('#')) ? parts.shift() : this.state.activeBuffer;
        const reason = parts.join(' ') || 'Leaving channel';
        if (ch.startsWith('#')) {
          this.sendRaw(`PART ${ch} :${reason}`);
        }
        break;
      }

      case 'nick': {
        this.showToast('The /nick command is disabled.', 'red');
        this.addSystemMessage(
          this.state.activeBuffer,
          'Command denied: /nick is disabled by the client policy.'
        );
        break;
      }

      case 'msg':
      case 'query': {
        const target = parts.shift();
        const message = parts.join(' ');
        if (!target || !message) {
          this.showToast('Usage: /msg <target> <message>', 'amber');
          return;
        }
        this.ensureBuffer(target, target.startsWith('#') ? 'channel' : 'query');
        this.switchBuffer(target);
        if (this.sendRaw(`PRIVMSG ${target} :${message}`)) {
          if (!this.state.enabledCaps.has('echo-message')) {
            this.addChatMessage(target, this.state.nick, message);
          }
        }
        break;
      }

      case 'me': {
        if (!rest) return;
        const target = this.state.activeBuffer;
        if (this.sendRaw(`PRIVMSG ${target} :\x01ACTION ${rest}\x01`)) {
          if (!this.state.enabledCaps.has('echo-message')) {
            this.addChatMessage(target, this.state.nick, rest, { isAction: true });
          }
        }
        break;
      }

      case 'whois': {
        const targetNick = parts[0] || this.state.nick;
        this.sendWhois(targetNick);
        break;
      }

      case 'topic': {
        const ch = this.state.activeBuffer;
        if (!rest) {
          this.sendRaw(`TOPIC ${ch}`);
        } else {
          this.sendRaw(`TOPIC ${ch} :${rest}`);
        }
        break;
      }

      case 'names': {
        const ch = parts[0] || this.state.activeBuffer;
        this.sendRaw(`NAMES ${ch}`);
        break;
      }

      case 'list': {
        this.requestServerList();
        break;
      }

      case 'history': {
        this.fetchChannelHistory(parseInt(parts[0] || '40', 10));
        break;
      }

      case 'ticker': {
        const sym = (parts[0] || 'PI').toUpperCase();
        this.shareTickerToChannel(sym);
        break;
      }

      case 'dev':
      case 'author': {
        this.openDeveloperModal();
        break;
      }

      case 'ping': {
        this.sendRawPing();
        this.showToast('Sent PING frame to IRC server', 'cyan');
        break;
      }

      case 'raw':
      case 'quote': {
        if (/^nick(\s|$)/i.test(rest.trim())) {
          this.showToast('Raw NICK command is disabled.', 'red');
          this.addSystemMessage(
            this.state.activeBuffer,
            'Command denied: Raw NICK changes are disabled.'
          );
          break;
        }
        if (rest) this.sendRaw(rest);
        break;
      }

      case 'clear': {
        const buf = this.ensureBuffer(this.state.activeBuffer);
        buf.messages = [];
        document.getElementById('messageScrollContainer').innerHTML = '';
        break;
      }

      case 'help':
      default: {
        const helpLines = SLASH_COMMANDS.map(c => `${c.syntax} — ${c.desc}`).join(' | ');
        this.addSystemMessage(this.state.activeBuffer, `Available IRC Commands: ${helpLines}`);
        break;
      }
    }
  }

  /**
   * Spawns a REAL 2nd independent WebSocket connection to the exact same remote IRC server
   * so the user can immediately verify live server round-trip routing in any channel!
   */
  toggleLivePeerBot() {
    const led = document.getElementById('peerBotLed');
    const label = document.getElementById('peerBotLabel');

    if (this.peerWs && this.peerConnected) {
      try { this.peerWs.send('QUIT :Peer verifier closing'); this.peerWs.close(); } catch (e) {}
      this.peerWs = null;
      this.peerConnected = false;
      led.className = 'w-2 h-2 rounded-full bg-slate-500';
      label.textContent = 'Spawn 2nd Live WSS Peer';
      this.showToast('Closed 2nd live WebSocket peer session', 'amber');
      return;
    }

    const url = this.state.serverUrl.trim();
    this.showToast(`Connecting 2nd live WebSocket peer (${this.peerNick}) to ${url}...`, 'cyan');
    led.className = 'w-2 h-2 rounded-full bg-amber-400 led-pulse';
    label.textContent = `Connecting ${this.peerNick}...`;

    try {
      this.peerWs = this.state.subprotocolMode === 'ircv3'
        ? new WebSocket(url, ['text.ircv3.net', 'binary.ircv3.net'])
        : new WebSocket(url);
    } catch (e) {
      this.showToast('Could not spawn 2nd WebSocket peer', 'red');
      return;
    }

    this.peerWs.addEventListener('open', () => {
      this.peerConnected = true;
      this.peerWs.send(`NICK ${this.peerNick}`);
      this.peerWs.send(`USER peerbot 0 * :NEXUS Live WSS Verification Peer`);
    });

    this.peerWs.addEventListener('message', async (ev) => {
      const data = typeof ev.data === 'string' ? ev.data : await ev.data.text();
      const lines = data.split(/\r?\n/);
      for (const line of lines) {
        if (line.startsWith('PING')) {
          const tok = line.split(' ')[1] || ':keepalive';
          this.peerWs.send(`PONG ${tok}`);
        } else if (line.includes(' 001 ')) {
          led.className = 'w-2 h-2 rounded-full bg-emerald-400 led-pulse';
          label.textContent = `Peer Online: ${this.peerNick}`;
          const targetChan = this.state.activeBuffer.startsWith('#') ? this.state.activeBuffer : '#latinchain';
          this.peerWs.send(`JOIN ${targetChan}`);
          setTimeout(() => {
            const piPrice = this.tickers.PI.price ? `$${this.tickers.PI.price}` : 'live';
            const btcPrice = this.tickers.BTC.price ? `$${this.tickers.BTC.price}` : 'live';
            this.peerWs.send(`PRIVMSG ${targetChan} :[LIVE WSS PEER] Hello ${this.state.nick}! I am connected via a 2nd real WebSocket to ${this.state.serverUrl}. Mention "${this.peerNick}", type "!pi" or "!price" to test real IRC routing! (PI: ${piPrice} | BTC: ${btcPrice})`);
          }, 700);
        } else if (line.includes('PRIVMSG')) {
          // If user mentions peerNick or types !price / !pi, respond over the real IRC server
          const trailIdx = line.indexOf(' :');
          const msgContent = trailIdx !== -1 ? line.slice(trailIdx + 2) : '';
          const chanMatch = line.match(/PRIVMSG\s+(#[a-zA-Z0-9_-]+)/i);
          if (chanMatch && !line.startsWith(`:${this.peerNick}!`)) {
            const replyChan = chanMatch[1];
            const cleanMsg = msgContent.trim().toLowerCase();
            if (cleanMsg.includes(this.peerNick.toLowerCase()) || cleanMsg === '!price' || cleanMsg === '!pi') {
              const summary = Object.entries(this.tickers)
                .map(([k, v]) => `${k}: $${v.price || '--'}`)
                .join(' | ');
              setTimeout(() => {
                if (this.peerWs && this.peerWs.readyState === WebSocket.OPEN) {
                  this.peerWs.send(`PRIVMSG ${replyChan} :[PI & CRYPTO ORACLE via IRC] Live Snapshot -> ${summary}`);
                }
              }, 450);
            }
          }
        }
      }
    });

    this.peerWs.addEventListener('close', () => {
      this.peerConnected = false;
      led.className = 'w-2 h-2 rounded-full bg-slate-500';
      label.textContent = 'Spawn 2nd Live WSS Peer';
    });
  }

  /**
   * Connects to CoinGecko REST + Kraken public WebSocket v2 (`wss://ws.kraken.com/v2`)
   * to display real-time PI (Pi Network), BTC, ETH, SOL, and XMR prices in the top bar.
   */
  initCryptoMarketStream() {
    const fetchSpotPrices = () => {
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=pi-network,bitcoin,ethereum,solana,monero&vs_currencies=usd&include_24hr_change=true')
        .then(r => r.json())
        .then(data => {
          if (data['pi-network']) this.updateTickerUI('PI', data['pi-network'].usd, data['pi-network'].usd_24h_change);
          if (data.bitcoin) this.updateTickerUI('BTC', data.bitcoin.usd, data.bitcoin.usd_24h_change);
          if (data.ethereum) this.updateTickerUI('ETH', data.ethereum.usd, data.ethereum.usd_24h_change);
          if (data.solana) this.updateTickerUI('SOL', data.solana.usd, data.solana.usd_24h_change);
          if (data.monero) this.updateTickerUI('XMR', data.monero.usd, data.monero.usd_24h_change);
        })
        .catch(() => {});
    };

    // Initial REST fetch and periodic refresh for Pi Network & Crypto spot prices
    fetchSpotPrices();
    setInterval(fetchSpotPrices, 45000);

    // Live WebSocket stream from Kraken Public WS
    try {
      this.krakenWs = new WebSocket('wss://ws.kraken.com/v2');
      this.krakenWs.addEventListener('open', () => {
        this.krakenWs.send(JSON.stringify({
          method: 'subscribe',
          params: {
            channel: 'ticker',
            symbol: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'XMR/USD']
          }
        }));
      });
      this.krakenWs.addEventListener('message', (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.channel === 'ticker' && Array.isArray(msg.data)) {
            msg.data.forEach(item => {
              const sym = item.symbol.split('/')[0];
              if (this.tickers[sym]) {
                this.updateTickerUI(sym, item.last, item.change_pct);
              }
            });
          }
        } catch (e) {}
      });
    } catch (e) {}
  }

  updateTickerUI(sym, price, changePct) {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return;
    const formattedPrice = numPrice >= 100
      ? numPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : (numPrice < 1 ? numPrice.toFixed(4) : numPrice.toFixed(2));

    this.tickers[sym].price = formattedPrice;
    const priceEl = document.getElementById(`price-${sym}`);
    if (priceEl) priceEl.textContent = `$${formattedPrice}`;

    if (changePct !== undefined && changePct !== null) {
      const numChg = Number(changePct);
      this.tickers[sym].change24h = numChg.toFixed(2);
      const chgEl = document.getElementById(`chg-${sym}`);
      if (chgEl) {
        const sign = numChg >= 0 ? '+' : '';
        chgEl.textContent = `${sign}${numChg.toFixed(2)}%`;
        chgEl.className = `text-[10px] tabular-nums ${numChg >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
      }
    }
  }

  shareTickerToChannel(sym) {
    const t = this.tickers[sym];
    const priceStr = t && t.price ? `$${t.price} (${t.change24h >= 0 ? '+' : ''}${t.change24h || '0.00'}%)` : 'fetching...';
    const target = this.state.activeBuffer;
    const payload = `📊 [$${sym}/USD Live Spot] ${priceStr} — via NEXUS//IRC`;

    if (this.state.connected && target !== '*status') {
      if (this.sendRaw(`PRIVMSG ${target} :${payload}`)) {
        if (!this.state.enabledCaps.has('echo-message')) {
          this.addChatMessage(target, this.state.nick, payload);
        }
      }
    } else {
      const input = document.getElementById('ircMessageInput');
      input.value = payload;
      input.focus();
    }
  }

  joinOrSwitchChannel(chanName) {
    const clean = chanName.startsWith('#') ? chanName : `#${chanName}`;
    const buf = this.ensureBuffer(clean, 'channel');
    if (this.state.connected && !buf.joined) {
      this.sendRaw(`JOIN ${clean}`);
    }
    this.switchBuffer(clean);
  }

  partAndCloseBuffer(bufferName) {
    const buf = this.state.buffers[bufferName.toLowerCase()];
    if (!buf || buf.type === 'server') return;
    if (buf.type === 'channel' && buf.joined && this.state.connected) {
      this.sendRaw(`PART ${buf.name} :Closed buffer`);
    }
    delete this.state.buffers[bufferName.toLowerCase()];
    if (this.state.activeBuffer.toLowerCase() === bufferName.toLowerCase()) {
      const remaining = Object.values(this.state.buffers);
      this.switchBuffer(remaining.length > 0 ? remaining[0].name : '*status');
    } else {
      this.renderAllBufferLists();
    }
  }

  openPrivateQuery(targetNick) {
    if (!targetNick || targetNick.toLowerCase() === this.state.nick.toLowerCase()) return;
    this.ensureBuffer(targetNick, 'query', `Direct PRIVMSG session with ${targetNick}`);
    this.switchBuffer(targetNick);
  }

  sendWhois(targetNick) {
    this.sendRaw(`WHOIS ${targetNick}`);
    this.showToast(`Requested WHOIS for ${targetNick}`, 'cyan');
  }

  sendNamesRefresh() {
    if (this.state.activeBuffer.startsWith('#')) {
      this.sendRaw(`NAMES ${this.state.activeBuffer}`);
    }
  }

  fetchChannelHistory(count = 40) {
    if (!this.state.activeBuffer.startsWith('#')) return;
    if (this.state.enabledCaps.has('chathistory')) {
      this.sendRaw(`CHATHISTORY LATEST ${this.state.activeBuffer} * ${count}`);
      this.showToast(`Requested last ${count} messages from IRCv3 server`, 'cyan');
    } else {
      this.showToast('Connected server does not advertise IRCv3 chathistory capability', 'amber');
    }
  }

  requestServerList() {
    document.getElementById('listModal').classList.remove('hidden');
    if (this.state.connected) {
      this.sendRaw('LIST');
    } else {
      this.renderServerChannelList();
    }
  }

  renderServerChannelList() {
    const tbody = document.getElementById('serverListTableBody');
    if (!tbody) return;
    const q = (document.getElementById('listSearchInput')?.value || '').toLowerCase();

    const combined = [...this.state.serverChannelsList];
    CRYPTO_CHANNEL_DIRECTORY.forEach(c => {
      if (!combined.some(x => x.name.toLowerCase() === c.name.toLowerCase())) {
        combined.push({ name: c.name, count: 1, topic: c.defaultTopic });
      }
    });

    const filtered = combined
      .filter(item => item.name.toLowerCase().includes(q) || (item.topic || '').toLowerCase().includes(q))
      .sort((a, b) => b.count - a.count);

    tbody.innerHTML = '';
    filtered.forEach(item => {
      const row = document.createElement('div');
      row.className = 'p-2.5 hover:bg-obsidian-700/60 flex items-center justify-between gap-3 rounded-lg transition';
      row.innerHTML = `
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-bold text-cyan-400">${this.escapeHtml(item.name)}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-obsidian-900 text-emerald-400">${item.count} peers</span>
          </div>
          <div class="text-[11px] text-slate-400 truncate">${this.escapeHtml(item.topic || 'No topic set')}</div>
        </div>
        <button type="button" onclick="app.joinOrSwitchChannel('${this.escapeHtml(item.name)}'); app.closeListModal();" class="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold shrink-0">
          JOIN
        </button>
      `;
      tbody.appendChild(row);
    });
  }

  logRawFrame(direction, line) {
    const container = document.getElementById('rawWireLogContainer');
    if (!container) return;
    const div = document.createElement('div');
    const isOut = direction === '>>';
    div.className = `flex items-start gap-2 ${isOut ? 'text-amber-300' : 'text-emerald-300'}`;
    div.innerHTML = `
      <span class="text-slate-500 shrink-0">[${this.formatTimestamp(new Date())}]</span>
      <span class="font-bold shrink-0">${direction}</span>
      <span class="break-all">${this.escapeHtml(line)}</span>
    `;
    container.appendChild(div);
    if (container.children.length > 250) container.removeChild(container.firstChild);
    container.scrollTop = container.scrollHeight;
  }

  clearRawWire() {
    const container = document.getElementById('rawWireLogContainer');
    if (container) container.innerHTML = '';
  }

  toggleRawWirePanel() {
    const panel = document.getElementById('rawWirePanel');
    panel.classList.toggle('hidden');
  }

  removeNickFromAllPeerLists(oldNick, replacementNick = null) {
    if (!oldNick) return;
    const oldKey = oldNick.toLowerCase();
    if (!replacementNick || oldKey !== replacementNick.toLowerCase()) {
      this.state.previousNicks.add(oldKey);
    }
    Object.values(this.state.buffers).forEach(buf => {
      if (!buf.users) return;
      if (buf.users.has(oldKey)) {
        const existing = buf.users.get(oldKey);
        buf.users.delete(oldKey);
        if (replacementNick && buf.joined) {
          buf.users.set(replacementNick.toLowerCase(), {
            nick: replacementNick,
            prefix: existing ? existing.prefix : ''
          });
        }
      }
    });
  }

  updateOwnNickname(newNick) {
    const prevNick = this.state.nick;
    if (prevNick && prevNick.toLowerCase() !== newNick.toLowerCase()) {
      this.removeNickFromAllPeerLists(prevNick, newNick);
    }
    if (this.state.pendingNick && this.state.pendingNick.toLowerCase() !== newNick.toLowerCase()) {
      this.removeNickFromAllPeerLists(this.state.pendingNick, newNick);
    }
    this.state.previousNicks.delete(newNick.toLowerCase());

    // Ensure any remaining entries matching previousNicks are purged from all channel peer lists
    Object.values(this.state.buffers).forEach(buf => {
      if (!buf.users) return;
      this.state.previousNicks.forEach(oldLower => {
        if (oldLower !== newNick.toLowerCase()) {
          buf.users.delete(oldLower);
        }
      });
      if (buf.joined && buf.type === 'channel' && !buf.users.has(newNick.toLowerCase())) {
        buf.users.set(newNick.toLowerCase(), { nick: newNick, prefix: '' });
      }
    });

    this.state.nick = newNick;
    this.state.pendingNick = null;
    try {
      //localStorage.setItem(STORAGE_KEYS.NICK, newNick);
    } catch (e) {}
    document.getElementById('sidebarNickDisplay').textContent = `nick: ${newNick}`;
    document.getElementById('composerNickBadge').textContent = newNick;
    document.getElementById('inputNickname').value = newNick;
    this.renderUserList();
  }

  updateConnectionStatusUI(label, color) {
    const topState = document.getElementById('topConnState');
    const topLed = document.getElementById('topLed');
    const topServer = document.getElementById('topServerBadge');
    const btnText = document.getElementById('btnConnectText');
    const btnToggle = document.getElementById('btnConnectToggle');

    if (topState) topState.textContent = label;
    if (topServer) topServer.textContent = this.state.serverUrl;

    const colorMap = {
      emerald: 'bg-emerald-400 led-pulse',
      amber: 'bg-amber-400 led-pulse',
      cyan: 'bg-cyan-400 led-pulse',
      red: 'bg-rose-500'
    };
    if (topLed) topLed.className = `w-2 h-2 rounded-full ${colorMap[color] || colorMap.amber}`;

    if (this.state.connected || this.state.connecting) {
      btnText.textContent = 'Disconnect';
      btnToggle.className = 'flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-rose-600/80 hover:bg-rose-500 text-white shadow transition';
    } else {
      btnText.textContent = 'Connect WSS';
      btnToggle.className = 'flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow transition';
    }
  }

  toggleConnection() {
    if (this.state.connected || this.state.connecting) {
      if (this.ws) {
        try { this.sendRaw('QUIT :Disconnecting from NEXUS//IRC'); this.ws.close(); } catch (e) {}
      }
    } else {
      this.connect();
    }
  }

  handleConnectionError(msg) {
    this.updateConnectionStatusUI('ERROR', 'red');
    this.addSystemMessage('*status', msg);
    this.showToast(msg, 'red');
  }

  toggleLeftDrawer() {
    const left = document.getElementById('leftDrawer');
    const right = document.getElementById('rightDrawer');
    const backdrop = document.getElementById('mobileBackdrop');
    right.classList.add('translate-x-full');
    left.classList.toggle('-translate-x-full');
    backdrop.classList.toggle('hidden', left.classList.contains('-translate-x-full'));
  }

  toggleRightDrawer() {
    const left = document.getElementById('leftDrawer');
    const right = document.getElementById('rightDrawer');
    const backdrop = document.getElementById('mobileBackdrop');
    left.classList.add('-translate-x-full');
    right.classList.toggle('translate-x-full');
    backdrop.classList.toggle('hidden', right.classList.contains('translate-x-full'));
  }

  closeDrawers() {
    document.getElementById('leftDrawer').classList.add('-translate-x-full');
    document.getElementById('rightDrawer').classList.add('translate-x-full');
    document.getElementById('mobileBackdrop').classList.add('hidden');
  }

  openConnectModal() {
    document.getElementById('connectModal').classList.remove('hidden');
  }
  closeConnectModal() {
    document.getElementById('connectModal').classList.add('hidden');
  }
  closeListModal() {
    document.getElementById('listModal').classList.add('hidden');
  }
  openJoinChannelModal() {
    document.getElementById('joinModal').classList.remove('hidden');
    setTimeout(() => document.getElementById('joinTargetInput').focus(), 50);
  }
  closeJoinChannelModal() {
    document.getElementById('joinModal').classList.add('hidden');
  }
  openGatewayModal() {
    document.getElementById('gatewayModal').classList.remove('hidden');
  }
  closeGatewayModal() {
    document.getElementById('gatewayModal').classList.add('hidden');
  }
  openDeveloperModal() {
    document.getElementById('developerModal').classList.remove('hidden');
  }
  closeDeveloperModal() {
    document.getElementById('developerModal').classList.add('hidden');
  }
  shareDeveloperInfoToChannel() {
    const target = this.state.activeBuffer;
    const msg = '⚡ Developer: César (OpenSource Expert) Cordero Rodríguez | LatinChain: https://latinchain.pinet.com | For contracts: https://rockcesar.github.io#contact | Code (AGPLv3): https://github.com/rockcesar/rockcesar.github.io/tree/main/chatirc';
    if (this.state.connected && target !== '*status') {
      if (this.sendRaw(`PRIVMSG ${target} :${msg}`)) {
        if (!this.state.enabledCaps.has('echo-message')) {
          this.addChatMessage(target, this.state.nick, msg);
        }
      }
      this.closeDeveloperModal();
      this.showToast(`Broadcasted Developer & LatinChain info to ${target}`, 'emerald');
    } else {
      this.addSystemMessage(target, msg);
      this.closeDeveloperModal();
    }
  }

  handleServerPresetChange(val) {
    if (val === 'custom') return;
    const [url, proto] = val.split('|');
    document.getElementById('inputServerUrl').value = url;
    document.getElementById('inputSubprotocol').value = proto || 'ircv3';
  }

  saveAndReconnect() {
    const url = document.getElementById('inputServerUrl').value.trim();
    const proto = document.getElementById('inputSubprotocol').value;
    const nick = document.getElementById('inputNickname').value.trim() || this.state.nick;
    const user = document.getElementById('inputUsername').value.trim() || 'cryptonode';
    const autoChans = document.getElementById('inputAutoChannels').value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const oldNick = this.state.nick;
    this.state.serverUrl = url;
    this.state.subprotocolMode = proto;
    this.state.usedFallbackSubprotocol = false;
    this.state.pendingNick = nick;
    this.updateOwnNickname(nick);
    if (oldNick && oldNick.toLowerCase() !== nick.toLowerCase()) {
      this.removeNickFromAllPeerLists(oldNick, nick);
    }
    this.state.username = user;
    try {
      localStorage.setItem(STORAGE_KEYS.USERNAME, user);
    } catch (e) {}
    this.state.autoChannels = autoChans;

    this.closeConnectModal();
    this.connect();
  }

  handleJoinSubmit(ev) {
    ev.preventDefault();
    const val = document.getElementById('joinTargetInput').value.trim();
    if (!val) return;
    document.getElementById('joinTargetInput').value = '';
    this.closeJoinChannelModal();
    if (val.startsWith('#')) {
      this.joinOrSwitchChannel(val);
    } else {
      this.openPrivateQuery(val);
    }
  }

  insertCommandPrefix(prefix) {
    const input = document.getElementById('ircMessageInput');
    input.value = prefix;
    input.focus();
    this.handleComposerInput(prefix);
  }

  insertNickMention(nick) {
    const input = document.getElementById('ircMessageInput');
    const cur = input.value;
    input.value = cur ? `${cur} ${nick}: ` : `${nick}: `;
    input.focus();
  }

  showTopicInspect() {
    const buf = this.ensureBuffer(this.state.activeBuffer);
    this.showToast(`${buf.name} Topic: ${buf.topic || 'None'}`, 'cyan');
  }

  bindScrollListener() {
    const container = document.getElementById('messageScrollContainer');
    const btn = document.getElementById('scrollToBottomBtn');
    container.addEventListener('scroll', () => {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      btn.classList.toggle('hidden', isNearBottom);
    });
  }

  scrollToBottom(force = false) {
    const container = document.getElementById('messageScrollContainer');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
    if (force) {
      document.getElementById('scrollToBottomBtn').classList.add('hidden');
    }
  }

  showToast(message, tone = 'cyan') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    const toneClasses = {
      emerald: 'border-emerald-500/50 bg-obsidian-800 text-emerald-300',
      amber: 'border-amber-500/50 bg-obsidian-800 text-amber-300',
      red: 'border-rose-500/50 bg-obsidian-800 text-rose-300',
      cyan: 'border-cyan-500/50 bg-obsidian-800 text-cyan-300'
    };
    toast.className = `px-3.5 py-2 rounded-xl border shadow-xl font-mono text-xs transition-all duration-300 ${toneClasses[tone] || toneClasses.cyan}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

async function getUserData() {
    let count_complete=0;
    
    while(startCommonAppsAIVars.pi_user_id == "" || startCommonAppsAIVars.pi_user_code == "")
    {
        await delayAsync(1000);
        
        count_complete+=1;
        
        if(count_complete >= 30 || (startCommonAppsAIVars.pi_user_id != "" && startCommonAppsAIVars.pi_user_code != ""))
            break;
        
        alert("1");
    }
    
    if(startCommonAppsAIVars.pi_user_id != "" && startCommonAppsAIVars.pi_user_code != "")
    {
        try {
          localStorage.setItem(STORAGE_KEYS.NICK, startCommonAppsAIVars.pi_user_code);
          
          return true;
        } catch (e) {}
        
        return false;
    }
    
    return false;
}

// Boot application on window load
let app;
window.addEventListener('DOMContentLoaded', () => {
  (async () => {
    let userDataVar = await getUserData();
    
    if(userDataVar)
    {
        app = new IRCClientApp();
        app.init();
    }
  })();
});
