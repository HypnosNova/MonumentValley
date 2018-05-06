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

export {
	TurntableX,
	TurntableY
};