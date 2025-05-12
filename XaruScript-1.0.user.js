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
                <p class="header-text fw-bold">Pirulay</p>
            </div>
            <div class="d-flex gap-2 align-items-center justify-content-between">
                <div class="d-flex gap-2 align-items-center">
                    <label class="switch">
                        <input id="command-copy" type="checkbox">
                        <span class="slider"></span>
                    </label>
                    <div class="d-inline text-black option-name">Comando :copy</div>
                </div>
            </div>

            <div class="line">
                <p class="header-text fw-bold">Privacidade</p>
            </div>
            <div class="d-flex gap-2 align-items-center justify-content-between">
                <div class="d-flex gap-2 align-items-center">
                    <label class="switch">
                        <input type="checkbox" id="hide-typing">
                        <span class="slider"></span>
                    </label>
                    <div class="d-inline text-black option-name">Ocultar balão digitando</div>
                </div>
            </div>

            <div class="line">
                <p class="header-text fw-bold">Utilitários / Performance</p>
            </div>
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

            <div class="line">
                <p class="header-text fw-bold">XaruRave</p>
            </div>
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
        733, 734, 735, 902, 903
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
                        const widgetSwatches = [...lightWidget.querySelectorAll('.color-swatch')];
                        customColors.forEach(color => {
                            const target = widgetSwatches.find(swatch => {
                                return getComputedStyle(swatch).backgroundColor === color;
                            });
                            if (target) colors.push(target);
                        });
                    } else {
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
            abortController.abort();
            isXaruRaveActive = false;
            abortController = new AbortController();
        }
    });

    // --- Bill Moves - Implementação como checkbox ---
    controls.billToggle.addEventListener("change", () => {
        if (controls.billToggle.checked) {
            try {
                console.log("=== BILL MOVES - MODO SELEÇÃO ===");
                
                if (!window.t || !window.ne) {
                    alert("Erro de conexão");
                    controls.billToggle.checked = false;
                    return;
                }
                
                // Verificar se já existe um Bill Moves ativo
                if (billAbortController) {
                    billAbortController.abort();
                }
                
                // Criar elementos visuais para o modo de seleção
                const instructionMsg = document.createElement("div");
                instructionMsg.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 10px 20px;
                    background-color: rgba(0, 0, 0, 0.7);
                    color: white;
                    border-radius: 5px;
                    font-family: sans-serif;
                    font-size: 16px;
                    z-index: 10000;
                    pointer-events: none;
                `;
                instructionMsg.textContent = "Clique no quarto para definir o centro da área 3x3 para o Bill Moves";
                
                // Adicionar mensagem ao DOM
                document.body.appendChild(instructionMsg);
                
                // Armazenar o cursor original para restaurar depois
                const originalCursor = document.body.style.cursor;
                
                // Mudar o cursor para o emoji de pegadas
                document.body.style.cursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'><text x='0' y='20' font-size='20'>👣</text></svg>"), auto`;
                
                // Função para iniciar o Bill Moves com base no ponto selecionado
                const startBillMoves = (centerX, centerY) => {
                    // Remover mensagem e restaurar cursor
                    document.body.removeChild(instructionMsg);
                    document.body.style.cursor = originalCursor;
                    
                    console.log(`Iniciando Bill Moves no ponto: ${centerX},${centerY}`);
                    
                    // Criar controlador para o ciclo
                    billAbortController = new AbortController();
                    isBillActive = true;
                    
                    // Área 3x3 ao redor do ponto selecionado
                    const movementPositions = [
                        {x: centerX-1, y: centerY-1}, // Canto superior esquerdo
                        {x: centerX,   y: centerY-1}, // Cima
                        {x: centerX+1, y: centerY-1}, // Canto superior direito
                        {x: centerX-1, y: centerY},   // Esquerda
                        // Posição central (onde o jogador fica)
                        {x: centerX+1, y: centerY},   // Direita
                        {x: centerX-1, y: centerY+1}, // Canto inferior esquerdo
                        {x: centerX,   y: centerY+1}, // Baixo
                        {x: centerX+1, y: centerY+1}  // Canto inferior direito
                    ];
                    
                    // Guarda a última posição do jogador para evitar movimentos duplicados
                    let lastX = -1, lastY = -1;
                    
                    // Interceptar a função original de envio para controlar os movimentos
                    const originalSend = window.ne;
                    window.billIntercepting = true;
                    
                    window.ne = function(data) {
                        if (!window.billIntercepting || !controls.billToggle.checked) {
                            return originalSend.apply(window.t, arguments);
                        }
                        
                        try {
                            const reader = new BinaryReader(data);
                            reader.l(); // Pular comprimento
                            const opcode = reader.A();
                            
                            // Se for comando de movimento (3320), verificar se veio do jogo ou de nós
                            if (opcode === 3320 && !window.billCommand) {
                                console.log("Bloqueando comando de movimento externo");
                                return; // Bloquear movimentos que não vieram do nosso script
                            }
                            
                            // Para todos os outros comandos, deixar passar normalmente
                            return originalSend.apply(window.t, arguments);
                        } catch (e) {
                            console.error("Erro ao interceptar comando:", e);
                            return originalSend.apply(window.t, arguments);
                        }
                    }.bind(window.t);
                    
                    // Selecionar o usuário antes de movê-lo
                    const selectUser = () => {
                        try {
                            // 3301, 2091, 2138 - OPCODEs para seleção de usuário
                            const writer1 = new BinaryWriter(3301);
                            window.billCommand = true;
                            originalSend.apply(window.t, [writer1.K()]);
                            
                            const writer2 = new BinaryWriter(2091);
                            window.billCommand = true;
                            originalSend.apply(window.t, [writer2.K()]);
                            
                            const writer3 = new BinaryWriter(2138);
                            window.billCommand = true;
                            originalSend.apply(window.t, [writer3.K()]);
                            
                            window.billCommand = false;
                            return true;
                        } catch (e) {
                            console.error("Erro ao selecionar usuário:", e);
                            window.billCommand = false;
                            return false;
                        }
                    };
                    
                    // Mover para uma posição específica
                    const moveToPosition = (x, y) => {
                        try {
                            // Não mover se for a mesma posição da última vez
                            if (x === lastX && y === lastY) {
                                return true;
                            }
                            
                            // Atualizar última posição
                            lastX = x;
                            lastY = y;
                            
                            // Primeiro selecionar o usuário
                            selectUser();
                            
                            // Enviar comando de movimento
                            setTimeout(() => {
                                const writer = new BinaryWriter(3320);
                                writer.C(x);
                                writer.C(y);
                                window.billCommand = true;
                                originalSend.apply(window.t, [writer.K()]);
                                window.billCommand = false;
                                console.log(`Movido para: ${x},${y}`);
                            }, 10);
                            
                            return true;
                        } catch (e) {
                            console.error("Erro ao mover:", e);
                            window.billCommand = false;
                            return false;
                        }
                    };
                    
                    // Controle da posição atual na sequência
                    let posIndex = 0;
                    
                    // Função principal de ciclo de movimento
                    const moveCycle = () => {
                        if (!controls.billToggle.checked || billAbortController.signal.aborted) {
                            return;
                        }
                        
                        // Verificar posição atual do jogador
                        const player = window.J.F.W.find(u => u.type === 1);
                        if (!player) {
                            setTimeout(moveCycle, 100);
                            return;
                        }
                        
                        const currentX = parseInt(player.x);
                        const currentY = parseInt(player.y);
                        
                        // Verificar se saiu da área 3x3
                        const distX = Math.abs(currentX - centerX);
                        const distY = Math.abs(currentY - centerY);
                        
                        if (distX > 1 || distY > 1) {
                            console.log(`Fora da área! (${currentX},${currentY}), retornando ao centro (${centerX},${centerY})`);
                            
                            // Voltar para o centro da área
                            moveToPosition(centerX, centerY);
                            
                            // Aguardar antes do próximo movimento
                            setTimeout(moveCycle, 200);
                            return;
                        }
                        
                        // Avançar para próxima posição na sequência
                        posIndex = (posIndex + 1) % movementPositions.length;
                        const nextPos = movementPositions[posIndex];
                        
                        // Mover para próxima posição
                        moveToPosition(nextPos.x, nextPos.y);
                        
                        // Continuar ciclo
                        setTimeout(moveCycle, 100);
                    };
                    
                    // Mover para a posição central antes de iniciar ciclo
                    moveToPosition(centerX, centerY);
                    
                    // Iniciar ciclo após pequeno atraso
                    setTimeout(moveCycle, 200);
                    
                    console.log("Bill Moves ativado com sucesso!");
                };
                
                // Obter o elemento que contém o quarto (Nitro Room)
                const roomElement = document.querySelector('[class*="nitro-room"]') || 
                                    document.querySelector('[class*="room-container"]') ||
                                    document;
                
                // Handler para o clique no quarto
                const clickHandler = (e) => {
                    // Remover o evento de clique após ser acionado
                    roomElement.removeEventListener('click', clickHandler);
                    
                    // Calcular coordenadas do tile clicado
                    // Como é difícil obter as coordenadas exatas, vamos pegar as coordenadas atuais
                    // e simular um "teleporte" para o ponto clicado
                    
                    // Verificar se temos acesso aos opcode necessários
                    if (!window.t || !window.ne) {
                        alert("Não foi possível acessar o sistema de coordenadas do jogo");
                        controls.billToggle.checked = false;
                        return;
                    }
                    
                    // Pegar o jogador atual
                    const player = window.J.F.W.find(u => u.type === 1);
                    if (!player) {
                        alert("Não foi possível localizar o jogador na sala");
                        controls.billToggle.checked = false;
                        return;
                    }
                    
                    // Definir as coordenadas do centro como as coordenadas atuais do jogador
                    // Isso funciona como base para a área 3x3
                    const centerX = parseInt(player.x);
                    const centerY = parseInt(player.y);
                    
                    // Iniciar Bill Moves com essas coordenadas
                    startBillMoves(centerX, centerY);
                };
                
                // Adicionar evento de clique no quarto
                roomElement.addEventListener('click', clickHandler);
                
                // Se o usuário não clicar em 15 segundos, cancelar automaticamente
                const timeout = setTimeout(() => {
                    roomElement.removeEventListener('click', clickHandler);
                    
                    if (document.body.contains(instructionMsg)) {
                        document.body.removeChild(instructionMsg);
                    }
                    
                    document.body.style.cursor = originalCursor;
                    
                    controls.billToggle.checked = false;
                    console.log("Tempo esgotado para seleção do ponto central");
                }, 15000);
                
                // Armazenar o timeout para cancelar se necessário
                window.billSelectionTimeout = timeout;
                
            } catch (e) {
                console.error("Erro Fatal Bill Moves:", e);
                
                // Restaurar cursor
                document.body.style.cursor = "";
                
                // Limpar timeout se existir
                if (window.billSelectionTimeout) {
                    clearTimeout(window.billSelectionTimeout);
                }
                
                // Limpar mensagem
                const instructions = document.querySelector('div[style*="position: fixed"][style*="top: 20px"]');
                if (instructions) document.body.removeChild(instructions);
                
                controls.billToggle.checked = false;
                isBillActive = false;
            }
        } else {
            console.log("Desativando Bill Moves...");
            
            // Limpar timeout se existir
            if (window.billSelectionTimeout) {
                clearTimeout(window.billSelectionTimeout);
            }
            
            // Restaurar cursor
            document.body.style.cursor = "";
            
            // Limpar mensagem
            const instructions = document.querySelector('div[style*="position: fixed"][style*="top: 20px"]');
            if (instructions) document.body.removeChild(instructions);
            
            // Restaurar função original de envio
            if (window.billIntercepting && window.t) {
                window.ne = window.t.send;
                window.billIntercepting = false;
            }
            
            if (billAbortController) {
                billAbortController.abort();
            }
            
            isBillActive = false;
            console.log("Bill Moves desativado");
        }
    });

    // --- Enables Doidex - Implementação como checkbox ---
    controls.enablesDoidexToggle.addEventListener("change", async () => {
        if (controls.enablesDoidexToggle.checked) {
            try {
                if (!window.t || !window.ne) {
                    alert("Erro: Conexão com o servidor não disponível!");
                    controls.enablesDoidexToggle.checked = false;
                    return;
                }

                console.log("[Enables Doidex] Ativado");

                enablesAbortController = new AbortController();
                isEnablesDoidexActive = true;

                const sendRandomEnable = () => {
                    try {
                        const randomIndex = Math.floor(Math.random() * enablesArray.length);
                        const enableNumber = enablesArray[randomIndex];

                        const enableCommand = `:enable ${enableNumber}`;

                        const writer = new BinaryWriter(1314);
                        writer.I(enableCommand);
                        writer.C(0);
                        window.ne.bind(window.t)(writer.K());

                        console.log(`[Enables Doidex] Enviado: ${enableCommand}`);
                        return true;
                    } catch (err) {
                        console.error("[Enables Doidex] Erro ao enviar enable:", err);
                        return false;
                    }
                };

                const enableLoop = async () => {
                    if (!controls.enablesDoidexToggle.checked || enablesAbortController.signal.aborted) {
                        return;
                    }

                    sendRandomEnable();

                    const randomDelay = Math.floor(Math.random() * 700) + 800;
                    await sleep(randomDelay);

                    if (controls.enablesDoidexToggle.checked && !enablesAbortController.signal.aborted) {
                        setTimeout(enableLoop, 100);
                    }
                };

                enableLoop();

            } catch (error) {
                console.error("[Enables Doidex] Erro fatal:", error);
                controls.enablesDoidexToggle.checked = false;
                isEnablesDoidexActive = false;
            }
        } else {
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
