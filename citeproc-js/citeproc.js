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
if (!Array.indexOf) {
	Array.prototype.indexOf = function (obj) {
		var i, len;
		for (i = 0, len = this.length; i < len; i += 1) {
			if (this[i] === obj) {
				return i;
			}
		}
		return -1;
	};
}
var CSL = {
	GENDERS: ["masculine", "feminine"],
	ERROR_NO_RENDERED_FORM: 1,
	PREVIEW: "Just for laughs.",
	ASSUME_ALL_ITEMS_REGISTERED: 2,
	START: 0,
	END: 1,
	SINGLETON: 2,
	SEEN: 6,
	SUCCESSOR: 3,
	SUCCESSOR_OF_SUCCESSOR: 4,
	SUPPRESS: 5,
	SINGULAR: 0,
	PLURAL: 1,
	LITERAL: true,
	BEFORE: 1,
	AFTER: 2,
	DESCENDING: 1,
	ASCENDING: 2,
	ONLY_FIRST: 1,
	ALWAYS: 2,
	ONLY_LAST: 3,
	FINISH: 1,
	POSITION_FIRST: 0,
	POSITION_SUBSEQUENT: 1,
	POSITION_IBID: 2,
	POSITION_IBID_WITH_LOCATOR: 3,
	MARK_TRAILING_NAMES: true,
	POSITION_TEST_VARS: ["position", "first-reference-note-number", "near-note"],
	AREAS: ["citation", "citation_sort", "bibliography", "bibliography_sort"],
	MULTI_FIELDS: ["publisher", "publisher-place", "title","container-title", "collection-title", "institution", "authority","edition"],
	CITE_FIELDS: ["first-reference-note-number", "locator"],
	MINIMAL_NAME_FIELDS: ["literal", "family"],
	SWAPPING_PUNCTUATION: [".", "!", "?", ":",","],
	TERMINAL_PUNCTUATION: [":", ".", ";", "!", "?", " "],
	SPLICE_PUNCTUATION: [".", "!", "?", ":", ";", ","],
	NONE: 0,
	NUMERIC: 1,
	POSITION: 2,
	COLLAPSE_VALUES: ["citation-number", "year", "year-suffix"],
	DATE_PARTS: ["year", "month", "day"],
	DATE_PARTS_ALL: ["year", "month", "day", "season"],
	DATE_PARTS_INTERNAL: ["year", "month", "day", "year_end", "month_end", "day_end"],
	NAME_PARTS: ["family", "given", "dropping-particle", "non-dropping-particle", "suffix", "literal"],
	DECORABLE_NAME_PARTS: ["given", "family", "suffix"],
	DISAMBIGUATE_OPTIONS: [
		"disambiguate-add-names",
		"disambiguate-add-givenname",
		"disambiguate-add-year-suffix"
	],
	GIVENNAME_DISAMBIGUATION_RULES: [
		"all-names",
		"all-names-with-initials",
		"primary-name",
		"primary-name-with-initials",
		"by-cite"
	],
	NAME_ATTRIBUTES: [
		"and",
		"delimiter-precedes-last",
		"delimiter-precedes-et-al",
		"initialize-with",
		"name-as-sort-order",
		"sort-separator",
		"et-al-min",
		"et-al-use-first",
		"et-al-subsequent-min",
		"et-al-subsequent-use-first",
		"form",
		"prefix",
		"suffix",
		"delimiter"
	],
	PARALLEL_MATCH_VARS: ["container-title"],
	PARALLEL_TYPES: ["legal_case",  "legislation", "bill"],
	PARALLEL_COLLAPSING_MID_VARSET: ["volume", "container-title", "section"],
	LOOSE: 0,
	STRICT: 1,
	TOLERANT: 2,
	PREFIX_PUNCTUATION: /[.;:]\s*$/,
	SUFFIX_PUNCTUATION: /^\s*[.;:,\(\)]/,
	NUMBER_REGEXP: /(?:^\d+|\d+$)/,
	NAME_INITIAL_REGEXP: /^([A-Z\u0080-\u017f\u0400-\u042f])([a-zA-Z\u0080-\u017f\u0400-\u052f]*|)/,
	ROMANESQUE_REGEXP: /[a-zA-Z\u0080-\u017f\u0400-\u052f\u0386-\u03fb\u1f00-\u1ffe]/,
	ROMANESQUE_NOT_REGEXP: /[^a-zA-Z\u0080-\u017f\u0400-\u052f\u0386-\u03fb\u1f00-\u1ffe]/g,
	STARTSWITH_ROMANESQUE_REGEXP: /^[&a-zA-Z\u0080-\u017f\u0400-\u052f\u0386-\u03fb\u1f00-\u1ffe]/,
	ENDSWITH_ROMANESQUE_REGEXP: /[.;:&a-zA-Z\u0080-\u017f\u0400-\u052f\u0386-\u03fb\u1f00-\u1ffe]$/,
	ALL_ROMANESQUE_REGEXP: /^[a-zA-Z\u0080-\u017f\u0400-\u052f\u0386-\u03fb\u1f00-\u1ffe]+$/,
	VIETNAMESE_SPECIALS: /[\u00c0-\u00c3\u00c8-\u00ca\u00cc\u00cd\u00d2-\u00d5\u00d9\u00da\u00dd\u00e0-\u00e3\u00e8-\u00ea\u00ec\u00ed\u00f2-\u00f5\u00f9\u00fa\u00fd\u0101\u0103\u0110\u0111\u0128\u0129\u0168\u0169\u01a0\u01a1\u01af\u01b0\u1ea0-\u1ef9]/,
	VIETNAMESE_NAMES: /^(?:(?:[.AaBbCcDdEeGgHhIiKkLlMmNnOoPpQqRrSsTtUuVvXxYy \u00c0-\u00c3\u00c8-\u00ca\u00cc\u00cd\u00d2-\u00d5\u00d9\u00da\u00dd\u00e0-\u00e3\u00e8-\u00ea\u00ec\u00ed\u00f2-\u00f5\u00f9\u00fa\u00fd\u0101\u0103\u0110\u0111\u0128\u0129\u0168\u0169\u01a0\u01a1\u01af\u01b0\u1ea0-\u1ef9]{2,6})(\s+|$))+$/,
	NOTE_FIELDS_REGEXP: /\{:[\-a-z]+:[^\}]+\}/g,
	NOTE_FIELD_REGEXP: /\{:([\-a-z]+):\s*([^\}]+)\}/,
	DISPLAY_CLASSES: ["block", "left-margin", "right-inline", "indent"],
	NAME_VARIABLES: [
		"author",
		"editor",
		"translator",
		"contributor",
		"collection-editor",
		"composer",
		"container-author",
		"editorial-director",
		"interviewer",
		"original-author",
		"recipient"
	],
	NUMERIC_VARIABLES: ["edition", "volume", "number-of-volumes", "number", "issue", "citation-number"],
	DATE_VARIABLES: ["issued", "event-date", "accessed", "container", "original-date"],
	TAG_ESCAPE: function (str) {
		var mx, lst, len, pos, m, buf1, buf2, idx, ret, myret;
		mx = str.match(/(<span\s+class=\"no(?:case|decor)\">)/g);
		lst = str.split(/<span\s+class=\"no(?:case|decor)\">/g);
		myret = [lst[0]];
		for (pos = 1, len = lst.length; pos < len; pos += 1) {
			myret.push(mx[pos - 1]);
			myret.push(lst[pos]);
		}
		lst = myret.slice();
		len = lst.length - 1;
		for (pos = len; pos > 1; pos += -2) {
			m = lst[pos].match(/<\/span>/);
			if (m) {
				idx = lst[pos].indexOf("</span>");
				buf1 = lst[pos].slice(0, idx);
				buf2 = lst[pos].slice(idx + 7);
				lst[pos - 1] += buf1 + "</span>";
				lst[pos] = buf2;
			} else {
				buf1 = lst.slice(0, pos - 1);
				if (pos < (lst.length - 1)) {
					buf2 = lst[pos - 1] + lst[pos];
				} else {
					buf2 = lst[pos - 1] + lst[pos] + lst[pos + 1];
				}
				lst = buf1.push(buf2).concat(lst.slice(pos + 2));
			}
		}
		return lst;
	},
	TAG_USEALL: function (str) {
		var ret, open, close, end;
		ret = [""];
		open = str.indexOf("<");
		close = str.indexOf(">");
		while (open > -1 && close > -1) {
			if (open > close) {
				end = open + 1;
			} else {
				end = close + 1;
			}
			if (open < close && str.slice(open + 1, close).indexOf("<") === -1) {
				ret[ret.length - 1] += str.slice(0, open);
				ret.push(str.slice(open, close + 1));
				ret.push("");
				str = str.slice(end);
			} else {
				ret[ret.length - 1] += str.slice(0, close + 1);
				str = str.slice(end);
			}
			open = str.indexOf("<");
			close = str.indexOf(">");
		}
		ret[ret.length - 1] += str;
		return ret;
	},
	SKIP_WORDS: ["but", "or", "yet", "so", "for", "and", "nor", "a", "an", "the", "at", "by", "from", "in", "into", "of", "on", "to", "with", "up", "down", "as", "via", "onto", "over", "till"],
	FORMAT_KEY_SEQUENCE: [
		"@strip-periods",
		"@font-style",
		"@font-variant",
		"@font-weight",
		"@text-decoration",
		"@vertical-align",
		"@quotes"
	],
	INSTITUTION_KEYS: [
		"font-style",
		"font-variant",
		"font-weight",
		"text-decoration",
		"text-case"
	],
	SUFFIX_CHARS: "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z",
	ROMAN_NUMERALS: [
		[ "", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix" ],
		[ "", "x", "xx", "xxx", "xl", "l", "lx", "lxx", "lxxx", "xc" ],
		[ "", "c", "cc", "ccc", "cd", "d", "dc", "dcc", "dccc", "cm" ],
		[ "", "m", "mm", "mmm", "mmmm", "mmmmm"]
	],
	CREATORS: [
		"author",
		"editor",
		"contributor",
		"translator",
		"recipient",
		"interviewer",
		"composer",
		"original-author",
		"container-author",
		"collection-editor"
	],
	LANG_BASES: {
		af: "af_ZA",
		ar: "ar_AR",
		bg: "bg_BG",
		ca: "ca_AD",
		cs: "cs_CZ",
		da: "da_DK",
		de: "de_DE",
		el: "el_GR",
		en: "en_US",
		es: "es_ES",
		et: "et_EE",
		fr: "fr_FR",
		he: "he_IL",
		hu: "hu_HU",
		is: "is_IS",
		it: "it_IT",
		ja: "ja_JP",
		km: "km_KH",
		ko: "ko_KR",
		mn: "mn_MN",
		nb: "nb_NO",
		nl: "nl_NL",
		pl: "pl_PL",
		pt: "pt_PT",
		ro: "ro_RO",
		ru: "ru_RU",
		sk: "sk_SK",
		sl: "sl_SI",
		sr: "sr_RS",
		sv: "sv_SE",
		th: "th_TH",
		tr: "tr_TR",
		uk: "uk_UA",
		vi: "vi_VN",
		zh: "zh_CN"
	},
	SUPERSCRIPTS: {
		"\u00AA": "\u0061",
		"\u00B2": "\u0032",
		"\u00B3": "\u0033",
		"\u00B9": "\u0031",
		"\u00BA": "\u006F",
		"\u02B0": "\u0068",
		"\u02B1": "\u0266",
		"\u02B2": "\u006A",
		"\u02B3": "\u0072",
		"\u02B4": "\u0279",
		"\u02B5": "\u027B",
		"\u02B6": "\u0281",
		"\u02B7": "\u0077",
		"\u02B8": "\u0079",
		"\u02E0": "\u0263",
		"\u02E1": "\u006C",
		"\u02E2": "\u0073",
		"\u02E3": "\u0078",
		"\u02E4": "\u0295",
		"\u1D2C": "\u0041",
		"\u1D2D": "\u00C6",
		"\u1D2E": "\u0042",
		"\u1D30": "\u0044",
		"\u1D31": "\u0045",
		"\u1D32": "\u018E",
		"\u1D33": "\u0047",
		"\u1D34": "\u0048",
		"\u1D35": "\u0049",
		"\u1D36": "\u004A",
		"\u1D37": "\u004B",
		"\u1D38": "\u004C",
		"\u1D39": "\u004D",
		"\u1D3A": "\u004E",
		"\u1D3C": "\u004F",
		"\u1D3D": "\u0222",
		"\u1D3E": "\u0050",
		"\u1D3F": "\u0052",
		"\u1D40": "\u0054",
		"\u1D41": "\u0055",
		"\u1D42": "\u0057",
		"\u1D43": "\u0061",
		"\u1D44": "\u0250",
		"\u1D45": "\u0251",
		"\u1D46": "\u1D02",
		"\u1D47": "\u0062",
		"\u1D48": "\u0064",
		"\u1D49": "\u0065",
		"\u1D4A": "\u0259",
		"\u1D4B": "\u025B",
		"\u1D4C": "\u025C",
		"\u1D4D": "\u0067",
		"\u1D4F": "\u006B",
		"\u1D50": "\u006D",
		"\u1D51": "\u014B",
		"\u1D52": "\u006F",
		"\u1D53": "\u0254",
		"\u1D54": "\u1D16",
		"\u1D55": "\u1D17",
		"\u1D56": "\u0070",
		"\u1D57": "\u0074",
		"\u1D58": "\u0075",
		"\u1D59": "\u1D1D",
		"\u1D5A": "\u026F",
		"\u1D5B": "\u0076",
		"\u1D5C": "\u1D25",
		"\u1D5D": "\u03B2",
		"\u1D5E": "\u03B3",
		"\u1D5F": "\u03B4",
		"\u1D60": "\u03C6",
		"\u1D61": "\u03C7",
		"\u2070": "\u0030",
		"\u2071": "\u0069",
		"\u2074": "\u0034",
		"\u2075": "\u0035",
		"\u2076": "\u0036",
		"\u2077": "\u0037",
		"\u2078": "\u0038",
		"\u2079": "\u0039",
		"\u207A": "\u002B",
		"\u207B": "\u2212",
		"\u207C": "\u003D",
		"\u207D": "\u0028",
		"\u207E": "\u0029",
		"\u207F": "\u006E",
		"\u2120": "\u0053\u004D",
		"\u2122": "\u0054\u004D",
		"\u3192": "\u4E00",
		"\u3193": "\u4E8C",
		"\u3194": "\u4E09",
		"\u3195": "\u56DB",
		"\u3196": "\u4E0A",
		"\u3197": "\u4E2D",
		"\u3198": "\u4E0B",
		"\u3199": "\u7532",
		"\u319A": "\u4E59",
		"\u319B": "\u4E19",
		"\u319C": "\u4E01",
		"\u319D": "\u5929",
		"\u319E": "\u5730",
		"\u319F": "\u4EBA",
		"\u02C0": "\u0294",
		"\u02C1": "\u0295",
		"\u06E5": "\u0648",
		"\u06E6": "\u064A"
	},
	SUPERSCRIPTS_REGEXP: new RegExp("[\u00AA\u00B2\u00B3\u00B9\u00BA\u02B0\u02B1\u02B2\u02B3\u02B4\u02B5\u02B6\u02B7\u02B8\u02E0\u02E1\u02E2\u02E3\u02E4\u1D2C\u1D2D\u1D2E\u1D30\u1D31\u1D32\u1D33\u1D34\u1D35\u1D36\u1D37\u1D38\u1D39\u1D3A\u1D3C\u1D3D\u1D3E\u1D3F\u1D40\u1D41\u1D42\u1D43\u1D44\u1D45\u1D46\u1D47\u1D48\u1D49\u1D4A\u1D4B\u1D4C\u1D4D\u1D4F\u1D50\u1D51\u1D52\u1D53\u1D54\u1D55\u1D56\u1D57\u1D58\u1D59\u1D5A\u1D5B\u1D5C\u1D5D\u1D5E\u1D5F\u1D60\u1D61\u2070\u2071\u2074\u2075\u2076\u2077\u2078\u2079\u207A\u207B\u207C\u207D\u207E\u207F\u2120\u2122\u3192\u3193\u3194\u3195\u3196\u3197\u3198\u3199\u319A\u319B\u319C\u319D\u319E\u319F\u02C0\u02C1\u06E5\u06E6]", "g"),
	locale: {},
	locale_opts: {},
	locale_dates: {}
};
CSL.TERMINAL_PUNCTUATION_REGEXP = new RegExp("^([" + CSL.TERMINAL_PUNCTUATION.slice(0, -1).join("") + "])(.*)");
CSL.CLOSURES = new RegExp(".*[\\]\\)]");
var console;
if ("object" === typeof console && "function" === typeof console.log) {
	CSL.debug = function (str) {
        console.log("CSL: " + str);
	};
	CSL.error = function (str) {
        console.log("CSL error: " + str);
	};
} else {
	CSL.debug = function () {};
	CSL.error = function (str) {
		throw "CSL error: " + str;
	};
}
CSL.getSortCompare = function () {
	var strcmp;
	try {
		var Components;
		var localeService = Components.classes["@mozilla.org/intl/nslocaleservice;1"]
			.getService(Components.interfaces.nsILocaleService);
		var collationFactory = Components.classes["@mozilla.org/intl/collation-factory;1"]
			.getService(Components.interfaces.nsICollationFactory);
		var collation = collationFactory.CreateCollation(localeService.getApplicationLocale());
		strcmp = function(a, b) {
			return collation.compareString(1, a, b);
		};
		CSL.debug("Using collation sort");
	} catch (e) {
		strcmp = function (a, b) {
			return a.localeCompare(b);
		};
	}
	var isKana = /^[\u3040-\u309f\u30a0-\u30ff]/;
	var sortCompare = function (a, b) {
		var ak = isKana.exec(a);
		var bk = isKana.exec(b);
		if (ak || bk) {
			if (!ak) {
				return -1;
			} else if (!bk) {
				return 1;
			} else if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			} else {
				return 0;
			}
		} else {
			return strcmp(a, b);
		}
	};
	return sortCompare;
};
CSL.Output = {};
CSL.Output.Queue = function (state) {
	this.levelname = ["top"];
	this.state = state;
	this.queue = [];
	this.empty = new CSL.Token("empty");
	var tokenstore = {};
	tokenstore.empty = this.empty;
	this.formats = new CSL.Stack(tokenstore);
	this.current = new CSL.Stack(this.queue);
};
CSL.Output.Queue.prototype.pop = function () {
	var drip = this.current.value();
	if (drip.length) {
		return drip.pop();
	} else {
		return drip.blobs.pop();
	}
};
CSL.Output.Queue.prototype.getToken = function (name) {
	var ret = this.formats.value()[name];
	return ret;
};
CSL.Output.Queue.prototype.mergeTokenStrings = function (base, modifier) {
	var base_token, modifier_token, ret, key;
	base_token = this.formats.value()[base];
	modifier_token = this.formats.value()[modifier];
	ret = base_token;
	if (modifier_token) {
		if (!base_token) {
			base_token = new CSL.Token(base, CSL.SINGLETON);
			base_token.decorations = [];
		}
		ret = new CSL.Token(base, CSL.SINGLETON);
		key = "";
		for (key in base_token.strings) {
			if (base_token.strings.hasOwnProperty(key)) {
				ret.strings[key] = base_token.strings[key];
			}
		}
		for (key in modifier_token.strings) {
			if (modifier_token.strings.hasOwnProperty(key)) {
				ret.strings[key] = modifier_token.strings[key];
			}
		}
		ret.decorations = base_token.decorations.concat(modifier_token.decorations);
	}
	return ret;
};
CSL.Output.Queue.prototype.addToken = function (name, modifier, token) {
	var newtok, attr;
	newtok = new CSL.Token("output");
	if ("string" === typeof token) {
		token = this.formats.value()[token];
	}
	if (token && token.strings) {
		for (attr in token.strings) {
			if (token.strings.hasOwnProperty(attr)) {
				newtok.strings[attr] = token.strings[attr];
			}
		}
		newtok.decorations = token.decorations;
	}
	if ("string" === typeof modifier) {
		newtok.strings.delimiter = modifier;
	}
	this.formats.value()[name] = newtok;
};
CSL.Output.Queue.prototype.pushFormats = function (tokenstore) {
	if (!tokenstore) {
		tokenstore = {};
	}
	tokenstore.empty = this.empty;
	this.formats.push(tokenstore);
};
CSL.Output.Queue.prototype.popFormats = function (tokenstore) {
	this.formats.pop();
};
CSL.Output.Queue.prototype.startTag = function (name, token) {
	var tokenstore = {};
	tokenstore[name] = token;
	this.pushFormats(tokenstore);
	this.openLevel(name);
};
CSL.Output.Queue.prototype.endTag = function () {
	this.closeLevel();
	this.popFormats();
};
CSL.Output.Queue.prototype.openLevel = function (token, ephemeral) {
	var blob, curr, x, has_ephemeral;
	if ("object" === typeof token) {
		blob = new CSL.Blob(token);
	} else if ("undefined" === typeof token) {
		blob = new CSL.Blob(this.formats.value().empty, false, "empty");
	} else {
		if (!this.formats.value() || !this.formats.value()[token]) {
			throw "CSL processor error: call to nonexistent format token \"" + token + "\"";
		}
		blob = new CSL.Blob(this.formats.value()[token], false, token);
	}
	curr = this.current.value();
	curr.push(blob);
	this.current.push(blob);
};
CSL.Output.Queue.prototype.closeLevel = function (name) {
	if (name && name !== this.current.value().levelname) {
		CSL.error("Level mismatch error:  wanted " + name + " but found " + this.current.value().levelname);
	}
	this.current.pop();
};
CSL.Output.Queue.prototype.append = function (str, tokname, notSerious) {
	var token, blob, curr;
	var useblob = true;
	if ("undefined" === typeof str) {
		return false;
	}
	if ("number" === typeof str) {
		str = "" + str;
	}
	if (!notSerious 
		&& this.state.tmp.element_trace 
		&& this.state.tmp.element_trace.value() === "suppress-me") {
		return false;
	}
	blob = false;
	if (!tokname) {
		token = this.formats.value().empty;
	} else if (tokname === "literal") {
		token = true;
		useblob = false;
	} else if ("string" === typeof tokname) {
		token = this.formats.value()[tokname];
	} else {
		token = tokname;
	}
	if (!token) {
		throw "CSL processor error: unknown format token name: " + tokname;
	}
	if (token.strings && "undefined" === typeof token.strings.delimiter) {
		token.strings.delimiter = "";
	}
	if ("string" === typeof str && str.length) {
		str = str.replace(/ ([:;?!\u00bb])/g, "\u202f$1").replace(/\u00ab /g, "\u00ab\u202f");
		this.last_char_rendered = str.slice(-1);
		str = str.replace(/\s+'/g, "  \'").replace(/^'/g, " \'");
		this.state.tmp.term_predecessor = true;
	}
	blob = new CSL.Blob(token, str);
	curr = this.current.value();
	if ("string" === typeof blob.blobs) {
		if (this.state.tmp.strip_periods) {
			blob.blobs = blob.blobs.replace(/\./g, "");
		}
		this.state.tmp.term_predecessor = true;
	}
	if (!notSerious) {
		this.state.parallel.AppendBlobPointer(curr);
	}
	if ("string" === typeof str) {
		curr.push(blob);
		if (blob.strings["text-case"]) {
			blob.blobs = CSL.Output.Formatters[blob.strings["text-case"]](this.state, str);
		}
		this.state.fun.flipflopper.init(str, blob);
		this.state.fun.flipflopper.processTags();
	} else if (useblob) {
		curr.push(blob);
	} else {
		curr.push(str);
	}
	return true;
};
CSL.Output.Queue.prototype.string = function (state, myblobs, blob) {
	var i, ilen, j, jlen, b;
	var txt_esc = CSL.getSafeEscape(this.state.opt.mode, this.state.tmp.area);
	var blobs = myblobs.slice();
	var ret = [];
	if (blobs.length === 0) {
		return ret;
	}
	var blob_delimiter = "";
	if (blob) {
		blob_delimiter = blob.strings.delimiter;
	} else {
		state.tmp.count_offset_characters = false;
		state.tmp.offset_characters = 0;
	}
	if (blob && blob.new_locale) {
		state.opt.lang = blob.new_locale;
	}
	var blobjr, use_suffix, use_prefix, params;
	for (i = 0, ilen = blobs.length; i < ilen; i += 1) {
		blobjr = blobs[i];
		if (blobjr.strings.first_blob) {
			state.tmp.count_offset_characters = blobjr.strings.first_blob;
		}
		if ("string" === typeof blobjr.blobs) {
			if ("number" === typeof blobjr.num) {
				ret.push(blobjr);
			} else if (blobjr.blobs) {
				b = blobjr.blobs;
				var blen = b.length;
				if (!state.tmp.suppress_decorations) {
					for (j = 0, jlen = blobjr.decorations.length; j < jlen; j += 1) {
						params = blobjr.decorations[j];
						if (state.normalDecorIsOrphan(blobjr, params)) {
							continue;
						}
						b = state.fun.decorate[params[0]][params[1]](state, b);
					}
				}
				if (b && b.length) {
					b = txt_esc(blobjr.strings.prefix) + b + txt_esc(blobjr.strings.suffix);
					ret.push(b);
					if (state.tmp.count_offset_characters) {
						state.tmp.offset_characters += (blen + blobjr.strings.suffix.length + blobjr.strings.prefix.length);
					}
				}
			}
		} else if (blobjr.blobs.length) {
			var addtoret = state.output.string(state, blobjr.blobs, blobjr);
			ret = ret.concat(addtoret);
		}
		if (blobjr.strings.first_blob) {
			state.registry.registry[state.tmp.count_offset_characters].offset = state.tmp.offset_characters;
			state.tmp.count_offset_characters = false;
		}
	}
	var span_split = 0;
	for (i = 0, ilen = ret.length; i < ilen; i += 1) {
		if ("string" === typeof ret[i]) {
			span_split = (parseInt(i, 10) + 1);
		}
	}
	if (blob && (blob.decorations.length || blob.strings.suffix || blob.strings.prefix)) {
		span_split = ret.length;
	}
	var mytype = "string";
	for (var q = 0, qlen = ret.length; q < qlen; q += 1) {
		if (typeof ret[q] !== "string") {
			mytype = typeof ret[q];
			break;
		}
	}
	var blobs_start = state.output.renderBlobs(ret.slice(0, span_split), blob_delimiter);
	if (blobs_start && blob && (blob.decorations.length || blob.strings.suffix || blob.strings.prefix)) {
		if (!state.tmp.suppress_decorations) {
			for (i = 0, ilen = blob.decorations.length; i < ilen; i += 1) {
				params = blob.decorations[i];
				if (["@bibliography", "@display"].indexOf(params[0]) > -1) {
					continue;
				}
				if (state.normalDecorIsOrphan(blobjr, params)) {
					continue;
				}
				blobs_start = state.fun.decorate[params[0]][params[1]](state, blobs_start);
			}
		}
		b = blobs_start;
		use_suffix = blob.strings.suffix;
		if (b && b.length) {
			use_prefix = blob.strings.prefix;
			b = txt_esc(use_prefix) + b + txt_esc(use_suffix);
			if (state.tmp.count_offset_characters) {
				state.tmp.offset_characters += (use_prefix.length + use_suffix.length);
			}
		}
		blobs_start = b;
		if (!state.tmp.suppress_decorations) {
			for (i = 0, ilen = blob.decorations.length; i < ilen; i += 1) {
				params = blob.decorations[i];
				if (["@bibliography", "@display"].indexOf(params[0]) === -1) {
					continue;
				}
				blobs_start = state.fun.decorate[params[0]][params[1]].call(blob, state, blobs_start);
			}
		}
	}
	var blobs_end = ret.slice(span_split, ret.length);
	if (!blobs_end.length && blobs_start) {
		ret = [blobs_start];
	} else if (blobs_end.length && !blobs_start) {
		ret = blobs_end;
	} else if (blobs_start && blobs_end.length) {
		ret = [blobs_start].concat(blobs_end);
	}
	if ("undefined" === typeof blob) {
		this.queue = [];
		this.current.mystack = [];
		this.current.mystack.push(this.queue);
		if (state.tmp.suppress_decorations) {
			ret = state.output.renderBlobs(ret);
		}
	} else if ("boolean" === typeof blob) {
		ret = state.output.renderBlobs(ret);
	}
	if (blob && blob.new_locale) {
		state.opt.lang = blob.old_locale;
	}
	if (blob) {
		return ret;
	} else {
		return ret;
	}
};
CSL.Output.Queue.prototype.clearlevel = function () {
	var blob, pos, len;
	blob = this.current.value();
	len = blob.blobs.length;
	for (pos = 0; pos < len; pos += 1) {
		blob.blobs.pop();
	}
};
CSL.Output.Queue.prototype.renderBlobs = function (blobs, delim) {
	var state, ret, ret_last_char, use_delim, i, blob, pos, len, ppos, llen, pppos, lllen, res, str, params, txt_esc;
	txt_esc = CSL.getSafeEscape(this.state.opt.mode, this.state.tmp.area);
	if (!delim) {
		delim = "";
	}
	state = this.state;
	ret = "";
	ret_last_char = [];
	use_delim = "";
	len = blobs.length;
	for (pos = 0; pos < len; pos += 1) {
		if (blobs[pos].checkNext) {
			blobs[pos].checkNext(blobs[(pos + 1)]);
		}
	}
	var doit = true;
	for (pos = blobs.length - 1; pos > 0; pos += -1) {
	    if (blobs[pos].checkLast) {
		if (doit && blobs[pos].checkLast(blobs[pos - 1])) {
		    doit = false;
		}
	    } else {
		doit = true;
	    }
	}
	len = blobs.length;
	for (pos = 0; pos < len; pos += 1) {
		blob = blobs[pos];
		if (ret) {
			use_delim = delim;
		}
		if (blob && "string" === typeof blob) {
			ret += txt_esc(use_delim);
			ret += blob;
			if (state.tmp.count_offset_characters) {
				state.tmp.offset_characters += (use_delim.length);
			}
		} else if (blob.status !== CSL.SUPPRESS) {
			str = blob.formatter.format(blob.num, blob.gender);
			var strlen = str.replace(/<[^>]*>/g, "").length;
			this.append(str, "empty", true);
			var str_blob = this.pop();
			var count_offset_characters = state.tmp.count_offset_characters;
			var str = this.string(state, [str_blob], false);
			state.tmp.count_offset_characters = count_offset_characters;
			if (blob.strings["text-case"]) {
				str = CSL.Output.Formatters[blob.strings["text-case"]](this.state, str);
			}
			if (!state.tmp.suppress_decorations) {
				llen = blob.decorations.length;
				for (ppos = 0; ppos < llen; ppos += 1) {
					params = blob.decorations[ppos];
					if (state.normalDecorIsOrphan(blob, params)) {
						continue;
					}
					str = state.fun.decorate[params[0]][params[1]](state, str);
				}
			}
			str = blob.strings.prefix + str + blob.strings.suffix;
			var addme = "";
			if (blob.status === CSL.END) {
				addme = blob.range_prefix;
			} else if (blob.status === CSL.SUCCESSOR) {
				addme = blob.successor_prefix;
			} else if (blob.status === CSL.START) {
				addme = "";
			} else if (blob.status === CSL.SEEN) {
				addme = blob.splice_prefix;
			}
			ret += addme;
			ret += str;
			if (state.tmp.count_offset_characters) {
				state.tmp.offset_characters += (addme.length + blob.strings.prefix.length + strlen + blob.strings.suffix.length);
			}
		}
	}
	return ret;
};
CSL.Output.Queue.purgeEmptyBlobs = function (myblobs, endOnly) {
	var res, i, ilen, j, jlen, tmpblobs;
	if ("string" === typeof myblobs || !myblobs.length) {
		return;
	}
	for (i = myblobs.length - 1; i > -1; i += -1) {
		CSL.Output.Queue.purgeEmptyBlobs(myblobs[i].blobs, endOnly);
	}
	for (i = myblobs.length - 1; i > -1; i += -1) {
		if (!myblobs[i].blobs.length) {
			tmpblobs = myblobs.slice(i + 1);
			for (j = i, jlen = myblobs.length; j < jlen; j += 1) {
				myblobs.pop();
			}
			for (j = 0, jlen = tmpblobs.length; j < jlen; j += 1) {
				myblobs.push(tmpblobs[j]);
			}
		}
		if (endOnly) {
			break;
		}
	}
};
CSL.Output.Queue.purgeNearsidePrefixChars = function(myblob, chr) {
	if (!chr) {
		return;
	}
	if ("object" === typeof myblob) {
		if ((CSL.TERMINAL_PUNCTUATION.indexOf(chr) > -1 && 
			 CSL.TERMINAL_PUNCTUATION.slice(0, -1).indexOf(myblob.strings.prefix.slice(0, 1)) > -1)) {
			myblob.strings.prefix = myblob.strings.prefix.slice(1);
		} else if ("object" === typeof myblob.blobs) {
			CSL.Output.Queue.purgeNearsidePrefixChars(myblob.blobs[0], chr);
		}
	}
};
CSL.Output.Queue.purgeNearsidePrefixSpaces = function(myblob, chr) {
	if ("object" === typeof myblob) {
		if (" " === chr && " " === myblob.strings.prefix.slice(0, 1)) {
			myblob.strings.prefix = myblob.strings.prefix.slice(1);
		} else if ("object" === typeof myblob.blobs) {
			CSL.Output.Queue.purgeNearsidePrefixSpaces(myblob.blobs[0], chr);
		}
	}
};
CSL.Output.Queue.purgeNearsideSuffixSpaces = function(myblob, chr) {
	if ("object" === typeof myblob) {
		if (" " === chr && " " === myblob.strings.suffix.slice(-1)) {
			myblob.strings.suffix = myblob.strings.suffix.slice(0, -1);
		} else if ("object" === typeof myblob.blobs) {
			if (!chr) {
				chr = myblob.strings.suffix.slice(-1);
			}
			chr = CSL.Output.Queue.purgeNearsideSuffixSpaces(myblob.blobs[myblob.blobs.length - 1], chr);
		} else {
			chr = myblob.strings.suffix.slice(-1);
		}
	}
	return chr;
};
CSL.Output.Queue.adjustPunctuation = function (state, myblobs, stk, finish) {
	var chr, suffix, dpref, blob, delimiter, suffixX, dprefX, blobX, delimiterX, prefix, prefixX, dsuffX, dsuff, slast, dsufff, dsufffX, lastchr, firstchr, exposed_suffixes, exposed, j, jlen, i, ilen;
	var TERMS = CSL.TERMINAL_PUNCTUATION.slice(0, -1);
	var TERM_OR_SPACE = CSL.TERMINAL_PUNCTUATION;
	var SWAPS = CSL.SWAPPING_PUNCTUATION;
	if (!stk) {
		stk = [{suffix: "", delimiter: ""}];
	}
	slast = stk.length - 1;
	delimiter = stk[slast].delimiter;
	dpref = stk[slast].dpref;
	dsuff = stk[slast].dsuff;
	dsufff = stk[slast].dsufff;
	prefix = stk[slast].prefix;
	suffix = stk[slast].suffix;
	blob = stk[slast].blob;
	if ("string" === typeof myblobs) {
		if (suffix) {
			if (blob && 
				TERMS.indexOf(myblobs.slice(-1)) > -1 &&
				TERMS.slice(1).indexOf(suffix) > -1 &&
				blob.strings.suffix !== " ") {
					blob.strings.suffix = blob.strings.suffix.slice(1);
			}
		}
		lastchr = myblobs.slice(-1);
		firstchr = myblobs.slice(0,1);
	} else {
		if (dpref) {
			for (j = 0, jlen = myblobs.length - 1; j < jlen; j += 1) {
				var t = myblobs[j].strings.suffix.slice(-1);
				if (TERMS.indexOf(t) === -1 ||
				    TERMS.indexOf(dpref) === -1) {
					if (dpref !== " " || dpref !== myblobs[j].strings.suffix.slice(-1)) {
						myblobs[j].strings.suffix += dpref;						
					}
				}
			}
		}
		if (suffix === " ") {
			CSL.Output.Queue.purgeNearsideSuffixSpaces(myblobs[myblobs.length - 1], " ");
		}
		var lst = [];
		var doblob;
		for (i = 0, ilen = myblobs.length - 1; i < ilen; i += 1) {
			doblob = myblobs[i];
			var following_prefix = myblobs[i + 1].strings.prefix;
			chr = false;
			var ret = CSL.Output.Queue.purgeNearsideSuffixSpaces(doblob, chr);
			if (!dsuff) {
				lst.push(ret);
			} else {
				lst.push(false);
			}
		}
		chr = false;
		for (i = 1, ilen = myblobs.length; i < ilen; i += 1) {
			doblob = myblobs[i];
			chr = "";
			var preceding_suffix = myblobs[i - 1].strings.suffix;
			if (dsuff === " ") {
				chr = dsuff;
			} else if (preceding_suffix) {
				chr = preceding_suffix.slice(-1);
			} else if (lst[i - 1]) {
				chr = lst[i - 1];
			}
			CSL.Output.Queue.purgeNearsidePrefixSpaces(doblob, chr);
		}
		if (dsufff) {
			CSL.Output.Queue.purgeNearsidePrefixSpaces(myblobs[0], " ");
		} else if (prefix === " ") {
			CSL.Output.Queue.purgeNearsidePrefixSpaces(myblobs[0], " ");
		}
		for (i = 0, ilen = myblobs.length; i < ilen; i += 1) {
			doblob = myblobs[i];
			CSL.Output.Queue.purgeNearsidePrefixChars(doblob, lastchr);
			if (i === 0) {
				if (prefix) {
					if (doblob.strings.prefix.slice(0, 1) === " ") {
					}
				}
			}
			if (dsufff) {
				if (doblob.strings.prefix) {
					if (i === 0) {
						if (doblob.strings.prefix.slice(0, 1) === " ") {
						}
					}
				}
			}
			if (dsuff) {
				if (i > 0) {
					if (doblob.strings.prefix.slice(0, 1) === " ") {
					}
				}
			}
			if (i < (myblobs.length - 1)) {
				var nextprefix = myblobs[i + 1].strings.prefix;
				if (!delimiter) {
					if (nextprefix) {
						var nxtchr = nextprefix.slice(0, 1);
						if (SWAPS.indexOf(nxtchr) > -1) {
							myblobs[i + 1].strings.prefix = nextprefix.slice(1);
							if (TERMS.indexOf(nxtchr) === -1 ||
								(TERMS.indexOf(nxtchr) > -1 &&
								 TERMS.indexOf(doblob.strings.suffix.slice(-1)) === -1)) {
									 doblob.strings.suffix += nxtchr;
							}
						} else if (nxtchr === " " &&
									doblob.strings.suffix.slice(-1) === " ") {
							doblob.strings.suffix = doblob.strings.suffix.slice(0, -1);
						}
					}
				}
			}
			if (i === (myblobs.length - 1)) {
				if (suffix) {
					if (doblob.strings.suffix && 
						(TERMS.slice(1).indexOf(suffix) > -1 &&
						  TERMS.indexOf(doblob.strings.suffix.slice(-1)) > -1)) {
							blob.strings.suffix = blob.strings.suffix.slice(1);
					}
				}
			}
			if ("string" === typeof doblob.blobs && doblob.blobs) {
				for (var ppos = doblob.decorations.length - 1; ppos > -1; ppos += -1) {
					var params = doblob.decorations[ppos];
					if (params[0] === "@strip-periods" && params[1] === "true") {
						doblob.blobs = state.fun.decorate[params[0]][params[1]](state, doblob.blobs);
						doblob.decorations = doblob.decorations.slice(0, ppos).concat(doblob.decorations.slice(ppos + 1));
					}
				}
			}
			if (state.getOpt('punctuation-in-quote')) {
				var decorations = doblob.decorations;
				for (j = 0, jlen = decorations.length; j < jlen; j += 1) {
					if (decorations[j][0] === '@quotes' && decorations[j][1] === 'true') {
						var swapchar = doblob.strings.suffix.slice(0, 1);
						var swapblob = false;
						if (SWAPS.indexOf(swapchar) > -1) {
							swapblob = doblob;
						} else if (SWAPS.indexOf(suffix) > -1 && i === (myblobs.length - 1)) {
							swapchar = suffix;
							swapblob = blob;
						} else {
							swapchar = false;
						}
						if (swapchar) {
							if ("string" === typeof doblob.blobs) {
								if (SWAPS.indexOf(doblob.blobs.slice(-1)) === -1 ||
								   (TERMS.indexOf(doblob.blobs.slice(-1)) > -1 &&
									SWAPS.indexOf(swapchar) > -1 &&
									TERMS.indexOf(swapchar) === -1)) {
										doblob.blobs += swapchar;
								}
							} else {
								if (SWAPS.indexOf(doblob.blobs.slice(-1)[0].strings.suffix.slice(-1)) === -1 ||
									(TERMS.indexOf(doblob.blobs.slice(-1)[0].strings.suffix.slice(-1)) > -1 &&
									 SWAPS.indexOf(swapchar) > -1 &&
									 TERMS.indexOf(swapchar) === -1)) {
										 doblob.blobs.slice(-1)[0].strings.suffix += swapchar;
								}
							}
							swapblob.strings.suffix = swapblob.strings.suffix.slice(1);
						}
					}
				}
			}
			if (i === (myblobs.length - 1)) {
				if (doblob.strings.suffix) {
					suffixX = doblob.strings.suffix.slice(0, 1);
					blobX = doblob;
				} else {
					suffixX = stk[stk.length - 1].suffix;
					blobX = stk[stk.length - 1].blob;
				}
			} else {
				if (doblob.strings.suffix) {
					suffixX = doblob.strings.suffix.slice(0, 1);
					blobX = doblob;
				} else {
					suffixX = "";
					blobX = false;
				}
			}
			if (SWAPS.concat([" "]).indexOf(suffixX) === -1) {
				suffixX = "";
				blobX = false;
			}
			if (doblob.strings.delimiter && 
				doblob.blobs.length > 1) {
				dprefX = doblob.strings.delimiter.slice(0, 1);
				if (SWAPS.concat([" "]).indexOf(dprefX) > -1) {
					doblob.strings.delimiter = doblob.strings.delimiter.slice(1);
				} else {
					dprefX = "";
				}
			} else {
				dprefX = "";
			}
			if (doblob.strings.prefix) {
				if (doblob.strings.prefix.slice(-1) === " ") {
					prefixX = " ";
				} else {
					prefixX = "";
				}
			} else {
				if (i === 0) {
					prefixX = prefix;					
				} else {
					prefixX = "";
				}
			}
			if (dsuff) {
				dsufffX = dsuff;
			} else {
				if (i === 0) {
					dsufffX = dsufff;					
				} else {
					dsufffX = "";
				}
			}
			if (doblob.strings.delimiter) {
				if (doblob.strings.delimiter.slice(-1) === " " &&
					"object" === typeof doblob.blobs && doblob.blobs.length > 1) {
					   dsuffX = doblob.strings.delimiter.slice(-1);
				} else {
					dsuffX = "";						
				}
			} else {
				dsuffX = "";					
			}
			delimiterX = doblob.strings.delimiter;
			stk.push({suffix: suffixX, dsuff:dsuffX, blob:blobX, delimiter:delimiterX, prefix:prefixX, dpref: dprefX, dsufff: dsufffX});
			lastchr = CSL.Output.Queue.adjustPunctuation(state, doblob.blobs, stk);
		}
		if (myblobs && myblobs.length) {
			var last_suffix = myblobs[myblobs.length - 1].strings.suffix;
			if (last_suffix) {
				lastchr = last_suffix.slice(-1);
			}
		}
	}
	if (stk.length > 1) {
		stk.pop();
	}
	state.tmp.last_chr = lastchr;
	return lastchr;
};
CSL.compareAmbigConfig = function(a, b) {
	var ret, pos, len, ppos, llen;
	if (a.names.length !== b.names.length) {
		return 1;
	} else {
		for (pos = 0, len = a.names.length; pos < len; pos += 1) {
			if (a.names[pos] !== b.names[pos]) {
				return 1;
			} else {
				for (ppos = 0, llen = a.names[pos]; ppos < llen; ppos += 1) {
					if (a.givens[pos][ppos] !== b.givens[pos][ppos]) {
						return 1;
					}
				}
			}
		}
	}
	return 0;
};
CSL.cloneAmbigConfig = function (config, oldconfig, tainters) {
	var i, ilen, j, jlen, k, klen, param;
	var ret = {};
	ret.names = [];
	ret.givens = [];
	ret.year_suffix = false;
	ret.disambiguate = false;
	for (i = 0, ilen = config.names.length; i < ilen; i += 1) {
		param = config.names[i];
		if (oldconfig && (!oldconfig.names[i] || oldconfig.names[i] !== param)) {
			for (j = 0, jlen = tainters.length; j < jlen; j += 1) {
				this.tmp.taintedItemIDs[tainters[j].id] = true;
			}
			oldconfig = false;
		}
		ret.names[i] = param;
	}
	for (i  = 0, ilen = config.givens.length; i < ilen; i += 1) {
		param = [];
		for (j = 0, jlen = config.givens[i].length; j < jlen; j += 1) {
			if (oldconfig && oldconfig.givens[i][j] !== config.givens[i][j]) {
				for (k = 0, klen = tainters.length; k < klen; k += 1) {
					this.tmp.taintedItemIDs[tainters[k].id] = true;
				}
				oldconfig = false;
			}
			param.push(config.givens[i][j]);
		}
		ret.givens.push(param);
	}
	if (tainters && tainters.length > 1) {
		if (tainters.length == 2 || (oldconfig && oldconfig.year_suffix !== config.year_suffix)) {
			for (i = 0, ilen = tainters.length; i < ilen; i += 1) {
				var oldYS = this.registry.registry[tainters[i].id].disambig.year_suffix;
				if (tainters && (false === oldYS || oldYS != i)) {
					this.tmp.taintedItemIDs[tainters[i].id] = true;
				}
			}
			oldconfig = false;
		}
	}
	ret.year_suffix = config.year_suffix;
	ret.disambiguate = config.disambiguate;
	return ret;
};
CSL.getAmbigConfig = function () {
	var config, ret;
	config = this.tmp.disambig_request;
	if (!config) {
		config = this.tmp.disambig_settings;
	}
	ret = CSL.cloneAmbigConfig(config);
	return ret;
};
CSL.getMaxVals = function () {
	return this.tmp.names_max.mystack.slice();
};
CSL.getMinVal = function () {
	return this.tmp["et-al-min"];
};
CSL.tokenExec = function (token, Item, item) {
	var next, maybenext, exec, pos, len, debug;
	debug = false;
    next = token.next;
	maybenext = false;
	if (token.evaluator) {
	    next = token.evaluator(token, this, Item, item);
    }
	len = token.execs.length;
	for (pos = 0; pos < len; pos += 1) {
		exec = token.execs[pos];
		maybenext = exec.call(token, this, Item, item);
		if (maybenext) {
			next = maybenext;
		}
	}
	return next;
};
CSL.expandMacro = function (macro_key_token) {
	var mkey, start_token, key, end_token, navi, macroxml, newoutput, mergeoutput, end_of_macro;
	mkey = macro_key_token.postponed_macro;
	if (this.build.macro_stack.indexOf(mkey) > -1) {
		throw "CSL processor error: call to macro \"" + mkey + "\" would cause an infinite loop";
	} else {
		this.build.macro_stack.push(mkey);
	}
	macro_key_token.tokentype = CSL.START;
	CSL.Node.group.build.call(macro_key_token, this, this[this.build.area].tokens, true);
	macroxml = this.sys.xml.getNodesByName(this.cslXml, 'macro', mkey);
	if (!this.sys.xml.getNodeValue(macroxml)) {
		throw "CSL style error: undefined macro \"" + mkey + "\"";
	}
	navi = new this.getNavi(this, macroxml);
	CSL.buildStyle.call(this, navi);
	end_of_macro = new CSL.Token("group", CSL.END);
	CSL.Node.group.build.call(end_of_macro, this, this[this.build.area].tokens, true);
	this.build.macro_stack.pop();
};
CSL.XmlToToken = function (state, tokentype) {
	var name, txt, attrfuncs, attributes, decorations, token, key, target;
	name = state.sys.xml.nodename(this);
	if (state.build.skip && state.build.skip !== name) {
		return;
	}
	if (!name) {
		txt = state.sys.xml.content(this);
		if (txt) {
			state.build.text = txt;
		}
		return;
	}
	if (!CSL.Node[state.sys.xml.nodename(this)]) {
		throw "Undefined node name \"" + name + "\".";
	}
	attrfuncs = [];
	attributes = state.sys.xml.attributes(this);
	decorations = CSL.setDecorations.call(this, state, attributes);
	token = new CSL.Token(name, tokentype);
	if (tokentype !== CSL.END || name === "if" || name === "else-if" || name === "layout") {
		for (key in attributes) {
			if (attributes.hasOwnProperty(key)) {
				if (tokentype === CSL.END && key !== "@language" && key !== "@locale") {
					continue;
				}
				if (attributes.hasOwnProperty(key)) {
					try {
						CSL.Attributes[key].call(token, state, "" + attributes[key]);
					} catch (e) {
						if (e === "TypeError: Cannot call method \"call\" of undefined") {
							throw "Unknown attribute \"" + key + "\" in node \"" + name + "\" while processing CSL file";
						} else {
							throw "CSL processor error, " + key + " attribute: " + e;
						}
					}
				}
			}
		}
		token.decorations = decorations;
	}
	target = state[state.build.area].tokens;
	CSL.Node[name].build.call(token, state, target);
};
CSL.DateParser = function () {
	var jiy_list, jiy, jiysplitter, jy, jmd, jr, pos, key, val, yearlast, yearfirst, number, rangesep, fuzzychar, chars, rex, rexdash, rexdashslash, rexslashdash, seasonstrs, seasonrexes, seasonstr, monthstrs, monthstr, mrexes, seasonrex, len, jiymatchstring, jiymatcher;
	jiy_list = [
		["\u660E\u6CBB", 1867],
		["\u5927\u6B63", 1911],
		["\u662D\u548C", 1925],
		["\u5E73\u6210", 1988]
	];
	jiy = {};
	len = jiy_list.length;
	for (pos = 0; pos < len; pos += 1) {
		key = jiy_list[pos][0];
		val = jiy_list[pos][1];
		jiy[key] = val;
	}
	jiymatchstring = [];
	for (pos = 0; pos < len; pos += 1) {
		val = jiy_list[pos][0];
		jiymatchstring.push(val);
	}
	jiymatchstring = jiymatchstring.join("|");
	jiysplitter = "(?:" + jiymatchstring + ")(?:[0-9]+)";
	jiysplitter = new RegExp(jiysplitter);
	jiymatcher = "(?:" + jiymatchstring + ")(?:[0-9]+)";
	jiymatcher = new RegExp(jiymatcher, "g");
	jmd = /(\u6708|\u5E74)/g;
	jy = /\u65E5/;
	jr = /\u301c/g;
	yearlast = "(?:[?0-9]{1,2}%%NUMD%%){0,2}[?0-9]{4}(?![0-9])";
	yearfirst = "[?0-9]{4}(?:%%NUMD%%[?0-9]{1,2}){0,2}(?![0-9])";
	number = "[?0-9]{1,3}";
	rangesep = "[%%DATED%%]";
	fuzzychar = "[?~]";
	chars = "[a-zA-Z]+";
	rex = "(" + yearfirst + "|" + yearlast + "|" + number + "|" + rangesep + "|" + fuzzychar + "|" + chars + ")";
	rexdash = new RegExp(rex.replace(/%%NUMD%%/g, "-").replace(/%%DATED%%/g, "-"));
	rexdashslash = new RegExp(rex.replace(/%%NUMD%%/g, "-").replace(/%%DATED%%/g, "\/"));
	rexslashdash = new RegExp(rex.replace(/%%NUMD%%/g, "\/").replace(/%%DATED%%/g, "-"));
	seasonstrs = [];
	seasonrexes = [];
	len = seasonstrs.length;
	for (pos = 0; pos < len; pos += 1) {
		seasonrex = new RegExp(seasonstrs[pos] + ".*");
		seasonrexes.push(seasonrex);
	}
	this.mstrings = "january february march april may june july august september october november december spring summer fall winter spring summer";
	this.mstrings = this.mstrings.split(" ");
	this.setOrderDayMonth = function() {
		this.monthguess = 1;
		this.dayguess = 0;
	};
	this.setOrderMonthDay = function() {
		this.monthguess = 0;
		this.dayguess = 1;
	};
	this.setOrderMonthDay();
	this.resetMonths = function() {
		var i, ilen, j, jlen;
		this.msets = [];
		for (i = 0, ilen = this.mstrings.length; i < ilen; i += 1) {
			this.msets.push([this.mstrings[i]]);
		}
		this.mabbrevs = [];
		for (i = 0, ilen = this.msets.length; i < ilen; i += 1) {
			this.mabbrevs.push([]);
			for (j = 0, jlen = this.msets[i].length; j < jlen; j += 1) {
				this.mabbrevs[i].push(this.msets[i][0].slice(0, 3));
			}
		}
		this.mrexes = [];
		for (i = 0, ilen = this.mabbrevs.length; i < ilen; i += 1) {
			this.mrexes.push(new RegExp("(?:" + this.mabbrevs[i].join("|") + ")"));
		}
	};
	this.resetMonths();
	this.addMonths = function(lst) {
		var i, ilen, j, jlen, k, klen, jkey, kkey;
		if ("string" === typeof lst) {
			lst = lst.split(/\s+/);
		}
		if (lst.length !== 12 && lst.length !== 16) {
			CSL.debug("month [+season] list of "+lst.length+", expected 12 or 16. Ignoring.");
			return;
		}
		var othermatch = [];
		var thismatch = [];
		for (i = 0, ilen = lst.length; i < ilen; i += 1) {
			var abbrevlen = false;
			var skip = false;
			var insert = 3;
			var extend = {};
			for (j = 0, jlen = this.mabbrevs.length; j < jlen; j += 1) {
				extend[j] = {};
				if (j === i) {
					for (k = 0, klen = this.mabbrevs[i].length; k < klen; k += 1) {
						if (this.mabbrevs[i][k] === lst[i].slice(0, this.mabbrevs[i][k].length)) {
							skip = true;
							break;
						}
					}
				} else {
					for (k = 0, klen = this.mabbrevs[j].length; k < klen; k += 1) {
						abbrevlen = this.mabbrevs[j][k].length;
						if (this.mabbrevs[j][k] === lst[i].slice(0, abbrevlen)) {
							while (this.msets[j][k].slice(0, abbrevlen) === lst[i].slice(0, abbrevlen)) {
								if (abbrevlen > lst[i].length || abbrevlen > this.msets[j][k].length) {
									CSL.debug("unable to disambiguate month string in date parser: "+lst[i]);
									break;
								} else {
									abbrevlen += 1;
								}
							}
							insert = abbrevlen;
							extend[j][k] = abbrevlen;
						}
					}
				}
				for (jkey in extend) {
					if (extend.hasOwnProperty(jkey)) {
						for (kkey in extend[jkey]) {
							if (extend[jkey].hasOwnProperty(kkey)) {
								abbrevlen = extend[jkey][kkey];
								jkey = parseInt(jkey, 10);
								kkey = parseInt(kkey, 10);
								this.mabbrevs[jkey][kkey] = this.msets[jkey][kkey].slice(0, abbrevlen);
							}
						}
					}
				}
			}
			if (!skip) {
				this.msets[i].push(lst[i]);
				this.mabbrevs[i].push(lst[i].slice(0, insert));
			}
		}
		this.mrexes = [];
		for (i = 0, ilen = this.mabbrevs.length; i < ilen; i += 1) {
			this.mrexes.push(new RegExp("(?:" + this.mabbrevs[i].join("|") + ")"));
		}
	};
	this.parse = function (txt) {
		var slash, dash, lst, l, m, number, note, thedate, slashcount, range_delim, date_delim, ret, delim_pos, delims, isrange, suff, date, breakme, item, delim, element, mm, slst, mmpos, i, ilen, j, jlen, k, klen;
		m = txt.match(jmd);
		if (m) {
			txt = txt.replace(jy, "");
			txt = txt.replace(jmd, "-");
			txt = txt.replace(jr, "/");
			txt = txt.replace("-/", "/");
			txt = txt.replace(/-$/,"");
			slst = txt.split(jiysplitter);
			lst = [];
			mm = txt.match(jiymatcher);
			var mmx = [];
			for (pos = 0, len = mm.length; pos < len; pos += 1) {
				mmx = mmx.concat(mm[pos].match(/([^0-9]+)([0-9]+)/).slice(1));
			}
			for (pos = 0, len = slst.length; pos < len; pos += 1) {
				lst.push(slst[pos]);
				if (pos !== (len - 1)) {
					mmpos = (pos * 2);
					lst.push(mmx[mmpos]);
					lst.push(mmx[mmpos + 1]);
				}
			}
			l = lst.length;
			for	(pos = 1; pos < l; pos += 3) {
				lst[pos + 1] = jiy[lst[pos]] + parseInt(lst[pos + 1], 10);
				lst[pos] = "";
			}
			txt = lst.join("");
			txt = txt.replace(/\s*-\s*$/, "").replace(/\s*-\s*\//, "/");
			txt = txt.replace(/\.\s*$/, "");
			txt = txt.replace(/\.(?! )/, "");
			slash = txt.indexOf("/");
			dash = txt.indexOf("-");
		}
		txt = txt.replace(/([A-Za-z])\./g, "$1");
		number = "";
		note = "";
		thedate = {};
		if (txt.slice(0, 1) === "\"" && txt.slice(-1) === "\"") {
			thedate.literal = txt.slice(1, -1);
			return thedate;
		}
		if (slash > -1 && dash > -1) {
			slashcount = txt.split("/");
			if (slashcount.length > 3) {
				range_delim = "-";
				date_delim = "/";
				lst = txt.split(rexslashdash);
			} else {
				range_delim = "/";
				date_delim = "-";
				lst = txt.split(rexdashslash);
			}
		} else {
			txt = txt.replace("/", "-");
			range_delim = "-";
			date_delim = "-";
			lst = txt.split(rexdash);
		}
		ret = [];
		len = lst.length;
		for (pos = 0; pos < len; pos += 1) {
			item = lst[pos];
			m = item.match(/^\s*([\-\/]|[a-zA-Z]+|[\-~?0-9]+)\s*$/);
			if (m) {
				ret.push(m[1]);
			}
		}
		delim_pos = ret.indexOf(range_delim);
		delims = [];
		isrange = false;
		if (delim_pos > -1) {
			delims.push([0, delim_pos]);
			delims.push([(delim_pos + 1), ret.length]);
			isrange = true;
		} else {
			delims.push([0, ret.length]);
		}
		suff = "";
		for (i = 0, ilen = delims.length; i < ilen; i += 1) {
			delim = delims[i];
			date = ret.slice(delim[0], delim[1]);
			for (j = 0, jlen = date.length; j < jlen; j += 1) {
				element = date[j];
				if (element.indexOf(date_delim) > -1) {
					this.parseNumericDate(thedate, date_delim, suff, element);
					continue;
				}
				if (element.match(/[0-9]{4}/)) {
					thedate[("year" + suff)] = element.replace(/^0*/, "");
					continue;
				}
				breakme = false;
				for (k = 0, klen = this.mrexes.length; k < klen; k += 1) {
					if (element.toLocaleLowerCase().match(this.mrexes[k])) {
						thedate[("month" + suff)] = "" + (parseInt(k, 10) + 1);
						breakme = true;
						break;
					}
					if (breakme) {
						continue;
					}
					if (element.match(/^[0-9]+$/)) {
						number = parseInt(element, 10);
					}
					if (element.toLocaleLowerCase().match(/^bc/) && number) {
						thedate[("year" + suff)] = "" + (number * -1);
						number = "";
						continue;
					}
					if (element.toLocaleLowerCase().match(/^ad/) && number) {
						thedate[("year" + suff)] = "" + number;
						number = "";
						continue;
					}
				}
				breakme = false;
				for (k = 0, klen = seasonrexes.length; k < klen; k += 1) {
					if (element.toLocaleLowerCase().match(seasonrexes[k])) {
						thedate[("season" + suff)] = "" + (parseInt(k, 10) + 1);
						breakme = true;
						break;
					}
				}
				if (breakme) {
					continue;
				}
				if (element === "~" || element === "?" || element === "c" || element.match(/^cir/)) {
					thedate.circa = "" + 1;
					continue;
				}
				if (element.toLocaleLowerCase().match(/(?:mic|tri|hil|eas)/) && !thedate[("season" + suff)]) {
					note = element;
					continue;
				}
			}
			if (number) {
				thedate[("day" + suff)] = number;
				number = "";
			}
			if (note && !thedate[("season" + suff)]) {
				thedate[("season" + suff)] = note;
				note = "";
			}
			suff = "_end";
		}
		if (isrange) {
			for (j = 0, jlen = CSL.DATE_PARTS_ALL.length; j < jlen; j += 1) {
				item = CSL.DATE_PARTS_ALL[j];
				if (thedate[item] && !thedate[(item + "_end")]) {
					thedate[(item + "_end")] = thedate[item];
				} else if (!thedate[item] && thedate[(item + "_end")]) {
					thedate[item] = thedate[(item + "_end")];
				}
			}
		}
		if (!thedate.year) {
			thedate = { "literal": txt };
		}
		if (this.use_array) {
			this.toArray(thedate);			
		}
		return thedate;
	};
	this.returnAsArray = function () {
		this.use_array = true;
	};
	this.returnAsKeys = function () {
		this.use_array = false;
	};
	this.toArray = function (thedate) {
		var i, ilen, part;
		thedate["date-parts"] = [];
		thedate["date-parts"].push([]);
		var slicelen = 0;
		for (i = 0, ilen = 3; i < ilen; i += 1) {
			part = ["year", "month", "day"][i];
			if (!thedate[part]) {
				break;
			}
			slicelen += 1;
			thedate["date-parts"][0].push(thedate[part]);
			delete thedate[part];
		}
		for (i = 0, ilen = slicelen; i < ilen; i += 1) {
			part = ["year_end", "month_end", "day_end"][i];
			if (thedate[part] && thedate["date-parts"].length === 1) {
				thedate["date-parts"].push([]);
			}
			thedate["date-parts"][1].push(thedate[part]);
			delete thedate[part];
		}
	};
	this.parseNumericDate = function (ret, delim, suff, txt) {
		var lst, i, ilen;
		lst = txt.split(delim);
		for (i = 0, ilen = lst.length; i < ilen; i += 1) {
			if (lst[i].length === 4) {
				ret[("year" + suff)] = lst[i].replace(/^0*/, "");
				if (!i) {
					lst = lst.slice(1);
				} else {
					lst = lst.slice(0, i);
				}
				break;
			}
		}
		for (i = 0, ilen = lst.length; i < ilen; i += 1) {
			lst[i] = parseInt(lst[i], 10);
		}
		if (lst.length === 1) {
			ret[("month" + suff)] = "" + lst[0];
		} else if (lst.length === 2) {
			if (lst[this.monthguess] > 12) {
				ret[("month" + suff)] = "" + lst[this.dayguess];
				ret[("day" + suff)] = "" + lst[this.monthguess];
			} else {
				ret[("month" + suff)] = "" + lst[this.monthguess];
				ret[("day" + suff)] = "" + lst[this.dayguess];
			}
		}
	};
};
CSL.Engine = function (sys, style, lang, forceLang) {
	var attrs, langspec, localexml, locale;
	this.processor_version = "1.0.195";
	this.csl_version = "1.0";
	this.sys = sys;
	this.sys.xml = new CSL.System.Xml.Parsing();
	if ("string" !== typeof style) {
		style = "";
	}
	this.parallel = new CSL.Parallel(this);
	this.transform = new CSL.Transform(this);
	this.setAbbreviations = function (nick) {
		this.transform.setAbbreviations(nick);
	};
	this.setParseNames = function (val) {
		this.opt['parse-names'] = val;
	};
	this.opt = new CSL.Engine.Opt();
	this.tmp = new CSL.Engine.Tmp();
	this.build = new CSL.Engine.Build();
	this.fun = new CSL.Engine.Fun();
	this.configure = new CSL.Engine.Configure();
	this.citation_sort = new CSL.Engine.CitationSort();
	this.bibliography_sort = new CSL.Engine.BibliographySort();
	this.citation = new CSL.Engine.Citation(this);
	this.bibliography = new CSL.Engine.Bibliography();
	this.output = new CSL.Output.Queue(this);
	this.dateput = new CSL.Output.Queue(this);
	this.cslXml = this.sys.xml.makeXml(style);
	this.sys.xml.addMissingNameNodes(this.cslXml);
	this.sys.xml.addInstitutionNodes(this.cslXml);
	this.sys.xml.insertPublisherAndPlace(this.cslXml);
	attrs = this.sys.xml.attributes(this.cslXml);
	if ("undefined" === typeof attrs["@sort-separator"]) {
		this.sys.xml.setAttribute(this.cslXml, "sort-separator", ", ");
	}
	this.opt["initialize-with-hyphen"] = true;
	this.setStyleAttributes();
	this.opt.xclass = sys.xml.getAttributeValue(this.cslXml, "class");
	this.opt.styleID = this.sys.xml.getStyleId(this.cslXml);
	if (lang) {
		lang = lang.replace("_", "-");
	}
	if (this.opt["default-locale"][0]) {
		this.opt["default-locale"][0] = this.opt["default-locale"][0].replace("_", "-");
	}
	if (lang && forceLang) {
		this.opt["default-locale"] = [lang];
	}
	if (lang && !forceLang && this.opt["default-locale"][0]) {
		lang = this.opt["default-locale"][0];
	}
	if (this.opt["default-locale"].length === 0) {
		if (!lang) {
			lang = "en-US";
		}
		this.opt["default-locale"].push("en-US");
	}
	if (!lang) {
		lang = this.opt["default-locale"][0];
	}
	langspec = CSL.localeResolve(lang);
	this.opt.lang = langspec.best;
	this.opt["default-locale"][0] = langspec.best;
	this.locale = {};
	this.localeConfigure(langspec);
	this.buildTokenLists("citation");
	this.buildTokenLists("bibliography");
	this.configureTokenLists();
	this.registry = new CSL.Registry(this);
	this.disambiguate = new CSL.Disambiguation(this);
	this.splice_delimiter = false;
	this.fun.dateparser = new CSL.DateParser();
	this.fun.flipflopper = new CSL.Util.FlipFlopper(this);
	this.setCloseQuotesArray();
	this.fun.ordinalizer.init(this);
	this.fun.long_ordinalizer.init(this);
	this.fun.page_mangler = CSL.Util.PageRangeMangler.getFunction(this);
	this.setOutputFormat("html");
};
CSL.Engine.prototype.setCloseQuotesArray = function () {
	var ret;
	ret = [];
	ret.push(this.getTerm("close-quote"));
	ret.push(this.getTerm("close-inner-quote"));
	ret.push('"');
	ret.push("'");
	this.opt.close_quotes_array = ret;
};
CSL.Engine.prototype.buildTokenLists = function (area) {
	var area_nodes, navi;
	area_nodes = this.sys.xml.getNodesByName(this.cslXml, area);
	if (!this.sys.xml.getNodeValue(area_nodes)) {
		return;
	}
	navi = new this.getNavi(this, area_nodes);
	this.build.area = area;
	CSL.buildStyle.call(this, navi);
};
CSL.Engine.prototype.setStyleAttributes = function () {
	var dummy, attr, key, attributes, attrname;
	dummy = {};
	dummy.name = this.sys.xml.nodename(this.cslXml);
	attributes = this.sys.xml.attributes(this.cslXml);
	for (attrname in attributes) {
		if (attributes.hasOwnProperty(attrname)) {
			CSL.Attributes[attrname].call(dummy, this, attributes[attrname]);
		}
	}
};
CSL.buildStyle  = function (navi) {
	if (navi.getkids()) {
		CSL.buildStyle.call(this, navi);
	} else {
		if (navi.getbro()) {
			CSL.buildStyle.call(this, navi);
		} else {
			while (navi.nodeList.length > 1) {
				if (navi.remember()) {
					CSL.buildStyle.call(this, navi);
				}
			}
		}
	}
};
CSL.Engine.prototype.getNavi = function (state, myxml) {
	this.sys = state.sys;
	this.state = state;
	this.nodeList = [];
	this.nodeList.push([0, myxml]);
	this.depth = 0;
};
CSL.Engine.prototype.getNavi.prototype.remember = function () {
	var node;
	this.depth += -1;
	this.nodeList.pop();
	node = this.nodeList[this.depth][1][(this.nodeList[this.depth][0])];
	CSL.XmlToToken.call(node, this.state, CSL.END);
	return this.getbro();
};
CSL.Engine.prototype.getNavi.prototype.getbro = function () {
	var sneakpeek;
	sneakpeek = this.nodeList[this.depth][1][(this.nodeList[this.depth][0] + 1)];
	if (sneakpeek) {
		this.nodeList[this.depth][0] += 1;
		return true;
	} else {
		return false;
	}
};
CSL.Engine.prototype.getNavi.prototype.getkids = function () {
	var currnode, sneakpeek, pos, node, len;
	currnode = this.nodeList[this.depth][1][this.nodeList[this.depth][0]];
	sneakpeek = this.sys.xml.children(currnode);
	if (this.sys.xml.numberofnodes(sneakpeek) === 0) {
		CSL.XmlToToken.call(currnode, this.state, CSL.SINGLETON);
		return false;
	} else {
		for (pos in sneakpeek) {
			if (true) {
				node = sneakpeek[pos];
				if ("date" === this.sys.xml.nodename(node)) {
					currnode = CSL.Util.fixDateNode.call(this, currnode, pos, node);
					sneakpeek = this.sys.xml.children(currnode);
				}
			}
		}
		CSL.XmlToToken.call(currnode, this.state, CSL.START);
		this.depth += 1;
		this.nodeList.push([0, sneakpeek]);
		return true;
	}
};
CSL.Engine.prototype.getNavi.prototype.getNodeListValue = function () {
	return this.nodeList[this.depth][1];
};
CSL.Engine.prototype.getTerm = function (term, form, plural, gender, mode) {
	if (term && term.match(/[A-Z]/) && term === term.toUpperCase()) {
		CSL.debug("Warning: term key is in uppercase form: "+term);
		term = term.toLowerCase();
	}
	var ret = CSL.Engine.getField(CSL.LOOSE, this.locale[this.opt.lang].terms, term, form, plural, gender);
	if (!ret && term === "range-delimiter") {
		ret = "\u2013";
	}
	if (typeof ret === "undefined" && mode === CSL.STRICT) {
		throw "Error in getTerm: term \"" + term + "\" does not exist.";
	} else if (mode === CSL.TOLERANT) {
		ret = false;
	}
	if (ret) {
		this.tmp.cite_renders_content = true;
	}
	return ret;
};
CSL.Engine.prototype.getDate = function (form) {
	if (this.locale[this.opt.lang].dates[form]) {
		return this.locale[this.opt.lang].dates[form];
	} else {
		return false;
	}
};
CSL.Engine.prototype.getOpt = function (arg) {
	if ("undefined" !== typeof this.locale[this.opt.lang].opts[arg]) {
		return this.locale[this.opt.lang].opts[arg];
	} else {
		return this.locale[this.opt.lang].opts[arg];
	}
};
CSL.Engine.prototype.getVariable = function (Item, varname, form, plural) {
	return CSL.Engine.getField(CSL.LOOSE, Item, varname, form, plural);
};
CSL.Engine.prototype.getDateNum = function (ItemField, partname) {
	if ("undefined" === typeof ItemField) {
		return 0;
	} else {
		return ItemField[partname];
	}
};
CSL.Engine.getField = function (mode, hash, term, form, plural, gender) {
	var ret, forms, f, pos, len, hashterm;
	ret = "";
	if ("undefined" === typeof hash[term]) {
		if (mode === CSL.STRICT) {
			throw "Error in getField: term \"" + term + "\" does not exist.";
		} else {
			return undefined;
		}
	}
	if (gender && hash[term][gender]) {
		hashterm = hash[term][gender];
	} else {
		hashterm = hash[term];
	}
	forms = [];
	if (form === "symbol") {
		forms = ["symbol", "short"];
	} else if (form === "verb-short") {
		forms = ["verb-short", "verb"];
	} else if (form !== "long") {
		forms = [form];
	}
	forms = forms.concat(["long"]);
	len = forms.length;
	for (pos = 0; pos < len; pos += 1) {
		f = forms[pos];
		if ("string" === typeof hashterm || "number" === typeof hashterm) {
			ret = hashterm;
		} else if ("undefined" !== typeof hashterm[f]) {
			if ("string" === typeof hashterm[f] || "number" === typeof hashterm[f]) {
				ret = hashterm[f];
			} else {
				if ("number" === typeof plural) {
					ret = hashterm[f][plural];
				} else {
					ret = hashterm[f][0];
				}
			}
			break;
		}
	}
	return ret;
};
CSL.Engine.prototype.configureTokenLists = function () {
	var dateparts_master, area, pos, token, dateparts, part, ppos, pppos, len, llen, lllen;
	dateparts_master = ["year", "month", "day"];
	len = CSL.AREAS.length;
	for (pos = 0; pos < len; pos += 1) {
		area = CSL.AREAS[pos];
		llen = this[area].tokens.length - 1;
		for (ppos = llen; ppos > -1; ppos += -1) {
			token = this[area].tokens[ppos];
			if ("date" === token.name && CSL.END === token.tokentype) {
				dateparts = [];
			}
			if ("date-part" === token.name && token.strings.name) {
				lllen = dateparts_master.length;
				for (pppos = 0; pppos < lllen; pppos += 1) {
					part = dateparts_master[pppos];
					if (part === token.strings.name) {
						dateparts.push(token.strings.name);
					}
				}
			}
			if ("date" === token.name && CSL.START === token.tokentype) {
				dateparts.reverse();
				token.dateparts = dateparts;
			}
			token.next = (ppos + 1);
			if (token.name && CSL.Node[token.name].configure) {
				CSL.Node[token.name].configure.call(token, this, ppos);
			}
		}
	}
	this.version = CSL.version;
	return this.state;
};
CSL.Engine.prototype.retrieveItems = function (ids) {
	var ret, pos, len;
	ret = [];
	len = ids.length;
	for (pos = 0; pos < len; pos += 1) {
		ret.push(this.retrieveItem("" + ids[pos]));
	}
	return ret;
};
CSL.Engine.prototype.retrieveItem = function (id) {
	var Item, m, pos, len, mm;
	Item = this.sys.retrieveItem("" + id);
	if (Item.type === "bill" && Item.number && !Item.volume && Item.page) {
		Item.volume = Item.number;
		Item.number = undefined;
	}
	if (this.opt.development_extensions && Item.note) {
		m = CSL.NOTE_FIELDS_REGEXP.exec(Item.note);
		if (m) {
			for (pos = 0, len = m.length; pos < len; pos += 1) {
				mm = CSL.NOTE_FIELD_REGEXP.exec(m[pos]);
				if (!Item[mm[1]]) {
					if (CSL.DATE_VARIABLES.indexOf(mm[1]) > -1) {
						Item[mm[1]] = {raw:mm[2]};
					} else {
						Item[mm[1]] = mm[2].replace(/^\s+/, "").replace(/\s+$/, "");
					}
				}
			}
		}
	}
	return Item;
};
CSL.Engine.prototype.dateParseArray = function (date_obj) {
	var ret, field, dpos, ppos, dp, exts, llen, pos, len, pppos, lllen;
	ret = {};
	for (field in date_obj) {
		if (field === "date-parts") {
			dp = date_obj["date-parts"];
			if (dp.length > 1) {
				if (dp[0].length !== dp[1].length) {
					CSL.error("CSL data error: element mismatch in date range input.");
				}
			}
			exts = ["", "_end"];
			llen = dp.length;
			for (ppos = 0; ppos < llen; ppos += 1) {
				lllen = CSL.DATE_PARTS.length;
				for (pppos = 0; pppos < lllen; pppos += 1) {
					ret[(CSL.DATE_PARTS[pppos] + exts[ppos])] = dp[ppos][pppos];
				}
			}
		} else if (date_obj.hasOwnProperty(field)) {
			if (field === "literal" && "object" === typeof date_obj.literal && "string" === typeof date_obj.literal.part) {
				CSL.debug("Warning: fixing up weird literal date value");
				ret.literal = date_obj.literal.part;
			} else {
				ret[field] = date_obj[field];
			}
		}
	}
	return ret;
};
CSL.Engine.prototype.setOpt = function (token, name, value) {
	if (token.name === "style") {
		this.opt[name] = value;
	} else if (["citation", "bibliography"].indexOf(token.name) > -1) {
		this[token.name].opt[name] = value;
	} else if (["name-form", "name-delimiter", "names-delimiter"].indexOf(name) === -1) {
		token.strings[name] = value;
	}
};
CSL.Engine.prototype.fixOpt = function (token, name, localname) {
	if ("citation" === token.name || "bibliography" === token.name) {
		if (! this[token.name].opt[name] && "undefined" !== this.opt[name]) {
			this[token.name].opt[name] = this.opt[name];
		}
	}
	if ("name" === token.name || "names" === token.name) {
		if ("undefined" === typeof token.strings[localname] && "undefined" !== typeof this[this.build.area].opt[name]) {
			token.strings[localname] = this[this.build.area].opt[name];
		}
	}
};
CSL.substituteOne = function (template) {
	return function (state, list) {
		if (!list) {
			return "";
		} else {
			return template.replace("%%STRING%%", list);
		}
	};
};
CSL.substituteTwo = function (template) {
	return function (param) {
		var template2 = template.replace("%%PARAM%%", param);
		return function (state, list) {
			if (!list) {
				return "";
			} else {
				return template2.replace("%%STRING%%", list);
			}
		};
	};
};
CSL.Mode = function (mode) {
	var decorations, params, param, func, val, args;
	decorations = {};
	params = CSL.Output.Formats[mode];
	for (param in params) {
		if (true) {
			if ("@" !== param.slice(0, 1)) {
				decorations[param] = params[param];
				continue;
			}
			func = false;
			val = params[param];
			args = param.split('/');
			if (typeof val === "string" && val.indexOf("%%STRING%%") > -1)  {
				if (val.indexOf("%%PARAM%%") > -1) {
					func = CSL.substituteTwo(val);
				} else {
					func = CSL.substituteOne(val);
				}
			} else if (typeof val === "boolean" && !val) {
				func = CSL.Output.Formatters.passthrough;
			} else if (typeof val === "function") {
				func = val;
			} else {
				throw "CSL.Compiler: Bad " + mode + " config entry for " + param + ": " + val;
			}
			if (args.length === 1) {
				decorations[args[0]] = func;
			} else if (args.length === 2) {
				if (!decorations[args[0]]) {
					decorations[args[0]] = {};
				}
				decorations[args[0]][args[1]] = func;
			}
		}
	}
	return decorations;
};
CSL.setDecorations = function (state, attributes) {
	var ret, key, pos;
	ret = [];
	for (pos in CSL.FORMAT_KEY_SEQUENCE) {
		if (true) {
			key = CSL.FORMAT_KEY_SEQUENCE[pos];
			if (attributes[key]) {
				ret.push([key, attributes[key]]);
				delete attributes[key];
			}
		}
	}
	return ret;
};
CSL.Engine.prototype.normalDecorIsOrphan = function (blob, params) {
	if (params[1] === "normal") {
		var use_param = false;
		var all_the_decor;
		if (this.tmp.area === "citation") {
			all_the_decor = [this.citation.opt.layout_decorations].concat(blob.alldecor);
		} else {
			all_the_decor = blob.alldecor;
		}
		for (var k = all_the_decor.length - 1; k > -1; k += -1) {
			for (var n = all_the_decor[k].length - 1; n > -1; n += -1) {
				if (all_the_decor[k][n][0] === params[0]) {
					if (all_the_decor[k][n][1] !== "normal") {
						use_param = true;
					}
				}
			}
		}
		if (!use_param) {
			return true;
		}
	}
	return false;
};
CSL.Engine.prototype.setOutputFormat = function (mode) {
	this.opt.mode = mode;
	this.fun.decorate = CSL.Mode(mode);
	if (!this.output[mode]) {
		this.output[mode] = {};
		this.output[mode].tmp = {};
	}
};
CSL.Engine.prototype.setLangTagsForCslSort = function (tags) {
	var i, ilen;
	this.opt['locale-sort'] = [];
	for (i = 0, ilen = tags.length; i < ilen; i += 1) {
		this.opt['locale-sort'].push(tags[i]);
	}
};
CSL.Engine.prototype.setLangTagsForCslTransliteration = function (tags) {
	var i, ilen;
	this.opt['locale-pri'] = [];	
	for (i = 0, ilen = tags.length; i < ilen; i += 1) {
		this.opt['locale-pri'].push(tags[i]);
	}
};
CSL.Engine.prototype.setLangTagsForCslTranslation = function (tags) {
	var i, ilen;
	this.opt['locale-sec'] = [];
	for (i = 0, ilen = tags.length; i < ilen; i += 1) {
		this.opt['locale-sec'].push(tags[i]);
	}
};
CSL.Engine.prototype.setOriginalCreatorNameFormsOption = function (arg) {
	if (arg) {
		this.opt["locale-show-original-names"] = true;
	} else {
		this.opt["locale-show-original-names"] = false;
	}
};
CSL.Engine.prototype.setOriginalCreatorNameFormatOption = function (arg) {
	if (arg) {
		this.opt["locale-use-original-name-format"] = true;
	} else {
		this.opt["locale-use-original-name-format"] = false;
	}
};
CSL.Engine.prototype.setSuppressTitleTransliterationOption = function (arg) {
	if (arg) {
		this.opt["locale-suppress-title-transliteration"] = true;
	} else {
		this.opt["locale-suppress-title-transliteration"] = false;
	}
};
CSL.Engine.prototype.setAutoVietnameseNamesOption = function (arg) {
	if (arg) {
		this.opt["auto-vietnamese-names"] = true;
	} else {
		this.opt["auto-vietnamese-names"] = false;
	}
};
CSL.Engine.prototype.turnOffDevelopmentExtensions = function (arg) {
	this.opt.development_extensions = false;
};
CSL.Engine.prototype.turnOnDevelopmentExtensions = function (arg) {
	this.opt.development_extensions = true;
};
CSL.Engine.Opt = function () {
	this.has_disambiguate = false;
	this.mode = "html";
	this.dates = {};
	this["locale-sort"] = [];
	this["locale-pri"] = [];
	this["locale-sec"] = [];
	this["default-locale"] = [];
	this["locale-use-original-name-format"] = false;
	this["noun-genders"] = {};
	this.update_mode = CSL.NONE;
	this.bib_mode = CSL.NONE;
	this.sort_citations = false;
	this["et-al-min"] = 0;
	this["et-al-use-first"] = 1;
	this["et-al-use-last"] = false;
	this["et-al-subsequent-min"] = false;
	this["et-al-subsequent-use-first"] = false;
	this["demote-non-dropping-particle"] = "display-and-sort";
	this["parse-names"] = true;
	this.citation_number_slug = false;
	this.max_number_of_names = 0;
	this.trigraph = "Aaaa00:AaAa00:AaAA00:AAAA00";
	this.development_extensions = true;
};
CSL.Engine.Tmp = function () {
	this.names_max = new CSL.Stack();
	this.names_base = new CSL.Stack();
	this.givens_base = new CSL.Stack();
	this.value = [];
	this.namepart_decorations = {};
	this.namepart_type = false;
	this.area = "citation";
	this.can_substitute = new CSL.Stack(0, CSL.LITERAL);
	this.element_rendered_ok = false;
	this.element_trace = new CSL.Stack("style");
	this.nameset_counter = 0;
	this.term_sibling = new CSL.Stack([false, false, false], CSL.LITERAL);
	this.term_predecessor = false;
	this.jump = new CSL.Stack(0, CSL.LITERAL);
	this.decorations = new CSL.Stack();
	this.tokenstore_stack = new CSL.Stack();
	this.last_suffix_used = "";
	this.last_names_used = [];
	this.last_years_used = [];
	this.years_used = [];
	this.names_used = [];
	this.taintedItemIDs = false;
	this.taintedCitationIDs = false;
	this.initialize_with = new CSL.Stack();
	this.disambig_request = false;
	this["name-as-sort-order"] = false;
	this.suppress_decorations = false;
	this.disambig_settings = new CSL.AmbigConfig();
	this.bib_sort_keys = [];
	this.prefix = new CSL.Stack("", CSL.LITERAL);
	this.suffix = new CSL.Stack("", CSL.LITERAL);
	this.delimiter = new CSL.Stack("", CSL.LITERAL);
	this.cite_locales = [];
	this.cite_affixes = false;
	this.strip_periods = 0;
};
CSL.Engine.Fun = function () {
	this.match = new  CSL.Util.Match();
	this.suffixator = new CSL.Util.Suffixator(CSL.SUFFIX_CHARS);
	this.romanizer = new CSL.Util.Romanizer();
	this.ordinalizer = new CSL.Util.Ordinalizer();
	this.long_ordinalizer = new CSL.Util.LongOrdinalizer();
};
CSL.Engine.Build = function () {
	this["alternate-term"] = false;
	this.in_bibliography = false;
	this.in_style = false;
	this.skip = false;
	this.postponed_macro = false;
	this.layout_flag = false;
	this.name = false;
	this.form = false;
	this.term = false;
	this.macro = {};
	this.macro_stack = [];
	this.text = false;
	this.lang = false;
	this.area = "citation";
	this.substitute_level = new CSL.Stack(0, CSL.LITERAL);
	this.render_nesting_level = 0;
	this.render_seen = false;
};
CSL.Engine.Configure = function () {
	this.fail = [];
	this.succeed = [];
};
CSL.Engine.Citation = function (state) {
	this.opt = {};
	this.tokens = [];
	this.srt = new CSL.Registry.Comparifier(state, "citation_sort");
	this.opt.collapse = [];
	this.opt["disambiguate-add-names"] = false;
	this.opt["disambiguate-add-givenname"] = false;
	this.opt["disambiguate-add-year-suffix"] = false;
	this.opt["givenname-disambiguation-rule"] = "none";
	this.opt["near-note-distance"] = 5;
	this.opt.topdecor = [];
	this.opt.layout_decorations = [];
	this.opt.layout_prefix = "";
	this.opt.layout_suffix = "";
	this.opt.layout_delimiter = "";
};
CSL.Engine.Bibliography = function () {
	this.opt = {};
	this.tokens = [];
	this.opt.collapse = [];
	this.opt.topdecor = [];
	this.opt.layout_decorations = [];
	this.opt.layout_prefix = "";
	this.opt.layout_suffix = "";
	this.opt.layout_delimiter = "";
	this.opt["line-spacing"] = 1;
	this.opt["entry-spacing"] = 1;
};
CSL.Engine.BibliographySort = function () {
	this.tokens = [];
	this.opt = {};
	this.opt.sort_directions = [];
	this.keys = [];
	this.opt.topdecor = [];
};
CSL.Engine.CitationSort = function () {
	this.tokens = [];
	this.opt = {};
	this.opt.sort_directions = [];
	this.keys = [];
	this.opt.topdecor = [];
};
CSL.Engine.prototype.setCitationId = function (citation, force) {
	var ret, id, direction;
	ret = false;
	if (!citation.citationID || force) {
		id = Math.floor(Math.random() * 100000000000000);
		while (true) {
			direction = 0;
			if (!this.registry.citationreg.citationById[id]) {
				citation.citationID = id.toString(32);
				break;
			} else if (!direction && id < 50000000000000) {
				direction = 1;
			} else {
				direction = -1;
			}
			if (direction === 1) {
				id += 1;
			} else {
				id += -1;
			}
		}
		ret = "" + id;
	}
	this.registry.citationreg.citationById[citation.citationID] = citation;
	return ret;
};
CSL.Engine.prototype.restoreProcessorState = function (citations) {
	var i, ilen, j, jlen, item, Item, newitem, citationList, itemList, sortedItems;
	citationList = [];
	itemList = [];
	if (!citations) {
		citations = [];
	}
	var indexNumbers = [];
	var citationIds = {};
	for (i = 0, ilen = citations.length; i < ilen; i += 1) {
		if (citationIds[citations[i].citationID]) {
			this.setCitationId(citations[i], true);
		}
		citationIds[citations[i].citationID] = true;
		indexNumbers.push(citations[i].properties.index);
	}
	var oldCitations = citations.slice();
	oldCitations.sort(
	    function (a,b) {
			if (a.properties.index < b.properties.index) {
				return -1;
			} else if (a.properties.index > b.properties.index) {
				return 1;
			} else {
				return 0;
			}
		}
	);
	for (i = 0, ilen = oldCitations.length; i < ilen; i += 1) {
		oldCitations[i].properties.index = i;
	}
	for (i = 0, ilen = oldCitations.length; i < ilen; i += 1) {
		sortedItems = [];
		for (j = 0, jlen = oldCitations[i].citationItems.length; j < jlen; j += 1) {
			item = oldCitations[i].citationItems[j];
			if ("undefined" === typeof item.sortkeys) {
				item.sortkeys = [];
			}
			Item = this.retrieveItem("" + item.id);
			newitem = [Item, item];
			sortedItems.push(newitem);
			oldCitations[i].citationItems[j].item = Item;
			itemList.push("" + item.id);
		}
		if (!oldCitations[i].properties.unsorted) {
			sortedItems.sort(this.citation.srt.compareCompositeKeys);
		}
		oldCitations[i].sortedItems = sortedItems;
		this.registry.citationreg.citationById[oldCitations[i].citationID] = oldCitations[i];
	}
	this.updateItems(itemList);
	for (i = 0, ilen = citations.length; i < ilen; i += 1) {
		citationList.push(["" + citations[i].citationID, citations[i].properties.noteIndex]);
	}
	var ret = [];
	if (citations && citations.length) {
		ret = this.processCitationCluster(citations[0], [], citationList.slice(1));
	} else {
		this.registry = new CSL.Registry(this);
		this.tmp = new CSL.Engine.Tmp();
	}
	return ret;
};
CSL.Engine.prototype.updateItems = function (idList, nosort) {
	var debug = false;
	this.registry.init(idList);
	this.registry.dodeletes(this.registry.myhash);
	this.registry.doinserts(this.registry.mylist);
	this.registry.dorefreshes();
	this.registry.rebuildlist();
	this.registry.setsortkeys();
	this.registry.setdisambigs();
	if (!nosort) {
		this.registry.sorttokens();
	}
	this.registry.renumber();
	return this.registry.getSortedIds();
};
CSL.Engine.prototype.updateUncitedItems = function (idList, nosort) {
	var debug = false;
	this.registry.init(idList, true);
	this.registry.doinserts(this.registry.mylist);
	this.registry.douncited();
	this.registry.rebuildlist();
	this.registry.setsortkeys();
	this.registry.setdisambigs();
	if (!nosort) {
		this.registry.sorttokens();
	}
	this.registry.renumber();
	return this.registry.getSortedIds();
};
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
CSL.Engine.prototype.makeBibliography = function (bibsection) {
	var debug, ret, params, maxoffset, item, len, pos, tok, tokk, tokkk, entry_ids, entry_strings, bibliography_errors;
	debug = false;
	if (!this.bibliography.tokens.length) {
		return false;
	}
	if ("string" === typeof bibsection) {
		this.opt.citation_number_slug = bibsection;
		bibsection = false;
	}
	ret = CSL.getBibliographyEntries.call(this, bibsection);
	entry_ids = ret[0];
	entry_strings = ret[1];
	params = {
		"maxoffset": 0,
		"entryspacing": this.bibliography.opt["entry-spacing"],
		"linespacing": this.bibliography.opt["line-spacing"],
		"second-field-align": false,
		"entry_ids": entry_ids,
		"bibliography_errors": this.tmp.bibliography_errors.slice()
	};
	if (this.bibliography.opt["second-field-align"]) {
		params["second-field-align"] = this.bibliography.opt["second-field-align"];
	}
	maxoffset = 0;
	len = this.registry.reflist.length;
	for (pos = 0; pos < len; pos += 1) {
		item = this.registry.reflist[pos];
		if (item.offset > params.maxoffset) {
			params.maxoffset = item.offset;
		}
	}
	if (this.bibliography.opt.hangingindent) {
		params.hangingindent = this.bibliography.opt.hangingindent;
	}
	params.bibstart = this.fun.decorate.bibstart;
	params.bibend = this.fun.decorate.bibend;
	this.opt.citation_number_slug = false;
	return [params, entry_strings];
};
CSL.getBibliographyEntries = function (bibsection) {
	var ret, input, include, anymatch, allmatch, bib_entry, res, len, pos, item, llen, ppos, spec, lllen, pppos, bib_layout, topblobs, all_item_ids, entry_item_ids, debug, collapse_parallel, i, siblings, skips, sortedItems, eyetem, chr, entry_item_data;
	ret = [];
	entry_item_data = [];
	this.tmp.area = "bibliography";
	this.tmp.last_rendered_name = false;
	this.tmp.bibliography_errors = [];
	this.tmp.bibliography_pos = 0;
	input = this.retrieveItems(this.registry.getSortedIds());
	this.tmp.disambig_override = true;
	function eval_string(a, b) {
		if (a === b) {
			return true;
		}
		return false;
	}
	function eval_list(a, lst) {
		lllen = lst.length;
		for (pppos = 0; pppos < lllen; pppos += 1) {
			if (eval_string(a, lst[pppos])) {
				return true;
			}
		}
		return false;
	}
	function eval_spec(a, b) {
		if ((a === "none" || !a) && !b) {
			return true;
		}
		if ("string" === typeof b) {
			return eval_string(a, b);
		} else if (!b) {
			return false;
		} else {
			return eval_list(a, b);
		}
	}
	skips = {};
	all_item_ids = [];
	len = input.length;
	for (pos = 0; pos < len; pos += 1) {
		item = input[pos];
		if (skips[item.id]) {
			continue;
		}
		if (bibsection) {
			include = true;
			if (bibsection.include) {
				include = false;
				llen = bibsection.include.length;
				for (ppos = 0; ppos < llen; ppos += 1) {
					spec = bibsection.include[ppos];
					if (eval_spec(spec.value, item[spec.field])) {
						include = true;
						break;
					}
				}
			} else if (bibsection.exclude) {
				anymatch = false;
				llen = bibsection.exclude.length;
				for (ppos = 0; ppos < llen; ppos += 1) {
					spec = bibsection.exclude[ppos];
					if (eval_spec(spec.value, item[spec.field])) {
						anymatch = true;
						break;
					}
				}
				if (anymatch) {
					include = false;
				}
			} else if (bibsection.select) {
				include = false;
				allmatch = true;
				llen = bibsection.select.length;
				for (ppos = 0; ppos < llen; ppos += 1) {
					spec = bibsection.select[ppos];
					if (!eval_spec(spec.value, item[spec.field])) {
						allmatch = false;
					}
				}
				if (allmatch) {
					include = true;
				}
			}
			if (bibsection.quash) {
				allmatch = true;
				llen = bibsection.quash.length;
				for (ppos = 0; ppos < llen; ppos += 1) {
					spec = bibsection.quash[ppos];
					if (!eval_spec(spec.value, item[spec.field])) {
						allmatch = false;
					}
				}
				if (allmatch) {
					include = false;
				}
			}
			if (!include) {
				continue;
			}
		}
		bib_entry = new CSL.Token("group", CSL.START);
		bib_entry.decorations = [["@bibliography", "entry"]].concat(this[this.build.area].opt.layout_decorations);
		this.output.startTag("bib_entry", bib_entry);
		this.output.current.value().item_id = item.id;
		sortedItems = [[{id: "" + item.id}, item]];
		entry_item_ids = [];
		if (this.registry.registry[item.id].master) {
			collapse_parallel = true;
			this.parallel.StartCitation(sortedItems);
			this.output.queue[0].strings.delimiter = ", ";
			entry_item_ids.push("" + CSL.getCite.call(this, item));
			skips[item.id] = true;
			siblings = this.registry.registry[item.id].siblings;
			for (ppos = 0, llen = siblings.length; ppos < llen; ppos += 1) {
				i = this.registry.registry[item.id].siblings[ppos];
				eyetem = this.retrieveItem(i);
				entry_item_ids.push("" + CSL.getCite.call(this, eyetem));
				skips[eyetem.id] = true;
			}
			this.parallel.ComposeSet();
			this.parallel.PruneOutputQueue();
		} else if (!this.registry.registry[item.id].siblings) {
			entry_item_ids.push("" + CSL.getCite.call(this, item));
		}
		entry_item_data.push("");
		this.tmp.bibliography_pos += 1;
		all_item_ids.push(entry_item_ids);
		this.output.endTag("bib_entry");
		if (this.output.queue[0].blobs.length && this.output.queue[0].blobs[0].blobs.length) {
			if (collapse_parallel) {
				topblobs = this.output.queue[0].blobs;
				collapse_parallel = false;
			} else {
				topblobs = this.output.queue[0].blobs[0].blobs;
			}
			llen = topblobs.length - 1;
			for (ppos = llen; ppos > -1; ppos += -1) {
				if (topblobs[ppos].blobs && topblobs[ppos].blobs.length !== 0) {
					chr = this.bibliography.opt.layout_suffix.slice(0, 1);
					if (chr && topblobs[ppos].strings.suffix.slice(-1) === chr) {
						topblobs[ppos].strings.suffix = topblobs[ppos].strings.suffix.slice(0, -1);
					}
					topblobs[ppos].strings.suffix += this.bibliography.opt.layout_suffix;
					break;
				}
			}
			topblobs[0].strings.prefix = this.bibliography.opt.layout_prefix + topblobs[0].strings.prefix;
		}
		CSL.Output.Queue.purgeEmptyBlobs(this.output.queue);
		CSL.Output.Queue.adjustPunctuation(this, this.output.queue);
		res = this.output.string(this, this.output.queue)[0];
		if (!res) {
			res = "\n[CSL STYLE ERROR: reference with no printed form.]\n";
		}
		ret.push(res);
	}
	this.tmp.disambig_override = false;
	return [all_item_ids, ret];
};
CSL.Engine.prototype.previewCitationCluster = function (citation, citationsPre, citationsPost, newMode) {
	var oldMode = this.opt.mode;
	this.setOutputFormat(newMode);
	var ret = this.processCitationCluster(citation, citationsPre, citationsPost, CSL.PREVIEW);
	this.setOutputFormat(oldMode);
	return ret[1];
};
CSL.Engine.prototype.appendCitationCluster = function (citation) {
	var citationsPre = [];
	var len = this.registry.citationreg.citationByIndex.length;
	for (var pos = 0; pos < len; pos += 1) {
		var c = this.registry.citationreg.citationByIndex[pos];
		citationsPre.push(["" + c.citationID, c.properties.noteIndex]);
	}
	return this.processCitationCluster(citation, citationsPre, [])[1];
};
CSL.Engine.prototype.processCitationCluster = function (citation, citationsPre, citationsPost, flag) {
	var c, i, ilen, j, jlen, k, klen, n, nlen, key, Item, item, noteCitations, textCitations;
	this.debug = false;
	this.tmp.citation_errors = [];
	var return_data = {"bibchange": false};
	this.registry.return_data = return_data;
	this.setCitationId(citation);
	var oldCitationList;
	var oldItemList;
	var oldAmbigs;
	if (flag === CSL.PREVIEW) {
		oldCitationList = this.registry.citationreg.citationByIndex.slice();
		oldItemList = this.registry.reflist.slice();
		var newCitationList = citationsPre.concat([["" + citation.citationID, citation.properties.noteIndex]]).concat(citationsPost);
		var newItemIds = {};
		var newItemIdsList = [];
		for (i = 0, ilen = newCitationList.length; i < ilen; i += 1) {
			c = this.registry.citationreg.citationById[newCitationList[i][0]];
			for (j = 0, jlen = c.citationItems.length; j < jlen; j += 1) {
				newItemIds[c.citationItems[j].id] = true;
				newItemIdsList.push("" + c.citationItems[j].id);
			}
		}
		oldAmbigs = {};
		for (i = 0, ilen = oldItemList.length; i < ilen; i += 1) {
			if (!newItemIds[oldItemList[i].id]) {
				var oldAkey = this.registry.registry[oldItemList[i].id].ambig;
				var ids = this.registry.ambigcites[oldAkey];
				if (ids) {
					for (j = 0, jlen = ids.length; j < jlen; j += 1) {
						oldAmbigs[ids[j]] = CSL.cloneAmbigConfig(this.registry.registry[ids[j]].disambig);
					}
				}
			}
		}
	}
	this.tmp.taintedItemIDs = {};
	this.tmp.taintedCitationIDs = {};
	var sortedItems = [];
	for (i = 0, ilen = citation.citationItems.length; i < ilen; i += 1) {
		item = citation.citationItems[i];
		Item = this.retrieveItem("" + item.id);
	    var newitem = [Item, item];
		sortedItems.push(newitem);
		citation.citationItems[i].item = Item;
	}
	citation.sortedItems = sortedItems;
	var citationByIndex = [];
	for (i = 0, ilen = citationsPre.length; i < ilen; i += 1) {
		c = citationsPre[i];
		this.registry.citationreg.citationById[c[0]].properties.noteIndex = c[1];
		citationByIndex.push(this.registry.citationreg.citationById[c[0]]);
	}
	citationByIndex.push(citation);
	for (i = 0, ilen = citationsPost.length; i < ilen; i += 1) {
		c = citationsPost[i];
		this.registry.citationreg.citationById[c[0]].properties.noteIndex = c[1];
		citationByIndex.push(this.registry.citationreg.citationById[c[0]]);
	}
	this.registry.citationreg.citationByIndex = citationByIndex;
	this.registry.citationreg.citationsByItemId = {};
	if (this.opt.update_mode === CSL.POSITION) {
		textCitations = [];
		noteCitations = [];
	}
	var update_items = [];
	for (i = 0, ilen = citationByIndex.length; i < ilen; i += 1) {
		citationByIndex[i].properties.index = i;
			for (j = 0, jlen = citationByIndex[i].sortedItems.length; j < jlen; j += 1) {
			item = citationByIndex[i].sortedItems[j];
			if (!this.registry.citationreg.citationsByItemId[item[1].id]) {
				this.registry.citationreg.citationsByItemId[item[1].id] = [];
				update_items.push("" + item[1].id);
			}
			if (this.registry.citationreg.citationsByItemId[item[1].id].indexOf(citationByIndex[i]) === -1) {
				this.registry.citationreg.citationsByItemId[item[1].id].push(citationByIndex[i]);
			}
		}
		if (this.opt.update_mode === CSL.POSITION) {
			if (citationByIndex[i].properties.noteIndex) {
				noteCitations.push(citationByIndex[i]);
			} else {
				textCitations.push(citationByIndex[i]);
			}
		}
	}
	if (flag !== CSL.ASSUME_ALL_ITEMS_REGISTERED) {
		this.updateItems(update_items);
	}
	if (!this.opt.citation_number_sort && sortedItems && sortedItems.length > 1 && this.citation_sort.tokens.length > 0) {
		for (i = 0, ilen = sortedItems.length; i < ilen; i += 1) {
			sortedItems[i][1].sortkeys = CSL.getSortKeys.call(this, sortedItems[i][0], "citation_sort");
		}
		if (this.opt.grouped_sort &&  !citation.properties.unsorted) {
			for (i = 0, ilen = sortedItems.length; i < ilen; i += 1) {
				var sortkeys = sortedItems[i][1].sortkeys;
				this.tmp.authorstring_request = true;
				var mydisambig = this.registry.registry[sortedItems[i][0].id].disambig;
				this.tmp.authorstring_request = true;
				CSL.getAmbiguousCite.call(this, sortedItems[i][0], mydisambig);
				var authorstring = this.registry.authorstrings[sortedItems[i][0].id];
				this.tmp.authorstring_request = false;
				sortedItems[i][1].sortkeys = [authorstring].concat(sortkeys);
			}
			sortedItems.sort(this.citation.srt.compareCompositeKeys);
			var lastauthor = false;
			var thiskey = false;
			var thisauthor = false;
			for (i = 0, ilen = sortedItems.length; i < ilen; i += 1) {
				if (sortedItems[i][1].sortkeys[0] !== lastauthor) {
					thisauthor = sortedItems[i][1].sortkeys[0];
					thiskey =  sortedItems[i][1].sortkeys[1];
				}
				sortedItems[i][1].sortkeys[0] = "" + thiskey + i;
				lastauthor = thisauthor;
			}
		}
		if (!citation.properties.unsorted) {
			sortedItems.sort(this.citation.srt.compareCompositeKeys);
		}
	}
	var citations;
	if (this.opt.update_mode === CSL.POSITION) {
		for (i = 0; i < 2; i += 1) {
			citations = [textCitations, noteCitations][i];
			var first_ref = {};
			var last_ref = {};
			for (j = 0, jlen = citations.length; j < jlen; j += 1) {
				var onecitation = citations[j];
				if (!onecitation.properties.noteIndex) {
					onecitation.properties.noteIndex = 0;
				}
				for (k = 0, klen = citations[j].sortedItems.length; k < klen; k += 1) {
					item = citations[j].sortedItems[k];
					if (flag === CSL.PREVIEW) {
						if (onecitation.citationID != citation.citationID) {
							if ("undefined" === typeof first_ref[item[1].id]) {
								first_ref[item[1].id] = onecitation.properties.noteIndex;
								last_ref[item[1].id] = onecitation.properties.noteIndex;
							} else {
								last_ref[item[1].id] = onecitation.properties.noteIndex;
							}
							continue;
						}
					}
					var oldvalue = {};
					oldvalue.position = item[1].position;
					oldvalue["first-reference-note-number"] = item[1]["first-reference-note-number"];
					oldvalue["near-note"] = item[1]["near-note"];
					item[1]["first-reference-note-number"] = 0;
					item[1]["near-note"] = false;
					if ("undefined" === typeof first_ref[item[1].id]) {
						first_ref[item[1].id] = onecitation.properties.noteIndex;
						last_ref[item[1].id] = onecitation.properties.noteIndex;
						item[1].position = CSL.POSITION_FIRST;
					} else {
						var ibidme = false;
						var suprame = false;
						if (j > 0 && parseInt(k, 10) === 0) {
							var items = citations[(j - 1)].sortedItems;
							var useme = false;
							if ((citations[(j - 1)].sortedItems[0][1].id  == item[1].id && citations[j - 1].properties.noteIndex >= (citations[j].properties.noteIndex - 1)) || citations[(j - 1)].sortedItems[0][1].id == this.registry.registry[item[1].id].parallel) {
								useme = true;
							}
							for (n = 0, nlen = items.slice(1).length; n < nlen; n += 1) {
								var itmp = items.slice(1)[n];
								if (!this.registry.registry[itmp[1].id].parallel || this.registry.registry[itmp[1].id].parallel == this.registry.registry[itmp[1].id]) {
									useme = false;
								}
							}
							if (useme) {
								ibidme = true;
							} else {
								suprame = true;
							}
						} else if (k > 0 && onecitation.sortedItems[(k - 1)][1].id == item[1].id) {
							ibidme = true;
						} else {
							suprame = true;
						}
						var prev_locator, curr_locator;
						if (ibidme) {
							if (k > 0) {
								prev_locator = onecitation.sortedItems[(k - 1)][1].locator;
							} else {
								prev_locator = citations[(j - 1)].sortedItems[0][1].locator;
							}
							curr_locator = item[1].locator;
						}
						if (ibidme && prev_locator && !curr_locator) {
							ibidme = false;
							suprame = true;
						}
						if (ibidme) {
							if (!prev_locator && curr_locator) {
								item[1].position = CSL.POSITION_IBID_WITH_LOCATOR;
							} else if (!prev_locator && !curr_locator) {
								item[1].position = CSL.POSITION_IBID;
							} else if (prev_locator && curr_locator === prev_locator) {
								item[1].position = CSL.POSITION_IBID;
							} else if (prev_locator && curr_locator && curr_locator !== prev_locator) {
								item[1].position = CSL.POSITION_IBID_WITH_LOCATOR;
							} else {
								ibidme = false; // just to be clear
								suprame = true;
							}
						}
						if (suprame) {
							item[1].position = CSL.POSITION_SUBSEQUENT;
							if (first_ref[item[1].id] != onecitation.properties.noteIndex) {
								item[1]["first-reference-note-number"] = first_ref[item[1].id];
							}
						}
					}
					if (onecitation.properties.noteIndex) {
						var note_distance = parseInt(onecitation.properties.noteIndex, 10) - parseInt(last_ref[item[1].id], 10);
						if (item[1].position !== CSL.POSITION_FIRST 
							&& note_distance <= this.citation.opt["near-note-distance"]) {
							item[1]["near-note"] = true;
						}
						last_ref[item[1].id] = onecitation.properties.noteIndex;
					}
					if (onecitation.citationID != citation.citationID) {
						for (n = 0, nlen = CSL.POSITION_TEST_VARS.length; n < nlen; n += 1) {
							var param = CSL.POSITION_TEST_VARS[n];
							if (item[1][param] !== oldvalue[param]) {
								this.tmp.taintedCitationIDs[onecitation.citationID] = true;
							}
						}
					}
				}
			}
		}
	}
	if (this.opt.citation_number_sort && sortedItems && sortedItems.length > 1 && this.citation_sort.tokens.length > 0) {
		for (i = 0, ilen = sortedItems.length; i < ilen; i += 1) {
			sortedItems[i][1].sortkeys = CSL.getSortKeys.call(this, sortedItems[i][0], "citation_sort");
		}
		if (!citation.properties.unsorted) {
			sortedItems.sort(this.citation.srt.compareCompositeKeys);
		}
	}
	for (key in this.tmp.taintedItemIDs) {
		if (this.tmp.taintedItemIDs.hasOwnProperty(key)) {
			citations = this.registry.citationreg.citationsByItemId[key];
			if (citations) {
				for (i = 0, ilen = citations.length; i < ilen; i += 1) {
					this.tmp.taintedCitationIDs[citations[i].citationID] = true;
				}
			}
		}
	}
	var ret = [];
	if (flag === CSL.PREVIEW) {
		try {
			ret = this.process_CitationCluster.call(this, citation.sortedItems, citation.citationID);
		} catch (e) {
			CSL.error("Error running CSL processor for preview: "+e);
		}
		this.registry.citationreg.citationByIndex = oldCitationList;
		this.registry.citationreg.citationById = {};
		for (i = 0, ilen = oldCitationList.length; i < ilen; i += 1) {
			this.registry.citationreg.citationById[oldCitationList[i].citationID] = oldCitationList[i];
		}
		var oldItemIds = [];
		for (i = 0, ilen = oldItemList.length; i < ilen; i += 1) {
			oldItemIds.push("" + oldItemList[i].id);
		}
		this.updateItems(oldItemIds);
		for (key in oldAmbigs) {
			if (oldAmbigs.hasOwnProperty(key)) {
				this.registry.registry[key].disambig = oldAmbigs[key];
			}
		}
	} else {
		var obj;
		for (key in this.tmp.taintedCitationIDs) {
			if (this.tmp.taintedCitationIDs.hasOwnProperty(key)) {
				if (key == citation.citationID) {
					continue;
				}
				var mycitation = this.registry.citationreg.citationById[key];
				this.tmp.citation_pos = mycitation.properties.index;
				this.tmp.citation_note_index = mycitation.properties.noteIndex;
				this.tmp.citation_id = "" + mycitation.citationID;
				obj = [];
				obj.push(mycitation.properties.index);
				obj.push(this.process_CitationCluster.call(this, mycitation.sortedItems, mycitation.citationID));
				ret.push(obj);
				this.tmp.citation_pos += 1;
			}
		}
		this.tmp.taintedItemIDs = false;
		this.tmp.taintedCitationIDs = false;
		this.tmp.citation_pos = citation.properties.index;
		this.tmp.citation_note_index = citation.properties.noteIndex;
		this.tmp.citation_id = "" + citation.citationID;
		obj = [];
		obj.push(citationsPre.length);
		obj.push(this.process_CitationCluster.call(this, sortedItems));
		ret.push(obj);
		ret.sort(function (a, b) {
			if (a[0] > b[0]) {
				return 1;
			} else if (a[0] < b[0]) {
				return -1;
			} else {
				return 0;
			}
		});
	}
	return_data.citation_errors = this.tmp.citation_errors.slice();
	return [return_data, ret];
};
CSL.Engine.prototype.process_CitationCluster = function (sortedItems, citationID) {
	var str;
	this.parallel.StartCitation(sortedItems);
	str = CSL.getCitationCluster.call(this, sortedItems, citationID);
	return str;
};
CSL.Engine.prototype.makeCitationCluster = function (rawList) {
	var inputList, newitem, str, pos, len, item, Item;
	inputList = [];
	len = rawList.length;
	for (pos = 0; pos < len; pos += 1) {
		item = rawList[pos];
		Item = this.retrieveItem("" + item.id);
		newitem = [Item, item];
		inputList.push(newitem);
	}
	if (inputList && inputList.length > 1 && this.citation_sort.tokens.length > 0) {
		len = inputList.length;
		for (pos = 0; pos < len; pos += 1) {
			rawList[pos].sortkeys = CSL.getSortKeys.call(this, inputList[pos][0], "citation_sort");
		}
		inputList.sort(this.citation.srt.compareCompositeKeys);
	}
	this.tmp.citation_errors = [];
	this.parallel.StartCitation(inputList);
	str = CSL.getCitationCluster.call(this, inputList);
	return str;
};
CSL.getAmbiguousCite = function (Item, disambig) {
	var use_parallels, ret;
	if (disambig) {
		this.tmp.disambig_request = disambig;
	} else {
		this.tmp.disambig_request = false;
	}
	this.tmp.area = "citation";
	use_parallels = this.parallel.use_parallels;
	this.parallel.use_parallels = false;
	this.tmp.suppress_decorations = true;
	this.tmp.just_looking = true;
	CSL.getCite.call(this, Item, {position: 1});
	CSL.Output.Queue.purgeEmptyBlobs(this.output.queue);
	CSL.Output.Queue.adjustPunctuation(this, this.output.queue);
	ret = this.output.string(this, this.output.queue);
	this.tmp.just_looking = false;
	this.tmp.suppress_decorations = false;
	this.parallel.use_parallels = use_parallels;
	return ret;
};
CSL.getSpliceDelimiter = function (last_collapsed, pos) {
	if (last_collapsed && ! this.tmp.have_collapsed && "string" === typeof this.citation.opt["after-collapse-delimiter"]) {
		this.tmp.splice_delimiter = this.citation.opt["after-collapse-delimiter"];
	} else if (this.tmp.have_collapsed && this.opt.xclass === "in-text") {
		this.tmp.splice_delimiter = ", ";
	} else if (this.tmp.cite_locales[pos - 1]) {
		var alt_affixes = this.tmp.cite_affixes[this.tmp.cite_locales[pos - 1]];
		if (alt_affixes && alt_affixes.delimiter) {
			this.tmp.splice_delimiter = alt_affixes.delimiter;
		}
	}
	if (!this.tmp.splice_delimiter) {
		this.tmp.splice_delimiter = "";
	}
	return this.tmp.splice_delimiter;
};
CSL.getCitationCluster = function (inputList, citationID) {
	var result, objects, myparams, len, pos, item, last_collapsed, params, empties, composite, compie, myblobs, Item, llen, ppos, obj, preceding_item, txt_esc, error_object;
	this.tmp.last_primary_names_string = false;
	txt_esc = CSL.Output.Formats[this.opt.mode].text_escape;
	this.tmp.area = "citation";
	result = "";
	objects = [];
	this.tmp.last_suffix_used = "";
	this.tmp.last_names_used = [];
	this.tmp.last_years_used = [];
	this.tmp.backref_index = [];
	this.tmp.cite_locales = [];
	if (citationID) {
		this.registry.citationreg.citationById[citationID].properties.backref_index = false;
		this.registry.citationreg.citationById[citationID].properties.backref_citation = false;
	}
	myparams = [];
	len = inputList.length;
	for (pos = 0; pos < len; pos += 1) {
		Item = inputList[pos][0];
		item = inputList[pos][1];
		last_collapsed = this.tmp.have_collapsed;
		params = {};
		if (pos > 0) {
			CSL.getCite.call(this, Item, item, "" + inputList[(pos - 1)][0].id);
		} else {
			this.tmp.term_predecessor = false;
			CSL.getCite.call(this, Item, item);
		}
		if (!this.tmp.cite_renders_content) {
			error_object = {
				citationID: "" + this.tmp.citation_id,
				index: this.tmp.citation_pos,
				noteIndex: this.tmp.citation_note_index,
				itemID: "" + Item.id,
				citationItems_pos: pos,
				error_code: CSL.ERROR_NO_RENDERED_FORM
			};
			this.tmp.citation_errors.push(error_object);
		}
		if (pos === (inputList.length - 1)) {
			this.parallel.ComposeSet();
		}
		params.splice_delimiter = CSL.getSpliceDelimiter.call(this, last_collapsed, pos);
		if (item && item["author-only"]) {
			this.tmp.suppress_decorations = true;
		}
		if (pos > 0) {
			preceding_item = inputList[pos - 1][1];
			if (preceding_item.suffix && pos > 0 && preceding_item.suffix.slice(-1) === ".") {
				var spaceidx = params.splice_delimiter.indexOf(" ");
				if (spaceidx > -1) {
					params.splice_delimiter = params.splice_delimiter.slice(spaceidx);
				} else {
					params.splice_delimiter = "";
				}
			}
		}
		params.suppress_decorations = this.tmp.suppress_decorations;
		params.have_collapsed = this.tmp.have_collapsed;
		myparams.push(params);
	}
	this.parallel.PruneOutputQueue(this);
	empties = 0;
	myblobs = this.output.queue.slice();
	var fakeblob = {
		strings: {
			suffix: this.citation.opt.layout_suffix,
			delimiter: this.citation.opt.layout_delimiter				
		}
	};
	var suffix = this.citation.opt.layout_suffix;
	var last_locale = this.tmp.cite_locales[this.tmp.cite_locales.length - 1];
	if (last_locale && this.tmp.cite_affixes[last_locale] && this.tmp.cite_affixes[last_locale].suffix) {
		suffix = this.tmp.cite_affixes[last_locale].suffix;
	}
	if (CSL.TERMINAL_PUNCTUATION.slice(0, -1).indexOf(suffix.slice(0, 1)) > -1) {
		suffix = suffix.slice(0, 1);
	}
	var delimiter = this.citation.opt.layout_delimiter;
	if (!delimiter) {
		delimiter = "";
	}
	if (CSL.TERMINAL_PUNCTUATION.slice(0, -1).indexOf(delimiter.slice(0, 1)) > -1) {
		delimiter = delimiter.slice(0, 1);
	}
	var mystk = [
		{
			suffix: "",
			delimiter: delimiter,
			blob: fakeblob
		}
	];
	var use_layout_suffix = suffix;
	for (pos = 0, len = myblobs.length; pos < len; pos += 1) {
		CSL.Output.Queue.purgeEmptyBlobs(this.output.queue, true);
	}
	for (pos = 0, len = myblobs.length; pos < len; pos += 1) {
		this.output.queue = [myblobs[pos]];
		this.tmp.suppress_decorations = myparams[pos].suppress_decorations;
		this.tmp.splice_delimiter = myparams[pos].splice_delimiter;
		if (myblobs[pos].parallel_delimiter) {
			this.tmp.splice_delimiter = myblobs[pos].parallel_delimiter;
		}
		this.tmp.have_collapsed = myparams[pos].have_collapsed;
		if (pos === (myblobs.length - 1)) {
			mystk[0].suffix = use_layout_suffix;
		}
		CSL.Output.Queue.adjustPunctuation(this, this.output.queue, mystk);
		composite = this.output.string(this, this.output.queue);
		this.tmp.suppress_decorations = false;
		if ("string" === typeof composite) {
			this.tmp.suppress_decorations = false;
			return composite;
		}
		if ("object" === typeof composite && composite.length === 0 && !item["suppress-author"]) {
			composite.push("[CSL STYLE ERROR: reference with no printed form.]");
		}
		if (objects.length && "string" === typeof composite[0]) {
			composite.reverse();
			var tmpstr = composite.pop();
			if (tmpstr && tmpstr.slice(0, 1) === ",") {
				objects.push(tmpstr);
			} else {
				objects.push(txt_esc(this.tmp.splice_delimiter) + tmpstr);
			}
		} else {
			composite.reverse();
			compie = composite.pop();
			if ("undefined" !== typeof compie) {
				objects.push(compie);
			}
		}
		llen = composite.length;
		for (ppos = 0; ppos < llen; ppos += 1) {
			obj = composite[ppos];
			if ("string" === typeof obj) {
				objects.push(txt_esc(this.tmp.splice_delimiter) + obj);
				continue;
			}
			compie = composite.pop();
			if ("undefined" !== typeof compie) {
				objects.push(compie);
			}
		}
		if (objects.length === 0 && !inputList[pos][1]["suppress-author"]) {
			empties += 1;
		}
	}
	result += this.output.renderBlobs(objects);
	if (result) {
		if (CSL.TERMINAL_PUNCTUATION.indexOf(this.tmp.last_chr) > -1 
			&& this.tmp.last_chr === use_layout_suffix.slice(0, 1)) {
			use_layout_suffix = use_layout_suffix.slice(1);
		}
		result = txt_esc(this.citation.opt.layout_prefix) + result + txt_esc(use_layout_suffix);
		if (!this.tmp.suppress_decorations) {
			len = this.citation.opt.layout_decorations.length;
			for (pos = 0; pos < len; pos += 1) {
				params = this.citation.opt.layout_decorations[pos];
				if (params[1] === "normal") {
					continue;
				}
				result = this.fun.decorate[params[0]][params[1]](this, result);
			}
		}
	}
	this.tmp.suppress_decorations = false;
	return result;
};
CSL.getCite = function (Item, item, prevItemID) {
	var next, error_object;
	this.tmp.cite_renders_content = false;
	this.parallel.StartCite(Item, item, prevItemID);
	CSL.citeStart.call(this, Item, item);
	next = 0;
	this.nameOutput = new CSL.NameOutput(this, Item, item);
	while (next < this[this.tmp.area].tokens.length) {
		next = CSL.tokenExec.call(this, this[this.tmp.area].tokens[next], Item, item);
    }
	CSL.citeEnd.call(this, Item, item);
	this.parallel.CloseCite(this);
	if (!this.tmp.cite_renders_content && !this.tmp.just_looking) {
		if (this.tmp.area === "bibliography") {
			error_object = {
				index: this.tmp.bibliography_pos,
				itemID: "" + Item.id,
				error_code: CSL.ERROR_NO_RENDERED_FORM
			};
			this.tmp.bibliography_errors.push(error_object);
		}
	}
	return "" + Item.id;
};
CSL.citeStart = function (Item, item) {
	this.tmp.same_author_as_previous_cite = false;
	this.tmp.lastchr = "";
	if (this.tmp.area === "citation" && this.citation.opt.collapse && this.citation.opt.collapse.length) {
		this.tmp.have_collapsed = true;
	} else {
		this.tmp.have_collapsed = false;
	}
	this.tmp.render_seen = false;
	if (this.tmp.disambig_request  && ! this.tmp.disambig_override) {
		this.tmp.disambig_settings = this.tmp.disambig_request;
	} else if (this.registry.registry[Item.id] && ! this.tmp.disambig_override) {
		this.tmp.disambig_request = this.registry.registry[Item.id].disambig;
		this.tmp.disambig_settings = this.registry.registry[Item.id].disambig;
	} else {
		this.tmp.disambig_settings = new CSL.AmbigConfig();
	}
	if (this.tmp.area === 'bibliography' && this.opt["disambiguate-add-names"] && this.registry.registry[Item.id] && this.tmp.disambig_override) {
		this.tmp.disambig_request = this.tmp.disambig_settings;
		this.tmp.disambig_request.names = this.registry.registry[Item.id].disambig.names.slice();
		this.tmp.disambig_settings.names = this.registry.registry[Item.id].disambig.names.slice();
	}
	this.tmp.names_used = [];
	this.tmp.nameset_counter = 0;
	this.tmp.years_used = [];
	this.tmp.names_max.clear();
	this.tmp.splice_delimiter = this[this.tmp.area].opt.layout_delimiter;
	this.bibliography_sort.keys = [];
	this.citation_sort.keys = [];
	this.tmp.has_done_year_suffix = false;
	this.tmp.last_cite_locale = false;
	if (!this.tmp.just_looking && item && !item.position && this.registry.registry[Item.id]) {
		this.tmp.disambig_restore = CSL.cloneAmbigConfig(this.registry.registry[Item.id].disambig);
	}
};
CSL.citeEnd = function (Item, item) {
	if (this.tmp.disambig_restore) {
		this.registry.registry[Item.id].disambig.names = this.tmp.disambig_restore.names;
		this.registry.registry[Item.id].disambig.givens = this.tmp.disambig_restore.givens;
	}
	this.tmp.disambig_restore = false;
	this.tmp.last_suffix_used = this.tmp.suffix.value();
	this.tmp.last_years_used = this.tmp.years_used.slice();
	this.tmp.last_names_used = this.tmp.names_used.slice();
	this.tmp.cut_var = false;
	this.tmp.disambig_request = false;
	this.tmp.cite_locales.push(this.tmp.last_cite_locale);
};
CSL.Node = {};
CSL.Node.bibliography = {
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
			state.build.area = "bibliography";
		}
		if (this.tokentype === CSL.END) {
			state.build.area = state.build.area_return;
		}
		target.push(this);
	}
};
CSL.Node.choose = {
	build: function (state, target) {
		var func;
		if (this.tokentype === CSL.START) {
			func = function (state, Item) {
				state.tmp.jump.push(undefined, CSL.LITERAL);
			};
		}
		if (this.tokentype === CSL.END) {
			func = function (state, Item) {
				state.tmp.jump.pop();
			};
		}
		this.execs.push(func);
		target.push(this);
	},
	configure: function (state, pos) {
		if (this.tokentype === CSL.END) {
			state.configure.fail.push((pos));
			state.configure.succeed.push((pos));
		} else {
			state.configure.fail.pop();
			state.configure.succeed.pop();
		}
	}
};
CSL.localeResolve = function (langstr) {
	var ret, langlst;
	ret = {};
	langlst = langstr.split(/[\-_]/);
	ret.base = CSL.LANG_BASES[langlst[0]];
	if ("undefined" === typeof ret.base) {
		CSL.debug("Warning: unknown locale "+langstr+", setting to en-US");
		return {base:"en-US", best:"en-US", bare:"en"};
	}
	if (langlst.length === 1 || langlst[1] === "x") {
		ret.best = ret.base.replace("_", "-");
	} else {
		ret.best = langlst.slice(0, 2).join("-");
	}
	ret.base = ret.base.replace("_", "-");
	ret.bare = langlst[0];
	return ret;
};
CSL.localeParse = function (arg) {
	return arg;
};
CSL.Engine.prototype.localeConfigure = function (langspec) {
	var localexml;
	localexml = this.sys.xml.makeXml(this.sys.retrieveLocale("en-US"));
	this.localeSet(localexml, "en-US", langspec.best);
	if (langspec.best !== "en-US") {
		if (langspec.base !== langspec.best) {
			localexml = this.sys.xml.makeXml(this.sys.retrieveLocale(langspec.base));
			this.localeSet(localexml, langspec.base, langspec.best);
		}
		localexml = this.sys.xml.makeXml(this.sys.retrieveLocale(langspec.best));
		this.localeSet(localexml, langspec.best, langspec.best);		
	}
	this.localeSet(this.cslXml, "", langspec.best);
	this.localeSet(this.cslXml, langspec.bare, langspec.best);
	if (langspec.base !== langspec.best) {
		this.localeSet(this.cslXml, langspec.base, langspec.best);
	}
	this.localeSet(this.cslXml, langspec.best, langspec.best);
};
CSL.Engine.prototype.localeSet = function (myxml, lang_in, lang_out) {
	var blob, locale, nodes, attributes, pos, ppos, term, form, termname, styleopts, attr, date, attrname, len, genderform, target;
	lang_in = lang_in.replace("_", "-");
	lang_out = lang_out.replace("_", "-");
	if (!this.locale[lang_out]) {
		this.locale[lang_out] = {};
		this.locale[lang_out].terms = {};
		this.locale[lang_out].opts = {};
		this.locale[lang_out].dates = {};
	}
	locale = this.sys.xml.makeXml();
	if (this.sys.xml.nodeNameIs(myxml, 'locale')) {
		locale = myxml;
	} else {
		nodes = this.sys.xml.getNodesByName(myxml, "locale");
		for (pos = 0, len = this.sys.xml.numberofnodes(nodes); pos < len; pos += 1) {
			blob = nodes[pos];
			if (this.sys.xml.getAttributeValue(blob, 'lang', 'xml') === lang_in) {
				locale = blob;
				break;
			}
		}
	}
	nodes = this.sys.xml.getNodesByName(locale, 'term');
	for (pos = 0, len = this.sys.xml.numberofnodes(nodes); pos < len; pos += 1) {
		term = nodes[pos];
		termname = this.sys.xml.getAttributeValue(term, 'name');
		if (termname === "sub verbo") {
			termname = "sub-verbo";
		}
		if ("undefined" === typeof this.locale[lang_out].terms[termname]) {
			this.locale[lang_out].terms[termname] = {};
		}
		form = "long";
		genderform = false;
		if (this.sys.xml.getAttributeValue(term, 'form')) {
			form = this.sys.xml.getAttributeValue(term, 'form');
		}
		if (this.sys.xml.getAttributeValue(term, 'gender-form')) {
			genderform = this.sys.xml.getAttributeValue(term, 'gender-form');
		}
		if (this.sys.xml.getAttributeValue(term, 'gender')) {
			this.opt["noun-genders"][termname] = this.sys.xml.getAttributeValue(term, 'gender');
		}
		if (genderform) {
			this.locale[lang_out].terms[termname][genderform] = {};
			this.locale[lang_out].terms[termname][genderform][form] = [];
			target = this.locale[lang_out].terms[termname][genderform];
		} else {
			this.locale[lang_out].terms[termname][form] = [];
			target = this.locale[lang_out].terms[termname];
		}
		if (this.sys.xml.numberofnodes(this.sys.xml.getNodesByName(term, 'multiple'))) {
			target[form][0] = this.sys.xml.getNodeValue(term, 'single');
			target[form][1] = this.sys.xml.getNodeValue(term, 'multiple');
		} else {
			target[form] = this.sys.xml.getNodeValue(term);
		}
	}
	for (termname in this.locale[lang_out].terms) {
		if (this.locale[lang_out].terms.hasOwnProperty(termname)) {
		for (var i = 0, ilen = 2; i < ilen; i += 1) {
			genderform = CSL.GENDERS[i];
			if (this.locale[lang_out].terms[termname][genderform]) {
				for (form in this.locale[lang_out].terms[termname]) {
					if (!this.locale[lang_out].terms[termname][genderform][form]) {
						this.locale[lang_out].terms[termname][genderform][form] = this.locale[lang_out].terms[termname][form];
					}
				}
			}
		}
		}
	}
	nodes = this.sys.xml.getNodesByName(locale, 'style-options');
	for (pos = 0, len = this.sys.xml.numberofnodes(nodes); pos < len; pos += 1) {
		if (true) {
			styleopts = nodes[pos];
			attributes = this.sys.xml.attributes(styleopts);
			for (attrname in attributes) {
				if (attributes.hasOwnProperty(attrname)) {
					if (attributes[attrname] === "true") {
						this.locale[lang_out].opts[attrname.slice(1)] = true;
					} else {
						this.locale[lang_out].opts[attrname.slice(1)] = false;
					}
				}
			}
		}
	}
	nodes = this.sys.xml.getNodesByName(locale, 'date');
	for (pos = 0, len = this.sys.xml.numberofnodes(nodes); pos < len; pos += 1) {
		if (true) {
			date = nodes[pos];
			this.locale[lang_out].dates[this.sys.xml.getAttributeValue(date, "form")] = date;
		}
	}
};
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
			state.opt.grouped_sort = state.opt.xclass === "in-text" 
				&& state.citation.opt.collapse 
				&& state.citation.opt.collapse.length
				&& state.opt.update_mode !== CSL.POSITION
				&& state.opt.update_mode !== CSL.NUMERIC;
			if (state.opt.grouped_sort 
				&& state.citation_sort.opt.sort_directions.length) {
				var firstkey = state.citation_sort.opt.sort_directions[0].slice();
				state.citation_sort.opt.sort_directions = [firstkey].concat(state.citation_sort.opt.sort_directions);
			}
			state.citation.srt = new CSL.Registry.Comparifier(state, "citation_sort");
			state.build.area = state.build.area_return;
		}
	}
};
CSL.Node.date = {
	build: function (state, target) {
		var func, date_obj, tok, len, pos, part, dpx, parts, mypos, start, end;
		if (this.tokentype === CSL.START || this.tokentype === CSL.SINGLETON) {
			state.build.date_parts = [];
			state.build.date_variables = this.variables;
			if (!state.build.sort_flag) {
				CSL.Util.substituteStart.call(this, state, target);
			}
			func = function (state, Item) {
				var key, dp;
				state.tmp.element_rendered_ok = false;
				state.tmp.donesies = [];
				state.tmp.dateparts = [];
				dp = [];
				if (this.variables.length
					&& !(state.tmp.just_looking
						 && this.variables[0] !== "issued")) {
					state.parallel.StartVariable(this.variables[0]);
					date_obj = Item[this.variables[0]];
					if ("undefined" === typeof date_obj) {
						date_obj = {"date-parts": [[0]] };
					}
					if (date_obj.raw) {
						date_obj = state.fun.dateparser.parse(date_obj.raw);
					}
					state.tmp.date_object = state.dateParseArray(date_obj);
					len = this.dateparts.length;
					for (pos = 0; pos < len; pos += 1) {
						part = this.dateparts[pos];
						if ("undefined" !== typeof state.tmp.date_object[(part +  "_end")]) {
							dp.push(part);
						} else if (part === "month" && "undefined" !== typeof state.tmp.date_object.season_end) {
							dp.push(part);
						}
					}
					dpx = [];
					parts = ["year", "month", "day"];
					len = parts.length;
					for (pos = 0; pos < len; pos += 1) {
						if (dp.indexOf(parts[pos]) > -1) {
							dpx.push(parts[pos]);
						}
					}
					dp = dpx.slice();
					if (state.tmp.area.slice(-5) !== "_sort" && ("" + Item.volume) === "" + state.tmp.date_object.year && this.dateparts.length === 1 && this.dateparts[0] === "year") {
						for (key in state.tmp.date_object) {
							if (state.tmp.date_object.hasOwnProperty(key)) {
								if (key.slice(0, 4) === "year" && state.tmp.citeblob.can_suppress_identical_year) {
									delete state.tmp.date_object[key];
								}
							}
						}
					}
					mypos = 2;
					len = dp.length;
					for (pos = 0; pos < len; pos += 1) {
						part = dp[pos];
						start = state.tmp.date_object[part];
						end = state.tmp.date_object[(part + "_end")];
						if (start !== end) {
							mypos = pos;
							break;
						}
					}
					state.tmp.date_collapse_at = dp.slice(mypos);
				} else {
					state.tmp.date_object = false;
				}
			};
			this.execs.push(func);
			func = function (state, Item) {
				state.output.startTag("date", this);
			};
			this.execs.push(func);
		}
		if (state.build.sort_flag && (this.tokentype === CSL.END || this.tokentype === CSL.SINGLETON)) {
			tok = new CSL.Token("key", CSL.SINGLETON);
			tok.dateparts = state.build.date_parts.slice();
			tok.variables = state.build.date_variables;
			CSL.Node.key.build.call(tok, state, target);
		}
		if (!state.build.sort_flag && (this.tokentype === CSL.END || this.tokentype === CSL.SINGLETON)) {
			func = function (state, Item) {
				state.output.endTag();
				state.parallel.CloseVariable("date");
			};
			this.execs.push(func);
		}
		target.push(this);
		if (this.tokentype === CSL.END || this.tokentype === CSL.SINGLETON) {
			if (!state.build.sort_flag) {
				CSL.Util.substituteEnd.call(this, state, target);
			}
		}
	}
};
CSL.Node["date-part"] = {
	build: function (state, target) {
		var func, pos, len, decor, first_date, value, value_end, real, have_collapsed, invoked, precondition, known_year, bc, ad, bc_end, ad_end, ready, curr, dcurr, number, num, formatter, item;
		if (!this.strings.form) {
			this.strings.form = "long";
		}
		state.build.date_parts.push(this.strings.name);
		func = function (state, Item) {
			if (!state.tmp.date_object) {
				return;
			}
			first_date = true;
			value = "";
			value_end = "";
			state.tmp.donesies.push(this.strings.name);
			if (state.tmp.date_object.literal && "year" === this.strings.name) {
				state.parallel.AppendToVariable(state.tmp.date_object.literal);
				state.output.append(state.tmp.date_object.literal, this);
			}
			if (state.tmp.date_object) {
				value = state.tmp.date_object[this.strings.name];
				value_end = state.tmp.date_object[(this.strings.name + "_end")];
			}
			if ("year" === this.strings.name && value === 0 && !state.tmp.suppress_decorations) {
				value = false;
			}
			real = !state.tmp.suppress_decorations;
			have_collapsed = state.tmp.have_collapsed;
			invoked = state[state.tmp.area].opt.collapse === "year-suffix" || state[state.tmp.area].opt.collapse === "year-suffix-ranged";
			precondition = state.opt["disambiguate-add-year-suffix"];
			if (real && precondition && invoked) {
				state.tmp.years_used.push(value);
				known_year = state.tmp.last_years_used.length >= state.tmp.years_used.length;
				if (known_year && have_collapsed) {
					if (state.tmp.last_years_used[(state.tmp.years_used.length - 1)] === value) {
						value = false;
					}
				}
			}
			if ("undefined" !== typeof value) {
				bc = false;
				ad = false;
				bc_end = false;
				ad_end = false;
				if ("year" === this.strings.name) {
					if (parseInt(value, 10) < 500 && parseInt(value, 10) > 0) {
						ad = state.getTerm("ad");
					}
					if (parseInt(value, 10) < 0) {
						bc = state.getTerm("bc");
						value = (parseInt(value, 10) * -1);
					}
					if (value_end) {
						if (parseInt(value_end, 10) < 500 && parseInt(value_end, 10) > 0) {
							ad_end = state.getTerm("ad");
						}
						if (parseInt(value_end, 10) < 0) {
							bc_end = state.getTerm("bc");
							value_end = (parseInt(value_end, 10) * -1);
						}
					}
				}
				state.parallel.AppendToVariable(value);
				var monthnameid = ""+state.tmp.date_object.month;
				while (monthnameid.length < 2) {
					monthnameid = "0"+monthnameid;
				}
				monthnameid = "month-"+monthnameid;
				var gender = state.opt["noun-genders"][monthnameid];
				if (this.strings.form) {
					value = CSL.Util.Dates[this.strings.name][this.strings.form](state, value, gender);
					if ("month" === this.strings.name) {
						if (state.tmp.strip_periods) {
							value = value.replace(/\./g, "");
						} else {
							for (var i = 0, ilen = this.decorations.length; i < ilen; i += 1) {
								if ("@strip-periods" === this.decorations[i][0] && "true" === this.decorations[i][1]) {
									value = value.replace(/\./g, "");
									break
								}
							}
						}
						if (value_end) {
							value_end = CSL.Util.Dates[this.strings.name][this.strings.form](state, value_end, gender);
							if (state.tmp.strip_periods) {
								value_end = value_end.replace(/\./g, "");
							} else {
								for (var i = 0, ilen = this.decorations.length; i < ilen; i += 1) {
									if ("@strip-periods" === this.decorations[i][0] && "true" === this.decorations[i][1]) {
										value_end = value_end.replace(/\./g, "");
										break
									}
								}
							}
						}
					}
				}
				state.output.openLevel("empty");
				if (state.tmp.date_collapse_at.length) {
					ready = true;
					len = state.tmp.date_collapse_at.length;
					for (pos = 0; pos < len; pos += 1) {
						item = state.tmp.date_collapse_at[pos];
						if (state.tmp.donesies.indexOf(item) === -1) {
							ready = false;
							break;
						}
					}
					if (ready) {
						if ("" + value_end !== "0") {
							if (state.dateput.queue.length === 0) {
								first_date = true;
							}
							state.dateput.append(value_end, this);
							if (first_date) {
								state.dateput.current.value()[0].strings.prefix = "";
							}
						}
						state.output.append(value, this);
						curr = state.output.current.value();
						curr.blobs[(curr.blobs.length - 1)].strings.suffix = "";
						state.output.append(this.strings["range-delimiter"], "empty");
						dcurr = state.dateput.current.value();
						curr.blobs = curr.blobs.concat(dcurr);
						state.dateput.string(state, state.dateput.queue);
						state.tmp.date_collapse_at = [];
					} else {
						state.output.append(value, this);
						if (state.tmp.date_collapse_at.indexOf(this.strings.name) > -1) {
							if ("" + value_end !== "0") {
								if (state.dateput.queue.length === 0) {
									first_date = true;
								}
								state.dateput.openLevel("empty");
								state.dateput.append(value_end, this);
								if (first_date) {
									state.dateput.current.value().blobs[0].strings.prefix = "";
								}
								if (bc) {
									state.dateput.append(bc);
								}
								if (ad) {
									state.dateput.append(ad);
								}
								state.dateput.closeLevel();
							}
						}
					}
				} else {
					state.output.append(value, this);
				}
				if (bc) {
					state.output.append(bc);
				}
				if (ad) {
					state.output.append(ad);
				}
				state.output.closeLevel();
			} else if ("month" === this.strings.name) {
				if (state.tmp.date_object.season) {
					value = "" + state.tmp.date_object.season;
					if (value && value.match(/^[1-4]$/)) {
						state.tmp.term_sibling.replace([false, false, true]);
						state.output.append(state.getTerm(("season-0" + value)), this);
					} else if (value) {
						state.output.append(value, this);
					}
				}
			}
			state.tmp.value = [];
			if ((value || state.tmp.have_collapsed) && !state.opt.has_year_suffix && "year" === this.strings.name && !state.tmp.just_looking) {
				if (state.registry.registry[Item.id] && state.registry.registry[Item.id].disambig.year_suffix !== false && !state.tmp.has_done_year_suffix) {
					state.tmp.has_done_year_suffix = true;
					num = parseInt(state.registry.registry[Item.id].disambig.year_suffix, 10);
					number = new CSL.NumericBlob(num, this);
					this.successor_prefix = state[state.build.area].opt.layout_delimiter;
					this.splice_prefix = state[state.build.area].opt.layout_delimiter;
					formatter = new CSL.Util.Suffixator(CSL.SUFFIX_CHARS);
					number.setFormatter(formatter);
					if (state[state.tmp.area].opt.collapse === "year-suffix-ranged") {
						number.range_prefix = state.getTerm("range-delimiter");
					}
					if (state[state.tmp.area].opt["year-suffix-delimiter"]) {
						number.successor_prefix = state[state.tmp.area].opt["year-suffix-delimiter"];
					} else {
						number.successor_prefix = state[state.tmp.area].opt.layout_delimiter;
					}
					state.output.append(number, "literal");
				}
			}
		};
		this.execs.push(func);
		if ("undefined" === typeof this.strings["range-delimiter"]) {
			this.strings["range-delimiter"] = "\u2013";
		}
		target.push(this);
	}
};
CSL.Node["else-if"] = {
	build: function (state, target) {
		var func, tryposition;
		if (this.tokentype === CSL.START || this.tokentype === CSL.SINGLETON) {
			if (this.locale) {
				state.opt.lang = this.locale;
			}
		    if (! this.evaluator) {
				this.evaluator = state.fun.match.any;
		    }
		}
		if (this.tokentype === CSL.END || this.tokentype === CSL.SINGLETON) {
			func = function (state, Item) {
				if (this.locale_default) {
					state.output.current.value().old_locale = this.locale_default;
					state.output.closeLevel("empty");
					state.opt.lang = this.locale_default;
				}
				var next = this[state.tmp.jump.value()];
				return next;
			};
			this.execs.push(func);
			if (this.locale_default) {
				state.opt.lang = this.locale_default;
			}
		}
		target.push(this);
	},
	configure: function (state, pos) {
		if (this.tokentype === CSL.START) {
			this.fail = state.configure.fail.slice(-1)[0];
			this.succeed = this.next;
			state.configure.fail[(state.configure.fail.length - 1)] = pos;
		} else if (this.tokentype === CSL.SINGLETON) {
			this.fail = this.next;
			this.succeed = state.configure.succeed.slice(-1)[0];
			state.configure.fail[(state.configure.fail.length - 1)] = pos;
		} else {
			this.succeed = state.configure.succeed.slice(-1)[0];
			this.fail = this.next;
		}
	}
};
CSL.Node["else"] = {
	build: function (state, target) {
		target.push(this);
	},
	configure: function (state, pos) {
		if (this.tokentype === CSL.START) {
			state.configure.fail[(state.configure.fail.length - 1)] = pos;
		}
	}
};
CSL.Node["#comment"] = {
       build: function (state, target) {
       }
};
CSL.Node["et-al"] = {
	build: function (state, target) {
		if (state.build.area === "citation" || state.build.area === "bibliography") {
			state.build.etal_node = this;
			if ("string" === typeof this.strings.term) {
				state.build.etal_term = this.strings.term;
			}
		}
	}
};
CSL.Node.group = {
	build: function (state, target) {
		var func, execs;
		if (this.tokentype === CSL.START) {
			CSL.Util.substituteStart.call(this, state, target);
			if (state.build.substitute_level.value()) {
				state.build.substitute_level.replace((state.build.substitute_level.value() + 1));
			}
			func = function (state, Item) {
				state.tmp.term_sibling.push([false, false, false], CSL.LITERAL);
			};
			this.execs.push(func);
			func = function (state, Item) {
				state.output.startTag("group", this);
			};
			execs = [];
			execs.push(func);
			this.execs = execs.concat(this.execs);
			if (this.strings["has-publisher-and-publisher-place"]) {
				state.build["publisher-special"] = true;
				var outer_area = state.build.area.replace(/_sort$/, "");
				if ("string" === typeof state[outer_area].opt["name-delimiter"]) {
					func = function (state, Item) {
						if (Item["publisher"] && Item["publisher-place"]) {
							var publisher_lst = Item["publisher"].split(/;\s*/);
							var publisher_place_lst = Item["publisher-place"].split(/;\s*/);
							if (publisher_lst.length > 1
								&& publisher_lst.length === publisher_place_lst.length) {
								state.publisherOutput = new CSL.PublisherOutput(state);
								state.publisherOutput["publisher-list"] = publisher_lst;
								state.publisherOutput["publisher-place-list"] = publisher_place_lst;
								state.publisherOutput.group_tok = this;
							}
						}
					}
					this.execs.push(func);
				}
			}
		} else {
			if (state.build["publisher-special"]) {
				state.build["publisher-special"] = false;
				var outer_area = state.build.area.replace(/_sort$/, "");
				if ("string" === typeof state[outer_area].opt["name-delimiter"]) {
					func = function (state, Item) {
						if (state.publisherOutput) {
							var outer_area = state.tmp.area.replace("_sort", "");
							state.publisherOutput.name_delimiter = state[outer_area].opt["name-delimiter"];
							state.publisherOutput.delimiter_precedes_last = state[outer_area].opt["delimiter-precedes-last"];
							state.publisherOutput.and = state[outer_area].opt["and"];
							state.publisherOutput.render();
							state.publisherOutput = false;
						}
					};
					this.execs.push(func);
				}
			}
			func = function (state, Item) {
				var flag = state.tmp.term_sibling.value();
				state.output.endTag();
				if (!flag[2] && (flag[1] || (!flag[1] && !flag[0]))) {
					if (state.output.current.value().blobs) {
						state.output.current.value().blobs.pop();
					}
				}
				state.tmp.term_sibling.pop();
				if ((flag[2] || (!flag[1] && flag[0])) && state.tmp.term_sibling.mystack.length > 1) {
					state.tmp.term_sibling.replace([false, false, true]);
				}
			};
			this.execs.push(func);
		}
		target.push(this);
		if (this.tokentype === CSL.END) {
			if (state.build.substitute_level.value()) {
				state.build.substitute_level.replace((state.build.substitute_level.value() - 1));
			}
			CSL.Util.substituteEnd.call(this, state, target);
		}
	}
};
CSL.Node["if"] = {
	build: function (state, target) {
		var func;
		if (this.tokentype === CSL.START || this.tokentype === CSL.SINGLETON) {
			if (this.locale) {
				state.opt.lang = this.locale;
			}
		    if (!this.evaluator) {
				this.evaluator = state.fun.match.any;
		    }
		}
		if (this.tokentype === CSL.END || this.tokentype === CSL.SINGLETON) {
			func = function (state, Item) {
				if (this.locale_default) {
					state.output.current.value().old_locale = this.locale_default;
					state.output.closeLevel("empty");
					state.opt.lang = this.locale_default;
				}
				var next = this[state.tmp.jump.value()];
				return next;
			};
			this.execs.push(func);
			if (this.locale_default) {
				state.opt.lang = this.locale_default;
			}
		}
		target.push(this);
	},
	configure: function (state, pos) {
		if (this.tokentype === CSL.START) {
			this.fail = state.configure.fail.slice(-1)[0];
			this.succeed = this.next;
		} else if (this.tokentype === CSL.SINGLETON) {
			this.fail = this.next;
			this.succeed = state.configure.succeed.slice(-1)[0];
		} else {
			this.succeed = state.configure.succeed.slice(-1)[0];
			this.fail = this.next;
		}
	}
};
CSL.Node.info = {
	build: function (state, target) {
		if (this.tokentype === CSL.START) {
			state.build.skip = "info";
		} else {
			state.build.skip = false;
		}
	}
};
CSL.Node.institution = {
	build: function (state, target) {
		if ([CSL.SINGLETON, CSL.START].indexOf(this.tokentype) > -1) {
			if ("string" === typeof state.build.name_delimiter) {
				this.strings.delimiter = state.build.name_delimiter;
			}
			var func = function (state, Item) {
				var myand, and_default_prefix, and_suffix;
				if ("text" === this.strings.and) {
					myand = state.getTerm("and", "long", 0);
				} else if ("symbol" === this.strings.and) {
					myand = "&";
				}
				if (state.nameOutput.name.and_term) {
					myand = state.getTerm("and", "long", 0);
				}
				if (CSL.STARTSWITH_ROMANESQUE_REGEXP.test(myand)) {
					and_default_prefix = " ";
					and_suffix = " ";
				} else {
					and_default_prefix = "";
					and_suffix = "";
				}
				this.and = {};
				this.and.single = new CSL.Blob("empty", myand);
				this.and.single.strings.suffix = and_suffix;
				this.and.multiple = new CSL.Blob("empty", myand);
				this.and.multiple.strings.suffix = and_suffix;
				if (this.strings["delimiter-precedes-last"] === "always") {
					this.and.single.strings.prefix = this.strings.delimiter;
					this.and.multiple.strings.prefix = this.strings.delimiter;
				} else if (this.strings["delimiter-precedes-last"] === "contextual") {
					this.and.single.strings.prefix = and_default_prefix;
					this.and.multiple.strings.prefix = this.strings.delimiter;
				} else {
					this.and.single.strings.prefix = and_default_prefix;
					this.and.multiple.strings.prefix = and_default_prefix;
				}
				state.nameOutput.institution = this;
			};
			this.execs.push(func);
		}
		target.push(this);
	},
	configure: function (state, pos) {
		if ([CSL.SINGLETON, CSL.START].indexOf(this.tokentype) > -1) {
			state.build.has_institution = true;
		}
	}
};
CSL.Node["institution-part"] = {
	build: function (state, target) {
		var func;
		if ("long" === this.strings.name) {
			if (this.strings["if-short"]) {
				func = function (state, Item) {
					state.nameOutput.institutionpart["long-with-short"] = this;
				};
			} else {
				func = function (state, Item) {
					state.nameOutput.institutionpart["long"] = this;
				};
			}
		} else if ("short" === this.strings.name) {
			func = function (state, Item) {
				state.nameOutput.institutionpart["short"] = this;
			};
		}
		this.execs.push(func);
		target.push(this);
	}
};
CSL.Node.key = {
	build: function (state, target) {
		var func, i, ilen;
		var debug = false;
		var start_key = new CSL.Token("key", CSL.START);
		start_key.strings["et-al-min"] = this.strings["et-al-min"];
		start_key.strings["et-al-use-first"] = this.strings["et-al-use-first"];
		start_key.strings["et-al-use-last"] = this.strings["et-al-use-last"];
		func = function (state, Item) {
			state.tmp.done_vars = [];
		};
		start_key.execs.push(func);
		func = function (state, Item) {
			state.output.openLevel("empty");
		};
		start_key.execs.push(func);
		var sort_direction = [];
		if (this.strings.sort_direction === CSL.DESCENDING) {
			sort_direction.push(1);
			sort_direction.push(-1);
		} else {
			sort_direction.push(-1);
			sort_direction.push(1);
		}
		state[state.build.area].opt.sort_directions.push(sort_direction);
		func = function (state, Item) {
			state.tmp.sort_key_flag = true;
			if (this.strings["et-al-min"]) {
				state.tmp["et-al-min"] = this.strings["et-al-min"];
			}
			if (this.strings["et-al-use-first"]) {
				state.tmp["et-al-use-first"] = this.strings["et-al-use-first"];
			}
			if ("boolean" === typeof this.strings["et-al-use-last"]) {
				state.tmp["et-al-use-last"] = this.strings["et-al-use-last"];
			}
		};
		start_key.execs.push(func);
		target.push(start_key);
		if (this.variables.length) {
			var variable = this.variables[0];
			if (variable === "citation-number" && state.build.area === "citation_sort") {
				state.opt.citation_number_sort = true;
			}
			if (CSL.CREATORS.indexOf(variable) > -1) {
				var names_start_token = new CSL.Token("names", CSL.START);
				names_start_token.tokentype = CSL.START;
				names_start_token.variables = this.variables;
				CSL.Node.names.build.call(names_start_token, state, target);
				var name_token = new CSL.Token("name", CSL.SINGLETON);
				name_token.tokentype = CSL.SINGLETON;
				name_token.strings["name-as-sort-order"] = "all";
				name_token.strings["sort-separator"] = " ";
				name_token.strings["et-al-use-last"] = this.strings["et-al-use-last"];
				name_token.strings["et-al-min"] = this.strings["et-al-min"];
				name_token.strings["et-al-use-first"] = this.strings["et-al-use-first"];
				CSL.Node.name.build.call(name_token, state, target);
				var institution_token = new CSL.Token("institution", CSL.SINGLETON);
				institution_token.tokentype = CSL.SINGLETON;
				CSL.Node.institution.build.call(institution_token, state, target);
				var names_end_token = new CSL.Token("names", CSL.END);
				names_end_token.tokentype = CSL.END;
				CSL.Node.names.build.call(names_end_token, state, target);
			} else {
				var single_text = new CSL.Token("text", CSL.SINGLETON);
				single_text.dateparts = this.dateparts;
				if (CSL.NUMERIC_VARIABLES.indexOf(variable) > -1) {
					func = function (state, Item) {
						var num, m;
						num = false;
						if ("citation-number" === variable) {
							num = state.registry.registry[Item.id].seq.toString();
						} else {
							num = Item[variable];
						}
						if (num) {
							num = CSL.Util.padding(num);
						}
						state.output.append(num, this);
					};
				} else if (variable === "citation-label") {
					func = function (state, Item) {
						var trigraph = state.getCitationLabel(Item);
						state.output.append(trigraph, this);
					};
				} else if (CSL.DATE_VARIABLES.indexOf(variable) > -1) {
					func = function (state, Item) {
						var dp, elem, value, e, yr, prefix, i, ilen, num;
						dp = Item[variable];
						if ("undefined" === typeof dp) {
							dp = {"date-parts": [[0]] };
							if (!dp.year) {
								state.tmp.empty_date = true;
							}
						}
						if ("undefined" === typeof this.dateparts) {
							this.dateparts = ["year", "month", "day"];
						}
						if (dp.raw) {
							dp = state.fun.dateparser.parse(dp.raw);
						} else if (dp["date-parts"]) {
							dp = state.dateParseArray(dp);
						}
						if ("undefined" === typeof dp) {
							dp = {};
						}
						for (i = 0, ilen = CSL.DATE_PARTS_INTERNAL.length; i < ilen; i += 1) {
							elem = CSL.DATE_PARTS_INTERNAL[i];
							value = 0;
							e = elem;
							if (e.slice(-4) === "_end") {
								e = e.slice(0, -4);
							}
							if (dp[elem] && this.dateparts.indexOf(e) > -1) {
								value = dp[elem];
							}
							if (elem.slice(0, 4) === "year") {
								yr = CSL.Util.Dates[e].numeric(state, value);
								prefix = "Y";
								if (yr[0] === "-") {
									prefix = "X";
									yr = yr.slice(1);
									yr = 9999 - parseInt(yr, 10);
								}
								state.output.append(CSL.Util.Dates[elem.slice(0, 4)].numeric(state, (prefix + yr)));
							} else {
								state.output.append(CSL.Util.Dates[e]["numeric-leading-zeros"](state, value));
							}
						}
						if (state.registry.registry[Item.id] && state.registry.registry[Item.id].disambig.year_suffix) {
							num = state.registry.registry[Item.id].disambig.year_suffix.toString();
							num = CSL.Util.padding(num);
						} else {
							num = CSL.Util.padding("0");
						}
						state.output.append("S"+num);
					};
				} else if ("title" === variable) {
					state.transform.init("empty", "title");
					state.transform.setTransformLocale("locale-sort");
					state.transform.setTransformFallback(true);
					func = state.transform.getOutputFunction(this.variables);
				} else {
					func = function (state, Item) {
						var varval = Item[variable];
						state.output.append(varval, "empty");
					};
				}
				single_text.execs.push(func);
				target.push(single_text);
			}
		} else { // macro
			var token = new CSL.Token("text", CSL.SINGLETON);
			token.postponed_macro = this.postponed_macro;
			var tlen = target.length;
			var keypos = false;
			CSL.expandMacro.call(state, token);
			for (i = 0, ilen = target.slice(tlen).length; i < ilen; i += 1) {
				var tok = target.slice(tlen)[i];
				if (tok && tok.name === "text" && tok.dateparts) {
					keypos = i;
					break;
				}
			}
			if (keypos) {
				var saveme = target[(parseInt(keypos, 10) + parseInt(tlen, 10))];
				for (i = (target.length - 1); i > tlen; i += -1) {
					target.pop();
				}
				target.push(saveme);
				var gtok = new CSL.Token("group", CSL.END);
				target.push(gtok);
			}
		}
		var end_key = new CSL.Token("key", CSL.END);
		func = function (state, Item) {
			var keystring = state.output.string(state, state.output.queue);
			if ("" === keystring) {
				keystring = undefined;
			}
			if ("string" !== typeof keystring || state.tmp.empty_date) {
				keystring = undefined;
				state.tmp.empty_date = false;
			}
			state[state.tmp.area].keys.push(keystring);
			state.tmp.value = [];
		};
		end_key.execs.push(func);
		func = function (state, Item) {
			state.tmp["et-al-min"] = undefined;
			state.tmp["et-al-use-first"] = undefined;
			state.tmp["et-al-use-last"] = undefined;
			state.tmp.sort_key_flag = false;
		};
		end_key.execs.push(func);
		target.push(end_key);
	}
};
CSL.Node.label = {
	build: function (state, target) {
		var debug = false;
		if (this.strings.term) {
			var plural = false;
			if (!this.strings.form) {
				this.strings.form = "long";
			}
			var func = function (state, Item, item) {
				var termtxt = CSL.evaluateLabel(this, state, Item, item);
				state.output.append(termtxt, this);
			};
			this.execs.push(func);
		} else {
			if (!state.build.name_label) {
				state.build.name_label = {};
			}
			if (!state.build.name_flag) {
				state.build.name_label.before = this;
			} else {
				state.build.name_label.after = this;
			}
		}
		target.push(this);
	}
};
CSL.Node.layout = {
	build: function (state, target) {
		var func, prefix_token, suffix_token, tok;
		if (this.tokentype === CSL.START && !state.tmp.cite_affixes) {
			func = function (state, Item) {
				state.tmp.done_vars = [];
				state.tmp.rendered_name = false;
			};
			this.execs.push(func);
			func = function (state, Item) {
				state.tmp.sort_key_flag = false;
			};
			this.execs.push(func);
			func = function (state, Item) {
				state.tmp.nameset_counter = 0;
			};
			this.execs.push(func);
			func = function (state, Item) {
				state.output.openLevel("empty");
				state.tmp.citeblob = state.output.queue[state.output.queue.length - 1];
			};
			this.execs.push(func);
			target.push(this);
			if (state.build.area === "citation") {
				prefix_token = new CSL.Token("text", CSL.SINGLETON);
				func = function (state, Item, item) {
					var sp;
					if (item && item.prefix) {
						sp = "";
						if (item.prefix.match(CSL.ENDSWITH_ROMANESQUE_REGEXP)) {
							sp = " ";
						}
						state.output.append((item.prefix + sp), this);
					}
				};
				prefix_token.execs.push(func);
				target.push(prefix_token);
			}
		}
		var my_tok;
		if (this.locale_raw) {
			my_tok = new CSL.Token("dummy", CSL.START);
			my_tok.locale = this.locale_raw;
			my_tok.strings.delimiter = this.strings.delimiter;
			my_tok.strings.suffix = this.strings.suffix;
			if (!state.tmp.cite_affixes) {
				state.tmp.cite_affixes = {};
			}
		}
		if (this.tokentype === CSL.START) {
			state.build.layout_flag = true;
			if (!this.locale_raw) {
				state[state.tmp.area].opt.topdecor = [this.decorations];
				state[(state.tmp.area + "_sort")].opt.topdecor = [this.decorations];
				state[state.build.area].opt.layout_prefix = this.strings.prefix;
				state[state.build.area].opt.layout_suffix = this.strings.suffix;
				state[state.build.area].opt.layout_delimiter = this.strings.delimiter;
				state[state.build.area].opt.layout_decorations = this.decorations;
				if (state.tmp.cite_affixes) {
					tok = new CSL.Token("else", CSL.START);
					CSL.Node["else"].build.call(tok, state, target);
				}
			} // !this.locale_raw
			if (this.locale_raw) {
				if (!state.build.layout_locale_flag) {
					var choose_tok = new CSL.Token("choose", CSL.START);
					CSL.Node.choose.build.call(choose_tok, state, target);
					my_tok.name = "if";
					CSL.Attributes["@locale"].call(my_tok, state, this.locale_raw);
					CSL.Node["if"].build.call(my_tok, state, target);
				} else {
					my_tok.name = "else-if";
					CSL.Attributes["@locale"].call(my_tok, state, this.locale_raw);
					CSL.Node["else-if"].build.call(my_tok, state, target);
				}
				state.tmp.cite_affixes[my_tok.locale] = {};
				state.tmp.cite_affixes[my_tok.locale].delimiter = this.strings.delimiter;
				state.tmp.cite_affixes[my_tok.locale].suffix = this.strings.suffix;
			}
		}
		if (this.tokentype === CSL.END) {
			if (this.locale_raw) {
				if (!state.build.layout_locale_flag) {
					my_tok.name = "if";
					my_tok.tokentype = CSL.END;
					CSL.Attributes["@locale"].call(my_tok, state, this.locale_raw);
					CSL.Node["if"].build.call(my_tok, state, target);
					state.build.layout_locale_flag = true;
				} else {
					my_tok.name = "else-if";
					my_tok.tokentype = CSL.END;
					CSL.Attributes["@locale"].call(my_tok, state, this.locale_raw);
					CSL.Node["else-if"].build.call(my_tok, state, target);
				}
			}
			if (!this.locale_raw) {
				if (state.tmp.cite_affixes) {
					tok = new CSL.Token("else", CSL.END);
					CSL.Node["else"].build.call(tok, state, target);
					tok = new CSL.Token("choose", CSL.END);
					CSL.Node.choose.build.call(tok, state, target);
				}
				state.build_layout_locale_flag = true;
				if (state.build.area === "citation") {
					suffix_token = new CSL.Token("text", CSL.SINGLETON);
					func = function (state, Item, item) {
						var sp;
						if (item && item.suffix) {
							sp = "";
							if (item.suffix.match(CSL.STARTSWITH_ROMANESQUE_REGEXP)) {
								sp = " ";
							}
							state.output.append((sp + item.suffix), this);
						}
					};
					suffix_token.execs.push(func);
					target.push(suffix_token);
				}
				func = function (state, Item) {
					if (state.tmp.area === "bibliography") {
						if (state.bibliography.opt["second-field-align"]) {
							state.output.endTag();
						}
					}
					state.output.closeLevel();
				};
				this.execs.push(func);
				target.push(this);
				state.build.layout_flag = false;
				state.build.layout_locale_flag = false;
			} // !this.layout_raw
		}
	}
};
CSL.Node.macro = {
	build: function (state, target) {}
};
CSL.NameOutput = function(state, Item, item, variables) {
	this.debug = false;
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
	this.institutionpart = {};
};
CSL.NameOutput.prototype.reinit = function (names) {
	if (!this._hasValues()) {
		this.nameset_offset = 0;
		this.variables = names.variables;
	}
};
CSL.NameOutput.prototype._hasValues = function () {
	for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		var v = this.variables[i];
		if (this.Item[v]) {
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
		for (var i = 0, ilen = this.given.execs.length; i < ilen; i += 1) {
			this.given.execs[i].call(this.given_decor, this.state, this.Item);
		}
	} else {
		this.given_decor = false;
	}
	this.getEtAlConfig();
	this.divideAndTransliterateNames();
	this.truncatePersonalNameLists();
	this.constrainNames();
	if (this.name.strings.form === "count") {
		this.state.output.append(this.names_count, "empty");
		return;
	}
	this.disambigNames();
	this.setEtAlParameters();
	this.setCommonTerm();
	this.renderAllNames();
	var blob_list = [];
	for (i = 0, ilen = variables.length; i < ilen; i += 1) {
		var v = variables[i];
		var institution_sets = [];
		var institutions = false;
		for (var j = 0, jlen = this.institutions[v].length; j < jlen; j += 1) {
			institution_sets.push(this.joinPersonsAndInstitutions([this.persons[v][j], this.institutions[v][j]]));
		}
		if (this.institutions[v].length) {
			var pos = this.nameset_base + this.variable_offset[v];
			if (this.freeters[v].length) {
				pos += 1;
			}
			institutions = this.joinInstitutionSets(institution_sets, pos);
		}
		var varblob = this.joinFreetersAndInstitutionSets([this.freeters[v], institutions]);
		if (varblob) {
			varblob = this._applyLabels(varblob, v);
			blob_list.push(varblob);
		}
		if (this.common_term) {
			break;
		}
	}
	this.state.output.openLevel("empty");
	this.state.output.current.value().strings.delimiter = this.names.strings.delimiter;
	for (i = 0, ilen = blob_list.length; i < ilen; i += 1) {
		this.state.output.append(blob_list[i], "literal", true);
	}
	this.state.output.closeLevel("empty");
	var blob = this.state.output.pop();
	this.state.output.append(blob, this.names);
	this.state.tmp.name_node = this.state.output.current.value();
	this._collapseAuthor();
	this.variables = [];
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
	if ((this.item && this.item["suppress-author"] && this._author_is_first)
		|| (this.state[this.state.tmp.area].opt.collapse 
			&& this.state[this.state.tmp.area].opt.collapse.length)) {
		if (this.state.tmp.authorstring_request) {
			mystr = "";
			myqueue = this.state.tmp.name_node.blobs.slice(-1)[0].blobs;
			oldchars = this.state.tmp.offset_characters;
			if (myqueue) {
				mystr = this.state.output.string(this.state, myqueue, false);
			}
			this.state.tmp.offset_characters = oldchars;
			this.state.registry.authorstrings[this.Item.id] = mystr;
		} else if (!this.state.tmp.just_looking
			&& !this.state.tmp.suppress_decorations) {
			mystr = "";
			myqueue = this.state.tmp.name_node.blobs.slice(-1)[0].blobs;
			oldchars = this.state.tmp.offset_characters;
			if (myqueue) {
				mystr = this.state.output.string(this.state, myqueue, false);
			}
			if (mystr === this.state.tmp.last_primary_names_string) {
				this.state.tmp.name_node.blobs.pop();
				this.state.tmp.offset_characters = oldchars;
			} else {
				this.state.tmp.last_primary_names_string = mystr;
				if (this.variables.indexOf("author") > -1 && this.item && this.item["suppress-author"]) {
					this.state.tmp.name_node.blobs.pop();
					this.state.tmp.offset_characters = oldchars;
				}
				this.state.tmp.have_collapsed = false;
			}
		}
	}
};
CSL.NameOutput.prototype.isPerson = function (value) {
	if (value.literal
		|| (!value.given && value.family && value.isInstitution)) {
		return false;
	} else {
		return true;
	}
};
CSL.NameOutput.prototype.truncatePersonalNameLists = function () {
	var v, i, ilen, j, jlen, chopvar, values;
	this.freeters_count = {};
	this.persons_count = {};
	this.institutions_count = {};
	for (v in this.freeters) {
		if (this.freeters.hasOwnProperty(v)) {
			this.freeters_count[v] = this.freeters[v].length;
			this.freeters[v] = this._truncateNameList(this.freeters, v);
		}
	}
	for (v in this.persons) {
		if (this.persons.hasOwnProperty(v)) {
			this.institutions_count[v] = this.institutions[v].length;
			this._truncateNameList(this.institutions, v);
			this.persons[v] = this.persons[v].slice(0, this.institutions[v].length);
			this.persons_count[v] = [];
			for (j = 0, jlen = this.persons[v].length; j < jlen; j += 1) {
				this.persons_count[v][j] = this.persons[v][j].length;
				this.persons[v][j] = this._truncateNameList(this.persons, v, j);
			}
		}
	}
	if (this.etal_min === 1 && this.etal_use_first === 1 
		&& !(this.state.tmp.area === "bibliography_sort" 
			 || this.state.tmp.area === "citation_sort" 
			 || this.state.tmp.just_looking)) {
		chopvar = v;
	} else {
		chopvar = false;
	}
	if (chopvar || this._please_chop) {
		for (i = 0, ilen = this.variables.length; i < ilen; i += 1) {
			v = this.variables[i];
			if (this.freeters[v].length) {
				if (this._please_chop === v) {
					this.freeters[v] = this.freeters[v].slice(1);
					this.freeters_count[v] += -1;
					this._please_chop = false;
				} else if (chopvar && !this._please_chop) {
					this.freeters[v] = this.freeters[v].slice(0, 1);
					this.freeters_count[v] = 1;
					this.institutions[v] = [];
					this.persons[v] = [];
					this._please_chop = chopvar;
				}
			}
			for (i = 0, ilen = this.persons[v].length; i < ilen; i += 1) {
				if (this.persons[v][i].length) {
					if (this._please_chop === v) {
						this.persons[v][i] = this.persons[v][i].slice(1);
						this.persons_count[v][i] += -1;
						this._please_chop = false;
						break;
					} else if (chopvar && !this._please_chop) {
						this.freeters[v] = this.persons[v][i].slice(0, 1);
						this.freeters_count[v] = 1;
						this.institutions[v] = [];
						this.persons[v] = [];
						values = [];
						this._please_chop = chopvar;
						break;
					}
				}
			}
			if (this.institutions[v].length) {
				if (this._please_chop === v) {
					this.institutions[v] = this.institutions[v].slice(1);
					this.institutions_count[v] += -1;
					this._please_chop = false;
				} else if (chopvar && !this._please_chop) {
					this.institutions[v] = this.institutions[v].slice(0, 1);
					this.institutions_count[v] = 1;
					values = [];
					this._please_chop = chopvar;
				}
			}
		}
	}
	for (i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		if (this.institutions[v].length) {
			this.nameset_offset += 1;
		}
		for (i = 0, ilen = this.persons[v].length; i < ilen; i += 1) {
			if (this.persons[v][i].length) {
				this.nameset_offset += 1;
			}
			this.institutions[v][i] = this._splitInstitution(this.institutions[v][i], v, i);
		}
	}
};
CSL.NameOutput.prototype._truncateNameList = function (container, variable, index) {
	var lst;
	if ("undefined" === typeof index) {
		lst = container[variable];
	} else {
		lst = container[variable][index];
	}
	if (this.state.opt.max_number_of_names 
		&& lst.length > 50 
		&& lst.length > (this.state.opt.max_number_of_names + 2)) {
		lst = lst.slice(0, this.state.opt.max_number_of_names + 2);
	}
	return lst;
};
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
CSL.NameOutput.prototype.joinPersons = function (blobs, pos) {
	var ret;
	if (this.etal_spec[pos] === 1) {
		ret = this._joinEtAl(blobs, "name");
	} else if (this.etal_spec[pos] === 2) {
		ret = this._joinEllipsis(blobs, "name");
	} else {
		ret = this._joinAnd(blobs, "name");
	}
	return ret;
};
CSL.NameOutput.prototype.joinInstitutionSets = function (blobs, pos) {
	var ret;
	if (this.etal_spec[pos] === 1) {
		ret = this._joinEtAl(blobs, "institution");
	} else if (this.etal_spec[pos] === 2) {
		ret = this._joinEllipsis(blobs, "institution");
	} else {
		ret = this._joinAnd(blobs, "institution");
	}
	return ret;
};
CSL.NameOutput.prototype.joinPersonsAndInstitutions = function (blobs) {
	return this._join(blobs, this.name.strings.delimiter);
};
CSL.NameOutput.prototype.joinFreetersAndInstitutionSets = function (blobs) {
	var ret = this._join(blobs, "[never here]", this["with"].single, this["with"].multiple);
	return ret;
};
CSL.NameOutput.prototype._joinEtAl = function (blobs, tokenname) {
    var blob = this._join(blobs, this.name.strings.delimiter);
	this.state.output.openLevel(this._getToken(tokenname));
	this.state.output.current.value().strings.delimiter = "";
	this.state.output.append(blob, "literal", true);
	if (blobs.length > 1) {
		this.state.output.append(this["et-al"].multiple, "literal", true);
	} else if (blobs.length === 1) {
		this.state.output.append(this["et-al"].single, "literal", true);
	}
	this.state.output.closeLevel();
	return this.state.output.pop();
};
CSL.NameOutput.prototype._joinEllipsis = function (blobs, tokenname) {
	return this._join(blobs, this.name.strings.delimiter, this.name.ellipsis.single, this.name.ellipsis.multiple, tokenname);
};
CSL.NameOutput.prototype._joinAnd = function (blobs, tokenname) {
	return this._join(blobs, this[tokenname].strings.delimiter, this[tokenname].and.single, this[tokenname].and.multiple, tokenname);
};
CSL.NameOutput.prototype._join = function (blobs, delimiter, single, multiple, tokenname) {
	var i, ilen;
	if (!blobs) {
		return false;
	}
	for (i = blobs.length - 1; i > -1; i += -1) {
		if (!blobs[i] || blobs[i].length === 0 || !blobs[i].blobs.length) {
			blobs = blobs.slice(0, i).concat(blobs.slice(i + 1));
		}
	}
	if (!blobs.length) {
		return false;
	} else if (single && blobs.length === 2) {
		blobs = [blobs[0], single, blobs[1]];
	} else {
		var delimiter_offset;
		if (multiple) {
			delimiter_offset = 2;
		} else {
			delimiter_offset = 1;
		}
		for (i = 0, ilen = blobs.length - delimiter_offset; i < ilen; i += 1) {
			blobs[i].strings.suffix += delimiter;
		}
		if (blobs.length > 1) {
			var blob = blobs.pop();
			if (multiple) {
				blobs.push(multiple);
			} else {
				blobs.push(single);
			}
			blobs.push(blob);
		}
	}
	this.state.output.openLevel(this._getToken(tokenname));
	if (single && multiple) {
		this.state.output.current.value().strings.delimiter = "";
	}
	for (i = 0, ilen = blobs.length; i < ilen; i += 1) {
		this.state.output.append(blobs[i], false, true);
	}
	this.state.output.closeLevel();
	return this.state.output.pop();
};
CSL.NameOutput.prototype._getToken = function (tokenname) {
	var token = this[tokenname];
	if (tokenname === "institution") {
		var newtoken = new CSL.Token();
		return newtoken;
	}
	return token;
};
CSL.NameOutput.prototype.disambigNames = function () {
	var pos = this.nameset_base;
	for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		var v = this.variables[i];
		if (this.freeters[v].length) {
			this._runDisambigNames(this.freeters[v], pos);
			this.state.tmp.disambig_settings.givens.push([]);
			pos += 1;
		}
		if (this.institutions[v].length) {
			this.state.tmp.disambig_settings.givens.push([]);
			pos += 1;
		}
		for (var j = 0, jlen = this.persons[v].length; j < jlen; j += 1) {
			if (this.persons[v][j].length) {
				this._runDisambigNames(this.persons[v][j], pos);
				this.state.tmp.disambig_settings.givens.push([]);
				pos += 1;
			}
		}
	}
};
CSL.NameOutput.prototype._runDisambigNames = function (lst, pos) {
	var chk, myform, myinitials, param, i, ilen, paramx;
	for (i = 0, ilen = lst.length; i < ilen; i += 1) {
		this.state.registry.namereg.addname("" + this.Item.id, lst[i], i);
		chk = this.state.tmp.disambig_settings.givens[pos];
		if ("undefined" === typeof chk) {
			this.state.tmp.disambig_settings.givens.push([]);
		}
		chk = this.state.tmp.disambig_settings.givens[pos][i];
		if ("undefined" === typeof chk) {
			myform = this.name.strings.form;
			myinitials = this.name.strings["initialize-with"];
			param = this.state.registry.namereg.evalname("" + this.Item.id, lst[i], i, 0, myform, myinitials);
			this.state.tmp.disambig_settings.givens[pos].push(param);
		}
		myform = this.name.strings.form;
		myinitials = this.name.strings["initialize-with"];
		paramx = this.state.registry.namereg.evalname("" + this.Item.id, lst[i], i, 0, myform, myinitials);
		if (this.state.tmp.disambig_request) {
			var val = this.state.tmp.disambig_settings.givens[pos][i];
			if (val === 1 && 
				this.state.opt["givenname-disambiguation-rule"] === "by-cite" && 
				"undefined" === typeof this.name.strings["initialize-with"]) {
				val = 2;
			}
			param = val;
			if (this.state.opt["disambiguate-add-givenname"]) {
				param = this.state.registry.namereg.evalname("" + this.Item.id, lst[i], i, param, this.name.strings.form, this.name.strings["initialize-with"]);
			}
		} else {
			param = paramx;
		}
		if (!this.state.tmp.just_looking && this.item && this.item.position === CSL.POSITION_FIRST) {
			param = paramx;
		}
		if (!this.state.tmp.sort_key_flag) {
			this.state.tmp.disambig_settings.givens[pos][i] = param;
		}
	}
};
CSL.NameOutput.prototype.setCommonTerm = function () {
	var variables = this.variables;
	var varnames = variables.slice();
	varnames.sort();
	this.common_term = varnames.join("");
	if (!this.common_term) {
		return false;
	}
	var has_term = false;
	if (this.label) {
		if (this.label.before) {
			has_term = this.state.getTerm(this.common_term, this.label.before.strings.form, 0);
		} else if (this.label.after) {
			has_term = this.state.getTerm(this.common_term, this.label.after.strings.form, 0);
		}
	}
	if (!this.state.locale[this.state.opt.lang].terms[this.common_term]
		|| !has_term
		|| this.variables.length < 2) {
		this.common_term = false;
		return;
	}
	var freeters_offset = 0;
	for (var i = 0, ilen = this.variables.length - 1; i < ilen; i += 1) {
		var v = this.variables[i];
		var vv = this.variables[i + 1];
		if (this.freeters[v].length) {
			if (this.etal_spec[this.variable_offset[v]] !== this.etal_spec[this.variable_offset[vv]]
				|| !this._compareNamesets(this.freeters[v], this.freeters[vv])) {
				this.common_term = false;
				return;
			}
			freeters_offset += 1;
		}
		for (var j = 0, jlen = this.persons[v].length; j < jlen; j += 1) {
			if (this.etal_spec[this.variable_offset[v] + freeters_offset + j + 1] !== this.etal_spec[this.variable_offset + freeters_offset + j + 1]
				|| !this._compareNamesets(this.persons[v][j], this.persons[vv][j])) {
				this.common_term = false;
				return;
			}
		}
	}
};
CSL.NameOutput.prototype._compareNamesets = function (base_nameset, nameset) {
	if (base_nameset.length !== nameset.length) {
		return false;
	}
	for (var i = 0, ilen = nameset.length; i < ilen; i += 1) {
		var name = nameset[i];
		for (var j = 0, jlen = CSL.NAME_PARTS.length; j < jlen; j += 1) {
			var part = CSL.NAME_PARTS[j];
			if (!base_nameset[i] || base_nameset[i][part] != nameset[i][part]) {
				return false;
			}
		}
	}
	return true;
};
CSL.NameOutput.prototype.constrainNames = function () {
	this.names_count = 0;
	var pos = this.nameset_base;
	for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		var v = this.variables[i];
		if (this.freeters[v].length) {
			this.state.tmp.names_max.push(this.freeters[v].length, "literal");
			this._imposeNameConstraints(this.freeters, this.freeters_count, v, pos);
			this.names_count += this.freeters[v].length;
			pos += 1;
		}
		if (this.institutions[v].length) {
			this.state.tmp.names_max.push(this.institutions[v].length, "literal");
			this._imposeNameConstraints(this.institutions, this.institutions_count, v, pos);
			this.persons[v] = this.persons[v].slice(0, this.institutions[v].length);
			this.names_count += this.institutions[v].length;
			pos += 1;
		}
		for (var j = 0, jlen = this.persons[v].length; j < jlen; j += 1) {
			if (this.persons[v][j].length) {
				this.state.tmp.names_max.push(this.persons[v][j].length, "literal");
				this._imposeNameConstraints(this.persons[v], this.persons_count[v], j, pos);
				this.names_count += this.persons[v][j].length;
				pos += 1;
			}
		}
	}
};
CSL.NameOutput.prototype._imposeNameConstraints = function (lst, count, key, pos) {
	var display_names = lst[key];
	var discretionary_names_length = this.state.tmp["et-al-min"];
	if (this.state.tmp.suppress_decorations) {
		if (this.state.tmp.disambig_request) {
			discretionary_names_length = this.state.tmp.disambig_request.names[pos];
		} else if (count[key] >= this.etal_min) {
			discretionary_names_length = this.etal_use_first;
		}
	} else {
		if (this.state.tmp.disambig_request 
			&& this.state.tmp.disambig_request.names[pos] > this.etal_use_first) {
			if (count[key] < this.etal_min) {
				discretionary_names_length = count[key];
			} else {
				discretionary_names_length = this.state.tmp.disambig_request.names[pos];
			}
		} else if (count[key] >= this.etal_min) {
			discretionary_names_length = this.etal_use_first;
		}
		if (this.etal_use_last && discretionary_names_length > (this.etal_min - 2)) {
			discretionary_names_length = this.etal_min - 2;
		}
	}
	var sane = this.etal_min >= this.etal_use_first;
	var overlength = count[key] > discretionary_names_length;
	if (discretionary_names_length > count[key]) {
		discretionary_names_length = display_names.length;
	}
	if (sane && overlength) {
		if (this.etal_use_last) {
			lst[key] = display_names.slice(0, discretionary_names_length).concat(display_names.slice(-1));
		} else {
			lst[key] = display_names.slice(0, discretionary_names_length);
		}
	}
	this.state.tmp.disambig_settings.names[pos] = lst[key].length;
	if (!this.state.tmp.disambig_request) {
		this.state.tmp.disambig_settings.givens[pos] = [];
	}
};
CSL.NameOutput.prototype.getEtAlConfig = function () {
	var item = this.item;
	this["et-al"] = {};
	this.state.output.append(this.etal_term, this.etal_style, true);
	this["et-al"].single = this.state.output.pop();
	this["et-al"].single.strings.suffix = this.etal_suffix;
	this["et-al"].single.strings.prefix = this.etal_prefix_single;
	this.state.output.append(this.etal_term, this.etal_style, true);
	this["et-al"].multiple = this.state.output.pop();
	this["et-al"].multiple.strings.suffix = this.etal_suffix;
	this["et-al"].multiple.strings.prefix = this.etal_prefix_multiple;
	if ("undefined" === typeof item) {
		item = {};
	}
	if (item.position) {
		if (this.name.strings["et-al-subsequent-min"]) {
			this.etal_min = this.name.strings["et-al-subsequent-min"];
		} else {
			this.etal_min = this.name.strings["et-al-min"];
		}
		if (this.name.strings["et-al-subsequent-use-first"]) {
			this.etal_use_first = this.name.strings["et-al-subsequent-use-first"];
		} else {
			this.etal_use_first = this.name.strings["et-al-use-first"];
		}
	} else {
		if (this.state.tmp["et-al-min"]) {
			this.etal_min = this.state.tmp["et-al-min"];
		} else {
			this.etal_min = this.name.strings["et-al-min"];
		}
		if (this.state.tmp["et-al-use-first"]) {
			this.etal_use_first = this.state.tmp["et-al-use-first"];
		} else {
			this.etal_use_first = this.name.strings["et-al-use-first"];
		}
		if ("boolean" === typeof this.state.tmp["et-al-use-last"]) {
			this.etal_use_last = this.state.tmp["et-al-use-last"];
		} else {
			this.etal_use_last = this.name.strings["et-al-use-last"];
		}
	}
	if (!this.state.tmp["et-al-min"]) {
		this.state.tmp["et-al-min"] = this.etal_min;
	}
};
CSL.NameOutput.prototype.renderAllNames = function () {
	var pos = this.nameset_base;
	for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		var v = this.variables[i];
		if (this.freeters[v].length) {
			this.freeters[v] = this._renderPersonalNames(this.freeters[v], pos);
			pos += 1;
		}
		if (this.institutions[v].length) {
			pos += 1;
		}
		for (var j = 0, jlen = this.institutions[v].length; j < jlen; j += 1) {
			this.persons[v][j] = this._renderPersonalNames(this.persons[v][j], pos);
			pos += 1;
		}
	}
	this.renderInstitutionNames();
};
CSL.NameOutput.prototype.renderInstitutionNames = function () {
	for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		var v = this.variables[i];
		for (var j = 0, jlen = this.institutions[v].length; j < jlen; j += 1) {
			var institution, institution_short, institution_long, short_style, long_style;
			switch (this.institution.strings["institution-parts"]) {
			case "short":
				if (this.institutions[v][j]["short"].length) {
					short_style = this._getShortStyle();
					institution = [this._renderOneInstitutionPart(this.institutions[v][j]["short"], short_style)];
				} else {
					long_style = this._getLongStyle(v, j);
					institution = [this._renderOneInstitutionPart(this.institutions[v][j]["long"], long_style)];
				}
				break;
			case "short-long":
				long_style = this._getLongStyle(v, j);
				short_style = this._getShortStyle();
				institution_short = this._renderOneInstitutionPart(this.institutions[v][j]["short"], short_style);
				institution_long = this._renderOneInstitutionPart(this.institutions[v][j]["long"], long_style);
				institution = [institution_short, institution_long];
				break;
			case "long-short":
				long_style = this._getLongStyle(v, j);
				short_style = this._getShortStyle();
				institution_short = this._renderOneInstitutionPart(this.institutions[v][j]["short"], short_style);
				institution_long = this._renderOneInstitutionPart(this.institutions[v][j]["long"], long_style);
				institution = [institution_long, institution_short];
				break;
			default:
				long_style = this._getLongStyle(v, j);
				institution = [this._renderOneInstitutionPart(this.institutions[v][j]["long"], long_style)];
				break;
			}
			this.institutions[v][j] = this._join(institution, "");
		}
	}
};
CSL.NameOutput.prototype._renderOneInstitutionPart = function (blobs, style) {
	for (var i = 0, ilen = blobs.length; i < ilen; i += 1) {
		if (blobs[i]) {
			this.state.output.append(blobs[i], style, true);
			blobs[i] = this.state.output.pop();
		}
	}
	return this._join(blobs, this.name.strings.delimiter);
};
CSL.NameOutput.prototype._renderPersonalNames = function (values, pos) {
	var ret = false;
	if (values.length) {
		var names = [];
		for (var i = 0, ilen = values.length; i < ilen; i += 1) {
			var val = values[i];
			names.push(this._renderOnePersonalName(val, pos, i));
		}
		ret = this.joinPersons(names, pos);
	}
	return ret;
};
CSL.NameOutput.prototype._renderOnePersonalName = function (value, pos, i) {
	var name = value;
	var dropping_particle = this._droppingParticle(name, pos);
	var family = this._familyName(name);
	var non_dropping_particle = this._nonDroppingParticle(name);
	var given = this._givenName(name, pos, i);
	var suffix = this._nameSuffix(name);
	if (this._isShort(pos, i)) {
		dropping_particle = false;
		given = false;
		suffix = false;
	}
	var sort_sep = this.name.strings["sort-separator"];
	if (!sort_sep) {
		sort_sep = "";
	}
	var suffix_sep;
	if (name["comma-suffix"]) {
		suffix_sep = ", ";
	} else {
		suffix_sep = " ";
	}
	var romanesque = name.family.match(CSL.ROMANESQUE_REGEXP);
	var blob, merged, first, second;
	if (!romanesque) {
		blob = this._join([non_dropping_particle, family, given], "");
	} else if (name["static-ordering"]) { // entry likes sort order
		blob = this._join([non_dropping_particle, family, given], " ");
	} else if (this.state.tmp.sort_key_flag) {
		if (this.state.opt["demote-non-dropping-particle"] === "never") {
			first = this._join([non_dropping_particle, family, dropping_particle], " ");
			merged = this._join([first, given], sort_sep);
			blob = this._join([merged, suffix], suffix_sep);
		} else {
			second = this._join([given, dropping_particle, non_dropping_particle], " ");
			merged = this._join([family, second], sort_sep);
			blob = this._join([merged, suffix], suffix_sep);
		}
	} else if (this.name.strings["name-as-sort-order"] === "all" || (this.name.strings["name-as-sort-order"] === "first" && i === 0)) {
		if (["always", "display-and-sort"].indexOf(this.state.opt["demote-non-dropping-particle"]) > -1) {
			second = this._join([given, dropping_particle], (name["comma-dropping-particle"] + " "));
			second = this._join([second, non_dropping_particle], " ");
			if (second && this.given) {
				second.strings.prefix = this.given.strings.prefix;
				second.strings.suffix = this.given.strings.suffix;
			}
			if (family && this.family) {
				family.strings.prefix = this.family.strings.prefix;
				family.strings.suffix = this.family.strings.suffix;
			}
			merged = this._join([family, second], sort_sep);
			blob = this._join([merged, suffix], sort_sep);
		} else {
			first = this._join([non_dropping_particle, family], " ");
			if (first && this.family) {
				first.strings.prefix = this.family.strings.prefix;
				first.strings.suffix = this.family.strings.suffix;
			}
			second = this._join([given, dropping_particle], (name["comma-dropping-particle"] + " "));
			if (second && this.given) {
				second.strings.prefix = this.given.strings.prefix;
				second.strings.suffix = this.given.strings.suffix;
			}
			merged = this._join([first, second], sort_sep);
			blob = this._join([merged, suffix], sort_sep);
		}
	} else { // plain vanilla
		if (name["dropping-particle"] && name.family && !name["non-dropping-particle"]) {
			if (["'","\u02bc","\u2019"].indexOf(name["dropping-particle"].slice(-1)) > -1) {
				family = this._join([dropping_particle, family], "");
				dropping_particle = false;
			}
		}
		second = this._join([dropping_particle, non_dropping_particle, family], " ");
		second = this._join([second, suffix], suffix_sep);
		if (second && this.family) {
			second.strings.prefix = this.family.strings.prefix;
			second.strings.suffix = this.family.strings.suffix;
		}
		if (given && this.given) {
			given.strings.prefix = this.given.strings.prefix;
			given.strings.suffix = this.given.strings.suffix;
		}
		if (second.strings.prefix) {
			name["comma-dropping-particle"] = "";
		}
		blob = this._join([given, second], (name["comma-dropping-particle"] + " "));
	}
	return blob;
};
CSL.NameOutput.prototype._isShort = function (pos, i) {
	if (0 === this.state.tmp.disambig_settings.givens[pos][i]) {
		return true;
	} else {
		return false;
	}
};
CSL.NameOutput.prototype._normalizeNameInput = function (value) {
	var name = {
		literal:value.literal,
		family:value.family,
		given:value.given,
		suffix:value.suffix,
		"comma-suffix":value["comma-suffix"],
		"non-dropping-particle":value["non-dropping-particle"],
		"dropping-particle":value["dropping-particle"],
		"static-ordering":value["static-ordering"],
		"parse-names":value["parse-names"],
		"comma-dropping-particle": "",
		block_initialize:value.block_initialize
	};
	this._parseName(name);
	return name;
};
CSL.NameOutput.prototype._stripPeriods = function (tokname, str) {
	var decor_tok = this[tokname + "_decor"];
	if (str) {
		if (this.state.tmp.strip_periods) {
			str = str.replace(/\./g, "");
		} else  if (decor_tok) {
			for (var i = 0, ilen = decor_tok.decorations.length; i < ilen; i += 1) {
				if ("@strip-periods" === decor_tok.decorations[i][0] && "true" === decor_tok.decorations[i][1]) {
					str = str.replace(/\./g, "");
					break
				}
			}
		}
	}
	return str;
}
CSL.NameOutput.prototype._nonDroppingParticle = function (name) {
	var str = this._stripPeriods("family", name["non-dropping-particle"]);
	if (this.state.output.append(str, this.family_decor, true)) {
		return this.state.output.pop();
	}
	return false;
};
CSL.NameOutput.prototype._droppingParticle = function (name, pos) {
	var str = this._stripPeriods("given", name["dropping-particle"]);
	if (name["dropping-particle"] && name["dropping-particle"].match(/^et.?al[^a-z]$/)) {
		if (this.name.strings["et-al-use-last"]) {
			this.etal_spec[pos] = 2;
		} else {
			this.etal_spec[pos] = 1;
		}
		name["comma-dropping-particle"] = "";
	} else if (this.state.output.append(str, this.given_decor, true)) {
		return this.state.output.pop();
	}
	return false;
};
CSL.NameOutput.prototype._familyName = function (name) {
	var str = this._stripPeriods("family", name.family);
	if (this.state.output.append(str, this.family_decor, true)) {
		return this.state.output.pop();
	}
	return false;
};
CSL.NameOutput.prototype._givenName = function (name, pos, i) {
	if (name.family && 1 === this.state.tmp.disambig_settings.givens[pos][i] && !name.block_initialize) {
		var initialize_with = this.name.strings["initialize-with"];
		name.given = CSL.Util.Names.initializeWith(this.state, name.given, initialize_with);
	} else {
		name.given = CSL.Util.Names.unInitialize(this.state, name.given);
	}
	var str = this._stripPeriods("given", name.given);
	if (this.state.output.append(str, this.given_decor, true)) {
		return this.state.output.pop();
	}
	return false;
};
CSL.NameOutput.prototype._nameSuffix = function (name) {
	var str = this._stripPeriods("family", name.suffix);
	if (this.state.output.append(str, "empty", true)) {
		return this.state.output.pop();
	}
	return false;
};
CSL.NameOutput.prototype._getLongStyle = function (v, i) {
	var long_style, short_style;
	if (this.institutions[v][i]["short"].length) {
		if (this.institutionpart["long-with-short"]) {
			long_style = this.institutionpart["long-with-short"];
		} else {
			long_style = this.institutionpart["long"];
		}
	} else {
		long_style = this.institutionpart["long"];
	}
	if (!long_style) {
		long_style = new CSL.Token();
	}
	return long_style;
};
CSL.NameOutput.prototype._getShortStyle = function () {
	var short_style;
	if (this.institutionpart["short"]) {
		short_style = this.institutionpart["short"];
	} else {
		short_style = new CSL.Token();
	}
	return short_style;
};
CSL.NameOutput.prototype._parseName = function (name) {
	var m, idx;
	if (!name["parse-names"] && "undefined" !== typeof name["parse-names"]) {
		return name;
	}
	if (name.family && !name.given && name.isInstitution) {
		name.literal = name.family;
		name.family = undefined;
		name.isInstitution = undefined;
	}
	var noparse;
	if (name.family 
		&& (name.family.slice(0, 1) === '"' && name.family.slice(-1) === '"')
		|| (!name["parse-names"] && "undefined" !== typeof name["parse-names"])) {
		name.family = name.family.slice(1, -1);
		noparse = true;
		name["parse-names"] = 0;
	} else {
		noparse = false;
	}
	if (!name["non-dropping-particle"] && name.family && !noparse) {
		m = name.family.match(/^((?:[a-z][ \'\u2019a-z]*[\s+|\'\u2019]|[DVL][^ ]\s+[a-z]*\s*|[DVL][^ ][^ ]\s+[a-z]*\s*))/);
		if (m) {
			name.family = name.family.slice(m[1].length);
			name["non-dropping-particle"] = m[1].replace(/\s+$/, "");
		}
	}
	if (!name.suffix && name.given) {
		m = name.given.match(/(\s*,!*\s*)/);
		if (m) {
			idx = name.given.indexOf(m[1]);
			var possible_suffix = name.given.slice(idx + m[1].length);
			var possible_comma = name.given.slice(idx, idx + m[1].length).replace(/\s*/g, "");
			if (possible_suffix.length <= 3) {
				if (possible_comma.length === 2) {
					name["comma-suffix"] = true;
				}
				name.suffix = possible_suffix;
			} else if (!name["dropping-particle"] && name.given) {
				name["dropping-particle"] = possible_suffix;
				name["comma-dropping-particle"] = ",";
			}
			name.given = name.given.slice(0, idx);
		}
	}
	if (!name["dropping-particle"] && name.given) {
		m = name.given.match(/(\s+)([a-z][ \'\u2019a-z]*)$/);
		if (m) {
			name.given = name.given.slice(0, (m[1].length + m[2].length) * -1);
			name["dropping-particle"] = m[2];
		}
	}
};
CSL.NameOutput.prototype.setEtAlParameters = function () {
	var i, ilen, j, jlen;
	if (!this.etal_spec) {
		this.etal_spec = [];
	}
	for (i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		var v = this.variables[i];
		if (this.freeters[v].length) {
			this._setEtAlParameter("freeters", v);
		}
		if (this.institutions[v].length) {
			this._setEtAlParameter("institutions", v);
		}
		for (j = 0, jlen = this.persons[v].length; j < jlen; j += 1) {
			this._setEtAlParameter("persons", v, j);
		}
	}
};
CSL.NameOutput.prototype._setEtAlParameter = function (type, v, j) {
	var lst, count;
	if ("undefined" === typeof j) {
		lst = this[type][v];
		count = this[type + "_count"][v];
	} else {
		lst = this[type][v][j];
		count = this[type + "_count"][v][j];
	}
	if (lst.length < count && !this.state.tmp.sort_key_flag) {
		if (this.etal_use_last) {
			this.etal_spec.push(2);
		} else {
			this.etal_spec.push(1);
		}
	} else {
		this.etal_spec.push(0);
	}
};
CSL.evaluateLabel = function (node, state, Item, item) {
	var myterm;
	if ("locator" === node.strings.term) {
		if (item && item.label) {
			if (item.label === "sub verbo") {
				myterm = "sub-verbo";
			} else {
				myterm = item.label;
			}
		}
		if (!myterm) {
			myterm = "page";
		}
	} else {
		myterm = node.strings.term;
	}
	var plural = node.strings.plural;
	if ("number" !== typeof plural) {
		if ("locator" == node.strings.term) {
			if (item) {
				plural = CSL.evaluateStringPluralism(item.locator);				
			}
		} else if (Item[node.strings.term]) {
			plural = CSL.evaluateStringPluralism(Item[node.strings.term]);			
		}
		if ("number" !== typeof plural) {
			plural = 0;
		}
	}
	return CSL.castLabel(state, node, myterm, plural);
};
CSL.evaluateStringPluralism = function (str) {
	if (str && str.match(/(?:[0-9],\s*[0-9]|\s+and\s+|&|[0-9]\s*[\-\u2013]\s*[0-9])/)) {
		return 1;
	} else {
		return 0;
	}
};
CSL.castLabel = function (state, node, term, plural, mode) {
	var ret = state.getTerm(term, node.strings.form, plural, false, mode);
	if (state.tmp.strip_periods) {
		ret = ret.replace(/\./g, "");
	} else {
		for (var i = 0, ilen = node.decorations.length; i < ilen; i += 1) {
			if ("@strip-periods" === node.decorations[i][0] && "true" === node.decorations[i][1]) {
				ret = ret.replace(/\./g, "");
				break
			}
		}
	}
	return ret;
};
CSL.PublisherOutput = function (state) {
	this.state = state;
	this.varlist = [];
};
CSL.PublisherOutput.prototype.render = function () {
	this.clearVars();
	this.composeAndBlob();
	this.composeElements();
	this.composePublishers();
	this.joinPublishers();
};
CSL.PublisherOutput.prototype.composeAndBlob = function () {
	this.and_blob = {};
	var and_term;
	if (this.and === "text") {
		and_term = this.state.getTerm("and");
	} else if (this.and === "symbol") {
		and_term = "&";
	}
	var tok = new CSL.Token();
	tok.strings.suffix = " ";
	tok.strings.prefix = " ";
	this.state.output.append(and_term, tok, true);
	var no_delim = this.state.output.pop();
	tok.strings.prefix = this.name_delimiter;
	this.state.output.append(and_term, tok, true);
	var with_delim = this.state.output.pop();
	if (this.delimiter_precedes_last === "always") {
		this.and_blob.single = with_delim;
	} else if (this.delimiter_precedes_last === "never") {
		this.and_blob.single = no_delim;
		this.and_blob.multiple = no_delim;
	} else {
		this.and_blob.single = no_delim;
		this.and_blob.multiple = with_delim;
	}
};
CSL.PublisherOutput.prototype.composeElements = function () {
	for (var i = 0, ilen = 2; i < ilen; i += 1) {
		var varname = ["publisher", "publisher-place"][i];
		for (var j = 0, jlen = this["publisher-list"].length; j < jlen; j += 1) {
			var str = this[varname + "-list"][j];
			var tok = this[varname + "-token"];
			this.state.output.append(str, tok, true);
			this[varname + "-list"][j] = this.state.output.pop();
		}
	}
};
CSL.PublisherOutput.prototype.composePublishers = function () {
	var blobs;
	for (var i = 0, ilen = this["publisher-list"].length; i < ilen; i += 1) {
		var ordered_list = [];
		blobs = [this[this.varlist[0] + "-list"][i], this[this.varlist[1] + "-list"][i]];
		this["publisher-list"][i] = this._join(blobs, this.group_tok.strings.delimiter);
	}
};
CSL.PublisherOutput.prototype.joinPublishers = function () {
	var blobs = this["publisher-list"];
	var delim = this.name_delimiter;
	var publishers = this._join(blobs, delim, this.and_blob.single, this.and_blob.multiple, this.group_tok);
	this.state.output.append(publishers, "literal");
};
CSL.PublisherOutput.prototype._join = CSL.NameOutput.prototype._join;
CSL.PublisherOutput.prototype._getToken = CSL.NameOutput.prototype._getToken;
CSL.PublisherOutput.prototype.clearVars = function () {
	this.state.tmp["publisher-list"] = false;
	this.state.tmp["publisher-place-list"] = false;
	this.state.tmp["publisher-group-token"] = false;
	this.state.tmp["publisher-token"] = false;
	this.state.tmp["publisher-place-token"] = false;
};
CSL.Node.name = {
	build: function (state, target) {
		var func, pos, len, attrname;
		if ([CSL.SINGLETON, CSL.START].indexOf(this.tokentype) > -1) {
			state.fixOpt(this, "name-delimiter", "name_delimiter");
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
			if (this.strings["et-al-subsequent-min"]
				&& (this.strings["et-al-subsequent-min"] !== this.strings["et-al-min"])) {
				state.opt.update_mode = CSL.POSITION;
			}
			if (this.strings["et-al-subsequent-use-first"]
				&& (this.strings["et-al-subsequent-use-first"] !== this.strings["et-al-use-first"])) {
				state.opt.update_mode = CSL.POSITION;
			}
			state.build.etal_term = "et-al";
			state.build.name_delimiter = this.strings.delimiter;
			state.build["delimiter-precedes-et-al"] = this.strings["delimiter-precedes-et-al"];
			if ("undefined" == typeof this.strings.name_delimiter) {
				this.strings.delimiter = ", ";
			} else {
				this.strings.delimiter = this.strings.name_delimiter;
			}
			if ("text" === this.strings.and) {
				this.and_term = state.getTerm("and", "long", 0);
			} else if ("symbol" === this.strings.and) {
				this.and_term = "&";
			}
			if (CSL.STARTSWITH_ROMANESQUE_REGEXP.test(this.and_term)) {
				this.and_prefix_single = " ";
				this.and_prefix_multiple = ", ";
				if ("string" === this.strings.delimiter) {
					this.and_prefix_multiple = this.strings.delimiter;
				}
				this.and_suffix = " ";
				state.build.name_delimiter = this.strings.delimiter;
			} else {
				this.and_prefix_single = "";
				this.and_prefix_multiple = "";
				this.and_suffix = "";
			}
			if (this.strings["delimiter-precedes-last"] === "always") {
				this.and_prefix_single = this.strings.delimiter;
			} else if (this.strings["delimiter-precedes-last"] === "never") {
				if (this.and_prefix_multiple) {
					this.and_prefix_multiple = " ";
				}
			}
			if (this.strings["et-al-use-last"]) {
				this.ellipsis_term = "\u2026";
				this.ellipsis_prefix_single = " ";
				this.ellipsis_prefix_multiple =  this.strings.delimiter;
				this.ellipsis_suffix = " ";
			}
			if (this.strings["delimiter-precedes-et-al"] === "always") {
				this.and_prefix_single = this.strings.delimiter;
			} else if (this.strings["delimiter-precedes-last"] === "never") {
				if (this.and_prefix_multiple) {
					this.and_prefix_multiple = " ";
				}
			}
			func = function (state, Item) {
				this.and = {};
				if (this.strings.and) {
					state.output.append(this.and_term, "empty", true);
					this.and.single = state.output.pop();
					this.and.single.strings.prefix = this.and_prefix_single;
					this.and.single.strings.suffix = this.and_suffix;
					state.output.append(this.and_term, "empty", true);
					this.and.multiple = state.output.pop();
					this.and.multiple.strings.prefix = this.and_prefix_multiple;
					this.and.multiple.strings.suffix = this.and_suffix;
				} else if (this.strings.delimiter) {
					this.and.single = new CSL.Blob("empty", this.strings.delimiter);
					this.and.single.strings.prefix = "";
					this.and.single.strings.suffix = "";
					this.and.multiple = new CSL.Blob("empty", this.strings.delimiter);
					this.and.multiple.strings.prefix = "";
					this.and.multiple.strings.suffix = "";
				}
				this.ellipsis = {};
				if (this.strings["et-al-use-last"]) {
					this.ellipsis.single = new CSL.Blob("empty", this.ellipsis_term);
					this.ellipsis.single.strings.prefix = this.ellipsis_prefix_single;
					this.ellipsis.single.strings.suffix = this.ellipsis_suffix;
					this.ellipsis.multiple = new CSL.Blob("empty", this.ellipsis_term);
					this.ellipsis.multiple.strings.prefix = this.ellipsis_prefix_multiple;
					this.ellipsis.multiple.strings.suffix = this.ellipsis_suffix;
				}
				if ("undefined" === typeof state.tmp["et-al-min"]) {
					state.tmp["et-al-min"] = this.strings["et-al-min"];
				}
				if ("undefined" === typeof state.tmp["et-al-use-first"]) {
					state.tmp["et-al-use-first"] = this.strings["et-al-use-first"];
				}
				if ("undefined" === typeof state.tmp["et-al-use-last"]) {
					state.tmp["et-al-use-last"] = this.strings["et-al-use-last"];
				}
				state.nameOutput.name = this;
			};
			state.build.name_flag = true;
			this.execs.push(func);
		}
		target.push(this);
	}
};
CSL.Node["name-part"] = {
	build: function (state, target) {
		state.build[this.strings.name] = this;
	}
};
CSL.Node.names = {
	build: function (state, target) {
		var func, len, pos, attrname;
		var debug = false;
		if (this.tokentype === CSL.START || this.tokentype === CSL.SINGLETON) {
			CSL.Util.substituteStart.call(this, state, target);
			state.build.substitute_level.push(1);
			state.fixOpt(this, "names-delimiter", "delimiter");
		}
		if (this.tokentype === CSL.SINGLETON) {
			func = function (state, Item, item) {
				state.nameOutput.reinit(this);
			};
			this.execs.push(func);
		}
		if (this.tokentype === CSL.START) {
			state.build.names_flag = true;
			func = function (state, Item) {
				state.tmp.can_substitute.push(true);
			};
			this.execs.push(func);
			func = function (state, Item, item) {
				state.parallel.StartVariable("names");
			};
			this.execs.push(func);
			func = function (state, Item, item) {
				state.nameOutput.init(this);
			};
			this.execs.push(func);
		}
		if (this.tokentype === CSL.END) {
			for (var i = 0, ilen = 3; i < ilen; i += 1) {
				var key = ["family", "given", "et-al"][i];
				this[key] = state.build[key];
				state.build[key] = undefined;
			}
			this.label = state.build.name_label;
			state.build.name_label = undefined;
			var mywith = "with";
			var with_default_prefix = "";
			var with_suffix = "";
			if (CSL.STARTSWITH_ROMANESQUE_REGEXP.test(mywith)) {
				with_default_prefix = " ";
				with_suffix = " ";
			}
			this["with"] = {};
			this["with"].single = new CSL.Blob("empty", mywith);
			this["with"].single.strings.suffix = with_suffix;
			this["with"].multiple = new CSL.Blob("empty", mywith);
			this["with"].multiple.strings.suffix = with_suffix;
			if (this.strings["delimiter-precedes-last"] === "always") {
				this["with"].single.strings.prefix = this.strings.delimiter;
				this["with"].multiple.strings.prefix = this.strings.delimiter;
			} else if (this.strings["delimiter-precedes-last"] === "contextual") {
				this["with"].single.strings.prefix = with_default_prefix;
				this["with"].multiple.strings.prefix = this.strings.delimiter;
			} else {
				this["with"].single.strings.prefix = with_default_prefix;
				this["with"].multiple.strings.prefix = with_default_prefix;
			}
			if (state.build.etal_node) {
				this.etal_style = state.build.etal_node;
			} else {
				this.etal_style = "empty";
			}
			this.etal_term = state.getTerm(state.build.etal_term, "long", 0);
			if (CSL.STARTSWITH_ROMANESQUE_REGEXP.test(this.etal_term)) {
				this.etal_prefix_single = " ";
				this.etal_prefix_multiple = state.build.name_delimiter;
				if (state.build["delimiter-precedes-et-al"] === "always") {
					this.etal_prefix_single = state.build.name_delimiter;
				} else if (state.build["delimiter-precedes-et-al"] === "never") {
					this.etal_prefix_multiple = " ";
				}
				this.etal_suffix = "";
			} else {
				this.etal_prefix_single = "";
				this.etal_prefix_multiple = "";
				this.etal_suffix = "";
			}
			func = function (state, Item, item) {
				for (var i = 0, ilen = 3; i < ilen; i += 1) {
					var key = ["family", "given"][i];
					state.nameOutput[key] = this[key];
				}
				state.nameOutput["with"] = this["with"];
				state.nameOutput.label = this.label;
				state.nameOutput.etal_style = this.etal_style;
				state.nameOutput.etal_term = this.etal_term;
				state.nameOutput.etal_prefix_single = this.etal_prefix_single;
				state.nameOutput.etal_prefix_multiple = this.etal_prefix_multiple;
				state.nameOutput.etal_suffix = this.etal_suffix;
				state.nameOutput.outputNames();
				state.tmp["et-al-use-first"] = undefined;
				state.tmp["et-al-min"] = undefined;
				state.tmp["et-al-use-last"] = undefined;
			};
			this.execs.push(func);
			func = function (state, Item) {
				if (!state.tmp.can_substitute.pop()) {
					state.tmp.can_substitute.replace(false, CSL.LITERAL);
				}
				state.parallel.CloseVariable("names");
				state.tmp.can_block_substitute = false;
			};
			this.execs.push(func);
			state.build.name_flag = false;
		}
		target.push(this);
		if (this.tokentype === CSL.END || this.tokentype === CSL.SINGLETON) {
			state.build.substitute_level.pop();
			CSL.Util.substituteEnd.call(this, state, target);
		}
	}
};
CSL.Node.number = {
	build: function (state, target) {
		var func;
		CSL.Util.substituteStart.call(this, state, target);
		if (this.strings.form === "roman") {
			this.formatter = state.fun.romanizer;
		} else if (this.strings.form === "ordinal") {
			this.formatter = state.fun.ordinalizer;
		} else if (this.strings.form === "long-ordinal") {
			this.formatter = state.fun.long_ordinalizer;
		}
		if ("undefined" === typeof this.successor_prefix) {
			this.successor_prefix = state[state.tmp.area].opt.layout_delimiter;
		}
		if ("undefined" === typeof this.splice_prefix) {
			this.splice_prefix = state[state.tmp.area].opt.layout_delimiter;
		}
		func = function (state, Item) {
			var varname, num, number, m, j, jlen;
			varname = this.variables[0];
			state.parallel.StartVariable(this.variables[0]);
			state.parallel.AppendToVariable(Item[this.variables[0]]);
			if (varname === "page-range" || varname === "page-first") {
				varname = "page";
			}
			num = Item[varname];
			if ("undefined" !== typeof num) {
				if (this.variables[0] === "page-first") {
					m = num.split(/\s*(?:&|,|-)\s*/);
					num = m[0];
				}
				var prefixes = num.split(/[0-9]+/);
				var all_with_spaces = true;
				for (var i = 1, ilen = prefixes.length - 1; i < ilen; i += 1) {
				    if (prefixes[i].indexOf(" ") === -1) {
						all_with_spaces = false;
						break;
				    }
				}
				if (state.tmp.area !== "citation_sort"
				  && state.tmp.area !== "bibliography_sort"
				  && all_with_spaces 
				  && !num.match(/[^\- 0-9,&]/)) {
					var nums = num.match(/[0-9]+/g);
					var range_ok = true;
					for (i = prefixes.length - 2; i > 0; i += -1) {
						if (prefixes && prefixes[i].indexOf("-") > -1) {
							var start = parseInt(nums[i - 1], 10);
							var end = parseInt(nums[i], 10);
							if (start >= end || start < (end - 1000)) {
								range_ok = false;
								break;
							}
							var replacement = [];
							for (j = start, jlen = end + 1; j < jlen; j += 1) {
								replacement.push(""+j);
							}
								nums = nums.slice(0, i - 1).concat(replacement).concat(nums.slice(i + 1));
						}
					}
					if (range_ok) {
						nums = nums.sort(function (a,b) {
							a = parseInt(a, 10);
							b = parseInt(b, 10);
							if (a > b) {
								return 1;
							} else if (a < b) {
								return -1;
							} else {
								return 0;
							}
						});
						for (i = nums.length; i > -1; i += -1) {
							if (nums[i] === nums[i + 1]) {
								nums = nums.slice(0, i).concat(nums.slice(i + 1));
							}
						}
						state.output.openLevel("empty");
						for (i = 0, ilen = nums.length; i < ilen; i += 1) {
							num = parseInt(nums[i], 10);
							number = new CSL.NumericBlob(num, this);
							number.gender = state.opt["noun-genders"][varname];
							if (i > 0) {
								number.successor_prefix = " & ";
								number.range_prefix = "-";
								number.splice_prefix = ", ";
							}
							state.output.append(number, "literal");
						}
						state.output.closeLevel("empty");
					} else {
						state.output.append(num, this);
				    }
				} else if (!all_with_spaces || prefixes.length > 2) {
				    state.output.append(num, this);
				} else {
					m = num.match(/\s*([0-9]+)(?:[^\-]* |[^\-]*$)/);
					if (m) {
						num = parseInt(m[1], 10);
						number = new CSL.NumericBlob(num, this);
						number.gender = state.opt["noun-genders"][varname];
						state.output.append(number, "literal");
				    } else {
						state.output.append(num, this);
				    }
				}
			}
			state.parallel.CloseVariable("number");
		};
		this.execs.push(func);
		target.push(this);
		CSL.Util.substituteEnd.call(this, state, target);
	}
};
CSL.Node.sort = {
	build: function (state, target) {
		if (this.tokentype === CSL.START) {
			if (state.build.area === "citation") {
				state.parallel.use_parallels = false;
				state.opt.sort_citations = true;
			}
			state.build.sort_flag  = true;
			state.build.area_return = state.build.area;
			state.build.area = state.build.area + "_sort";
		}
		if (this.tokentype === CSL.END) {
			state.build.area = state.build.area_return;
			state.build.sort_flag  = false;
		}
	}
};
CSL.Node.substitute = {
	build: function (state, target) {
		var func;
		if (this.tokentype === CSL.START) {
			func = function (state, Item) {
				state.tmp.can_block_substitute = true;
				if (state.tmp.value.length) {
				    state.tmp.can_substitute.replace(false, CSL.LITERAL);
				}
			};
			this.execs.push(func);
		}
		target.push(this);
	}
};
CSL.Node.text = {
	build: function (state, target) {
		var variable, func, form, plural, id, num, number, formatter, firstoutput, specialdelimiter, label, myname, names, name, year, suffix, term, dp, len, pos, n, m, value, flag;
		CSL.Util.substituteStart.call(this, state, target);
		if (this.postponed_macro) {
			CSL.expandMacro.call(state, this);
		} else {
			if (!this.variables_real) {
				this.variables_real = [];
			}
			if (!this.variables) {
				this.variables = [];
			}
			form = "long";
			plural = 0;
			if (this.strings.form) {
				form = this.strings.form;
			}
			if (this.strings.plural) {
				plural = this.strings.plural;
			}
			if ("citation-number" === this.variables_real[0] || "year-suffix" === this.variables_real[0] || "citation-label" === this.variables_real[0]) {
				if (this.variables_real[0] === "citation-number") {
					if (state.build.area === "citation") {
						state.opt.update_mode = CSL.NUMERIC;
					}
					if (state.build.area === "bibliography") {
						state.opt.bib_mode = CSL.NUMERIC;
					}
					if ("citation-number" === state[state.tmp.area].opt.collapse) {
						this.range_prefix = state.getTerm("range-delimiter");
					}
					this.successor_prefix = state[state.build.area].opt.layout_delimiter;
					this.splice_prefix = state[state.build.area].opt.layout_delimiter;
					func = function (state, Item, item) {
						id = "" + Item.id;
						if (!state.tmp.just_looking) {
							if (item && item["author-only"]) {
								state.tmp.element_trace.replace("do-not-suppress-me");
								term = CSL.Output.Formatters["capitalize-first"](state, state.getTerm("reference", "long", "singular"));
								state.output.append(term + " ");
								state.tmp.last_element_trace = true;
							}
							if (item && item["suppress-author"]) {
								if (state.tmp.last_element_trace) {
									state.tmp.element_trace.replace("suppress-me");
								}
								state.tmp.last_element_trace = false;
							}
							num = state.registry.registry[id].seq;
							if (state.opt.citation_number_slug) {
								state.output.append(state.opt.citation_number_slug, this);
							} else {
								number = new CSL.NumericBlob(num, this);
								state.output.append(number, "literal");
							}
						}
					};
					this.execs.push(func);
				} else if (this.variables_real[0] === "year-suffix") {
					state.opt.has_year_suffix = true;
					if (state[state.tmp.area].opt.collapse === "year-suffix-ranged") {
						this.range_prefix = state.getTerm("range-delimiter");
					}
					this.successor_prefix = state[state.build.area].opt.layout_delimiter;
					if (state[state.tmp.area].opt["year-suffix-delimiter"]) {
						this.successor_prefix = state[state.build.area].opt["year-suffix-delimiter"];
					}
					func = function (state, Item) {
						if (state.registry.registry[Item.id] && state.registry.registry[Item.id].disambig.year_suffix !== false && !state.tmp.just_looking) {
							num = parseInt(state.registry.registry[Item.id].disambig.year_suffix, 10);
							number = new CSL.NumericBlob(num, this);
							formatter = new CSL.Util.Suffixator(CSL.SUFFIX_CHARS);
							number.setFormatter(formatter);
							state.output.append(number, "literal");
							firstoutput = false;
							len = state.tmp.term_sibling.mystack.length;
							for (pos = 0; pos < len; pos += 1) {
								flag = state.tmp.term_sibling.mystack[pos];
								if (!flag[2] && (flag[1] || (!flag[1] && !flag[0]))) {
									firstoutput = true;
									break;
								}
							}
							specialdelimiter = state[state.tmp.area].opt["year-suffix-delimiter"];
							if (firstoutput && specialdelimiter && !state.tmp.sort_key_flag) {
								state.tmp.splice_delimiter = state[state.tmp.area].opt["year-suffix-delimiter"];
							}
						}
					};
					this.execs.push(func);
				} else if (this.variables_real[0] === "citation-label") {
					state.opt.has_year_suffix = true;
					func = function (state, Item) {
						label = Item["citation-label"];
						if (!label) {
							label = state.getCitationLabel(Item);
						}
						suffix = "";
						if (state.registry.registry[Item.id] && state.registry.registry[Item.id].disambig.year_suffix !== false) {
							num = parseInt(state.registry.registry[Item.id].disambig.year_suffix, 10);
							suffix = state.fun.suffixator.format(num);
						}
						label += suffix;
						state.output.append(label, this);
					};
					this.execs.push(func);
				}
			} else {
				if (this.strings.term) {
				    term = this.strings.term;
				    term = state.getTerm(term, form, plural);
				    func = function (state, Item) {
						var myterm;
						if (term !== "") {
							flag = state.tmp.term_sibling.value();
							flag[0] = true;
							state.tmp.term_sibling.replace(flag);
						}
						if (!state.tmp.term_predecessor) {
							myterm = CSL.Output.Formatters["capitalize-first"](state, term);
						} else {
							myterm = term;
						}
						if (state.tmp.strip_periods) {
							myterm = myterm.replace(/\./g, "");
						} else {
							for (var i = 0, ilen = this.decorations.length; i < ilen; i += 1) {
								if ("@strip-periods" === this.decorations[i][0] && "true" === this.decorations[i][1]) {
									myterm = myterm.replace(/\./g, "");
									break
								}
							}
						}
						state.output.append(myterm, this);
				    };
				    this.execs.push(func);
				    state.build.term = false;
				    state.build.form = false;
				    state.build.plural = false;
				} else if (this.variables_real.length) {
					func = function (state, Item) {
						var parallel_variable = this.variables[0];
						if (parallel_variable === "title" && form === "short") {
							parallel_variable = "shortTitle";
						}
						state.parallel.StartVariable(parallel_variable);
						state.parallel.AppendToVariable(Item[parallel_variable]);
					};
					this.execs.push(func);
					if (CSL.MULTI_FIELDS.indexOf(this.variables_real[0]) > -1) {
						if (form === "short") {
							state.transform.init(this, this.variables_real[0], this.variables_real[0]);
						} else {
							state.transform.init(this, this.variables_real[0]);
						}
						if (state.build.area.slice(-5) === "_sort") {
							state.transform.init(this, this.variables_real[0], this.variables_real[0]);
							state.transform.setTransformLocale("locale-sort");
							state.transform.setTransformFallback(true);
							func = state.transform.getOutputFunction(this.variables);
						} else if (form === "short") {
							 if (["title", "container-title", "collection-title"].indexOf(this.variables_real[0]) > -1) {
								 state.transform.setTransformLocale("locale-sec");
							 } else {
								 state.transform.setTransformLocale("locale-pri");
							 }
							 state.transform.setTransformFallback(true);
							 state.transform.setAbbreviationFallback(true);
							if (this.variables_real[0] === "container-title") {
								state.transform.setAlternativeVariableName("journalAbbreviation");
							} else if (this.variables_real[0] === "title") {
								state.transform.setAlternativeVariableName("shortTitle");
							} else if (["publisher", "publisher-place", "edition"].indexOf(this.variables_real[0]) > -1) {
								state.transform.setTransformLocale("default-locale");
							}
							func = state.transform.getOutputFunction(this.variables);
						} else if (["title", "container-title", "collection-title"].indexOf(this.variables_real[0]) > -1) {
							state.transform.setTransformLocale("locale-sec");
							state.transform.setTransformFallback(true);
							func = state.transform.getOutputFunction(this.variables);
						} else {
							state.transform.setTransformLocale("locale-pri");
							state.transform.setTransformFallback(true);
							if (["publisher", "publisher-place", "edition"].indexOf(this.variables_real[0]) > -1) {
								state.transform.setTransformLocale("default-locale");
							}
							func = state.transform.getOutputFunction(this.variables);
						}
						if (this.variables_real[0] === "container-title") {
							var xfunc = function (state, Item, item) {
								if (Item['container-title'] && state.tmp.citeblob.has_volume) {
									state.tmp.citeblob.can_suppress_identical_year = true;
								}
							};
							this.execs.push(xfunc);
						}
					} else {
						if (CSL.CITE_FIELDS.indexOf(this.variables_real[0]) > -1) {
							func = function (state, Item, item) {
								if (item && item[this.variables[0]]) {
									var locator = "" + item[this.variables[0]];
									locator = locator.replace(/--*/g,"\u2013");
									state.output.append(locator, this);
								}
							};
						} else if (this.variables_real[0] === "page-first") {
							func = function (state, Item) {
								var idx, value;
								value = state.getVariable(Item, "page", form);
								if (value) {
									value = value.replace("\u2013", "-", "g");
									idx = value.indexOf("-");
									if (idx > -1) {
										value = value.slice(0, idx);
									}
									state.output.append(value, this);
								}
							};
						} else  if (this.variables_real[0] === "page") {
							func = function (state, Item) {
								var value = state.getVariable(Item, "page", form);
								if (value) {
									value = state.fun.page_mangler(value);
									state.output.append(value, this);
								}
							};
						} else if ("volume") {
							func = function (state, Item) {
								if (this.variables[0]) {
									var value = state.getVariable(Item, this.variables[0], form);
									if (value) {
										state.tmp.citeblob.has_volume = true;
										state.output.append(value, this);
									}
								}
							};
						} else {
							func = function (state, Item) {
								if (this.variables[0]) {
									var value = state.getVariable(Item, this.variables[0], form);
									if (value) {
										state.output.append(value, this);
									}
								}
							};
						}
					}
					this.execs.push(func);
					func = function (state, Item) {
						state.parallel.CloseVariable("text");
					};
					this.execs.push(func);
				} else if (this.strings.value) {
					func = function (state, Item) {
						var flag;
						flag = state.tmp.term_sibling.value();
						flag[0] = true;
						state.tmp.term_sibling.replace(flag);
						state.output.append(this.strings.value, this);
					};
					this.execs.push(func);
				}
			}
			target.push(this);
		}
		CSL.Util.substituteEnd.call(this, state, target);
	}
};
CSL.Attributes = {};
CSL.Attributes["@class"] = function (state, arg) {
	state.opt["class"] = arg;
};
CSL.Attributes["@version"] = function (state, arg) {
	state.opt.version = arg;
};
CSL.Attributes["@value"] = function (state, arg) {
	this.strings.value = arg;
};
CSL.Attributes["@name"] = function (state, arg) {
	this.strings.name = arg;
};
CSL.Attributes["@form"] = function (state, arg) {
	this.strings.form = arg;
};
CSL.Attributes["@date-parts"] = function (state, arg) {
	this.strings["date-parts"] = arg;
};
CSL.Attributes["@range-delimiter"] = function (state, arg) {
	this.strings["range-delimiter"] = arg;
};
CSL.Attributes["@macro"] = function (state, arg) {
	this.postponed_macro = arg;
};
CSL.Attributes["@term"] = function (state, arg) {
	if (arg === "sub verbo") {
		this.strings.term = "sub-verbo";
	} else {
		this.strings.term = arg;
	}
};
CSL.Attributes["@xmlns"] = function (state, arg) {};
CSL.Attributes["@lang"] = function (state, arg) {
	if (arg) {
		state.build.lang = arg;
	}
};
CSL.Attributes["@type"] = function (state, arg) {
	var types, ret, func, len, pos;
	func = function (state, Item) {
		types = arg.split(/\s+/);
		ret = [];
		len = types.length;
		for (pos = 0; pos < len; pos += 1) {
			ret.push(Item.type === types[pos]);
		}
		return ret;
	};
	this.tests.push(func);
};
CSL.Attributes["@variable"] = function (state, arg) {
	var variables, pos, len, func, output, variable, varlen, needlen, ret, myitem, key, flag;
	this.variables = arg.split(/\s+/);
	this.variables_real = arg.split(/\s+/);
	if ("label" === this.name && this.variables[0]) {
		this.strings.term = this.variables[0];
	} else if (["names", "date", "text", "number"].indexOf(this.name) > -1) {
		func = function (state, Item) {
			variables = this.variables_real.slice();
			for (var i = this.variables.length - 1; i > -1; i += -1) {
				this.variables.pop();
			}
			len = variables.length;
			for (pos = 0; pos < len; pos += 1) {
				if (state.tmp.done_vars.indexOf(variables[pos]) === -1) {
					this.variables.push(variables[pos]);
				}
				if (state.tmp.can_block_substitute) {
					state.tmp.done_vars.push(variables[pos]);
				}
			}
		};
		this.execs.push(func);
		func = function (state, Item, item) {
			var mydate;
			output = false;
			len = this.variables.length;
			for (pos = 0; pos < len; pos += 1) {
				variable = this.variables[pos];
				if (variable === "page-first") {
					variable = "page";
				}
				if (this.strings.form === "short" && !Item[variable]) {
					if (variable === "title") {
						variable = "shortTitle";
					} else if (variable === "container-title") {
						variable = "journalAbbreviation";
					}
				}
                if (variable === "year-suffix") {
					output = true;
					break;
				}
				if (CSL.DATE_VARIABLES.indexOf(variable) > -1) {
					if (Item[variable] && Item[variable].raw) {
						output = true;
						break;
					} else if (Item[variable] && Item[variable].literal) {
						output = true;
						break;
					} else if (Item[variable] && Item[variable]['date-parts'] && Item[variable]['date-parts'].length && this.dateparts && this.dateparts.length) {
						varlen = Item[variable]['date-parts'][0].length;
						needlen = 4;
						if (this.dateparts.indexOf("year") > -1) {
							needlen = 1;
						} else if (this.dateparts.indexOf("month") > -1) {
							needlen = 2;
						} else if (this.dateparts.indexOf('day') > -1) {
							needlen = 3;
						}
						if (varlen >= needlen) {
							output = true;
						}
						break;
					}
				} else if ("locator" === variable) {
					if (item && item.locator) {
						output = true;
					}
					break;
				} else if (["citation-number","citation-label"].indexOf(variable) > -1) {
					output = true;
					break;
				} else if ("first-reference-note-number" === variable) {
					if (item && item["first-reference-note-number"]) {
						output = true;
					}
					break;
				} else if ("object" === typeof Item[variable]) {
					if (Item[variable].length) {
						output = true;
					}
					break;
				} else if ("string" === typeof Item[variable] && Item[variable]) {
					output = true;
					break;
				} else if ("number" === typeof Item[variable]) {
					output = true;
					break;
				}
				if (output) {
					break;
				}
			}
			flag = state.tmp.term_sibling.value();
			if (output) {
				if (variable !== "citation-number" || state.tmp.area !== "bibliography") {
					state.tmp.cite_renders_content = true;
				}
				flag[2] = true;
				state.tmp.term_sibling.replace(flag);
				state.tmp.can_substitute.replace(false,  CSL.LITERAL);
			} else {
				flag[1] = true;
			}
		};
		this.execs.push(func);
	} else if (["if",  "else-if"].indexOf(this.name) > -1) {
		func = function (state, Item, item) {
			var key, x;
			ret = [];
			len = this.variables.length;
			for (pos = 0; pos < len; pos += 1) {
				variable = this.variables[pos];
				x = false;
				myitem = Item;
				if (item && ["locator", "first-reference-note-number"].indexOf(variable) > -1) {
					myitem = item;
				}
				if (myitem[variable]) {
					if ("number" === typeof myitem[variable] || "string" === typeof myitem[variable]) {
						x = true;
					} else if ("object" === typeof myitem[variable]) {
						for (key in myitem[variable]) {
							if (myitem[variable][key]) {
								x = true;
							} else {
								x = false;
							}
						}
					}
				}
				ret.push(x);
			}
			return ret;
		};
		this.tests.push(func);
	}
};
CSL.Attributes["@lingo"] = function (state, arg) {
};
CSL.Attributes["@locale"] = function (state, arg) {
	var func, ret, len, pos, variable, myitem, langspec, lang, lst, i, ilen, fallback;
	if (this.name === "layout") {
		this.locale_raw = arg;
	} else {
		lst = arg.split(/\s+/);
		this.locale_bases = [];
		for (i = 0, ilen = lst.length; i < ilen; i += 1) {
			lang = CSL.localeParse(lst[i]);
			langspec = CSL.localeResolve(lang);
			if (lst[i].length === 2) {
				this.locale_bases.push(langspec.base);
			}
			state.localeConfigure(langspec);
			lst[i] = langspec;
		}
		this.locale_default = state.opt["default-locale"][0];
		this.locale = lst[0].best;
		this.locale_list = lst.slice();
		func = function (state, Item, item) {
			var key, res;
			ret = [];
			if (Item.language) {
				lang = CSL.localeParse(Item.language);
				langspec = CSL.localeResolve(lang);
				res = false;
				for (i = 0, ilen = this.locale_list.length; i < ilen; i += 1) {
					if (langspec.best === this.locale_list[i].best) {
						state.opt.lang = this.locale;
						state.tmp.last_cite_locale = this.locale;
						state.output.openLevel("empty");
						state.output.current.value().new_locale = this.locale;
						res = true;
						break;
					}
				}
				if (!res && this.locale_bases.indexOf(langspec.base) > -1) {
					state.opt.lang = this.locale;
					state.tmp.last_cite_locale = this.locale;
					state.output.openLevel("empty");
					state.output.current.value().new_locale = this.locale;
					res = true;
				}
			}
			ret.push(res);
			return ret;
		};
		this.tests.push(func);
	}
};
CSL.Attributes["@suffix"] = function (state, arg) {
	this.strings.suffix = arg;
};
CSL.Attributes["@prefix"] = function (state, arg) {
	this.strings.prefix = arg;
};
CSL.Attributes["@delimiter"] = function (state, arg) {
	if ("name" == this.name) {
		this.strings.name_delimiter = arg;
	} else {
		this.strings.delimiter = arg;
	}
};
CSL.Attributes["@match"] = function (state, arg) {
	var evaluator;
	if (this.tokentype === CSL.START || CSL.SINGLETON) {
		if ("none" === arg) {
			evaluator = state.fun.match.none;
		} else if ("any" === arg) {
			evaluator = state.fun.match.any;
		} else if ("all" === arg) {
			evaluator = state.fun.match.all;
		} else {
			throw "Unknown match condition \"" + arg + "\" in @match";
		}
		this.evaluator = evaluator;
	}
};
CSL.Attributes["@is-uncertain-date"] = function (state, arg) {
	var variables, len, pos, func, variable, ret;
	variables = arg.split(/\s+/);
	len = variables.length;
	func = function (state, Item) {
		ret = [];
		for (pos = 0; pos < len; pos += 1) {
			variable = variables[pos];
			if (Item[variable] && Item[variable].circa) {
				ret.push(true);
			} else {
				ret.push(false);
			}
		}
		return ret;
	};
	this.tests.push(func);
};
CSL.Attributes["@is-numeric"] = function (state, arg) {
	var variables, variable, func, val, pos, len, not_numeric_type, ret;
	variables = arg.split(/\s+/);
	len = variables.length;
	func = function (state, Item) {
		ret = [];
		for (pos = 0; pos < len; pos += 1) {
			variable = variables[pos];
			not_numeric_type = CSL.NUMERIC_VARIABLES.indexOf(variable) === -1;
			val = Item[variable];
			if (typeof val === "number") {
				val = "" + val;
			}
			if (not_numeric_type) {
				if (val && val.match(/[0-9]$/)) {
					ret.push(true);
				} else {
					ret.push(false);
				}
			} else  if (typeof val === "undefined") {
				ret.push(false);
			} else if (typeof val !== "string") {
				ret.push(false);
			} else if (val.slice(0, 1) === '"' && val.slice(-1) === '"') {
				ret.push(false);
			} else if (val.match(CSL.NUMBER_REGEXP)) {
				ret.push(true);
			} else {
				ret.push(false);
			}
		}
		return ret;
	};
	this.tests.push(func);
};
CSL.Attributes["@names-min"] = function (state, arg) {
	var val = parseInt(arg, 10);
	if (state.opt.max_number_of_names < val) {
		state.opt.max_number_of_names = val;
	}
	this.strings["et-al-min"] = val;
};
CSL.Attributes["@names-use-first"] = function (state, arg) {
	this.strings["et-al-use-first"] = parseInt(arg, 10);
};
CSL.Attributes["@names-use-last"] = function (state, arg) {
	if (arg === "true") {
		this.strings["et-al-use-last"] = true;
	} else {
		this.strings["et-al-use-last"] = false;
	}
};
CSL.Attributes["@sort"] = function (state, arg) {
	if (arg === "descending") {
		this.strings.sort_direction = CSL.DESCENDING;
	}
};
CSL.Attributes["@plural"] = function (state, arg) {
	if ("always" === arg || "true" === arg) {
		this.strings.plural = 1;
	} else if ("never" === arg || "false" === arg) {
		this.strings.plural = 0;
	} else if ("contextual" === arg) {
		this.strings.plural = false;
	}
};
CSL.Attributes["@locator"] = function (state, arg) {
	var func;
	var trylabels = arg.replace("sub verbo", "sub-verbo");
	trylabels = trylabels.split(/\s+/);
	if (["if",  "else-if"].indexOf(this.name) > -1) {
		func = function (state, Item, item) {
			var ret = [];
			var label;
			if ("undefined" === typeof item || !item.label) {
				label = "page";
			} else if (item.label === "sub verbo") {
				label = "sub-verbo";
			} else {
				label = item.label;
			}
			for (var i = 0, ilen = trylabels.length; i < ilen; i += 1) {
				if (trylabels[i] === label) {
					ret.push(true);
				} else {
					ret.push(false);
				}
			}
			return ret;
		};
		this.tests.push(func);
	}
};
CSL.Attributes["@has-publisher-and-publisher-place"] = function (state, arg) {
	this.strings["has-publisher-and-publisher-place"] = true;
};
CSL.Attributes["@publisher-delimiter-precedes-last"] = function (state, arg) {
	this.strings["publisher-delimiter-precedes-last"] = arg;
};
CSL.Attributes["@publisher-delimiter"] = function (state, arg) {
	this.strings["publisher-delimiter"] = arg;
};
CSL.Attributes["@publisher-and"] = function (state, arg) {
	this.strings["publisher-and"] = arg;
};
CSL.Attributes["@newdate"] = function (state, arg) {
};
CSL.Attributes["@position"] = function (state, arg) {
    var tryposition;
	state.opt.update_mode = CSL.POSITION;
	var factory = function (tryposition) {
		return  function (state, Item, item) {
			if (state.tmp.area === "bibliography" || state.tmp.area === "bibliography_sort") {
				return false;
			}
			if (item && "undefined" === typeof item.position) {
				item.position = 0;
			}
			if (item && typeof item.position === "number") {
				if (item.position === 0 && tryposition === 0) {
					return true;
				} else if (tryposition > 0 && item.position >= tryposition) {
					return true;
				}
			} else if (tryposition === 0) {
				return true;
			}
			return false;
		};
	};
	var near_note_func = function (state, Item, item) {
		if (item && item["near-note"]) {
			return true;
		}
		return false;
	};
	var lst = arg.split(/\s+/);
	for (var i = 0, ilen = lst.length; i < ilen; i += 1) {
		if (lst[i] === "first") {
		    tryposition = CSL.POSITION_FIRST;
		} else if (lst[i] === "subsequent") {
		    tryposition = CSL.POSITION_SUBSEQUENT;
		} else if (lst[i] === "ibid") {
		    tryposition = CSL.POSITION_IBID;
		} else if (lst[i] === "ibid-with-locator") {
		    tryposition = CSL.POSITION_IBID_WITH_LOCATOR;
		}
		var func = factory(tryposition);
		this.tests.push(func);
	    if (lst[i] === "near-note") {
			this.tests.push(near_note_func);
	    }
	}
};
CSL.Attributes["@disambiguate"] = function (state, arg) {
	if (this.tokentype === CSL.START && ["if", "else-if"].indexOf(this.name) > -1) {
		if (arg === "true") {
			state.opt.has_disambiguate = true;
			var func = function (state, Item) {
				if (state.tmp.disambig_settings.disambiguate) {
					return true;
				}
				return false;
			};
			this.tests.push(func);
		}
	}
};
CSL.Attributes["@givenname-disambiguation-rule"] = function (state, arg) {
	if (CSL.GIVENNAME_DISAMBIGUATION_RULES.indexOf(arg) > -1) {
		state.opt["givenname-disambiguation-rule"] = arg;
	}
};
CSL.Attributes["@collapse"] = function (state, arg) {
	if (arg) {
		state[this.name].opt.collapse = arg;
	}
};
CSL.Attributes["@names-delimiter"] = function (state, arg) {
	state.setOpt(this, "names-delimiter", arg);
};
CSL.Attributes["@name-form"] = function (state, arg) {
	state.setOpt(this, "name-form", arg);
};
CSL.Attributes["@name-delimiter"] = function (state, arg) {
	state.setOpt(this, "name-delimiter", arg);
};
CSL.Attributes["@et-al-min"] = function (state, arg) {
	var val = parseInt(arg, 10);
	if (state.opt.max_number_of_names < val) {
		state.opt.max_number_of_names = val;
	}
	state.setOpt(this, "et-al-min", val);
};
CSL.Attributes["@et-al-use-first"] = function (state, arg) {
	state.setOpt(this, "et-al-use-first", parseInt(arg, 10));
};
CSL.Attributes["@et-al-use-last"] = function (state, arg) {
	if (arg === "true") {
		state.setOpt(this, "et-al-use-last", true);
	} else {
		state.setOpt(this, "et-al-use-last", false);
	}
};
CSL.Attributes["@et-al-subsequent-min"] = function (state, arg) {
	var val = parseInt(arg, 10);
	if (state.opt.max_number_of_names < val) {
		state.opt.max_number_of_names = val;
	}
	state.setOpt(this, "et-al-subsequent-min", val);
};
CSL.Attributes["@et-al-subsequent-use-first"] = function (state, arg) {
	state.setOpt(this, "et-al-subsequent-use-first", parseInt(arg, 10));
};
CSL.Attributes["@truncate-min"] = function (state, arg) {
	this.strings["truncate-min"] = parseInt(arg, 10);
};
CSL.Attributes["@suppress-min"] = function (state, arg) {
	this.strings["suppress-min"] = parseInt(arg, 10);
};
CSL.Attributes["@and"] = function (state, arg) {
	state.setOpt(this, "and", arg);
};
CSL.Attributes["@delimiter-precedes-last"] = function (state, arg) {
	state.setOpt(this, "delimiter-precedes-last", arg);
};
CSL.Attributes["@delimiter-precedes-et-al"] = function (state, arg) {
	state.setOpt(this, "delimiter-precedes-et-al", arg);
};
CSL.Attributes["@initialize-with"] = function (state, arg) {
	state.setOpt(this, "initialize-with", arg);
};
CSL.Attributes["@name-as-sort-order"] = function (state, arg) {
	state.setOpt(this, "name-as-sort-order", arg);
};
CSL.Attributes["@sort-separator"] = function (state, arg) {
	state.setOpt(this, "sort-separator", arg);
};
CSL.Attributes["@year-suffix-delimiter"] = function (state, arg) {
	state[this.name].opt["year-suffix-delimiter"] = arg;
};
CSL.Attributes["@after-collapse-delimiter"] = function (state, arg) {
	state[this.name].opt["after-collapse-delimiter"] = arg;
};
CSL.Attributes["@subsequent-author-substitute"] = function (state, arg) {
	state[this.name].opt["subsequent-author-substitute"] = arg;
};
CSL.Attributes["@disambiguate-add-names"] = function (state, arg) {
	if (arg === "true") {
		state.opt["disambiguate-add-names"] = true;
	}
};
CSL.Attributes["@disambiguate-add-givenname"] = function (state, arg) {
	if (arg === "true") {
		state.opt["disambiguate-add-givenname"] = true;
	}
};
CSL.Attributes["@disambiguate-add-year-suffix"] = function (state, arg) {
	if (arg === "true") {
		state.opt["disambiguate-add-year-suffix"] = true;
	}
};
CSL.Attributes["@second-field-align"] = function (state, arg) {
	if (arg === "flush" || arg === "margin") {
		state[this.name].opt["second-field-align"] = arg;
	}
};
CSL.Attributes["@hanging-indent"] = function (state, arg) {
	if (arg === "true") {
		state[this.name].opt.hangingindent = 2;
	}
};
CSL.Attributes["@line-spacing"] = function (state, arg) {
	if (arg && arg.match(/^[.0-9]+$/)) {
		state[this.name].opt["line-spacing"] = parseFloat(arg, 10);
	}
};
CSL.Attributes["@entry-spacing"] = function (state, arg) {
	if (arg && arg.match(/^[.0-9]+$/)) {
		state[this.name].opt["entry-spacing"] = parseFloat(arg, 10);
	}
};
CSL.Attributes["@near-note-distance"] = function (state, arg) {
	state[this.name].opt["near-note-distance"] = parseInt(arg, 10);
};
CSL.Attributes["@page-range-format"] = function (state, arg) {
	state.opt["page-range-format"] = arg;
};
CSL.Attributes["@text-case"] = function (state, arg) {
	var func = function (state, Item) {
		this.strings["text-case"] = arg;
		if (arg === "title") {
			var m = false;
			if (Item.language) {
				m = Item.language.match(/^\s*([a-z]{2})(?:$|-| )/);
			}
			if (state.opt["default-locale"][0].slice(0, 2) === "en") {
				if (m && m[1] !== "en") {
					this.strings["text-case"] = "passthrough";
				}
			} else {
				this.strings["text-case"] = "passthrough";
				if (m && m[1] === "en") {
					this.strings["text-case"] = arg;
				}
			}
		}
	}
	this.execs.push(func);
};
CSL.Attributes["@page-range-format"] = function (state, arg) {
	state.opt["page-range-format"] = arg;
};
CSL.Attributes["@default-locale"] = function (state, arg) {
	var lst, len, pos, m, ret;
	m = arg.match(/-x-(sort|pri|sec|name)-/g);
	if (m) {
		for (pos = 0, len = m.length; pos < len; pos += 1) {
			m[pos] = m[pos].replace(/^-x-/, "").replace(/-$/, "");
		}
	}
	lst = arg.split(/-x-(?:sort|pri|sec|name)-/);
	ret = [lst[0]];
	for (pos = 1, len = lst.length; pos < len; pos += 1) {
		ret.push(m[pos - 1]);
		ret.push(lst[pos]);
	}
	lst = ret.slice();
	len = lst.length;
	for (pos = 1; pos < len; pos += 2) {
		state.opt[("locale-" + lst[pos])].push(lst[(pos + 1)].replace(/^\s*/g, "").replace(/\s*$/g, ""));
	}
	if (lst.length) {
		state.opt["default-locale"] = lst.slice(0, 1);
	} else {
		state.opt["default-locale"] = ["en"];
	}
};
CSL.Attributes["@demote-non-dropping-particle"] = function (state, arg) {
	state.opt["demote-non-dropping-particle"] = arg;
};
CSL.Attributes["@initialize-with-hyphen"] = function (state, arg) {
	if (arg === "false") {
		state.opt["initialize-with-hyphen"] = false;
	}
};
CSL.Attributes["@institution-parts"] = function (state, arg) {
	this.strings["institution-parts"] = arg;
};
CSL.Attributes["@if-short"] = function (state, arg) {
	if (arg === "true") {
		this.strings["if-short"] = true;
	}
};
CSL.Attributes["@substitute-use-first"] = function (state, arg) {
	this.strings["substitute-use-first"] = parseInt(arg, 10);
};
CSL.Attributes["@use-first"] = function (state, arg) {
	this.strings["use-first"] = parseInt(arg, 10);
};
CSL.Attributes["@use-last"] = function (state, arg) {
	if (arg.match(/^[0-9]+$/)) {
		this.strings["use-last"] = parseInt(arg, 10);
	}
};
CSL.Attributes["@reverse-order"] = function (state, arg) {
	if ("true" === arg) {
		this.strings["reverse-order"] = true;
	}
};
CSL.Attributes["@display"] = function (state, arg) {
	this.strings.cls = arg;
};
var XML_PARSING;
var CSL_E4X;
var CSL_CHROME;
var DOMParser;
if ("undefined" !== typeof CSL_E4X) {
	XML_PARSING = CSL_E4X;
} else {
	XML_PARSING = CSL_CHROME;
}
CSL.System = {};
CSL.System.Xml = {
	"Parsing": XML_PARSING
};
CSL.Stack = function (val, literal) {
	this.mystack = [];
	if (literal || val) {
		this.mystack.push(val);
	}
};
CSL.Stack.prototype.push = function (val, literal) {
	if (literal || val) {
		this.mystack.push(val);
	} else {
		this.mystack.push("");
	}
};
CSL.Stack.prototype.clear = function () {
	this.mystack = [];
};
CSL.Stack.prototype.replace = function (val, literal) {
	if (this.mystack.length === 0) {
		throw "Internal CSL processor error: attempt to replace nonexistent stack item with " + val;
	}
	if (literal || val) {
		this.mystack[(this.mystack.length - 1)] = val;
	} else {
		this.mystack[(this.mystack.length - 1)] = "";
	}
};
CSL.Stack.prototype.pop = function () {
	return this.mystack.pop();
};
CSL.Stack.prototype.value = function () {
	return this.mystack.slice(-1)[0];
};
CSL.Stack.prototype.length = function () {
	return this.mystack.length;
};
CSL.Util = {};
CSL.Util.Match = function () {
	this.any = function (token, state, Item, item) {
		var ret = false;
		for (var i = 0, ilen = token.tests.length; i < ilen; i += 1) {
			var func = token.tests[i];
			var reslist = func.call(token, state, Item, item);
			if ("object" !== typeof reslist) {
				reslist = [reslist];
			}
			for (var j = 0, jlen = reslist.length; j < jlen; j += 1) {
				if (reslist[j]) {
					ret = true;
					break;
				}
			}
			if (ret) {
				break;
			}
		}
		if (ret) {
			ret = token.succeed;
			state.tmp.jump.replace("succeed");
		} else {
			ret = token.fail;
			state.tmp.jump.replace("fail");
		}
		return ret;
	};
	this.none = function (token, state, Item, item) {
		var ret = true;
		for (var i = 0, ilen = this.tests.length; i < ilen; i += 1) {
			var func = this.tests[i];
			var reslist = func.call(token, state, Item, item);
			if ("object" !== typeof reslist) {
				reslist = [reslist];
			}
			for (var j = 0, jlen = reslist.length; j < jlen; j += 1) {
				if (reslist[j]) {
					ret = false;
					break;
				}
			}
			if (!ret) {
				break;
			}
		}
		if (ret) {
			ret = token.succeed;
			state.tmp.jump.replace("succeed");
		} else {
			ret = token.fail;
			state.tmp.jump.replace("fail");
		}
		return ret;
	};
	this.all = function (token, state, Item, item) {
		var ret = true;
		for (var i = 0, ilen = this.tests.length; i < ilen; i += 1) {
			var func = this.tests[i];
			var reslist = func.call(token, state, Item, item);
			if ("object" !== typeof reslist) {
				reslist = [reslist];
			}
			for (var j = 0, jlen = reslist.length; j < jlen; j += 1) {
				if (!reslist[j]) {
					ret = false;
					break;
				}
			}
			if (!ret) {
				break;
			}
		}
		if (ret) {
			ret = token.succeed;
			state.tmp.jump.replace("succeed");
		} else {
			ret = token.fail;
			state.tmp.jump.replace("fail");
		}
		return ret;
	};
};
CSL.Transform = function (state) {
	var debug = false, abbreviations, token, fieldname, subsection, opt;
	this["container-title"] = {};
	this["collection-title"] = {};
	this.institution = {};
	this.authority = {};
	this.title = {};
	this.publisher = {};
	this["publisher-place"] = {};
	this.hereinafter = {};
	abbreviations = "default";
	function init(t, f, x) {
		token = t;
		fieldname = f;
		subsection = x;
		opt = {
			abbreviation_fallback: false,
			alternative_varname: false,
			transform_locale: false,
			transform_fallback: false
		};
	}
	this.init = init;
	function abbreviate(state, Item, altvar, basevalue, mysubsection, use_field) {
		var value;
		if (!mysubsection) {
			return basevalue;
		}
		value = "";
		if (state.transform[mysubsection]) {
			if (state.transform[mysubsection][basevalue]) {
				value = state.transform[mysubsection][basevalue];
			} else if ("string" != typeof state.transform[mysubsection][basevalue]) {
				state.transform[mysubsection][basevalue] = "";
			}
		}
		if (!value && Item[altvar] && use_field) {
			value = Item[altvar];
		}
		if (!value) {
			value = basevalue;
		}
		return value;
	}
	function getTextSubField(Item, field, locale_type, use_default) {
		var m, lst, opt, o, oo, pos, key, ret, len, myret, opts;
		if (!Item[field]) {
			return "";
		}
		ret = "";
		opts = state.opt[locale_type];
		if ("undefined" === typeof opts) {
			opts = state.opt["default-locale"];
		}
		for (var i = 0, ilen = opts.length; i < ilen; i += 1) {
			opt = opts[i];
			o = opt.split(/[\-_]/)[0];
			if (opt && Item.multi && Item.multi._keys[field] && Item.multi._keys[field][opt]) {
				ret = Item.multi._keys[field][opt];
				break;
			} else if (o && Item.multi && Item.multi._keys[field] && Item.multi._keys[field][o]) {
				ret = Item.multi._keys[field][o];
				break;
			}
		}
		if (!ret && use_default) {
			ret = Item[field];
		}
		return ret;
	}
	function setAbbreviationFallback(b) {
		opt.abbreviation_fallback = b;
	}
	this.setAbbreviationFallback = setAbbreviationFallback;
	function setAlternativeVariableName(s) {
		opt.alternative_varname = s;
	}
	this.setAlternativeVariableName = setAlternativeVariableName;
	function setTransformLocale(s) {
		opt.transform_locale = s;
	}
	this.setTransformLocale = setTransformLocale;
	function setTransformFallback(b) {
		opt.transform_fallback = b;
	}
	this.setTransformFallback = setTransformFallback;
	function setAbbreviations(name) {
		var vartype, pos, len;
		if (name) {
			abbreviations = name;
		}
		len = CSL.MULTI_FIELDS.length;
		for (pos = 0; pos < len; pos += 1) {
			vartype = CSL.MULTI_FIELDS[pos];
			this[vartype] = state.sys.getAbbreviations(abbreviations, vartype);
		}
	}
	this.setAbbreviations = setAbbreviations;
	function publisherCheck (varname, primary, tok) {
		if (state.publisherOutput && primary) {
			if (["publisher","publisher-place"].indexOf(varname) === -1) {
				return false;
			} else {
				state.publisherOutput[varname + "-token"] = tok;
				state.publisherOutput.varlist.push(varname);
				var lst = primary.split(/;\s*/);
				if (lst.length === state.publisherOutput[varname + "-list"].length) {
					state.tmp[varname + "-list"] = lst;
				}
				state.tmp[varname + "-token"] = tok;
				return true;
			}
		}
		return false;
	};
	function getOutputFunction(variables) {
		var mytoken, mysubsection, myfieldname, abbreviation_fallback, alternative_varname, transform_locale, transform_fallback, getTextSubfield;
		mytoken = CSL.Util.cloneToken(token); // the token isn't needed, is it?
		mysubsection = subsection;
		myfieldname = fieldname;
		abbreviation_fallback = opt.abbreviation_fallback;
		alternative_varname = opt.alternative_varname;
		transform_locale = opt.transform_locale;
		transform_fallback = opt.transform_fallback;
		if (transform_locale === "locale-sec") {
			return function (state, Item) {
				var primary, secondary, primary_tok, secondary_tok, key;
				if (!variables[0]) {
					return null;
				}
				if (state.tmp["publisher-list"]) {
					if (variables[0] === "publisher") {
						state.tmp["publisher-token"] = this;
					} else if (variables[0] === "publisher-place") {
						state.tmp["publisher-place-token"] = this;
					}
					return null;
				}
				if (state.opt["locale-suppress-title-transliteration"] 
					|| !((state.tmp.area === 'bibliography'
						|| (state.opt.xclass === "note" &&
							state.tmp.area === "citation"))
						)
					) {
					primary = Item[myfieldname];
				} else {
					primary = getTextSubField(Item, myfieldname, "locale-pri", transform_fallback);
				}
				if (mysubsection) {
					primary = abbreviate(state, Item, alternative_varname, primary, mysubsection, true);
				}
				secondary = getTextSubField(Item, myfieldname, "locale-sec");
				if (secondary && ((state.tmp.area === 'bibliography' || (state.opt.xclass === "note" && state.tmp.area === "citation")))) {
					if (mysubsection) {
						secondary = abbreviate(state, Item, alternative_varname, secondary, mysubsection, true);
					}
					primary_tok = CSL.Util.cloneToken(this);
					primary_tok.strings.suffix = "";
					secondary_tok = new CSL.Token("text", CSL.SINGLETON);
					secondary_tok.strings.suffix = "]" + this.strings.suffix;
					secondary_tok.strings.prefix = " [";
					state.output.append(primary, primary_tok);
					state.output.append(secondary, secondary_tok);
				} else {
					state.output.append(primary, this);
				}
				return null;
			};
		} else {
			return function (state, Item) {
				var primary;
				if (!variables[0]) {
					return null;
				}
				primary = getTextSubField(Item, myfieldname, transform_locale, transform_fallback);
				if (publisherCheck(variables[0], primary, this)) {
					return null;
				} else {
					state.output.append(primary, this);
				}
				return null;
			};
		}
	}
	this.getOutputFunction = getOutputFunction;
	function output(state, basevalue, token_short, token_long, use_fallback) {
		var shortvalue;
		shortvalue = state.transform.institution[basevalue];
		if (shortvalue) {
			state.output.append(shortvalue, token_short);
		} else {
			if (use_fallback) {
				state.output.append(basevalue, token_long);
			}
		}
	}
	this.output = output;
	function getStaticOrder (name, refresh) {
		var static_ordering_val = false;
		if (!refresh && name["static-ordering"]) {
			static_ordering_val = true;
		} else if (!(name.family.replace('"', '', 'g') + name.given).match(CSL.ROMANESQUE_REGEXP)) {
			static_ordering_val = true;
		} else if (name.multi && name.multi.main && name.multi.main.slice(0,2) == 'vn') {
			static_ordering_val = true;
		} else {
			if (state.opt['auto-vietnamese-names']
				&& (CSL.VIETNAMESE_NAMES.exec(name.family + " " + name.given)
					&& CSL.VIETNAMESE_SPECIALS.exec(name.family + name.given))) {
				static_ordering_val = true;
			}
		}
		return static_ordering_val;
	}
	function getName (state, name, langTags) {
		var i, ret, optLangTag, ilen, key, langTag;
		if (state.tmp.area.slice(-5) === "_sort") {
			 langTags = state.opt["locale-sort"];
		}
		if ("string" === typeof langTags) {
			langTags = [langTags];
		}
		if (!name.family) {
			name.family = "";
		}
		if (!name.given) {
			name.given = "";
		}
		var static_ordering_freshcheck = false;
		var block_initialize = false;
		var transliterated = false;
		var static_ordering_val = getStaticOrder(name);
		if (langTags && name.multi) {
			for (i = 0, ilen = langTags.length; i < ilen; i += 1) {
				langTag = langTags[i];
				if (name.multi._key[langTag]) {
					name = name.multi._key[langTag];
					transliterated = true;
					if (!state.opt['locale-use-original-name-format']) {
						static_ordering_freshcheck = true;
					} else {
						if ((name.family.replace('"','','g') + name.given).match(CSL.ROMANESQUE_REGEXP)) {
							block_initialize = true;
						}
					}
					break;
				}
			}
		}
		name = {
			family:name.family,
			given:name.given,
			"non-dropping-particle":name["non-dropping-particle"],
			"dropping-particle":name["dropping-particle"],
			suffix:name.suffix,
			"static-ordering":static_ordering_val,
			"parse-names":name["parse-names"],
			"comma-suffix":name["comma-suffix"],
			"comma-dropping-particle":name["comma-dropping-particle"],
			transliterated:transliterated,
			block_initialize:block_initialize,
			literal:name.literal,
			isInstitution:name.isInstitution
		};
		if (static_ordering_freshcheck &&
			!getStaticOrder(name, true)) {
			name["static-ordering"] = false;
		}
		if (!name.literal && (!name.given && name.family && name.isInstitution)) {
			name.literal = name.family;
		}
		if (name.literal) {
			delete name.family;
			delete name.given;
		}
		return name;
	}
	this.name = getName;
};
CSL.Parallel = function (state) {
	this.state = state;
	this.sets = new CSL.Stack([]);
	this.try_cite = true;
	this.use_parallels = true;
};
CSL.Parallel.prototype.isMid = function (variable) {
	return ["section", "volume", "container-title", "issue", "page", "page-first", "locator"].indexOf(variable) > -1;
};
CSL.Parallel.prototype.StartCitation = function (sortedItems, out) {
	if (this.use_parallels) {
		this.sortedItems = sortedItems;
		this.sortedItemsPos = -1;
		this.sets.clear();
		this.sets.push([]);
		this.in_series = true;
		this.delim_counter = 0;
		this.delim_pointers = [];
		if (out) {
			this.out = out;
		} else {
			this.out = this.state.output.queue;
		}
	}
};
CSL.Parallel.prototype.StartCite = function (Item, item, prevItemID) {
	var position, len, pos, x, curr, master, last_id, prev_locator, curr_locator, is_master, parallel;
	if (this.use_parallels) {
		if (this.sets.value().length && this.sets.value()[0].itemId == Item.id) {
			this.ComposeSet();
		}
		this.sortedItemsPos += 1;
		if (item) {
			position = item.position;
		}
		this.try_cite = true;
		len = CSL.PARALLEL_MATCH_VARS.length;
		for (pos = 0; pos < len; pos += 1) {
			x = CSL.PARALLEL_MATCH_VARS[pos];
			if (!Item[x] || CSL.PARALLEL_TYPES.indexOf(Item.type) === -1) {
				this.try_cite = false;
				if (this.in_series) {
					this.in_series = false;
				}
				break;
			}
		}
		this.cite = {};
		this.cite.front = [];
		this.cite.mid = [];
		this.cite.back = [];
		this.cite.front_collapse = {};
		this.cite.back_forceme = [];
		this.cite.position = position;
		this.cite.Item = Item;
		this.cite.itemId = "" + Item.id;
		this.cite.prevItemID = "" + prevItemID;
		this.target = "front";
		if (this.sortedItems && this.sortedItemsPos > 0 && this.sortedItemsPos < this.sortedItems.length) {
			curr = this.sortedItems[this.sortedItemsPos][1];
			last_id = "" + this.sortedItems[(this.sortedItemsPos - 1)][1].id;
			master = this.state.registry.registry[last_id].parallel;
			prev_locator = false;
			if (master == curr.id) {
				len = this.sortedItemsPos - 1;
				for (pos = len; pos > -1; pos += -1) {
					if (this.sortedItems[pos][1].id == Item.id) {
						prev_locator = this.sortedItems[pos][1].locator;
						break;
					}
				}
				curr_locator = this.sortedItems[this.sortedItemsPos][1].locator;
				if (!prev_locator && curr_locator) {
					curr.position = CSL.POSITION_IBID_WITH_LOCATOR;
				} else if (curr_locator === prev_locator) {
					curr.position = CSL.POSITION_IBID;
				} else {
					curr.position = CSL.POSITION_IBID_WITH_LOCATOR;
				}
			}
		}
		this.force_collapse = false;
		if (this.state.registry.registry[Item.id].parallel) {
			this.force_collapse = true;
		}
	}
};
CSL.Parallel.prototype.StartVariable = function (variable) {
	if (this.use_parallels && (this.try_cite || this.force_collapse)) {
		this.variable = variable;
		this.data = {};
		this.data.value = "";
		this.data.blobs = [];
		var is_mid = this.isMid(variable);
		if (this.target === "front" && is_mid) {
			this.target = "mid";
		} else if (this.target === "mid" && !is_mid && this.cite.Item.title) {
			this.target = "back";
		} else if (this.target === "back" && is_mid) {
			this.try_cite = true;
			this.in_series = false;
		}
		if (variable === "number") {
			this.cite.front.push(variable);
		} else if (CSL.PARALLEL_COLLAPSING_MID_VARSET.indexOf(variable) > -1) {
			this.cite.front.push(variable);
		} else {
			this.cite[this.target].push(variable);
		}
	}
};
CSL.Parallel.prototype.AppendBlobPointer = function (blob) {
	if (this.use_parallels && this.variable && (this.try_cite || this.force_collapse) && blob && blob.blobs) {
		this.data.blobs.push([blob, blob.blobs.length]);
	}
};
CSL.Parallel.prototype.AppendToVariable = function (str, varname) {
	if (this.use_parallels && (this.try_cite || this.force_collapse)) {
		if (this.target !== "back" || true) {
			this.data.value += "::" + str;
		} else {
			var prev = this.sets.value()[(this.sets.value().length - 1)];
			if (prev) {
				if (prev[this.variable]) {
					if (prev[this.variable].value) {
						this.data.value += "::" + str;
					}
				}
			}
		}
	}
};
CSL.Parallel.prototype.CloseVariable = function (hello) {
	if (this.use_parallels && (this.try_cite || this.force_collapse)) {
		this.cite[this.variable] = this.data;
		if (this.sets.value().length > 0) {
			var prev = this.sets.value()[(this.sets.value().length - 1)];
			if (this.target === "front") {
				if (!(!prev[this.variable] && !this.data.value) && (!prev[this.variable] || this.data.value !== prev[this.variable].value)) {
					this.in_series = false;
				}
			} else if (this.target === "mid") {
				if (CSL.PARALLEL_COLLAPSING_MID_VARSET.indexOf(this.variable) > -1) {
					if (prev[this.variable]) {
						if (prev[this.variable].value === this.data.value) {
							this.cite.front_collapse[this.variable] = true;
						} else {
							this.cite.front_collapse[this.variable] = false;
						}
					} else {
						this.cite.front_collapse[this.variable] = false;
					}
				}
			} else if (this.target === "back") {
				if (prev[this.variable]) {
					if (this.data.value !== prev[this.variable].value && this.sets.value().slice(-1)[0].back_forceme.indexOf(this.variable) === -1) {
						this.in_series = false;
					}
				}
			}
		}
	}
	this.variable = false;
};
CSL.Parallel.prototype.CloseCite = function () {
	var x, pos, len, has_issued, use_journal_info, volume_pos, container_title_pos, section_pos;
	if (this.use_parallels) {
		use_journal_info = false;
		if (!this.cite.front_collapse["container-title"]) {
			use_journal_info = true;
		}
		if (this.cite.front_collapse.volume === false) {
			use_journal_info = true;
		}
		if (this.cite.front_collapse.section === false) {
			use_journal_info = true;
		}
		if (use_journal_info) {
			this.cite.use_journal_info = true;
			section_pos = this.cite.front.indexOf("section");
			if (section_pos > -1) {
				this.cite.front = this.cite.front.slice(0,section_pos).concat(this.cite.front.slice(section_pos + 1));
			}
			volume_pos = this.cite.front.indexOf("volume");
			if (volume_pos > -1) {
				this.cite.front = this.cite.front.slice(0,volume_pos).concat(this.cite.front.slice(volume_pos + 1));
			}
			container_title_pos = this.cite.front.indexOf("container-title");
			if (container_title_pos > -1) {
				this.cite.front = this.cite.front.slice(0,container_title_pos).concat(this.cite.front.slice(container_title_pos + 1));
			}
		}
		if (!this.in_series && !this.force_collapse) {
			this.ComposeSet(true);
		}
		if (this.sets.value().length === 0) {
			has_issued = false;
			for (pos = 0, len = this.cite.back.length; pos < len; pos += 1) {
				x = this.cite.back[pos];
				if (x === "issued" && this.cite.issued && this.cite.issued.value) {
					has_issued = true;
					break;
				}
			}
			if (!has_issued) {
				this.cite.back_forceme.push("issued");
			}
		} else {
			this.cite.back_forceme = this.sets.value().slice(-1)[0].back_forceme;
		}
		this.sets.value().push(this.cite);
	}
};
CSL.Parallel.prototype.ComposeSet = function (next_output_in_progress) {
	var cite, pos, master, len;
	if (this.use_parallels) {
		if (this.sets.value().length === 1) {
			if (!this.in_series) {
				this.sets.value().pop();
				this.delim_counter += 1;
			}
		} else {
			len = this.sets.value().length;
			for (pos = 0; pos < len; pos += 1) {
				cite = this.sets.value()[pos];
				if (pos === 0) {
					this.delim_counter += 1;
				} else {
					if (!cite.Item.title && cite.use_journal_info) {
						this.delim_pointers.push(false);
					} else {
						this.delim_pointers.push(this.delim_counter);
					}
					this.delim_counter += 1;
				}
				if (CSL.POSITION_FIRST === cite.position) {
					if (pos === 0) {
						this.state.registry.registry[cite.itemId].master = true;
						this.state.registry.registry[cite.itemId].siblings = [];
					} else {
						if (cite.prevItemID) {
							if (!this.state.registry.registry[cite.prevItemID].parallel) {
								this.state.registry.registry[cite.itemId].parallel = cite.prevItemID;
							} else {
								this.state.registry.registry[cite.itemId].parallel = this.state.registry.registry[cite.prevItemID].parallel;
							}
							this.state.registry.registry[cite.itemId].siblings = this.state.registry.registry[cite.prevItemID].siblings;
							if (!this.state.registry.registry[cite.itemId].siblings) {
								this.state.registry.registry[cite.itemId].siblings = [];
								CSL.debug("WARNING: adding missing siblings array to registry object");
							}
							this.state.registry.registry[cite.itemId].siblings.push(cite.itemId);
						}
					}
				}
			}
			this.sets.push([]);
		}
		this.in_series = true;
	}
};
CSL.Parallel.prototype.PruneOutputQueue = function () {
	var len, pos, series, ppos, llen, cite;
	if (this.use_parallels) {
		len = this.sets.mystack.length;
		for (pos = 0; pos < len; pos += 1) {
			series = this.sets.mystack[pos];
			if (series.length > 1) {
				llen = series.length;
				for (ppos = 0; ppos < llen; ppos += 1) {
					cite = series[ppos];
					if (ppos === 0) {
						this.purgeVariableBlobs(cite, cite.back);
					} else if (ppos === (series.length - 1)) {
						this.purgeVariableBlobs(cite, cite.front.concat(cite.back_forceme));
					} else {
						this.purgeVariableBlobs(cite, cite.front.concat(cite.back));
					}
				}
			}
		}
	}
};
CSL.Parallel.prototype.purgeVariableBlobs = function (cite, varnames) {
	var len, pos, varname, b, llen, ppos, out;
	if (this.use_parallels) {
		out = this.state.output.current.value();
		if ("undefined" === typeof out.length) {
			out = out.blobs;
		}
		for (pos = 0, len = this.delim_pointers.length; pos < len; pos += 1) {
			ppos = this.delim_pointers[pos];
			if (ppos !== false) {
				out[ppos].parallel_delimiter = ", ";
			}
		}
		len = varnames.length - 1;
		for (pos = len; pos > -1; pos += -1) {
			varname = varnames[pos];
			if (cite[varname]) {
				llen = cite[varname].blobs.length - 1;
				for (ppos = llen; ppos > -1; ppos += -1) {
					b = cite[varname].blobs[ppos];
					b[0].blobs = b[0].blobs.slice(0, b[1]).concat(b[0].blobs.slice((b[1] + 1)));
				}
			}
		}
	}
};
CSL.Token = function (name, tokentype) {
	this.name = name;
	this.strings = {};
	this.strings.delimiter = undefined;
	this.strings.prefix = "";
	this.strings.suffix = "";
	this.decorations = false;
	this.variables = [];
	this.execs = [];
	this.tokentype = tokentype;
	this.evaluator = false;
	this.tests = [];
	this.succeed = false;
	this.fail = false;
	this.next = false;
};
CSL.Util.cloneToken = function (token) {
	var newtok, key, pos, len;
	if ("string" === typeof token) {
		return token;
	}
	newtok = new CSL.Token(token.name, token.tokentype);
	for (key in token.strings) {
		if (token.strings.hasOwnProperty(key)) {
			newtok.strings[key] = token.strings[key];
		}
	}
	if (token.decorations) {
		newtok.decorations = [];
		for (pos = 0, len = token.decorations.length; pos < len; pos += 1) {
			newtok.decorations.push(token.decorations[pos].slice());
		}
	}
	if (token.variables) {
		newtok.variables = token.variables.slice();
	}
	if (token.execs) {
		newtok.execs = token.execs.slice();
		newtok.tests = token.tests.slice();
	}
	return newtok;
};
CSL.AmbigConfig = function () {
	this.maxvals = [];
	this.minval = 1;
	this.names = [];
	this.givens = [];
	this.year_suffix = false;
	this.disambiguate = 0;
};
CSL.Blob = function (token, str, levelname) {
	var len, pos, key;
	this.levelname = levelname;
	if (token) {
		this.strings = {};
		for (key in token.strings) {
			if (token.strings.hasOwnProperty(key)) {
				this.strings[key] = token.strings[key];
			}
		}
		this.decorations = [];
		if (token.decorations === undefined) {
			len = 0;
		} else {
			len = token.decorations.length;
		}
		for (pos = 0; pos < len; pos += 1) {
			this.decorations.push(token.decorations[pos].slice());
		}
	} else {
		this.strings = {};
		this.strings.prefix = "";
		this.strings.suffix = "";
		this.strings.delimiter = "";
		this.decorations = [];
	}
	if ("string" === typeof str) {
		this.blobs = str;
	} else if (str) {
		this.blobs = [str];
	} else {
		this.blobs = [];
	}
	this.alldecor = [this.decorations];
};
CSL.Blob.prototype.push = function (blob) {
	if ("string" === typeof this.blobs) {
		throw "Attempt to push blob onto string object";
	} else {
		blob.alldecor = blob.alldecor.concat(this.alldecor);
		this.blobs.push(blob);
	}
};
CSL.NumericBlob = function (num, mother_token) {
	this.alldecor = [];
	this.num = num;
	this.blobs = num.toString();
	this.status = CSL.START;
	this.strings = {};
	if (mother_token) {
		this.decorations = mother_token.decorations;
		this.strings.prefix = mother_token.strings.prefix;
		this.strings.suffix = mother_token.strings.suffix;
		this.strings["text-case"] = mother_token.strings["text-case"];
		this.successor_prefix = mother_token.successor_prefix;
		this.range_prefix = mother_token.range_prefix;
		this.splice_prefix = mother_token.splice_prefix;
		this.formatter = mother_token.formatter;
		if (!this.formatter) {
			this.formatter =  new CSL.Output.DefaultFormatter();
		}
		if (this.formatter) {
			this.type = this.formatter.format(1);
		}
	} else {
		this.decorations = [];
		this.strings.prefix = "";
		this.strings.suffix = "";
		this.successor_prefix = "";
		this.range_prefix = "";
		this.splice_prefix = "";
		this.formatter = new CSL.Output.DefaultFormatter();
	}
};
CSL.NumericBlob.prototype.setFormatter = function (formatter) {
	this.formatter = formatter;
	this.type = this.formatter.format(1);
};
CSL.Output.DefaultFormatter = function () {};
CSL.Output.DefaultFormatter.prototype.format = function (num) {
	return num.toString();
};
CSL.NumericBlob.prototype.checkNext = function (next) {
	if (! next || !next.num || this.type !== next.type || next.num !== (this.num + 1)) {
		if (this.status === CSL.SUCCESSOR_OF_SUCCESSOR) {
			this.status = CSL.END;
		}
		if ("object" === typeof next) {
			next.status = CSL.SEEN;
		}
	} else { // next number is in the sequence
		if (this.status === CSL.START || this.status === CSL.SEEN) {
			next.status = CSL.SUCCESSOR;
		} else if (this.status === CSL.SUCCESSOR || this.status === CSL.SUCCESSOR_OF_SUCCESSOR) {
			if (this.range_prefix) {
				next.status = CSL.SUCCESSOR_OF_SUCCESSOR;
				this.status = CSL.SUPPRESS;
			} else {
				next.status = CSL.SUCCESSOR;
			}
		}
	}
};
CSL.NumericBlob.prototype.checkLast = function (last) {
    if (this.status === CSL.SEEN 
	|| (last.num !== (this.num - 1) && this.status === CSL.SUCCESSOR)) {
		this.status = CSL.SUCCESSOR;
		return true;
    }
    return false;
};
CSL.Util.fixDateNode = function (parent, pos, node) {
	var form, variable, datexml, subnode, partname, attr, val, prefix, suffix, children, key, subchildren, kkey, display;
	form = this.sys.xml.getAttributeValue(node, "form");
	var lingo = this.sys.xml.getAttributeValue(node, "lingo");
	if (!this.state.getDate(form)) {
		return parent;
	}
	var dateparts = this.sys.xml.getAttributeValue(node, "date-parts");
	variable = this.sys.xml.getAttributeValue(node, "variable");
	prefix = this.sys.xml.getAttributeValue(node, "prefix");
	suffix = this.sys.xml.getAttributeValue(node, "suffix");
	display = this.sys.xml.getAttributeValue(node, "display");
	datexml = this.sys.xml.nodeCopy(this.state.getDate(form));
	this.sys.xml.setAttribute(datexml, 'lingo', this.state.opt.lang);
	this.sys.xml.setAttribute(datexml, 'form', form);
	this.sys.xml.setAttribute(datexml, 'date-parts', dateparts);
	this.sys.xml.setAttribute(datexml, 'variable', variable);
	if (prefix) {
		this.sys.xml.setAttribute(datexml, "prefix", prefix);
	}
	if (suffix) {
		this.sys.xml.setAttribute(datexml, "suffix", suffix);
	}
	if (display) {
		this.sys.xml.setAttribute(datexml, "display", display);
	}
	children = this.sys.xml.children(node);
	for (key in children) {
			subnode = children[key];
			if ("date-part" === this.sys.xml.nodename(subnode)) {
				partname = this.sys.xml.getAttributeValue(subnode, "name");
				subchildren = this.sys.xml.attributes(subnode);
				for (attr in subchildren) {
					if (subchildren.hasOwnProperty(attr)) {
						if ("@name" === attr) {
							continue;
						}
						if (lingo && lingo !== this.state.opt.lang) {
							if (["@suffix", "@prefix", "@form"].indexOf(attr) > -1) {
								continue;
							}
						}
						val = subchildren[attr];
						this.sys.xml.setAttributeOnNodeIdentifiedByNameAttribute(datexml, "date-part", partname, attr, val);
					}
				}
			}
	}
	if ("year" === this.sys.xml.getAttributeValue(node, "date-parts")) {
		this.sys.xml.deleteNodeByNameAttribute(datexml, 'month');
		this.sys.xml.deleteNodeByNameAttribute(datexml, 'day');
	} else if ("year-month" === this.sys.xml.getAttributeValue(node, "date-parts")) {
		this.sys.xml.deleteNodeByNameAttribute(datexml, 'day');
	}
	return this.sys.xml.insertChildNodeAfter(parent, node, pos, datexml);
};
CSL.Util.Names = {};
CSL.Util.Names.compareNamesets = CSL.NameOutput.prototype._compareNamesets;
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
			namelist[i] = namelist[i].slice(0, 1) + namelist[i].slice(1, 2).toLowerCase() + namelist[i].slice(2);
		}
		ret += namelist[i];
		if (i < ilen - 1) {
			ret += punctlist[i];
		}
	}
	return ret;
};
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
CSL.Util.Dates = {};
CSL.Util.Dates.year = {};
CSL.Util.Dates.year["long"] = function (state, num) {
	if (!num) {
		if ("boolean" === typeof num) {
			num = "";
		} else {
			num = 0;
		}
	}
	return num.toString();
};
CSL.Util.Dates.year["short"] = function (state, num) {
	num = num.toString();
	if (num && num.length === 4) {
		return num.substr(2);
	}
};
CSL.Util.Dates.year.numeric = function (state, num) {
	var m, pre;
	num = "" + num;
	m = num.match(/([0-9]*)$/);
	if (m) {
		pre = num.slice(0, m[1].length * -1);
		num = m[1];
	} else {
		pre = num;
		num = "";
	}
	while (num.length < 4) {
		num = "0" + num;
	}
	return (pre + num);
};
CSL.Util.Dates.month = {};
CSL.Util.Dates.month.numeric = function (state, num) {
	if (num) {
		num = parseInt(num, 10);
		if (num > 12) {
			num = "";
		}
	}
	var ret = "" + num;
	return ret;
};
CSL.Util.Dates.month["numeric-leading-zeros"] = function (state, num) {
	if (!num) {
		num = 0;
	}
	num = parseInt(num, 10);
	if (num > 12) {
		num = 0;
	}
	num = "" + num;
	while (num.length < 2) {
		num = "0" + num;
	}
	return num.toString();
};
CSL.Util.Dates.month["long"] = function (state, num) {
	var stub = "month-";
	num = parseInt(num, 10);
	if (num > 12) {
		stub = "season-";
		if (num > 16) {
			num = num - 16;
		} else {
			num = num - 12;
		}
	}
	num = "" + num;
	while (num.length < 2) {
		num = "0" + num;
	}
	num = stub + num;
	return state.getTerm(num, "long", 0);
};
CSL.Util.Dates.month["short"] = function (state, num) {
	var stub = "month-";
	num = parseInt(num, 10);
	if (num > 12) {
		stub = "season-";
		if (num > 16) {
			num = num - 16;
		} else {
			num = num - 12;
		}
	}
	num = "" + num;
	while (num.length < 2) {
		num = "0" + num;
	}
	num = "month-" + num;
	return state.getTerm(num, "short", 0);
};
CSL.Util.Dates.day = {};
CSL.Util.Dates.day.numeric = function (state, num) {
	return num.toString();
};
CSL.Util.Dates.day["long"] = CSL.Util.Dates.day.numeric;
CSL.Util.Dates.day["numeric-leading-zeros"] = function (state, num) {
	if (!num) {
		num = 0;
	}
	num = num.toString();
	while (num.length < 2) {
		num = "0" + num;
	}
	return num.toString();
};
CSL.Util.Dates.day.ordinal = function (state, num, gender) {
	return state.fun.ordinalizer.format(num, gender);
};
CSL.Util.Sort = {};
CSL.Util.Sort.strip_prepositions = function (str) {
	var m;
	if ("string" === typeof str) {
		m = str.toLocaleLowerCase();
		m = str.match(/^((a|an|the)\s+)/);
	}
	if (m) {
		str = str.substr(m[1].length);
	}
	return str;
};
CSL.Util.substituteStart = function (state, target) {
	var element_trace, display, bib_first, func, choose_start, if_start, nodetypes;
	var func = function (state, Item) {
		for (var i = 0, ilen = this.decorations.length; i < ilen; i += 1) {
			if ("@strip-periods" === this.decorations[i][0] && "true" === this.decorations[i][1]) {
				state.tmp.strip_periods += 1;
				break;
			}
		}
	}
	this.execs.push(func);
	nodetypes = ["number", "date", "names"];
	if (("text" === this.name && !this.postponed_macro) || nodetypes.indexOf(this.name) > -1) {
		element_trace = function (state, Item, item) {
			if (state.tmp.element_trace.value() === "author" || "names" === this.name) {
				if (item && item["author-only"]) {
					state.tmp.element_trace.push("do-not-suppress-me");
				} else if (item && item["suppress-author"]) {
				}
			} else {
				if (item && item["author-only"]) {
					state.tmp.element_trace.push("suppress-me");
				} else if (item && item["suppress-author"]) {
					state.tmp.element_trace.push("do-not-suppress-me");
				}
			}
		};
		this.execs.push(element_trace);
	}
	display = this.strings.cls;
	this.strings.cls = false;
	if (state.build.render_nesting_level === 0) {
		if (state.build.area === "bibliography" && state.bibliography.opt["second-field-align"]) {
			bib_first = new CSL.Token("group", CSL.START);
			bib_first.decorations = [["@display", "left-margin"]];
			func = function (state, Item) {
				if (!state.tmp.render_seen) {
					bib_first.strings.first_blob = Item.id;
					state.output.startTag("bib_first", bib_first);
				}
			};
			bib_first.execs.push(func);
			target.push(bib_first);
		} else if (CSL.DISPLAY_CLASSES.indexOf(display) > -1) {
			bib_first = new CSL.Token("group", CSL.START);
			bib_first.decorations = [["@display", display]];
			func = function (state, Item) {
				bib_first.strings.first_blob = Item.id;
				state.output.startTag("bib_first", bib_first);
			};
			bib_first.execs.push(func);
			target.push(bib_first);
		}
		state.build.cls = display;
	}
	state.build.render_nesting_level += 1;
	if (state.build.substitute_level.value() === 1) {
		choose_start = new CSL.Token("choose", CSL.START);
		CSL.Node.choose.build.call(choose_start, state, target);
		if_start = new CSL.Token("if", CSL.START);
		func = function (state, Item) {
			if (state.tmp.can_substitute.value()) {
				return true;
			}
			return false;
		};
		if_start.tests.push(func);
		if_start.evaluator = state.fun.match.any;
		target.push(if_start);
	}
};
CSL.Util.substituteEnd = function (state, target) {
	var func, bib_first_end, bib_other, if_end, choose_end, toplevel, hasval, author_substitute, str;
	var func = function (state, Item) {
		for (var i = 0, ilen = this.decorations.length; i < ilen; i += 1) {
			if ("@strip-periods" === this.decorations[i][0] && "true" === this.decorations[i][1]) {
				state.tmp.strip_periods += -1;
				break;
			}
		}
	}
	this.execs.push(func);
	state.build.render_nesting_level += -1;
	if (state.build.render_nesting_level === 0) {
		if (state.build.cls) {
			func = function (state, Item) {
				state.output.endTag("bib_first");
			};
			this.execs.push(func);
			state.build.cls = false;
		} else if (state.build.area === "bibliography" && state.bibliography.opt["second-field-align"]) {
			bib_first_end = new CSL.Token("group", CSL.END);
			func = function (state, Item) {
				if (!state.tmp.render_seen) {
					state.output.endTag(); // closes bib_first
				}
			};
			bib_first_end.execs.push(func);
			target.push(bib_first_end);
			bib_other = new CSL.Token("group", CSL.START);
			bib_other.decorations = [["@display", "right-inline"]];
			func = function (state, Item) {
				if (!state.tmp.render_seen) {
					state.tmp.render_seen = true;
					state.output.startTag("bib_other", bib_other);
				}
			};
			bib_other.execs.push(func);
			target.push(bib_other);
		}
	}
	if (state.build.substitute_level.value() === 1) {
		if_end = new CSL.Token("if", CSL.END);
		target.push(if_end);
		choose_end = new CSL.Token("choose", CSL.END);
		CSL.Node.choose.build.call(choose_end, state, target);
	}
	toplevel = "names" === this.name && state.build.substitute_level.value() === 0;
	hasval = "string" === typeof state[state.build.area].opt["subsequent-author-substitute"];
	if (toplevel && hasval) {
		author_substitute = new CSL.Token("text", CSL.SINGLETON);
		func = function (state, Item) {
			var text_esc = CSL.getSafeEscape(state.opt.mode, state.tmp.area);
			var printing = !state.tmp.suppress_decorations;
			if (printing) {
				if (!state.tmp.rendered_name) {
					state.tmp.rendered_name = state.output.string(state, state.tmp.name_node.blobs, false);
					if (state.tmp.rendered_name) {
						if (state.tmp.rendered_name === state.tmp.last_rendered_name) {
							str = new CSL.Blob(false, text_esc(state[state.tmp.area].opt["subsequent-author-substitute"]));
							state.tmp.name_node.blobs = [str];
						}
						state.tmp.last_rendered_name = state.tmp.rendered_name;
					}
				}
			}
		};
		author_substitute.execs.push(func);
		target.push(author_substitute);
	}
	if (("text" === this.name && !this.postponed_macro) || ["number", "date", "names"].indexOf(this.name) > -1) {
		func = function (state, Item) {
			state.tmp.element_trace.pop();
		};
		this.execs.push(func);
	}
};
CSL.Util.padding = function (num) {
	var m = num.match(/\s*(-{0,1}[0-9]+)/);
	if (m) {
		num = parseInt(m[1], 10);
		if (num < 0) {
			num = 99999999999999999999 + num;
		}
		num = "" + num;
		while (num.length < 20) {
			num = "0" + num;
		}
	}
	return num;
};
CSL.Util.LongOrdinalizer = function () {};
CSL.Util.LongOrdinalizer.prototype.init = function (state) {
	this.state = state;
};
CSL.Util.LongOrdinalizer.prototype.format = function (num, gender) {
	if (num < 10) {
		num = "0" + num;
	}
	var ret = CSL.Engine.getField(
		CSL.LOOSE, 
		this.state.locale[this.state.opt.lang].terms,
		"long-ordinal-" + num,
		"long", 
		0, 
		gender
	);
	if (!ret) {
		ret = this.state.fun.ordinalizer.format(num, gender);
	}
	this.state.tmp.cite_renders_content = true;
	return ret;
};
CSL.Util.Ordinalizer = function () {};
CSL.Util.Ordinalizer.prototype.init = function (state) {
	this.suffixes = {};
	for (var i = 0, ilen = 3; i < ilen; i += 1) {
		var gender = [undefined, "masculine", "feminine"][i];
		this.suffixes[gender] = [];
		for (var j = 1; j < 5; j += 1) {
			var ordinal = state.getTerm("ordinal-0" + j, "long", false, gender);
			if ("undefined" === typeof ordinal) {
				delete this.suffixes[gender];
				break;
			}
			this.suffixes[gender].push(ordinal);			
		}
	}
};
CSL.Util.Ordinalizer.prototype.format = function (num, gender) {
	var str;
	num = parseInt(num, 10);
	str = num.toString();
	if ((num / 10) % 10 === 1 || (num > 10 && num < 20)) {
		str += this.suffixes[gender][3];
	} else if (num % 10 === 1) {
		str += this.suffixes[gender][0];
	} else if (num % 10 === 2) {
		str += this.suffixes[gender][1];
	} else if (num % 10 === 3) {
		str += this.suffixes[gender][2];
	} else {
		str += this.suffixes[gender][3];
	}
	return str;
};
CSL.Util.Romanizer = function () {};
CSL.Util.Romanizer.prototype.format = function (num) {
	var ret, pos, n, numstr, len;
	ret = "";
	if (num < 6000) {
		numstr = num.toString().split("");
		numstr.reverse();
		pos = 0;
		n = 0;
		len = numstr.length;
		for (pos = 0; pos < len; pos += 1) {
			n = parseInt(numstr[pos], 10);
			ret = CSL.ROMAN_NUMERALS[pos][n] + ret;
		}
	}
	return ret;
};
CSL.Util.Suffixator = function (slist) {
	if (!slist) {
		slist = CSL.SUFFIX_CHARS;
	}
	this.slist = slist.split(",");
};
CSL.Util.Suffixator.prototype.format = function (N) {
	var X, N;
	N += 1;
	var key = "";
	do {
		X = ((N % 26) == 0) ? 26 : (N % 26);
		key = this.slist[X-1] + key;
		N = (N - X) / 26;
	} while ( N != 0 );
	return key;
};
CSL.Util.PageRangeMangler = {};
CSL.Util.PageRangeMangler.getFunction = function (state) {
	var rangerex, pos, len, stringify, listify, expand, minimize, minimize_internal, chicago, lst, m, b, e, ret, begin, end, ret_func, ppos, llen;
	var range_delimiter = state.getTerm("range-delimiter");
	rangerex = /([a-zA-Z]*)([0-9]+)\s*-\s*([a-zA-Z]*)([0-9]+)/;
	stringify = function (lst) {
		len = lst.length;
		for (pos = 1; pos < len; pos += 2) {
			if ("object" === typeof lst[pos]) {
				lst[pos] = lst[pos].join("");
			}
		}
		return lst.join("");
	};
	listify = function (str) {
		var m, lst, ret;
		str = str.replace("\u2013", "-", "g");
		m = str.match(/([a-zA-Z]*[0-9]+\s*-\s*[a-zA-Z]*[0-9]+)/g);
		lst = str.split(/[a-zA-Z]*[0-9]+\s*-\s*[a-zA-Z]*[0-9]+/);
		if (lst.length === 0) {
			ret = m;
		} else {
			ret = [lst[0]];
			for (pos = 1, len = lst.length; pos < len; pos += 1) {
				ret.push(m[pos - 1]);
				ret.push(lst[pos]);
			}
		}
		return ret;
	};
	expand = function (str) {
		str = "" + str;
		lst = listify(str);
		len = lst.length;
		for (pos = 1; pos < len; pos += 2) {
			m = lst[pos].match(rangerex);
			if (m) {
				if (!m[3] || m[1] === m[3]) {
					if (m[4].length < m[2].length) {
						m[4] = m[2].slice(0, (m[2].length - m[4].length)) + m[4];
					}
					if (parseInt(m[2], 10) < parseInt(m[4], 10)) {
						m[3] = range_delimiter + m[1];
						lst[pos] = m.slice(1);
					}
				}
			}
			if ("string" === typeof lst[pos]) {
				lst[pos] = lst[pos].replace("-", range_delimiter);
			}
		}
		return lst;
	};
	minimize = function (lst) {
		len = lst.length;
		for (pos = 1; pos < len; pos += 2) {
			lst[pos][3] = minimize_internal(lst[pos][1], lst[pos][3]);
			if (lst[pos][2].slice(1) === lst[pos][0]) {
				lst[pos][2] = range_delimiter;
			}
		}
		return stringify(lst);
	};
	minimize_internal = function (begin, end) {
		b = ("" + begin).split("");
		e = ("" + end).split("");
		ret = e.slice();
		ret.reverse();
		if (b.length === e.length) {
			llen = b.length;
			for (ppos = 0; ppos < llen; ppos += 1) {
				if (b[ppos] === e[ppos]) {
					ret.pop();
				} else {
					break;
				}
			}
		}
		ret.reverse();
		return ret.join("");
	};
	chicago = function (lst) {
		len = lst.length;
		for (pos = 1; pos < len; pos += 2) {
			if ("object" === typeof lst[pos]) {
				m = lst[pos];
				begin = parseInt(m[1], 10);
				end = parseInt(m[3], 10);
				if (begin > 100 && begin % 100 && parseInt((begin / 100), 10) === parseInt((end / 100), 10)) {
					m[3] = "" + (end % 100);
				} else if (begin >= 10000) {
					m[3] = "" + (end % 1000);
				}
			}
			if (m[2].slice(1) === m[0]) {
				m[2] = range_delimiter;
			}
		}
		return stringify(lst);
	};
	if (!state.opt["page-range-format"]) {
		ret_func = function (str) {
			return str;
		};
	} else if (state.opt["page-range-format"] === "expanded") {
		ret_func = function (str) {
			var lst = expand(str);
			return stringify(lst);
		};
	} else if (state.opt["page-range-format"] === "minimal") {
		ret_func = function (str) {
			var lst = expand(str);
			return minimize(lst);
		};
	} else if (state.opt["page-range-format"] === "chicago") {
		ret_func = function (str) {
			var lst = expand(str);
			return chicago(lst);
		};
	}
	return ret_func;
};
CSL.Util.FlipFlopper = function (state) {
	var tagdefs, pos, len, p, entry, allTags, ret, def, esc, makeHashes, closeTags, flipTags, openToClose, openToDecorations, okReverse, hashes, allTagsLst, lst;
	this.state = state;
	this.blob = false;
	this.quotechars = ['"', "'"];
	tagdefs = [
		["<i>", "</i>", "italics", "@font-style", ["italic", "normal","normal"], true],
		["<b>", "</b>", "bold", "@font-weight", ["bold", "normal","normal"], true],
		["<sup>", "</sup>", "superscript", "@vertical-align", ["sup", "sup","baseline"], true],
		["<sub>", "</sub>", "subscript", "@vertical-align", ["sub", "sub","baseline"], true],
		["<sc>", "</sc>", "smallcaps", "@font-variant", ["small-caps", "small-caps","normal"], true],
		["<span class=\"nocase\">", "</span>", "passthrough", "@passthrough", ["true", "true","true"], true],
		["<span class=\"nodecor\">", "</span>", "passthrough", "@passthrough", ["true", "true","true"], true],
		['"',  '"',  "quotes",  "@quotes",  ["true",  "inner","true"],  "'"],
		[" '",  "'",  "quotes",  "@quotes",  ["inner",  "true","true"],  '"']
	];
	for (pos = 0; pos < 2; pos += 1) {
		p = ["-", "-inner-"][pos];
		entry = [];
		var openq = state.getTerm(("open" + p + "quote"));
		entry.push(openq);
		this.quotechars.push(openq);
		var closeq = state.getTerm(("close" + p + "quote"));
		entry.push(closeq);
		this.quotechars.push(closeq);
		entry.push(("quote" + "s"));
		entry.push(("@" + "quote" + "s"));
		if ("-" === p) {
			entry.push(["true", "inner"]);
		} else {
			entry.push(["inner", "true"]);
		}
		entry.push(true);
		if ("-" === p) {
			entry.push(state.getTerm(("close-inner-quote")));
		} else {
			entry.push(state.getTerm(("close-quote")));
		}
		tagdefs.push(entry);
	}
	allTags = function (tagdefs) {
		ret = [];
		len = tagdefs.length;
		for (pos = 0; pos < len; pos += 1) {
			def = tagdefs[pos];
			if (ret.indexOf(def[0]) === -1) {
				esc = "";
				if (["(", ")", "[", "]"].indexOf(def[0]) > -1) {
					esc = "\\";
				}
				ret.push(esc + def[0]);
			}
			if (ret.indexOf(def[1]) === -1) {
				esc = "";
				if (["(", ")", "[", "]"].indexOf(def[1]) > -1) {
					esc = "\\";
				}
				ret.push(esc + def[1]);
			}
		}
		return ret;
	};
	allTagsLst = allTags(tagdefs);
	lst = [];
	for (pos = 0, len = allTagsLst.length; pos < len; pos += 1) {
		if (allTagsLst[pos]) {
			lst.push(allTagsLst[pos]);
		}
	}
	allTagsLst = lst.slice();
	this.allTagsRexMatch = new RegExp("(" + allTagsLst.join("|") + ")", "g");
	this.allTagsRexSplit = new RegExp("(?:" + allTagsLst.join("|") + ")");
	makeHashes = function (tagdefs) {
		closeTags = {};
		flipTags = {};
		openToClose = {};
		openToDecorations = {};
		okReverse = {};
		len = tagdefs.length;
		for (pos = 0; pos < len; pos += 1) {
			closeTags[tagdefs[pos][1]] = true;
			flipTags[tagdefs[pos][1]] = tagdefs[pos][5];
			openToClose[tagdefs[pos][0]] = tagdefs[pos][1];
			openToDecorations[tagdefs[pos][0]] = [tagdefs[pos][3], tagdefs[pos][4]];
			okReverse[tagdefs[pos][3]] = [tagdefs[pos][3], [tagdefs[pos][4][2], tagdefs[pos][1]]];
		}
		return [closeTags, flipTags, openToClose, openToDecorations, okReverse];
	};
	hashes = makeHashes(tagdefs);
	this.closeTagsHash = hashes[0];
	this.flipTagsHash = hashes[1];
	this.openToCloseHash = hashes[2];
	this.openToDecorations = hashes[3];
	this.okReverseHash = hashes[4];
};
CSL.Util.FlipFlopper.prototype.init = function (str, blob) {
	this.txt_esc = CSL.getSafeEscape(this.state.opt.mode, this.state.tmp.area);
	str = this._normalizeString(str);
	if (!blob) {
		this.strs = this.getSplitStrings(str);
		this.blob = new CSL.Blob();
	} else {
		this.blob = blob;
		this.strs = this.getSplitStrings(this.blob.blobs);
		this.blob.blobs = [];
	}
	this.blobstack = new CSL.Stack(this.blob);
};
CSL.Util.FlipFlopper.prototype._normalizeString = function (str) {
	for (var i = 0, ilen = 2; i < ilen; i += 1) {
		str = str.replace(this.quotechars[i + 2], this.quotechars[0]);
		str = str.replace(this.quotechars[i + 4], this.quotechars[1]);
	}
	return str;
};
CSL.Util.FlipFlopper.prototype.getSplitStrings = function (str) {
	var strs, pos, len, newstr, head, tail, expected_closers, expected_openers, expected_flips, tagstack, badTagStack, posA, sameAsOpen, openRev, flipRev, tag, ibeenrunned, posB, wanted_closer, posC, sep, resplice, params, lenA, lenB, lenC, badTagPos, mx, myret;
	mx = str.match(this.allTagsRexMatch);
	strs = str.split(this.allTagsRexSplit);
	myret = [strs[0]];
	for (pos = 1, len = strs.length; pos < len; pos += 1) {
		myret.push(mx[pos - 1]);
		myret.push(strs[pos]);
	}
	strs = myret.slice();
	len = strs.length - 2;
	for (pos = len; pos > 0; pos += -2) {
		if (strs[(pos - 1)].slice((strs[(pos - 1)].length - 1)) === "\\") {
			newstr = strs[(pos - 1)].slice(0, (strs[(pos - 1)].length - 1)) + strs[pos] + strs[(pos + 1)];
			head = strs.slice(0, (pos - 1));
			tail = strs.slice((pos + 2));
			head.push(newstr);
			strs = head.concat(tail);
		}
	}
	expected_closers = [];
	expected_openers = [];
	expected_flips = [];
	tagstack = [];
	badTagStack = [];
	lenA = strs.length - 1;
	for (posA = 1; posA < lenA; posA += 2) {
		tag = strs[posA];
		if (this.closeTagsHash[tag]) {
			expected_closers.reverse();
			sameAsOpen = this.openToCloseHash[tag];
			openRev = expected_closers.indexOf(tag);
			flipRev = expected_flips.indexOf(tag);
			expected_closers.reverse();
			if (!sameAsOpen || (openRev > -1 && (openRev < flipRev || flipRev === -1))) {
				ibeenrunned = false;
				lenB = expected_closers.length - 1;
				for (posB = lenB; posB > -1; posB += -1) {
					ibeenrunned = true;
					wanted_closer = expected_closers[posB];
					if (tag === wanted_closer) {
						expected_closers.pop();
						expected_openers.pop();
						expected_flips.pop();
						tagstack.pop();
						break;
					}
					badTagStack.push(posA);
				}
				if (!ibeenrunned) {
					badTagStack.push(posA);
				}
				continue;
			}
		}
		if (this.openToCloseHash[tag]) {
			expected_closers.push(this.openToCloseHash[tag]);
			expected_openers.push(tag);
			expected_flips.push(this.flipTagsHash[tag]);
			tagstack.push(posA);
		}
	}
	lenC = expected_closers.length - 1;
	for (posC = lenC; posC > -1; posC += -1) {
		expected_closers.pop();
		expected_flips.pop();
		expected_openers.pop();
		badTagStack.push(tagstack.pop());
	}
	badTagStack.sort(
		function (a, b) {
			if (a < b) {
				return 1;
			} else if (a > b) {
				return -1;
			}
			return 0;
		}
	);
	len = badTagStack.length;
	for (pos = 0; pos < len; pos += 1) {
		badTagPos = badTagStack[pos];
		head = strs.slice(0, (badTagPos - 1));
		tail = strs.slice((badTagPos + 2));
		sep = strs[badTagPos];
		if (sep.length && sep[0] !== "<" && this.openToDecorations[sep] && this.quotechars.indexOf(sep.replace(/\s+/g,"")) === -1) {
			params = this.openToDecorations[sep];
			sep = this.state.fun.decorate[params[0]][params[1][0]](this.state);
		}
		resplice = strs[(badTagPos - 1)] + sep + strs[(badTagPos + 1)];
		head.push(resplice);
		strs = head.concat(tail);
	}
	len = strs.length;
	for (pos = 0; pos < len; pos += 2) {
		strs[pos] = strs[pos].replace("'", "\u2019", "g");
		strs[pos] = this.txt_esc(strs[pos]);
	}
	return strs;
};
CSL.Util.FlipFlopper.prototype.processTags = function () {
	var expected_closers, expected_openers, expected_flips, expected_rendering, str, posA, tag, prestr, newblob, blob, sameAsOpen, openRev, flipRev, posB, wanted_closer, newblobnest, param, fulldecor, level, decor, lenA, lenB, posC, lenC;
	expected_closers = [];
	expected_openers = [];
	expected_flips = [];
	expected_rendering = [];
	str = "";
	if (this.strs.length === 1) {
		this.blob.blobs = this.strs[0];
	} else if (this.strs.length > 2) {
		lenA = (this.strs.length - 1);
		for (posA = 1; posA < lenA; posA += 2) {
			tag = this.strs[posA];
			prestr = this.strs[(posA - 1)];
			if (prestr) {
				newblob = new CSL.Blob(false, prestr);
				blob = this.blobstack.value();
				blob.push(newblob);
			}
			if (this.closeTagsHash[tag]) {
				expected_closers.reverse();
				sameAsOpen = this.openToCloseHash[tag];
				openRev = expected_closers.indexOf(tag);
				flipRev = expected_flips.indexOf(tag);
				expected_closers.reverse();
				if (!sameAsOpen || (openRev > -1 && (openRev < flipRev || flipRev === -1))) {
					lenB = expected_closers.length;
					for (posB = lenB; posB > -1; posB += -1) {
						wanted_closer = expected_closers[posB];
						if (tag === wanted_closer) {
							expected_closers.pop();
							expected_openers.pop();
							expected_flips.pop();
							expected_rendering.pop();
							this.blobstack.pop();
							break;
						}
					}
					continue;
				}
			}
			if (this.openToCloseHash[tag]) {
				expected_closers.push(this.openToCloseHash[tag]);
				expected_openers.push(tag);
				expected_flips.push(this.flipTagsHash[tag]);
				blob = this.blobstack.value();
				newblobnest = new CSL.Blob();
				blob.push(newblobnest);
				param = this.addFlipFlop(newblobnest, this.openToDecorations[tag]);
				if (tag === "<span class=\"nodecor\">") {
					fulldecor = this.state[this.state.tmp.area].opt.topdecor.concat(this.blob.alldecor).concat([[["@quotes", "inner"]]]);
					lenB = fulldecor.length;
					for (posB = 0; posB < lenB; posB += 1) {
						level = fulldecor[posB];
						lenC = level.length;
						for (posC = 0; posC < lenC; posC += 1) {
							decor = level[posC];
							if (["@font-style", "@font-weight", "@font-variant"].indexOf(decor[0]) > -1) {
								param = this.addFlipFlop(newblobnest, this.okReverseHash[decor[0]]);
							}
						}
					}
				}
				expected_rendering.push(this.state.fun.decorate[param[0]][param[1]](this.state));
				this.blobstack.push(newblobnest);
			}
		}
		if (this.strs.length > 2) {
			str = this.strs[(this.strs.length - 1)];
			if (str) {
				blob = this.blobstack.value();
				newblob = new CSL.Blob(false, str);
				blob.push(newblob);
			}
		}
	}
	return this.blob;
};
CSL.Util.FlipFlopper.prototype.addFlipFlop = function (blob, fun) {
	var posA, posB, fulldecor, lenA, decorations, breakme, decor, posC, newdecor, lenC;
	posB = 0;
	fulldecor = this.state[this.state.tmp.area].opt.topdecor.concat(blob.alldecor).concat([[["@quotes", "inner"]]]);
	lenA = fulldecor.length;
	for (posA = 0; posA < lenA; posA += 1) {
		decorations = fulldecor[posA];
		breakme = false;
		lenC = decorations.length - 1;
		for (posC = lenC; posC > -1; posC += -1) {
			decor = decorations[posC];
			if (decor[0] === fun[0]) {
				if (decor[1] === fun[1][0]) {
					posB = 1;
				}
				breakme = true;
				break;
			}
		}
		if (breakme) {
			break;
		}
	}
	newdecor = [fun[0], fun[1][posB]];
	blob.decorations.reverse();
	blob.decorations.push(newdecor);
	blob.decorations.reverse();
	return newdecor;
};
CSL.Output.Formatters = {};
CSL.getSafeEscape = function(outputModeOpt, outputArea) {
	if (["bibliography", "citation"].indexOf(outputArea) > -1) {
		return CSL.Output.Formats[outputModeOpt].text_escape;
	} else {
		return function (txt) { return txt; };
	}
};
CSL.Output.Formatters.passthrough = function (state, string) {
	return string;
};
CSL.Output.Formatters.lowercase = function (state, string) {
	var str = CSL.Output.Formatters.doppelString(string, CSL.TAG_USEALL);
	str.string = str.string.toLowerCase();
	return CSL.Output.Formatters.undoppelString(str);
};
CSL.Output.Formatters.uppercase = function (state, string) {
	var str = CSL.Output.Formatters.doppelString(string, CSL.TAG_USEALL);
	str.string = str.string.toUpperCase();
	return CSL.Output.Formatters.undoppelString(str);
};
CSL.Output.Formatters["capitalize-first"] = function (state, string) {
	var str = CSL.Output.Formatters.doppelString(string, CSL.TAG_ESCAPE);
	if (str.string.length) {
		str.string = str.string.slice(0, 1).toUpperCase() + str.string.substr(1);
		return CSL.Output.Formatters.undoppelString(str);
	} else {
		return "";
	}
};
CSL.Output.Formatters.sentence = function (state, string) {
	var str = CSL.Output.Formatters.doppelString(string, CSL.TAG_ESCAPE);
	str.string = str.string.slice(0, 1).toUpperCase() + str.string.substr(1).toLowerCase();
	return CSL.Output.Formatters.undoppelString(str);
};
CSL.Output.Formatters["capitalize-all"] = function (state, string) {
	var str, strings, len, pos;
	str = CSL.Output.Formatters.doppelString(string, CSL.TAG_ESCAPE);
	strings = str.string.split(" ");
	len = strings.length;
	for (pos = 0; pos < len; pos += 1) {
		if (strings[pos].length > 1) {
            strings[pos] = strings[pos].slice(0, 1).toUpperCase() + strings[pos].substr(1).toLowerCase();
        } else if (strings[pos].length === 1) {
            strings[pos] = strings[pos].toUpperCase();
        }
    }
	str.string = strings.join(" ");
	return CSL.Output.Formatters.undoppelString(str);
};
CSL.Output.Formatters.title = function (state, string) {
	var str, words, isAllUpperCase, newString, lastWordIndex, previousWordIndex, upperCaseVariant, lowerCaseVariant, pos, skip, notfirst, notlast, aftercolon, len, idx, tmp, skipword, ppos, mx, lst, myret;
	str = CSL.Output.Formatters.doppelString(string, CSL.TAG_ESCAPE);
	if (!string) {
		return "";
	}
	mx = str.string.match(/(\s+)/g);
	lst = str.string.split(/\s+/);
	myret = [lst[0]];
	for (pos = 1, len = lst.length; pos < len; pos += 1) {
		myret.push(mx[pos - 1]);
		myret.push(lst[pos]);
	}
	words = myret.slice();
	isAllUpperCase = str.string.toUpperCase() === string;
	newString = "";
	lastWordIndex = words.length - 1;
	previousWordIndex = -1;
	for (pos = 0; pos <= lastWordIndex;  pos += 2) {
		if (words[pos].length !== 0 && words[pos].length !== 1 && !/\s+/.test(words[pos])) {
			upperCaseVariant = words[pos].toUpperCase();
			lowerCaseVariant = words[pos].toLowerCase();
			var totallyskip = false;
			if (!isAllUpperCase || (words.length === 1 && words[pos].length < 4)) {
				if (words[pos] === upperCaseVariant) {
					totallyskip = true;
				}
			}
			if (isAllUpperCase || words[pos] === lowerCaseVariant) {
				skip = false;
				for (var i = 0, ilen = CSL.SKIP_WORDS.length; i < ilen; i += 1) {
					skipword = CSL.SKIP_WORDS[i];
					idx = lowerCaseVariant.indexOf(skipword);
					if (idx > -1) {
						tmp = lowerCaseVariant.slice(0, idx) + lowerCaseVariant.slice(idx + skipword.length);
						if (!tmp.match(/[a-zA-Z]/)) {
							skip = true;
						}
					}
				}
				notfirst = pos !== 0;
				notlast = pos !== lastWordIndex;
				if (words[previousWordIndex]) {
					aftercolon = words[previousWordIndex].slice(-1) === ":";
				} else {
					aftercolon = false;
				}
				if (!totallyskip) {
					if (skip && notfirst && notlast && !aftercolon) {
						words[pos] = lowerCaseVariant;
					} else {
						words[pos] = upperCaseVariant.slice(0, 1) + lowerCaseVariant.substr(1);
					}
				}
			}
			previousWordIndex = pos;
		}
	}
	str.string = words.join("");
	return CSL.Output.Formatters.undoppelString(str);
};
CSL.Output.Formatters.doppelString = function (string, rex) {
	var ret, pos, len;
	ret = {};
	ret.array = rex(string);
	ret.string = "";
	len = ret.array.length;
	for (pos = 0; pos < len; pos += 2) {
		ret.string += ret.array[pos];
	}
	return ret;
};
CSL.Output.Formatters.undoppelString = function (str) {
	var ret, len, pos;
	ret = "";
	len = str.array.length;
	for (pos = 0; pos < len; pos += 1) {
		if ((pos % 2)) {
			ret += str.array[pos];
		} else {
			ret += str.string.slice(0, str.array[pos].length);
			str.string = str.string.slice(str.array[pos].length);
		}
	}
	return ret;
};
CSL.Output.Formatters.serializeItemAsRdf = function (Item) {
	return "";
};
CSL.Output.Formatters.serializeItemAsRdfA = function (Item) {
	return "";
};
CSL.Output.Formats = function () {};
CSL.Output.Formats.prototype.html = {
	"text_escape": function (text) {
		return text.replace(/&/g, "&#38;")
		.replace(/</g, "&#60;")
		.replace(/>/g, "&#62;")
		.replace("  ", "&#160; ", "g")
		.replace(CSL.SUPERSCRIPTS_REGEXP,
				 function(aChar) {
					 return "<sup>" + CSL.SUPERSCRIPTS[aChar] + "</sup>";
				 });
	},
	"bibstart": "<div class=\"csl-bib-body\">\n",
	"bibend": "</div>",
	"@font-style/italic": "<i>%%STRING%%</i>",
	"@font-style/oblique": "<em>%%STRING%%</em>",
	"@font-style/normal": "<span style=\"font-style:normal;\">%%STRING%%</span>",
	"@font-variant/small-caps": "<span style=\"font-variant:small-caps;\">%%STRING%%</span>",
	"@passthrough/true": CSL.Output.Formatters.passthrough,
	"@font-variant/normal": "<span style=\"font-variant:normal;\">%%STRING%%</span>",
	"@font-weight/bold": "<b>%%STRING%%</b>",
	"@font-weight/normal": "<span style=\"font-weight:normal;\">%%STRING%%</span>",
	"@font-weight/light": false,
	"@text-decoration/none": "<span style=\"text-decoration:none;\">%%STRING%%</span>",
	"@text-decoration/underline": "<span style=\"text-decoration:underline;\">%%STRING%%</span>",
	"@vertical-align/sup": "<sup>%%STRING%%</sup>",
	"@vertical-align/sub": "<sub>%%STRING%%</sub>",
	"@vertical-align/baseline": "<span style=\"baseline\">%%STRING%%</span>",
	"@strip-periods/true": CSL.Output.Formatters.passthrough,
	"@strip-periods/false": CSL.Output.Formatters.passthrough,
	"@quotes/true": function (state, str) {
		if ("undefined" === typeof str) {
			return state.getTerm("open-quote");
		}
		return state.getTerm("open-quote") + str + state.getTerm("close-quote");
	},
	"@quotes/inner": function (state, str) {
		if ("undefined" === typeof str) {
			return "\u2019";
		}
		return state.getTerm("open-inner-quote") + str + state.getTerm("close-inner-quote");
	},
	"@quotes/false": false,
	"@bibliography/entry": function (state, str) {
		var insert = "";
		if (state.sys.embedBibliographyEntry) {
			insert = state.sys.embedBibliographyEntry(this.item_id) + "\n";
		}
		return "  <div class=\"csl-entry\">" + str + "</div>\n" + insert;
	},
	"@display/block": function (state, str) {
		return "\n\n    <div class=\"csl-block\">" + str + "</div>\n";
	},
	"@display/left-margin": function (state, str) {
		return "\n    <div class=\"csl-left-margin\">" + str + "</div>";
	},
	"@display/right-inline": function (state, str) {
		return "<div class=\"csl-right-inline\">" + str + "</div>\n  ";
	},
	"@display/indent": function (state, str) {
		return "<div class=\"csl-indent\">" + str + "</div>\n  ";
	}
};
CSL.Output.Formats.prototype.text = {
	"text_escape": function (text) {
		return text;
	},
	"bibstart": "",
	"bibend": "",
	"@font-style/italic": false,
	"@font-style/oblique": false,
	"@font-style/normal": false,
	"@font-variant/small-caps": false,
	"@passthrough/true": CSL.Output.Formatters.passthrough,
	"@font-variant/normal": false,
	"@font-weight/bold": false,
	"@font-weight/normal": false,
	"@font-weight/light": false,
	"@text-decoration/none": false,
	"@text-decoration/underline": false,
	"@vertical-align/baseline": false,
	"@vertical-align/sup": false,
	"@vertical-align/sub": false,
	"@strip-periods/true": CSL.Output.Formatters.passthrough,
	"@strip-periods/false": CSL.Output.Formatters.passthrough,
	"@quotes/true": function (state, str) {
		if ("undefined" === typeof str) {
			return state.getTerm("open-quote");
		}
		return state.getTerm("open-quote") + str + state.getTerm("close-quote");
	},
	"@quotes/inner": function (state, str) {
		if ("undefined" === typeof str) {
			return "\u2019";
		}
		return state.getTerm("open-inner-quote") + str + state.getTerm("close-inner-quote");
	},
	"@quotes/false": false,
	"@bibliography/entry": function (state, str) {
		return str+"\n";
	},
	"@display/block": function (state, str) {
		return "\n"+str;
	},
	"@display/left-margin": function (state, str) {
		return str;
	},
	"@display/right-inline": function (state, str) {
		return str;
	},
	"@display/indent": function (state, str) {
		return "\n    "+str;
	}
};
CSL.Output.Formats.prototype.rtf = {
	"text_escape": function (text) {
		return text
		.replace(/([\\{}])/g, "\\$1", "g")
		.replace(CSL.SUPERSCRIPTS_REGEXP,
				 function(aChar) {
					 return "\\super " + CSL.SUPERSCRIPTS[aChar] + "\\nosupersub{}";
				 })
		.replace(/[\x7F-\uFFFF]/g,
				 function(aChar) { return "\\uc0\\u"+aChar.charCodeAt(0).toString()+"{}" })
		.replace("\t", "\\tab{}", "g");
	},
	"@passthrough/true": CSL.Output.Formatters.passthrough,
	"@font-style/italic":"\\i %%STRING%%\\i0{}",
	"@font-style/normal":"\\i0{}%%STRING%%\\i{}",
	"@font-style/oblique":"\\i %%STRING%%\\i0{}",
	"@font-variant/small-caps":"\\scaps %%STRING%%\\scaps0{}",
	"@font-variant/normal":"\\scaps0{}%%STRING%%\\scaps{}",
	"@font-weight/bold":"\\b %%STRING%%\\b0{}",
	"@font-weight/normal":"\\b0{}%%STRING%%\\b{}",
	"@font-weight/light":false,
	"@text-decoration/none":false,
	"@text-decoration/underline":"\\ul %%STRING%%\\ul0{}",
	"@vertical-align/baseline":false,
	"@vertical-align/sup":"\\super %%STRING%%\\nosupersub{}",
	"@vertical-align/sub":"\\sub %%STRING%%\\nosupersub{}",
	"@strip-periods/true": CSL.Output.Formatters.passthrough,
	"@strip-periods/false": CSL.Output.Formatters.passthrough,
	"@quotes/true": function (state, str) {
		if ("undefined" === typeof str) {
			return CSL.Output.Formats.rtf.text_escape(state.getTerm("open-quote"));
		}
		return CSL.Output.Formats.rtf.text_escape(state.getTerm("open-quote")) + str + CSL.Output.Formats.rtf.text_escape(state.getTerm("close-quote"));
	},
	"@quotes/inner": function (state, str) {
		if ("undefined" === typeof str) {
			return CSL.Output.Formats.rtf.text_escape("\u2019");
		}
		return CSL.Output.Formats.rtf.text_escape(state.getTerm("open-inner-quote")) + str + CSL.Output.Formats.rtf.text_escape(state.getTerm("close-inner-quote"));
	},
	"@quotes/false": false,
	"bibstart":"{\\rtf ",
	"bibend":"}",
	"@display/block":"%%STRING%%\\line\r\n",
	"@bibliography/entry": function(state,str){
		return str;
	},
	"@display/left-margin": function(state,str){
		return str+"\\tab ";
	},
	"@display/right-inline": function (state, str) {
		return str+"\n";
	},
	"@display/indent": function (state, str) {
		return "\n\\tab "+str;
	}
};
CSL.Output.Formats = new CSL.Output.Formats();
CSL.Registry = function (state) {
	var pos, len, ret, i, ilen;
	this.debug = false;
	this.state = state;
	this.registry = {};
	this.reflist = [];
	this.namereg = new CSL.Registry.NameReg(state);
	this.citationreg = new CSL.Registry.CitationReg(state);
	this.authorstrings = {};
	this.mylist = [];
	this.myhash = {};
	this.deletes = [];
	this.inserts = [];
	this.uncited = [];
	this.refreshes = {};
	this.akeys = {};
	this.oldseq = {};
	this.return_data = {};
	this.ambigcites = {};
	this.sorter = new CSL.Registry.Comparifier(state, "bibliography_sort");
	this.getSortedIds = function () {
		ret = [];
		for (i = 0, ilen = this.reflist.length; i < ilen; i += 1) {
			ret.push("" + this.reflist[i].id);
		}
		return ret;
	};
	this.getSortedRegistryItems = function () {
		ret = [];
		for (i = 0, ilen = this.reflist.length; i < ilen; i += 1) {
			ret.push(this.reflist[i]);
		}
		return ret;
	};
};
CSL.Registry.prototype.init = function (myitems, uncited_flag) {
	var i, ilen;
	this.oldseq = {};
	if (uncited_flag && this.mylist && this.mylist.length) {
		this.uncited = myitems;
		for (i = 0, ilen = myitems.length; i < ilen; i += 1) {
			myitems[i] = "" + myitems[i];
			if (!this.myhash[myitems[i]] && this.mylist.indexOf(myitems[i]) === -1) {
				this.mylist.push(myitems[i]);
			}
		}
	} else {
		this.mylist = myitems.concat(this.uncited);
	}
	this.myhash = {};
	for (i = 0, ilen = this.mylist.length; i < ilen; i += 1) {
		this.mylist[i] = "" + this.mylist[i];
		this.myhash[this.mylist[i]] = true;
	}
	this.refreshes = {};
	this.touched = {};
};
CSL.Registry.prototype.dodeletes = function (myhash) {
	var otheritems, key, ambig, pos, len, items, kkey, mypos, id;
	if ("string" === typeof myhash) {
		myhash = {};
		myhash[myhash] = true;
	}
	for (key in this.registry) {
		if (this.registry.hasOwnProperty(key) && !myhash[key]) {
			if (this.registry[key].uncited) {
				continue;
			}
			otheritems = this.namereg.delitems(key);
			for (kkey in otheritems) {
				if (otheritems.hasOwnProperty(kkey)) {
					this.refreshes[kkey] = true;
				}
			}
			ambig = this.registry[key].ambig;
			mypos = this.ambigcites[ambig].indexOf(key);
			if (mypos > -1) {
				items = this.ambigcites[ambig].slice();
				this.ambigcites[ambig] = items.slice(0, mypos).concat(items.slice([(mypos + 1)], items.length));
			}
			len = this.ambigcites[ambig].length;
			for (pos = 0; pos < len; pos += 1) {
				id = "" + this.ambigcites[ambig][pos];
				this.refreshes[id] = true;
			}
			delete this.registry[key];
			this.return_data.bibchange = true;
		}
	}
};
CSL.Registry.prototype.doinserts = function (mylist) {
	var len, pos, item, Item, akey, newitem, abase;
	if ("string" === typeof mylist) {
		mylist = [mylist];
	}
	len = mylist.length;
	for (pos = 0; pos < len; pos += 1) {
		item = mylist[pos];
		if (!this.registry[item]) {
			Item = this.state.retrieveItem(item);
			akey = CSL.getAmbiguousCite.call(this.state, Item);
			this.akeys[akey] = true;
			newitem = {
				"id": "" + item,
				"seq": 0,
				"offset": 0,
				"sortkeys": false,
				"ambig": false,
				"rendered": false,
				"disambig": false,
				"ref": Item
			};
			this.registry[item] = newitem;
			abase = CSL.getAmbigConfig.call(this.state);
			this.registerAmbigToken(akey, item, abase);
			this.touched[item] = true;
			this.return_data.bibchange = true;
		}
	}
};
CSL.Registry.prototype.douncited = function () {
	var pos, len;
	for (pos = 0, len = this.mylist.length; pos < len; pos += 1) {
		this.registry[this.mylist[pos]].uncited = false;
	}
	for (pos = 0, len = this.uncited.length; pos < len; pos += 1) {
		this.registry[this.mylist[pos]].uncited = true;
	}
};
CSL.Registry.prototype.rebuildlist = function () {
	var count, len, pos, item;
	this.reflist = [];
	len = this.mylist.length;
	for (pos = 0; pos < len; pos += 1) {
		item = this.mylist[pos];
		this.reflist.push(this.registry[item]);
		this.oldseq[item] = this.registry[item].seq;
		this.registry[item].seq = (pos + 1);
	}
};
CSL.Registry.prototype.dorefreshes = function () {
	var key, regtoken, Item, old_akey, akey, abase;
	for (key in this.refreshes) {
		if (this.refreshes.hasOwnProperty(key)) {
			regtoken = this.registry[key];
			delete this.registry[key];
			if (!regtoken) {
				continue;
			}
			regtoken.disambig = undefined;
			regtoken.sortkeys = undefined;
			regtoken.ambig = undefined;
			Item = this.state.retrieveItem(key);
			if ("undefined" === typeof akey) {
				akey = CSL.getAmbiguousCite.call(this.state, Item);
				this.state.tmp.taintedItemIDs[key] = true;
			}
			this.registry[key] = regtoken;
			abase = CSL.getAmbigConfig.call(this.state);
			this.registerAmbigToken(akey, key, abase);
			this.akeys[akey] = true;
			this.touched[key] = true;
		}
	}
};
CSL.Registry.prototype.setdisambigs = function () {
	var akey, leftovers, key, pos, len, id;
	this.leftovers = [];
	for (akey in this.akeys) {
		if (this.akeys.hasOwnProperty(akey)) {
			this.state.disambiguate.run(akey);
		}
	}
	this.akeys = {};
};
CSL.Registry.prototype.renumber = function () {
	var len, pos, item;
	len = this.reflist.length;
	for (pos = 0; pos < len; pos += 1) {
		item = this.reflist[pos];
		item.seq = (pos + 1);
		if (this.state.tmp.taintedItemIDs && item.seq != this.oldseq[item.id]) {
			if (this.state.opt.update_mode === CSL.NUMERIC) {
				this.state.tmp.taintedItemIDs[item.id] = true;
			}
			if (this.state.opt.bib_mode === CSL.NUMERIC) {
				this.return_data.bibchange = true;
			}
		}
	}
};
CSL.Registry.prototype.setsortkeys = function () {
	var key;
	for (key in this.touched) {
		if (this.touched.hasOwnProperty(key)) {
			this.registry[key].sortkeys = CSL.getSortKeys.call(this.state, this.state.retrieveItem(key), "bibliography_sort");
		}
	}
};
CSL.Registry.prototype.sorttokens = function () {
	this.reflist.sort(this.sorter.compareKeys);
};
CSL.Registry.Comparifier = function (state, keyset) {
	var sort_directions, len, pos, compareKeys;
	var sortCompare = CSL.getSortCompare();
	sort_directions = state[keyset].opt.sort_directions;
    this.compareKeys = function (a, b) {
		len = a.sortkeys.length;
		for (pos = 0; pos < len; pos += 1) {
			var cmp = 0;
			if (a.sortkeys[pos] === b.sortkeys[pos]) {
				cmp = 0;
			} else if ("undefined" === typeof a.sortkeys[pos]) {
				cmp = sort_directions[pos][1];
			} else if ("undefined" === typeof b.sortkeys[pos]) {
				cmp = sort_directions[pos][0];
			} else {
				cmp = sortCompare(a.sortkeys[pos], b.sortkeys[pos]);
			}
			if (0 < cmp) {
				return sort_directions[pos][1];
			} else if (0 > cmp) {
				return sort_directions[pos][0];
			}
		}
		if (a.seq > b.seq) {
			return 1;
		} else if (a.seq < b.seq) {
			return -1;
		}
		return 0;
	};
	compareKeys = this.compareKeys;
	this.compareCompositeKeys = function (a, b) {
		return compareKeys(a[1], b[1]);
	};
};
CSL.Registry.prototype.compareRegistryTokens = function (a, b) {
	if (a.seq > b.seq) {
		return 1;
	} else if (a.seq < b.seq) {
		return -1;
	}
	return 0;
};
CSL.Registry.prototype.registerAmbigToken = function (akey, id, ambig_config, tainters) {
	if (this.registry[id] && this.registry[id].disambig && this.registry[id].disambig.names) {
		for (var i = 0, ilen = ambig_config.names.length; i < ilen; i += 1) {
			var new_names_params = ambig_config.names[i];
			var old_names_params = this.registry[id].disambig.names[i];
			if (new_names_params !== old_names_params) {
				this.state.tmp.taintedItemIDs[id] = true;
			}
		}
	}
	if (!this.ambigcites[akey]) {
		this.ambigcites[akey] = [];
	}
	if (this.ambigcites[akey].indexOf("" + id) === -1) {
		this.ambigcites[akey].push("" + id);
	}
	this.registry[id].ambig = akey;
	var dome = false;
	if (tainters) {
		this.registry[id].disambig = CSL.cloneAmbigConfig.call(this.state, ambig_config, this.registry[id].disambig, tainters);
	} else {
		this.registry[id].disambig = CSL.cloneAmbigConfig(ambig_config);
	}
};
CSL.getSortKeys = function (Item, key_type) {
	var area, strip_prepositions, use_parallels, len, pos;
	area = this.tmp.area;
	strip_prepositions = CSL.Util.Sort.strip_prepositions;
	this.tmp.area = key_type;
	this.tmp.disambig_override = true;
	this.tmp.disambig_request = false;
	use_parallels = this.parallel.use_parallels;
	this.parallel.use_parallels = false;
	this.tmp.suppress_decorations = true;
	CSL.getCite.call(this, Item);
	this.tmp.suppress_decorations = false;
	this.parallel.use_parallels = use_parallels;
	this.tmp.disambig_override = false;
	len = this[key_type].keys.length;
	for (pos = 0; pos < len; pos += 1) {
		this[key_type].keys[pos] = strip_prepositions(this[key_type].keys[pos]);
	}
	this.tmp.area = area;
	return this[key_type].keys;
};
CSL.Registry.NameReg = function (state) {
	var pkey, ikey, skey, floor, ceiling, dagopt, gdropt, ret, pos, items, strip_periods, set_keys, evalname, delitems, addname, key, myitems;
	this.state = state;
	this.namereg = {};
	this.nameind = {};
	this.nameindpkeys = {};
	this.itemkeyreg = {};
	strip_periods = function (str) {
		if (!str) {
			str = "";
		}
		return str.replace(".", " ", "g").replace(/\s+/g, " ").replace(/\s+$/,"");
	};
	set_keys = function (state, itemid, nameobj) {
		pkey = strip_periods(nameobj.family);
		skey = strip_periods(nameobj.given);
		var m = skey.match(/,\!* [^,]$/);
		if (m && m[1] === m[1].toLowerCase()) {
			skey = skey.replace(/,\!* [^,]$/, "");
		}
		ikey = CSL.Util.Names.initializeWith(state, skey, "%s");
		if (state.opt["givenname-disambiguation-rule"] === "by-cite") {
			pkey = "" + itemid + pkey;
		}
	};
	evalname = function (item_id, nameobj, namenum, request_base, form, initials) {
		var pos, len, items, param;
		if (state.tmp.area === "bibliography" && !form && "string" !== typeof initials) {
			  return 2;
		}
		nameobj = state.transform.name(state, nameobj, state.opt["locale-pri"]);
		set_keys(this.state, "" + item_id, nameobj);
		param = 2;
		dagopt = state.opt["disambiguate-add-givenname"];
		gdropt = state.opt["givenname-disambiguation-rule"];
		var gdropt_orig = gdropt;
		if (gdropt === "by-cite") {
			gdropt = "all-names";
		}
		if ("short" === form) {
			param = 0;
		} else if ("string" === typeof initials) {
			param = 1;
		}
		if ("undefined" === typeof this.namereg[pkey] || "undefined" === typeof this.namereg[pkey].ikey[ikey]) {
			return param;
		}
		if (gdropt_orig === "by-cite" && param < request_base) {
			param = request_base;
		}
		if (!dagopt) {
			return param;
		}
		if ("string" === typeof gdropt && gdropt.slice(0, 12) === "primary-name" && namenum > 0) {
			return param;
		}
		if (!gdropt || gdropt === "all-names" || gdropt === "primary-name") {
			if (this.namereg[pkey].count > 1) {
				param = 1;
			}
			if ((this.namereg[pkey].ikey 
				 && this.namereg[pkey].ikey[ikey].count > 1)
				|| (this.namereg[pkey].count > 1 
					&& "string" !== typeof initials)) {
			    param = 2;
			}
		} else if (gdropt === "all-names-with-initials" || gdropt === "primary-name-with-initials") {
			if (this.namereg[pkey].count > 1) {
				param = 1;
			}
		}
		if (param === 0) {
			pos = this.namereg[pkey].ikey[ikey].items.indexOf("" + item_id);
			items = this.namereg[pkey].ikey[ikey].items;
			if (pos > -1) {
				items = items.slice(0, pos).concat(items.slice(pos + 1));
			}
			for (pos = 0, len = items.length; pos < len; pos += 1) {
				this.state.tmp.taintedItemIDs[items[pos]] = true;
			}
			pos = this.namereg[pkey].ikey[ikey].skey[skey].items.indexOf("" + item_id);
			items = this.namereg[pkey].ikey[ikey].skey[skey].items;
			if (pos > -1) {
				items = items.slice(0, pos).concat(items.slice(pos + 1));
			}
			for (pos = 0, len = items.length; pos < len; pos += 1) {
				this.state.tmp.taintedItemIDs[items[pos]] = true;
			}
			if (this.namereg[pkey].items.indexOf("" + item_id) === -1) {
				this.namereg[pkey].items.push("" + item_id);
			}
		} else if (param === 1) {
			pos = this.namereg[pkey].items.indexOf("" + item_id);
			items = this.namereg[pkey].items;
			if (pos > -1) {
				items = items.slice(0, pos).concat(items.slice(pos + 1));
			}
			for (pos = 0, len = items.length; pos < len; pos += 1) {
				this.state.tmp.taintedItemIDs[items[pos]] = true;
			}
			pos = this.namereg[pkey].ikey[ikey].skey[skey].items.indexOf("" + item_id);
			items = this.namereg[pkey].ikey[ikey].skey[skey].items;
			if (pos > -1) {
				items = items.slice(0, pos).concat(items.slice(pos + 1));
			}
			for (pos = 0, len = items.length; pos < len; pos += 1) {
				this.state.tmp.taintedItemIDs[items[pos]] = true;
			}
			if (this.namereg[pkey].ikey[ikey].items.indexOf("" + item_id) === -1) {
				this.namereg[pkey].ikey[ikey].items.push("" + item_id);
			}
		} else if (param === 2) {
			pos = this.namereg[pkey].items.indexOf("" + item_id);
			items = this.namereg[pkey].items;
			if (pos > -1) {
				items = items.slice(0, pos).concat(items.slice(pos + 1));
			}
			for (pos = 0, len = items.length; pos < len; pos += 1) {
				this.state.tmp.taintedItemIDs[items[pos]] = true;
			}
			pos = this.namereg[pkey].ikey[ikey].items.indexOf("" + item_id);
			items = this.namereg[pkey].ikey[ikey].items;
			if (pos > -1) {
				items = items.slice(0, pos).concat(items.slice(pos + 1));
			}
			for (pos = 0, len = items.length; pos < len; pos += 1) {
				this.state.tmp.taintedItemIDs[items[pos]] = true;
			}
			if (this.namereg[pkey].ikey[ikey].skey[skey].items.indexOf("" + item_id) === -1) {
				this.namereg[pkey].ikey[ikey].skey[skey].items.push("" + item_id);
			}
		}
		if (!state.registry.registry[item_id]) {
			if (form == "short") {
				return 0;
			} else if ("string" == typeof initials) {
				return 1;
			}
		} else {
			return param;
		}
	};
	delitems = function (ids) {
		var i, item, pos, len, posA, posB, id, fullkey, llen, ppos, otherid;
		if ("string" === typeof ids || "number" === typeof ids) {
			ids = ["" + ids];
		}
		ret = {};
		len = ids.length;
		for (pos = 0; pos < len; pos += 1) {
			id = "" + ids[pos];
			if (!this.nameind[id]) {
				continue;
			}
			for (fullkey in this.nameind[id]) {
				if (this.nameind[id].hasOwnProperty(fullkey)) {
					key = fullkey.split("::");
					pkey = key[0];
					ikey = key[1];
					skey = key[2];
					if ("undefined" === typeof this.namereg[pkey]) {
						continue;
					}
					items = this.namereg[pkey].items;
					if (skey && this.namereg[pkey].ikey[ikey] && this.namereg[pkey].ikey[ikey].skey[skey]) {
						myitems = this.namereg[pkey].ikey[ikey].skey[skey].items;
						posB = myitems.indexOf("" + id);
						if (posB > -1) {
							this.namereg[pkey].ikey[ikey].skey[skey].items = myitems.slice(0, posB).concat(myitems.slice([(posB + 1)]));
						}
						if (this.namereg[pkey].ikey[ikey].skey[skey].items.length === 1) {
							this.namereg[pkey].ikey[ikey].items.push(this.namereg[pkey].ikey[ikey].skey[skey].items[0]);
							this.namereg[pkey].ikey[ikey].skey[skey].items = [];
						}
						for (ppos = 0, llen = this.namereg[pkey].ikey[ikey].skey[skey].items.length; ppos < llen; ppos += 1) {
							ret[this.namereg[pkey].ikey[ikey].items[ppos]] = true;
						}
					}
					if (ikey && this.namereg[pkey].ikey[ikey]) {
						posB = this.namereg[pkey].ikey[ikey].items.indexOf("" + id);
						if (posB > -1) {
							items = this.namereg[pkey].ikey[ikey].items.slice();
							this.namereg[pkey].ikey[ikey].items = items.slice(0, posB).concat(items.slice([posB + 1]));
						}
						if (this.namereg[pkey].ikey[ikey].items.length === 1) {
							this.namereg[pkey].items.push(this.namereg[pkey].ikey[ikey].items[0]);
							this.namereg[pkey].ikey[ikey].items = [];
						}
						for (ppos = 0, llen = this.namereg[pkey].ikey[ikey].items.length; ppos < llen; ppos += 1) {
							ret[this.namereg[pkey].ikey[ikey].items[ppos]] = true;
						}
					}
					if (pkey) {
						posB = this.namereg[pkey].items.indexOf("" + id);
						if (posB > -1) {
							items = this.namereg[pkey].items.slice();
							this.namereg[pkey].items = items.slice(0, posB).concat(items.slice([posB + 1], items.length));
						}
						for (ppos = 0, llen = this.namereg[pkey].items.length; ppos < llen; ppos += 1) {
							ret[this.namereg[pkey].items[ppos]] = true;
						}
						if (this.namereg[pkey].items.length < 2) {
							delete this.namereg[pkey];
						}
					}
					delete this.nameind[id][fullkey];
				}
			}
			delete this.nameind[id];
			delete this.nameindpkeys[id];
		}
		return ret;
	};
	addname = function (item_id, nameobj, pos) {
		nameobj = state.transform.name(state, nameobj, state.opt["locale-pri"]);
		set_keys(this.state, "" + item_id, nameobj);
		if (pkey) {
			if ("undefined" === typeof this.namereg[pkey]) {
				this.namereg[pkey] = {};
				this.namereg[pkey].count = 0;
				this.namereg[pkey].ikey = {};
				this.namereg[pkey].items = [];
			}
		}
		if (pkey && ikey) {
			if ("undefined" === typeof this.namereg[pkey].ikey[ikey]) {
				this.namereg[pkey].ikey[ikey] = {};
				this.namereg[pkey].ikey[ikey].count = 0;
				this.namereg[pkey].ikey[ikey].skey = {};
				this.namereg[pkey].ikey[ikey].items = [];
				this.namereg[pkey].count += 1;
			}
		}
		if (pkey && ikey && skey) {
			if ("undefined" === typeof this.namereg[pkey].ikey[ikey].skey[skey]) {
				this.namereg[pkey].ikey[ikey].skey[skey] = {};
				this.namereg[pkey].ikey[ikey].skey[skey].items = [];
				this.namereg[pkey].ikey[ikey].count += 1;
			}
		}
		if ("undefined" === typeof this.nameind[item_id]) {
			this.nameind[item_id] = {};
			this.nameindpkeys[item_id] = {};
		}
		if (pkey) {
			this.nameind[item_id][pkey + "::" + ikey + "::" + skey] = true;
			this.nameindpkeys[item_id][pkey] = this.namereg[pkey];
		}
	};
	this.addname = addname;
	this.delitems = delitems;
	this.evalname = evalname;
};
CSL.Disambiguation = function (state) {
	this.state = state;
	this.sys = this.state.sys;
	this.registry = state.registry.registry;
	this.ambigcites = state.registry.ambigcites;
	this.configModes();
	this.clashes = [1, 0];
};
CSL.Disambiguation.prototype.run = function(akey) {
	if (!this.modes.length) {
		return;
	}
	this.initVars(akey);
	this.runDisambig();
};
CSL.Disambiguation.prototype.runDisambig = function () {
	var pos, len, ppos, llen, pppos, lllen, ismax;
	for (pos = 0; pos < this.lists.length; pos += 1) {
		this.nnameset = 0;
		this.gnameset = 0;
		this.gname = 0;
		while(this.lists[pos][1].length) {
			this.listpos = pos;
			if (!this.base) {
				this.base = this.lists[pos][0];
			}
			if (this.rerun) {
				this.rerun = false;
			} else {
				this.scanItems(this.lists[pos], 0);
			}
			ismax = this.incrementDisambig();
			this.scanItems(this.lists[pos], 1);
			this.evalScan(ismax);
		}
	}
};
CSL.Disambiguation.prototype.scanItems = function (list, phase) {
	var pos, len, Item, otherItem, ItemCite, ignore, base;
	Item = list[1][0];
	this.scanlist = list[1];
	this.partners = [];
    var tempResult = this.getItemDesc(Item);
    this.base = tempResult[0];
	if (!phase) {
		this.base.disambiguate = false;
	}
    this.maxvals = tempResult[1];
    this.minval = tempResult[2];
    ItemCite = tempResult[3];
	this.partners.push(Item);
	this.clashes[phase] = 0;
	this.nonpartners = [];
	for (pos = 1, len = list[1].length; pos < len; pos += 1) {
		otherItem = list[1][pos];
		var otherItemData = this.getItemDesc(otherItem);
		var otherItemCite = otherItemData[3];
		if (ItemCite === otherItemCite) {
			this.clashes[phase] += 1;
			this.partners.push(otherItem);
		} else {
			this.nonpartners.push(otherItem);
		}
	}
};
CSL.Disambiguation.prototype.evalScan = function (ismax) {
	this[this.modes[this.modeindex]](ismax);
};
CSL.Disambiguation.prototype.disNames = function (ismax) {
	var pos, len, mybase;
	if (this.clashes[1] === 0 && this.nonpartners.length === 1) {
		mybase = CSL.cloneAmbigConfig(this.base);
		mybase.year_suffix = false;
		this.state.registry.registerAmbigToken(this.akey, "" + this.partners[0].id, mybase);
		this.state.registry.registerAmbigToken(this.akey, "" + this.nonpartners[0].id, mybase);
		this.lists[this.listpos] = [this.base, []];
	} else if (this.clashes[1] === 0) {
		mybase = CSL.cloneAmbigConfig(this.base);
		mybase.year_suffix = false;
		this.state.registry.registerAmbigToken(this.akey, "" + this.partners[0].id, mybase);
		this.lists[this.listpos] = [this.base, []];
	} else if (this.nonpartners.length === 1) {
		mybase = CSL.cloneAmbigConfig(this.base);
		mybase.year_suffix = false;
		this.state.registry.registerAmbigToken(this.akey, "" + this.nonpartners[0].id, mybase);
		this.lists[this.listpos] = [this.base, this.partners];
	} else if (this.clashes[1] < this.clashes[0]) {
		this.lists[this.listpos] = [this.base, this.partners];
		if (this.nonpartners.length === 1) {
			this.state.registry.registerAmbigToken(this.akey, "" + this.nonpartners[0].id, this.base);
		} else {
			this.lists.push([this.base, this.nonpartners]);
		}
	} else {
		if (ismax || this.advance_mode) {
			for (pos = 0, len = this.partners.length; pos < len; pos += 1) {
				this.state.registry.registerAmbigToken(this.akey, "" + this.partners[pos].id, this.base);
			}
			if (ismax) {
				this.lists[this.listpos] = [this.base, this.nonpartners];
			}
		} else {
			this.rerun = true;
		}
	}
};
CSL.Disambiguation.prototype.disGivens = function (ismax) {
	var pos, len, mybase;
	if (this.clashes[1] === 0 && this.nonpartners.length === 1) {
		if (this.clashes[0] === 1) {
			this.base = this.decrementNames();
		}
		mybase = CSL.cloneAmbigConfig(this.base);
		mybase.year_suffix = false;
		this.state.registry.registerAmbigToken(this.akey, "" + this.partners[0].id, this.base);
		this.state.registry.registerAmbigToken(this.akey, "" + this.nonpartners[0].id, mybase);
		this.lists[this.listpos] = [this.base, []];
	} else if (this.clashes[1] === 0) {
		if (this.clashes[0] === 1) {
			this.base = this.decrementNames();
		}
		mybase = CSL.cloneAmbigConfig(this.base);
		mybase.year_suffix = false;
		this.state.registry.registerAmbigToken(this.akey, "" + this.partners[0].id, mybase);
		this.lists[this.listpos] = [this.base, this.nonpartners];
	} else if (this.nonpartners.length === 1) {
		if (this.clashes[0] === 1) {
			this.base = this.decrementNames();
		}
		mybase = CSL.cloneAmbigConfig(this.base);
		mybase.year_suffix = false;
		this.state.registry.registerAmbigToken(this.akey, "" + this.nonpartners[0].id, mybase);
		this.lists[this.listpos] = [this.base, this.partners];
	} else if (this.clashes[1] < this.clashes[0]) {
		this.lists[this.listpos] = [this.base, this.partners];
		if (this.nonpartners.length === 1) {
			this.state.registry.registerAmbigToken(this.akey, "" + this.nonpartners[0].id, this.base);
		} else {
			this.lists.push([this.base, this.nonpartners]);
		}
	} else {
		this.base = CSL.cloneAmbigConfig(this.oldbase);
		if (ismax || this.advance_mode) {
			for (pos = 0, len = this.partners.length; pos < len; pos += 1) {
				this.state.registry.registerAmbigToken(this.akey, "" + this.partners[pos].id, this.base);
			}
			if (ismax) {
				this.lists[this.listpos] = [this.base, this.nonpartners];
			}
		} else {
			this.rerun = true;
		}
	}
};
CSL.Disambiguation.prototype.disExtraText = function () {
	var pos, len, mybase;
	if (this.clashes[1] === 0) {
		mybase = CSL.cloneAmbigConfig(this.base);
		mybase.year_suffix = false;
		this.state.registry.registerAmbigToken(this.akey, "" + this.partners[0].id, mybase);
		if (this.nonpartners.length === 1) {
			this.state.registry.registerAmbigToken(this.akey, "" + this.nonpartners[0].id, mybase);
			this.lists[this.listpos] = [this.base,[]];
		} else {
			this.lists[this.listpos] = [this.base, this.nonpartners];
		}
	} else {
		this.base.disambiguate = false;
		this.lists[this.listpos] = [this.base, this.lists[this.listpos][1].slice(1)];
	}
};
CSL.Disambiguation.prototype.disYears = function () {
	var pos, len, tokens, token, item;
	tokens = [];
	for (pos = 0, len = this.lists[this.listpos][1].length; pos < len; pos += 1) {
		token = this.registry[this.lists[this.listpos][1][pos].id];
		tokens.push(token);
	}
	tokens.sort(this.state.registry.sorter.compareKeys);
	for (pos = 0, len = tokens.length; pos < len; pos += 1) {
		if (pos === 0) {
			this.state.registry.registerAmbigToken(this.akey, "" + tokens[pos].id, this.base, this.scanlist);
		} else {
			this.state.registry.registerAmbigToken(this.akey, "" + tokens[pos].id, this.base);
		}
		tokens[pos].disambig.year_suffix = ""+pos;
	}
	this.lists[this.listpos] = [this.base, []];
};
CSL.Disambiguation.prototype.incrementDisambig = function () {
	var val, maxed;
	maxed = false;
	this.oldbase = CSL.cloneAmbigConfig(this.base);
	if (this.advance_mode) {
		this.modeindex += 1;
		this.advance_mode = false;
	}
	if (!maxed && "disNames" === this.modes[this.modeindex]) {
		if (this.base.names[this.nnameset] < this.maxvals[this.nnameset]) {
			this.base.names[this.nnameset] += 1;
		} else {
			if (this.nnameset < (this.base.names.length - 1)) {
				this.nnameset += 1;
			}
			if (this.base.names[this.nnameset] < this.maxvals[this.nnameset]) {
				this.base.names[this.nnameset] += 1;
			}
		}
		if (this.nnameset === (this.base.names.length - 1) && this.base.names[this.nnameset] === this.maxvals[this.nnameset]) {
			if (this.modeindex === (this.modes.length - 1)) {
				return true;
			} else {
				maxed = false;
			}
		}
	}
	if (!maxed && "disGivens" === this.modes[this.modeindex]) {
		if (this.gname < this.maxvals[this.gnameset]) {
			if (this.base.givens[this.gnameset][this.gname] === this.minval) {
				this.base.givens[this.gnameset][this.gname] += 1;
			}
			this.base.givens[this.gnameset][this.gname] += 1;
			this.gname += 1;
		} else {
			if (this.gnameset < (this.base.givens.length - 1)) {
				this.gnameset += 1;
				this.gname = 0;
			}
			if (this.gname < this.maxvals[this.gnameset]) {
				this.base.givens[this.gnameset][this.gname] += 1;
				this.gname += 1;
			}
		}
	}
	if (!maxed && "disExtraText" === this.modes[this.modeindex]) {
		maxed = false;
		this.base.disambiguate = true;
		if (this.modeindex === (this.modes.length - 1)) {
			return true;
		} else {
			maxed = false;
		}
	}
	if (!maxed && "disYears" === this.modes[this.modeindex]) {
		maxed = false;
	}
	if (!maxed && this.modes[this.modeindex] === "disGivens") {
		if ((this.gnameset >= (this.base.names.length - 1) && ("undefined" === typeof this.maxvals[this.gnameset] || this.gname === this.maxvals[this.gnameset])) || this.base.names.length === 0) {
			if (this.modeindex === (this.modes.length - 1)) {
				maxed = true;
			} else {
				this.advance_mode = true;
			}
		}
	}
	if (!maxed && this.modes[this.modeindex] === "disNames") {
		if ((this.nnameset >= (this.base.names.length - 1) && ("undefined" === typeof this.maxvals[this.nnameset] ||this.base.names[this.nnameset] === this.maxvals[this.nnameset])) || this.base.names.length === 0) {
			if (this.modeindex === (this.modes.length - 1)) {
				maxed = true;
			} else {
				this.advance_mode = true;
			}
		}
	}
	return maxed;
};
CSL.Disambiguation.prototype.getItemDesc = function (Item, forceMax) {
	var str, maxvals, minval, base;
	str = CSL.getAmbiguousCite.call(this.state, Item, this.base);
	maxvals = CSL.getMaxVals.call(this.state);
	minval = CSL.getMinVal.call(this.state);
	base = CSL.getAmbigConfig.call(this.state);
	return [base, maxvals, minval, str];
};
CSL.Disambiguation.prototype.initVars = function (akey) {
	var i, ilen, myIds, myItemBundles, myItems;
	this.lists = [];
	this.base = false;
	this.akey = akey;
	this.advance_mode = false;
	myItemBundles = [];
	myIds = this.ambigcites[akey];
	if (myIds && myIds.length > 1) {
		for (i = 0, ilen = myIds.length; i < ilen; i += 1) {
			var myItem = this.state.retrieveItem("" + myIds[i]);
			myItemBundles.push([this.getItemDesc(myItem), myItem]);
		}
		myItemBundles.sort(
			function (a, b) {
				if (a[0][1] > b[0][1]) {
					return 1;
				} else if (a[0][1] < b[0][1]) {
					return -1;
				} else {
					if (a[1].id > b[1].id) {
						return 1;
					} else if (a[1].id < b[1].id) {
						return -1;
					} else {
						return 0;
					}
				}
			}
		);
		myItems = [];
		for (i = 0, ilen = myItemBundles.length; i < ilen; i += 1) {
			myItems.push(myItemBundles[i][1]);
		}
		this.lists.push([this.base, myItems]);
	}
	this.modeindex = 0;
};
CSL.Disambiguation.prototype.configModes = function () {
	var dagopt, gdropt;
	this.modes = [];
	if (this.state.opt["disambiguate-add-names"]) {
		this.modes.push("disNames");
	}
	dagopt = this.state.opt["disambiguate-add-givenname"];
	gdropt = this.state.opt["givenname-disambiguation-rule"];
	if (dagopt && gdropt === "by-cite") {
		this.modes.push("disGivens");
	}
	if (this.state.opt.has_disambiguate) {
		this.modes.push("disExtraText");
	}
	if (this.state.opt["disambiguate-add-year-suffix"]) {
		this.modes.push("disYears");
	}
};
CSL.Disambiguation.prototype.decrementNames = function () {
	var base_return, do_me, i, j, pos, len, ppos, llen, ids;
	base_return = CSL.cloneAmbigConfig(this.base);
	do_me = false;
	len = base_return.givens.length - 1;
	for (pos = len; pos > -1; pos += -1) {
		llen = base_return.givens[pos].length - 1;
		for (ppos = llen; ppos > -1; ppos += -1) {
			if (base_return.givens[pos][ppos] > this.oldbase.givens[pos][ppos]) {
				do_me = true;
			}
		}
	}
	if (do_me) {
		len = base_return.givens.length - 1;
		for (pos = len; pos > -1; pos += -1) {
			llen = base_return.givens[pos].length - 1;
			for (ppos = llen; ppos > -1; ppos += -1) {
				if (base_return.givens[pos][ppos] > this.oldbase.givens[pos][ppos]) {
					break;
				}
				if (ppos < base_return.names[pos]) {
					base_return.names[pos] += -1;
				}
			}
		}
	}
	return base_return;
};
CSL.Registry.CitationReg = function (state) {
	this.citationById = {};
	this.citationByIndex = [];
};
