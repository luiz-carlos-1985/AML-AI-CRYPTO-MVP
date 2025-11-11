"""
Script para gerar apresentações ultra modernas
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from modern_presentation_generator import generate_modern_reveal_js
from presentation_generator import PresentationGenerator

def main():
    """Função principal"""
    print("Gerando apresentações ultra modernas CryptoGuard AI...")
    
    # Gerar apresentações modernas
    modern_en = generate_modern_reveal_js('en')
    modern_pt = generate_modern_reveal_js('pt')
    
    generator = PresentationGenerator()
    
    # Gerar PowerPoint em inglês e português
    ppt_en = generator.generate_powerpoint('en')
    ppt_pt = generator.generate_powerpoint('pt')
    
    # Gerar scripts LibreOffice
    libre_en = generator.generate_libreoffice_script('en')
    libre_pt = generator.generate_libreoffice_script('pt')
    
    print("\nArquivos gerados:")
    print(f"Apresentação Ultra Moderna Inglês: {modern_en}")
    print(f"Apresentação Ultra Moderna Português: {modern_pt}")
    print(f"PowerPoint Inglês: {ppt_en}")
    print(f"PowerPoint Português: {ppt_pt}")
    print(f"LibreOffice Inglês: {libre_en}")
    print(f"LibreOffice Português: {libre_pt}")
    
    print("\nInstruções:")
    print("1. Ultra Modernas: Abra os arquivos CryptoGuard_Modern_*.html no navegador")
    print("2. PowerPoint: Abra os arquivos .pptx no Microsoft PowerPoint")
    print("3. LibreOffice: Use os scripts .txt para criar apresentação no Impress")
    print("\nAs apresentações ultra modernas incluem:")
    print("- Animações avançadas com Anime.js")
    print("- Partículas interativas")
    print("- Gráficos dinâmicos com Chart.js")
    print("- Design cyberpunk futurista")
    print("- Efeitos visuais 3D")

if __name__ == "__main__":
    main()