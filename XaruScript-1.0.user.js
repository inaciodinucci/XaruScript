// ==UserScript==
// @name        XaruScript
// @namespace   XaruScript
// @match       https://www.habblet.city/hotel*
// @grant       none
// @version     1.0
// @author      inaciodinucci
// ==/UserScript==

function listen(i) {
    i = i || console.log;
    let e = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data"),
        t = e.get;
    e.get = function i() {
        if (!(this.currentTarget instanceof WebSocket)) return t.call(this);
        let e = t.call(this);
        return Object.defineProperty(this, "data", { value: e }), window.i({ data: e, t: this.currentTarget, event: this });
    };
    Object.defineProperty(MessageEvent.prototype, "data", e);
}

class RoomUnitEvent {
    static parse(h) {
        for (let e = h.l(); e > 0; e--) {
            let t = h.l(),
                e = h.o(),
                i = h.o(),
                n = h.o(),
                s = h.l(),
                a = h.l(),
                l = h.l(),
                d = parseFloat(h.o()),
                o = h.l(),
                r = h.l(),
                c = null;
            if (1 == r)
                c = {
                    group: {},
                    parse() {
                        this.h = h.o();
                        this.group.id = h.l();
                        this.group.status = h.l();
                        this.group.name = h.o();
                        h.o();
                        this.v = h.l();
                        this.p = h.u();
                    }
                };
            else if (4 == r)
                c = {
                    m: [],
                    parse() {
                        this.h = h.o();
                        this.g = h.l();
                        this.k = h.o();
                        let i = h.l();
                        for (let e = 0; e < i; e++) this.m.push(h.A());
                    }
                };
            else if (2 == r)
                c = {
                    parse() {
                        this.U = h.l().toString();
                        this.g = h.l();
                        this.k = h.o();
                        this.P = h.l();
                        this.T = h.u();
                        this.B = h.u();
                        this.X = h.u();
                        this.H = h.u();
                        this.j = h.u();
                        this.D = h.u();
                        this.R = h.l();
                        this.S = h.o();
                    }
                };
            else {
                console.log(`Error! UnitType => ${r}`);
                return;
            }
            c.id = t;
            c.type = r;
            c.username = e;
            c.Z = i;
            c.L = n;
            c.V = s;
            c.x = a;
            c.y = l;
            c.z = d;
            c.targetX = a;
            c.targetY = l;
            c.Y = d;
            c.G = o;
            c.N = o;
            c.parse(h);
            let w;
            window.J.F.W.find((e, i) => (w = i, e.id == t))
                ? window.J.F.W[w] = c
                : window.J.F.W.push(c);
        }
    }
}

class BinaryReader {
    constructor(e) {
        this.M = e;
        this.view = new DataView(e);
        this.offset = 0;
    }
    l() {
        let e = this.view.getInt32(this.offset);
        this.offset += 4;
        return e;
    }
    A() {
        let e = this.view.getInt16(this.offset);
        this.offset += 2;
        return e;
    }
    u() {
        return !!this.M[this.offset++];
    }
    o() {
        let e = this.A(),
            i = (new TextDecoder).decode(this.M.slice(this.offset, this.offset + e));
        this.offset += e;
        return i;
    }
}

class BinaryWriter {
    constructor(e) {
        this.M = [];
        this.offset = 0;
        this.C(0);
        this.q(e);
    }
    C(e) {
        this.M[this.offset++] = (e >> 24) & 255;
        this.M[this.offset++] = (e >> 16) & 255;
        this.M[this.offset++] = (e >> 8) & 255;
        this.M[this.offset++] = e & 255;
        return this;
    }
    q(e) {
        this.M[this.offset++] = (e >> 8) & 255;
        this.M[this.offset++] = e & 255;
        return this;
    }
    I(e) {
        let i = (new TextEncoder).encode(e);
        this.q(i.length);
        for (let e = 0; e < i.length; e++) {
            this.M[this.offset + e] = i[e];
        }
        this.offset += i.length;
        return this;
    }
    K() {
        this.offset = 0;
        this.C(this.M.length - 4);
        return new Uint8Array(this.M).buffer;
    }
}

const sleep = i => new Promise(e => setTimeout(e, i));


