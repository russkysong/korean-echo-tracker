import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** eslint-config-next already ships as a flat-config array in Next 15. */
const nextConfig = require('eslint-config-next');

export default nextConfig;
