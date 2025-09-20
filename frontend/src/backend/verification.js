/**
 * SCRIPT DE VERIFICACIÓN DE DESPLIEGUE
 * Dashboard Docente - Copiloto Digital
 *
 * Este script verifica que el despliegue del backend esté funcionando correctamente
 */

// Configuración de verificación
const VERIFICATION_CONFIG = {
  apiUrl: 'YOUR_DEPLOYMENT_URL', // Reemplaza con tu URL real
  testTimeout: 10000, // 10 segundos
  expectedEndpoints: [
    'getFiles',
    'createFile',
    'updateFile',
    'deleteFile',
    'getCategories',
    'saveCollaboration',
    'getCollaborations',
    'analyzeWithAI'
  ]
};

/**
 * Función principal de verificación
 */
async function verifyDeployment() {
  console.log('🔍 Iniciando verificación del despliegue...');

  const results = {
    connectivity: false,
    endpoints: {},
    configuration: false,
    overall: false
  };

  try {
    // 1. Verificar conectividad básica
    console.log('📡 Verificando conectividad...');
    results.connectivity = await testConnectivity();

    // 2. Verificar endpoints
    console.log('🔗 Verificando endpoints...');
    results.endpoints = await testEndpoints();

    // 3. Verificar configuración
    console.log('⚙️ Verificando configuración...');
    results.configuration = await testConfiguration();

    // 4. Resultado general
    results.overall = results.connectivity && results.configuration &&
                     Object.values(results.endpoints).every(status => status);

    // Mostrar resultados
    displayResults(results);

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    displayResults(results);
  }
}

/**
 * Prueba la conectividad básica con la API
 */
async function testConnectivity() {
  try {
    const response = await fetch(VERIFICATION_CONFIG.apiUrl + '?action=test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'test' })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.success === true;

  } catch (error) {
    console.error('❌ Error de conectividad:', error.message);
    return false;
  }
}

/**
 * Prueba todos los endpoints disponibles
 */
async function testEndpoints() {
  const results = {};

  for (const endpoint of VERIFICATION_CONFIG.expectedEndpoints) {
    try {
      console.log(`  Testing ${endpoint}...`);

      const response = await fetch(VERIFICATION_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: endpoint,
          data: getTestData(endpoint),
          filters: getTestFilters(endpoint)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      results[endpoint] = data.success !== false; // Algunos endpoints pueden devolver success: false intencionalmente

    } catch (error) {
      console.error(`❌ Error en ${endpoint}:`, error.message);
      results[endpoint] = false;
    }
  }

  return results;
}

/**
 * Verifica la configuración del backend
 */
async function testConfiguration() {
  try {
    // Verificar que la configuración esté actualizada
    if (VERIFICATION_CONFIG.apiUrl.includes('YOUR_DEPLOYMENT_URL')) {
      console.error('❌ URL de despliegue no configurada');
      return false;
    }

    // Verificar formato de URL
    const urlPattern = /^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/;
    if (!urlPattern.test(VERIFICATION_CONFIG.apiUrl)) {
      console.error('❌ Formato de URL inválido');
      return false;
    }

    return true;

  } catch (error) {
    console.error('❌ Error verificando configuración:', error);
    return false;
  }
}

/**
 * Obtiene datos de prueba para un endpoint específico
 */
function getTestData(endpoint) {
  const testData = {
    createFile: {
      name: 'Archivo de Prueba - Verificación',
      type: 'document',
      category: 'test',
      content: 'Contenido de prueba para verificación'
    },
    updateFile: {
      id: 'test_file_id',
      name: 'Archivo Actualizado'
    },
    deleteFile: {
      id: 'test_file_id'
    },
    saveCollaboration: {
      fileId: 'test_file_id',
      action: 'test_verification',
      description: 'Verificación automática del despliegue',
      author: 'Sistema de Verificación'
    },
    analyzeWithAI: {
      content: 'Este es un contenido de prueba para análisis con IA',
      action: 'summarize'
    }
  };

  return testData[endpoint] || {};
}

/**
 * Obtiene filtros de prueba para un endpoint específico
 */
function getTestFilters(endpoint) {
  const testFilters = {
    getFiles: {
      category: 'test',
      limit: 5
    },
    getCollaborations: {
      limit: 10,
      user: 'test_user'
    }
  };

  return testFilters[endpoint] || {};
}

/**
 * Muestra los resultados de la verificación
 */
function displayResults(results) {
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESULTADOS DE VERIFICACIÓN');
  console.log('='.repeat(50));

  // Conectividad
  console.log(`📡 Conectividad: ${results.connectivity ? '✅ OK' : '❌ FALLÓ'}`);

  // Endpoints
  console.log('\n🔗 Endpoints:');
  for (const [endpoint, status] of Object.entries(results.endpoints)) {
    console.log(`  ${endpoint}: ${status ? '✅ OK' : '❌ FALLÓ'}`);
  }

  // Configuración
  console.log(`\n⚙️ Configuración: ${results.configuration ? '✅ OK' : '❌ FALLÓ'}`);

  // Resultado general
  console.log('\n' + '='.repeat(50));
  if (results.overall) {
    console.log('🎉 ¡DESPLIEGUE EXITOSO! Todo está funcionando correctamente.');
    console.log('🚀 El backend está listo para conectar con el frontend.');
  } else {
    console.log('⚠️ DESPLIEGUE INCOMPLETO. Revisa los errores arriba.');
    console.log('🔧 Soluciona los problemas y vuelve a ejecutar la verificación.');
  }
  console.log('='.repeat(50));

  // Recomendaciones
  if (!results.overall) {
    console.log('\n💡 RECOMENDACIONES:');
    if (!results.connectivity) {
      console.log('  - Verifica que la URL del despliegue sea correcta');
      console.log('  - Confirma que el proyecto de Apps Script esté desplegado');
    }
    if (!results.configuration) {
      console.log('  - Actualiza VERIFICATION_CONFIG.apiUrl con tu URL real');
      console.log('  - Verifica que el formato de la URL sea correcto');
    }
    if (Object.values(results.endpoints).some(status => !status)) {
      console.log('  - Revisa los logs de Apps Script para errores específicos');
      console.log('  - Verifica que todas las APIs estén autorizadas');
    }
  }
}

/**
 * Función de utilidad para ejecutar desde la consola del navegador
 */
window.verifyDeployment = verifyDeployment;

/**
 * Función para actualizar la URL de verificación
 */
window.setVerificationUrl = function(url) {
  VERIFICATION_CONFIG.apiUrl = url;
  console.log('🔗 URL de verificación actualizada:', url);
};

// Ejecutar verificación automáticamente si estamos en un navegador
if (typeof window !== 'undefined') {
  console.log('🔧 Script de verificación cargado.');
  console.log('📝 Para verificar el despliegue:');
  console.log('   1. Actualiza la URL: setVerificationUrl("TU_URL_AQUI")');
  console.log('   2. Ejecuta: verifyDeployment()');
}
