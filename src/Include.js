const jfRemarkBase = require('./Base');
const fs           = require('fs');
const path         = require('path');
/**
 * Opciones del plugin.
 *
 * @type {object}
 * @type {number} indent Espacios a usar al formatear ciertos archivos de código.
 * @type {string} root   Ruta a partir de la cual se leerán los archivos a importar.
 */
const options      = {
    indent : 4,
    root   : process.cwd()
};
/**
 * Parámetros del plugin.
 *
 * @type {object}
 * @type {string} file  Ruta del archivo a importar.
 * @type {string} lang  Lenguaje a usar para el coloreado del bloque. Si no se especifica se usa la extensión.
 * @type {number} first Línea inicial a leer (1 por defecto).
 * @type {number} last  Última línea a leer (final del archivo por defecto).
 */
const params       = {
    file  : 0,
    lang  : 1,
    first : 2,
    last  : 3
};

/**
 * Plugin para incluir el contenido de archivo e insertarlos como si fuera
 * un bloque de código.
 *
 * @namespace jf.remark
 * @class     jf.remark.Include
 * @extends   jf.remark.Base
 */
class jfRemarkInclude extends jfRemarkBase
{
    /**
     * @override
     */
    static get chars()
    {
        return '!!{';
    }

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
    parseMatch(Parser, content, config)
    {
        let _content;
        const _parts    = content.trim().split('|').map(l => l.trim());
        const _file     = _parts[params.file];
        const _lang     = _parts[params.lang];
        const _first    = _parts[params.first];
        const _last     = _parts[params.last];
        const _filename = path.resolve(config.root || options.root, _file);
        if (fs.existsSync(_filename))
        {
            _content = this.load(_filename, _first || 1, _last || 0);
            if (_file.endsWith('.json'))
            {
                try
                {
                    _content = JSON.stringify(JSON.parse(_content), null, options.indent || 4);
                }
                catch (e)
                {
                    _content = `${_file}: ${e.message}`;
                }
            }
        }
        else
        {
            _content = 'Archivo no encontrado: ' + _file;
        }

        return {
            lang  : _lang || path.extname(_file).replace(/^\./, ''),
            type  : 'code',
            value : _content
        };
    }
}

module.exports       = jfRemarkInclude.register();
module.exports.Class = jfRemarkInclude;
