/**
 * CONFIGURACIÓN TEMPORAL PARA DESPLIEGUE
 * Dashboard Docente - Copiloto Digital
 *
 * Este archivo se usa durante el proceso de despliegue.
 * Una vez completado, reemplaza el contenido de config.js
 */

import { API_CONFIG, DEV_CONFIG, OAUTH_CONFIG, APP_CONFIG } from './config.js';

// Configuración temporal con URLs de despliegue
export const TEMP_API_CONFIG = {
  // ⬇️ REEMPLAZA con tu URL real después del despliegue
  BASE_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',

  ENDPOINTS: API_CONFIG.ENDPOINTS,
  TIMEOUT: API_CONFIG.TIMEOUT,
  RETRIES: API_CONFIG.RETRIES,
  DEBUG: API_CONFIG.DEBUG
};

// Configuración temporal de desarrollo
export const TEMP_DEV_CONFIG = {
  // ⬇️ CAMBIA a false después del despliegue exitoso
  USE_MOCK_DATA: true,

  LOG_LEVEL: DEV_CONFIG.LOG_LEVEL,
  TEST_MODE: DEV_CONFIG.TEST_MODE
};

/**
 * FUNCIONES DE AYUDA PARA EL DESPLIEGUE
 */

/**
 * Actualiza la URL del despliegue
 * @param {string} deploymentUrl - URL obtenida del despliegue
 */
export function updateDeploymentUrl(deploymentUrl) {
  if (!deploymentUrl || !deploymentUrl.includes('script.google.com')) {
    console.error('❌ URL de despliegue inválida');
    return false;
  }

  TEMP_API_CONFIG.BASE_URL = deploymentUrl;
  console.log('✅ URL de despliegue actualizada:', deploymentUrl);
  return true;
}

/**
 * Cambia a modo producción (desactiva datos mock)
 */
export function switchToProduction() {
  TEMP_DEV_CONFIG.USE_MOCK_DATA = false;
  console.log('🔄 Cambiado a modo producción - usando backend real');
  console.log('💡 Reinicia el servidor para aplicar cambios');
}

/**
 * Cambia a modo desarrollo (activa datos mock)
 */
export function switchToDevelopment() {
  TEMP_DEV_CONFIG.USE_MOCK_DATA = true;
  console.log('🔄 Cambiado a modo desarrollo - usando datos mock');
  console.log('💡 Reinicia el servidor para aplicar cambios');
}

/**
 * Verifica si la configuración está lista para producción
 */
export function checkProductionReady() {
  const checks = [
    {
      name: 'URL de despliegue',
      status: TEMP_API_CONFIG.BASE_URL !== 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
      message: 'Actualiza la URL del despliegue con updateDeploymentUrl()'
    },
    {
      name: 'Modo datos mock',
      status: !TEMP_DEV_CONFIG.USE_MOCK_DATA,
      message: 'Desactiva datos mock con switchToProduction()'
    }
  ];

  console.log('\n🔍 VERIFICACIÓN DE CONFIGURACIÓN:');
  console.log('='.repeat(50));

  let allReady = true;
  checks.forEach(check => {
    const icon = check.status ? '✅' : '❌';
    console.log(`${icon} ${check.name}: ${check.status ? 'OK' : 'PENDIENTE'}`);
    if (!check.status) {
      console.log(`   💡 ${check.message}`);
      allReady = false;
    }
  });

  console.log('='.repeat(50));

  if (allReady) {
    console.log('🎉 ¡Configuración lista para producción!');
    console.log('🚀 El frontend está conectado con el backend real.');
  } else {
    console.log('⚠️ Configuración incompleta. Completa los pasos pendientes.');
  }

  return allReady;
}

/**
 * Prueba la conexión con el backend desplegado
 */
export async function testBackendConnection() {
  try {
    console.log('🔗 Probando conexión con backend...');

    const response = await fetch(TEMP_API_CONFIG.BASE_URL + '?action=test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'test' })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      console.log('✅ Conexión exitosa con el backend');
      console.log('📊 Respuesta del servidor:', data);
      return true;
    } else {
      console.log('⚠️ Backend respondió pero con error:', data.error);
      return false;
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('💡 Posibles causas:');
    console.log('   - URL de despliegue incorrecta');
    console.log('   - Proyecto no desplegado');
    console.log('   - Permisos insuficientes');
    console.log('   - CORS bloqueado');
    return false;
  }
}

/**
 * Genera el contenido final para config.js
 */
export function generateFinalConfig() {
  const finalConfig = `/**
 * CONFIGURACIÓN FINAL - DESPLIEGUE COMPLETADO
 * Dashboard Docente - Copiloto Digital
 */

export const API_CONFIG = ${JSON.stringify(TEMP_API_CONFIG, null, 2)};

export const OAUTH_CONFIG = ${JSON.stringify(OAUTH_CONFIG, null, 2)};

export const APP_CONFIG = ${JSON.stringify(APP_CONFIG, null, 2)};

export const DEV_CONFIG = ${JSON.stringify(TEMP_DEV_CONFIG, null, 2)};

// ... resto del archivo config.js original
`;

  console.log('📄 Configuración final generada:');
  console.log('💡 Copia este contenido a src/config.js');
  console.log(finalConfig);

  return finalConfig;
}

/**
 * Resetea la configuración temporal
 */
export function resetTempConfig() {
  TEMP_API_CONFIG.BASE_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
  TEMP_DEV_CONFIG.USE_MOCK_DATA = true;
  console.log('🔄 Configuración temporal reseteada');
}

// Funciones globales para consola
if (typeof window !== 'undefined') {
  window.updateDeploymentUrl = updateDeploymentUrl;
  window.switchToProduction = switchToProduction;
  window.switchToDevelopment = switchToDevelopment;
  window.checkProductionReady = checkProductionReady;
  window.testBackendConnection = testBackendConnection;
  window.generateFinalConfig = generateFinalConfig;
  window.resetTempConfig = resetTempConfig;

  console.log('🔧 Herramientas de despliegue cargadas:');
  console.log('   📝 updateDeploymentUrl(url)');
  console.log('   🔄 switchToProduction() / switchToDevelopment()');
  console.log('   🔍 checkProductionReady()');
  console.log('   🔗 testBackendConnection()');
  console.log('   📄 generateFinalConfig()');
}
