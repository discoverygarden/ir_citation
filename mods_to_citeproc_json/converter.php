<?php
/**
 * @file 
 *   this file is used to convert mods data into json for citeproc-js
 *  @author
 *    William Panting
 *  @author
 *    Zachary Howarth-Schueler
 */

/**
 * This function will convert mods to citeproc_json
 * @param $mods
 *   The mods to convert to citeproc_json for citation purposes
 * @param $item_id
 *   The id to insert into the json object, needs to be unique for the page
 * @return
 *   The json formated citation data
 */
function convert_mods_to_citeproc_json($mods, $item_id) {
  module_load_include('inc', 'ir_citation', 'mods_to_citeproc_json/mods_csl_type_conversion');
  module_load_include('inc', 'ir_citation', 'mods_to_citeproc_json/marcrelator_conversion');
  
  // Beginnings of a CSL json data structure.
  $csl_data = array();
  
  //insert the item id for use by citeproc
  $csl_data['id'] = $item_id;
  
  $xml = new SimpleXMLElement($mods);
  
  /**
     FROM HERE ON IN, WE'RE DOING XPATH QUERIES AND POPULATING CSL VARIABLES.
     STARTING WITH TITLE, THEN FOLLOWING IN MOSTLY ALPHABETICAL ORDER.
   */
  
  // TITLES
  // There may be multiple titles, and relying on the title[@type] is not a wholly
  // relable method of determining the best title.  MOST OFTEN THERE WILL ONLY BE ONE.
  // My answer is to take the *longest*. 
  
  $titles = $xml->xpath("//*[local-name() = 'mods']/*[local-name() = 'titleInfo']/*[local-name() = 'title']");
  
  if( !empty( $titles ))
    while(list( $num, $node) = each($titles)) {
      	$title = (string)$node;
      	$subtitle = $node->xpath("../*[local-name() = 'subTitle']");
      if( !empty( $subtitle )) {
      		$title .= ": " . $subtitle[0];
      	}
      	
      	$nonSort = $node->xpath("../*[local-name() = 'nonSort']");
      	if( !empty( $nonSort )) {
      		$title = $nonSort[0] . " " . $title;
      	}
      	
      	if (isset($csl_data['title'])) {
      	  if( strlen($title) > strlen($csl_data['title']) ) {
      	    $csl_data['title'] = $title;
      	  }
      	}
      	else {//first time title is set
      	  $csl_data['title']=$title;
      	}
    }
  
  // ABSTRACT
  $abstracts = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'abstract']/text()");
  if( !empty( $abstracts[0] )) {
  	$csl_data['abstract'] = (string)$abstracts[0]; 
  }
  
  // CALL NUMBER
  $call_numbers = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'classification']/text()");
  if( !empty( $call_numbers )) {
  	$csl_data['call-number'] = (string)$call_numbers[0];
  }
  
  // COLLECTION TITLE
  $collection_titles = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'relatedItem'][@type='series']/*[local-name() = 'titleInfo']/*[local-name() = 'title']/text()");
  if( !empty( $collection_titles )) {
  	$csl_data['collection-title'] = (string)$collection_titles[0];
  }
  
  // CONTAINER TITLE
  $container_titles = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'relatedItem'][@type='host']/*[local-name() = 'titleInfo']/*[local-name() = 'title']/text()");
  if( !empty( $container_titles )) {
  	$csl_data['container-title'] = (string)$container_titles[0];
  }
  
  // DOI
  $dois = $xml->xpath("//*[local-name() = 'mods']/*[local-name() = 'identifier'][@type='doi']/text()");
  if( !empty( $dois )) {
  	$csl_data['DOI'] = (string)$dois[0];
  }
  
  // EDITION
  $editions = $xml->xpath("//*[local-name() = 'mods']/*[local-name() = 'originInfo']/*[local-name() = 'edition']/text()");
  if( !empty( $editions )) {
  	$csl_data['edition'] = (string)$editions[0];
  }
  
  // EVENT
  // (1. marcgt)
  $events = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'genre'][self::node()[@authority='marcgt']='conference publication']/ancestor::*[local-name() = 'mods'][1]/*[local-name() = 'relatedItem']/*[local-name() = 'titleInfo']/*[local-name() = 'title']/text()");
  if( !empty( $events )) {
  	$csl_data['event'] = (string)$events[0];
  } else {
  	// (2. zotero)
  	$zotero_events = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'genre'][self::node()[@authority='local']='conferencePaper']/ancestor::*[local-name() = 'mods'][1]/*[local-name() = 'relatedItem']/*[local-name() = 'titleInfo']/*[local-name() = 'title']/text()");
  	if( !empty( $zotero_events )) {
  		$csl_data['event'] = (string)$zotero_events[0];
  	}
  }
  
  // EVENT PLACE
  // (1. marcgt)
  $event_places = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'genre'][self::node()[@authority='marcgt']='conference publication']/ancestor::*[local-name() = 'mods'][1]/*[local-name() = 'originInfo']/*[local-name() = 'place']/*[local-name() = 'placeTerm']/text()");
  if( !empty( $event_places )) {
  	$csl_data['event-place'] = (string)$event_places[0];
  } else {
  	$zotero_event_places = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'genre'][self::node()[@authority='local']='conferencePaper']/ancestor::*[local-name() = 'mods'][1]/*[local-name() = 'originInfo']/*[local-name() = 'place']/*[local-name() = 'placeTerm']/text()");
  	if( !empty( $zotero_event_places ))
  		$csl_data['event-place'] = (string)$zotero_event_places[0];
  }
  
  // GENRE (type of resource)
  $genres = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'typeOfResource']/text()");
  if( !empty( $genres )) {
  	$csl_data['genre'] = (string)$genres[0];
  }
  
  // ISBN
  $isbns = $xml->xpath("//*[local-name() = 'mods']/*[local-name() = 'identifier'][@type='isbn']/text()");
  if( !empty( $isbns )) {
  	$csl_data['ISBN'] = (string)$isbns[0];
  }
  
  // VOLUME (counterpart to issue)
  $volumes = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'part']/*[local-name() = 'detail'][@type='volume']/*/text()");
  if( !empty( $volumes )) {
  	$csl_data['volume'] = (int)$volumes[0];
  }
  
  // ISSUE (counterpart to volume)
  $issues = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'part']/*[local-name() = 'detail'][@type='issue']/*/text()");
  if( !empty( $issues )) {
  	$csl_data['issue'] = (int)$issues[0];
  }
  
  // KEYWORD seems to be useless to CSL
  
  // NOTE
  $notes = $xml->xpath("//*[local-name() = 'mods']/*[local-name() = 'note']");
  $notestr = "";
  while( list( $num, $note ) = each($notes) ) {
  	$notestr .= $num+1 . ". " . rtrim(strip_tags($note),'. ') . ".  ";
  }
  if( !empty( $notestr )) {
  	$csl_data['note'] = $notestr;
  }
  
  // NUMBER (mainly series number, rarely used)
  $numbers = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'relatedItem'][@type='series']/*[local-name() = 'titleInfo']/*[local-name() = 'partNumber']/text()");
  if( !empty( $numbers )) {
  	$csl_data['number'] = $numbers[0];
  }
  
  // PAGE(s)
  $pages = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'part']/*[local-name() = 'extent'][@unit='pages']");
  
  // Note: "pages" is correct, but Zotero uses "page".
  if( empty( $pages )) {
  	$pages = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'part']/*[local-name() = 'extent'][@unit='page']");
  }
  	
  if( !empty( $pages[0]->total )) {
  	$csl_data['page'] = (string)$pages[0]->total;
  }
  elseif( !empty( $pages[0]->list )) {
  	$csl_data['page'] = (string)$pages[0]->list;
  }
  elseif( !empty( $pages[0]->start )) {
  	$csl_data['page'] = (string)$pages[0]->start;
  	if( !empty( $pages[0]->end ))
  		$csl_data['page'] .= "-" . $pages[0]->end;
  }
  
  // PUBLISHER
  $publishers = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'originInfo']/*[local-name() = 'publisher']/text()");
  if( !empty( $publishers )) {
  	$csl_data['publisher'] = (string)$publishers[0];
  }
  
  // PUBLISHER PLACE
  $pub_places = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'originInfo']/*[local-name() = 'place']/*[local-name() = 'placeTerm']/text()");
  if( !empty( $pub_places )) {
  	$csl_data['publisher-place'] = (string)$pub_places[0];
  }
  
  // URL
  $urls = $xml->xpath("//*[local-name() = 'mods']/*[local-name() = 'location']/*[local-name() = 'url']");
  if( !empty( $urls )) {
  	$csl_data['URL'] = (string)$urls[0];
  }
  
  
  // TYPE -- this is a big one.
  //    @auth='marcgt' -- marcgt should be the preferred authority
  //    @auth='local'  -- actually better at differentiating some types
  //    not(@auth)     -- unauthoritative types from Bibutils
  //
  //    genre == 'book' is especially difficult
  //      //mods/relatedItem[@type='host']/genre[@authority='marcgt'] == 'book' means "Chapter"
  //      //mods/genre[@authority='marcgt'] == 'book' means "Book" 
  //         *UNLESS* //mods/relatedItem[type='host']/titleInfo/title exists
  //         *OR*     //mods/genre[@authority='local'] == 'bookSection'
  //
  
  // First try: item's local marcgt genre.
  $type_marcgt = $xml->xpath("//*[local-name() = 'mods']/*[local-name() = 'genre'][@authority='marcgt']/text()");
  if( !empty( $type_marcgt )) {
  	$interim_type = (string)$type_marcgt[0];
  	
  	if( !strcasecmp( $interim_type, 'book' ) ) {
  		$host_titles = $type_marcgt[0]->xpath("../*[local-name() = 'relatedItem'][@type='host']/*[local-name() = 'titleInfo']/*[local-name() = 'title']/text()");
  		if( !empty( $host_titles ) ) {
  			// This is but a chapter in a book
  			$csl_data['type'] = 'chapter';
  		} else {
  			$csl_data['type'] = 'book';
  		}
  	} else {
  		$csl_data['type'] = marcgt_to_csl( $interim_type );
  	}
  	
  	$csl_type = marcgt_to_csl( $interim_type );
  
  }
  
  // Second try: item's parent marcgt genre (often applies to the original item itself).
  if( empty( $csl_data['type'] )) {
  	
  	$type_marcgt_related = $xml->xpath("//*[local-name() = 'mods']/*[local-name() = 'relatedItem']/*[local-name() = 'genre'][@authority='marcgt']/text()");
  	if( !empty( $type_marcgt_related )) {
  		$interim_type = (string)$type_marcgt_related[0];
  		
  		if( !strcasecmp( $interim_type, 'book' ) ) {
  			$csl_data['type'] = 'chapter';
  		} else {
  			$csl_data['type'] = marcgt_to_csl( $interim_type );
  		}
  		
  	}
  	
  }
  
  // Third try: other authority types (most likely Zotero local)
  if( empty( $csl_data['type'] )) {
  	
  	$types_local_auth = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'genre'][not(@authority='marcgt')]/text()");
  	while( empty( $csl_data['type'] ) && list( $num, $type ) = each($types_local_auth) ) {
  		$interim_type = (string)$type;
  		$csl_data['type'] = mods_genre_to_csl_type( $interim_type );
  	}
  	
  }
  
  // NAME(s) -- Another Biggie
  // There are a number of name-type vars which may be populated.
  // We will concern ourselves with the following:
  //  1. Author
  //  2. Editor
  //  3. Translator
  // Note: There is no CSL var for "contributor", we will treat them as additional authors.
  // Note: Each name may be either "corporate" or "given name / family name"
  // Note: As it's unlikely we'll have participles, suffixes, etc properly parsed out, we
  //       will always pass the ("parse-names" : "true") flag with personal names.
  
  $names = $xml->xpath("//*[local-name() = 'mods']/*[local-name() = 'name']");
  while( list( $num, $name ) = each($names) ) {
  	// print_r($name);
  	$personal_corporate = (string)$name->attributes()->type;
  	
  	$role = strtolower( (string)$name->role->roleTerm );
  	$role_authority = (string)$name->role->roleTerm->attributes()->authority;
  	$role_type = (string)$name->role->roleTerm->attributes()->type;
  	if( $role_authority == 'marcrelator' && $role_type == 'code' ) {
  		$role = marcrelator_code_to_term($role);
  	}
  	
  	$csl_name = array();
  	switch( $personal_corporate ) {
  		case 'personal':
  			$nameParts = $name->xpath( "./*[local-name() = 'namePart']" );
  			while( list( $namePart_num, $namePart ) = each($nameParts) ) {
  				// mods namepart types (given, family) correspond to citeproc elements,
  				// however, more precise mods elements (nonsort, etc.) do not.
  				// TODO: make all name handling better.
  				$namePart_type = (string)$namePart->attributes()->type;
  				$namePart_string = (string)$namePart;
  				if( strlen($namePart_string) == 1 ) {
  					$namePart_string .= ".";
  				}
  				$csl_name[$namePart_type] .= $namePart_string . " ";
  			}
  			// trim extra whitespace from each array element
  			array_walk($csl_name, create_function('&$val', '$val = trim($val);'));
  			// add the citeproc-js "parse-names" flag.
  			$csl_name['parse-names'] = "true";
  			break;
  		case 'corporate':
  		default:
  			$nameParts = $name->xpath( "./*[local-name() = 'namePart']" );
  			while( list( $namePart_num, $namePart ) = each($nameParts) ) {
  				$namePart_string = (string)$namePart;
  				$csl_name['literal'] .= $namePart_string . " ";
  			}
  			$csl_name['literal'] = trim($csl_name['literal']);
  			break;
  	}
  	
  	switch( $role ) {
  		case 'editor':
  			$csl_data['editor'][] = $csl_name;
  			break;
  		case 'translator':
  			$csl_data['translator'][] = $csl_name;
  			break;
  		case 'interviewer':
  			$csl_data['interviewer'][] = $csl_name;
  			break;
  		case 'composer':
  			$csl_data['composer'][] = $csl_name;
  			break;
  		case 'originator':
  			$csl_data['original-author'][] = $csl_name;
  			break;
  		case 'recipient':
  			$csl_data['recipient'][] = $csl_name;
  			break;
  		case 'author':
  		default:
  			$csl_data['author'][] = $csl_name;
  			break;
  	}
  
  }
  
  // NAME(s) of RELATED ITEMS (host, series)
  // Zotero vs Bibutils do this a bit differently, but in bibutils it's common 
  // for the editor of a book (containing a chapter, which is our bibliographic item)
  // to be associated with the relatedItem(host).  
  // Also it's a shot in the dark, but relatedItem(series)->name->role->roleTerm=editor is plausible.
  //
  // Note also this section is *highly* repetitive of the section above and this should probably
  // be generalized, but for now a strict procedural reckoning will have to suffice.  The difference
  // is in the very last section, where the appropriate cs:names type is specified.
  
  $hostNames = $xml->xpath("//*[local-name() = 'mods']/*[local-name() = 'relatedItem'][@type='host']/*[local-name() = 'name']");
  if( !empty( $hostNames ))
  while( list( $num, $name ) = each($hostNames) ) {
  	// print_r($name);
  	$personal_corporate = (string)$name->attributes()->type;
  	
  	$role = strtolower( (string)$name->role->roleTerm );
  	$role_authority = (string)$name->role->roleTerm->attributes()->authority;
  	$role_type = (string)$name->role->roleTerm->attributes()->type;
  	if( $role_authority == 'marcrelator' && $role_type == 'code' ) {
  		$role = marcrelator_code_to_term($role);
  	}
  	
  	$csl_name = array();
  	switch( $personal_corporate ) {
  		case 'personal':
  			$nameParts = $name->xpath( "./*[local-name() = 'namePart']" );
  			while( list( $namePart_num, $namePart ) = each($nameParts) ) {
  				// mods namepart types (given, family) correspond to citeproc elements,
  				// however, more precise mods elements (nonsort, etc.) do not.
  				// TODO: make all name handling better.
  				$namePart_type = (string)$namePart->attributes()->type;
  				$namePart_string = (string)$namePart;
  				if( strlen($namePart_string) == 1 ) {
  					$namePart_string .= ".";
  				}
  				$csl_name[$namePart_type] .= $namePart_string . " ";
  			}
  			// trim extra whitespace from each array element
  			array_walk($csl_name, create_function('&$val', '$val = trim($val);'));
  			// add the citeproc-js "parse-names" flag.
  			$csl_name['parse-names'] = "true";
  			break;
  		case 'corporate':
  		default:
  			$nameParts = $name->xpath( "./*[local-name() = 'namePart']" );
  			while( list( $namePart_num, $namePart ) = each($nameParts) ) {
  				$namePart_string = (string)$namePart;
  				$csl_name['literal'] .= $namePart_string . " ";
  			}
  			$csl_name['literal'] = trim($csl_name['literal']);
  			break;
  	}
  	
  	switch( $role ) {
  		case 'editor':
  			$csl_data['editor'][] = $csl_name;
  			break;
  		case 'translator':
  			$csl_data['translator'][] = $csl_name;
  			break;
  		case 'author':
  		default:
  			$csl_data['container-author'][] = $csl_name;
  			break;
  	}
  
  }
  
  $seriesNames = $xml->xpath("//*[local-name() = 'mods']/*[local-name() = 'relatedItem'][@type='series']/*[local-name() = 'name']");
  if( !empty( $seriesNames ))
  while( list( $num, $name ) = each($seriesNames) ) {
  	// print_r($name);
  	$personal_corporate = (string)$name->attributes()->type;
  	
  	$role = strtolower( (string)$name->role->roleTerm );
  	$role_authority = (string)$name->role->roleTerm->attributes()->authority;
  	$role_type = (string)$name->role->roleTerm->attributes()->type;
  	if( $role_authority == 'marcrelator' && $role_type == 'code' ) {
  		$role = marcrelator_code_to_term($role);
  	}
  	
  	$csl_name = array();
  	switch( $personal_corporate ) {
  		case 'personal':
  			$nameParts = $name->xpath( "./*[local-name() = 'namePart']" );
  			while( list( $namePart_num, $namePart ) = each($nameParts) ) {
  				// mods namepart types (given, family) correspond to citeproc elements,
  				// however, more precise mods elements (nonsort, etc.) do not.
  				// TODO: make all name handling better.
  				$namePart_type = (string)$namePart->attributes()->type;
  				$namePart_string = (string)$namePart;
  				if( strlen($namePart_string) == 1 ) {
  					$namePart_string .= ".";
  				}
  				$csl_name[$namePart_type] .= $namePart_string . " ";
  			}
  			// trim extra whitespace from each array element
  			array_walk($csl_name, create_function('&$val', '$val = trim($val);'));
  			// add the citeproc-js "parse-names" flag.
  			$csl_name['parse-names'] = "true";
  			break;
  		case 'corporate':
  		default:
  			$nameParts = $name->xpath( "./*[local-name() = 'namePart']" );
  			while( list( $namePart_num, $namePart ) = each($nameParts) ) {
  				$namePart_string = (string)$namePart;
  				$csl_name['literal'] .= $namePart_string . " ";
  			}
  			$csl_name['literal'] = trim($csl_name['literal']);
  			break;
  	}
  	
  	switch( $role ) {
  		case 'editor':
  			$csl_data['collection-editor'][] = $csl_name;
  			break;
  		default:
  			break;
  	}
  
  }
  
  // DATES - yet another biggie
  // 1. Date Accessed
  // 2. Date Issued
  
  $date_captured = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'originInfo']/*[local-name() = 'dateCaptured']");
  if( !empty( $date_captured )) {
  	$csl_data['accessed']['raw'] = (string)$date_captured[0];
  }
  
  $date_issued = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'originInfo']/*[local-name() = 'dateIssued']");
  if( !empty( $date_issued )) {
  	$csl_data['issued']['raw'] = (string)$date_issued[0];
  }
  
  $date_created = $xml->xpath("//*[local-name() = 'mods']//*[local-name() = 'originInfo']/*[local-name() = 'dateCreated']");
  if( !empty( $date_created) && empty($csl_data['issued']) ) {
  	$csl_data['issued']['raw'] = (string)$date_created[0];
  }
  
  
  //return json data
  return (json_encode($csl_data));
}