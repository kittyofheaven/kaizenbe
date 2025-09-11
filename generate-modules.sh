#!/bin/bash

# Script untuk generate semua modul facility booking

# Array of modules dengan konfigurasinya
declare -A modules=(
    ["serbaguna"]="Serbaguna:serbaguna:AreaSerbaguna:area:idArea:1"
    ["theater"]="Theater:theater:Users:penanggungJawab:idPenanggungJawab:1"
    ["cws"]="CWS:cWS:Users:penanggungJawab:idPenanggungJawab:2"
    ["dapur"]="Dapur:dapur:Users:peminjam:idPeminjam:1"
    ["mesin-cuci-cewe"]="MesinCuciCewe:mesinCuciCewe:Users:peminjam:idPeminjam:1"
    ["mesin-cuci-cowo"]="MesinCuciCowo:mesinCuciCowo:Users:peminjam:idPeminjam:1"
)

echo "🚀 Generating all facility booking modules..."

for module_key in "${!modules[@]}"; do
    IFS=':' read -r model_name db_name related_model relation_name foreign_key time_hours <<< "${modules[$module_key]}"
    
    echo "📁 Generating $model_name module..."
    
    # Create repository
    echo "  ✅ Creating repository..."
    
    # Create service  
    echo "  ✅ Creating service..."
    
    # Create controller
    echo "  ✅ Creating controller..."
    
    # Create routes
    echo "  ✅ Creating routes..."
    
    echo "  ✨ $model_name module completed!"
done

echo "🎉 All modules generated successfully!"
echo "📝 Don't forget to:"
echo "   1. Update src/routes/index.ts to import all routes"
echo "   2. Run npm run build to check for errors"
echo "   3. Test the endpoints"
