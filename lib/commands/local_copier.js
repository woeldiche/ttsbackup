var fs = require('fs');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');
var UrlHelper = require('./../util/url_helper');
var PathHelper = require('./../util/path_helper');
var JsonLoader = require('./../util/json_loader');
var WorkshopHelper = require('./../util/workshop_helper');
var TabletopNameHelper = require('./../util/tabletop_name_helper');

var copyFile = function (toDirectory, modsPath, url) {
    var extensionlessFileName = TabletopNameHelper.baseFileNameForUrl(url);

    const imagesDir = modsPath + "/Images/";
    const imagesPattern = imagesDir + extensionlessFileName + ".*";
    const modelsDir = modsPath + "/Models/";
    const modelsPattern = modelsDir + extensionlessFileName + ".*";
    const matchingImageFiles = glob.sync(imagesPattern);
    const matchingModelFiles = glob.sync(modelsPattern);
    var matchingFiles = _.concat(matchingImageFiles, matchingModelFiles);
    if (matchingFiles.length === 0) {
        console.log("Url %s cannot be found locally. It should be in %s or %s and look like %s\n", url, imagesDir, modelsDir, extensionlessFileName);
        return;
    }
    var localFile = matchingFiles[0];
    fs.writeFileSync(path.join(toDirectory, path.basename(localFile)), fs.readFileSync(localFile));
};

var modsDirectory = function (options) {
    var workshopInfosPath = _.get(options, 'workshopFileInfosPath') || WorkshopHelper.defaultWorkshopInfosPath();
    return path.normalize(path.dirname(workshopInfosPath) + "/..");
};

var copyModFromLocalFiles = function (filePath, options) {
    if (!options.outputDir) {
        console.error("No output directory specified for downloads. Exiting!");
        process.exit(1);
    }

    const modObject = JsonLoader.read(filePath);
    const path_helper = new PathHelper(options.outputDir, modObject.SaveName);
    path_helper.createArchivePath();
    path_helper.emptyArchivePath();
    fs.writeFileSync(path_helper.modPath(), fs.readFileSync(filePath, 'utf8'));
    var externalResources = UrlHelper.getUniqueUrlsInObject(modObject);
    _.forEach(externalResources, _.curry(copyFile)(path_helper.archivePath())(modsDirectory(options)));
    return path_helper.modPath();
};

module.exports = {
    copyModFromLocalFiles: copyModFromLocalFiles
};