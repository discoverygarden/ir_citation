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

CSL.NameOutput = function(state, Item, item, variables) {
	this.debug = false;
	//SNIP-START
	if (this.debug) {
		print("(1)");
	}
	//SNIP-END
	this.state = state;
	this.Item = Item;
	this.item = item;
	this.nameset_base = 0;
	this._author_is_first = false;
	this._please_chop = false;
};

CSL.NameOutput.prototype.init = function (names) {
	if (this.nameset_offset) {
		this.nameset_base = this.nameset_base + this.nameset_offset;
	}
	this.nameset_offset = 0;
	this.names = names;
	this.variables = names.variables;
	if (this.nameset_base === 0 && this.variables[0] === "author") {
		this._author_is_first = true;
	}
	this.state.tmp.value = [];
	for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		if (this.Item[this.variables[i]] && this.Item[this.variables[i]].length) {
			this.state.tmp.value = this.state.tmp.value.concat(this.Item[this.variables[i]]);
		}
	}
	this["et-al"] = undefined;
	this["with"] = undefined;
	this.name = undefined;
	// long, long-with-short, short
	this.institutionpart = {};
	// family, given
	//this.namepart = {};
	// before, after
	//this.label = {};
};


CSL.NameOutput.prototype.reinit = function (names) {
	if (!this._hasValues()) {
		this.nameset_offset = 0;
		// What-all should be carried across from the subsidiary
		// names node, and on what conditions? For each attribute,
		// and decoration, is it an override, or is it additive?
		this.variables = names.variables;
	}
};

CSL.NameOutput.prototype._hasValues = function () {
	for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		var v = this.variables[i];
		if (this.Item[v]) {
			// ??? If substitution is working correctly,
			// this check should not be necessary
			return true;
		}
	}
	return false;
};

CSL.NameOutput.prototype.outputNames = function () {
	var i, ilen;
	var variables = this.variables;
	this.variable_offset = {};

	if (this.family) {
		this.family_decor = CSL.Util.cloneToken(this.family);
		this.family_decor.strings.prefix = "";
		this.family_decor.strings.suffix = "";
		// Sets text-case value (text-case="title" is suppressed for items
		// non-English with non-English value in Item.language)
		for (var i = 0, ilen = this.family.execs.length; i < ilen; i += 1) {
			this.family.execs[i].call(this.family_decor, this.state, this.Item);
		}
	} else {
		this.family_decor = false;
	}

	if (this.given) {
		this.given_decor = CSL.Util.cloneToken(this.given);
		this.given_decor.strings.prefix = "";
		this.given_decor.strings.suffix = "";
		// Sets text-case value (text-case="title" is suppressed for items
		// non-English with non-English value in Item.language)
		for (var i = 0, ilen = this.given.execs.length; i < ilen; i += 1) {
			this.given.execs[i].call(this.given_decor, this.state, this.Item);
		}
	} else {
		this.given_decor = false;
	}

	//SNIP-START
	if (this.debug) {
		print("(2)");
	}
	//SNIP-END
	// util_names_etalconfig.js
	this.getEtAlConfig();
	//SNIP-START
	if (this.debug) {
		print("(3)");
	}
	//SNIP-END
	// util_names_divide.js
	this.divideAndTransliterateNames();
	//SNIP-START
	if (this.debug) {
		print("(4)");
	}
	//SNIP-END
	// util_names_truncate.js
	this.truncatePersonalNameLists();
	//SNIP-START
	if (this.debug) {
		print("(5)");
	}
	//SNIP-END
	// util_names_constraints.js
	this.constrainNames();
	//SNIP-START
	if (this.debug) {
		print("(6)");
	}
	//SNIP-END
	// form="count"
	if (this.name.strings.form === "count") {
		this.state.output.append(this.names_count, "empty");
		return;
	}
	//SNIP-START
	if (this.debug) {
		print("(7)");
	}
	//SNIP-END
	// util_names_disambig.js
	this.disambigNames();
	//SNIP-START
	if (this.debug) {
		print("(8)");
	}
	//SNIP-END
	this.setEtAlParameters();
	//SNIP-START
	if (this.debug) {
		print("(9)");
	}
	//SNIP-END
	this.setCommonTerm();
	//SNIP-START
	if (this.debug) {
		print("(10)");
	}
	//SNIP-END
	this.renderAllNames();
	//SNIP-START
	if (this.debug) {
		print("(11)");
	}
	//SNIP-END
	var blob_list = [];
	for (i = 0, ilen = variables.length; i < ilen; i += 1) {
		var v = variables[i];
		var institution_sets = [];
		var institutions = false;
		//SNIP-START
		if (this.debug) {
			print("(11a)");
		}
		//SNIP-END
		for (var j = 0, jlen = this.institutions[v].length; j < jlen; j += 1) {
			institution_sets.push(this.joinPersonsAndInstitutions([this.persons[v][j], this.institutions[v][j]]));
		}
		//SNIP-START
		if (this.debug) {
			print("(11b)");
		}
		//SNIP-END
		if (this.institutions[v].length) {
			var pos = this.nameset_base + this.variable_offset[v];
			if (this.freeters[v].length) {
				pos += 1;
			}
			institutions = this.joinInstitutionSets(institution_sets, pos);
		}
		//SNIP-START
		if (this.debug) {
			print("(11c)");
		}
		//SNIP-END
		var varblob = this.joinFreetersAndInstitutionSets([this.freeters[v], institutions]);
		//SNIP-START
		if (this.debug) {
			print("(11d)");
		}
		//SNIP-END
		if (varblob) {
			// Apply labels, if any
			varblob = this._applyLabels(varblob, v);
			blob_list.push(varblob);
		}
		//SNIP-START
		if (this.debug) {
			print("(11e)");
		}
		//SNIP-END
		if (this.common_term) {
			break;
		}
	}
	//SNIP-START
	if (this.debug) {
		print("(12)");
	}
	//SNIP-END
	this.state.output.openLevel("empty");
	this.state.output.current.value().strings.delimiter = this.names.strings.delimiter;
	//SNIP-START
	if (this.debug) {
		print("(13)");
	}
	//SNIP-END
	for (i = 0, ilen = blob_list.length; i < ilen; i += 1) {
		// notSerious
		this.state.output.append(blob_list[i], "literal", true);
	}
	//SNIP-START
	if (this.debug) {
		print("(14)");
	}
	//SNIP-END
	this.state.output.closeLevel("empty");
	//SNIP-START
	if (this.debug) {
		print("(15)");
	}
	//SNIP-END
	var blob = this.state.output.pop();
	//SNIP-START
	if (this.debug) {
		print("(16)");
	}
	//SNIP-END
	this.state.output.append(blob, this.names);
	//SNIP-START
	if (this.debug) {
		print("(17)");
	}
	//SNIP-END
	// Also used in CSL.Util.substituteEnd (which could do with
	// some cleanup at this writing).
	//SNIP-START
	if (this.debug) {
		print("(18)");
	}
	//SNIP-END
	this.state.tmp.name_node = this.state.output.current.value();
	// Let's try something clever here.
	this._collapseAuthor();
	// For name_SubstituteOnNamesSpanNamesSpanFail
	this.variables = [];
	//SNIP-START
	if (this.debug) {
		print("(19)");
	}
	//SNIP-END
};

