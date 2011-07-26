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

/*global CSL: true */

CSL.Node.citation = {
	build: function (state, target) {
		if (this.tokentype === CSL.START) {

			state.fixOpt(this, "names-delimiter", "delimiter");
			state.fixOpt(this, "name-delimiter", "delimiter");
			state.fixOpt(this, "name-form", "form");
			state.fixOpt(this, "and", "and");
			state.fixOpt(this, "delimiter-precedes-last", "delimiter-precedes-last");
			state.fixOpt(this, "delimiter-precedes-et-al", "delimiter-precedes-et-al");
			state.fixOpt(this, "initialize-with", "initialize-with");
			state.fixOpt(this, "name-as-sort-order", "name-as-sort-order");
			state.fixOpt(this, "sort-separator", "sort-separator");
			state.fixOpt(this, "and", "and");

			state.fixOpt(this, "et-al-min", "et-al-min");
			state.fixOpt(this, "et-al-use-first", "et-al-use-first");
			state.fixOpt(this, "et-al-use-last", "et-al-use-last");
			state.fixOpt(this, "et-al-subsequent-min", "et-al-subsequent-min");
			state.fixOpt(this, "et-al-subsequent-use-first", "et-al-subsequent-use-first");

			state.build.area_return = state.build.area;
			state.build.area = "citation";
		}
		if (this.tokentype === CSL.END) {

			// Open an extra key at first position for use in
			// grouped sorts.
			// print("in cs:citation END");
			state.opt.grouped_sort = state.opt.xclass === "in-text" 
				&& state.citation.opt.collapse 
				&& state.citation.opt.collapse.length
				&& state.opt.update_mode !== CSL.POSITION
				&& state.opt.update_mode !== CSL.NUMERIC;
			
			if (state.opt.grouped_sort 
				&& state.citation_sort.opt.sort_directions.length) {
				
				var firstkey = state.citation_sort.opt.sort_directions[0].slice();
				// print("extending sort keys "+state.citation_sort.opt.sort_directions+" with "+firstkey);
				state.citation_sort.opt.sort_directions = [firstkey].concat(state.citation_sort.opt.sort_directions);
				// print("new key directions in effect: "+state.citation_sort.opt.sort_directions);
			}
			// print("creating new comparifier");
			state.citation.srt = new CSL.Registry.Comparifier(state, "citation_sort");
			state.build.area = state.build.area_return;
		}
	}
};

