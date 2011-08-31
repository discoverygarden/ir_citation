<?php
/**
 * @file
 *   This file supplies helper functions and utilities to the ir_citation module.
 * @author
 *   William Panting
 */

/**
 * This function will load the necessary javascript files onto the page currently 
 * being generated so that the citeproc-js citation style language engine can run.
 * Only call this once on a page
 */
function load_citeproc_javascript() {
  //jquery library loads
  drupal_add_js(drupal_get_path('module', 'ir_citation') . '/jQuery/jquery-1.6.2.min.js');
  drupal_add_js(drupal_get_path('module', 'ir_citation') . '/jQuery/re_alias_jQuery.js');
  
  //citeproc library loads
  drupal_add_js(drupal_get_path('module', 'ir_citation') . '/citeproc-js/xmle4x.js');
  drupal_add_js(drupal_get_path('module', 'ir_citation') . '/citeproc-js/xmldom.js');
  drupal_add_js(drupal_get_path('module', 'ir_citation') . '/citeproc-js/citeproc.js');
  
  /*module specific javascript for making drupal api work with the citeproc javascript*/
  //creates a 'sys' object that gives the citeproc engine access to the variables set by drupal
  drupal_add_js(drupal_get_path('module', 'ir_citation') . '/ir_citation_sys.js');
  //currently being used to launch demo/test
  drupal_add_js(drupal_get_path('module', 'ir_citation') . '/ir_citation_run.js');
}

/**
 * This function will create and make available the citeproc_json related to the fedora object
 * Relies on the MODS datastream
 * The indicated CSL will also be made available
 * @param string $fedora_pid
 *   The pid of the fedora object to cite.
 * @param mixed $variable_name
 *   The id to insert into the json object, needs to be unique for the page, also
 *   the name in the drupal.settings object that will hold the completed json 
 *   If this is NULL it gets the value of $fedora_pid
 */
function load_meta_data_from_fedora_pid($fedora_pid, $variable_name=NULL) {
  if ($variable_name==NULL) {//allows to do this with only setting $fedora_pid
    $variable_name=$fedora_pid;
  }
  
  //get the mods from fedora
  $cite_mods=get_mods_from_pid($fedora_pid);
  if (!cite_mods) {
    return FALSE;
  }
  
  //load json
  load_citeproc_json_from_mods($variable_name, $cite_mods);
}

/** 
 * This is a convienence function that simply wraps mods_to_citeproc_json
 * and load_metadata_object_for_javascript
 * @param string $variable_name
 *   The id to insert into the json object, needs to be unique for the page, also
 *   the name in the drupal.settings object that will hold the completed json 
 * @param string $cite_mods
 *   The mods to convert to citeproc_json for citation purposes
 */
function load_citeproc_json_from_mods($variable_name, $cite_mods) {
  //get json
  $citeproc_json=mods_to_citeproc_json($cite_mods, $variable_name);
  //load json in javascript
  load_metadata_object_for_javascript($variable_name, $citeproc_json);
}

/**
 * This function will transform the MODS string it is given into a json format 
 * that the citeproc-js engine can understand
 * This function is a module level api style wrapper for converting mods to citeproc_json
 * @param $cite_mods
 *   The mods to convert to citeproc_json for citation purposes
 * @param $item_id
 *   The id to insert into the json object, needs to be unique for the page
 * @return
 *   The json formated citation data
 */
function mods_to_citeproc_json($cite_mods, $item_id) {
  module_load_include('php', 'ir_citation', 'mods_to_citeproc_json/converter');
  return (convert_mods_to_citeproc_json($cite_mods, $item_id));
}

/**
 * This function will make available the supplied json for use with citeproc-js
 * on the current page being generated's javacript
 * @param string $variable_name
 *   This name to make the json available under.
 * @param stirng $meta_data_object
 *   The json to make available.
 */
function load_metadata_object_for_javascript($variable_name, $meta_data_object) {
  drupal_add_js( array(
    'ir_citation' => array(
      'meta_data_objects' => array(
        $variable_name => $meta_data_object,
      )
    )
  ), 'setting');
}

