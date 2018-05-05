function removeByValue( arr, val ) {
	for ( var i = 0; i < arr.length; i++ ) {
		if ( arr[ i ] == val ) {
			arr.splice( i, 1 );
			break;
		}
	}
}

class GraphPath {
	constructor( pathInfo ) {
		this.pathInfo = pathInfo;
	}

	addEdge( a, b ) {
		var nb = this.pathInfo[ a ].neighbors;
		for ( var i in nb ) {
			if ( nb[ i ] == b ) {
				return;
			}
		}
		this.pathInfo[ a ].neighbors.push( b );
		this.pathInfo[ b ].neighbors.push( a );
	}

	removeEdge( a, b ) {
		let nb = this.pathInfo[ a ].neighbors;
		removeByValue( nb, b );
		nb = this.pathInfo[ b ].neighbors;
		removeByValue( nb, a );
	}

	removeEdges( arr ) {
		for ( let pair of arr ) {
			this.removeEdge( pair[ 0 ], pair[ 1 ] );
		}
	}

	shortestPath( source, target ) {
		if ( source == target ) {
			return [ source ];
		}
		var queue = [ source ],
			visited = {
				source: true
			},
			predecessor = {},
			tail = 0;
		while ( tail < queue.length ) {
			var u = queue[ tail++ ];
			var neighbors = this.pathInfo[ u ].neighbors;
			for ( var i = 0; i < neighbors.length; ++i ) {
				var v = neighbors[ i ];
				if ( visited[ v ] ) {
					continue;
				}
				visited[ v ] = true;
				if ( v === target ) {
					var path = [ v ];
					while ( u !== source ) {
						path.push( u );
						u = predecessor[ u ];
					}
					path.push( u );
					path.reverse();
					return path;
				}
				predecessor[ v ] = u;
				queue.push( v );
			}
		}
		return false;
	}

	findPath( start, end ) {
		return this.shortestPath( start, end );
	}
}

export {
	GraphPath
};