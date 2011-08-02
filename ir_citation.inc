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
  //library loads
  drupal_add_js(drupal_get_path('module', 'ir_citation') . '/citeproc-js/xmle4x.js');
  drupal_add_js(drupal_get_path('module', 'ir_citation') . '/citeproc-js/xmldom.js');
  drupal_add_js(drupal_get_path('module', 'ir_citation') . '/citeproc-js/citeproc.js');
  
  /*module specific javascript for making drupal api work with the citeproc javascript*/
  //creates a 'sys' object that gives the citeproc engine access to the variables set by drupal
  drupal_add_js(drupal_get_path('module', 'ir_citation') . '/ir_citation_sys.js');
  //currently being used to launch demo/test
  drupal_add_js(drupal_get_path('module', 'ir_citation') . '/try.js');
}

/**
 * This function will create and make available the citeproc_json related to the fedora object
 * Relies on the MODS datastream
 * The indicated CSL will also be made available
 * @param string $fedora_pid
 *   The pid of the fedora object to cite.  This is also used as the variable name for the json and CSL
 * @param string $csl
 *   The CSL to be applied to the fedora object's citation.
 */
function create_citeation_for_pid($fedora_pid, $csl) {
  //get the mods from fedora
  $cite_mods='';
  //load json
  load_citeproc_json_from_mods($fedora_pid, $cite_mods);
  //load citation
  load_csl_for_javascript($fedora_pid, $csl);
}

/** 
 * This is a convienence function that simply wraps mods_to_citeproc_json
 * and load_json_for_javascript
 */
function load_citeproc_json_from_mods($variable_name, $cite_mods) {
  //get json
  $citeproc_json=mods_to_citeproc_json($cite_mods);
  //load json in javascript
  load_json_for_javascript($variable_name, $citeproc_json);
}

/**
 * This function will transform the MODS string it is given into a json format 
 * that the citeproc-js engine can understand
 * This function is a module level api style wrapper for converting mods to citeproc_jason
 * @param $cite_mods
 *   The mods to convert to citeproc_json for citation purposes
 * @return
 *   The json formated citation data
 */
function mods_to_citeproc_json($cite_mods) {
  module_load_include('php', 'ir_citation', 'mods_to_citeproc_json/converter');
  return (convert_mods_to_citeproc_json($cite_mods));
}

/**
 * This function will make available the supplied json for use with citeproc-js
 * on the current page being generated's javacript
 * @todo
 *   account for multiple uses fo the same variable name
 * @param string $variable_name
 *   This name to make the json available under.
 * @param stirng $citeproc_json
 *   The json to make available.
 */
function load_json_for_javascript($variable_name, $citeproc_json) {
  //@todo needs testing, if it works at all, will this work if there are multiple calls?
  drupal_add_js( array(
    'ir_citation' => array(
      'citeproc_json' => array(
        $variable_name => $citeproc_json,
      )
    )
  ), 'setting');
}

/**
 * This function will make available the supplied CSL string for use with citeproc-js
 * on the current page being generated's javacript
 * @todo
 *   account for multiple uses fo the same variable name
 * @param string $variable_name
 *   This name to make the CSL available under.
 * @param stirng $csl
 *   The xml CSL to make available.
 */
function load_csl_for_javascript($variable_name, $csl) {
  //escape quotes?
  //@todo needs testing, if it works at all, will this work if there are multiple calls?
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
 * @todo
 *   account for multiple uses fo the same variable name
 * @param string $lang
 *   This name to make the locale available under.
 * @param stirng $locale
 *   The xml locale datat to make available.
 */
function load_locale($lang, $locale) {
  //@todo needs testing, if it works at all, will this work if there are multiple calls?
  //@todo may be better to provide as json rather than creating that client side
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
 * @todo
 *   account for multiple uses fo the same variable name
 * @param string $name
 *   This name to make the abreviation available under.
 * @param string $var_type
 *   This type of abbreviation data. ie."institution"
 * @param stirng $abbreviation
 *   The abbreviation data to make available.
 */
function load_abbreviation($name, $var_type, $abbreviation) {
  //@todo needs testing, if it works at all, will this work if there are multiple calls?
  //@todo may be better to provide abbreviation as json
  drupal_add_js( array(
    'ir_citation' => array(
      'abbreviations' => array(
        $name => array(
          $var_type => $abbreviation,
        )
      )
    )
  ), 'setting');
}
