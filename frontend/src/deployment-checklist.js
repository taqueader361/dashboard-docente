/**
 * CHECKLIST INTERACTIVO DE DESPLIEGUE
 * Dashboard Docente - Copiloto Digital
 *
 * Este archivo contiene funciones para verificar el progreso
 * del despliegue paso a paso
 */

// Estado del despliegue
const DEPLOYMENT_STATUS = {
  step1: { completed: false, description: "Crear carpeta en Google Drive" },
  step2: { completed: false, description: "Crear proyecto en Google Apps Script" },
  step3: { completed: false, description: "Configurar servicios API" },
  step4: { completed: false, description: "Actualizar configuración del proyecto" },
  step5: { completed: false, description: "Ejecutar configuración inicial" },
  step6: { completed: false, description: "Desplegar como aplicación web" },
  step7: { completed: false, description: "Configurar frontend" },
  step8: { completed: false, description: "Verificar funcionamiento" }
};

// Configuración recopilada durante el despliegue
const DEPLOYMENT_CONFIG = {
  driveFolderId: '',
  scriptProjectId: '',
  deploymentUrl: '',
  spreadsheetUrl: ''
};

/**
 * Función principal para mostrar el checklist
 */
function showDeploymentChecklist() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 CHECKLIST DE DESPLIEGUE - DASHBOARD DOCENTE');
  console.log('='.repeat(60));

  Object.entries(DEPLOYMENT_STATUS).forEach(([step, status]) => {
    const icon = status.completed ? '✅' : '⏳';
    const stepNumber = step.replace('step', '');
    console.log(`${icon} PASO ${stepNumber}: ${status.description}`);
  });

  console.log('\n' + '='.repeat(60));
  showNextSteps();
  console.log('='.repeat(60));
}

/**
 * Muestra los próximos pasos a seguir
 */
function showNextSteps() {
  const nextStep = Object.entries(DEPLOYMENT_STATUS).find(([_, status]) => !status.completed);

  if (nextStep) {
    const [stepKey, stepInfo] = nextStep;
    const stepNumber = stepKey.replace('step', '');

    console.log(`\n🎯 PRÓXIMO PASO: ${stepNumber}`);
    console.log(`Descripción: ${stepInfo.description}`);

    switch (stepKey) {
      case 'step1':
        showStep1Instructions();
        break;
      case 'step2':
        showStep2Instructions();
        break;
      case 'step3':
        showStep3Instructions();
        break;
      case 'step4':
        showStep4Instructions();
        break;
      case 'step5':
        showStep5Instructions();
        break;
      case 'step6':
        showStep6Instructions();
        break;
      case 'step7':
        showStep7Instructions();
        break;
      case 'step8':
        showStep8Instructions();
        break;
    }
  } else {
    console.log('\n🎉 ¡FELICITACIONES! Todos los pasos completados.');
    console.log('🚀 Tu Dashboard Docente está listo para usar.');
  }
}

/**
 * Instrucciones detalladas para cada paso
 */
function showStep1Instructions() {
  console.log('\n📁 PASO 1: CREAR CARPETA EN GOOGLE DRIVE');
  console.log('1. Ve a https://drive.google.com');
  console.log('2. Haz clic en "Nuevo" → "Carpeta"');
  console.log('3. Nombra la carpeta: "Dashboard Docente"');
  console.log('4. Comparte la carpeta (obtén el ID de la URL)');
  console.log('\n💡 Comando para marcar como completado:');
  console.log('   completeStep(1, "FOLDER_ID_AQUI")');
}

function showStep2Instructions() {
  console.log('\n📝 PASO 2: CREAR PROYECTO EN GOOGLE APPS SCRIPT');
  console.log('1. Ve a https://script.google.com');
  console.log('2. Haz clic en "Nuevo proyecto"');
  console.log('3. Nombra el proyecto: "Dashboard Docente - Copiloto Digital"');
  console.log('4. Borra el código por defecto');
  console.log('5. Copia y pega el contenido de Code.gs');
  console.log('\n💡 Comando para marcar como completado:');
  console.log('   completeStep(2)');
}

function showStep3Instructions() {
  console.log('\n🔧 PASO 3: CONFIGURAR SERVICIOS API');
  console.log('1. En Apps Script, ve a "Servicios" (icono +)');
  console.log('2. Agrega "Google Drive API"');
  console.log('3. Agrega "Google Sheets API"');
  console.log('4. Agrega "Google Gemini API" (opcional)');
  console.log('\n💡 Comando para marcar como completado:');
  console.log('   completeStep(3)');
}

function showStep4Instructions() {
  console.log('\n⚙️ PASO 4: ACTUALIZAR CONFIGURACIÓN');
  console.log('1. En Code.gs, busca: FOLDER_ID: \'YOUR_DRIVE_FOLDER_ID\'');
  console.log('2. Reemplaza con el ID real de tu carpeta');
  console.log('3. Verifica que la configuración sea correcta');
  console.log('\n💡 Comando para marcar como completado:');
  console.log('   completeStep(4)');
}

function showStep5Instructions() {
  console.log('\n🚀 PASO 5: EJECUTAR CONFIGURACIÓN INICIAL');
  console.log('1. En Apps Script, ejecuta: setupProject()');
  console.log('2. Autoriza los permisos cuando se solicite');
  console.log('3. Revisa los logs para confirmar éxito');
  console.log('4. Copia las URLs generadas');
  console.log('\n💡 Comando para marcar como completado:');
  console.log('   completeStep(5, "SPREADSHEET_URL", "SCRIPT_PROJECT_ID")');
}

