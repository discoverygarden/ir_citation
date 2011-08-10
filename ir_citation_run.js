/**
 * @file
 *   This kicks off the citation process.  Currently this module does not support the disambiguation 
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
		  if (abbreviations) {
			  citation_processor.setAbbreviations(abbreviations);
		  }
		  
		  //get citation object
		  var citation_object_name = ir_citation_jQuery(this).attr('data-ir_citation_object');
		  var citation_object_string = Drupal.settings.ir_citation.citation_objects[citation_object_name];
		  var citation_object = ir_citation_jQuery.parseJSON(citation_object_string);
		  
		  //append citation object to engine
		  var citation = citation_processor.appendCitationCluster(citation_object);
		  //insert citation on page
		  ir_citation_jQuery(this).html(citation[0][1]);
	  }
	);
	
	/*
	   //BIBLIOGRAPHY CODE
		output = citeproc.makeBibliography();
		if (output && output.length && output[1].length){
			output = output[0].bibstart + output[1].join("") + output[0].bibend;
			ir_citation_jQuery('#'+"chicago_author_date").html(output);
		}*/
	/*
	var cases = {
			"include" : [
				{
					"field" : "type",
					"value" : "legal_case"
				},
				{
					"field" : "type",
					"value" : "legislation"
				}
			]
		};
		
		
	   //BIBLIOGRAPHY CODE
		output = citeproc.makeBibliography(cases);
		if (output && output.length && output[1].length){
			output = output[0].bibstart + output[1].join("") + output[0].bibend;
			ir_citation_jQuery('#'+"bluebook_demo_legal_stuff").html(output);
		}
		*/
		
	/*
		var books = {
			"select" : [
				{
					"field" : "type",
					"value" : "book"
				}
			]
		};
		
		
	   //BIBLIOGRAPHY CODE
		output = citeproc.makeBibliography(books);
		if (output && output.length && output[1].length){
			output = output[0].bibstart + output[1].join("") + output[0].bibend;
			ir_citation_jQuery('#'+"bluebook_demo_books").html(output);
		}
		*/
		
	/*
		var articles = {
			"exclude" : [
				{
					"field" : "type",
					"value" : "book"
				},
				{
					"field" : "type",
					"value" : "legal_case"
				},
				{
					"field" : "type",
					"value" : "legislation"
				}
			]
		};
		
	
	   //BIBLIOGRAPHY CODE
		output = citeproc.makeBibliography(articles);
		if (output && output.length && output[1].length){
			output = output[0].bibstart + output[1].join("") + output[0].bibend;
			ir_citation_jQuery('#'+"bluebook_demo_articles").html(output);
		}

		// Listing
		
		citeproc = new CSL.Engine(sys,Drupal.settings.ir_citation.csl.chicago_author_date_listing);
		citeproc.updateItems(["ITEM-1", "ITEM-3", "ITEM-4", "ITEM-5", "ITEM-6", "ITEM-7", "ITEM-8","ITEM-9"]);
		citeproc.setAbbreviations("default");
		
		output = citeproc.makeBibliography();
		if (output && output.length && output[1].length){
			output = output[0].bibstart + output[1].join("") + output[0].bibend;
			ir_citation_jQuery('#'+"chicago_author_date_listing").html(output);
		}

		// IEEE
		citeproc = new CSL.Engine(sys,Drupal.settings.ir_citation.csl.ieee);
		citeproc.updateItems(["ITEM-1", "ITEM-2", "ITEM-3", "ITEM-4", "ITEM-5", "ITEM-6"]);
		citeproc.setAbbreviations("slightly_weird");
		output = citeproc.makeBibliography();
		if (output && output.length && output[1].length){
			output = output[0].bibstart + output[1].join("") + output[0].bibend;
			ir_citation_jQuery('#'+"ieee").html(output);
		}

		// Annotated
		citeproc = new CSL.Engine(sys,Drupal.settings.ir_citation.csl.chicago_fullnote_bibliography2);
		citeproc.updateItems(["ITEM-1", "ITEM-2", "ITEM-3", "ITEM-4", "ITEM-5", "ITEM-6"]);
		citeproc.setAbbreviations("default");
		output = citeproc.makeBibliography();
		if (output && output.length && output[1].length){
			output = output[0].bibstart + output[1].join("") + output[0].bibend;
			ir_citation_jQuery('#'+"chicago_fullnote_bibliography2").html(output);
		}
	*/
}