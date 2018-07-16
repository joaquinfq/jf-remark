const jfRemarkBase = require('./ListBase');

/**
 * Resalta de manera recursiva la primera frase colocándola en negritas.
 *
 * @namespace jf.remark
 * @class     jf.remark.ListStrong
 * @extends   jf.remark.ListBase
 */
class jfRemarkListStrong extends jfRemarkBase
{
    /**
     * @override
     */
    static get chars()
    {
        return '!*{';
    }
}

module.exports       = jfRemarkListStrong.register();
module.exports.Class = jfRemarkListStrong;
