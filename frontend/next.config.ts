import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import WebpackObfuscator from 'webpack-obfuscator';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.plugins.push(
        new WebpackObfuscator({
          rotateStringArray: true,
          stringArray: true,
          stringArrayEncoding: ['base64'],
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false,
          selfDefending: true,
          compact: true,
          controlFlowFlattening: false,
          deadCodeInjection: false,
          debugProtection: false,
          debugProtectionInterval: 0,
          disableConsoleOutput: false,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          numbersToExpressions: false,
          renameGlobals: false,
          simplify: true,
          splitStrings: false,
          transformObjectKeys: false,
        }, ['**/node_modules/**'])
      );
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
