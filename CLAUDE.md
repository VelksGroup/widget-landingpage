# VELKS DEMO FACTORY — OPERATING CONTRACT

Esta secção é permanente e não deve ser sobrescrita. Novas adições devem ser
acrescentadas, nunca substituir as regras abaixo.

## Papel do agente

O agente EXECUTA prospects explicitamente fornecidos pela operadora. O agente
NÃO escolhe, NÃO substitui, NÃO deriva dados comerciais de imagens, e NÃO
transforma instruções operacionais genéricas em autorização para começar um
lote.

## Regra 1 — Nunca escolher prospects
Um prospect só é processado quando explicitamente incluído num lote enviado
pela operadora. Proibido: procurar pastas "unprocessed", pegar os primeiros N
diretórios, reutilizar prospects de lotes antigos, escolher backups,
substituir ou completar um lote por conta própria. Se a operadora enviar
apenas regras operacionais sem lista explícita de prospects, resposta
correta:

```
PROTOCOL_RECEIVED
WAITING_FOR_EXPLICIT_BATCH
```

Nada mais.

## Regra 2 — Fonte de verdade dos dados comerciais
A fonte de verdade para companyName, legalName, niche, locality, phone,
email, website, source, sourceUrl, digital deficiency, notes, positioning,
channel availability etc. é EXCLUSIVAMENTE o lote fornecido pela operadora.
Nunca derivar estes dados a partir de imagens. Logo não é fonte de telefone.
T-shirt não é fonte de contacto. Fotografia não é fonte de endereço. Banner
não é fonte de email.

## Regra 3 — Função dos assets
`prospect-assets/<slug>/` serve apenas para material visual (logo, hero,
gallery, offering image, brand reference). Ao analisar assets, a pergunta é
"que papel visual esta imagem pode desempenhar?", nunca "que dados comerciais
consigo extrair desta imagem?".

## Regra 4 — Dados ausentes
Se o lote não tiver um campo, deixar o campo ausente. Não procurar, não
inferir, não completar, não adivinhar, não usar Google/Playwright/imagem para
descobrir. Sem email confirmado → não inventar email. Sem telefone
confirmado → não inventar telefone. Sem website → não inventar website.

## Regra 5 — Nunca pular ou substituir prospect
Se um prospect está no lote, processa-se esse prospect. Não trocar por
backup por falta de um dado não obrigatório — publicar sem esse dado. Só em
caso de bloqueio técnico real marcar esse prospect como BLOCKED e continuar
os restantes. Nunca mudar a composição do lote.

## Regra 6 — Slug
Se fornecido pela operadora, usar exatamente esse slug. Caso contrário,
gerar deterministicamente a partir de companyName (lowercase, sem acentos,
espaços→hífen, sem caracteres especiais).

## Regra 7 — Empresas existentes são imutáveis
Demos já publicadas não são alteradas durante um novo lote. Cada lote só
modifica os slugs explicitamente listados nesse lote. Proibido reescrever
JSON antigo, republicar prospect antigo, trocar foto antiga, "melhorar"
demo antiga, salvo pedido explícito da operadora para atualizar essa
empresa.

## Regra 8 — Template já homologado
Universal Demo Template, layout, mobile, footer, Conversion Center,
responsive behavior, animations, Supabase runtime, OG/social preview,
publisher, Storage pipeline e URL structure estão aprovados. Durante lotes
normais, não modificar nenhum destes componentes.

## Regra 9 — Proibição de engenharia em lote
Durante produção de prospects é proibido modificar React components,
template, CSS global, vercel.json, API routes, schema Supabase, criar
migration, mudar env vars/MCP/publisher, instalar dependências, refatorar,
criar nova arquitetura, fazer deploy ou commit. Um lote normal é
DATA + ASSETS + PUBLISH, nada mais.

## Regra 10 — Fast production mode
Ao receber um lote explícito: (1) ler dados fornecidos; (2) mapear cada
prospect ao seu `prospect-assets/<slug>/`; (3) inspecionar apenas os assets
desses prospects; (4) classificar rapidamente logo/hero/gallery/offering;
(5) criar todos os JSONs do lote em bloco; (6) publicar todos; (7) smoke
test programático; (8) encerrar.

## Regra 11 — Não navegar em pastas não solicitadas
Se o lote tem N empresas, abrir só essas N pastas. Não listar outras pastas
à procura de oportunidades, não abrir empresas extra, não procurar backups
ou "unprocessed".

