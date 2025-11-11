"""
Executar gerador de apresentações modernas
"""

from modern_presentation_generator import generate_modern_reveal_js
from modern_content import get_modern_content_en, get_modern_content_pt

def main():
    print("Gerando apresentações ultra modernas CryptoGuard AI...")
    
    # Gerar apresentações modernas
    modern_en = generate_modern_reveal_js('en')
    modern_pt = generate_modern_reveal_js('pt')
    
    print(f"\nArquivos ultra modernos gerados:")
    print(f"Inglês: {modern_en}")
    print(f"Português: {modern_pt}")
    
    print(f"\nCaracterísticas das apresentações:")
    print("Design cyberpunk futurista")
    print("Gradientes e efeitos neon")
    print("Animações avançadas com Anime.js")
    print("Partículas interativas")
    print("Gráficos dinâmicos com Chart.js")
    print("Efeitos hover e transições 3D")
    print("Tipografia moderna (Orbitron + Exo 2)")
    print("Backgrounds animados")
    print("Elementos interativos")
    
    print(f"\nPara visualizar:")
    print(f"1. Abra {modern_en} no navegador (versão inglês)")
    print(f"2. Abra {modern_pt} no navegador (versão português)")
    print("3. Use as setas do teclado para navegar")
    print("4. Pressione F11 para tela cheia")

if __name__ == "__main__":
    main()