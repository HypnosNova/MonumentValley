import { TurntableX, TurntableY } from './Turntable';

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

export {
	MeshFactory
};