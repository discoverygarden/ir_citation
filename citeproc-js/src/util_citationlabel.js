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

CSL.Engine.prototype.getCitationLabel = function (Item) {
	var label = "";
	var params = this.getTrigraphParams();
	var config = params[0];
	var myname = this.getTerm("reference", "short", 0);
	myname = myname.replace(".", "");
	myname = myname.slice(0, 1).toUpperCase() + myname.slice(1);
	for (var i = 0, ilen = CSL.CREATORS.length; i < ilen; i += 1) {
		var n = CSL.CREATORS[i];
		if (Item[n]) {
			var names = Item[n];
			if (names.length > params.length) {
				config = params[params.length - 1];
			} else {
				config = params[names.length - 1];
			}
			for (var j = 0, jlen = names.length; j < jlen; j += 1) {
				if (j === config.authors.length) {
					break;
				}
				var name = this.transform.name(this, names[j], this.opt["locale-pri"]);
				if (name && name.family) {
					myname = name.family;
					myname = myname.replace(/^([ \'\u2019a-z]+\s+)/, "");

				} else if (name && name.literal) {
					myname = name.literal;
				}
				var m = myname.toLowerCase().match(/^(a\s+|the\s+|an\s+)/);
				if (m) {
					myname = myname.slice(m[1].length);
				}
				myname = myname.replace(CSL.ROMANESQUE_NOT_REGEXP, "", "g");
				if (!myname) {
					break;
				}
				myname = myname.slice(0, config.authors[j]);
				if (myname.length > 1) {
					myname = myname.slice(0, 1).toUpperCase() + myname.slice(1).toLowerCase();
				} else if (myname.length === 1) {
					myname = myname.toUpperCase();
				}
				label += myname;
			}
			break;
		}
	}
	var year = "0000";
	if (Item.issued) {
		var dp = Item.issued["date-parts"];
		if (dp && dp[0] && dp[0][0]) {
			year = "" + dp[0][0];
		}
	}
	year = year.slice((config.year * -1));
	label = label + year;
	return label;
};

CSL.Engine.prototype.getTrigraphParams = function () {
	var params = [];
	var ilst = this.opt.trigraph.split(":");
	if (!this.opt.trigraph || this.opt.trigraph[0] !== "A") {
		throw "Bad trigraph definition: "+this.opt.trigraph;
	}
	for (var i = 0, ilen = ilst.length; i < ilen; i += 1) {
		var str = ilst[i];
		var config = {authors:[], year:0};
		for (var j = 0, jlen = str.length; j < jlen; j += 1) {
			switch (str[j]) {
			case "A":
				config.authors.push(1);
				break;
			case "a":
				config.authors[config.authors.length - 1] += 1;
				break;
			case "0":
				config.year += 1;
				break;
			default:
				throw "Invalid character in trigraph definition: "+this.opt.trigraph;
			}
		}
		params.push(config);
	}
	return params;
};
