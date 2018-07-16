const fs     = require('fs');
const path   = require('path');
const pkg    = require('./package');
const files  = {};
const srcDir = path.join(__dirname, 'src');

function buildSection(Plugin)
{
    const _Class   = require(path.resolve(srcDir, Plugin)).Class;
    const _plugin  = new _Class();
    const _lines   = [
        `### ${Plugin}`,
        extractDoc(Plugin),
        '#### Registro',
        `\`\`\`javascript
const jfRemark${Plugin} = require('jf-remark/src/${Plugin}');

// Se omite la carga y configuración de remark.
// Luego se agrega el plugin ${Plugin}

remark
    .use(jfRemark${Plugin}, options)
    .process(markdown, (err, result) => console.log(error || result));
\`\`\``,
    ];
    const _options = extractVar(Plugin, 'options');
    if (_options.length)
    {
        _lines.push(
            'El plugin acepta las siguientes opciones al momento de registrarlo:',
            buildTable(_options)
        );
    }
    else
    {
        const _last   = _lines.length - 1;
        _lines[_last] = _lines[_last].replace(", options", '');
    }
    const _params = extractVar(Plugin, 'params');
    if (_params.length)
    {
        _lines.push(
            '#### Uso',
            'La sintáxis es la siguiente:',
            `\`\`\`\n${_plugin.open}${_params.map(p => p.Nombre).join('|')}${_plugin.close}\n\`\`\``,
            'Donde:',
            buildTable(_params)
        );
    }
    return _lines.join('\n\n');
}

function buildSectionList(Plugin)
{
    const _Class  = require(path.resolve(srcDir, Plugin)).Class;
    const _plugin = new _Class();
    const _open   = _plugin.open;
    const _type   = _plugin.type;
    const _char   = _type === 'delete' || _type === 'strong'
        ? _open[1] + _open[1]
        : _open[1];
    return `${buildSection(Plugin)}

#### Ejemplo

El siguiente bloque:

\`\`\`
${_open}
- id: Identificador del usuario.
- name: Nombre del usuario.
${_plugin.close}
\`\`\`

Genera el siguiente resultado:

\`\`\`
- ${_char}id${_char}: Identificador del usuario.
- ${_char}name${_char}: Nombre del usuario.
\`\`\``;
}

function buildTable(items)
{
    const _names = Object.keys(items[0]);
    const _lines = [
        _names
    ];
    let _lengths = _names.map(n => [n.length]);
    for (const _item of items)
    {
        const _values = Object.values(_item);
        _values.map((v, i) => _lengths[i].push(v.length));
        _lines.push(_values);
    }
    _lengths = _lengths.map(l => Math.max(...l));
    _lines.splice(1, 0, _lengths.map(l => '-'.repeat(l)));
    return _lines
        .map(l => l.map((c, i) => c + ' '.repeat(_lengths[i] - c.length)).join(' | '))
        .join('\n');
}

function cleanComment(comment)
{
    return comment
        .replace(/^\s+\*(\s*?|$)/gm, '')
        .split('\n')
        .map(l => l.trim())
        .join('\n')
        .trim();
}

function extractComment(content, index)
{
    let _comment = '';
    let _index   = index;
    while (_index--)
    {
        if (content.substr(_index, 3) === '/**')
        {
            _comment = content.substring(_index + 3, content.indexOf('*/', _index) - 1);
            break;
        }
    }
    return _comment;
}

function extractDoc(Plugin)
{
    const _content = load(Plugin);
    const _comment = extractComment(_content, _content.indexOf('class'));
    const _doc     = _comment.substring(0, _comment.indexOf('@'));
    //
    return cleanComment(_doc);
}

function extractVar(Plugin, name)
{
    const _config  = [];
    const _content = load(Plugin);
    const _doc     = _content.match(new RegExp(`^const\\s+${name}\\s*=([^;]+);`, 'm'));
    if (_doc)
    {
        const _comment = extractComment(_content, _doc.index);
        if (_comment)
        {
            _comment
                .split('\n')
                .forEach(
                    l =>
                    {
                        const _match = l.match(/@type\s+\{([^}]+)\}\s+([^\s]+)\s+(.+)$/);
                        if (_match)
                        {
                            _config.push(
                                {
                                    'Nombre'      : _match[2],
                                    'Tipo'        : _match[1],
                                    'Descripción' : _match[3]
                                }
                            );
                        }
                    }
                );
        }
    }
    //
    return _config;
}

function load(Plugin)
{
    if (!Plugin.endsWith('.js'))
    {
        Plugin += '.js';
    }
    if (!files[Plugin])
    {
        files[Plugin] = fs.readFileSync(path.join(srcDir, Plugin), 'utf8');
    }
    return files[Plugin];
}

const name     = pkg.name;
const sections = [
    `# ${name} ${pkg.version} [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)`,
    `[![npm install ${name}](https://nodei.co/npm/${name}.png?compact=true)](https://npmjs.org/package/${name}/)\n`,
    '## English',
    pkg.description,
    '----',
    '## Español',
    'Provee de un conjunto de plugins para ser usados con [https://github.com/remarkjs/remark](remark) que transforman bloques de texto Markdown.',
    'Algunos plugins funcionan como preprocesadores generando contenido markdown a partir de archivos o bloques de texto markdown.',
    'Otros modifican el resultado final directamente, por ejemplo reenumerando las secciones del documento.',
    ''
];
fs.readdirSync(srcDir).sort().forEach(
    file =>
    {
        if (!file.includes('Base.js'))
        {
            const _Plugin = file.substr(0, file.length - 3);
            if (file.startsWith('List'))
            {
                sections.push(buildSectionList(_Plugin) + '\n');
            }
            else
            {
                sections.push(buildSection(_Plugin) + '\n');
            }
        }
    }
);
console.log(sections.join('\n\n'));
fs.writeFileSync(path.join(__dirname, 'README.md'), sections.join('\n\n'));
