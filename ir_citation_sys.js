/**
 * @file
 *   This javascript creates a sys object for the citeproc-js engine.  This object is meant to allow 
 *   access to abreviations, citation data and localization information that has been made available
 *   through the module's API.
 * @todo
 *   This needs to be modified to work with stuff that gets set up through drupal
 * @author 
 *   William Panting
 * @param abbreviations
 * @returns
 */

var ir_citation_sys = function(){
};

Sys.prototype.retrieveItem = function(id){
	return Drupal.settings.ir_citation.citeproc_json[id];
};

Sys.prototype.retrieveLocale = function(lang){
	return lDrupal.settings.ir_citation.locale[lang];
};

Sys.prototype.getAbbreviations = function(name,vartype){
	return Drupal.settings.ir_citation.abbreviations[name][vartype];
};
