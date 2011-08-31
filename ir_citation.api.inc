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
*  Implement data duplication prevention strategy... 
*  we keep a record of all data inputed and the aliases at this level
*  so that we only add one copy Javascript side.  This may be difficult because of 
*  the aliases being put directly in content [not my fualt, i swear]
*@todo
*  lots of testing!!!!
*/

/**
 * This class is meant to be used as a helper API to make using citeproc-js
 * easier on the drupal side.  It is not meant to be a complete API but rather
 * to provide a simplified API to fit and automate as much as possible of the
 * most common usecasses.  All data added to JavaScript through this class will
 * have a unique (to the page) prefix added to avoid collisions.
 * There will also be only one copy of all the data sent to the front end.
 * 
 * @author 
 *   William Panting
 *   
 * @todo
 *   implement getAliasList
 *   using static alias and content arrays may make it os that we can avoid all data duplication
 */
class IslandoraCitationAPI {
  /*
   * These static varaibles are used to make sure that different instances of this
   * class don't step on each others feet.
   */
  static protected $citationProcessorEnabled=FALSE;
  static protected $classCount=0;
  
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
  //pointers need to be unique
  protected $pointerCount=0;
  
  /**
   * This is the class constructor.  It sets up the object for use.
   * 
   * @return int $this->uniquePrefix
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
    //get a basic object
    $json= $this->createBasicCitationObject($meta_data_alias);
    //send it to javascript
    return ($this->loadCitation($json, $citation_object_alias));
  }
  
  /**
   * @param string $type
   *   This can be 1 of 7 different types.
   *   'csl'
   *   'bibliography_list'
   *   'bibliography_selector'
   *   'metadata'
   *   'citation'
   *   'abbreviation'
   *   'locale'
   * @param string $alias
   *   This is the alias that someone using the api can reference the data they have 
   *   made available by.
   * @param mixed $content 
   *   This needs to be an array for bibliogrpahy_list and a string for everything else
   * @param string $var_type
   *   This type of abbreviation data. ie."institution"
   * @return mixed
   *   A string of what has been added to javaScript
   *   or FALSE if nothing was
   */
  public function addData($type, $alias, $content, $var_type=NULL) {
    //don't add if the alias already was used
    if ($this->isAliasUsed($alias)) {
      return FALSE;
    }
    //if the content already esists, don't add it again, just create a new alias
    /*if ($this->isContentDuplicated($content)) {
      //get the pointer for the alias
      $pointer=;
      $aliasPointer[$alias]=$pointer
    }*/
    //otherwiase create a new pointer and log both the alias and the content
    $pointer=$this->getNewPointer();
    $this->aliasPointer[$alias]=$pointer;
    $this->contentPointer[$pointer]=$content;
    
    //LOG ALIAS AND CONTENT
    //send data to javascript
    switch ($type) {
      case 'csl':
        return ($this->loadCSL($content, $alias));
        break;
      case 'bibliography_list':
        return ($this->loadBibliographyList($content, $alias));
        break;
      case 'bibliography_slector':
        return ($this->loadBibliogrpahySelector($content, $alias));
        break;
      case 'metadata':
        return ($this->loadMetadata($content, $alias));
        break;
      case 'citation':
        return ($this->loadCitation($content, $alias));
        break;
      case 'abbreviation':
        if ($var_type!=NULL) {// var type needs to be present for abbreviations
          return ($this->loadAbbreviation($content, $alias, $var_type));
        }
        else {
          return FALSE;
        }
        break;
      case 'locale':
        return ($this->loadLocale($content, $alias));
        break;
      default:
        return (FALSE);
    }
  }
  
  /**
  *This function calls $this->addMetaDataFromMODS which calls
  *$this->addData on the final metadata object 
  *@param string $alias
  *  The php side name for the data.
  *@param string $pid
  *  The fedora pid to get the mods datastream from
  *@return string 
  *  the final json added.
  */
  public function addMetaDataFromPID($alias, $pid) {
    module_load_include('inc', 'ir_citation', 'ir_citation');
    //get the mods from the fedora object
    $mods=get_mods_from_pid($pid);
    //send to javascript
    return ($this->addMetaDataFromMODS($alias, $mods));
  }
  
  /**
  *This function will change mods to a citation processor json metadata object
  *and send it to javascript
  *@param string $alias
  *  The php side name for the data.
  *@param string $mods
  *  The mods metadata to change to json and send to javascript
  *@return string 
  *  the final json added.
  */
  public function addMetaDataFromMODS($alias, $mods) {
    module_load_include('inc', 'ir_citation', 'ir_citation');
    //get the json from the metadata
    $json=mods_to_citeproc_json($mods, $this->prefixAlias($alias));
    
    //send to javascrit side and record data localy to prevent duplication
    $type='metadata';
    return ($this->addData($type, $alias, $mods));
  }

