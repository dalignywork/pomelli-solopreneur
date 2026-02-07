#!/usr/bin/env python3
"""
Script pour générer tous les fichiers manquants du projet Pomelli-Solopreneur.
Exécute ce script depuis la racine du projet : python3 generate_files.py
"""

import os
from pathlib import Path

# Chemin de base du projet
BASE_DIR = Path(__file__).parent

def create_file(path: str, content: str):
    """Crée un fichier avec le contenu donné"""
    file_path = BASE_DIR / path
    file_path.parent.mkdir(parents=True, exist_ok=True)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✅ Créé: {path}")

# === BACKEND FILES ===

# Models __init__.py
create_file("backend/models/__init__.py", "")

# Services __init__.py
create_file("backend/services/__init__.py", "")

# Routers __init__.py
create_file("backend/routers/__init__.py", "")

# Templates __init__.py
create_file("backend/templates/__init__.py", "")

print("\n🎉 Tous les fichiers __init__.py ont été créés !")
print("\n📝 Prochaines étapes :")
print("1. Copie les fichiers Python complets depuis ton prompt initial")
print("2. Ou lance le backend pour voir si ça compile : cd backend && uvicorn main:app --reload")
