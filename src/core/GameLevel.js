import { GeometryResource } from './../element/GeometryResource';
import { MeshFactory } from './../element/MeshFactory';

import { GraphPath } from './GraphPath';

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
		console.log( obj.pathId )
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

			console.log( dz, dx )
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

export {
	GameLevel
};