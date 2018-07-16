const jfRemarkListBase = require('./ListBase');

/**
 * Resalta de manera recursiva la primera frase de una lista colocándole una línea de tachado.
 *
 * @namespace jf.remark
 * @class     jf.remark.ListDelete
 * @extends   jf.remark.ListBase
 */
class jfRemarkListDelete extends jfRemarkListBase
{
    /**
     * @override
     */
    static get chars()
    {
        return '!~{';
    }
}

module.exports       = jfRemarkListDelete.register();
module.exports.Class = jfRemarkListDelete;
