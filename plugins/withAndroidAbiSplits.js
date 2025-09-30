const { withAppBuildGradle } = require('@expo/config-plugins');

// Instrui o sistema de build do Android a gerar APKs separados.
const gradleSplitsBlock = `
    splits {
        abi {
            enable true
            reset()
            include "armeabi-v7a", "arm64-v8a"
            universalApk false
        }
    }
`;

/**
 * Modifica o app/build.gradle para adicionar o bloco de configuração 'splits'.
 * @param {import('@expo/config-plugins').ExportedConfig} config
 * @returns {import('@expo/config-plugins').ExportedConfig}
 */
const withAndroidAbiSplits = (config) => {
  return withAppBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;

    // Verifica se o bloco 'splits' já não existe para evitar duplicação
    if (!buildGradle.includes('splits {')) {
      // Insere o bloco 'splits' dentro do bloco 'android'
      const anchor = 'defaultConfig {';
      config.modResults.contents = buildGradle.replace(
        anchor,
        `${anchor}\n${gradleSplitsBlock}`
      );
    }
    return config;
  });
};

module.exports = withAndroidAbiSplits;