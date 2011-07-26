<?php
/**
 * @file 
 *   this file is used to convert mods data into json for citeproc-js
 *  @author
 *    William Panting
 *  @author
 *    Zachary Howarth-Schueler
 */
require_once('mods_csl_type_conversion.inc');
require_once('marcrelator_conversion.inc');
Header("content-type: application/x-javascript");

// Load a mods
$sample_fedora=file_get_contents('./testMods.xml');

// Beginnings of a CSL json data structure.
$csl_data = array();

// Random... probably use PID in the real world.
$csl_data['id'] = 'ITEM-21';

$xml = new SimpleXMLElement($sample_fedora);

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
	echo 'alert("in title");';
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


/**
   THAT SHOULD JUST ABOUT DO IT
 */

echo '
/*
 * Copyright (c) 2009, 2010 and 2011 Frank G. Bennett, Jr. All Rights
 * Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the “License”); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://bitbucket.org/fbennett/citeproc-js/src/tip/LICENSE.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS”
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is the citation formatting software known as
 * "citeproc-js" (an implementation of the Citation Style Language
 * [CSL]), including the original test fixtures and software located
 * under the ./std subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
 *
 * Alternatively, the contents of this file may be used under the
 * terms of the GNU Affero General Public License (the [AGPLv3]
 * License), in which case the provisions of [AGPLv3] License are
 * applicable instead of those above. If you wish to allow use of your
 * version of this file only under the terms of the [AGPLv3] License
 * and not to allow others to use your version of this file under the
 * CPAL, indicate your decision by deleting the provisions above and
 * replace them with the notice and other provisions required by the
 * [AGPLv3] License. If you do not delete the provisions above, a
 * recipient may use your version of this file under either the CPAL
 * or the [AGPLv3] License.”
 */