  //HELPFUL BUT NOT REQUIRED OPTIMAIZATION
  /*
   * This function will get all the aliases if one or more exists
   * that is associated with the indicated content and/or type of data
   * @param array $content_and_type
   *
  public function getAliasList(array $content_and_type=array(
    'content' => NULL, 'type' => NULL)) {
    
    if (isset($content_and_type['content']) && isset($content_and_type['type'])) {
      
    }
    elseif (isset($content_and_type['content'])) {
    
    }
    elseif (isset($content_and_type['type'])) {
    
    }
    else {
      return FALSE;
    }
  }
  */
  /**
   * This function will return the content associated with the alias
   * @param string $alias
   *   Used to look up the data to return.
   * @return mixed
   *   False if there is no data to return
   *   or a string of the data. 
   */
  public function getContent($alias) {
    if (isAliasUsed($alias)) {
      return $this->contentPointer[$this->aliasPointer[$alias]];
    }
    else {
      return FALSE;
    }
  }
  
  /**
   * This function will give the user an html string that they can insert
   * into their templates.  The html span given will have its inner html
   * replaced by a citation generated client side.
   * @param string $csl_alias
   *   The alias of the CSL data to use for this markup
   * @param array $biblist_or_citation_alias
   *   The alias of the data to be used as the bases for this citation
   *   Since there are two types of data that can be used for the bases of the citation
   * @param array $optional_args
   * @return string $citeproc_markup
   */
  public function getCitationHTML($csl_alias, array $biblist_or_citation_alias=array(
    'bibliography_list' => NULL, 'citation' => NULL), array $optional_args=array(
      'bibliography_slector' => NULL,
      'abbreviations' => NULL
      )) {
    //start
    $citeproc_markup='<span class="ir_citation" ';
    
    //csl
    $citeproc_markup .= 'data-ir_citation_style="' . prefixAlias($csl_alias) . '" ';
    
    //abreviation
    if (isset($optional_args['abbreviations'])) {
      $citeproc_markup .= 'data-ir_citation_abbreviations="' . prefixAlias($optional_args['abbreviations']) . '" ';
    }
    
    //if it's a citation
    if (isset($biblist_or_citation_alias['citation'])) {
      $citeproc_markup .= 'data-ir_citation_object="' . prefixAlias($biblist_or_citation_alias['citation']) . '" ';
    }
    //if it's a bibliography
    elseif (isset($biblist_or_citation_alias['bibliography_list'])) {
      $citeproc_markup .= 'data-ir_citation_bibliography_list="' . prefixAlias($biblist_or_citation_alias['bibliography_list']) . '" ';
      //bibliography selector
      if (isset($optional_args['bibliography_slector'])) {
      $citeproc_markup .= 'data-ir_citation_bibliography_selector="' . prefixAlias($optional_args['bibliography_slector']) . '" ';
      
      }
    }
    else {//bad call
      return '';
    }
    
    //end
    $citeproc_markup .= '>THERE SHOULD BE A CITATION OR BIBLIOGRAPHY HERE</span>';
    
    return $citeproc_markup;
  }
  
  /**
   * This function is intended to make sure that the citeprocessor javascript is only added 
   * to the page once.
   * @return boolean
   *   FALSE if the javascript is not added because it already was for this page.
   *   TRUE if the javascript is added.
   *   Both return values indicate success
   */
  public static function loadCiteprocJavascript() {
    module_load_include('inc', 'ir_citation', 'ir_citation');
    //if the javascript has been loaded for this page already
    if (IslandoraCitationAPI::$citationProcessorEnabled) {
      return FALSE;
    }
    else {
      //if it hasn't been added yet
      load_citeproc_javascript();
      IslandoraCitationAPI::$citationProcessorEnabled=TRUE;
      return TRUE;
    }
  }
  
  /*
   *PRIVATE HELPER FUNCTIONS 
   */
  
