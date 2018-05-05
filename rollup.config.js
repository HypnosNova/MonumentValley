function glsl() {
  return {
    transform( code, id ) {
      if( /\.glsl$/.test( id ) ===
        false ) return;
      var transformedCode =
        'export default ' + JSON.stringify(
          code
          .replace( /[ \t]*\/\/.*\n/g,
            '' ) // remove //
          .replace(
            /[ \t]*\/\*[\s\S]*?\*\//g,
            '' ) // remove /* */
          .replace( /\n{2,}/g, '\n' ) // # \n+ to \n
        ) + ';';
      return {
        code: transformedCode,
        map: {
          mappings: ''
        }
      };
    }
  };
}

export default {
  input: 'src/Hypeometry.js',
  indent: '\t',
  plugins: [
    glsl()
  ],
  sourcemap: true,
  output: [ {
      format: 'umd',
      name: 'HYPEOMETRY',
      file: 'build/hypeometry.js'
    },
    {
      format: 'es',
      file: 'build/hypeometry.module.js'
    }
  ]
};