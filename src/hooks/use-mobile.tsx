/**
 * @fileoverview Hook customizado para detectar se a viewport corresponde a um dispositivo móvel.
 * Útil para renderizar componentes diferentes ou aplicar lógica específica para mobile/desktop.
 */
import * as React from "react"

// Define o ponto de quebra (breakpoint) para considerar a tela como "móvel".
const MOBILE_BREAKPOINT = 768 // (telas menores que 768px)

/**
 * Hook `useIsMobile` que retorna `true` se a largura da janela for menor que o breakpoint móvel.
 * @returns {boolean} `true` se for um dispositivo móvel, `false` caso contrário.
 * O valor inicial é `undefined` para evitar problemas de hidratação no Next.js (server-side rendering).
 */
export function useIsMobile() {
  // Estado para armazenar o resultado da verificação.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // `window.matchMedia` é a API do navegador para verificar media queries.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Função de callback que será chamada quando a condição da media query mudar.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Adiciona o listener para o evento 'change'.
    mql.addEventListener("change", onChange)
    
    // Define o estado inicial na primeira renderização do lado do cliente.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Função de limpeza: remove o listener quando o componente é desmontado
    // para evitar vazamentos de memória.
    return () => mql.removeEventListener("change", onChange)
  }, []) // O array vazio `[]` garante que este efeito rode apenas uma vez, na montagem do componente.

  return !!isMobile // Converte o valor para booleano, tratando o `undefined` inicial como `false`.
}
