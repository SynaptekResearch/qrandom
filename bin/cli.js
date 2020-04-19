#!/usr/bin/env node

const fetchNumbers = require(`../lib/fetchNumbers`),
    yargs = require(`yargs`);

yargs
	.command(`$0`,
		`Generate true random numbers, thanks to the Australian National University Quantum Numbers Server API (http://qrng.anu.edu.au/)`,
		options,
		run
	)
	.help(`h`)
	.version()
	.wrap(yargs.terminalWidth())
	.argv;

function options() {
	return yargs.options({
		t: {
			alias  : `data-type`,
			choices: [
				`uint8`, `uint16`, `hex16`
			],
			"default"   : `uint8`,
			description: `The data type must be 'uint8' (returns integers between 0–255), 'uint16' (returns integers between 0–65535) or 'hex16' (returns hexadecimal characters between 00–ff).`,
			group       : ``
		},
		l: {
			alias       : `array-length`,
			coerce      : parseNumber,
			"default"   : 10,
			description: `The length of the array to return. Must be between 1–1024.`,
			group       : ``,
			number      : true
		},
		s: {
			alias      : `block-size`,
			coerce     : parseNumber,
			"default"  : 10,
			description: `Only needed for 'hex16' data type. Sets the length of each block. Must be between 1–1024.`,
			group      : ``,
			number     : true
		}
	});
}

function parseNumber(number) {
	if (number < 1 || number > 1024) {
		console.error(`The array-length and block-size parameters must be between 1–1024.`);
		process.exit(9);
	}
	return number;
}

function run(argv) {
	fetchNumbers(argv.t, argv.l, argv.s, printResult);
}

function printResult(error, result) {
	if (error) {
		console.error(error);
		process.exit(1);
	}

	console.log(result.toString());
	process.exit();
}