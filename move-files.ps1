# Créer les dossiers nécessaires s'ils n'existent pas
New-Item -ItemType Directory -Force -Path "client/src/components"
New-Item -ItemType Directory -Force -Path "client/public"
New-Item -ItemType Directory -Force -Path "server/models"

# Déplacer les fichiers frontend
Move-Item -Path "src/*" -Destination "client/src/" -Force
Move-Item -Path "public/*" -Destination "client/public/" -Force

# Déplacer les fichiers backend
Move-Item -Path "models/*" -Destination "server/models/" -Force
Move-Item -Path "server.js" -Destination "server/" -Force
Move-Item -Path ".env" -Destination "server/" -Force

# Nettoyer les dossiers vides
Remove-Item -Path "src" -Force -Recurse
Remove-Item -Path "public" -Force -Recurse
Remove-Item -Path "models" -Force -Recurse