/**
 * This function will make avaialbe the list of citations to use in a bibliography in json formated string
 * so it can be made into a JavaScript array.
 * @param array $bibliography_list
 *   This array is the list of names of the json meta data citation objects to include in the citation
 * @param string $variable_name
 *   This name to make the json available under.
 * @return string $bibliography_json
 *   This is the json that will actualy get added javascript side
 */
function load_bibliography_list_for_javascript($bibliography_list, $variable_name) {
  
  $bibliography_json=json_encode($bibliography_list);
  
  drupal_add_js( array(
    'ir_citation' => array(
      'bibliography_lists' => array(
        $variable_name => $bibliography_json,
      )
    )
  ), 'setting');
  
  return $bibliography_json;
}

/**
 * This function will add a bibliography selector to 
 * @param string $bibliography_selector
 *   json string representing a selector for bibliographies:
 *   http://gsl-nagoya-u.net/http/pub/citeproc-doc.html#selective-output
 * @param string $variable_name
 *   This name to make the json available under.
 */
function load_bibliography_selector($bibliography_selector, $variable_name) {
    drupal_add_js( array(
    'ir_citation' => array(
      'bibliography_selectors' => array(
        $variable_name => $bibliography_selector,
      )
    )
  ), 'setting');
}

/**
 * This function will make available the supplied citation object json for use with citeproc-js
 * on the current page being generated's javacript
 * @param string $variable_name
 *   This name to make the json available under.
 * @param stirng $json
 *   The json to make available.  The formatting can be found here: 
 *   http://gsl-nagoya-u.net/http/pub/citeproc-doc.html#citation-data-object
 */
function load_citeproc_citation_object_for_javascript($json, $variable_name) {
  drupal_add_js( array(
    'ir_citation' => array(
      'citation_objects' => array(
        $variable_name => $json,
      )
    )
  ), 'setting');
}

/**
 * This function will make available the supplied CSL string for use with citeproc-js
 * on the current page being generated's javacript
 * @param string $variable_name
 *   This name to make the CSL available under.
 * @param stirng $csl
 *   The xml CSL to make available.
 */
function load_csl_for_javascript($variable_name, $csl) {
  drupal_add_js( array(
    'ir_citation' => array(
      'csl' => array(
        $variable_name => $csl,
      )
    )
  ), 'setting');
}

/**
 * This function will make available the supplied locale string for use with citeproc-js
 * on the current page being generated's javacript
 * @param string $lang
 *   This name to make the locale available under.
 * @param stirng $locale
 *   The xml locale data to make available.
 */
function load_locale($lang, $locale) {
  drupal_add_js( array(
    'ir_citation' => array(
      'locale' => array(
        $lang => $locale,
      )
    )
  ), 'setting');
  
}

/**
 * This function will make available the supplied abbreviation data for use with citeproc-js
 * on the current page being generated's javacript
 * @param string $name
 *   This name to make the abreviation available under.
 * @param string $var_type
 *   This type of abbreviation data. ie."institution"
 * @param stirng $abbreviation_data
 *   The abbreviation data to make available.
 */
function load_abbreviation($name, $var_type, $abbreviation_data) {
  drupal_add_js( array(
    'ir_citation' => array(
      'abbreviations' => array(
        $name => array(
          $var_type => $abbreviation_data,
        )
      )
    )
  ), 'setting');
}


/**
 * This will get the mods datastream from the indicated fedora pid
 * @param string $pid
 *   The pid to get the mods datastream from
 * @return mixed $cite_mods
 *   The string of the mods datastream from the indicate pid. Or false if there is none
 */
function get_mods_from_pid($pid) {
  module_load_include('object.inc', 'islandora_fedora_api'); //for getting an object
  $object= new FedoraObject($pid);
  global $user;
  $object_datastreams=$object->get_datastreams();
  if (!isset($object_datastreams['MODS'])) {
    return FALSE;
  }
  
  //get the DS xml
  $mods_datastream=$object_datastreams['MODS'];
  $cite_mods=$mods_datastream->__get('content');
  
  return $cite_mods;
}