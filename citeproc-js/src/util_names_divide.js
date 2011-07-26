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

CSL.NameOutput.prototype.divideAndTransliterateNames = function () {
	var i, ilen;
	var Item = this.Item;
	var variables = this.variables;
	this.varnames = variables.slice();
	this.freeters = {};
	this.persons = {};
	this.institutions = {};
	for (i = 0, ilen = variables.length; i < ilen; i += 1) {
		var v = variables[i];
		this.variable_offset[v] = this.nameset_offset;
		var values = this._normalizeVariableValue(Item, v);
		if (this.name.strings["suppress-min"] && values.length >= this.name.strings["suppress-min"]) {
			values = [];
		}
		this._getFreeters(v, values);
		this._getPersonsAndInstitutions(v, values);
	}
};

CSL.NameOutput.prototype._normalizeVariableValue = function (Item, variable) {
	var names, name, i, ilen;
	if ("string" === typeof Item[variable]) {
		names = [{literal: Item[variable]}];
	} else if (!Item[variable]) {
		names = [];
	} else {
		names = Item[variable].slice();
	}
	// Transliteration happens here, if at all.
	// (not terribly efficient; the refactoring of object
	// content should take place after constraints are
	// imposed)
	for (i = 0, ilen = names.length; i < ilen; i += 1) {
		names[i] = this.state.transform.name(this.state, names[i], this.state.opt["locale-pri"]);
		names[i] = this._normalizeNameInput(names[i]);
	}
	return names;
};

CSL.NameOutput.prototype._getFreeters = function (v, values) {
	this.freeters[v] = [];
	for (var i = values.length - 1; i > -1; i += -1) {
		if (this.isPerson(values[i])) {
			this.freeters[v].push(values.pop());
		} else {
			break;
		}
	}
	this.freeters[v].reverse();
	if (this.freeters[v].length) {
		this.nameset_offset += 1;
	}
};

CSL.NameOutput.prototype._getPersonsAndInstitutions = function (v, values) {
	this.persons[v] = [];
	this.institutions[v] = [];
	var persons = [];
	var has_affiliates = false;
	var first = true;
	for (var i = values.length - 1; i > -1; i += -1) {
		if (this.isPerson(values[i])) {
			persons.push(values[i]);
		} else {
			has_affiliates = true;
			this.institutions[v].push(values[i]);
			if (!first) {
				persons.reverse();
				this.persons[v].push(persons);
				persons = [];
			}
			first = false;
		}
	}
	if (has_affiliates) {
		persons.reverse();
		this.persons[v].push(persons);
		this.persons[v].reverse();
		this.institutions[v].reverse();
	}
};

CSL.NameOutput.prototype._clearValues = function (values) {
	for (var i = values.length - 1; i > -1; i += -1) {
		values.pop();
	}
};

CSL.NameOutput.prototype._splitInstitution = function (value, v, i) {
	var ret = {};
	if (value.literal.slice(0,1) === '"' && value.literal.slice(-1) === '"') {
		ret["long"] = [value.literal.slice(1,-1)];
	} else {
		ret["long"] = this._trimInstitution(value.literal.split(/\s*,\s*/), v, i);
	}
	var str = this.state.transform.institution[value.literal];
	if (str) {
		if (str.slice(0,1) === '"' && str.slice(-1) === '"') {
			ret["short"] = [str.slice(1,-1)];
		} else {
			ret["short"] = this._trimInstitution(str.split(/\s*,\s*/), v, i);
		}
	} else {
		ret["short"] = false;
	}
	return ret;
};

CSL.NameOutput.prototype._trimInstitution = function (subunits, v, i) {
	var s;
	var use_first = this.institution.strings["use-first"];
	if (!use_first) {
		if (this.persons[v][i].length === 0) {
			use_first = this.institution.strings["substitute-use-first"];
		}
	}
	if (!use_first) {
		use_first = 0;
	}
	var append_last = this.institution.strings["use-last"];
	if (!append_last) {
		append_last = 0;
	}
	if (use_first || append_last) {
		s = subunits.slice();
		subunits = subunits.slice(0, use_first);
		s = s.slice(use_first);
		if (append_last) {
			if (append_last > s.length) {
				append_last = s.length;
			}
			if (append_last) {
				subunits = subunits.concat(s.slice((s.length - append_last)));
			}
		}
	}
	return subunits;
};
