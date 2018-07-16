const jfRemarkListBase = require('./ListBase');

/**
 * Resalta de manera recursiva la primera frase de una lista colocándola en cursiva.
 *
 * @namespace jf.remark
 * @class     jf.remark.ListEmphasis
 * @extends   jf.remark.ListBase
 */
class jfRemarkListEmphasis extends jfRemarkListBase
{
    /**
     * @override
     */
    static get chars()
    {
        return '!_{';
    }
}

module.exports       = jfRemarkListEmphasis.register();
module.exports.Class = jfRemarkListEmphasis;
