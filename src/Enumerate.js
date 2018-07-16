const jfRemarkBase = require('./Base');
/**
 * Opciones del plugin.
 *
 * @type {object}
 * @type {number[]} sections Contadores iniciales de las secciones.
 */
const options      = {
    sections : [0, 0, 0, 0, 0, 0]
};

/**
 * Reenumera las secciones del documento.
 *
 * Dado un documento con la siguiente estructura:
 *
 * ```
 * # 1 Capítulo 1
 * ## Mi sección 1
 * ### Mi subsección 1
 * ### Mi subsección 2
 * ## Mi sección 2
 * ### Mi subsección 1
 * ### Mi subsección 2
 * ```
 *
 * Se reenumeraría así:
 *
 * ```
 * # 1 Capítulo 1
 * ## 1.1. Mi sección 1
 * ### 1.1.1. Mi subsección 1
 * ### 1.1.2. Mi subsección 2
 * ## 1.2 Mi. sección 2
 * ### 1.2.1. Mi subsección 1
 * ### 1.2.2. Mi subsección 2
 * ```
 *
 * Se pueden modificar los contadores colocando como primer valor del encabezado una
 * cantidad numérica o mediante la opción `sections`.
 *
 * @namespace jf.remark
 * @class     jf.remark.Enumerate
 * @extends   jf.remark.Base
 */
class jfRemarkEnumerate extends jfRemarkBase
{
    /**
     * @override
     */
    static get options()
    {
        return options;
    }

    /**
     * @override
     */
    static get type()
    {
        return 'heading';
    }

    /**
     * @override
     */
    visitor(node)
    {
        const _children = node.children;
        if (_children.length === 1)
        {
            const _value    = _children[0].value;
            const _numbers  = _value.match(/^[\d.]+/);
            const _sections = options.sections;
            if (_numbers)
            {
                _sections.forEach((s, i) => _sections[i] = 0);
                _numbers[0].split('.').forEach(
                    (n, i) => _sections[i] = parseInt(n, 10)
                );
            }
            else
            {
                const _depth     = node.depth - 1;
                _sections.length = _depth + 1;
                if (_sections[_depth])
                {
                    ++_sections[_depth];
                }
                else
                {
                    _sections[_depth] = 1;
                }
                _children[0].value = _sections.join('.') + '. ' + _value;
            }
        }
    }
}

module.exports       = jfRemarkEnumerate.register();
module.exports.Class = jfRemarkEnumerate;
