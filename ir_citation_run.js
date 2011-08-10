/**
 * @file
 *   This kicks off the citation process.  Currently this module does not support all the disambiguation 
 *   features of citeproc-js, for now to get them you should write your own javascript to overide ir_citation_run.js.
 * @author 
 *   William Panting
 */
Drupal.behaviors.islandora_institutional_repository_cite_make= function (context){
	
	var sys = new ir_citation_sys();
	
	//loop through each citation
	ir_citation_jQuery('.ir_citation').each(
		/**
		 * This is a call back function that handles each element with the class ir_citation
		 * it insertes the processed citation 
		 */
	  function(index) {
		 
		  //get citation style
		  var citation_style_name = ir_citation_jQuery(this).attr('data-ir_citation_style');
		  var citation_style = Drupal.settings.ir_citation.csl[citation_style_name];
		  
		  //create citation engine object
		  var citation_processor = new CSL.Engine(sys, citation_style);
		  
		  //add abbreviations if they exist
		  var abbreviations = ir_citation_jQuery(this).attr('data-ir_citation_abbreviations');
		  if (abbreviations!=undefined) {
			  citation_processor.setAbbreviations(abbreviations);
		  }
		  
		  //handle bibliography elements
		  var bibliography_list_key = ir_citation_jQuery(this).attr('data-ir_citation_bibliography_list');
		  if (bibliography_list_key!=undefined) {			 
			bibliography_list=ir_citation_jQuery.parseJSON(Drupal.settings.ir_citation.bibliography_lists[bibliography_list_key]);
			

			citation_processor.updateItems(bibliography_list);
			
			output = citation_processor.makeBibliography();
			alert(output);
			//output
			if (output && output.length && output[1].length){
				output = output[0].bibstart + output[1].join("") + output[0].bibend;
				ir_citation_jQuery(this).html(output);
			}
		  }
		  //handle single citation elements
		  else {
			  //get citation object
			  var citation_object_name = ir_citation_jQuery(this).attr('data-ir_citation_object');
			  var citation_object_string = Drupal.settings.ir_citation.citation_objects[citation_object_name];
			  var citation_object = ir_citation_jQuery.parseJSON(citation_object_string);
			  
			  //append citation object to engine
			  var citation = citation_processor.appendCitationCluster(citation_object);
			  //insert citation on page
			  ir_citation_jQuery(this).html(citation[0][1]);
		  }
	  }
	);
}