/**
 * @file
 *   This kicks off the citation process.
 * @author 
 *   William Panting
 */
Drupal.behaviors.islandora_institutional_repository_cite_make= function (context){
	window['insert']();
	//alert ('debug here');
}
/**
 * EVERYTHING FROM THIS POINT ON IS MODIFIED FROM THE CITEPROC_DEMO
 */

var CiteInserter = function (name, stub) {
	this.stub = stub;
	this.nodes = [];
	this.idx = 0;
	var spannodes = document.getElementsByTagName("span");
	for (var pos = 0, len = spannodes.length; pos < len; pos += 1) {
		var node = spannodes.item(pos);
		if (node.getAttribute("name") == name) {
			this.nodes.push(node);
		}
	}
};

CiteInserter.prototype.insertCite = function (cites) {
	// Refreshes any previously rendered items requiring updates
	// due to disambiguation.
	for (var i = 0, ilen = cites.length; i < ilen; i += 1) {
		var id = this.stub + (cites[i][0] + 1);
		ir_citation_jQuery('#'+id).html(cites[i][1]);
	}
	this.idx += 1;
}

var insert = function(){
	var citeproc, output;
	
	var sys = new ir_citation_sys();
	
	// Chicago Author-Date
	citeproc = new CSL.Engine(sys, Drupal.settings.ir_citation.csl.chicago_author_date);
	var citeInserter = new CiteInserter("citation_cad","cad");
	
	var cad1 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationCAD1']));
	citeInserter.insertCite(cad1);
	var cad2 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationCAD2']));
	citeInserter.insertCite(cad2);
	var cad3 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationCAD3']));
	citeInserter.insertCite(cad3);
	var cad4 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationCAD4']));
	citeInserter.insertCite(cad4);
	var cad5 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationCAD5']));
	citeInserter.insertCite(cad5);
	var cad6 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationCAD6']));
	citeInserter.insertCite(cad6);
	var cad7 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationCAD7']));
	//alert("Targeted update of cites\naffected by name addition:\n"+cad7);
	citeInserter.insertCite(cad7);

	// Bluebook and subsectioned bib
	citeproc = new CSL.Engine(sys,Drupal.settings.ir_citation.csl.bluebook_demo);
	citeInserter = new CiteInserter("citation", "citation");
	citeproc.setAbbreviations("default");

	var citation1 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationBB1']));
	citeInserter.insertCite(citation1);
	var citation2 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationBB2']));
	citeInserter.insertCite(citation2);
	var citation3 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationBB3']));
	citeInserter.insertCite(citation3);
	var citation4 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationBB4']));
	citeInserter.insertCite(citation4);
	var citation5 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationBB5']));
	citeInserter.insertCite(citation5);
	var citation6 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationBB6']));
	citeInserter.insertCite(citation6);
	var citation7 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationBB7']));
	citeInserter.insertCite(citation7);
	var citation8 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationBB8']));
	citeInserter.insertCite(citation8);
	var citation9 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationBB9']));
	citeInserter.insertCite(citation9);
	var citation10 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationBB10']));
	citeInserter.insertCite(citation10);
	var citation11 = citeproc.appendCitationCluster(ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.citation_objects['citationBB11']));
	citeInserter.insertCite(citation11);

};