  /**
  * This function will return a unique identifieer for the object (unique or this page)
  * the identifier is used to avoid name collisions in javascript space.
  *
  * @return int $uid
  *   This $uid is used to prefix all javascirpt variables in the form
  *   $uid_varName to prevent collisions.
  */
  private static function getNewUID() {
    $uid=IslandoraCitationAPI::$classCount;
    IslandoraCitationAPI::$classCount = $uid+1;
    return $uid;
  }
  
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
  			"id":"' . $this->prefixAlias($id) . '"
  		}
  	]}';
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
  private function loadBibliographyList(array $meta_data_alias_list, $bibliography_list_alias) {
    module_load_include('inc', 'ir_citation', 'ir_citation');
    // iterate through aliases adding the prefix
    foreach ($meta_data_alias_list as $meta_data_alias_key => $meta_data_alias) {
      $meta_data_alias_list[$meta_data_alias_key] = $this->prefixAlias($meta_data_alias);
    }
  
    // add the prefix to the csl alias
    $bibliography_list_alias = $this->prefixAlias($bibliography_list_alias);
    //send to javascript
    return load_bibliography_list_for_javascript($meta_data_alias_list, $bibliography_list_alias);
  }
  
  /**
  * This function wrapps adding data to JavaScript while avoiding nameing collisions
  * @param string $content
  * @param string $alias
  */
  private function loadCSL($content, $alias) {
    //init
    module_load_include('inc', 'ir_citation', 'ir_citation');
    $alias=$this->prefixAlias($alias);
    load_csl_for_javascript($alias, $content);
  }
  
  /**
  * This function wrapps adding data to JavaScript while avoiding nameing collisions
  * @param string $content
  * @param string $alias
  */
  private function loadBibliogrpahySelector($content, $alias) {
    //init
    module_load_include('inc', 'ir_citation', 'ir_citation');
    $alias=$this->prefixAlias($alias);
    load_bibliography_selector($content, $alias);
  }
  
  /**
  * This function wrapps adding data to JavaScript while avoiding nameing collisions
  * @param string $content
  * @param string $alias
  */
  private function loadMetadata($content, $alias) {
    //init
    module_load_include('inc', 'ir_citation', 'ir_citation');
    $alias=$this->prefixAlias($alias);
    load_metadata_object_for_javascript($alias, $content);
  }
  
  /**
  * This function wrapps adding data to JavaScript while avoiding nameing collisions
  * @param string $content
  * @param string $var_type
  *   This type of abbreviation data. ie."institution"
  * @param string $alias
  */
  private function loadAbbreviation($content, $var_type, $alias) {
    //init
    module_load_include('inc', 'ir_citation', 'ir_citation');
    $alias=$this->prefixAlias($alias);
    load_abbreviation($alias, $var_type, $content);
  }
  
  /**
  * This function wrapps adding data to JavaScript while avoiding nameing collisions
  * @param string $content
  * @param string $alias
  */
  private function loadLocale($content, $alias) {
    //init
    module_load_include('inc', 'ir_citation', 'ir_citation');
    $alias=$this->prefixAlias($alias);
    load_locale($alias, $content);
  }

  /**
   * This function wrapps adding data to JavaScript while avoiding nameing collisions
   * @param string $content
   * @param string $alias
   */
  private function loadCitation($content, $alias) {
    module_load_include('inc', 'ir_citation', 'ir_citation');
    $alias=$this->prefixAlias($alias);
    return (load_citeproc_citation_object_for_javascript($content, $alias));
  }
  
  /**
   * This function will take in the local alias and return the 
   * name that will be used JavaScript side
   * @param string $alias
   *   The name users of this api will need php side
   * @return string $javascript_variable_name
   *   The modified version of the alias that prevents naming collisions.
   */
  private function prefixAlias($alias) {
    $javascript_variable_name = $this->uniquePrefix . '_' . $alias;
    return $javascript_variable_name;
  }
  
  /**
   * This function is used to determine if the alias in question has already been assigned
   * @param string $alias
   *   The alias to check for
   * @return boolean
   *  TRUE if the alias already exists
   *  FALSE if the alias has not been assigned
   */
  private function isAliasUsed($alias) {
    if (isset($this->aliasPointer[$alias])) {
      return TRUE;
    }
    else {
      return FALSE;
    }
  }
  
  /**
  * This function will return a unique pointer to link aliases and content (unique or this page)
  * the pointer is used to in the scheme to avoid duplicate data in JS space.
  *
  * @return int $pointer
  *   The pointer for linking alias and content
  */
  private function getNewPointer() {
    $pointer=$this->pointerCount;
    $this->pointerCount = $pointer+1;
    return $pointer;
  }

  /*
   * This is a function that prevents the adding of content that is a duplicate of content already
    * added.  It prevents
  * @todo: this may be a premature optimization, implement last if there is time
  * @param unknown_type $content
  *
   private function isContentDuplicated ($content) {
  
  }*/
}