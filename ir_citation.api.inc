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
  static protected $citationProcessorEnabled=FALSE;//only add the citation javascript once
  static protected $classCount=0;//used to determine the prefix on aliases
  static protected $autoAliasCount=0;//used when an alias is not provided by the user
  
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
   * This will return the prefix being put on aliases
   * 
   * @return string
   *   The prefix for all javascirpt variables in the form
   *   $uid_
   */
  public function getJavaScriptPrefix() {
    return ($this->uniquePrefix . '_');
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
   * @return
   *   The data sent to JS, or FALSE if trouble hit
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
      case 'bibliography_selector':
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
          return ($this->loadAbbreviation($content, $var_type, $alias));
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
   *This is a wrapper function for future proofing the interface.
   *It allows for more meta data sources to be added later.
   *@param string $alias
   *  The php side name for the data.
   *@param string $source
   *  The data to turn into json metadata, or where to get the data
   *@param $source_type
   *  Is used to determine how to handle the $source can be:
   *  'pid'
   *  'mods'
   *@return 
   *  The data added to JavaScript, or FALSE if $source_type is invalid
   */
  public function addMetaData($alias, $source, $source_type=NULL) {
    switch ($source_type){
      case 'pid':
        return ($this->addMetaDataFromPID($alias, $source));
        break;
      case 'mods':
        return ($this->addMetaDataFromMODS($alias, $source));
        break;
      default:
        return FALSE;
    }
  }

  //HELPFUL BUT NOT REQUIRED 
  /*
   * This function will get all the aliases if one or more exists
   * that is associated with the indicated content and/or type of data
   * @param array $content_and_type
   * @todo
   *   abandoned the type thing so refactor to just give back the whole list if no content sent
   *
  public function getAliasList($content= NULL) {
    
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
    if ($this->isAliasUsed($alias)) {
      return $this->contentPointer[$this->aliasPointer[$alias]];
    }
    else {
      return FALSE;
    }
  }
  
  /**
   * This is a SUPER convienence function!!!
   * It saves a minimum of 3 lines of code for the user and a whole lot of thinking.
   * It will return the html span from the csl and a list of pids.
   * @param string $csl
   *   The csl sheet to use to create the citaton
   * @param array $pids
   *   The pids to create the citaion (1) or bibliography from.
   * @return mixed
   *   FALSE if there was an error, or the html that can be transformed into a citation/bibliography
   */
  public function getCitationHTMLFromPIDAndCSL($csl, array $pids) {
    //add csl
    $csl_alias=IslandoraCitationAPI::getNewAlias('CSL_auto');
    $type='csl';
    addData($type, $csl_alias, $csl);
    
    //if a bibliography
    if (count($pids)>1) {
      //loop through pids
      foreach ($pids as $pid_key => $pid) {
        $metadata_alias=IslandoraCitationAPI::getNewAlias('metadata_auto');
        $content[]=$metadata_alias;
        addMetaData($metadata_alias, $pid, $source_type='pid');
      }
      //add the bibliography
      $bibliography_alias=IslandoraCitationAPI::getNewAlias('bibliography_auto');
      $type='bibliography_list';
      addData($type, $bibliography_alias, $content);
      
      return(getCitationHTML($csl_alias, array('bibliography_list' => $bibliography_alias)));
    }
    
    //if a citation
    elseif (count($pids)==1) {
      $metadata_alias=IslandoraCitationAPI::getNewAlias('metadata_auto');
      $citation_alias=IslandoraCitationAPI::getNewAlias('citation_auto');
      
      addMetaData($metadata_alias, $pids[0], $source_type='pid');
      loadBasicCitationObject($metadata_alias, $citation_alias);
      
      return(getCitationHTML($csl_alias, array('citation' => $citation_alias))); 
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
    $citeproc_markup .= 'data-ir_citation_style="' . $this->prefixAlias($csl_alias) . '" ';
    
    //abreviation
    if (isset($optional_args['abbreviations'])) {
      $citeproc_markup .= 'data-ir_citation_abbreviations="' . $this->prefixAlias($optional_args['abbreviations']) . '" ';
    }
    
    //if it's a citation
    if (isset($biblist_or_citation_alias['citation'])) {
      $citeproc_markup .= 'data-ir_citation_object="' . $this->prefixAlias($biblist_or_citation_alias['citation']) . '" ';
    }
    //if it's a bibliography
    elseif (isset($biblist_or_citation_alias['bibliography_list'])) {
      $citeproc_markup .= 'data-ir_citation_bibliography_list="' . $this->prefixAlias($biblist_or_citation_alias['bibliography_list']) . '" ';
      //bibliography selector
      if (isset($optional_args['bibliography_slector'])) {
      $citeproc_markup .= 'data-ir_citation_bibliography_selector="' . $this->prefixAlias($optional_args['bibliography_slector']) . '" ';
      
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
  *This function calls $this->addMetaDataFromMODS which calls
   *$this->addData on the final metadata object
  *@param string $alias
  *  The php side name for the data.
  *@param string $pid
  *  The fedora pid to get the mods datastream from
  *@return string
  *  the final json added.
  */
  private function addMetaDataFromPID($alias, $pid) {
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
  private function addMetaDataFromMODS($alias, $mods) {
  module_load_include('inc', 'ir_citation', 'ir_citation');
  
  //get the json from the metadata
  $json=mods_to_citeproc_json($mods, $this->prefixAlias($alias));
  
  //send to javascrit side and record data localy to prevent duplication
  $type='metadata';
  return ($this->addData($type, $alias, $json));
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
  			"id":"' . $this->prefixAlias($meta_data_alias) . '"
  		}
  	], "properties": { "noteIndex": 1 }}';
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
  * @return
  *   The data sent to JS
  */
  private function loadCSL($content, $alias) {
    //init
    module_load_include('inc', 'ir_citation', 'ir_citation');
    $alias=$this->prefixAlias($alias);
    return (load_csl_for_javascript($alias, $content));
  }
  
  /**
  * This function wrapps adding data to JavaScript while avoiding nameing collisions
  * @param string $content
  * @param string $alias
  * @return
  *   The data sent to JS
  */
  private function loadBibliogrpahySelector($content, $alias) {
    //init
    module_load_include('inc', 'ir_citation', 'ir_citation');
    $alias=$this->prefixAlias($alias);
    return (load_bibliography_selector($content, $alias));
  }
  
  /**
  * This function wrapps adding data to JavaScript while avoiding nameing collisions
  * @param string $content
  * @param string $alias
  * @return
  *   The data sent to JS
  */
  private function loadMetadata($content, $alias) {
    //init
    module_load_include('inc', 'ir_citation', 'ir_citation');
    $alias=$this->prefixAlias($alias);
    return (load_metadata_object_for_javascript($alias, $content));
  }
  
  /**
  * This function wrapps adding data to JavaScript while avoiding nameing collisions
  * @param string $content
  * @param string $var_type
  *   This type of abbreviation data. ie."institution"
  * @param string $alias
  * @return
  *   The data sent to JS
  */
  private function loadAbbreviation($content, $var_type, $alias) {
    //init
    module_load_include('inc', 'ir_citation', 'ir_citation');
    $alias=$this->prefixAlias($alias);
    return (load_abbreviation($alias, $var_type, $content));
  }
  
  /**
  * This function wrapps adding data to JavaScript while avoiding nameing collisions
  * @param string $content
  * @param string $alias
  * @return
  *   The data sent to JS
  */
  private function loadLocale($content, $alias) {
    //init
    module_load_include('inc', 'ir_citation', 'ir_citation');
    $alias=$this->prefixAlias($alias);
    return (load_locale($alias, $content));
  }

  /**
   * This function wrapps adding data to JavaScript while avoiding nameing collisions
   * @param string $content
   * @param string $alias
  * @return
  *   The data sent to JS
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
  
  /**
   * This function is used to create aliases when none is given by the user
   * @param string $meaningfulName
   *   The type of data that is an alias is being created for (so that the aliases can have some meaning)
   * @return int $autoAlias
   *   The string of the alias to be used
   */
  private function getNewAlias($meaningfulName) {
    $autoAlias=IslandoraCitationAPI::$autoAliasCount;
    IslandoraCitationAPI::$autoAliasCount = $autoAlias+1;
    
    //recursion might not be the best way to handle the possiblity of collision
    $autoAlias.=$meaningfulName;
    if (!($this->isAliasUsed($autoAlias))) {
      return $autoAlias;
    }
    else {
      return (IslandoraCitationAPI::getNewAlias($autoAlias));
    }
  }
  
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
  * This will return the UID being used for this object
   *
  * @return int $uid
  *   This $uid is used to prefix all javascirpt variables in the form
  *   $uid_var_name to prevent collisions.
  */
  private function getUID() {
  return $this->uniquePrefix;
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