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
 * @returns nada
 *   nill
 */

var ir_citation_sys = function(){
	return;
};

ir_citation_sys.prototype.retrieveItem = function(id){
	return ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citeproc_json[id]);
};

ir_citation_sys.prototype.retrieveLocale = function(lang){
	return Drupal.settings.ir_citation.locale[lang];
};

ir_citation_sys.prototype.getAbbreviations = function(name, vartype){
	return ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.abbreviations[name][vartype]);
};