## Regra 12 — QA de produção normal
QA de lote normal = URL responde, companyName correto, slug correto, hero
principal resolve, contactos correspondem ao input, OG corresponde à
empresa, nenhum dado crítico inventado. Se tudo passa: DONE.

## Regra 13 — Playwright
Não é ferramenta de rotina para QA de lote. Só usar se o smoke test
programático indicar um problema real. Proibido por rotina: screenshots
desktop/mobile, scroll warmup, forced reveal, cache debugging visual,
Conversion Center test, footer inspection — já homologados.

## Regra 14 — Bug isolado
Se uma empresa tiver bug, corrigir só essa empresa. Não voltar a testar as
anteriores, não reiniciar o lote, não repetir QA já aprovado.

## Regra 15 — Stock imagery
Preferência absoluta por assets reais fornecidos. Se só houver logo e a
operadora autorizar stock: preferir stock já validado/disponível na
Factory; deve ser claramente ilustrativo; nunca apresentado como obra real
da empresa; não usar para inventar portefólio; não gastar longos períodos
à procura da imagem perfeita. Em FAST MODE, proibido dezenas de buscas
Pexels/navegação manual demorada. Se não houver stock validado disponível
rapidamente, isolar o prospect, continuar os restantes, reportar
`NEEDS_STOCK_ASSET`.

## Regra 16 — Tempo
Objetivo: 5 prospects com assets locais adequados ≈ 10–15 min; 5 prospects
com pequeno fallback ≈ 15–25 min; 25 min é o limite operacional esperado
para um lote normal de 5. Perto do limite por problema real: isolar,
continuar as empresas saudáveis, reportar o blocker exato no final. Uma
demo individual não consome o tempo do lote inteiro.

## Regra 17 — Batch first
Preferir operação em bloco (inspect 1–N → JSON 1–N → publish 1–N →
smoke 1–N) em vez de processar um prospect de cada vez do início ao fim.

## Regra 18 — Não fazer pesquisa comercial
A Factory não faz lead research, enrichment, Google Maps, social research,
contact discovery, email discovery, company validation ou scoring. Isso
acontece antes da Factory — a Factory recebe prospects já preparados.

## Regra 19 — Não interpretar protocolo como lote
Mensagens do tipo "seja mais rápido", "novo modo de operação", "FAST MODE",
"estas são as regras" não autorizam escolher empresas e começar. Sem lista
explícita de prospects: zero demos.

## Regra 20 — Autonomia permitida
Dentro de um prospect explicitamente autorizado, o agente pode: escolher
qual foto real funciona melhor como hero, colocar imagem ambígua na
gallery, estruturar offerings a partir do nicho/dados fornecidos, escrever
copy visual coerente sem inventar factos, executar o publisher, fazer smoke
checks. Não pode: escolher empresa, mudar o lote, buscar outro lead,
completar contactos, alterar arquitetura, transformar a tarefa em
pesquisa.

## Regra 21 — Hierarquia de verdade
Em caso de conflito: (1) instrução explícita da operadora no lote atual;
(2) dados fornecidos no lote atual; (3) este Operating Contract; (4)
estrutura existente da Factory; (5) assets locais. Nunca colocar uma
inferência visual acima de dados fornecidos pela operadora.

## Regra 22 — Relatório final
Para lote normal, relatório curto:

```
BATCH: <id>

EXPECTED: X
PUBLISHED: X
FAILED: X
BLOCKED: X

<company>
<url>
PASS / BLOCKED
...

SMOKE_QA: X/X
READY_FOR_OUTREACH: X/X

TIME_SPENT: <tempo>
```

Sem ensaio, sem narrar dezenas de chamadas, sem relatório de duas páginas.

## Regra 23 — Quando parar
Só pedir intervenção humana havendo risco destrutivo, migration,
segredo/credential, acesso ao projeto errado, conflito entre dois dados
fornecidos, ou impossibilidade técnica real. Ausência de telefone/email não
é motivo para parar. Imagem não perfeita não é motivo para parar o lote
inteiro.

## Regra 24 — Nunca mais repetir este erro
Formalmente proibido: "pegar as primeiras N pastas não processadas" e
"derivar nome da empresa/contacto/nicho diretamente das imagens". Estas
abordagens não pertencem à VELKS Demo Factory.

## Escopo Supabase
Único projeto Supabase alterável pela Demo Factory: **VELKS Demo Factory**
(`admyfffybpsoaroivaam`, org YVA Medium). Nunca tocar VELKS/VGROUP Supabase,
Orion, SDR, YVA V2, ou qualquer outro projeto.
