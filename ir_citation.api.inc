<?php
/**
* Higher Level API
*@file
*  This file make it easier to use the ir_citation module.
*  It is meant to only be the only interface with this module.
*  Use the lower-level functions for more detailed work at your own risk.
*  They may conflict with use of this API.
*@author
*  William Panting
*  
*@todo
*  Create datastructures for preventing data duplication
*@todo
*  Implement data duplication prevention strategy... 
*  we keep a record of all data inputed and the aliases at this level
*  so that we only add one copy Javascript side.
*@todo
*  somehow prevent the function load_citeproc_javascript() from running multiple times...
*/

/**
 * This class is meant to be used as a helper API to make using citeproc-js
 * easier on the drupal side.  It is not meant to be a complete API but rather
 * to provide a simplified API to fit and automate as much as possible of the
 * most common usecasses.  All data added to JavaScript through this class will
 * have a unique (to the session) prefix added to avoid collisions.
 * There will also be only one copy of all the data sent to the front end.
 * 
 * @author 
 *   William Panting
 *   
 * @todo
 *   Create/implement get HTML functionality. [output the spans for templates]
 * @todo
 *   wrap abbreviations 
 *   adding an item, getting list of aliases, getting a copy from an alias
 * @todo
 *   wrap metadata objects 
 *   adding an item, getting list of aliases, getting a copy from an alias
 * @todo
 *   wrap localization strings --these may need less work because they will have standard aliases needing to match the CSLs
 *   adding an item, getting list of aliases, getting a copy from an alias
 * @todo
 *   wrap citation objects 
 *   adding an item, getting list of aliases, getting a copy from an alias
 * @todo
 *   wrap bibliography_lists 
 *   adding an item, getting list of aliases, getting a copy from an alias
 * @todo
 *   wrap bibliography_selectors 
 *   adding an item, getting list of aliases, getting a copy from an alias
 * @todo
 *   wrap csl
 *   adding an item, getting list of aliases, getting a copy from an alias
 */
class IslandoraCitationAPI {
  
  /*prefixes all javascirpt variables in the form
     $uniquePrefix_var_name to prevent collisions.
     This should be compeletely hidden from the users
     */
  protected $uniquePrefix='';
  
  /*These two arrays are used to map aliases to their content using an internal pointer
   * $aliasPointer[$pointer]=array of aliases
   * $contentPointer[$pointer]=content
   * */
  protected $aliasPointer=array();
  protected $contentPointer=array();
  
  /**
   * This is the class constructor.  It sets up the object for use.
   * 
   * @return int $uid
   *   This $uid is used to prefix all javascirpt variables in the form
   *   $uid_var_name to prevent collisions.
   */
  public function __construct() {
    //create new id for this object
    $uid=IslandoraCitationAPI::getNewUID();
    //set it
    $this->uniquePrefix=$uid;
    //get it and return it
    return $this->uniquePrefix;
  }
  
  /**
   * This function will return a unique identifieer for the object (unique in this session)
   * the identifier is used to avoid name collisions in javascript space.
   * 
   * @return int $uid
   *   This $uid is used to prefix all javascirpt variables in the form
   *   $uid_var_name to prevent collisions.
   */
  public static function getNewUID() {
    if (!isset($_SESSION['ir_citation']['uid'])) {
      $_SESSION['ir_citation']['uid']=0;
    }
    else {
      $_SESSION['ir_citation']['uid']++;
    }
    return ($_SESSION['ir_citation']['uid']);
  }
  
  /**
   * This will return the UID being used for this object
   * 
   * @return int $uid
   *   This $uid is used to prefix all javascirpt variables in the form
   *   $uid_var_name to prevent collisions.
   */
  public function getUID() {
    return $this->uniquePrefix;
  }
   
  /**
  * This is a convienence function that will create and upload a basic citation object
  * @param string $meta_data_alias
  *   It sets the id for the create_basic_citation_object_json function.
  *   This needs to match one of the names of a meta data json objects uploaded
  * @param string $citation_object_alias
  *   This name to make the json available under.
  */
  public function loadBasicCitationObject($meta_data_alias, $citation_object_alias) {
    module_load_include('inc', 'ir_citation', 'ir_citation');
    
    $citation_object_alias= $this->uniquePrefix . $citation_object_alias;
    
    $json= $this->createBasicCitationObject($meta_data_alias);
    return (load_citeproc_citation_object_for_javascript($json, $citation_object_alias));
  }
  
  /**
   * 
   */
  public function addData($type, $alias, $content) {
    
  }
  
  /**
  *
  */
  public function addMetaDataFromPID($alias, $pid) {
  
  }
  
  
  /**
  *
  */
  public function addMetaDataFromMODS($alias, $mods) {
  
  }
  
  /**
   */
  public function getAliasList(array $content_and_type=array(
    'content' => NULL, 'type' => NULL)) {
    
  }
  
  /**
   * 
   */
  public function getContent($alias) {
    
  }
  
  /**
   * 
   */
  public function getCitationHTML($csl_alias, array $biblist_or_citation_alias=array(
    'bibliography_list' => NULL, 'citation' => NULL), array $optional_args=array(
      'bibliography_slector' => NULL,
      'abbreviations' => NULL
      )) {
    $citeproc_markup='';
    /*
    $citeproc_markup='<span class="ir_citation" data-ir_citation_style="chicago_author_date" data-ir_citation_object="citationCAD7"
       name="citation_cad">THERE SHOULD BE A CITATION OR BIBLIOGRAPHY HERE</span>';
    */
    //if it's a citation
    if (isset($biblist_or_citation_alias['citation'])) {
      
    }
    //if it's a bibliography
    elseif (isset($biblist_or_citation_alias['bibliography_list'])) {
      
    }
    else {//bad call
      return '';
    }
    
    return $citeproc_markup;
  }
  
  /**
  * Function will create a basic citation object
   * @param array $meta_data_alias_list
  *   This is an array of the aliases (meta data objects) that the citeproc
  *   engine will use to create the bibliography,
  *   each member of the list needs to be the same as
  *   one of the uploaded citeproc citation meta data objects
  * @param array $bibliography_list_alias
  *
  * @return
  *   The json of the bibliography list
  */
  public function loadBasicBibliographyList(array $meta_data_alias_list, $bibliography_list_alias) {
  module_load_include('inc', 'ir_citation', 'ir_citation');
      // iterate through aliases adding the prefix
  foreach ($meta_data_alias_list as $meta_data_alias_key=>$meta_data_alias) {
  $meta_data_alias_list[$meta_data_alias_key] = $this->uniquePrefix . $meta_data_alias;
  }
  
  // add the prefix to the csl alias
  $bibliography_list_alias = $this->uniquePrefix . $bibliography_list_alias;
  //send to javascript
  return load_bibliography_list_for_javascript($meta_data_alias_list, $bibliography_list_alias);
  } 
  
  /*
   *PRIVATE HELPER FUNCTIONS 
   */
  
  /**
  * Function will create a basic citation object
  * @param string $meta_data_aliases
  *   This is the id that the citeproc engine will use to find the citation,
  *   so it needs to be the same as 
  *   one of the uploaded citeproc citation meta data objects
  * @return
  *   The json of the citaiton object
  */
  private function createBasicCitationObject($meta_data_alias) {
    return '{
  	"citationItems": [
          {
  			"id":"' . $this->uniquePrefix . $id . '"
  		}
  	]}';
  }
}