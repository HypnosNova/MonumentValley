class GeometryResource {
	constructor( size, autoInit ) {
		this.size = size;
		if ( autoInit ) {
			this.init(this.size);
		}
	}

	initGroundGeometry( size ) {
		return new THREE.PlaneBufferGeometry( size, size );
	}

	initCylinderGeometry( size ) {
		return new THREE.CylinderBufferGeometry( size, size, size, 64 );
	}

	initBoxGeometry( size ) {
		return new THREE.BoxBufferGeometry( size, size, size );
	}

	initStickGeomerty( size ) {
		return new THREE.BoxBufferGeometry( size / 10, size, size / 10 );
	}

	initTriangleGeomerty( size ) {
		let triangleGeometry = new THREE.BoxGeometry( size, size, size );
		triangleGeometry.vertices = [ new THREE.Vector3( size >> 1, size >> 1, size >>
				1 ), new THREE.Vector3( size >> 1, size >> 1, -size >> 1 ), new THREE.Vector3( -
				size >> 1, -size >> 1, size >> 1 ), new THREE.Vector3( -size >> 1, -size >>
				1, -size >> 1 ), new THREE.Vector3( -size >> 1, size >> 1, -size >> 1 ),
			new THREE.Vector3( -size >> 1, size >> 1, size >> 1 ), new THREE.Vector3( -
				size >> 1, -size >> 1, -size >> 1 ), new THREE.Vector3( -size >> 1, -size >>
				1, size >> 1 )
		];
		triangleGeometry.mergeVertices();
		return triangleGeometry;
	}

	initArcGeomerty( size ) {
		let circleRadius = size / 6 * 5;
		let circleShape = new THREE.Shape();
		circleShape.moveTo( -size / 2, size / 2 );
		circleShape.lineTo( -size / 2, size / 3 );
		circleShape.absarc( -size / 2, -size / 2, size * 5 / 6, Math.PI / 2, 0, true );
		circleShape.lineTo( size / 2, -size / 2 );
		circleShape.lineTo( size / 2, size / 2 );
		circleShape.lineTo( -size / 2, size / 2 );
		let arcGeometry = new THREE.ExtrudeBufferGeometry( circleShape, {
			sizes: 1,
			amount: size,
			bevelEnabled: false
		} );
		arcGeometry.center();
		return arcGeometry;
	}

	initRoundRectGeometry( size ) {
		let roundedRectShape = new THREE.Shape();
		( function( ctx, x, y, width, height, radius ) {
			ctx.moveTo( x, y + radius );
			ctx.lineTo( x, y + height - radius );
			ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
			ctx.lineTo( x + width - radius, y + height );
			ctx.quadraticCurveTo( x + width, y + height, x + width, y + height -
				radius );
			ctx.lineTo( x + width, y + radius );
			ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
			ctx.lineTo( x + radius, y );
			ctx.quadraticCurveTo( x, y, x, y + radius );
		} )( roundedRectShape, 0, 0, size, size, size / 3 );
		let roundRectGeometry = new THREE.ExtrudeBufferGeometry( roundedRectShape, {
			sizes: 1,
			amount: size,
			bevelEnabled: false
		} );
		roundRectGeometry.center();
		return roundRectGeometry;
	}

	initRingGeometry( size ) {
		let cirlceShape = new THREE.Shape();
		cirlceShape.moveTo( 0, 0 );
		cirlceShape.absarc( size, size, size, 0, Math.PI * 2, false );
		let smallCirlce = new THREE.Path();
		smallCirlce.moveTo( 0, 0 );
		smallCirlce.absarc( size, size, size / 2, 0, Math.PI * 2, false );
		cirlceShape.holes.push( smallCirlce );
		let ringGeometry = new THREE.ExtrudeBufferGeometry( cirlceShape, {
			steps: 1,
			amount: size,
			bevelEnabled: false
		} );
		ringGeometry.center();
	}

	init( size ) {
		this.size = size;
		this.groundGeometry = this.initGroundGeometry( this.size );
		this.cylinderGeometry = this.initCylinderGeometry( this.size );
		this.cubeGeometry = this.initBoxGeometry( this.size );
		this.triangleGeometry = this.initTriangleGeomerty( this.size );
		this.stickGeometry = this.initStickGeomerty( this.size );
		this.arcGeometry = this.initArcGeomerty( this.size );
		this.roundRectGeometry = this.initRoundRectGeometry( this.size );
		this.ringGeometry = this.initRingGeometry( this.size );
	}

}

export {
	GeometryResource
};