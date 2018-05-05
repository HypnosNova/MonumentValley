var map = {
	levelBoard: {
		life: 2500,
		duration: 1000,
		backgroundColor: "rgba(0,0,0,0.4)",
		info: [ {
			type: "pic",
			src: "img/common/border.png",
			height: 0.1,
			y: 0.15
		}, {
			type: "text",
			text: "第一章",
			family: "微软雅黑",
			size: 0.035,
			y: 0.27,
			color: "#ffffff",
			weight: "bold"
		}, {
			type: "text",
			text: "阶梯",
			family: "微软雅黑",
			size: 0.07,
			y: 0.37,
			color: "#ffffff",
			weight: "bold"
		}, {
			type: "text",
			text: "─────",
			family: "微软雅黑",
			size: 0.02,
			y: 0.45,
			color: "#ffffff",
			weight: "normal"
		}, {
			type: "text",
			text: "在此",
			family: "微软雅黑",
			size: 0.03,
			y: 0.5,
			color: "#ffffff",
			weight: "bold"
		}, {
			type: "text",
			text: "我要向",
			family: "微软雅黑",
			size: 0.04,
			y: 0.625,
			color: "#ffffff",
			weight: "normal"
		}, {
			type: "text",
			text: "纪念碑谷致敬",
			family: "微软雅黑",
			size: 0.04,
			y: 0.7,
			color: "#ffffff",
			weight: "normal"
		}, {
			type: "pic",
			src: "img/common/border.png",
			height: 0.1,
			y: 0.85
		} ]
	},
	endBoard: {
		duration: 1000,
		backgroundColor: "rgba(0,0,0,0.4)",
		info: [ {
			type: "pic",
			src: "img/common/border.png",
			height: 0.1,
			y: 0.15
		}, {
			type: "text",
			text: "完成",
			family: "微软雅黑",
			size: 0.06,
			y: 0.5,
			color: "#ffffff",
			weight: "bold"
		}, {
			type: "pic",
			src: "img/common/border.png",
			height: 0.1,
			y: 0.85
		} ]
	},
	blocks: [ {
		type: "cube",
		x: 0,
		y: 0,
		z: 0,
		rx: 0,
		ry: 0,
		rz: 0,
		materialId: "m0"
	}, {
		x: 1
	}, {
		x: 2
	}, {
		x: 3
	}, {
		x: 4
	}, {
		x: 5
	}, {
		x: 6
	}, {
		x: 6,
		y: 1
	}, {
		x: 6,
		y: 2
	}, {
		x: 6,
		y: 3
	}, {
		x: 6,
		y: 4
	}, {
		x: 6,
		y: 8,
		z: 4
	}, {
		x: 6,
		y: 8,
		z: 5
	}, {
		x: 6,
		y: 8,
		z: 6
	}, {
		x: 6,
		y: 8,
		z: 7
	}, {
		x: 6,
		y: 8,
		z: 8
	}, {
		type: "tri",
		x: 7,
		y: 8,
		z: 8
	}, {
		type: "tri",
		x: -1,
		rz: Math.PI
	}, {
		x: 2,
		y: 8,
		z: 0
	}, {
		x: 1,
		y: 8,
		z: 0
	}, {
		type: "tri",
		x: 0,
		y: 8,
		z: 0,
		rz: Math.PI
	}, {
		type: "stick",
		x: 6,
		y: 12,
		z: 8,
		d: 0,
		height: 7
	}, {
		type: "stick",
		x: 6,
		y: 12,
		z: 8,
		d: 1,
		height: 7
	}, {
		type: "stick",
		x: 6,
		y: 12,
		z: 8,
		d: 2,
		height: 7
	}, {
		type: "stick",
		x: 6,
		y: 12,
		z: 8,
		d: 3,
		height: 7
	}, {
		x: 6,
		y: 16,
		z: 8
	}, {
		x: 7,
		y: 16,
		z: 8
	}, {
		type: "tri",
		x: 8,
		y: 16,
		z: 8
	}, {
		type: "stair",
		x: 6,
		y: 16,
		z: 7,
		height: 4
	}, {
		type: "plane",
		x: 6,
		y: 20,
		z: 3,
		height: 4
	}, {
		type: "plane",
		sx: 1.3333,
		sz: 1.3333,
		x: 6,
		y: 20,
		z: 2,
		height: 4
	}, {
		type: "key",
		sx: 4.5,
		sy: 4.5,
		sz: 4.5,
		x: 6,
		y: 20.5,
		z: 2,
		height: 4,
		id: "key"
	}, {
		type: "turntablex",
		id: "turn",
		x: 8,
		y: 8,
		z: 0,
		funcMove: function( e, angle, world ) {
			world.graphPath.removeEdges( [
				[ "p13", "p12" ],
				[ "p20", "p19" ],
				[ "p34", "p20" ],
				[ "p37", "p20" ],
				[ "p44", "p20" ]
			] );
			world.childrenWithId[ "bridge" ].rotation.x = angle;
		},
		funcEnd: function( e, angle, world ) {
			var tmp = angle;
			while ( tmp < 0 ) {
				tmp += 2 * Math.PI;
			}
			world.childrenWithId[ "bridge" ].rotation.x = tmp;
			if ( world.childrenWithId[ "bridge" ].rotation.x > Math.PI / 4 * 7 ) {
				world.childrenWithId[ "bridge" ].rotation.x -= 2 * Math.PI;
			}
			tmp -= Math.PI / 4;
			var quaro = 0;
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
			var time = Math.abs( world.childrenWithId[ "bridge" ].rotation.x - tmp ) *
				400;
			new TWEEN.Tween( world.childrenWithId[ "bridge" ].rotation )
				.to( {
					x: tmp
				}, time )
				.easing( TWEEN.Easing.Back.Out )
				.start()
				.onComplete( function() {
					if ( world.childrenWithId[ "bridge" ].rotation.x == Math.PI * 1.5 ) {
						world.graphPath.addEdge( "p13", "p12" );
						world.graphPath.addEdge( "p20", "p19" );
					} else if ( world.childrenWithId[ "bridge" ].rotation.x == 0 ) {
						world.graphPath.addEdge( "p34", "p20" );
					} else if ( world.childrenWithId[ "bridge" ].rotation.x == Math.PI ) {
						world.graphPath.addEdge( "p37", "p20" );
					} else if ( world.childrenWithId[ "bridge" ].rotation.x == Math.PI *
						0.5 ) {
						world.graphPath.addEdge( "p44", "p20" );
					}
				} );
		},
		rodMaterial: "m222",
		axisMaterial: "m222",
		hoopMaterial: "m22",
		poleMaterial: "m2"
	}, {
		type: "group",
		id: "bridge",
		x: 3,
		y: 8,
		z: 0,
		children: [ {
			materialId: "m1"
		}, {
			x: 1,
			materialId: "m1"
		}, {
			x: 2,
			materialId: "m1"
		}, {
			x: 3,
			materialId: "m1"
		}, {
			x: 3,
			y: -1,
			materialId: "m1"
		}, {
			x: 3,
			y: -2,
			materialId: "m1"
		}, {
			x: 3,
			y: -3,
			materialId: "m1"
		} ]
	} ],
	materials: {
		m0: {
			type: "L",
			color: 0xffffff,
			mapId: "img/path/brick.png"
		},
		m1: {
			type: "L",
			color: 0xdddddd,
			mapId: "img/path/brick2.png"
		},
		m2: {
			type: "L",
			color: 0xeea040
		},
		m22: {
			type: "L",
			color: 0xdd8020
		},
		m222: {
			type: "L",
			color: 0xdd5000
		},
		m3: {
			type: "L",
			color: 0xffffff,
			mapId: "img/level1ground.png"
		},
		m4: {
			type: "B",
			color: 0xffffff,
			opacity: 0,
			mapId: "img/null.png"
		},
		m5: {
			type: "L",
			color: 0x818b89,
			mapId: "img/endPoint.png"
		}
	},
	textures: [ "img/path/brick.png", "img/path/brick2.png",
		"img/common/border.png", "img/level1ground.png", "img/null.png",
		"img/endPoint.png"
	],
	lights: [ {
			key: "areaLight",
			color: 0x666666,
			type: "A"
		},
		{
			key: "directionLight",
			color: 0xdddddd,
			type: "D",
			intensity: 1,
			position: {
				x: 0,
				y: 400,
				z: 0
			}
		},
		{
			key: "directionLight2",
			color: 0x999999,
			type: "D",
			intensity: 1,
			position: {
				x: 0,
				y: 0,
				z: 1
			}
		},
		{
			key: "directionLight3",
			color: 0x666666,
			type: "D",
			intensity: 1,
			position: {
				x: 1,
				y: 0,
				z: 0
			}
		}
	],
	camera: {
		distance: 50,
		lookAt: {
			x: 1,
			y: 6,
			z: -2
		}
	},
	currentPath: 0,
	path: {
		"p1": {
			id: "p1",
			x: 2,
			y: 1,
			z: 0,
			face: 0,
			neighbors: [ "p2", "p5" ],
			materialId: "m4"
		},
		"p2": {
			id: "p2",
			x: 3,
			y: 1,
			z: 0,
			face: 0,
			neighbors: [ "p1", "p3" ],
			materialId: "m4"
		},
		"p3": {
			id: "p3",
			x: 4,
			y: 1,
			z: 0,
			face: 0,
			neighbors: [ "p2", "p4" ],
			materialId: "m4"
		},
		"p4": {
			id: "p4",
			x: 5,
			y: 1,
			z: 0,
			face: 0,
			neighbors: [ "p3" ],
			materialId: "m4"
		},
		"p5": {
			id: "p5",
			x: 9,
			y: 9,
			z: 8,
			face: 0,
			neighbors: [ "p1", "p6" ],
			materialId: "m4"
		},
		"p6": {
			id: "p6",
			x: 8,
			y: 9,
			z: 8,
			face: 0,
			neighbors: [ "p5", "p7" ],
			materialId: "m4"
		},
		"p7": {
			id: "p7",
			x: 7,
			y: 9,
			z: 8,
			face: 0,
			neighbors: [ "p6", "p8" ],
			materialId: "m4"
		},
		"p8": {
			id: "p8",
			x: 6,
			y: 9,
			z: 8,
			face: 0,
			neighbors: [ "p7", "p9" ],
			materialId: "m4"
		},
		"p9": {
			id: "p9",
			x: 6,
			y: 9,
			z: 7,
			face: 0,
			neighbors: [ "p8", "p10" ],
			materialId: "m4"
		},
		"p10": {
			id: "p10",
			x: 6,
			y: 9,
			z: 6,
			face: 0,
			neighbors: [ "p9", "p11" ],
			materialId: "m4"
		},
		"p11": {
			id: "p11",
			x: 6,
			y: 9,
			z: 5,
			face: 0,
			neighbors: [ "p10", "p12" ],
			materialId: "m4"
		},
		"p12": {
			id: "p12",
			x: 6,
			y: 9,
			z: 4,
			face: 0,
			neighbors: [ "p11" ],
			materialId: "m4",
			onComing: function() {
				app.world.childrenWithId.turn.becomeAble();
			}
		},
		"p13": {
			id: "p13",
			x: 3,
			y: -3,
			z: 1,
			face: 2,
			neighbors: [ "p14" ],
			parentId: "bridge",
			materialId: "m4",
			onComing: function() {
				app.world.childrenWithId.turn.becomeDisable();
			}
		},
		"p14": {
			id: "p14",
			x: 3,
			y: -2,
			z: 1,
			face: 2,
			neighbors: [ "p13", "p15" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p15": {
			id: "p15",
			x: 3,
			y: -1,
			z: 1,
			face: 2,
			neighbors: [ "p14", "p16" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p16": {
			id: "p16",
			x: 3,
			y: 0,
			z: 1,
			face: 2,
			neighbors: [ "p15", "p17" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p17": {
			id: "p17",
			x: 2,
			y: 0,
			z: 1,
			face: 2,
			neighbors: [ "p16", "p18" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p18": {
			id: "p18",
			x: 1,
			y: 0,
			z: 1,
			face: 2,
			neighbors: [ "p17", "p19" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p19": {
			id: "p19",
			x: 0,
			y: 0,
			z: 1,
			face: 2,
			neighbors: [ "p18" ],
			parentId: "bridge",
			materialId: "m4",
			onComing: function() {
				app.world.childrenWithId.turn.becomeDisable();
			}
		},
		"p20": {
			id: "p20",
			x: 2,
			y: 9,
			z: 0,
			face: 0,
			neighbors: [ "p21" ],
			materialId: "m4",
			onComing: function() {
				app.world.childrenWithId.turn.becomeAble();
			}
		},
		"p21": {
			id: "p21",
			x: 9,
			y: 17,
			z: 8,
			face: 0,
			neighbors: [ "p20", "p22" ],
			materialId: "m4"
		},
		"p22": {
			id: "p22",
			x: 8,
			y: 17,
			z: 8,
			face: 0,
			neighbors: [ "p21", "p23" ],
			materialId: "m4"
		},
		"p23": {
			id: "p23",
			x: 7,
			y: 17,
			z: 8,
			face: 0,
			neighbors: [ "p22", "p24" ],
			materialId: "m4"
		},
		"p24": {
			id: "p24",
			x: 6,
			y: 17,
			z: 8,
			face: 0,
			neighbors: [ "p23", "tm1" ],
			changeSpeed: {
				"tm1": "auto"
			},
			materialId: "m4"
		},
		"tm1": {
			id: "tm1",
			x: 6,
			y: 17,
			z: 7.5,
			face: 0,
			sx: 0.1,
			sy: 0.1,
			neighbors: [ "p24", "p25" ],
			cannotClick: true,
			changeSpeed: {
				"p24": "auto",
				"p25": "auto"
			},
			materialId: "m4"
		},
		"p25": {
			id: "p25",
			x: 6,
			y: 17.58,
			z: 7.12,
			rx: Math.PI / 4,
			sy: 1.414,
			face: 0,
			neighbors: [ "tm1", 'p26' ],
			changeSpeed: {
				"tm1": "auto",
				"p26": "auto"
			},
			materialId: "m4"
		},
		"p26": {
			id: "p26",
			x: 6,
			y: 18.58,
			z: 6.12,
			rx: Math.PI / 4,
			sy: 1.414,
			face: 0,
			neighbors: [ "p25", "p27" ],
			changeSpeed: {
				"p25": "auto",
				"p27": "auto",
			},
			materialId: "m4"
		},
		"p27": {
			id: "p27",
			x: 6,
			y: 19.58,
			z: 5.12,
			rx: Math.PI / 4,
			sy: 1.414,
			face: 0,
			neighbors: [ "p26", "p28" ],
			changeSpeed: {
				"p26": "auto",
				"p28": "auto",
			},
			materialId: "m4"
		},
		"p28": {
			id: "p28",
			x: 6,
			y: 20.58,
			z: 4.12,
			rx: Math.PI / 4,
			sy: 1.414,
			face: 0,
			neighbors: [ "p27", "tm2" ],
			changeSpeed: {
				"tm2": "auto"
			},
			materialId: "m4"
		},
		"tm2": {
			id: "tm2",
			x: 6,
			y: 21,
			z: 3.5,
			face: 0,
			sx: 0.1,
			sy: 0.1,
			neighbors: [ "p28", "p29" ],
			cannotClick: true,
			changeSpeed: {
				"p28": "auto",
				"p29": "auto"
			},
			materialId: "m4"
		},
		"p29": {
			id: "p29",
			x: 6,
			y: 21,
			z: 3,
			face: 0,
			neighbors: [ "tm2", "p30" ],
			changeSpeed: {
				"tm2": "auto"
			},
			materialId: "m4"
		},
		"p30": {
			id: "p30",
			x: 6,
			y: 21,
			z: 2,
			face: 0,
			neighbors: [ "p29" ],
			materialId: "m4",
			hasCome: function() {
				setTimeout( () => {
					app.world.scene.remove( app.world.childrenWithId.key );
					app.world.charactor.play( 'win' );
					app.world.winSound.play();
				} );
			}
		},
		"p31": {
			id: "p31",
			x: 3,
			y: 1,
			z: 0,
			face: 0,
			neighbors: [ "p32" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p32": {
			id: "p32",
			x: 2,
			y: 1,
			z: 0,
			face: 0,
			neighbors: [ "p31", "p33" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p33": {
			id: "p33",
			x: 1,
			y: 1,
			z: 0,
			face: 0,
			neighbors: [ "p32", "p34" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p34": {
			id: "p34",
			x: 0,
			y: 1,
			z: 0,
			face: 0,
			neighbors: [ "p33" ],
			parentId: "bridge",
			materialId: "m4",
			onComing: function() {
				app.world.childrenWithId.turn.becomeDisable();
			}
		},
		"p35": {
			id: "p35",
			x: 2,
			y: -1,
			z: 0,
			face: 5,
			neighbors: [ "p36" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p36": {
			id: "p36",
			x: 1,
			y: -1,
			z: 0,
			face: 5,
			neighbors: [ "p37", "p35" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p37": {
			id: "p37",
			x: 0,
			y: -1,
			z: 0,
			face: 5,
			neighbors: [ "p36" ],
			parentId: "bridge",
			materialId: "m4",
			onComing: function() {
				app.world.childrenWithId.turn.becomeDisable();
			}
		},
		"p38": {
			id: "p38",
			x: 3,
			y: -3,
			z: -1,
			face: 4,
			neighbors: [ "p39" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p39": {
			id: "p39",
			x: 3,
			y: -2,
			z: -1,
			face: 4,
			neighbors: [ "p38", "p40" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p40": {
			id: "p40",
			x: 3,
			y: -1,
			z: -1,
			face: 4,
			neighbors: [ "p39", "p41" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p41": {
			id: "p41",
			x: 3,
			y: 0,
			z: -1,
			face: 4,
			neighbors: [ "p42", "p40" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p42": {
			id: "p42",
			x: 2,
			y: 0,
			z: -1,
			face: 4,
			neighbors: [ "p43", "p41" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p43": {
			id: "p43",
			x: 1,
			y: 0,
			z: -1,
			face: 4,
			neighbors: [ "p42", "p44" ],
			parentId: "bridge",
			materialId: "m4"
		},
		"p44": {
			id: "p44",
			x: 0,
			y: 0,
			z: -1,
			face: 4,
			neighbors: [ "p43" ],
			parentId: "bridge",
			materialId: "m4",
			onComing: function() {
				app.world.childrenWithId.turn.becomeDisable();
			}
		}
	},
	startPoint: "p3"
};