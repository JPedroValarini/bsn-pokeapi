# 📄 Documentação Técnica — BSN-Pokédex

Este projeto foi desenvolvido com foco na experiência do usuário (UX) e na responsividade para múltiplos dispositivos. Busquei manter um código limpo, modular e fiel às boas práticas do Angular 16+ com componentes standalone. A arquitetura segue um padrão de serviços bem definidos e desacoplados. A interface utiliza o Ionic com ícones personalizados para otimizar performance e legibilidade. Os estilos foram aplicados com cuidado para gerar um visual moderno, com sombras sutis, bordas arredondadas e toques visuais de cor baseados na espécie dos Pokémons. O sistema de favoritos é simples e intuitivo, com feedback em tempo real via toast. A paginação é acessível e clara, com botões com formato arredondado e efeitos visuais sem poluir a UI. O layout foi testado em telas pequenas e grandes para garantir consistência. Toda a lógica foi encapsulada com `inject()` para facilitar testes e manutenção.

---

## 📁 Localização do Componente
- **Arquivo HTML**: `src/app/pages/home/home.page.html`
- **Arquivo SCSS**: `src/app/pages/home/home.page.scss`
- **Arquivo TS**: `src/app/pages/home/home.page.ts`

---

## 🧩 Funcionalidade Principal
A página "Home" exibe uma **grade de cards de Pokémons**, consumidos de uma API paginada. Oferece:
- Paginação
- Ação de favoritar/desfavoritar
- Exibição responsiva com layout moderno
- Feedback visual por meio de toasts

---

### 📱 Responsividade
- Grade responsiva com `grid-template-columns` adaptável (ex: `minmax(220px, 1fr)`)
- Ajustes em tamanhos de imagem e fonte em telas menores (`max-width: 600px`)

---

### 📑 Paginação
- Toolbar customizada (`pagination-toolbar`) com:
  - Botões "Anterior" e "Próxima" com ícones e sombra
  - Texto de indicação de página atual
- Comportamento UX aprimorado:
  - Remoção de flash azul ao clicar nos botões
  - Estilo `fill="outline"` + `shape="round"`

---

## ❤️ Funcionalidade de Favoritos
- A função `isFavorite(pokemonId: number)` consulta `pokemonService.favorites()` e verifica se o ID está salvo
- `toggleFavorite(pokemon)` alterna o estado e mostra feedback por toast

---

## 🧪 Observações Técnicas
- Uso de `addIcons()` da `ionicons` para incluir apenas os ícones usados
- Uso do `inject()` para simplificar dependências (`ToastController`, `PokemonService`)
- Modularização via `standalone: true` no componente Angular
