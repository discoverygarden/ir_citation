/**
 * @file
 *   This javascript creates a sys object for the citeproc-js engine.  This object is meant to allow 
 *   access to abreviations, citation data and localization information that has been made available
 *   through the module's API.
 * @author 
 *   William Panting
 */

/**
 * Constructor
 */
var ir_citation_sys = function(){
	return;
};

/**
 * This function will let the citeproc-js engine access to citation data set by the Drupal module
 * 
 */
ir_citation_sys.prototype.retrieveItem = function(id){
	return ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citeproc_json[id]);
};

/**
 * This function will let the citeproc-js engine access to localization data set by the Drupal module
 * 
 */
ir_citation_sys.prototype.retrieveLocale = function(lang){
	return Drupal.settings.ir_citation.locale[lang];
};

/**
 * This function will let the citeproc-js engine access to abbreviation data set by the Drupal module
 */
ir_citation_sys.prototype.getAbbreviations = function(name, vartype){
	return ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.abbreviations[name][vartype]);
};
