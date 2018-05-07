let DEFAULT_SETTINGS = {

	blockSize: 36,
	moveSpeed: 300

};

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

class TurntableX extends THREE.Group {
	constructor( options, factory, app ) {
		super();
		this.disable = false;
		this.app = app;
		this.options = options;
		let defaultM;
		for ( let i in factory.materials ) {
			defaultM = factory.materials[ i ];
			break;
		}
		this.factory = factory;
		this.size = factory.size;
		this.materials = factory.materials;
		this.position.set( options.x * this.size || 0, options.y * this.size || 0,
			options.z * this.size || 0 );

		let axisG = new THREE.BoxBufferGeometry( this.size, this.size / 4, this.size /
			4 );
		let axisM = this.materials[ options.axisMaterial ] || defaultM;

		let axis = new THREE.Mesh( axisG, axisM );
		axis.position.x = -this.size;
		this.add( axis );

		let hoopG = new THREE.CylinderBufferGeometry( this.size / 2.3, this.size /
			2.3, this.size, 32 );
		let hoopM = this.materials[ options.hoopMaterial ] || defaultM;
		this.hoop = new THREE.Mesh( hoopG, hoopM );
		this.hoop.rotation.z = Math.PI / 2;
		this.add( this.hoop );

		let rodG = new THREE.CylinderBufferGeometry( this.size / 6, this.size / 6,
			this.size * 2.5, 32 );
		let rodM = this.materials[ options.rodMaterial ] || defaultM;
		this.rod1 = new THREE.Mesh( rodG, rodM );
		this.add( this.rod1 );

		this.rod2 = this.rod1.clone();
		this.rod2.rotation.x = Math.PI / 2;
		this.add( this.rod2 );

		let poleG = new THREE.CylinderBufferGeometry( this.size / 4, this.size / 4,
			this.size * 0.5, 32 );
		let poleM = this.materials[ options.poleMaterial ] || defaultM;
		this.pole1 = new THREE.Mesh( poleG, poleM );
		this.pole1.position.y = this.size * 1.5;
		this.add( this.pole1 );
		this.pole2 = this.pole1.clone();
		this.pole2.position.y = -this.size * 1.5;
		this.add( this.pole2 );
		this.pole3 = this.pole1.clone();
		this.pole3.position.y = 0;
		this.pole3.position.z = this.size * 1.5;
		this.pole3.rotation.x = Math.PI / 2;
		this.add( this.pole3 );
		this.pole4 = this.pole1.clone();
		this.pole4.position.y = 0;
		this.pole4.position.z = -this.size * 1.5;
		this.pole4.rotation.x = Math.PI / 2;
		this.add( this.pole4 );

		this.dragEnd = this.dragEnd.bind( this );
		this.dragMove = this.dragMove.bind( this );
		this.addEvent();
	}

