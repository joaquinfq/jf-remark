const jfRemarkBase = require('./Base');
const path         = require('path');
/**
 * Opciones del plugin.
 *
 * @type {object}
 * @type {string} root Ruta a partir de la cual se leerán los archivos a importar.
 */
const options      = {
    root : process.cwd()
};
/**
 * Parámetros del plugin.
 *
 * @type {object}
 * @type {string} file  Ruta del archivo a importar.
 * @type {number} first Línea inicial a leer (1 por defecto).
 * @type {number} last  Última línea a leer (final del archivo por defecto).
 */
const params       = {
    file  : 0,
    first : 1,
    last  : 2
};

/**
 * Plugin para incluir el contenido de otro archivo markdown e insertar el AST generado.
 *
 * @namespace jf.remark
 * @class     jf.remark.Import
 * @extends   jf.remark.Base
 */
class jfRemarkImport extends jfRemarkBase
{
    /**
     * @override
     */
    static get chars()
    {
        return '!@{';
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
        const _parts = content.trim().split('|').map(l => l.trim());
        let _file    = _parts[params.file];
        const _first = _parts[params.first];
        const _last  = _parts[params.last];
        if (!_file.endsWith('.md'))
        {
            _file += '.md';
        }
        const _filename    = path.resolve(config.root || options.root, _file);
        const _content     = this.load(_filename, _first || 1, _last || 0);
        const _parser      = new Parser({ path : _filename }, _content);
        _parser.__jfRemark = {
            root : path.dirname(_filename)
        };

        return _parser.parse();
    }
}

module.exports       = jfRemarkImport.register();
module.exports.Class = jfRemarkImport;