var data = {
	"ITEM-1": {
		"id": "ITEM-1",
		"title":"Boundaries of Dissent: Protest and State Power in the Media Age",
		"author": [
			{
				"family": "D\'Arcus",
				"given": "Bruce",
				"static-ordering": false
			}
		],
        "note":"The apostrophe in Bruce\'s name appears in proper typeset form.",
		"publisher": "Routledge",
        "publisher-place": "New York",
		"issued": {
			"date-parts":[
				[2006]
			]
		},
		"type": "book"
	},
	"ITEM-2": {
		"id": "ITEM-2",
		"author": [
			{
				"family": "Barnett",
				"given": "Frank G.",
				"suffix": "Jr.",
				"comma-suffix": true,
				"static-ordering": false
			}
		],
		"title":"Getting Property Right: \"Informal\" Mortgages in the Japanese Courts",
		"container-title":"Pacific Rim Law & Policy Journal",
		"volume": "18",
		"page": "463-509",
		"issued": {
			"date-parts":[
				[2009, 8]
			]
		},
		"type": "article-journal",
        "note": "Note the flip-flop behavior of the quotations marks around \"informal\" in the title of this citation.  This works for quotation marks in any style locale.  Oh, and, uh, these notes illustrate the formatting of annotated bibliographies (!)."
	},
	"ITEM-3": {
		"id": "ITEM-3",
		"title":"Key Process Conditions for Production of C<sub>4</sub> Dicarboxylic Acids in Bioreactor Batch Cultures of an Engineered <i>Saccharomyces cerevisiae</i> Strain",
        "note":"This cite illustrates the rich text formatting capabilities in the new processor, as well as page range collapsing (in this case, applying the collapsing method required by the Chicago Manual of Style).  Also, as the IEEE example above partially illustrates, we also offer robust handling of particles such as \"van\" and \"de\" in author names.",
		"author": [
			{
				"family": "Zelle",
				"given": "Rintze M."
			},
			{
				"family": "Hulster",
				"given": "Erik",
				"non-dropping-particle":"de"
			},
			{
				"family": "Kloezen",
				"given": "Wendy"
			},
			{
				"family":"Pronk",
				"given":"Jack T."
			},
			{
				"family": "Maris",
				"given":"Antonius J.A.",
				"non-dropping-particle":"van"
			}
		],
		"container-title": "Applied and Environmental Microbiology",
		"issued":{
			"date-parts":[
				[2010, 2]
			]
		},
		"page": "744-750",
		"volume":"76",
		"issue": "3",
		"DOI":"10.1128/AEM.02396-09",
		"type": "article-journal"
	},
	"ITEM-4": {
		"id": "ITEM-4",
		"author": [
			{
				"family": "Razlogova",
				"given": "Elena"
			}
		],
		"title": "Radio and Astonishment: The Emergence of Radio Sound, 1920-1926",
		"type": "speech",
		"event": "Society for Cinema Studies Annual Meeting",
		"event-place": "Denver, CO",
        "note":"All styles in the CSL repository are supported by the new processor, including the popular Chicago styles by Elena.",
		"issued": {
			"date-parts": [
				[
					2002,
					5
				]
			]
		}
	},
	"ITEM-5": {
		"id": "ITEM-5",
		"author": [
			{
				"family": "\u68b6\u7530",
				"given": "\u5c06\u53f8",
				"multi":{
					"_key":{
						"ja-alalc97":{
								"family": "Kajita",
								"given": "Shoji"
						}
					}
				}				
			},
			{
				"family": "\u89d2\u6240",
				"given": "\u8003",
				"multi":{
					"_key":{
						"ja-alalc97":{
							"family": "Kakusho",
							"given": "Takashi"
						}
					}
				}				
			},
			{
				"family": "\u4e2d\u6fa4",
				"given": "\u7be4\u5fd7",
				"multi":{
					"_key":{
						"ja-alalc97":{
							"family": "Nakazawa",
							"given": "Atsushi"
						}
					}
				}				
			},
			{
				"family": "\u7af9\u6751",
				"given": "\u6cbb\u96c4",
				"multi":{
					"_key":{
						"ja-alalc97":{
							"family": "Takemura",
							"given": "Haruo"
						}
					}
				}				
			},
			{
				"family": "\u7f8e\u6fc3",
				"given": "\u5c0e\u5f66",
				"multi":{
					"_key":{
						"ja-alalc97":{
							"family": "Mino",
							"given": "Michihiko"
						}
					}
				}				
			},
			{
				"family": "\u9593\u702c",
				"given": "\u5065\u4e8c",
				"multi":{
					"_key":{
						"ja-alalc97":{
							"family": "Mase",
							"given": "Kenji"
						}
					}
				}				
			}
		],
		"title": "\u9ad8\u7b49\u6559\u80b2\u6a5f\u95a2\u306b\u304a\u3051\u308b\u6b21\u4e16\u4ee3\u6559\u80b2\u5b66\u7fd2\u652f\u63f4\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u306e\u69cb\u7bc9\u306b\u5411\u3051\u3066",
		"multi":{
			"_keys":{
				"title":{
					"ja-alalc97": "K\u014dt\u014d ky\u014diku ni okeru jisedai ky\u014diku gakush\u016b shien puratto f\u014dmu no k\u014dchiku ni mukete",
					"en": "Toward the Development of Next-Generation Platforms for Teaching and Learning in Higher Education"
				},
				"container-title":{
					"ja-alalc97": "Nihon ky\u014diku k\u014dgaku ronbunshi",
					"en": "Journal of the Japan Educational Engineering Society"
				}
			}
		},
		"container-title": "\u65e5\u672c\u6559\u80b2\u5de5\u5b66\u4f1a\u8ad6\u6587\u8a8c",
		"volume": "31",
		"issue": "3",
		"page": "297-305",
		"issued": {
			"date-parts": [
				[
					2007,
					12
				]
			]
		},
        "note": "Note the transformations to which this cite is subjected in the samples above, and the fact that it appears in the correct sort position in all rendered forms.  Selection of multi-lingual content can be configured in the style, permitting one database to serve a multi-lingual author in all languages in which she might publish.",
		"type": "article-journal"

	},
	"ITEM-6": {
		"id": "ITEM-6",
		"title":"Evaluating Components of International Migration: Consistency of 2000 Nativity Data",
		"note": "This cite illustrates the formatting of institutional authors.  Note that there is no \"and\" between the individual author and the institution with which he is affiliated.",
		"author": [
			{
				"family": "Malone",
				"given": "Nolan J.",
				"static-ordering": false
			},
			{
				"literal": "U.S. Bureau of the Census"
			}
		],
		"publisher": "Routledge",
        "publisher-place": "New York",
		"issued": {
			"date-parts":[
				[2001, 12, 5]
			]
		},
		"type": "book"
	},
	"ITEM-7": {
		"id": "ITEM-7",
		"title": "True Crime Radio and Listener Disenchantment with Network Broadcasting, 1935-1946",
		"author":[
			{
				"family": "Razlogova",
				"given": "Elena"
			}
		],
		"container-title": "American Quarterly",
		"volume": "58",
		"page": "137-158",
		"issued": {
			"date-parts": [
				[2006, 3]
			]
		},
		"type": "article-journal"
	},
	"ITEM-8": {
		"id": "ITEM-8",
		"title": "The Guantanamobile Project",
		"container-title": "Vectors",
		"volume": "1",
		"author":[
			{
				"family": "Razlogova",
				"given": "Elena"
			},
			{
				"family": "Lynch",
				"given": "Lisa"
			}
		],
		"issued": {
			"season": 3,
			"date-parts": [
				[2005]
			]
		},
		"type": "article-journal"

	},
	"ITEM-9": {
		"id": "ITEM-9",
		"container-title": "FEMS Yeast Research",
		"volume": "9",
		"issue": "8",
		"page": "1123-1136",
		"title": "Metabolic engineering of <i>Saccharomyces cerevisiae</i> for production of carboxylic acids: current status and challenges",
		"contributor":[
			{
				"family": "Zelle",
				"given": "Rintze M."
			}
		],
		"author": [
			{
				"family": "Abbott",
				"given": "Derek A."
			},
			{
				"family": "Zelle",
				"given": "Rintze M."
			},
			{
				"family":"Pronk",
				"given":"Jack T."
			},
			{
				"family": "Maris",
				"given":"Antonius J.A.",
				"non-dropping-particle":"van"
			}
		],
		"issued": {
			"season": "2",
			"date-parts": [
				[
					2009,
					6,
					6
				]
			]
		},
		"type": "article-journal"
	},
    "ITEM-10": {
        "container-title": "N.Y.2d", 
        "id": "ITEM-10", 
        "issued": {
            "date-parts": [
                [
                    "1989"
                ]
            ]
        }, 
        "page": "683", 
        "title": "People v. Taylor", 
        "type": "legal_case", 
        "volume": 73
    }, 
    "ITEM-11": {
        "container-title": "N.E.2d", 
        "id": "ITEM-11", 
        "issued": {
            "date-parts": [
                [
                    "1989"
                ]
            ]
        }, 
        "page": "386", 
        "title": "People v. Taylor", 
        "type": "legal_case", 
        "volume": 541
    }, 
    "ITEM-12": {
        "container-title": "N.Y.S.2d", 
        "id": "ITEM-12", 
        "issued": {
            "date-parts": [
                [
                    "1989"
                ]
            ]
        }, 
        "page": "357", 
        "title": "People v. Taylor", 
        "type": "legal_case", 
        "volume": 543
    },
    "ITEM-13": {
        "id": "ITEM-13", 
        "title": "\u6c11\u6cd5",
		"multi":{
			"_keys":{
				"title": {
					"ja-alalc97": "Minp\u014d",
					"en": "Japanese Civil Code"
				}
			}
		},
        "type": "legislation"
    },
    "ITEM-14": {
        "id": "ITEM-14", 
        "title": "Clayton Act",
        "container-title": "ch.",
        "number": 323,
		"issued": {
           "date-parts": [
             [
                1914
             ]
           ]
		},
        "type": "legislation"
    },
    "ITEM-15": {
        "id": "ITEM-15", 
        "title": "Clayton Act",
		"volume":38,
        "container-title": "Stat.",
        "page": 730,
		"issued": {
           "date-parts": [
             [
                1914
             ]
           ]
		},
        "type": "legislation"
    },
    "ITEM-16": {
        "id": "ITEM-16", 
        "title": "FTC Credit Practices Rule",
		"volume":16,
        "container-title": "C.F.R.",
        "section": 444,
		"issued": {
           "date-parts": [
             [
                1999
             ]
           ]
		},
        "type": "legislation"
    },
    "ITEM-17": {
        "id": "ITEM-17", 
        "title": "Beck v. Beck",
		"volume":1999,
        "container-title": "ME",
        "page": 110,
		"issued": {
           "date-parts": [
             [
                1999
             ]
           ]
		},
        "type": "legal_case"
    },
    "ITEM-18": {
        "id": "ITEM-18", 
        "title": "Beck v. Beck",
		"volume":733,
        "container-title": "A.2d",
        "page": 981,
		"issued": {
           "date-parts": [
             [
                1999
             ]
           ]
		},
        "type": "legal_case"
    },
    "ITEM-19": {
        "id": "ITEM-19", 
        "title": "Donoghue v. Stevenson",
		"volume":1932,
        "container-title": "App. Cas.",
        "page": 562,
		"issued": {
           "date-parts": [
             [
                1932
             ]
           ]
		},
        "type": "legal_case"
    },
    "ITEM-20": {
        "id": "ITEM-20", 
        "title": "British Columbia Elec. Ry. v. Loach",
		"volume":1916,
		"issue":1,
        "container-title": "App. Cas.",
        "page": 719,
		"authority":"P.C.",
		"issued": {
           "date-parts": [
             [
                1915
             ]
           ]
		},
        "type": "legal_case"
    },
    "ITEM-21": {
        "id": "ITEM-21", 
        "title": "Chapters on Chaucer",
		"author":[
			{
				"family": "Malone",
				"given": "Kemp"
			}
		],
        "publisher":"Johns Hopkins Press",
        "publisher-place": "Baltimore",
		"issued": {
           "date-parts": [
             [
                1951
             ]
           ]
		},
        "type": "book"
    },';


echo '
"ITEM-21": ' . json_encode($csl_data);
echo '};';