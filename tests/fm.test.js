const extractFM = require("../src/dumb_fm_extractor.js").extractFM;

const testDoc1 = `This is Makdown
===============
this one has no frontmatter at all, but
there is HR somewhere:

---

Just in case`

const testDoc2 = `----
frontmatter: "present"
----

This doc has frontmatter.`

const testDoc3 = `---
broken: true
----

this one is broken`


console.log(extractFM(testDoc1));
console.log(extractFM(testDoc2));
console.log(extractFM(testDoc3));
