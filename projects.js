/*
 * Catálogo da seção "Mais sistemas".
 * cat: Gestão | Fiscal | Operação | Financeiro | IA & Ferramentas
 * demo / repo: links públicos (omita quando o sistema for interno).
 */
const SYSTEMS = [
  { title: 'Painel Gerencial', cat: 'Gestão', desc: 'Desempenho mensal das 5 unidades ao vivo: consolidado, pagamentos e matriz por conta contábil contra o mês anterior, com PDF executivo em 1 clique.', stack: 'SVG · PowerShell · SQL Server', repo: 'https://github.com/andre-jnr/relatorio-gerencial' },
  { title: 'Metas por Setor', cat: 'Gestão', desc: 'Meta cadastrada × venda real por setor, grupo e subgrupo. Versão local ligada ao ERP e versão na nuvem com login.', stack: 'Flask · SQLite · Supabase · Vercel', repo: 'https://github.com/andre-jnr/metas-frigoam' },
  { title: 'Margem por Grupo', cat: 'Gestão', desc: 'Margem e markup por grupo e loja, com os produtos abaixo do custo identificados no dia da vigência do preço.', stack: 'Python · SQL Server', repo: 'https://github.com/andre-jnr/relatorio-de-margens-aplicadas' },
  { title: 'BI Adega', cat: 'Gestão', desc: 'Receita, CMV, lucro bruto, margem e compras do setor, atualizados automaticamente a cada 60 segundos.', stack: 'Node.js · Chart.js' },
  { title: 'Hortifruti: da compra à margem real', cat: 'Gestão', desc: 'Sugestão de compra pelo histórico e rateio de avaria, CT-e e ICMS até a margem por produto. Revelou margens próximas de zero escondidas no custo.', stack: 'Supabase · Python · openpyxl' },
  { title: 'Portfólio Power BI', cat: 'Gestão', desc: 'Estudos de dashboards de vendas, produção, RH, financeiro e inteligência de tempo.', stack: 'Power BI · DAX', repo: 'https://github.com/andre-jnr/portfolio-powerbi' },

  { title: 'Leitor NF-e Ambev', cat: 'Fiscal', desc: 'Lê o XML da Ambev e converte o preço da caixa para unidade com um cadastro embutido, sem conta manual.', stack: 'JavaScript · PDF', demo: 'https://andre-jnr.github.io/leitor-nfe-ambev/', repo: 'https://github.com/andre-jnr/leitor-nfe-ambev' },
  { title: 'Entradas Nestlé', cat: 'Fiscal', desc: 'Importa vários XMLs, extrai a quantidade da caixa da própria descrição e calcula o custo novo já com ICMS-ST.', stack: 'JavaScript · jsPDF · SheetJS', demo: 'https://andre-jnr.github.io/entrada-nestle/', repo: 'https://github.com/andre-jnr/entrada-nestle' },
  { title: 'Custo Gouveia', cat: 'Fiscal', desc: 'Rateia o frete e o ICMS do frete do romaneio sobre todos os itens da nota, sem divergência entre faturistas.', stack: 'JavaScript · SheetJS', repo: 'https://github.com/andre-jnr/entrada-gouveia' },
  { title: 'Manual de Faturamento', cat: 'Fiscal', desc: 'Base de conhecimento do setor com GIFs passo a passo: entradas, saídas, CFOP, CST, NCM e matemática comercial.', stack: 'HTML · CSS', repo: 'https://github.com/andre-jnr/manual-faturamento' },
  { title: 'Central de Portais Fiscais', cat: 'Fiscal', desc: 'SEFAZ, SUFRAMA, consultas e sistemas de cada loja organizados por tema, a um clique.', stack: 'HTML · CSS · JS', demo: 'https://andre-jnr.github.io/painel-fiscal/', repo: 'https://github.com/andre-jnr/painel-fiscal' },
  { title: 'Notas Lançadas por Dia', cat: 'Fiscal', desc: 'Produtividade do faturamento: quantas notas foram lançadas por dia e por faturista.', stack: 'HTML · SQL Server', repo: 'https://github.com/andre-jnr/relatorio-de-nfe-lancadas' },

  { title: 'Gerador de Escala', cat: 'Operação', desc: 'Monta escalas de trabalho, confere as regras da CLT e guarda o histórico e as versões de cada escala.', stack: 'Flask · SQLite · Waitress', repo: 'https://github.com/andre-jnr/gerador-escala' },
  { title: 'Controle de Temperados', cat: 'Operação', desc: 'BI de vendas da semana com estoque regulador e reposição sugerida por produto, para bater a meta.', stack: 'Flask · Chart.js' },
  { title: 'Produção na Nuvem', cat: 'Operação', desc: 'Programação semanal de produção com meta, contagem e produção na mesma tela, acessível de qualquer lugar.', stack: 'Next.js · Supabase · Vercel' },
  { title: 'Movimentações de Estoque', cat: 'Operação', desc: 'Entradas e saídas registradas em rede, multiusuário, com relatórios por dia, semana e mês em quantidade e valor.', stack: 'Node.js · SQLite', repo: 'https://github.com/andre-jnr/movimentacoes-internas' },
  { title: 'Balanço com Código de Barras', cat: 'Operação', desc: 'Importa a leitura do app de código de barras e marca o que já foi contado no balanço.', stack: 'JavaScript', demo: 'https://andre-jnr.github.io/balanco-com-codigo-de-barras/', repo: 'https://github.com/andre-jnr/balanco-com-codigo-de-barras' },

  { title: 'Conciliação de Cartões', cat: 'Financeiro', desc: 'Cruza as vendas do sistema com os relatórios da adquirente e explica o motivo de cada divergência.', stack: 'JavaScript · SheetJS', repo: 'https://github.com/andre-jnr/conciliacao-financeira' },
  { title: 'Protocolo para Financeiro', cat: 'Financeiro', desc: 'Protocolo automático do malote de boletos, conferido na entrega. Acabou o extravio sem rastro.', stack: 'Node.js · SQL Server', repo: 'https://github.com/andre-jnr/protocolo-financeiro' },
  { title: 'Prestação de Contas da Obra', cat: 'Financeiro', desc: 'Gastos por categoria e mês, com demonstrativo em PDF que comprova o abatimento em aluguéis futuros.', stack: 'Node.js · PDF' },
  { title: 'Transferências entre Lojas', cat: 'Financeiro', desc: 'Relatório das notas de transferência entre as unidades da rede.', stack: 'JavaScript · SQL Server', repo: 'https://github.com/andre-jnr/relatorio-de-transferencias' },

  { title: 'DSA AI Coder', cat: 'IA & Ferramentas', desc: 'Agente de IA em Python que funciona como assistente de programação.', stack: 'Python · LLM', repo: 'https://github.com/andre-jnr/DSA-AI-Coder' },
  { title: 'Atlas', cat: 'IA & Ferramentas', desc: 'Painel local para catalogar projetos, com Kanban, histórico datado de tudo e área de ideias. Zero dependências.', stack: 'Node.js · JS puro', repo: 'https://github.com/andre-jnr/atlas' },
  { title: 'Excel em SQL', cat: 'IA & Ferramentas', desc: 'Converte planilhas do Excel em tabelas SQL prontas para consulta.', stack: 'Python · Jupyter', repo: 'https://github.com/andre-jnr/excel-em-sql' },
  { title: 'Fatores de Redução de Limites', cat: 'IA & Ferramentas', desc: 'Calculadora para laudos de Segurança do Trabalho. É o site rosa que fiz para a minha irmã.', stack: 'JavaScript', demo: 'https://andre-jnr.github.io/Calculo-dos-Fatores-de-Reducao-de-Limites/', repo: 'https://github.com/andre-jnr/Calculo-dos-Fatores-de-Reducao-de-Limites' }
];