	becomeDisable() {
		if ( this.disable ) {
			return;
		}
		this.disable = true;
		new TWEEN.Tween( this.rod1.scale )
			.to( {
				y: 0.5
			}, 350 )
			.start();
		new TWEEN.Tween( this.rod2.scale )
			.to( {
				y: 0.5
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole1.position )
			.to( {
				y: this.pole1.position.y / 2
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole2.position )
			.to( {
				y: this.pole2.position.y / 2
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole3.position )
			.to( {
				z: this.pole3.position.z / 2
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole4.position )
			.to( {
				z: this.pole4.position.z / 2
			}, 350 )
			.start();
	}

	becomeAble() {
		if ( !this.disable ) {
			return;
		}
		this.disable = false;
		new TWEEN.Tween( this.rod1.scale )
			.to( {
				y: 1
			}, 350 )
			.start();
		new TWEEN.Tween( this.rod2.scale )
			.to( {
				y: 1
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole1.position )
			.to( {
				y: this.pole1.position.y * 2
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole2.position )
			.to( {
				y: this.pole2.position.y * 2
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole3.position )
			.to( {
				z: this.pole3.position.z * 2
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole4.position )
			.to( {
				z: this.pole4.position.z * 2
			}, 350 )
			.start();
	}

	addEvent() {
		this.hoop.events = new NOVA.Events();
		this.hoop.events.mousedown.add( ( event ) => {
			this.onDown( event );
		} );
		this.hoop.events.mouseup.add( ( event ) => {
			this.dragEnd( event );
		} );
		this.pole4.events = this.pole3.events = this.pole2.events = this.pole1.events =
			this.rod2.events = this.rod1.events = this.hoop.events;
	}

	onDown( event ) {
		if ( this.disable ) {
			return;
		}
		this.isDown = true;
		let canvasXY = this.app.sceneCoordinateToCanvasCoordinate( this );
		let distance = event.center.distanceTo( canvasXY );
		if ( distance > 0 ) {
			this.clickAngle = 0;
			if ( event.center.y > canvasXY.y ) {
				this.clickAngle = 2 * Math.PI - Math.acos( ( event.center.x - canvasXY.x ) /
					distance );
			} else {
				this.clickAngle = Math.acos( ( event.center.x - canvasXY.x ) / distance );
			}
		} else {
			this.clickAngle = 0;
		}
		this.preAngle = this.clickAngle;
		let dom = this.app.renderer.domElement;
		dom.addEventListener( "mouseup", this.dragEnd, false );
		dom.addEventListener( "touchend", this.dragEnd, false );
		dom.addEventListener( "mousemove", this.dragMove, false );
		dom.addEventListener( "touchmove", this.dragMove, false );
	}

	dragEnd( event ) {
		this.isDown = false;
		let dom = this.app.renderer.domElement;
		dom.removeEventListener( "mousemove", this.dragMove, false );
		dom.removeEventListener( "touchmove", this.dragMove, false );
		dom.removeEventListener( "mouseup", this.dragEnd, false );
		dom.removeEventListener( "touchend", this.dragEnd, false );
		let tmp = this.rotation.x;
		while ( tmp < 0 ) {
			tmp += 2 * Math.PI;
		}
		this.rotation.x = tmp;
		if ( this.rotation.x > Math.PI / 4 * 7 ) {
			this.rotation.x -= 2 * Math.PI;
		}
		tmp -= Math.PI / 4;
		let quaro = 0;
		while ( tmp > 0 ) {
			quaro++;
			tmp -= Math.PI / 2;
		}

		quaro = quaro % 4;
		if ( quaro === 0 ) {
			tmp = 0;
		} else if ( quaro === 1 ) {
			tmp = Math.PI / 2;
		} else if ( quaro === 2 ) {
			tmp = Math.PI;
		} else if ( quaro === 3 ) {
			tmp = Math.PI * 1.5;
		}
		let time = Math.abs( this.rotation.x - tmp ) * 400;
		new TWEEN.Tween( this.rotation )
			.to( {
				x: tmp
			}, time )
			.easing( TWEEN.Easing.Back.Out )
			.start();
		if ( this.options.funcEnd ) {
			this.options.funcEnd( event, this.rotation.x, this.factory.gameLevel );
		}
	}

	dragMove( event ) {
		if ( event.touches ) {
			var e = event.touches[ 0 ];
		} else {
			var e = event;
		}
		e.center = new THREE.Vector2( e.clientX, e.clientY );
		if ( this.isDown ) {
			var canvasXY = this.app.sceneCoordinateToCanvasCoordinate( this );
			var distance = e.center.distanceTo( canvasXY );
			if ( distance > 0 ) {
				this.clickAngle = 0;
				if ( e.center.y > canvasXY.y ) {
					this.clickAngle = 2 * Math.PI - Math.acos( ( e.center.x - canvasXY.x ) /
						distance );
				} else {
					this.clickAngle = Math.acos( ( e.center.x - canvasXY.x ) / distance );
				}
			} else {
				this.clickAngle = 0;
			}
			this.rotation.x += this.clickAngle - this.preAngle;
			this.preAngle = this.clickAngle;
			if ( this.options.funcMove ) {
				this.options.funcMove( e, this.rotation.x, this.factory.gameLevel );
			}
		}
	}
}

class TurntableY extends THREE.Group {
	constructor( options, factory, app ) {
		super();
		this.disable = false;
		this.app = app;
		this.options = options;
		let defaultM;
		for ( let i in factory.materials ) {
			defaultM = factory.materials[ i ];
			break;
		}
		this.factory = factory;
		this.size = factory.size;
		this.materials = factory.materials;
		this.position.set( options.x * this.size || 0, options.y * this.size || 0,
			options.z * this.size || 0 );
		this.rotation.z = Math.PI / 2;

		let axisG = new THREE.BoxBufferGeometry( this.size, this.size / 4, this.size /
			4 );
		let axisM = this.materials[ options.axisMaterial ] || defaultM;

		let axis = new THREE.Mesh( axisG, axisM );
		axis.position.x = -this.size;
		this.add( axis );

		let hoopG = new THREE.CylinderBufferGeometry( this.size / 2.3, this.size /
			2.3, this.size, 32 );
		let hoopM = this.materials[ options.hoopMaterial ] || defaultM;
		this.hoop = new THREE.Mesh( hoopG, hoopM );
		this.hoop.rotation.z = Math.PI / 2;
		this.add( this.hoop );

		let rodG = new THREE.CylinderBufferGeometry( this.size / 6, this.size / 6,
			this.size * 2.5, 32 );
		let rodM = this.materials[ options.rodMaterial ] || defaultM;
		this.rod1 = new THREE.Mesh( rodG, rodM );
		this.add( this.rod1 );

		this.rod2 = this.rod1.clone();
		this.rod2.rotation.x = Math.PI / 2;
		this.add( this.rod2 );

		let poleG = new THREE.CylinderBufferGeometry( this.size / 4, this.size / 4,
			this.size * 0.5, 32 );
		let poleM = this.materials[ options.poleMaterial ] || defaultM;
		this.pole1 = new THREE.Mesh( poleG, poleM );
		this.pole1.position.y = this.size * 1.5;
		this.add( this.pole1 );
		this.pole2 = this.pole1.clone();
		this.pole2.position.y = -this.size * 1.5;
		this.add( this.pole2 );
		this.pole3 = this.pole1.clone();
		this.pole3.position.y = 0;
		this.pole3.position.z = this.size * 1.5;
		this.pole3.rotation.x = Math.PI / 2;
		this.add( this.pole3 );
		this.pole4 = this.pole1.clone();
		this.pole4.position.y = 0;
		this.pole4.position.z = -this.size * 1.5;
		this.pole4.rotation.x = Math.PI / 2;
		this.add( this.pole4 );

		this.dragEnd = this.dragEnd.bind( this );
		this.dragMove = this.dragMove.bind( this );
		this.addEvent();
	}

	becomeDisable() {
		if ( this.disable ) {
			return;
		}
		this.disable = true;
		new TWEEN.Tween( this.rod1.scale )
			.to( {
				y: 0.5
			}, 350 )
			.start();
		new TWEEN.Tween( this.rod2.scale )
			.to( {
				y: 0.5
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole1.position )
			.to( {
				y: this.pole1.position.y / 2
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole2.position )
			.to( {
				y: this.pole2.position.y / 2
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole3.position )
			.to( {
				z: this.pole3.position.z / 2
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole4.position )
			.to( {
				z: this.pole4.position.z / 2
			}, 350 )
			.start();
	}

	becomeAble() {
		if ( !this.disable ) {
			return;
		}
		this.disable = false;
		new TWEEN.Tween( this.rod1.scale )
			.to( {
				y: 1
			}, 350 )
			.start();
		new TWEEN.Tween( this.rod2.scale )
			.to( {
				y: 1
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole1.position )
			.to( {
				y: this.pole1.position.y * 2
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole2.position )
			.to( {
				y: this.pole2.position.y * 2
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole3.position )
			.to( {
				z: this.pole3.position.z * 2
			}, 350 )
			.start();
		new TWEEN.Tween( this.pole4.position )
			.to( {
				z: this.pole4.position.z * 2
			}, 350 )
			.start();
	}

	addEvent() {
		this.hoop.events = new NOVA.Events();
		this.hoop.events.mousedown.add( ( event ) => {
			this.onDown( event );
		} );
		this.hoop.events.mouseup.add( ( event ) => {
			this.dragEnd( event );
		} );
		this.pole4.events = this.pole3.events = this.pole2.events = this.pole1.events =
			this.rod2.events = this.rod1.events = this.hoop.events;
	}

	onDown( event ) {
		if ( this.disable ) {
			return;
		}
		this.isDown = true;
		let canvasXY = this.app.sceneCoordinateToCanvasCoordinate( this );
		let distance = event.center.distanceTo( canvasXY );
		if ( distance > 0 ) {
			this.clickAngle = 0;
			if ( event.center.y > canvasXY.y ) {
				this.clickAngle = 2 * Math.PI - Math.acos( ( event.center.x - canvasXY.x ) /
					distance );
			} else {
				this.clickAngle = Math.acos( ( event.center.x - canvasXY.x ) / distance );
			}
		} else {
			this.clickAngle = 0;
		}
		this.preAngle = this.clickAngle;
		let dom = this.app.renderer.domElement;
		dom.addEventListener( "mouseup", this.dragEnd, false );
		dom.addEventListener( "touchend", this.dragEnd, false );
		dom.addEventListener( "mousemove", this.dragMove, false );
		dom.addEventListener( "touchmove", this.dragMove, false );
	}

	dragEnd( event ) {
		this.isDown = false;
		let dom = this.app.renderer.domElement;
		dom.removeEventListener( "mousemove", this.dragMove, false );
		dom.removeEventListener( "touchmove", this.dragMove, false );
		dom.removeEventListener( "mouseup", this.dragEnd, false );
		dom.removeEventListener( "touchend", this.dragEnd, false );
		let tmp = this.rotation.y;
		while ( tmp < 0 ) {
			tmp += 2 * Math.PI;
		}
		this.rotation.y = tmp;
		if ( this.rotation.y > Math.PI / 4 * 7 ) {
			this.rotation.y -= 2 * Math.PI;
		}
		tmp -= Math.PI / 4;
		let quaro = 0;
		while ( tmp > 0 ) {
			quaro++;
			tmp -= Math.PI / 2;
		}

		quaro = quaro % 4;
		if ( quaro === 0 ) {
			tmp = 0;
		} else if ( quaro === 1 ) {
			tmp = Math.PI / 2;
		} else if ( quaro === 2 ) {
			tmp = Math.PI;
		} else if ( quaro === 3 ) {
			tmp = Math.PI * 1.5;
		}
		let time = Math.abs( this.rotation.y - tmp ) * 400;
		new TWEEN.Tween( this.rotation )
			.to( {
				y: tmp
			}, time )
			.easing( TWEEN.Easing.Back.Out )
			.start();
		if ( this.options.funcEnd ) {
			this.options.funcEnd( event, this.rotation.y, this.factory.gameLevel );
		}
	}

	dragMove( event ) {
		if ( event.touches ) {
			var e = event.touches[ 0 ];
		} else {
			var e = event;
		}
		e.center = new THREE.Vector2( e.clientX, e.clientY );
		if ( this.isDown ) {
			var canvasXY = this.app.sceneCoordinateToCanvasCoordinate( this );
			var distance = e.center.distanceTo( canvasXY );
			if ( distance > 0 ) {
				this.clickAngle = 0;
				if ( e.center.y > canvasXY.y ) {
					this.clickAngle = 2 * Math.PI - Math.acos( ( e.center.x - canvasXY.x ) /
						distance );
				} else {
					this.clickAngle = Math.acos( ( e.center.x - canvasXY.x ) / distance );
				}
			} else {
				this.clickAngle = 0;
			}
			this.rotation.y += this.clickAngle - this.preAngle;
			this.preAngle = this.clickAngle;
			if ( this.options.funcMove ) {
				this.options.funcMove( e, this.rotation.y, this.factory.gameLevel );
			}
		}
	}
}

function firstUpperCase( word = "cube" ) {
	return word.substring( 0, 1 )
		.toUpperCase() + word.substring( 1 );
}

class MeshFactory {
	constructor( gameLevel ) {
		this.geometryResource = gameLevel.geometryResource;
		this.size = gameLevel.settings.blockSize;
		this.materials = gameLevel.data.materials;
		this.scene = gameLevel.scene;
		this.gameLevel = gameLevel;
	}

	createRing( item, m, container ) {
		let cube = new THREE.Mesh( this.geometryResource.ringGeometry, m );
		cube.position.set( item.x * this.size || 0, item.y * this.size || 0, item.z *
			this.size || 0 );
		cube.rotation.set( item.rx || 0, item.ry || 0, item.rz || 0 );
		cube.scale.set( item.sx || 1, item.sy || 1, item.sz || 1 );
		container.add( cube );
		if ( item.cannotClick ) {
			cube.isPenetrated = true;
		}
		return cube;
	}

	createRoundRect( item, m, container ) {
		let cube = new THREE.Mesh( this.geometryResource.roundRectGeometry, m );
		cube.position.set( item.x * this.size || 0, item.y * this.size || 0, item.z *
			this.size || 0 );
		cube.rotation.set( item.rx || 0, item.ry || 0, item.rz || 0 );
		cube.scale.set( item.sx || 1, item.sy || 1, item.sz || 1 );
		container.add( cube );
		if ( item.cannotClick ) {
			cube.isPenetrated = true;
		}
		return cube;
	}

	createRoof( item, ms, container ) {
		let material;
		for ( let i in this.materials ) {
			material = this.materials[ i ];
			break;
		}
		let group = new THREE.Group();
		var step = this.size / 1.3;
		let geometry = new THREE.CylinderBufferGeometry( step * 0.95, step, this.size /
			5,
			4 );
		let m = this.materials[ ms[ 0 ] ] || material;
		let cylinder = new THREE.Mesh( geometry, m );
		cylinder.position.y = -step * 0.4;
		group.add( cylinder );

		geometry = new THREE.CylinderBufferGeometry( step, step, this.size / 10, 4 );
		m = this.materials[ ms[ 1 ] ] || material;
		cylinder = new THREE.Mesh( geometry, m );
		cylinder.position.y = -this.size * 0.45;
		group.add( cylinder );

		geometry = new THREE.CylinderBufferGeometry( step * 1.05, step * 0.95, this.size /
			5, 4 );
		m = this.materials[ ms[ 1 ] ] || material;
		cylinder = new THREE.Mesh( geometry, m );
		cylinder.position.y = -this.size * 0.2;
		group.add( cylinder );

		geometry = new THREE.CylinderBufferGeometry( step * 1.2, step * 1.05, this.size /
			5, 4 );
		m = this.materials[ ms[ 1 ] ] || material;
		cylinder = new THREE.Mesh( geometry, m );
		cylinder.position.y = 0;
		group.add( cylinder );

		geometry = new THREE.CylinderBufferGeometry( step * 1.25, step * 1.2, this.size /
			5, 4 );
		m = this.materials[ ms[ 1 ] ] || material;
		cylinder = new THREE.Mesh( geometry, m );
		cylinder.position.y = this.size * 0.2;
		group.add( cylinder );

		geometry = new THREE.CylinderBufferGeometry( step * 1.15, step * 1.25, this.size /
			5, 4 );
		m = this.materials[ ms[ 1 ] ] || material;
		cylinder = new THREE.Mesh( geometry, m );
		cylinder.position.y = this.size * 0.4;
		group.add( cylinder );

		geometry = new THREE.CylinderBufferGeometry( step * 0.90, step * 1.15, this.size /
			5, 4 );
		m = this.materials[ ms[ 1 ] ] || material;
		cylinder = new THREE.Mesh( geometry, m );
		cylinder.position.y = this.size * 0.6;
		group.add( cylinder );

		geometry = new THREE.CylinderBufferGeometry( step * 0.63, step * 0.90, this.size /
			5, 4 );
		m = this.materials[ ms[ 1 ] ] || material;
		cylinder = new THREE.Mesh( geometry, m );
		cylinder.position.y = this.size * 0.8;
		group.add( cylinder );

		geometry = new THREE.CylinderBufferGeometry( step * 0.45, step * 0.63, this.size /
			5, 4 );
		m = this.materials[ ms[ 1 ] ] || material;
		cylinder = new THREE.Mesh( geometry, m );
		cylinder.position.y = this.size;
		group.add( cylinder );

		geometry = new THREE.CylinderBufferGeometry( step * 0.30, step * 0.45, this.size /
			5, 4 );
		m = this.materials[ ms[ 1 ] ] || material;
		cylinder = new THREE.Mesh( geometry, m );
		cylinder.position.y = this.size * 1.2;
		group.add( cylinder );
		geometry = new THREE.CylinderBufferGeometry( step * 0.15, step * 0.30, this.size *
			0.4, 4 );
		m = this.materials[ ms[ 1 ] ] || material;
		cylinder = new THREE.Mesh( geometry, m );
		cylinder.position.y = this.size * 1.5;
		group.add( cylinder );

		geometry = new THREE.CylinderBufferGeometry( step * 0.001, step * 0.15, this
			.size * 0.4, 4 );
		m = this.materials[ ms[ 1 ] ] || material;
		cylinder = new THREE.Mesh( geometry, m );
		cylinder.position.y = this.size * 1.9;
		group.add( cylinder );

		group.position.set( item.x * this.size || 0, item.y * this.size || 0, item.z *
			this.size || 0 );
		group.rotation.set( item.rx || 0, item.ry || 0, item.rz || 0 );
		container.add( group );
		return group;
	}

	createCube( item, m, container ) {
		let cube = new THREE.Mesh( this.geometryResource.cubeGeometry, m );
		cube.position.set( item.x * this.size || 0, item.y * this.size || 0, item.z *
			this.size || 0 );
		cube.rotation.set( item.rx || 0, item.ry || 0, item.rz || 0 );
		cube.scale.set( item.sx || 1, item.sy || 1, item.sz || 1 );
		container.add( cube );
		return cube;
	}

	createPlane( item, m, container ) {
		let cube = new THREE.Mesh( this.geometryResource.cubeGeometry, m );
		cube.position.set( item.x * this.size || 0, ( item.y + 5 / 12 ) * this.size ||
			0, item.z * this.size || 0 );
		cube.rotation.set( item.rx || 0, item.ry || 0, item.rz || 0 );
		cube.scale.y = 1 / 6;
		cube.scale.x = item.sx || 1;
		cube.scale.z = item.sz || 1;
		container.add( cube );
		return cube;
	}

	createGround( item, m, container ) {
		let cube = new THREE.Mesh( this.geometryResource.groundGeometry, m );
		cube.position.set( item.x * this.size || 0, ( item.y + 5 / 12 ) * this.size ||
			0, item.z * this.size || 0 );
		cube.rotation.set( item.rx || 0, item.ry || 0, item.rz || 0 );
		cube.scale.x = item.width;
		cube.scale.y = item.height;
		container.add( cube );
		return cube;
	}

	createTri( item, m, container ) {
		let cube = new THREE.Mesh( this.geometryResource.triangleGeometry, m );
		cube.position.set( item.x * this.size || 0, item.y * this.size || 0, item.z *
			this.size || 0 );
		cube.rotation.set( item.rx || 0, item.ry || 0, item.rz || 0 );
		cube.scale.set( item.sx || 1, item.sy || 1, item.sz || 1 );
		container.add( cube );
		return cube;
	}

	createCylinder( item, m, container ) {
		let cube = new THREE.Mesh( this.geometryResource.cylinderGeometry, m );
		cube.position.set( item.x * this.size || 0, item.y * this.size || 0, item.z *
			this.size || 0 );
		cube.rotation.set( item.rx || 0, item.ry || 0, item.rz || 0 );
		cube.scale.set( item.sx || 1, item.sy || 1, item.sz || 1 );
		container.add( cube );
		return cube;
	}

	createArc( item, m, container ) {
		let cube = new THREE.Mesh( this.geometryResource.arcGeometry, m );
		cube.position.set( item.x * this.size || 0, item.y * this.size || 0, item.z *
			this.size || 0 );
		cube.rotation.set( item.rx || 0, item.ry || 0, item.rz || 0 );
		container.add( cube );
		return cube;
	}

	createStick( item, m, container ) {
		let cube = new THREE.Mesh( this.geometryResource.stickGeometry, m );
		cube.position.set( item.x * this.size || 0, item.y * this.size || 0, item.z *
			this.size || 0 );
		cube.rotation.set( item.rx || 0, item.ry || 0, item.rz || 0 );
		if ( item.height ) {
			cube.scale.y = item.height;
		}
		if ( item.d === 0 ) {
			cube.position.x -= this.size * 0.45;
			cube.position.z -= this.size * 0.45;
		} else if ( item.d === 1 ) {
			cube.position.x += this.size * 0.45;
			cube.position.z -= this.size * 0.45;
		} else if ( item.d === 2 ) {
			cube.position.x += this.size * 0.45;
			cube.position.z += this.size * 0.45;
		} else if ( item.d === 3 ) {
			cube.position.x -= this.size * 0.45;
			cube.position.z += this.size * 0.45;
		}
		cube.isPenetrated = true;
		container.add( cube );
		return cube;
	}

	createStair( item, m, container ) {
		let cube = new THREE.Mesh( this.geometryResource.triangleGeometry, m );
		cube.position.set( item.x * this.size || 0, item.y * this.size || 0, item.z *
			this.size || 0 );
		cube.rotation.set( item.rx || 0, item.ry || 0, item.rz || 0 );
		if ( !item.height ) {
			item.height = 1;
		}
		let group = new THREE.Group();
		for ( let ii = 0; ii < item.height * 6; ii++ ) {
			var c = cube.clone();
			c.position.y += ( ii + 1 ) * this.size / 6 + this.size / 4;
			if ( item.d === 0 ) {
				c.position.z -= ( ii ) * this.size / 6 - this.size / 4;
				c.rotation.y = Math.PI / 2;
			} else if ( item.d === 1 ) {
				c.position.x += ( ii ) * this.size / 6 - this.size / 4;
			} else if ( item.d === 2 ) {
				c.position.z += ( ii ) * this.size / 6 - this.size / 4;
				c.rotation.y = -Math.PI / 2;
			} else if ( item.d === 3 ) {
				c.position.x -= ( ii ) * this.size / 6 - this.size / 4;
				c.rotation.y = Math.PI;
			} else {
				c.position.z -= ( ii ) * this.size / 6 - this.size / 4;
				c.rotation.y = Math.PI / 2;
			}
			c.scale.x = 0.5;
			c.scale.y = 0.5;
			group.add( c );
		}
		container.add( group );
		return group;
	}

	createGroup( item, useless, container ) {
		let group = new THREE.Group();
		group.position.set( item.x * this.size || 0, item.y * this.size || 0, item.z *
			this.size || 0 );
		group.rotation.set( item.rx || 0, item.ry || 0, item.rz || 0 );
		container.add( group );

		//TODO 优化
		for ( let child of item.children ) {
			let material;
			if ( child.materialId ) {
				material = this.materials[ child.materialId ];
			} else {
				for ( let i in this.materials ) {
					material = this.materials[ i ];
					break;
				}
			}

			let funcName = "create" + firstUpperCase( child.type );
			if ( this[ funcName ] ) {
				this[ funcName ]( child, material, group );
			} else {
				this.createCube( child, material, group );
			}
		}
		return group;
	}

	createTurntablex( item, useless, container ) {
		let turntable = new TurntableX( item, this, this.gameLevel.app );
		container.add( turntable );
		return turntable;
	}
	
	createTurntabley( item, useless, container ) {
		let turntable = new TurntableY( item, this, this.gameLevel.app );
		container.add( turntable );
		return turntable;
	}

	create( blocks ) {
		let defaultMaterial;
		for ( let i in this.materials ) {
			defaultMaterial = this.materials[ i ];
			break;
		}
		for ( let child of blocks ) {
			let material;
			if ( child.materialId ) {
				material = this.materials[ child.materialId ];
			} else {
				material = defaultMaterial;
			}

			let obj;

			let funcName = "create" + firstUpperCase( child.type );

			if ( this[ funcName ] ) {
				obj = this[ funcName ]( child, material, this.gameLevel.scene );
			} else {
				obj = this.createCube( child, material, this.gameLevel.scene );
			}

			if ( child.cannotClick ) {
				obj.isPenetrated = child.cannotClick;
			}
			if ( child.id ) {
				this.gameLevel.childrenWithId[ child.id ] = obj;
			}
		}
	}

	addUserObjectCreator( id, func ) {
		let funcName = "create" + firstUpperCase( id );
		if ( this[ funcName ] ) {
			console.error( `Name conflict: The factory already has "${id}" creator.` );
		} else {
			this[ funcName ] = func;
		}
	}
}

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

class GameLevel extends NOVA.World {
	constructor( app, clearColor, data, settings ) {
		let halfWidth = app.getWorldWidth() / 2;
		let halfHeight = app.getWorldHeight() / 2;
		super( app, new THREE.OrthographicCamera( -halfWidth, halfWidth, halfHeight, -
			halfHeight, 1, 100000 ), clearColor );
		this.app.renderer.setClearColor( new THREE.Color( clearColor ) );
		this.data = data;
		this.settings = settings;
		this.childrenWithId = {};
		this.loadResource();

		this.geometryResource = new GeometryResource( this.settings.blockSize, true );
		this.meshFactory = new MeshFactory( this );
	}

	setCharactor( charactor ) {
		let size = this.settings.blockSize;
		this.charactor = charactor;
		let sp = this.data.path[ this.data.startPoint ];
		this.charactor.position.set( sp.x * size, ( sp.y - 0.5 ) * size, sp.z *
			size );
		this.charactor.isWalking = false;
		this.charactor.walkingPath = [];
		this.charactor.currentPath = this.data.startPoint;
	}

	loadResource() {
		this.loaderFactory = new NOVA.LoaderFactory();
		for ( let item of this.data.textures ) {
			this.loaderFactory.loadTexture( item, item );
		}
		this.loaderFactory.onLoad = () => {
			this.init();
		};
	}

	init() {
		this.initMaterials( this.data.materials );
		this.initBlocks( this.data.blocks );
		this.graphPath = new GraphPath( this.data.path );
		this.initLights( this.data.lights );
		this.initCamera( this.data.camera );
		this.initLevelBoard( this.data.levelBoard );

		for ( let key in this.data.path ) {
			this.createPathToScene( this.data.path[ key ] );
		}

		if ( this.data.onGameStart ) {
			this.data.onGameStart();
		}

	}

	initMaterials( materials ) {
		for ( let i in materials ) {
			let item = materials[ i ];
			let materialDetail = {
				color: item.color,
				transparent: true,
				opacity: materials[ i ].opacity === undefined ? 1 : materials[ i ].opacity,
				map: item.mapId ? this.loaderFactory.Resource.textures[ item.mapId ] : undefined,
				depthWrite: true,
				depthTest: true
			};

			if ( item.type == "L" ) {
				materials[ i ] = new THREE.MeshLambertMaterial( materialDetail );
			} else if ( item.type == "B" ) {
				materials[ i ] = new THREE.MeshBasicMaterial( materialDetail );
			}
		}
	}

	initCamera( c ) {
		let size = this.settings.blockSize;
		if ( this.data.currentPath === 0 ) {
			this.camera.position.set( ( c.lookAt.x + c.distance ) * size, ( c.lookAt
				.y + c.distance ) * size, ( c.lookAt.z + c.distance ) * size );
		}
		this.camera.lookAt( new THREE.Vector3( c.lookAt.x * size, c.lookAt.y *
			size, c.lookAt.z * size ) );
	}

	initLights( lights ) {
		let light;
		for ( let item of lights ) {
			if ( item.type === "A" ) {
				light = new THREE.AmbientLight( item.color );
				this.scene.add( light );
			} else if ( item.type === "D" ) {
				light = new THREE.DirectionalLight( item.color, item.intensity );
				this.scene.add( light );
				light.position.set( item.position.x, item.position.y, item.position.z );
			}
		}
	}

	initBlocks( blocks ) {
		this.meshFactory.create( blocks );
	}

	initLevelBoard( levelBoard ) {
		if ( !levelBoard ) {
			return;
		}
		let w = this.app.getWorldWidth();
		let h = this.app.getWorldHeight();
		let canvas = document.createElement( "canvas" );
		canvas.width = w;
		canvas.height = h;
		let ctx = canvas.getContext( "2d" );
		ctx.fillStyle = levelBoard.backgroundColor;
		ctx.fillRect( 0, 0, w, h );
		ctx.textAlign = "center";
		for ( let item of levelBoard.info ) {
			if ( item.type == "text" ) {
				ctx.font = item.weight + " " + item.size * h + "px " + item.family;
				ctx.fillStyle = item.color;
				let width = ctx.measureText( item.text )
					.width;
				ctx.fillText( item.text, w / 2, h * item.y );
			} else if ( item.type == "pic" ) {
				let imgWidth = this.loaderFactory.Resource.textures[ item.src ].image.naturalWidth;
				let imgHeight = this.loaderFactory.Resource.textures[ item.src ].image.naturalHeight;
				let newHeight = item.height * h;
				let newWidth = newHeight / imgHeight * imgWidth;
				ctx.drawImage( this.loaderFactory.Resource.textures[ item.src ].image, (
					w -
					newWidth ) / 2, h * item.y - newHeight / 2, newWidth, newHeight );

			}
		}

		let texture = new THREE.CanvasTexture( canvas );
		let geometry = new THREE.PlaneBufferGeometry( w, h );
		let material = new THREE.MeshBasicMaterial( {
			color: 0xffffff,
			map: texture,
			transparent: true,
		} );
		let plane = new THREE.Mesh( geometry, material );

		plane.position.set( this.camera.position.x - 100, this.camera.position
			.y - 100, this.camera.position.z - 100 );
		plane.lookAt( this.camera.position );
		this.scene.add( plane );
		new TWEEN.Tween( plane.material )
			.to( {
				opacity: 0
			}, levelBoard.duration )
			.delay( levelBoard.life )
			.onComplete( () => {
				this.scene.remove( plane );
			} )
			.start();
	}

	createPathToScene( pathInfo ) {
		let size = this.settings.blockSize;
		if ( pathInfo.parentId ) {
			var contain = this.childrenWithId[ pathInfo.parentId ];
		} else {
			var contain = this.scene;
		}
		var m;
		if ( pathInfo.materialId ) {
			m = this.data.materials[ pathInfo.materialId ];
		} else {
			for ( let i in this.data.materials ) {
				m = this.data.materials[ i ];
				break;
			}
		}
		let obj = new THREE.Mesh( this.geometryResource.groundGeometry, m );
		obj.position.set( pathInfo.x * size || 0, pathInfo.y * size || 0, pathInfo.z *
			size || 0 );
		obj.rotation.set( pathInfo.rx || 0, pathInfo.ry || 0, pathInfo.rz || 0 );
		obj.scale.set( pathInfo.sx || 1, pathInfo.sy || 1, pathInfo.sz || 1 );
		contain.add( obj );
		obj.pathId = pathInfo.id;
		pathInfo.obj = obj;
		if ( pathInfo.face === 0 ) {
			obj.rotation.x = -Math.PI / 2;
			obj.position.y -= size * 0.495;
		} else if ( pathInfo.face == 1 ) {
			obj.rotation.y = Math.PI / 2;
			obj.position.x -= size * 0.495;
		} else if ( pathInfo.face == 2 ) {
			obj.position.z -= size * 0.495;
		} else if ( pathInfo.face == 4 ) {
			obj.rotation.x = Math.PI;
			obj.position.z += size * 0.495;
		} else if ( pathInfo.face == 5 ) {
			obj.rotation.x = Math.PI / 2;
			obj.position.y += size * 0.495;
		}
		if ( pathInfo.rx ) {
			obj.rotation.x += pathInfo.rx;
		}
		if ( pathInfo.ry ) {
			obj.rotation.y += pathInfo.ry;
		}
		if ( pathInfo.rz ) {
			obj.rotation.z += pathInfo.rz;
		}
		if ( pathInfo.sx ) {
			obj.scale.x = pathInfo.rx;
		}
		if ( pathInfo.sy ) {
			obj.scale.y = pathInfo.sy;
		}
		if ( pathInfo.cannotClick ) {
			contain.remove( obj );
		} else {
			obj.events = new NOVA.Events();
			obj.events.click.add( () => {
				this.clickCommonEvent( obj );
			} );
		}
	}

	clickCommonEvent( obj ) {
		console.log( obj.pathId );
		if ( !this.charactor ) {
			return;
		}
		if ( this.charactor.isWalking == false ) {
			let path = this.graphPath.findPath( this.charactor.currentPath, obj.pathId );
			if ( path === false ) {
				this.charactor.walkingPath = [ this.charactor.walkingPath[ 0 ] ];
				return;
			}
			path = path.splice( 1 );
			this.moveCharacter( path );
		} else {
			var path = this.graphPath.findPath( this.charactor.walkingPath[ 0 ], obj.pathId );
			if ( path === false ) {
				this.charactor.walkingPath = [ this.charactor.walkingPath[ 0 ] ];
				return;
			}
			this.charactor.walkingPath = path;
		}
	}

	moveCharacter( arr ) {
		let size = this.settings.blockSize;
		if ( !arr || arr.length == 0 ) {
			this.charactor.isWalking = false;
			this.charactor.play( 'idle' );
			return;
		}
		this.charactor.walkingPath = arr;
		this.charactor.isWalking = true;
		let nextP = this.data.path[ arr[ 0 ] ];
		var vec = new THREE.Vector3( nextP.x * size, nextP.y * size,
			nextP.z * size );
		if ( nextP.parentId && !nextP.local ) {
			this.charactor.isLocal = false;
			this.charactor.parentId = nextP.parentId;
			vec = this.childrenWithId[ nextP.parentId ].localToWorld( vec );
			this.scene.add( this.charactor );
		} else if ( nextP.parentId && nextP.local ) {
			if ( !this.charactor.isLocal ) {
				this.charactor.parentId = nextP.parentId;
				var parent = this.childrenWithId[ nextP.parentId ];
				parent.updateMatrixWorld();
				this.charactor.applyMatrix( new THREE.Matrix4()
					.getInverse( parent.matrixWorld ) );
				parent.add( this.charactor );
				this.charactor.isLocal = true;
			}
		} else {
			if ( this.charactor.isLocal ) {
				this.charactor.isLocal = false;
				this.charactor.position = this.childrenWithId[ this.charactor.parentId ].localToWorld(
					this.charactor.position );
				this.scene.add( this.charactor );
				this.charactor.parentId = null;
			}
		}
		var time = this.settings.moveSpeed;

		var prevP = this.data.path[ this.charactor.currentPath ];
		vec.y -= 0.5 * size;

		if ( prevP.changeSpeed && prevP.changeSpeed[ nextP.id ] ) {
			var str = prevP.changeSpeed[ nextP.id ];
			if ( typeof str === "number" ) {
				time = str;
			} else if ( str === "auto" ) {
				time = time / size * this.charactor.position.distanceTo( vec );
			} else {
				time = 0;
			}
		}

		var canMove = false;
		for ( var item of prevP.neighbors ) {
			if ( item == nextP.id ) {
				canMove = true;
			}
		}
		if ( prevP.onLeaving ) {
			prevP.onLeaving();
		}
		if ( !canMove ) {
			this.charactor.isWalking = false;
			this.charactor.play( 'idle' );
			return;
		}
		if ( nextP.onComing ) {
			nextP.onComing();
		}

		this.charactor.play( this.charactor.actionState || "walk" );
		this.calculateFaceAngle( this.charactor, vec );
		if ( time ) {
			new TWEEN.Tween( this.charactor.position )
				.to( vec, time )
				.start()
				.onComplete( () => {
					if ( nextP.hasCome ) {
						nextP.hasCome();
					}
					if ( prevP.hasLeft ) {
						prevP.hasLeft();
					}
					this.charactor.currentPath = this.charactor.walkingPath[ 0 ];
					arr = this.charactor.walkingPath.splice( 1 );
					this.charactor.walkingPath = [];
					this.moveCharacter( arr );
				} );
		} else {
			this.charactor.position.set( vec.x, vec.y, vec.z );
			if ( nextP.hasCome ) {
				nextP.hasCome();
			}
			if ( prevP.hasLeft ) {
				prevP.hasLeft();
			}
			this.charactor.currentPath = this.charactor.walkingPath[ 0 ];
			arr = this.charactor.walkingPath.splice( 1 );
			this.charactor.walkingPath = [];
			this.moveCharacter( arr );
		}

	}

	calculateFaceAngle( charactor, nextPoint ) {
		let vec = charactor.position.clone();
		let delta = nextPoint.y - vec.y;
		vec.x += delta;
		vec.z += delta;
		let EPSILON = 0.01;
		let dx = nextPoint.x - vec.x;
		let dz = nextPoint.z - vec.z;
		charactor.actionState = "walk";
		if ( dx > EPSILON && Math.abs( dz ) <= EPSILON ) {
			charactor.rotation.y = 0;
		} else if ( dx < -EPSILON && Math.abs( dz ) <= EPSILON ) {
			charactor.rotation.y = Math.PI;
		} else if ( dz < -EPSILON && Math.abs( dx ) <= EPSILON ) {
			charactor.rotation.y = Math.PI / 2;
		} else if ( dz > EPSILON && Math.abs( dx ) <= EPSILON ) {
			charactor.rotation.y = Math.PI * 1.5;
		} else if ( Math.abs( dx ) <= EPSILON && Math.abs( dz ) <= EPSILON ) {
			charactor.play( "ladder" );
			charactor.actionState = "ladder";
		} else {

			console.log( dz, dx );
			if ( Math.abs( dz ) - Math.abs( dx ) > EPSILON ) {
				if ( dz > 0 ) {
					charactor.rotation.y = Math.PI * 1.5;
				} else {
					charactor.rotation.y = Math.PI * 0.5;
				}
			} else if ( Math.abs( dz ) - Math.abs( dx ) < -EPSILON ) {
				if ( dx > 0 ) {
					charactor.rotation.y = 0;
				} else {
					charactor.rotation.y = Math.PI;
				}
			} else {
				charactor.play( "ladder" );
				charactor.actionState = "ladder";
			}
		}
	}
}

class Charactor extends THREE.Group {
	constructor( world, options ) {
		super();
		this.world = world;
		this.world.scene.add( this );
		this.rotationY = options.rotationY;
		this.currentAnimation = undefined;
		this.actions = {};
		this.model = options.model;
		this.add( this.model );
		this.model.scale.set( options.scale.x, options.scale.y, options.scale.z );
	}

	play( name ) {
		if ( this.currentAnimation ) {
			this.actions[ this.currentAnimation ].stop();
		}
		this.actions[ name ].start();
		this.currentAnimation = name;
	}

	stop() {
		if ( this.currentAnimation ) {
			this.actions[ this.currentAnimation ].stop();
		}
	}
}

/* eslint-disable */

export { DEFAULT_SETTINGS, GameLevel, GraphPath, Charactor, GeometryResource, MeshFactory, TurntableX };
//# sourceMappingURL=hypeometry.module.js.map
