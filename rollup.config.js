import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/app.js',
	output: {
		sourcemap: false,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js',
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: (css) => {
				css.write('bundle.css');
			},
			emitCss: true,
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			extensions: ['.svelte', '.js'],
			dedupe: ['svelte'],
		}),
		commonjs(),
		json(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
		postcss({
			extract: true,
			minimize: true,
			modules: false,
			namedExports: false,
			use: [
				[
					'sass',
					{
						includePaths: ['./src/theme', './node_modules'],
					},
				],
			],
		}),
	],
	external: ['electron', 'child_process', 'fs', 'path', 'url', 'module', 'os'],
	watch: {
		clearScreen: false,
	},
};
