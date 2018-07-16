const fs        = require('fs');
const regexcape = require('regexcape');
const revChars  = {
    '<' : '>',
    '{' : '}',
    '[' : ']'
};
/**
 * Clase base para el resto de plugins.
 *
 * @namespace jf.remark
 * @class     jf.remark.Base
 */
module.exports = class jfRemarkBase
{
    /**
     * Devuelve los caracteres usados para registrar el bloque procesado por el plugin.
     * Los caracteres devuelto serán los de apertura y se invertirán para obtener los de cierre.
     * Por ejemplo, si devuelve `!@{` el de cierre serà `}@!`.
     *
     * @return {string} Listado de caracteres.
     */
    static get chars()
    {
        return '';
    }

    /**
     * Opciones del plugin.
     *
     * @return {object}
     */
    static get options()
    {
        return {};
    }

    /**
     * Si el plugin es usado solamente para modificar los valores de los nodos
     * existentes, esta propiedad indica los tipos de nodos que se modificarán.
     *
     * @property type
     * @type     {string}
     */
    static get type()
    {
        return '';
    }

    /**
     * Constructor de la clase jfRemarkBase.
     *
     * @constructor
     */
    constructor()
    {
        const _open  = this.constructor.chars;
        const _close = _open
            .split('')
            .reverse()
            .map(c => revChars[c] || c)
            .join('');
        /**
         * Caracteres de cierre del bloque.
         *
         * @type {string}
         */
        this.close = _close;
        /**
         * Caracteres de apertura del bloque.
         *
         * @type {string}
         */
        this.open = _open;
        /**
         * Expresión regular a usar para detectar el bloque gestionado por el plugin.
         *
         * @property regexp
         * @type     {RegExp}
         */
        this.regexp = _open
            ? new RegExp(`^\\s*${regexcape(_open)}(.+?)${regexcape(_close)}\\s*`, 's')
            : null;
    }

    /**
     * Lee el contenido del archivo.
     * Si el archivo no existe, devuelve el nombre del archivo.
     *
     * @param {string} filename  Ruta del archivo a leer.
     * @param {number} start     Línea inicial a leer.
     * @param {number} end       Línea final a leer.
     *
     * @return {string} Contenido del archivo.
     */
    load(filename, start, end)
    {
        let _content;
        if (fs.existsSync(filename))
        {
            _content = fs.readFileSync(filename, 'utf8');
            if (_content && (start !== undefined || end !== undefined))
            {
                start    = start
                    ? parseInt(start, 10) - 1
                    : 0;
                end      = end
                    ? parseInt(end, 10)
                    : _content.length;
                _content = _content.split('\n').slice(start, end).join('\n');
            }
        }
        else
        {
            _content = filename;
        }

        return _content;
    }

    /**
     * Método que se llama cuando en el contenido se encuentra un bloque
     * gestionado por el plugin.
     *
     * @param {Parser} Parser  Referencia de la clase del analizador usado.
     * @param {string} content Coincindencia del archivo.
     * @param {object} config  Configuración de `jf.remark` almacenada en el Parser.
     *
     * @abstract
     */
    parseMatch(Parser, content, config)
    {
        throw new Error(`Nétodo ${this.constructor.name}::parseMatch debe ser implementado.`);
    }

    /**
     * Permite registrar el plugin en el parser.
     *
     * @return {function} Función que registra el plugin en el parser.
     */
    static register()
    {
        const _Class = this;
        //
        return function (options)
        {
            let _result;
            if (options)
            {
                Object.assign(_Class.options, options);
            }
            const _type = _Class.type;
            if (_type)
            {
                const _plugin = new _Class();
                _result       = root => _Class.visit(root, _type, _plugin.visitor.bind(_plugin));
            }
            else
            {
                const _name    = _Class.name;
                const _proto   = this.Parser.prototype;
                const _methods = _proto.blockMethods;
                _methods.splice(_methods.indexOf('indentedCode') - 1, 0, _name);
                _proto.blockTokenizers[_name] = new _Class().tokenizer();
            }

            return _result;
        }
    }

    /**
     * Devuelve el tokenizador a usar.
     * El tokenizador devuelto es el punto de entrada del plugin.
     *
     * @return {function} Tokenizador del plugin.
     */
    tokenizer()
    {
        const _plugin = this;
        /**
         * Tokenizador a usar para la clase.
         *
         * @param {function} eat    Manejador del AST.
         * @param {string}   value  Valor del token actual.
         * @param {boolean}  silent Indica si se debe modificar el AST.
         *
         * @return {undefined|boolean|object} Resultado del análisis.
         */
        return function (eat, value, silent)
        {
            const _match = value.match(_plugin.regexp);
            let _result;
            if (_match)
            {
                if (silent)
                {
                    _result = true;
                }
                else
                {
                    _result = _plugin.parseMatch(this.constructor, _match[1].trim(), this.__jfRemark || {});
                    if (_result)
                    {
                        _result = silent || eat(_match[0])(_result);
                    }
                }
            }

            return _result;
        }
    }

    /**
     * Recorre el listado de nodos aplicando la función especificada si el
     * tipo coincide con el especificado.
     *
     * @param {object}   node    Nodo a visitar.
     * @param {string}   type    Filtrar por este tipo de nodo.
     * @param {function} visitor Función que recibirá el nodo encontrado.
     */
    static visit(node, type, visitor)
    {
        if (node && node.type === 'root' && Array.isArray(node.children))
        {
            node.children.forEach(node => this.visit(node, type, visitor));
        }
        else if (node.type === type)
        {
            visitor(node);
        }
    }

    /**
     * Modifica el nodo especificado.
     *
     * @param {object} node Nodo a visitar.
     *
     * @abstract
     */
    visitor(node)
    {
        throw new Error(`Nétodo ${this.constructor.name}::visitor debe ser implementado.`);
    }
};
