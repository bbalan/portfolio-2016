$(document).ready(function () {
	
	$('#your-div-here').kia360({
		nameplateTitle:'2012 Rondo',																							// name of the car
		frameWidth: 574,																													// width of the 360 sprite
		frameHeight: 280, 																												// height of an individual frame in the sprite (divide height by number of frames)
		numFrames: 24, 																														// number of frames in the animation
		mirrorMouseX: false, 																											// UNUSED AS OF ALPHA 0.6.2
		autoSpin: true, 																													// perform one spin immediately after the first color is loaded
		firstFrame: 'kia360vr/images/2012-rondo/Rondo - Sterling - first frame.jpg',				// url of loading placeholder graphic
		alwaysOnGroups: [1],
		colors: [																																	// list of colors. color swatch buttons are output in the same order.
			{
				name: 'Sterling',																											// name of the color
				thumbnail: 'kia360vr/images/2012-rondo/Rondo - Sterling - thumb.gif',					// color swatch thumbnail
				image: 'kia360vr/images/2012-rondo/Rondo - Sterling - stack.jpg'								// 360 animation sprite
			},
			{
				name: 'Molten',
				thumbnail: 'kia360vr/images/2012-rondo/Rondo - Molten - thumb.gif',
				image: 'kia360vr/images/2012-rondo/Rondo - Molten - stack.jpg'
			},
			{
				name: 'Denim',
				thumbnail: 'kia360vr/images/2012-rondo/Rondo - Denim - thumb.gif',
				image: 'kia360vr/images/2012-rondo/Rondo - Denim - stack.jpg'
			}
		], 
		
		accessories: [																														// list of accessories. accessory buttons are created in the same order.
			{
				name: 'Hood Deflector',																								// name of the accessory
				group: 0,																															// for each group, only one accessory is allowed to be visible at any time
				image: 'kia360vr/images/2012-rondo/Rondo - hood deflector - stack.png',				// url of the 360 sprite
				width: 481,																														// width of the sprite
				height: 71,																														// height of an individual frame
				xOffset: 46,																													// offset from the top of the container div
				yOffset: 84,																													// offset from the laft of the container div
				visibleStart: 19,																											// the frame where this accessory first becomes visible
				visibleEnd: 1																													// the frame where the accessory becomes obscured by the car
			},
			{
				name: 'Bumper Guard',
				requires: 'Trailer Hitch',
				onByDefault: true,
				hidden: false,
				group: 1,
				image: 'kia360vr/images/2012-rondo/Rondo - bumper guard - stack.png',
				width: 494,
				height: 49,
				xOffset: 40,
				yOffset: 135,
				visibleStart: 7,
				visibleEnd: 13
			},
			{
				name: '(FEATURE TEST) Hot Pink Bumper Guard',
				group: 1,
				image: 'kia360vr/images/2012-rondo/Rondo - bumper guard - pink.png',
				width: 494,
				height: 49,
				xOffset: 40,
				yOffset: 135,
				visibleStart: 7,
				visibleEnd: 13
			},
			{
				name: '(FEATURE TEST) Body Color Bumper Guard',
				group: 1,
				image: {
					'Sterling': 'kia360vr/images/2012-rondo/Rondo - bumper guard - sterling.png',
					'Molten': 'kia360vr/images/2012-rondo/Rondo - bumper guard - molten.png',
					'Denim': 'kia360vr/images/2012-rondo/Rondo - bumper guard - denim.png'
				},
				width: 494,
				height: 49,
				xOffset: 40,
				yOffset: 135,
				visibleStart: 7,
				visibleEnd: 13
			}
		],
		
		interiors: [																															// list of interiors, links output in order
			{
				name: 'Black Cloth Leatherette',
				thumbnail: 'kia360vr/images/2012-rondo/Rondo - Black Cloth Leatherette - thumb.gif'
			},
			{
				name: 'Black Leather',																												// name of the interior
				thumbnail: 'kia360vr/images/2012-rondo/Rondo - Black Leather - thumb.gif'			// swatch of the interior
			}
		]
	});
	
});