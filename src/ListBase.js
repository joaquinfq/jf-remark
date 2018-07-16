const jfRemarkBase = require('./Base');
const path         = require('path');
/**
 * Clase base para los plugin que resaltan de manera recursiva la primera palabra
 * de una lista de manera simple.
 *
 * @namespace jf.remark
 * @class     jf.remark.ListBase
 * @extends   jf.remark.Base
 */
module.exports = class jfRemarkListBase extends jfRemarkBase
{
    /**
     * @override
     */
    constructor()
    {
        super();
        const _name = this.constructor.name.replace('jfRemarkList', '');
        /**
         * Tipo del nodo a crear para resaltar el texto.
         *
         * @property type
         * @type     {string}
         */
        this.type = _name[0].toLowerCase() + _name.substr(1);
    }

    /**
     * Construye el nodo hijo que se agregará con el texto resaltado.
     *
     * @param {string} value Valor del texto a resaltar.
     *
     * @return {object} Nodo a agregar.
     */
    buildChild(value)
    {
        return {
            type     : this.type,
            children :
                [
                    {
                        value,
                        type : 'text'
                    }
                ]
        };
    }

    /**
     * Convierte un objeto en una lista Markdown.
     *
     * @param {object} obj Objeto q convertir.
     *
     * @return {string} Objeto convertido en lista.
     */
    objectToList(obj)
    {
        return Object.keys(obj)
            .map(
                key =>
                {
                    let _value = obj[key];
                    return _value && typeof _value === 'object'
                        ? `- ${key}:\n${this.objectToList(_value).replace(/^/gm, '  ')}`
                        : `- ${key}: ${_value}`;
                }
            )
            .filter(Boolean)
            .join('\n');
    }

    /**
     * Analiza un nodo de tipo `List`.
     *
     * @param {object} node Nodo a analizar.
     */
    parseList(node)
    {
        node.children.forEach(
            child =>
            {
                if (child.type === 'listItem')
                {
                    this.parseListItem(child);
                }
            }
        )
    }

    /**
     * Analiza un nodo de tipo `ListItem`.
     *
     * @param {object} node Nodo a analizar.
     */
    parseListItem(node)
    {
        node.children.forEach(
            (child, index) =>
            {
                if (!index && child.type === 'paragraph')
                {
                    this.parseParagraph(child);
                }
                else if (child.type === 'list')
                {
                    this.parseList(child);
                }
            }
        )
    }

    /**
     * Crea el nodo para resaltar el texto.
     *
     * @param {object} paragraph Primer elemento de tipo `Paragraph` de un `ListItem`.
     */
    parseParagraph(paragraph)
    {
        const _children = paragraph.children;
        const _text     = _children[0];
        if (_text.type === 'text')
        {
            const _value = _text.value;
            const _index = _value.indexOf(':');
            if (_index !== -1)
            {
                _children.unshift(this.buildChild(_value.substr(0, _index).trim()));
                _text.value = _value.substr(_index);
            }
        }
    }

    /**
     * @override
     */
    parseMatch(Parser, content, config)
    {
        if (content.endsWith('.json'))
        {
            const _filename = path.resolve(config.root || this.constructor.options.root, content);
            const _json     = this.load(_filename);
            if (_json !== _filename)
            {
                content = _json.trim();
            }
        }
        if (content[0] === '{' && content.endsWith('}'))
        {
            try
            {
                const _json = JSON.parse(content);
                content     = this.objectToList(_json);
                console.log(content);
            }
            catch (e)
            {
                content = `\`ERROR: ${e.message} -- ${content}\``;
            }
        }
        const _parser = new Parser('', content);
        const _root   = _parser.parse();
        this.constructor.visit(_root, 'list', this.parseList.bind(this));

        return _root;
    }
};
