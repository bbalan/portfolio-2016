$(document).on('transition-complete', function () {
		
	$('#kia-360-portfolio-container').kia360({
		nameplateTitle:'2012 Soul',
		frameWidth: 497,
		frameHeight: 240,
		numFrames: 24,
		flipMouse: true,
		autoSpin: true,
		imageFolder: '/kia-accessory-360/kia360vr/images/2012-soul',
		firstFrame: 'Soul - denim - first frame.jpg',
		alwaysOnGroups: [],
		defaultColor: 0,
		colors: [
			{
				name: 'Denim (Metallic)',
				thumbnail: 'denim.gif',
				image: 'Soul - denim.jpg',
				excludeInteriors: [0,3,4]
			},
			{
				name: 'Saddle Brown (Pearl)',
				thumbnail: 'saddle brown.gif',
				image: 'Soul - saddle brown.jpg',
				excludeInteriors: [0,2,3]
			},
			{
				name: 'Mint (Pearl)',
				thumbnail: 'mint.gif',
				image: 'Soul - mint.jpg',
				excludeInteriors: [0,2,3,4]
			},
			{
				name: 'Molten',
				thumbnail: 'molten.gif',
				image: 'Soul - molten.jpg',
				excludeInteriors: [2]
			},
			{
				name: 'Onyx (Pearl)',
				thumbnail: 'onyx.gif',
				image: 'Soul - onyx.jpg',
				excludeInteriors: []
			},
			{
				name: 'Polar',
				thumbnail: 'polar.gif',
				image: 'Soul - polar.jpg',
				excludeInteriors: [2]
			},
			{
				name: 'Sterling (Metallic)',
				thumbnail: 'sterling.gif',
				image: 'Soul - sterling.jpg',
				excludeInteriors: [3]
			},
			{
				name: 'Titanium (Pearl)',
				thumbnail: 'titanium.gif',
				image: 'Soul - titanium.jpg',
				excludeInteriors: [0,2,4]
			},
			{
				name: 'Vanilla Shake',
				thumbnail: 'vanilla shake.gif',
				image: 'Soul - vanilla shake.jpg',
				excludeInteriors: [0,3,4]
			},
			{
				name: 'Misty Green',
				thumbnail: 'misty green.gif',
				image: 'Soul - misty green.jpg',
				excludeInteriors: [0,3]
			},
			{
				name: 'Olive Green (Metallic)',
				thumbnail: 'olive green.gif',
				image: 'Soul - olive green.jpg',
				excludeInteriors: [0,2,3]
			}
		], 
		
		accessories: [
		/*
			{
				name: 'Sport Visors',
				onByDefault: false,
				requires: null,
				group: null,
				image: 'Soul - sport visors.png',
				width: 316,
				height: 55,
				xOffset: 82,
				yOffset: 26,
				zIndex: null,
				visibleRange: [0,6,7,8,9,10,11,18,19,20,21,22,23]
			},
			{
				name: 'Chrome Side Repeater',
				onByDefault: false,
				requires: null,
				group: null,
				image: 'Soul - chrome repeater.png',
				width: 316,
				height: 31,
				xOffset: 102,
				yOffset: 89,
				zIndex: null,
				visibleRange: [0,6,7,8,9,10,11,18,19,20,21,22,23]
			},
			{
				name: 'Chrome Fuel Cap',
				onByDefault: false,
				requires: null,
				group: null,
				image: 'Soul - chrome fuel cap.png',
				width: 274,
				height: 39,
				xOffset: 170,
				yOffset: 72,
				zIndex: null,
				visibleRange: [17,18,19,20,21,22]
			},
			{
				name: 'Rear Garnish',
				onByDefault: false,
				requires: null,
				group: null,
				image: 'Soul - rear garnish.png',
				width: 488,
				height: 30,
				xOffset: 8,
				yOffset: 130,
				zIndex: null,
				visibleRange: [12,13,14,15,16,17,18]
			},
			*/
			{
				name: 'Bike Rack',
				onByDefault: false,
				requires: 'Accessory Hitch',
				group: 4,
				image: 'Soul - bike 2.png',
				width: 570,
				height: 136,
				xOffset: -36,
				yOffset: 82,
				zIndex: 101,
				visibleRange: [12,13,14,15,16,17,18]
			},
			/*
			{
				name: '4-Bike Rack',
				onByDefault: false,
				requires: 'Accessory Hitch',
				group: 4,
				image: 'Soul - bike 4.png',
				width: 536,
				height: 138,
				xOffset: -20,
				yOffset: 78,
				zIndex: 101,
				visibleRange: [12,13,14,15,16,17,18]
			},
			*/
			{
				name: 'Roof Bag',
				onByDefault: false,
				requires: 'Cross Bars',
				group: 12,
				image: 'Soul - roof bag.png',
				width: 348,
				height: 77,
				xOffset: 76,
				yOffset: -49,
				zIndex: null,
				visibleRange: []
			},
			{
				name: 'Roof Basket',
				onByDefault: false,
				requires: 'Cross Bars',
				group: 12,
				image: 'Soul - roof basket.png',
				width: 354,
				height: 28,
				xOffset: 72,
				yOffset: -9,
				zIndex: null,
				visibleRange: []
			},
			{
				name: 'Ski Rack',
				onByDefault: false,
				requires: 'Cross Bars',
				group: 12,
				image: 'Soul - roof skis.png',
				width: 410,
				height: 55,
				xOffset: 45,
				yOffset: -28,
				zIndex: null,
				visibleRange: []
			},
			{
				name: 'Cargo box - ski',
				onByDefault: false,
				requires: 'Cross Bars',
				group: 12,
				image: 'Soul - thule 1100.png',
				width: 446,
				height: 71,
				xOffset: 26,
				yOffset: -41,
				zIndex: null,
				visibleRange: []
			},
			{
				name: 'Cargo box - snowboard',
				onByDefault: false,
				requires: 'Cross Bars',
				group: 12,
				image: 'Soul - thule 1500.png',
				width: 391,
				height: 75,
				xOffset: 53,
				yOffset: -49,
				zIndex: null,
				visibleRange: []
			},
			{
				name: 'Cargo box - small',
				onByDefault: false,
				requires: 'Cross Bars',
				group: 12,
				image: 'Soul - thule sidekick.png',
				width: 366,
				height: 73,
				xOffset: 66,
				yOffset: -52,
				zIndex: null,
				visibleRange: []
			},
			{
				name: 'Bridge Spoiler',
				onByDefault: false,
				requires: null,
				group: 20,
				image: 'Soul - spoiler bridge.png',
				width: 444,
				height: 18,
				xOffset: 27,
				yOffset: 13,
				zIndex: null,
				visibleRange: [12,13,14,15,16,17,18]
			},
			{
				name: 'Sport Spoiler',
				onByDefault: false,
				bodyColor: true,
				requires: null,
				group: 20,
				image: {
					0: 'Soul - spoiler flat - denim.png',
					1: 'Soul - spoiler flat - saddle brown.png',
					2: 'Soul - spoiler flat - mint.png',
					3: 'Soul - spoiler flat - molten.png',
					4: 'Soul - spoiler flat - onyx.png',
					5: 'Soul - spoiler flat - polar.png',
					6: 'Soul - spoiler flat - sterling.png',
					7: 'Soul - spoiler flat - titanium.png',
					8: 'Soul - spoiler flat - vanilla shake.png',
					9: 'Soul - spoiler flat - misty green.png',
					10: 'Soul - spoiler flat - olive green.png'
				},
				width: 442,
				height: 14,
				xOffset: 28,
				yOffset: 18,
				zIndex: null,
				visibleRange: [12,13,14,15,16,17,18]
			},
			{
				name: '18" alloy wheels (K006)',
				onByDefault: false,
				requires: null,
				group: 0,
				image: {
					0: 'Soul - k006 18 - denim.png',
					1: 'Soul - k006 18 - saddle brown.png',
					2: 'Soul - k006 18 - mint.png',
					3: 'Soul - k006 18 - molten.png',
					4: 'Soul - k006 18 - onyx.png',
					5: 'Soul - k006 18 - polar.png',
					6: 'Soul - k006 18 - sterling.png',
					7: 'Soul - k006 18 - titanium.png',
					8: 'Soul - k006 18 - vanilla shake.png',
					9: 'Soul - k006 18 - misty green.png',
					10: 'Soul - k006 18 - olive green.png'
				},
				width: 456,
				height: 117,
				xOffset: 21,
				yOffset: 119,
				zIndex: null,
				visibleRange: [0,1,5,6,7,8,9,10,11,12,17,18,19,20,21,22,23]
			},
			{
				name: '18" alloy wheels (K007)',
				onByDefault: false,
				requires: null,
				group: 0,
				image: 'Soul - k007 18.png',
				width: 456,
				height: 117,
				xOffset: 21,
				yOffset: 119,
				zIndex: null,
				visibleRange: [0,1,5,6,7,8,9,10,11,12,17,18,19,20,21,22,23]
			},
			{
				name: '17" alloy wheels (K008)',
				onByDefault: false,
				requires: null,
				group: 0,
				image: 'Soul - k008 17.png',
				width: 456,
				height: 117,
				xOffset: 21,
				yOffset: 119,
				zIndex: null,
				visibleRange: [0,1,5,6,7,8,9,10,11,12,17,18,19,20,21,22,23]
			},
			{
				name: '15" alloy wheels (K009)',
				onByDefault: false,
				requires: null,
				group: 0,
				image: 'Soul - k009 15.png',
				width: 456,
				height: 117,
				xOffset: 21,
				yOffset: 119,
				zIndex: null,
				visibleRange: [0,1,5,6,7,8,9,10,11,12,17,18,19,20,21,22,23]
			},
			{
				name: '20" alloy wheels (K010)',
				onByDefault: false,
				requires: null,
				group: 0,
				image: 'Soul - k010 20.png',
				width: 456,
				height: 117,
				xOffset: 21,
				yOffset: 119,
				zIndex: null,
				visibleRange: [0,1,5,6,7,8,9,10,11,12,17,18,19,20,21,22,23]
			},
			{
				name: '18" alloy wheels (K011)',
				onByDefault: false,
				requires: null,
				group: 0,
				image: 'Soul - k011 18.png',
				width: 456,
				height: 117,
				xOffset: 21,
				yOffset: 119,
				zIndex: null,
				visibleRange: [0,1,5,6,7,8,9,10,11,12,17,18,19,20,21,22,23]
			},
			{
				name: '16" alloy wheels (K012)',
				onByDefault: false,
				requires: null,
				group: 0,
				image: 'Soul - k012 16.png',
				width: 456,
				height: 117,
				xOffset: 21,
				yOffset: 119,
				zIndex: null,
				visibleRange: [0,1,5,6,7,8,9,10,11,12,17,18,19,20,21,22,23]
			},
			{
				name: '17" alloy wheels (K012)',
				onByDefault: false,
				requires: null,
				group: 0,
				image: 'Soul - k012 17.png',
				width: 456,
				height: 117,
				xOffset: 21,
				yOffset: 119,
				zIndex: null,
				visibleRange: [0,1,5,6,7,8,9,10,11,12,17,18,19,20,21,22,23]
			}
		],
		
		interiors: [
			{
				name: 'Black Cloth',
				thumbnail: 'black cloth.gif'
			},
			{
				name: 'Soul Cloth',
				thumbnail: 'soul cloth.gif'
			},
			{
				name: 'Beige Tartan Patterned Cloth',
				thumbnail: 'patterned cloth.gif'
			},
			{
				name: 'Burner Red Cloth',
				thumbnail: 'burner cloth.gif'
			},
			{
				name: 'Black Leather',
				thumbnail: 'black leather.gif'
			}
		]
	});
	
});