# jf-remark 1.0.2 [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[![npm install jf-remark](https://nodei.co/npm/jf-remark.png?compact=true)](https://npmjs.org/package/jf-remark/)


## English

Plugins for working with markdown documents and remark parser.

----

## Español

Provee de un conjunto de plugins para ser usados con [remark](https://github.com/remarkjs/remark) que transforman bloques de texto Markdown.

Algunos plugins funcionan como preprocesadores generando contenido markdown a partir de archivos o bloques de texto markdown.

Otros modifican el resultado final directamente, por ejemplo reenumerando las secciones del documento.



### Enumerate

Reenumera las secciones del documento.

Dado un documento con la siguiente estructura:

```
# 1 Capítulo 1
## Mi sección 1
### Mi subsección 1
### Mi subsección 2
## Mi sección 2
### Mi subsección 1
### Mi subsección 2
```

Se reenumeraría así:

```
# 1 Capítulo 1
## 1.1. Mi sección 1
### 1.1.1. Mi subsección 1
### 1.1.2. Mi subsección 2
## 1.2 Mi. sección 2
### 1.2.1. Mi subsección 1
### 1.2.2. Mi subsección 2
```

Se pueden modificar los contadores colocando como primer valor del encabezado una
cantidad numérica o mediante la opción `sections`.

#### Registro

```javascript
const jfRemarkEnumerate = require('jf-remark/src/Enumerate');

// Se omite la carga y configuración de remark.
// Luego se agrega el plugin Enumerate

remark
    .use(jfRemarkEnumerate, options)
    .process(markdown, (err, result) => console.log(error || result));
```

El plugin acepta las siguientes opciones al momento de registrarlo:

Nombre   | Tipo     | Descripción                           
-------- | -------- | --------------------------------------
sections | number[] | Contadores iniciales de las secciones.


### Import

Plugin para incluir el contenido de otro archivo markdown e insertar el AST generado.

#### Registro

```javascript
const jfRemarkImport = require('jf-remark/src/Import');

// Se omite la carga y configuración de remark.
// Luego se agrega el plugin Import

remark
    .use(jfRemarkImport, options)
    .process(markdown, (err, result) => console.log(error || result));
```

El plugin acepta las siguientes opciones al momento de registrarlo:

Nombre | Tipo   | Descripción                                                
------ | ------ | -----------------------------------------------------------
root   | string | Ruta a partir de la cual se leerán los archivos a importar.

#### Uso

La sintáxis es la siguiente:

```
!@{file|first|last}@!
```

Donde:

Nombre | Tipo   | Descripción                                         
------ | ------ | ----------------------------------------------------
file   | string | Ruta del archivo a importar.                        
first  | number | Línea inicial a leer (1 por defecto).               
last   | number | Última línea a leer (final del archivo por defecto).


### Include

Plugin para incluir el contenido de archivo e insertarlos como si fuera
un bloque de código.

#### Registro

```javascript
const jfRemarkInclude = require('jf-remark/src/Include');

// Se omite la carga y configuración de remark.
// Luego se agrega el plugin Include

remark
    .use(jfRemarkInclude, options)
    .process(markdown, (err, result) => console.log(error || result));
```

El plugin acepta las siguientes opciones al momento de registrarlo:

Nombre | Tipo   | Descripción                                                
------ | ------ | -----------------------------------------------------------
indent | number | Espacios a usar al formatear ciertos archivos de código.   
root   | string | Ruta a partir de la cual se leerán los archivos a importar.

#### Uso

La sintáxis es la siguiente:

```
!!{file|lang|first|last}!!
```

Donde:

Nombre | Tipo   | Descripción                                                                           
------ | ------ | --------------------------------------------------------------------------------------
file   | string | Ruta del archivo a importar.                                                          
lang   | string | Lenguaje a usar para el coloreado del bloque. Si no se especifica se usa la extensión.
first  | number | Línea inicial a leer (1 por defecto).                                                 
last   | number | Última línea a leer (final del archivo por defecto).                                  


### ListDelete

Resalta de manera recursiva la primera frase de una lista colocándole una línea de tachado.

#### Registro

```javascript
const jfRemarkListDelete = require('jf-remark/src/ListDelete');

// Se omite la carga y configuración de remark.
// Luego se agrega el plugin ListDelete

remark
    .use(jfRemarkListDelete)
    .process(markdown, (err, result) => console.log(error || result));
```

#### Ejemplo

El siguiente bloque:

```
!~{
- id: Identificador del usuario.
- name: Nombre del usuario.
}~!
```

Genera el siguiente resultado:

```
- ~~id~~: Identificador del usuario.
- ~~name~~: Nombre del usuario.
```


### ListEmphasis

Resalta de manera recursiva la primera frase de una lista colocándola en cursiva.

#### Registro

```javascript
const jfRemarkListEmphasis = require('jf-remark/src/ListEmphasis');

// Se omite la carga y configuración de remark.
// Luego se agrega el plugin ListEmphasis

remark
    .use(jfRemarkListEmphasis)
    .process(markdown, (err, result) => console.log(error || result));
```

#### Ejemplo

El siguiente bloque:

```
!_{
- id: Identificador del usuario.
- name: Nombre del usuario.
}_!
```

Genera el siguiente resultado:

```
- _id_: Identificador del usuario.
- _name_: Nombre del usuario.
```


### ListInlineCode

Resalta de manera recursiva la primera frase de una lista colocándola como si fuera código en línea.

#### Registro

```javascript
const jfRemarkListInlineCode = require('jf-remark/src/ListInlineCode');

// Se omite la carga y configuración de remark.
// Luego se agrega el plugin ListInlineCode

remark
    .use(jfRemarkListInlineCode)
    .process(markdown, (err, result) => console.log(error || result));
```

#### Ejemplo

El siguiente bloque:

```
!`{
- id: Identificador del usuario.
- name: Nombre del usuario.
}`!
```

Genera el siguiente resultado:

```
- `id`: Identificador del usuario.
- `name`: Nombre del usuario.
```


### ListStrong

Resalta de manera recursiva la primera frase colocándola en negritas.

#### Registro

```javascript
const jfRemarkListStrong = require('jf-remark/src/ListStrong');

// Se omite la carga y configuración de remark.
// Luego se agrega el plugin ListStrong

remark
    .use(jfRemarkListStrong)
    .process(markdown, (err, result) => console.log(error || result));
```

#### Ejemplo

El siguiente bloque:

```
!*{
- id: Identificador del usuario.
- name: Nombre del usuario.
}*!
```

Genera el siguiente resultado:

```
- **id**: Identificador del usuario.
- **name**: Nombre del usuario.
```
