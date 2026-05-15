 Gerador Automático de Documentos Jurídicos

Este é um aplicativo web local (Single Page Application - SPA) focado em produtividade para escritórios de advocacia. O sistema realiza o preenchimento automatizado de modelos jurídicos em formato PDF mantendo 100% do layout original através de coordenadas calculadas via JavaScript, sem a necessidade de um servidor backend.

---

 Stack Tecnológica

- Frontend: HTML5, CSS3 (Design Premium/Minimalista) e JavaScript Vanilla.
- Engine de PDF: `pdf-lib` (Estratégia: `TEMPLATE_FILL` com manipulação binária).
- Suporte de Tipografia: `@pdf-lib/fontkit` para embutir fontes TTF customizadas (Montserrat).
- Integração: API Pública ViaCEP para auto-preenchimento de endereço.
- Modo de Execução: 100% Local (Client-side).

---

Estrutura de Pastas

Para o correto funcionamento do ecossistema, os arquivos devem seguir estritamente a árvore de diretórios abaixo:

/gerador-juridico
│── index.html
│── style.css
│── script.js
│── manifest.json
│── service-worker.js
└── /assets
    ├── /fonts
    │   └── Montserrat-Regular.ttf
    ├── /icons
    │   ├── icon-192x192.png
    │   └── icon-512x512.png
    └── /pdf_templates
        ├── procuracao.pdf
        ├── contrato.pdf
        ├── hipossuficiencia.pdf
        └── renuncia.pdf
