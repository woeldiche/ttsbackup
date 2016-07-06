var program = require('commander');
var download = require('./lib/commands/download');
var rewriter = require('./lib/commands/rewrite');
var mod_lister = require('./lib/commands/mod_lister');
var mod_installer = require('./lib/commands/mod_installer');
var interactive_backup = require('./lib/commands/interactive_backup');
var workshop_helper = require('./lib/util/workshop_helper');
var mod_validator = require('./lib/commands/mod_validator');

program.version('0.0.0');

program
    .command('backup')
    .description('interactively pick mods to backup to a particular location, create a mod file for tabletop simulator, and add to your installed mods. If you\'re unsure, this is the option you\'re looking for.')
    .action(interactive_backup.run);

program.command('download <path>')
    .option('-c, --clean', 'removes all downloaded game files from archive/Game/Images, Models, and Workshop before starting the archive process')
    .description('download all images, models, and the mod file needed to load in tts')
    .action(download.download);

program.command('rewrite <path>')
    .option('-r, --rewriteBaseUrl', 'The base url to rewrite across the mod file, e.g. https://dl.dropboxusercontent.com/u/12345/games')
    .description('rewrite mod file at path with a given base url')
    .action(rewriter.rewrite);

program.command('list [options]')
    .description('list installed mods')
    .option('-w, --workshopFileInfosPath <path>', "The WorkshopFileInfos.json path. This defaults to " + workshop_helper.defaultWorkshopInfosPath())
    .action(mod_lister.list);

program.command('install <path>')
    .option('-w, --workshopFileInfosPath <path>', "The WorkshopFileInfos.json path. This defaults to " + workshop_helper.defaultWorkshopInfosPath())
    .description('install mod file at given path into your steam workshop')
    .action(mod_installer.install);

program.command('validate <path>')
    .description('validate that all urls in a mod file work')
    .action(mod_validator.validate);

program.parse(process.argv);

if (process.argv.length <= 2) {
    interactive_backup.run();
}