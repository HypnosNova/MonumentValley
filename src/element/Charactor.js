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

export {
	Charactor
};