async function main() {
    let styleEl = document.createElement("style");
    styleEl.innerHTML = `
  .habobba-icon {
      background-image: url(data:image/webp;base64,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);
      width: 42px;
      height: 42px;
      background-size: cover;
      border-radius: 6px;
  }
  /* RaveConfig Menu Styles */
  .rave-config-menu {
      background: #333;
      color: #fff;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.6);
      position: absolute;
      z-index: 402;
      width: 320px;
      font-family: sans-serif;
      font-size: 14px;
      display: none;
  }
  .rave-option {
      padding: 8px;
      cursor: pointer;
      border-radius: 4px;
      background: #444;
      margin-bottom: 5px;
      text-align: center;
  }
  .rave-option:hover {
      background: #555;
  }
  /* Custom Settings Panel */
  #custom-settings {
      margin-top: 10px;
      background: #222;
      padding: 10px;
      border-radius: 4px;
  }
  /* Container for available swatches – horizontal scroll (using flex) */
  #custom-swatch-container {
      display: flex;
      flex-direction: row;
      overflow-x: auto;
      gap: 5px;
      margin-top: 5px;
  }
  .custom-swatch {
      width: 20px;
      height: 20px;
      cursor: pointer;
      border: 2px solid transparent;
      border-radius: 4px;
  }
  .custom-swatch.selected {
      border-color: #fff;
  }
  /* Container to show the selected sequence with numbering */
  #custom-selected-sequence {
      margin-top: 10px;
      min-height: 40px;
      border: 1px solid #555;
      padding: 5px;
      display: flex;
      gap: 5px;
      align-items: center;
  }
  .sequence-item {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 2px solid #fff;
      position: relative;
      flex-shrink: 0;
      cursor: pointer;
  }
  .sequence-item span {
      position: absolute;
      top: -8px;
      right: -8px;
      background: red;
      color: #fff;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      font-size: 10px;
      line-height: 16px;
      text-align: center;
  }
  /* Save button styling */
  #save-custom-sequence {
      background: green;
      color: white;
      border: none;
      padding: 5px 10px;
      margin-top: 10px;
      cursor: pointer;
      border-radius: 4px;
  }
  .btn-secondary {
      width: 100%; /* Make buttons take full width of their container */
  }
  
  /* Estilos para o botão de engrenagem */
  .xaru-gear-button {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
  }
  
  .xaru-gear-icon {
      width: 32px;
      height: 32px;
      background-color: #333;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      transition: transform 0.3s ease;
  }
  
  .xaru-gear-icon:hover {
      transform: rotate(45deg);
      background-color: #555;
  }
  
  .xaru-gear-text {
      margin-top: 5px;
      font-size: 11px;
      font-weight: bold;
      font-family: 'Arial', 'Helvetica', sans-serif;
      color: white;
      text-shadow: 0px 1px 2px rgba(0,0,0,0.8);
      letter-spacing: 0.5px;
  }
  
  /* Estilos para categorias colapsáveis */
  .category-header {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 5px 0;
  }
  
  .category-header:hover .header-text {
      color: #0275d8;
  }
  
  .category-toggle {
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid #444;
      margin-right: 8px;
      transition: transform 0.2s ease;
  }
  
  .category-toggle.collapsed {
      transform: rotate(-90deg);
  }
  
  .category-content {
      overflow: hidden;
      max-height: 1000px;
      transition: max-height 0.3s ease;
  }
  
  .category-content.collapsed {
      max-height: 0;
  }

  /* Removendo a fonte pixelizada que não será mais usada */
  /* @font-face {
      font-family: 'Pixelated';
      src: url('data:font/woff2;base64,...');
      font-weight: normal;
      font-style: normal;
  } */
  `;
    document.head.appendChild(styleEl);

    // Criar o botão de engrenagem
    const gearButton = document.createElement("div");
    gearButton.className = "xaru-gear-button";
    gearButton.innerHTML = `
        <div class="xaru-gear-icon">⚙️</div>
        <div class="xaru-gear-text">XaruScript</div>
    `;
    document.body.appendChild(gearButton);

    // Criar janela de sniffer de OPCODEs
    const opcodeSniffer = document.createElement("div");
    opcodeSniffer.className = "position-absolute draggable-window";
    opcodeSniffer.style.cssText = "z-index: 402; top: 50px; right: 50px; display: none; visibility: hidden;";
    opcodeSniffer.innerHTML = `
        <div class="d-flex overflow-hidden position-relative flex-column nitro-card theme-primary-slim nitro-room-construction-tool" style="background-color: #000;">
            <div class="d-flex position-relative flex-column gap-2 align-items-center justify-content-center drag-handler container-fluid nitro-card-header" style="background-color: #111;">
                <div class="d-flex w-100 align-items-center justify-content-center">
                    <span class="nitro-card-header-text" style="color: #fff;">Sniffer de OPCODEs</span>
                    <div class="position-absolute end-0 nitro-card-header-close" style="color: #fff; font-weight: bold;"></div>
                </div>
            </div>
            <div id="opcode-log" style="background-color: #000; color: #ddd; font-family: monospace; height: 300px; width: 400px; overflow-y: auto; padding: 10px; font-size: 12px; user-select: text;">
                <div>Logs de OPCODEs aparecerão aqui...</div>
            </div>
            <div class="d-flex justify-content-between p-2" style="background-color: #111;">
                <button id="clear-opcode-log" class="btn btn-sm btn-danger">Limpar</button>
                <button id="copy-opcode-log" class="btn btn-sm btn-primary">Copiar Logs</button>
                <div>
                    <label style="color: #fff;"><input type="checkbox" id="auto-scroll" checked> Auto-scroll</label>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(opcodeSniffer);

    // Função para adicionar log ao sniffer
    window.addOpcodeLog = function(direction, opcode, data) {
        if (!document.getElementById('opcode-log')) return;
        
        const logItem = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString();
        let extraInfo = '';
        
        // Tenta extrair informações adicionais para OPCODEs conhecidos
        if (data) {
            try {
                if (opcode === 1314) {
                    extraInfo = ` [CHAT] "${data.substring(0, 50)}${data.length > 50 ? '...' : ''}"`;
                } else if (opcode === 2080) {
                    extraInfo = ' [MOVIMENTO/AUSÊNCIA]';
                } else if (opcode === 2730) {
                    extraInfo = ' [COPY]';
                } else if (opcode === 1597) {
                    extraInfo = ' [DIGITANDO]';
                } else if (opcode === 1778) {
                    extraInfo = ' [MOBÍLIA]';
                } else if (opcode === 3860) {
                    extraInfo = ' [POSSÍVEL MOVIMENTO]';
                }
            } catch (e) {}
        }
        
        logItem.className = direction === 'ENVIADO' ? 'text-success' : 'text-info';
        logItem.innerHTML = `<span class="text-secondary">[${timestamp}]</span> <strong>${direction}</strong>: OPCODE ${opcode}${extraInfo}`;
        
        const logContainer = document.getElementById('opcode-log');
        logContainer.appendChild(logItem);
        
        // Auto-scroll
        if (document.getElementById('auto-scroll').checked) {
            logContainer.scrollTop = logContainer.scrollHeight;
        }
        
        // Limitar número de logs para evitar sobrecarga de memória
        while (logContainer.children.length > 500) {
            logContainer.removeChild(logContainer.firstChild);
        }
    };

    // Configurar manipulador de fechamento e arrasto do Sniffer
    const snifferHeader = opcodeSniffer.querySelector('.drag-handler');
    const closeSnifferBtn = opcodeSniffer.querySelector('.nitro-card-header-close');
    let isDraggingSniffer = false;
    let snifferOffsetX = 0, snifferOffsetY = 0;

    closeSnifferBtn.addEventListener('click', () => {
        opcodeSniffer.style.display = 'none';
        opcodeSniffer.style.visibility = 'hidden';
    });

    snifferHeader.addEventListener('mousedown', e => {
        isDraggingSniffer = true;
        const rect = opcodeSniffer.getBoundingClientRect();
        snifferOffsetX = e.clientX - rect.left;
        snifferOffsetY = e.clientY - rect.top;
    });

    document.addEventListener('mouseup', () => {
        isDraggingSniffer = false;
    });

    document.addEventListener('mousemove', e => {
        if (isDraggingSniffer) {
            opcodeSniffer.style.left = `${e.clientX - snifferOffsetX}px`;
            opcodeSniffer.style.top = `${e.clientY - snifferOffsetY}px`;
        }
    });

    // Limpar logs
    document.getElementById('clear-opcode-log').addEventListener('click', () => {
        const logContainer = document.getElementById('opcode-log');
        logContainer.innerHTML = '<div>Logs de OPCODEs limpos</div>';
    });
    
    // Copiar logs para a área de transferência
    document.getElementById('copy-opcode-log').addEventListener('click', () => {
        const logContainer = document.getElementById('opcode-log');
        let textToCopy = '';
        
        // Converter os logs para texto simples
        for (const child of logContainer.children) {
            textToCopy += child.textContent + '\n';
        }
        
        // Copiar para a área de transferência
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                // Mostrar mensagem de sucesso temporária
                const successMsg = document.createElement('div');
                successMsg.textContent = '✓ Logs copiados para a área de transferência!';
                successMsg.style.color = '#4caf50';
                successMsg.style.fontWeight = 'bold';
                successMsg.style.padding = '5px';
                successMsg.style.textAlign = 'center';
                
                logContainer.insertBefore(successMsg, logContainer.firstChild);
                
                // Remover a mensagem após 3 segundos
                setTimeout(() => {
                    if (successMsg.parentNode === logContainer) {
                        logContainer.removeChild(successMsg);
                    }
                }, 3000);
            })
            .catch(err => {
                console.error('Erro ao copiar logs: ', err);
                alert('Não foi possível copiar os logs. Tente selecionar e copiar manualmente.');
            });
    });

    let i = document.createElement("div");
    i.innerHTML = '<div class="cursor-pointer navigation-item icon habobba-icon"></div>';
    let t = i.children[0];

    i.innerHTML = `
<div class="position-absolute draggable-window"
    style="z-index: 401; top: calc(-290.5px + 50vh); left: calc(-127.5px + 50vw); visibility: visible;">
    <div class="d-flex overflow-hidden position-relative flex-column nitro-card theme-primary-slim nitro-room-construction-tool">
        <div class="d-flex position-relative flex-column gap-2 align-items-center justify-content-center drag-handler container-fluid nitro-card-header">
            <div class="d-flex w-100 align-items-center justify-content-center">
                <span class="nitro-card-header-text">XaruScript</span>
                <div class="position-absolute end-0 nitro-card-header-close"></div>
            </div>
        </div>
        <div class="d-flex overflow-auto flex-column gap-2 container-fluid content-area text-black content">
            <div class="line">
                <div class="category-header" data-category="pirulay">
                    <span class="category-toggle"></span>
                    <p class="header-text fw-bold">Pirulay</p>
                </div>
            </div>
            <div class="category-content" id="pirulay-category">
                <div class="d-flex gap-2 align-items-center justify-content-between">
                    <div class="d-flex gap-2 align-items-center">
                        <label class="switch">
                            <input id="command-copy" type="checkbox">
                            <span class="slider"></span>
                        </label>
                        <div class="d-inline text-black option-name">Comando :copy</div>
                    </div>
                </div>
            </div>
            
            <div class="line">
                <div class="category-header" data-category="privacidade">
                    <span class="category-toggle"></span>
                    <p class="header-text fw-bold">Privacidade</p>
                </div>
            </div>
            <div class="category-content" id="privacidade-category">
                <div class="d-flex gap-2 align-items-center justify-content-between">
                    <div class="d-flex gap-2 align-items-center">
                        <label class="switch">
                            <input type="checkbox" id="hide-typing">
                            <span class="slider"></span>
                        </label>
                        <div class="d-inline text-black option-name">Ocultar balão digitando</div>
                    </div>
                </div>
            </div>
            
            <div class="line">
                <div class="category-header" data-category="utilidades">
                    <span class="category-toggle"></span>
                    <p class="header-text fw-bold">Utilitários / Performance</p>
                </div>
            </div>
            <div class="category-content" id="utilidades-category">
                <div class="d-flex gap-2">
                    <button id="sniff-opcodes-btn" class="btn btn-secondary w-100">Sniffar Opcodes</button>
                </div>
                <div class="d-flex gap-2 align-items-center justify-content-between">
                    <div class="d-flex gap-2 align-items-center">
                        <label class="switch">
                            <input type="checkbox" id="mute-all">
                            <span class="slider"></span>
                        </label>
                        <div class="d-inline text-black option-name">Mutar todos da sala</div>
                    </div>
                </div>
                <div class="d-flex gap-2 align-items-center justify-content-between">
                    <div class="d-flex gap-2 align-items-center">
                        <label class="switch">
                            <input type="checkbox" id="furni-render">
                            <span class="slider"></span>
                        </label>
                        <div class="d-inline text-black option-name">Não renderizar mobis da sala</div>
                    </div>
                </div>
                <div class="d-flex gap-2 align-items-center justify-content-between">
                    <div class="d-flex gap-2 align-items-center">
                        <label class="switch">
                            <input type="checkbox" id="anti-aus">
                            <span class="slider"></span>
                        </label>
                        <div class="d-inline text-black option-name">Anti ausente</div>
                    </div>
                </div>
                <div class="d-flex gap-2 align-items-center justify-content-between">
                    <div class="d-flex gap-2 align-items-center">
                        <label class="switch">
                            <input type="checkbox" id="bill-toggle">
                            <span class="slider"></span>
                        </label>
                        <div class="d-inline text-black option-name">Bill Moves</div>
                    </div>
                </div>
                <div class="d-flex gap-2 align-items-center justify-content-between">
                    <div class="d-flex gap-2 align-items-center">
                        <label class="switch">
                            <input type="checkbox" id="enables-doidex-toggle">
                            <span class="slider"></span>
                        </label>
                        <div class="d-inline text-black option-name">Enables doidex</div>
                    </div>
                </div>
            </div>
            
            <div class="line">
                <div class="category-header" data-category="xarurave">
                    <span class="category-toggle"></span>
                    <p class="header-text fw-bold">XaruRave</p>
                </div>
            </div>
            <div class="category-content" id="xarurave-category">
                <div class="d-flex gap-2">
                    <button id="rave-config-btn" class="btn btn-secondary w-100">XaruRave Config</button>
                </div>
                <div class="d-flex gap-2 align-items-center justify-content-between">
                    <div class="d-flex gap-2 align-items-center">
                        <label class="switch">
                            <input type="checkbox" id="xarurave-toggle">
                            <span class="slider"></span>
                        </label>
                        <div class="d-inline text-black option-name">XaruRave</div>
                    </div>
                </div>
                <div class="d-flex gap-2 align-items-center">
                    <label for="intervalo" class="form-label mb-0">Intervalo do XaruRave:</label>
                    <input type="number" id="intervalo" class="form-control" placeholder="Intervalo (ms)" value="100">
                </div>
            </div>
            
            <hr>
            <div>
                Status: <span style="color: #1cbf23;">Ativo</span>
            </div>
        </div>
    </div>
</div>
    `;

    // Append the floating window and icon to the appropriate containers
    let n = i.children[0],
        s = n.children[0].children[0];
    
    // Capturar todos os elementos de controle de forma segura
    // Cada elemento é buscado individualmente com verificação de existência
    const controls = {
        commandCopy: n.querySelector("#command-copy"),
        hideTyping: n.querySelector("#hide-typing"),
        muteAll: n.querySelector("#mute-all"),
        furniRender: n.querySelector("#furni-render"),
        antiAus: n.querySelector("#anti-aus"),
        xaruraveToggle: n.querySelector("#xarurave-toggle"),
        billToggle: n.querySelector("#bill-toggle"),
        enablesDoidexToggle: n.querySelector("#enables-doidex-toggle"),
        raveConfigBtn: n.querySelector("#rave-config-btn"),
        intervaloInput: n.querySelector("#intervalo"),
        sniffOpcodesBtn: n.querySelector("#sniff-opcodes-btn")
    };

    let raveMode = 'random';
    let customColors = [];
    let isXaruRaveActive = false;
    let isBillActive = false;
    let isEnablesDoidexActive = false;
    let enablesAbortController = new AbortController();
    let abortController = new AbortController();
    let billAbortController = new AbortController();

    // Array de enables para o Enables doidex
    const enablesArray = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
        51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
        61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
        71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
        81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
        91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
        101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
        111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
        121, 122, 123, 124, 125, 126, 127, 128, 129, 130,
        131, 132, 133, 134, 135, 136, 137, 138, 139, 140,
        141, 142, 143, 144, 145, 146, 147, 148, 149, 150,
        151, 152, 153, 154, 155, 156, 157, 158, 159, 160,
        161, 162, 163, 164, 165, 166, 167, 168, 169, 170,
        171, 172, 173, 174, 175, 176, 177, 178, 179, 180,
        181, 182, 183, 184, 193, 194, 195, 196, 197, 198,
        199, 200, 201, 202, 203, 204, 205, 206, 207, 208,
        209, 210, 211, 212, 213, 214, 215, 500, 501, 502,
        503, 504, 505, 506, 507, 508, 509, 510, 511, 512,
        513, 514, 515, 516, 517, 518, 519, 520, 521, 522,
        523, 524, 525, 526, 527, 528, 529, 530, 531, 532,
        533, 534, 535, 536, 537, 538, 539, 540, 541, 542,
        543, 544, 545, 546, 547, 548, 549, 550, 551, 552,
        553, 554, 555, 556, 557, 558, 559, 560, 561, 562,
        563, 564, 565, 566, 567, 568, 569, 570, 571, 572,
        573, 574, 575, 576, 577, 578, 579, 580, 581, 582,
        583, 584, 585, 586, 587, 588, 589, 590, 591, 592,
        593, 594, 595, 596, 597, 598, 599, 600, 601, 602,
        603, 604, 605, 606, 607, 608, 609, 610, 611, 612,
        613, 614, 615, 616, 617, 618, 619, 620, 621, 622,
        623, 624, 625, 626, 627, 628, 629, 630, 631, 632,
        633, 634, 635, 636, 637, 638, 639, 640, 641, 642,
        643, 644, 645, 646, 647, 648, 649, 650, 651, 652,
        653, 654, 655, 656, 657, 658, 659, 660, 661, 662,
        663, 664, 665, 666, 667, 668, 669, 670, 671, 672,
        673, 674, 675, 676, 677, 678, 679, 680, 681, 682,
        683, 684, 685, 686, 687, 688, 689, 690, 691, 692,
        693, 694, 695, 696, 697, 698, 699, 700, 701, 702,
        703, 704, 705, 706, 707, 708, 709, 710, 711, 712,
        713, 714, 715, 716, 717, 718, 719, 720, 721, 722,
        723, 724, 725, 726, 727, 728, 729, 730, 731, 732,
        733, 734, 902, 903
    ];

    // Atualizar as referências no objeto global
    window.J.elements = { 
        O: n, 
        $: controls.commandCopy, 
        _: controls.hideTyping, 
        ee: controls.muteAll, 
        ie: controls.furniRender, 
        te: controls.antiAus, 
        ve: controls.xaruraveToggle,
        be: controls.billToggle,
        de: controls.enablesDoidexToggle
    };

    // Toggle da janela flutuante ao clicar no ícone ou no botão de engrenagem
    t.onclick = toggleXaruPanel;
    gearButton.onclick = toggleXaruPanel;
    
    // Configurar os manipuladores para as categorias colapsáveis
    const categoryHeaders = n.querySelectorAll('.category-header');
    
    categoryHeaders.forEach(header => {
        const categoryName = header.getAttribute('data-category');
        const categoryContent = document.getElementById(`${categoryName}-category`);
        const toggleIcon = header.querySelector('.category-toggle');
        
        // Verificar estado inicial (todas expandidas por padrão)
        const isCollapsed = localStorage.getItem(`xaru_category_${categoryName}`) === 'collapsed';
        
        if (isCollapsed) {
            categoryContent.classList.add('collapsed');
            toggleIcon.classList.add('collapsed');
        }
        
        header.addEventListener('click', () => {
            // Toggle da categoria
            const isCurrentlyCollapsed = categoryContent.classList.contains('collapsed');
            
            if (isCurrentlyCollapsed) {
                // Expandir
                categoryContent.classList.remove('collapsed');
                toggleIcon.classList.remove('collapsed');
                localStorage.setItem(`xaru_category_${categoryName}`, 'expanded');
            } else {
                // Colapsar
                categoryContent.classList.add('collapsed');
                toggleIcon.classList.add('collapsed');
                localStorage.setItem(`xaru_category_${categoryName}`, 'collapsed');
            }
        });
    });
    
    // Event listener para o botão de Sniffar Opcodes
    controls.sniffOpcodesBtn.addEventListener('click', () => {
        const sniffer = document.querySelector('.position-absolute.draggable-window[style*="z-index: 402"]');
        if (sniffer.style.visibility === "hidden" || sniffer.style.display === "none") {
            sniffer.style.visibility = "visible";
            sniffer.style.display = "block";
        } else {
            sniffer.style.display = "none";
            sniffer.style.visibility = "hidden";
        }
    });
    
    // Função para mostrar/ocultar o painel
    function toggleXaruPanel() {
        if (n.style.visibility === "hidden") {
            n.style.visibility = "visible";
            n.style.display = "block";
        } else {
            n.style.display = "none";
            n.style.visibility = "hidden";
        }
    }

    const raveMenuEl = document.createElement("div");
    raveMenuEl.className = "rave-config-menu";
    raveMenuEl.innerHTML = `
      <div class="d-flex flex-column gap-2">
          <div class="rave-option" id="random-mode">Aleatório</div>
          <div class="rave-option" id="custom-mode">Personalizado</div>
          <div id="custom-settings" style="display: none;">
              <small class="form-text" style="color:#ccc;">Abra o Regulador de Luz para que as cores apareçam depois clique em "Personalizado" novamente</small>
              <div id="custom-swatch-container"></div>
              <div id="custom-selected-sequence"></div>
              <button id="save-custom-sequence">Salvar</button>
          </div>
      </div>
    `;
    document.body.appendChild(raveMenuEl);

    // --- RaveConfig Menu Handling ---
    const randomModeBtn = raveMenuEl.querySelector("#random-mode");
    const customModeBtn = raveMenuEl.querySelector("#custom-mode");
    const customSettingsDiv = raveMenuEl.querySelector("#custom-settings");
    const customSwatchContainer = raveMenuEl.querySelector("#custom-swatch-container");
    const customSelectedSequenceDiv = raveMenuEl.querySelector("#custom-selected-sequence");
    const saveCustomBtn = raveMenuEl.querySelector("#save-custom-sequence");

    controls.raveConfigBtn.onclick = (e) => {
        const rect = controls.raveConfigBtn.getBoundingClientRect();
        raveMenuEl.style.display = (raveMenuEl.style.display === 'block') ? 'none' : 'block';
        raveMenuEl.style.top = `${rect.bottom + 5}px`;
        raveMenuEl.style.left = `${rect.left}px`;
    };

    function populateCustomSwatches() {
        customSwatchContainer.innerHTML = ''; // limpa clones anteriores
        let originalSwatches = document.querySelectorAll('.nitro-room-widget-dimmer .color-swatch');

        if (originalSwatches.length === 0) {
            // Se não houver swatches disponíveis, mostra uma mensagem
            customSwatchContainer.innerHTML = "<p style='color: #fff;'>Nenhuma cor encontrada!</p>";
            return;
        }

        originalSwatches.forEach(orig => {
            const clone = orig.cloneNode(true);
            clone.classList.add("custom-swatch");
            // Anexa o manipulador de clique para seleção
            clone.addEventListener("click", () => {
                const colorVal = getComputedStyle(clone).backgroundColor;
                if (clone.classList.contains("selected")) {
                    clone.classList.remove("selected");
                    customColors = customColors.filter(c => c !== colorVal);
                } else {
                    clone.classList.add("selected");
                    customColors.push(colorVal);
                }
                updateSelectedSequenceDisplay();
            });
            customSwatchContainer.appendChild(clone);
        });
    }

    function updateSelectedSequenceDisplay() {
        customSelectedSequenceDiv.innerHTML = '';
        customColors.forEach((color, index) => {
            const seqItem = document.createElement("div");
            seqItem.className = "sequence-item";
            seqItem.style.backgroundColor = color;
            const numLabel = document.createElement("span");
            numLabel.textContent = index + 1;
            seqItem.appendChild(numLabel);
            seqItem.onclick = () => {
                customColors = customColors.filter(c => c !== color);
                const swatches = customSwatchContainer.querySelectorAll('.custom-swatch');
                swatches.forEach(s => {
                    if(getComputedStyle(s).backgroundColor === color) {
                        s.classList.remove("selected");
                    }
                });
                updateSelectedSequenceDisplay();
            };
            customSelectedSequenceDiv.appendChild(seqItem);
        });
    }

    // Ao mudar para modo Aleatório, esconde as configurações customizadas e limpa a sequência
    randomModeBtn.onclick = () => {
        raveMode = 'random';
        customSettingsDiv.style.display = 'none';
        raveMenuEl.style.display = 'none';
        customColors = [];
        const allSwatches = document.querySelectorAll('.nitro-room-widget-dimmer .color-swatch');
        allSwatches.forEach(swatch => swatch.classList.remove("selected"));
    };

    customModeBtn.onclick = () => {
        raveMode = 'custom';
        customSettingsDiv.style.display = 'block';
        populateCustomSwatches();
    };

    saveCustomBtn.onclick = () => {
        if (customColors.length === 0) {
            alert("Selecione pelo menos uma cor para salvar a sequência.");
        } else {
            alert("Sequência salva!");
            raveMenuEl.style.display = 'none';
        }
    };

    // --- XaruRave Handler (agora usando checkbox) ---
    controls.xaruraveToggle.addEventListener("change", async () => {
        if (controls.xaruraveToggle.checked) {
            // Ativar XaruRave
            try {
                const lightWidget = document.querySelector('.nitro-room-widget-dimmer');
                if (!lightWidget) {
                    alert("Erro: Abra o regulador de luz primeiro!");
                    controls.xaruraveToggle.checked = false;
                    return;
                }

                let colors = [];
                let intervalo = parseInt(controls.intervaloInput.value) || 100;
                if (raveMode === 'random') {
                    colors = [...lightWidget.querySelectorAll('.color-swatch')].filter(color => {
                        const bg = color.style.backgroundColor;
                        return bg !== 'rgb(0, 0, 0)' && bg !== 'black';
                    });
                } else {
                    if (customColors.length > 0) {
                        // Para cada cor salva, tenta encontrar o swatch correspondente no widget.
                        const widgetSwatches = [...lightWidget.querySelectorAll('.color-swatch')];
                        customColors.forEach(color => {
                            const target = widgetSwatches.find(swatch => {
                                // Compara os valores do estilo computado.
                                return getComputedStyle(swatch).backgroundColor === color;
                            });
                            if (target) colors.push(target);
                        });
                    } else {
                        // Se não houver sequência customizada, utiliza todos os swatches disponíveis.
                        colors = [...lightWidget.querySelectorAll('.color-swatch')];
                    }
                }

                if (!colors.length) {
                    alert("Nenhuma cor encontrada!");
                    controls.xaruraveToggle.checked = false;
                    return;
                }

                const applyBtn = lightWidget.querySelector('.btn-success');

                abortController = new AbortController();
                isXaruRaveActive = true;

                (async function raveLoop() {
                    if (controls.xaruraveToggle.checked && !abortController.signal.aborted) {
                        for (const color of colors) {
                            if (!controls.xaruraveToggle.checked || abortController.signal.aborted) break;
                            color.click();
                            applyBtn.click();
                            await sleep(intervalo);
                        }
                        requestAnimationFrame(raveLoop);
                    }
                })();
            } catch (error) {
                console.error("XaruRave error:", error);
                controls.xaruraveToggle.checked = false;
            }
        } else {
            // Desativar XaruRave
            abortController.abort();
            isXaruRaveActive = false;
            abortController = new AbortController();
        }
    });

    // --- Bill Moves - Implementação como checkbox ---
    controls.billToggle.addEventListener("change", async () => {
        if (controls.billToggle.checked) {
            // Ativa Bill Moves
            try {
                // Validação inicial
                if (!window.t || !window.ne) {
                    alert("Erro: Conexão com o servidor não disponível!");
                    controls.billToggle.checked = false;
                    return;
                }
                
                if (!window.J.F.W || window.J.F.W.length === 0) {
                    alert("Erro: Nenhum usuário detectado no quarto!");
                    controls.billToggle.checked = false;
                    return;
                }
                
                const allPlayers = [...window.J.F.W]; 
                const mainPlayer = allPlayers.find(u => u.type === 1) || allPlayers[0];
                
                if (!mainPlayer) {
                    alert("Erro: Não foi possível encontrar seu personagem no quarto!");
                    controls.billToggle.checked = false;
                    return;
                }
                
                // Obter posição inicial para manter os movimentos dentro de uma área 5x5
                const initialX = mainPlayer.x;
                const initialY = mainPlayer.y;
                let currentX = initialX;
                let currentY = initialY;
                
                console.log(`[Bill Moves] Posição inicial: ${currentX},${currentY}`);
                
                billAbortController = new AbortController();
                isBillActive = true;
                
                const moveToPosition = (x, y) => {
                    try {
                        // Analise mais detalhada do pacote de movimento
                        console.log(`[Bill Moves DEBUG] Tentando enviar movimento para: ${x},${y}`);
                        
                        // Tente diferentes formatos de pacote - o Habbo pode esperar diferentes formatos
                        
                        // Formato 1: Padrão com C(x), C(y)
                        const writer1 = new BinaryWriter(3320);
                        writer1.C(x);
                        writer1.C(y);
                        const buffer1 = writer1.K();
                        console.log(`[Bill Moves DEBUG] Enviando pacote formato 1`);
                        window.ne.bind(window.t)(buffer1);
                        
                        // Aguarde um momento antes de tentar o próximo formato
                        setTimeout(() => {
                            try {
                                // Formato 2: Usando números curtos (q) em vez de inteiros completos
                                const writer2 = new BinaryWriter(3320);
                                writer2.q(x);
                                writer2.q(y);
                                const buffer2 = writer2.K();
                                console.log(`[Bill Moves DEBUG] Enviando pacote formato 2`);
                                window.ne.bind(window.t)(buffer2);
                            } catch (e) {
                                console.error("Erro no formato 2:", e);
                            }
                        }, 100);
                        
                        // Tente também com um OPCODE ligeiramente diferente
                        setTimeout(() => {
                            try {
                                // Formato 3: Usando o OPCODE 3321 (próximo ao identificado)
                                const writer3 = new BinaryWriter(3321);
                                writer3.C(x);
                                writer3.C(y);
                                const buffer3 = writer3.K();
                                console.log(`[Bill Moves DEBUG] Enviando pacote formato 3`);
                                window.ne.bind(window.t)(buffer3);
                            } catch (e) {
                                console.error("Erro no formato 3:", e);
                            }
                        }, 200);
                        
                        // Tente o formato que vimos em uso pelo Enables (formato 1314)
                        setTimeout(() => {
                            try {
                                // Formato 4: Usando a função I (string) seguida de C
                                const writer4 = new BinaryWriter(3320);
                                writer4.I(x.toString());
                                writer4.I(y.toString());
                                const buffer4 = writer4.K();
                                console.log(`[Bill Moves DEBUG] Enviando pacote formato 4`);
                                window.ne.bind(window.t)(buffer4);
                            } catch (e) {
                                console.error("Erro no formato 4:", e);
                            }
                        }, 300);
                        
                        console.log(`[Bill Moves] Movimento enviado para: ${x},${y}`);
                        return true;
                    } catch (err) {
                        console.error("[Bill Moves] Erro ao mover:", err);
                        return false;
                    }
                };
                
                // Função para obter uma posição aleatória próxima, mas não uma direção específica
                const getRandomNearbyPosition = (currentX, currentY, initialX, initialY, maxDistance) => {
                    let attempts = 0;
                    const maxAttempts = 10;
                    
                    while (attempts < maxAttempts) {
                        attempts++;
                        
                        // Gere um deslocamento aleatório dentro dos limites
                        const offsetX = Math.floor(Math.random() * (maxDistance * 2 + 1)) - maxDistance;
                        const offsetY = Math.floor(Math.random() * (maxDistance * 2 + 1)) - maxDistance;
                        
                        // Calcule a nova posição
                        const newX = initialX + offsetX;
                        const newY = initialY + offsetY;
                        
                        // Verifique se a nova posição está dentro dos limites
                        if (Math.abs(newX - initialX) <= maxDistance && 
                            Math.abs(newY - initialY) <= maxDistance &&
                            !(newX === currentX && newY === currentY)) { // Evite ficar no mesmo lugar
                            return { x: newX, y: newY };
                        }
                    }
                    
                    // Se não conseguir encontrar uma posição válida, retorne à posição inicial
                    return { x: initialX, y: initialY };
                };
                
                // Função simplificada para o movimento
                const billMove = async () => {
                    if (!controls.billToggle.checked || billAbortController.signal.aborted) {
                        console.log("[Bill Moves] Movimento interrompido");
                        return;
                    }
                    
                    // Obtenha uma nova posição aleatória
                    const newPosition = getRandomNearbyPosition(currentX, currentY, initialX, initialY, 2);
                    
                    // Atualize a posição atual
                    currentX = newPosition.x;
                    currentY = newPosition.y;
                    
                    console.log(`[Bill Moves] Nova posição: ${currentX}, ${currentY}`);
                    
                    // Envie o comando de movimento
                    moveToPosition(currentX, currentY);
                    
                    // Aguarde um tempo aleatório
                    const randomDelay = Math.floor(Math.random() * 300) + 450;
                    console.log(`[Bill Moves] Aguardando ${randomDelay}ms para o próximo movimento`);
                    await sleep(randomDelay);
                    
                    // Continue apenas se o toggle ainda estiver ativo
                    if (controls.billToggle.checked && !billAbortController.signal.aborted) {
                        setTimeout(billMove, 150);
                    }
                };
                
                // Inicie o movimento
                console.log("[Bill Moves] Iniciando movimentos aleatórios");
                billMove();
                
            } catch (error) {
                console.error("[Bill Moves] Erro fatal:", error);
                controls.billToggle.checked = false;
                isBillActive = false;
            }
        } else {
            billAbortController.abort();
            isBillActive = false;
            billAbortController = new AbortController();
        }
    });

    // --- Enables Doidex - Implementação como checkbox ---
    controls.enablesDoidexToggle.addEventListener("change", async () => {
        if (controls.enablesDoidexToggle.checked) {
            // Ativa Enables Doidex
            try {
                // Validação inicial
                if (!window.t || !window.ne) {
                    alert("Erro: Conexão com o servidor não disponível!");
                    controls.enablesDoidexToggle.checked = false;
                    return;
                }
                
                console.log("[Enables Doidex] Ativado");
                
                // Preparar controlador de abort para interromper o loop
                enablesAbortController = new AbortController();
                isEnablesDoidexActive = true;
                
                // Função para enviar um enable aleatório
                const sendRandomEnable = () => {
                    try {
                        // Escolher um enable aleatório do array
                        const randomIndex = Math.floor(Math.random() * enablesArray.length);
                        const enableNumber = enablesArray[randomIndex];
                        
                        // Enviar comando :enable X
                        const enableCommand = `:enable ${enableNumber}`;
                        
                        // Usando o formato de mensagem de chat para enviar o enable
                        const writer = new BinaryWriter(1314);
                        writer.I(enableCommand);
                        writer.C(0); // Tipo de mensagem
                        window.ne.bind(window.t)(writer.K());
                        
                        console.log(`[Enables Doidex] Enviado: ${enableCommand}`);
                        return true;
                    } catch (err) {
                        console.error("[Enables Doidex] Erro ao enviar enable:", err);
                        return false;
                    }
                };
                
                // Função recursiva para enviar enables em intervalos
                const enableLoop = async () => {
                    // Verificar se o toggle ainda está ativo
                    if (!controls.enablesDoidexToggle.checked || enablesAbortController.signal.aborted) {
                        return;
                    }
                    
                    // Enviar um enable aleatório
                    sendRandomEnable();
                    
                    // Aguardar um tempo aleatório entre 800ms e 1500ms para evitar ser mutado, mas sendo mais rápido
                    const randomDelay = Math.floor(Math.random() * 700) + 800;
                    await sleep(randomDelay);
                    
                    // Continuar apenas se o toggle ainda estiver ativo
                    if (controls.enablesDoidexToggle.checked && !enablesAbortController.signal.aborted) {
                        // Usar setTimeout para evitar stack overflow em recursões longas
                        setTimeout(enableLoop, 100);
                    }
                };
                
                // Iniciar o processo de envio de enables
                enableLoop();
                
            } catch (error) {
                console.error("[Enables Doidex] Erro fatal:", error);
                controls.enablesDoidexToggle.checked = false;
                isEnablesDoidexActive = false;
            }
        } else {
            // Desativa Enables Doidex
            enablesAbortController.abort();
            isEnablesDoidexActive = false;
            enablesAbortController = new AbortController();
            console.log("[Enables Doidex] Desativado");
        }
    });

    let w = false, h = 0, v = 0;
    s.addEventListener("mousedown", e => {
        if (e.target.classList.contains("nitro-card-header-close")) {
            n.style.display = "none";
            n.style.visibility = "hidden";
            return;
        }
        w = true;
        let rect = s.parentElement.parentElement.getBoundingClientRect();
        h = e.clientX - rect.left;
        v = e.clientY - rect.top;
    });
    document.addEventListener("mouseup", e => {
        w = false;
    });
    document.addEventListener("mousemove", e => {
        if (w) {
            s.parentElement.parentElement.style.left = `${e.clientX - h}px`;
            s.parentElement.parentElement.style.top = `${e.clientY - v}px`;
        }
    });

    let navParent = document.querySelector(".navigation-item").parentElement;
    navParent.appendChild(t);
    document.querySelector("#draggable-windows-container").appendChild(n);
}

window.J = { elements: {}, F: { W: [] } };
window.se = false;
window.i = ({ data: e, t }) => {
    if (!window.se) {
        window.se = true;
        window.t = t;
        window.ne = t.send;
        window.ae = t.addEventListener;
        t.send = n => {
            let i = new BinaryReader(n);
            i.l();
            let e = i.A();
            
            // Registrar o OPCODE enviado no sniffer
            if (window.addOpcodeLog) {
                let extraData = '';
                try {
                    if (e === 1314) {
                        // Para mensagens de chat, tentar extrair o texto
                        let reader = new BinaryReader(n);
                        reader.l(); // Pular length
                        reader.A(); // Pular opcode
                        extraData = reader.o(); // Ler string
                    }
                } catch (err) {}
                window.addOpcodeLog('ENVIADO', e, extraData);
            }
            
            if (1314 == e) {
                let e = i.o();
                i.l();
                let t = e.split(" ");
                if (":copy" == t[0] && window.J && window.J.elements.$.checked) {
                    let found = window.J.F.W.find(e => e.username == t[1]);
                    if (console.log(found), !found) return;
                    let writer = new BinaryWriter(2730);
                    writer.I(found.h);
                    writer.I(found.L);
                    n = writer.K();
                }
            } else if (1597 == e && window.J && window.J.elements._.checked)
                return;
            window.ne.bind(t)(n);
        };
    }
    let s = new BinaryReader(e);
    s.l();
    let i = s.A();
    
    // Registrar o OPCODE recebido no sniffer
    if (window.addOpcodeLog) {
        let extraData = '';
        try {
            if (i === 1314) {
                // Para mensagens de chat, tentar extrair o texto
                let reader = new BinaryReader(e);
                reader.l(); // Pular length
                reader.A(); // Pular opcode
                extraData = reader.o(); // Ler string
            } else if (i === 3920) {
                // Para atualizações de usuários, extrair o nome
                let reader = new BinaryReader(e);
                reader.l(); // Pular length
                reader.A(); // Pular opcode
                reader.l(); // ID do quarto
                extraData = reader.o(); // Nome de usuário
            }
        } catch (err) {}
        window.addOpcodeLog('RECEBIDO', i, extraData);
    }
    
    if (374 == i)
        RoomUnitEvent.parse(s);
    else if (1446 == i) {
        if (window.J && window.J.elements.ee.checked) return;
        s.l();
        s.o();
        s.l();
        s.l();
    } else if (1778 == i) {
        if (window.J && window.J.elements.ie.checked) return;
    } else if (1797 == i) {
        if (window.J && window.J.elements.te.checked) {
            let e = new BinaryWriter(2080);
            e.C(1);
            window.ne.bind(t)(e.K());
            setTimeout(() => {
                let e = new BinaryWriter(2080);
                e.C(0);
                window.ne.bind(t)(e.K());
            }, 500);
        }
    } else if (3920 == i) {
        let i = s.l(),
            e = s.o(),
            t = s.o().toLocaleUpperCase();
        s.o();
        s.l();
        let n = window.J.F.W.find(e => e.V === i);
        n.L = e;
        n.h = t;
    }
    return e;
};

listen();

const searcher = setInterval(() => {
    let navItem = document.querySelector(".navigation-item");
    if (navItem) {
        clearInterval(searcher);
        main();
    }
}, 100);