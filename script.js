document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DATA AUTOMÁTICA POR EXTENSO
    const obterDataFormatada = () => {
        const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
        const data = new Date();
        return `Rio de Janeiro, ${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()}`;
    };

    // 2. MAPEAMENTO DE COORDENADAS (AJUSTE FINO)
    // - O eixo Y (altura) agora desce exatamente 24 pontos por linha (padrão de espaçamento 1.15).
    // - O eixo X (horizontal) foi puxado para a esquerda para ficar mais "junto" dos títulos.
    const posAssinaturaX = 180; // Posição centralizada para a assinatura

    const PDF_COORDINATES = {
        procuracao: {
            nome: { page: 0, x: 65, y: 660 },
            cpf: { page: 0, x: 55, y: 646 },
            profissao: { page: 0, x: 80, y: 634 },
            estadoCivil: { page: 0, x: 90, y: 620 },
            enderecoCompleto: { page: 0, x: 80, y: 605 },
            ufCep: { page: 0, x: 27, y: 588 },
            
            repNome: { page: 0, x: 125, y: 553 },
            repEstadoCivil: { page: 0, x: 92, y: 535 },
            repEndereco: { page: 0, x: 86, y: 518 },
            repcpf: { page: 0, x: 350, y: 553 },

            dataDocumento: { page: 0, x: 380, y: 180 },
            assinaturaNome: { page: 0, x: posAssinaturaX, y: 110 } // Nome abaixo da linha
        },
        contrato: {
            nome: { page: 0, x: 111, y: 644 },
            cpf: { page: 0, x: 100, y: 630},
            profissao: { page: 0, x: 129, y: 617 },
            estadoCivil: { page: 0, x: 140, y: 603 },
            enderecoCompleto: { page: 0, x: 130, y: 589 },
            ufCep: { page: 0, x: 76, y: 575 },
            repNome: { page: 0, x: 171, y: 563 },
             repcpf: { page: 0, x: 400, y: 563 },
            
            objeto: { page: 0, x: 94, y: 310 }, // Ajustado para cair dentro do quadro do objeto
            valorHonorario: { page: 0, x: 120, y: 220 },
            obsHonorarios: { page: 0, x: 70, y: 200,}, // Campo de observações 

            dataDocumento: { page: 1, x: 380, y: 100 },
            assinaturaNome: { page: 1, x: 100, y: 40 } // Página 2
        },
        hipossuficiencia: {
            nome: { page: 0, x: 105, y: 641 },
            cpf: { page: 0, x: 95, y: 624 },
            profissao: { page: 0, x: 125, y: 608 },
            estadoCivil: { page: 0, x: 140, y: 593 },
            enderecoCompleto: { page: 0, x: 130, y: 575 },
           ufCep: { page: 0, x: 65, y: 559 },
            repNome: { page: 0, x: 180, y: 542 },
            repcpf: { page: 0, x: 400, y: 542 },

            dataDocumento: { page: 0, x: 380, y: 230 },
            assinaturaNome: { page: 0, x: 220, y: 180 }
        },
        renuncia: {
            nome: { page: 0, x: 102, y: 631 },
            cpf: { page: 0, x: 90, y: 615 },
            nacionalidade: { page: 0, x: 151, y: 598 },
            estadoCivil: { page: 0, x: 135, y: 582 },
            enderecoCompleto: { page: 0, x: 96, y: 566 },
            ufCep: { page: 0, x: 60, y: 550 },

            dataDocumento: { page: 0, x: 380, y: 220 },
            assinaturaNome: { page: 0, x: 220, y: 180 }
        }
    };

    // 4. LÓGICA DE INTERFACE
    const form = document.getElementById('docForm');
    const checkMenor = document.getElementById('checkMenor');
    const sectionRepresentante = document.getElementById('sectionRepresentante');
    const checkContrato = document.getElementById('checkContrato');
    const sectionContrato = document.getElementById('sectionContrato');

    checkMenor.addEventListener('change', (e) => sectionRepresentante.classList.toggle('hidden', !e.target.checked));
    checkContrato.addEventListener('change', (e) => sectionContrato.classList.toggle('hidden', !e.target.checked));

    // 5. GERAÇÃO DOS DOCUMENTOS
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const statusMsg = document.getElementById('statusMessage');
        statusMsg.textContent = 'Gerando PDFs...';

        const docsSelecionados = Array.from(document.querySelectorAll('input[name="docs"]:checked')).map(cb => cb.value);
        const nomeCliente = document.getElementById('nome').value;

        // Dados coletados com regra de "Não aplicado"
        const dadosParaPreencher = {
            nome: nomeCliente,
            assinaturaNome: nomeCliente,
            cpf: document.getElementById('cpf').value,
            repcpf: document.getElementById('cpf').value,
            nacionalidade: document.getElementById('nacionalidade')?.value || '',
            estadoCivil: document.getElementById('estadoCivil').value,
            profissao: document.getElementById('profissao').value,
            enderecoCompleto: `${document.getElementById('endereco').value}, nº ${document.getElementById('numero').value}${document.getElementById('complemento').value ? ' - ' + document.getElementById('complemento').value : ''}, ${document.getElementById('bairro').value} - ${document.getElementById('cidade').value}`,
            cep: document.getElementById('cep').value,
            ufCep: `${document.getElementById('estado').value}, CEP: ${document.getElementById('cep').value}`,
            dataDocumento: obterDataFormatada(),
            
            repNome: checkMenor.checked ? document.getElementById('repNome').value : "Não aplicado",
            repEstadoCivil: checkMenor.checked ? (document.getElementById('repEstadoCivil')?.value || "Não aplicado") : "Não aplicado",
            repEndereco: checkMenor.checked ? (document.getElementById('repEndereco')?.value || "Não aplicado") : "Não aplicado",
            
            objeto: document.getElementById('objetoContrato')?.value || '',
            valorHonorario: document.getElementById('valorHonorario')?.value || '',
            obsHonorarios: document.getElementById('obsHonorarios')?.value || ''
        };

        for (const docType of docsSelecionados) {
            try {
                const url = `assets/pdf_templates/${docType}.pdf`;
                const templateBytes = await fetch(url).then(res => res.arrayBuffer());
                const pdfDoc = await PDFLib.PDFDocument.load(templateBytes);
                const pages = pdfDoc.getPages();
                const coords = PDF_COORDINATES[docType];

                if (coords) {
                    for (const [campo, pos] of Object.entries(coords)) {
                        if (dadosParaPreencher[campo] && pages[pos.page]) {
                            // Se existir a propriedade "width", usa a quebra de texto em coluna
                            if (pos.width) {
                                desenharTextoComQuebra(pages[pos.page], dadosParaPreencher[campo], pos.x, pos.y, pos.width, 10);
                            } else {
                                pages[pos.page].drawText(dadosParaPreencher[campo], {
                                    x: pos.x,
                                    y: pos.y,
                                    size: 10
                                });
                            }
                        }
                    }
                }

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${docType}_${nomeCliente.toLowerCase().replace(/\s+/g, '_')}.pdf`;
                link.click();
            } catch (err) {
                console.error(`Erro ao processar ${docType}:`, err);
            }
        }
        statusMsg.textContent = 'Documentos gerados com sucesso!';
        setTimeout(() => statusMsg.textContent = '', 4000);
    });
});