CSL.NameOutput.prototype._applyLabels = function (blob, v) {
	var txt;
	if (!this.label) {
		return blob;
	}
	var plural = 0;
	var num = this.freeters_count[v] + this.institutions_count[v];
	if (num > 1) {
		plural = 1;
	} else {
		for (var i = 0, ilen = this.persons[v].length; i < ilen; i += 1) {
			num += this.persons_count[v][i];
		}
		if (num > 1) {
			plural = 1;
		}
	}
	// Some code duplication here, should be factored out.
	if (this.label.before) {
		if ("number" === typeof this.label.before.strings.plural) {
			plural = this.label.before.strings.plural;
		}
		txt = this._buildLabel(v, plural, "before");
		this.state.output.openLevel("empty");
		this.state.output.append(txt, this.label.before, true);
		this.state.output.append(blob, "literal", true);
		this.state.output.closeLevel("empty");
		blob = this.state.output.pop();
	}
	if (this.label.after) {
		if ("number" === typeof this.label.after.strings.plural) {
			plural = this.label.after.strings.plural;
		}
		txt = this._buildLabel(v, plural, "after");
		this.state.output.openLevel("empty");
		this.state.output.append(blob, "literal", true);
		this.state.output.append(txt, this.label.after, true);
		this.state.output.closeLevel("empty");
		blob = this.state.output.pop();
	}
	return blob;
};

CSL.NameOutput.prototype._buildLabel = function (term, plural, position) {
	if (this.common_term) {
		term = this.common_term;
	}

	var ret = false;
	var node = this.label[position];
	if (node) {
		ret = CSL.castLabel(this.state, node, term, plural);
	}
	return ret;
};


CSL.NameOutput.prototype._collapseAuthor = function () {
	var myqueue, mystr, oldchars;
	// collapse can be undefined, an array of length zero, and probably
	// other things ... ugh.
	if ((this.item && this.item["suppress-author"] && this._author_is_first)
		|| (this.state[this.state.tmp.area].opt.collapse 
			&& this.state[this.state.tmp.area].opt.collapse.length)) {

		if (this.state.tmp.authorstring_request) {
			// Avoid running this on every call to getAmbiguousCite()?
			mystr = "";
			myqueue = this.state.tmp.name_node.blobs.slice(-1)[0].blobs;
			oldchars = this.state.tmp.offset_characters;
			if (myqueue) {
				mystr = this.state.output.string(this.state, myqueue, false);
			}
			// Avoid side-effects on character counting: we're only interested
			// in the final rendering.
			this.state.tmp.offset_characters = oldchars;
			this.state.registry.authorstrings[this.Item.id] = mystr;
		} else if (!this.state.tmp.just_looking
			&& !this.state.tmp.suppress_decorations) {

			// XX1 print("RENDER: "+this.Item.id);
			mystr = "";
			myqueue = this.state.tmp.name_node.blobs.slice(-1)[0].blobs;
			oldchars = this.state.tmp.offset_characters;
			if (myqueue) {
				mystr = this.state.output.string(this.state, myqueue, false);
			}
			if (mystr === this.state.tmp.last_primary_names_string) {
			
				// XX1 print("    CUT!");
				this.state.tmp.name_node.blobs.pop();
				// If popped, avoid side-effects on character counting: we're only interested
				// in things that actually render.
				this.state.tmp.offset_characters = oldchars;
			} else {
				// XX1 print("remembering: "+mystr);
				this.state.tmp.last_primary_names_string = mystr;

				// XXXXX A little more precision would be nice.
				// This will clobber variable="author editor" as well as variable="author".
				if (this.variables.indexOf("author") > -1 && this.item && this.item["suppress-author"]) {
					this.state.tmp.name_node.blobs.pop();
					// If popped, avoid side-effects on character counting: we're only interested
					// in things that actually render.
					this.state.tmp.offset_characters = oldchars;
				}
				// Arcane and probably unnecessarily complicated
				this.state.tmp.have_collapsed = false;
			}
		}
	}
};

/*
CSL.NameOutput.prototype.suppressNames = function() {
	suppress_condition = suppress_min && display_names.length >= suppress_min;
	if (suppress_condition) {
		continue;
	}
}
*/
