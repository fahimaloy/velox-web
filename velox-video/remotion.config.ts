/**
 * Remotion Configuration for Velox Launch Video
 * All configuration options: https://www.remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

// Use Rspack for faster builds (default in Remotion 4.0+)
Config.setRspack(true);

// Use JPEG for video frames (faster encoding, smaller files)
Config.setVideoImageFormat("jpeg");

// Overwrite output files without prompting
Config.setOverwriteOutput(true);

// Set JPEG quality (0-100, default 80)
Config.setJpegQuality(90);

// Enable parallel encoding for faster renders
// Config.setParallelism(8); // Not available in this version

// Disable cache for development (optional)
// Config.setCacheDisabled(true);

// Set custom output location
// Config.setOutputLocation("./out");

// Set browser executable for rendering (optional)
// Config.setBrowserExecutable("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");

export default Config;