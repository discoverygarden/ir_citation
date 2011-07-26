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

CSL.Util.Names = {};

CSL.Util.Names.compareNamesets = CSL.NameOutput.prototype._compareNamesets;

/**
 * Un-initialize a name (quash caps after first character)
 */
CSL.Util.Names.unInitialize = function (state, name) {
	var i, ilen, namelist, punctlist, ret;
	if (!name) {
		return "";
	}
	namelist = name.split(/(?:\-|\s+)/);
	punctlist = name.match(/(\-|\s+)/g);
	ret = "";
	for (i = 0, ilen = namelist.length; i < ilen; i += 1) {
		if (CSL.ALL_ROMANESQUE_REGEXP.exec(namelist[i].slice(0,-1)) 
			&& namelist[i] 
			&& namelist[i] !== namelist[i].toUpperCase()) {

			// More or less like this, to address the following fault report:
			// http://forums.zotero.org/discussion/17610/apsa-problems-with-capitalization-of-mc-mac-etc/
			namelist[i] = namelist[i].slice(0, 1) + namelist[i].slice(1, 2).toLowerCase() + namelist[i].slice(2);
		}
		ret += namelist[i];
		if (i < ilen - 1) {
			ret += punctlist[i];
		}
	}
	return ret;
};

/**
 * Initialize a name.
 */
CSL.Util.Names.initializeWith = function (state, name, terminator) {
	var i, ilen, j, jlen, n, m;
	if (!name) {
		return "";
	}
	if (!terminator) {
		terminator = "";
	}
	var namelist = name;
	if (state.opt["initialize-with-hyphen"] === false) {
		namelist = namelist.replace(/\-/g, " ");
	}
	namelist = namelist.replace(/\./g, " ").replace(/\s*\-\s*/g, "-").replace(/\s+/g, " ");
	// Workaround for Internet Explorer
	namelist = namelist.split(/(\-|\s+)/);
	for (i = 0, ilen = namelist.length; i < ilen; i += 2) {
		n = namelist[i];
		if (!n) {
			continue;
		}
		m = n.match(CSL.NAME_INITIAL_REGEXP);
		if (!m && (!n.match(CSL.STARTSWITH_ROMANESQUE_REGEXP) && n.length > 1 && terminator.match("%s"))) {
			m = n.match(/(.)(.*)/);
		}
		if (m && m[1] === m[1].toUpperCase()) {
			var extra = "";
			if (m[2]) {
				var s = "";
				var lst = m[2].split("");
				for (j = 0, jlen = lst.length; j < jlen; j += 1) {
					var c = lst[j];
					if (c === c.toUpperCase()) {
						s += c;
					} else {
						break;
					}
				}
				if (s.length < m[2].length) {
					extra = s.toLocaleLowerCase();
				}
			}
			namelist[i] = m[1].toLocaleUpperCase() + extra;
			if (i < (ilen - 1)) {
				if (terminator.match("%s")) {
					namelist[i] = terminator.replace("%s", namelist[i]);
				} else {
					if (namelist[i + 1].indexOf("-") > -1) {
						namelist[i + 1] = terminator + namelist[i + 1];
					} else {
						namelist[i + 1] = terminator;
					}
				}
			} else {
				if (terminator.match("%s")) {
					namelist[i] = terminator.replace("%s", namelist[i]);
				} else {
					namelist.push(terminator);
				}
			}
		} else if (n.match(CSL.ROMANESQUE_REGEXP)) {
			namelist[i] = " " + n;
		}
	}
	var ret = CSL.Util.Names.stripRight(namelist.join(""));
	ret = ret.replace(/\s*\-\s*/g, "-").replace(/\s+/g, " ");
	return ret;
};


CSL.Util.Names.stripRight = function (str) {
	var end, pos, len;
	end = 0;
	len = str.length - 1;
	for (pos = len; pos > -1; pos += -1) {
		if (str[pos] !== " ") {
			end = pos + 1;
			break;
		}
	}
	return str.slice(0, end);
};

// deleted CSL.Util.Names.initNameSlices()
// no longer used.

// deleted CSL.Util.Names,rescueNameElements()
// apparently not used.


