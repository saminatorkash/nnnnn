import chalk from 'chalk';

import getArgs from '../../util/get-args';
import getSubcommand from '../../util/get-subcommand';
import Client from '../../util/client';
import handleError from '../../util/handle-error';
import init from './init';
import { packageName, logo } from '../../util/pkg-name';
import { isError } from '@vercel/error-utils';

const COMMAND_CONFIG = {
  init: ['init'],
};

const help = () => {
  console.log(`
  ${chalk.bold(`${logo} ${packageName} init`)} [example] [dir] [-f | --force]

  ${chalk.dim('Options:')}

    -h, --help        Output usage information
    -d, --debug       Debug mode [off]
    --no-color        No color mode [off]
    -f, --force       Overwrite destination directory if exists [off]

  ${chalk.dim('Examples:')}

  ${chalk.gray('–')}  Choose from all available examples

      ${chalk.cyan(`$ ${packageName} init`)}

  ${chalk.gray('–')}  Initialize example project into a new directory

      ${chalk.cyan(`$ ${packageName} init <example>`)}

  ${chalk.gray('–')}  Initialize example project into specified directory

      ${chalk.cyan(`$ ${packageName} init <example> <dir>`)}

  ${chalk.gray('–')}  Initialize example project without checking

      ${chalk.cyan(`$ ${packageName} init <example> --force`)}
  `);
};

export default async function main(client: Client) {
  const { output } = client;
  let argv;
  let args;

  try {
    argv = getArgs(client.argv.slice(2), {
      '--force': Boolean,
      '-f': '--force',
    });
    args = getSubcommand(argv._.slice(1), COMMAND_CONFIG).args;
  } catch (err) {
    handleError(err);
    return 1;
  }

  if (argv['--help']) {
    help();
    return 2;
  }

  if (argv._.length > 3) {
    output.error('Too much arguments.');
    return 1;
  }

  try {
    return await init(client, argv, args);
  } catch (err: unknown) {
    output.prettyError(err);
    if (isError(err) && typeof err.stack === 'string') {
      output.debug(err.stack);
    }
    return 1;
  }
}