function showStep6Instructions() {
  console.log('\n🌐 PASO 6: DESPLEGAR COMO APLICACIÓN WEB');
  console.log('1. Ve a "Desplegar" → "Nueva implementación"');
  console.log('2. Selecciona tipo "Aplicación web"');
  console.log('3. Configura:');
  console.log('   - Descripción: "Dashboard Docente API"');
  console.log('   - Ejecutar como: "Yo"');
  console.log('   - Quién tiene acceso: "Cualquiera"');
  console.log('4. Copia la URL de despliegue');
  console.log('\n💡 Comando para marcar como completado:');
  console.log('   completeStep(6, "DEPLOYMENT_URL")');
}

function showStep7Instructions() {
  console.log('\n🔗 PASO 7: CONFIGURAR FRONTEND');
  console.log('1. Abre src/config.js');
  console.log('2. Actualiza API_CONFIG.BASE_URL con la URL real');
  console.log('3. Cambia DEV_CONFIG.USE_MOCK_DATA = false');
  console.log('4. Reinicia el servidor de desarrollo');
  console.log('\n💡 Comando para marcar como completado:');
  console.log('   completeStep(7)');
}

function showStep8Instructions() {
  console.log('\n✅ PASO 8: VERIFICAR FUNCIONAMIENTO');
  console.log('1. Abre la aplicación en el navegador');
  console.log('2. Verifica que cargue archivos reales');
  console.log('3. Prueba crear/editar/eliminar archivos');
  console.log('4. Confirma que los filtros funcionen');
  console.log('\n💡 Comando para marcar como completado:');
  console.log('   completeStep(8)');
}

/**
 * Función para marcar un paso como completado
 */
function completeStep(stepNumber, ...params) {
  const stepKey = `step${stepNumber}`;

  if (DEPLOYMENT_STATUS[stepKey]) {
    DEPLOYMENT_STATUS[stepKey].completed = true;

    // Guardar configuración si se proporciona
    switch (stepNumber) {
      case 1:
        DEPLOYMENT_CONFIG.driveFolderId = params[0] || '';
        break;
      case 5:
        DEPLOYMENT_CONFIG.spreadsheetUrl = params[0] || '';
        DEPLOYMENT_CONFIG.scriptProjectId = params[1] || '';
        break;
      case 6:
        DEPLOYMENT_CONFIG.deploymentUrl = params[0] || '';
        break;
    }

    console.log(`✅ PASO ${stepNumber} marcado como completado`);
    showDeploymentChecklist();
  } else {
    console.error(`❌ Paso ${stepNumber} no encontrado`);
  }
}

/**
 * Función para mostrar la configuración recopilada
 */
function showDeploymentConfig() {
  console.log('\n🔧 CONFIGURACIÓN RECOPILADA:');
  console.log('='.repeat(40));
  console.log(`📁 ID de carpeta Drive: ${DEPLOYMENT_CONFIG.driveFolderId || 'No configurado'}`);
  console.log(`📊 URL de hoja de cálculo: ${DEPLOYMENT_CONFIG.spreadsheetUrl || 'No configurado'}`);
  console.log(`🔗 ID del proyecto Script: ${DEPLOYMENT_CONFIG.scriptProjectId || 'No configurado'}`);
  console.log(`🌐 URL de despliegue: ${DEPLOYMENT_CONFIG.deploymentUrl || 'No configurado'}`);
  console.log('='.repeat(40));
}

/**
 * Función para resetear el progreso
 */
function resetDeployment() {
  Object.keys(DEPLOYMENT_STATUS).forEach(key => {
    DEPLOYMENT_STATUS[key].completed = false;
  });

  Object.keys(DEPLOYMENT_CONFIG).forEach(key => {
    DEPLOYMENT_CONFIG[key] = '';
  });

  console.log('🔄 Progreso de despliegue reseteado');
  showDeploymentChecklist();
}

/**
 * Función para verificar el estado actual
 */
function checkDeploymentStatus() {
  const completedSteps = Object.values(DEPLOYMENT_STATUS).filter(status => status.completed).length;
  const totalSteps = Object.keys(DEPLOYMENT_STATUS).length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  console.log(`\n📊 PROGRESO DEL DESPLIEGUE: ${completedSteps}/${totalSteps} pasos completados (${progress}%)`);

  if (progress === 100) {
    console.log('🎉 ¡Despliegue completado! Tu Dashboard Docente está listo.');
  } else {
    console.log(`⏭️  Próximo paso: ${Object.entries(DEPLOYMENT_STATUS).find(([_, status]) => !status.completed)?.[1].description}`);
  }
}

// Funciones globales para usar desde la consola
window.showDeploymentChecklist = showDeploymentChecklist;
window.completeStep = completeStep;
window.showDeploymentConfig = showDeploymentConfig;
window.resetDeployment = resetDeployment;
window.checkDeploymentStatus = checkDeploymentStatus;

// Mostrar checklist al cargar
if (typeof window !== 'undefined') {
  console.log('🚀 Checklist de despliegue cargado. Ejecuta: showDeploymentChecklist()');
}
