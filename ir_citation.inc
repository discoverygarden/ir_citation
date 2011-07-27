<?php
/**
 * @file
 *   This file supplies helper functions and utilities to the ir_citation module.
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
  
  //custom for the module loads we may or may not have something here, it depends on later choices
  //currently being used to launch demo/test
  drupal_add_js(drupal_get_path('module', 'ir_citation') . '/try.js');
}

/**
 * This function will make available the supplied CSL string for use with citeproc-js
 * on the current page being generated's javacript
 * @todo
 *   account for multiple uses fo the same variable name
 */
function load_csl_for_javascript($variable_name, $csl) {
  //escape quotes
  //@todo needs testing, if it works at all, will this work if there are multiple calls?
  drupal_add_js( array(
    'ir_citation' => array (
      'csl' => array(
        $variable_name => $csl,
      )
    )
  ), 'setting');
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
 */
function mods_to_citeproc_json($cite_mods) {
  
}

/**
 * @todo
 *   account for multiple uses fo the same variable name
 */
function load_json_for_javascript($variable_name, $citeroc_json) {
  //@todo needs testing, if it works at all, will this work if there are multiple calls?
  drupal_add_js( array(
    'ir_citation' => array (
      'citeproc_json' => array(
        $variable_name => $csl,
      )
    )
  ), 'setting');
}