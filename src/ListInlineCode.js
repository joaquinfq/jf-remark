const jfRemarkListBase = require('./ListBase');

/**
 * Resalta de manera recursiva la primera frase de una lista colocándola como si fuera código en línea.
 *
 * @namespace jf.remark
 * @class     jf.remark.ListInline
 * @extends   jf.remark.ListBase
 */
class jfRemarkListInlineCode extends jfRemarkListBase
{
    /**
     * @override
     */
    static get chars()
    {
        return '!`{';
    }

    /**
     * @override
     */
    buildChild(value)
    {
        return {
            value,
            type : this.type
        };
    }
}

module.exports       = jfRemarkListInlineCode.register();
module.exports.Class = jfRemarkListInlineCode;
