document.onselectstart = function () { return false; }; // disable text selection on this page
document.ondragstart = function () { return false; }; // disable image dragging (internet explorer) on this page

var version = '0.13.4';

var frameHeight; // height of one frame in the vehicle graphic
var frameWidth; // width of one frame in the vehicle graphic
var numFrames; // total number of frames in the animation
var currentFrame = 0;

var xpos = 0; // mouse X position
var sensitivity = 25; // # of pixels to drag mouse before frame changes

var fadeSpeed = 500; // miliseconds to complete a jQuery fade
var spinSpeed = 100; // miliseconds between timed frame changes
var accessoryFadeSpeed = 500;
var interiorFadeSpeed = 0;

var opt; // options passed to this plugin, global for use in functions, etc
var timer; // staggers frame change events with intervals equal to spinSpeed

var touchEnabled = false; // is this being viewed on a touch device?
var isiPad = false; 

var stopAtFrame = -1;

var visibleStart = -1;
var visibleEnd = -1;
var visibleRange = Array();

var colorIndex = 0; // numeric index of the color currently selected
var colorName = ""; // same, but with its name
var prevColorIndex = 0; // index of the previous color (used for fade transitions)

var $visibleAccessories;
var visibleAccessoriesIDs = Array();
var $bodyColorAccessories;

var accessoryDelay = 0;
var accessoryWait = 200;

var loadingTimeOut;
var loadingDelay = 500;

var autoSpin = true;
var autoSpinTimer;
var initialSpinInterval;

var imageFolder = ""; // the folder that contains all the image files
var devEnabled = false;
var consoleLineNumber = 0;

var $currentColor;
var $previousColor;

/*************** TOUCH DETECTION ***************/

var touch_detect = {
  auto_detected: function(event){
    /* add everything you want to do onLoad here (eg. activating hover controls) */
    //alert('this was auto detected');
    activateTouchArea();
  },
  surface: function(event){
    /* add everything you want to do ontouchstart here (eg. drag & drop) - you can fire this in both places */
    //alert('this was detected by touching');
    activateTouchArea();
  }
}; // touch_detect

function activateTouchArea(){
  /* make sure our screen doesn't scroll when we move the "touchable area" */
	if(touchEnabled == false)
	{
		touchEnabled = true;
		jQuery.fx.interval = 50;
		enableSpin();
	}
}

/*************** TOUCH DETECTION ***************/

$.fn.kia360 = function(options) 
{ 
	// set default options
	$.fn.kia360.defaultOptions = {
		nameplateTitle: '',
		frameWidth: 700,
		frameHeight: 480,
		numFrames: 24,
		mirrorMouseX: false,
		autoSpin: true,
		firstFrame: ''
	}
	
	if(Modernizr.touch) {
    touch_detect.auto_detected();
  } else {
    document.ontouchstart = touch_detect.surface;
  }
	
	// ipad shrinks all sprites above 2 MP by 50%, we must detect this
	//isiPad = (navigator.userAgent.match(/iPad/i) != null) || (navigator.userAgent.match(/iPhone/i) != null);
	
	// merge default options with passed options (?)
	options = $.extend({}, $.fn.kia360.defaultOptions, options);
	
	frameHeight = options.frameHeight;
	frameWidth = options.frameWidth;
	numFrames = options.numFrames;
	autoSpin = options.autoSpin;
	
	imageFolder = options.imageFolder;
	
	opt = options;
	colorName = opt.colors[0].name;

	
	//touchEnabled = true;
	
	this.html(''); // clear contents	
	this.append('<div id="kia360-vr-container"></div>');
	
	this.css({
		'height': 'auto',
		'cursor': 'default',
		
		// disable selection
		'-webkit-user-select': 'none',
		'-khtml-user-select': 'none',
		'-moz-user-select': 'none',
		'-ms-user-select': 'none',
		'-o-user-select': 'none',
		'user-select': 'none'
	});
	
	$('#kia360-vr-container').css({
		'position': 'relative',
		'padding-top': '30px'
	});
		
	// append all graphical elements
	// append vehicle stacks container (for centering)
	$('#kia360-vr-container').append('<div id="kia360-stack-vehicle"></div>'); 
	$('#kia360-stack-vehicle').css({
		'width': frameWidth,
		'height': frameHeight
	});
	
	// append vehicle stacks container (for centering)
	$('#kia360-vr-container').append('<div id="kia360-stack-accessory"></div>'); 
	$('#kia360-stack-accessory').css({
		'width': frameWidth,
		'height': frameHeight,
		'margin-top': -1 * frameHeight + 'px',
		'overflow': 'visible'
	});
	
	if(devEnabled)
	{
		// append coordinate display
		$('#kia360-vr-container').append('<div id="kia360-mousecoords"></div>');
		$('#kia360-vr-container').append('<div id="kia360-frame-links"></div>');
		for(var frame = 0; frame < numFrames; frame++)
		{
			$('#kia360-frame-links').append('<a class="frame-link frame-link-' + frame + '" href="#">' + frame + '</a>');
			$('.frame-link-' + frame).bind('click', {f:frame}, function (event) { spinTo(event.data.f); });
		}

		//$('#kia360-vr-container').append('<div id="kia360-console"></div>');
	}
	
	// append spin arrows
	$('#kia360-vr-container').append('<div id="kia360-spin-arrows"></div>');
	$('#kia360-spin-arrows').append('<a href="#" class="spin-arrow arrow-ccw"></a>');
	$('#kia360-spin-arrows').append('<a href="#" class="spin-arrow arrow-cw"></a>');
	
	// start spinning on arrow click/touch
	$('.arrow-ccw').mousedown(function () { spin('ccw'); });
	$('.arrow-cw').mousedown(function () { spin('cw'); });
	
	$('.arrow-ccw').click(function () { prevent_default(); });
	$('.arrow-cw').click(function () { prevent_default(); });
	
	$('.arrow-ccw').bind('touchstart', function () { prevent_default(); spin('ccw'); });
	$('.arrow-cw').bind('touchstart', function () { prevent_default(); spin('cw'); });
	
	// stop animation on vehicle click/touch
	$('body').mouseup(function () { spinStop(); });
	$('#kia360-vr-container').bind('touchstart', function () { spinStop(); });
	
	$('#kia360-vr-container').append('<div id="kia360-loading"></div>');
	
	if(touchEnabled)
	{
		$('#kia360-vr-container').append('<div id="kia360-instructions">Touch and drag to rotate</div>');
	} else {
		$('#kia360-vr-container').append('<div id="kia360-instructions">Click and drag to rotate</div>');
	}
	
	$('#kia360-vr-container').append('<div id="kia360-divider"></div>');
	
	// append color links
	$('#kia360-vr-container').append('<div id="kia360-color-links"><span class="kia360-header">Available Colours</span></div>');
	$('#kia360-color-links').append('<ul></ul>');
	
	$('#kia360-color-links .kia360-header').append('<div id="color-name"></div>');

	
	// append all the colors
	for(var c = 0 ; c < options.colors.length; c++)
	{		
		var color = options.colors[c];
		// the rotating image ("stack") containing the car
		$('#kia360-stack-vehicle').append('<img id="vehicle-stack-' + c + '" class="vehicle-stack vehicle-stack-' + c + '" />'); 
		
		$('.vehicle-stack-' + c).css({ 
			'width': frameWidth,
			'height': frameHeight * numFrames
		});
		
		// create color swatch thumbnails and set color change event handlers
		$('#kia360-color-links ul').append('<li><a href="#" class="kia360-color-link color-link-' + c + '"><img src="' + imageFolder + '/' + color.thumbnail + '" />' + /*<br>' + color.name + */ '</a></li>');
				
		$('.color-link-' + c).bind('click', {idx:c}, function (event) { 
			prevent_default(event);
		
			changeColor(event.data.idx);
		});
	}
	
	$('.color-link-0').addClass('kia360-selected');
	
	// ***************************** append interior links
	if(opt.interiors.length > 0)
	{
		$('#kia360-vr-container').append('<div id="kia360-interior-links"><span class="kia360-header">Available Interiors</span></div>');
		$('#kia360-interior-links').append('<ul></ul>');
	}
	
	// append all the interiors
	for(var i = 0, len = options.interiors.length; i < len ; i++)
	{
		// create interior swatch thumbnails and set color change event handlers
		$('#kia360-interior-links ul').append('<li><a href="#" id="interior-link-' + i + '" class="kia360-interior-link' + ' visible"><img src="' + imageFolder + '/' + options.interiors[i].thumbnail + '" /><br>' + options.interiors[i].name + '</a></li>');
				
		$('#interior-link-' + i).bind('click', {idx:i}, function (event) { 
			prevent_default(event);
			//toggleInterior(event.data.idx); 
		});
	}		
	
	//$('#interior-link-' + 0).addClass('kia360-selected');
	
	
	
	
	
	
	
	
	
	// ***************************** append accessory links
	$('#kia360-vr-container').append('<div id="kia360-accessory-links"><span class="kia360-header">Available Accessories</span></div>');
	$('#kia360-accessory-links').append('<ul id="kia360-accessory-ul-1" class="kia360-accessory-column"></ul>');
	$('#kia360-accessory-links').append('<ul id="kia360-accessory-ul-2" class="kia360-accessory-column"></ul>');
	
	$('.kia360-accessory-column').css({
		'width': '50%',
		'float': 'left'
	});

	var column = 1;
	var halfway = options.accessories.length / 2;
	
	// ***************************** append all the accessories
	for(var a = 0; a < opt.accessories.length; a++)
	{
		var width = options.accessories[a].width;
		var height = options.accessories[a].height;
		var top = options.accessories[a].yOffset;
		var left = options.accessories[a].xOffset;
		
		$('#kia360-stack-accessory').append('<div id="accessory-stack-' + a + '" class="accessory-stack"></div>'); 
		
		var zIndex = 2;
		
		// assign z-index (as long as one is specified)
		if( opt.accessories[a].zIndex != null) zIndex = opt.accessories[a].zIndex;
		
		// set width/height
		$('#accessory-stack-' + a).css({
			'width': width,
			'height': height,
			'top': top,
			'left': left,
			'z-index': zIndex,
			'background-position': '0 0'
		});
		
		// if accessories image is an array (not a string), it must be a body color accessory
		if(opt.accessories[a].image instanceof Object)
		{
			//console.log(Object.keys(options.accessories[a].image).length);
			
			for(var ac = 0; ac < opt.colors.length; ac++)
			{
				$('#accessory-stack-' + a).append('<div id="accessory-stack-body-color-' + a + '-' + ac + '" class="body-color body-color-' + ac + '"></div>'); 
				
				// set width/height
				$('#accessory-stack-body-color-' + a + '-' + ac).css({
					'width': width,
					'height': height,
					'top': 0,
					'left': 0,
					'z-index': 2,
					'position': 'absolute',
					'background-position': '0 0'
				});
			}
		}
		
		// increment column
		if(a >= halfway ) column = 2; 
		
		// create accessory links and set event handlers
		$('#kia360-accessory-ul-' + column).append('<li><a href="#" id="accessory-link-' + a + '" class="kia360-accessory-link">' + options.accessories[a].name + '</a></li>');
		
		$('#accessory-link-' + a).bind('click', {idx:a}, function (event) { 
			prevent_default(event);
			// console.log('toggleAccessory('+event.data.idx+') - link clicked');
			toggleAccessory(event.data.idx); 
		});
		
		if(opt.accessories[a].onByDefault)
		{
			//console.log('Accessory ' + a + ' is on by default');
			toggleAccessory(a, false, true);
		}
	}		
	
	// save body color accessories query in a var
	$bodyColorAccessories = $('.body-color');
	
	// append a static image displayed while the stack is loading 
	$('#kia360-stack-vehicle').append('<div id="kia360-vehicle-first-frame"></div>'); 
	
	$('<img/>').attr('src', imageFolder + '/' + options.firstFrame).load(function() {
		
		$('#kia360-vehicle-first-frame').css({
			'width': frameWidth,
			'height': frameHeight,
			'background-image': 'url(\'' + imageFolder + '/' + options.firstFrame + '\')',
			'opacity': 0
		});
		
		$('#kia360-vehicle-first-frame').animate({'opacity': 1}, fadeSpeed);
	});
	
	$('#kia360-vr-container').append('<div class="kia360-clearfix"></div>');
	$('#kia360-vr-container').after('<div class="kia360-clearfix"></div>');
	this.after('<div class="kia360-clearfix"></div>');
	
	$('#kia360-vr-container').append('<p id="kia360-version">Kia 360 VR v' + version + '</p>');
	
	enableSpin();
	
	if(opt.defaultColor != null) {
		changeColor(opt.defaultColor, options); // go to default color
	} else {
		changeColor(0, options); // go to first color
	}
}



/* this function is required because some browsers don't support console.log 
		or don't display its output in a convenient way (mobile) */
var console_log = function (message) {
	if(message && devEnabled)
	{
		consoleLineNumber++;
		//$('#kia360-console').prepend('<p>' + consoleLineNumber + ' ' + message + '</p>');
		$('#kia360-console').prepend('<p>' + consoleLineNumber + ' ' + message + '</p>');
		$('#kia360-console p:nth-child(20)').remove();
	}
}









/* loading icon */
var loading = function(on, delay) {
	
	if(delay == null) {
		delay = 0;
	}
	
	if(on == true) {
		//console.log('Loading... on. Delay == ' + delay);
		
		loadingTimeOut = window.clearTimeout(loadingTimeOut);
		loadingTimeOut = window.setTimeout(function () {
			$('#kia360-loading').animate({opacity: 1}, 500);
		}, delay);
	} else { 
		//console.log('Loading... off. Delay == ' + delay);
		loadingTimeOut = window.clearTimeout(loadingTimeOut);
		
		$('#kia360-loading').stop().animate({opacity: 0}, 500, function() {
			$(this).css('visiblity', 'hidden');
		});
		
	}
}













/*
 * enableSpin()
 * 
 * Activate mouse/touch drag spin functionality
 *
 ************************************/
var enableSpin = function() {
	
	$body = $('body');
	
	if(!touchEnabled) { // mouse devices
		
		//$('body').append('<p>touchEnabled == false</p>');
		
		$('#kia360-stack-vehicle, #kia360-stack-accessory').mousedown(function(event) {
			
			spinStop();
			
			// save initial click location
			xpos = event.clientX;
			
			$body.bind('mousemove', function(event) {
				
				// if mouse moves beyond a certain threshold...
				if(Math.abs(event.clientX - xpos) >= sensitivity)
				{
					// trigger a frame change
					if(event.clientX - xpos > 0)
					{
						ccw();
					} else {
						cw();
					}
					
					// update mouse position
					xpos = event.clientX;
				}
				
				//$('#kia360-mousecoords').html('(x: ' + event.clientX +', currentFrame = ' + currentFrame + ')');
			});
		});
		
		$body.mouseup(function() {
			$body.unbind('mousemove');
		});
	} else { // touch devices
	
	//console_log('Enabling touch.');

		//document.ontouchmove = function() { return false; }; // disable touch scrolling
		
		// clear all previous bindings
		$('#kia360-stack-vehicle, #kia360-stack-accessory').unbind();
		$body.unbind();
		
		// update instructions, in case touch was not automatically detected
		$('#kia360-instructions').html('Touch and drag to rotate');
		
		$('#kia360-stack-vehicle, #kia360-stack-accessory').bind('touchstart', function(e) {
			
		//console_log('event touchstart ' + $(this).attr('id'));
			document.ontouchmove = disableTouchScroll; // disable touch scrolling
			
			$body.unbind('touchmove');
			
			
			// capture touch coords
			var touch = e.originalEvent.touches[0];
			xpos = touch.pageX;
			
		//console_log('xpos captured ' + xpos);
			
			//document.ontouchmove = function(){ return false; };
			
			//console_log('document.ontouchmove set');
			
			//$('body').append('<p>xpos == ' + xpos + '</p>');
			
			$(this).bind('touchmove', touchMove);
			
		//console_log('touchmove bound');
		});
		
	//console_log('stacks touchstart bound');
		
		$('#kia360-stack-vehicle, #kia360-stack-accessory').bind('touchend', touchEnd);
		
	//console_log('stacks touchend bound');
	}
	
//console_log('enableSpin() complete.');
	
}

var touchMove = function(e) {
								
//console_log('event touchmove $body');
	
	// capture new coords after touchmove
	var touchX = e.originalEvent.touches[0].pageX;
	
	//console_log('touchX set ' + touchX);
	
	if(Math.abs(touchX - xpos) >= sensitivity)
	{
		//console_log('sensitivity triggered');
		
		if(touchX - xpos > 0)
		{
			ccw();
		} else {
			cw();
		}
		
		xpos = touchX;
	}
}

var touchEnd = function(e) {
			
	//console_log('event touchend ' + $(this).attr('id'));
	
	document.ontouchmove = enableTouchScroll; // enable touch scrolling
	
	//console_log('document.ontouchmove set');
	
	$(this).unbind('touchmove');
	
	//console_log('body touchmove UNbound ' + $(this).attr('id'));
}

var disableTouchScroll = function () {
	return false;
}

var enableTouchScroll = function () {
	// empty
}





/*
 * changeColor(c, opt)
 * 
 * Changes color to specified index c. Requires options opt from main function.
 *
 ************************************/
var changeColor = function(c) {
	
	//console.log(c);
	
	prevColorIndex = colorIndex;
	colorIndex = c;
	colorName = opt.colors[c].name;

	//console.log('.color-link-' + c + ' (' + opt.colors[c].name + ') clicked.');
	
	var src = imageFolder + '/' + opt.colors[c].image;
	
	/* 	We check for iPad because that device
			will automatically scale down by 50% any image over 2 megapixels,
			including the sprites used for the vehicle 360,
			which end up looking hideous. Death to Apple. */ 
	if(isiPad) {
		// feed ipad a separate sprite, under 2 MP
		src = src.substr(0, src.length-4) + ' - iPad' + src.substr(src.length-4, src.length);
	}
	
	loading(true, 500);
			
	// wait until background image (stack) is loaded
	$('.vehicle-stack-' + c).attr('src', src).load(function () { 
	
		$(this).unbind('load');
	
		updateAccessoryColor(setColor); 
		
		if(autoSpin)
		{
			//console.log('autoSpin');
			
			// delay initial speed by fadeSpeed (enough time for placeholder jpeg to disappear)
			var initialSpin = setTimeout(function () {
				// cycle through all frames
				initialSpinInterval = window.clearTimeout(initialSpinInterval);
				initialSpinInterval = setInterval(function() { 
					cw(); 
				}, spinSpeed);
				
				// a few milliseconds after the spin starts, tell it to stop at frame 0
				autoSpinTimer = setTimeout(function () { stopAtFrame = 0; }, spinSpeed);
				
			}, fadeSpeed);
			
			autoSpin = false;
		}
	});
	$('.vehicle-stack-' + c).each(function () {
		if(this.complete)
		{
			$(this).load();
		}
	});
}









/*
 * setColor(c)
 * 
 * Turns on accessory at index c. Requires options opt from main function.
 *
 ************************************/
var setColor = function() {
	
	var c = colorIndex;
	
	loading(false, 0);
		
	// push all other colors to the bottom of the pile
	$('.vehicle-stack:not(.vehicle-stack-' + c + ')').css('z-index', 0)
	
	// show new color
	$('.vehicle-stack-' + c).addClass('visible').css('z-index', 1).fadeIn(fadeSpeed, function() {
		$('.vehicle-stack:not(.vehicle-stack-' + c + ')').fadeOut(0).removeClass('visible'); //.attr('src', '');
		$('.vehicle-stack-' + c).fadeIn(0, function() {
			// turn off placeholder graphic
			$('#kia360-vehicle-first-frame').fadeOut(0);
		});
	});
	
	$currentColor = $('#vehicle-stack-' + colorIndex);
	$previousColor = $('#vehicle-stack-' + prevColorIndex + '.visible');
	
	redraw();
	// select correct color link
	$('.kia360-color-link').removeClass('kia360-selected');
	$('.color-link-' + c).addClass('kia360-selected');
	
	$('#color-name').html(colorName).fadeIn() ;
	
	//hide interior links based on availability for this color
	
	var excludedIDs = '';
	
	if(opt.colors[c].excludeInteriors)
	{
		var len = opt.colors[c].excludeInteriors.length;
		
		if(len > 0)
		{
			//console.log('len == ' + len);
			
			for(var i = 0; i < len; i++)
			{
				excludedIDs = excludedIDs + '#interior-link-' + opt.colors[c].excludeInteriors[i];
				if(i != len - 1) excludedIDs += ', ';
				
				//console.log('target == ' + target);
			}
		}
		
		$('#kia360-interior-links .kia360-interior-link').not(excludedIDs).css('display', 'inline-block').animate({opacity: 1}, interiorFadeSpeed, function () { $(this).css('opacity', 1); });

		
		$(excludedIDs).each(function () {
			// hide link
			$(this).animate({opacity: 0}, interiorFadeSpeed, function () { $(this).css({'display': 'none', 'opacity': 0})});
			
			// if hidden link was selected, deselect and select the first interior
			if($(this).hasClass('kia360-selected'))
			{
				$(this).removeClass('kia360-selected'); 
				$('#interior-link-0').addClass('kia360-selected'); 
			}

		});
	}
	
}












/*
 * toggleAccessory(c)
 * 
 * Turns on accessory at index c. Requires options opt from main function.
 *
 ************************************/
var toggleAccessory = function(c, spin, onByDefault, callback) {
	
	//console.log('toggleAccessory(' + c + ')');
	
	//visibleStart = opt.accessories[c].visibleStart;
	//visibleEnd = opt.accessories[c].visibleEnd;
		
	if(onByDefault)
	{
		spin = false;
		accessoryDelay = 0;
		accessoryFadeSpeed = 0;
	}
	
	//console.log('accessoryDelay = ' + accessoryDelay);
	
	// if this accessory is not visible, show it
	if(!$('#accessory-stack-' + c).hasClass('visible'))
	{
		//console.log('Activating accessory ' + c + ' (' + opt.accessories[c].name + ')');
		
		loading(true, 500); // show loading icon
		
		var requiredName = opt.accessories[c].requires;
		
		// if this accessory requires another accessory
		if(requiredName != null)
		{
			// loop through all accessories to find the index of the required accessory
			for(var required = 0, len = opt.accessories.length; required < len; required++)
			{
				// if this is the index of the required accessory && the required accessory is not visible
				if(opt.accessories[required].name == requiredName && $('#accessory-stack-' + required + '.visible').length == 0)
				{
					// toggle the required accessory
					toggleAccessory(required, false, false);
					
					// stop looping
					break;
				} 
			}
		}
		
		var accessoryURL = "";
		var bodyColorID = '';
		var target = $('#accessory-stack-' + c);
		
		if(opt.accessories[c].image instanceof Object)
		{
			// this is a body color accessory with more than one URL
			accessoryURL = imageFolder + '/' + opt.accessories[c].image[colorIndex];
		} else {
			// this is not a body color accessory, it only has one url
			accessoryURL = imageFolder + '/' + opt.accessories[c].image;
		}
							
		// attach callback to sprite load event
		$('<img/>').attr('src', accessoryURL).load(function() {
			
			$(this).unbind('load');
			
			loading(false, 0); // hide loading icon
			
			var child = $();
			
			if(opt.accessories[c].image instanceof Object) {
				
				var id = '#accessory-stack-body-color-' + c + '-' + colorIndex;
				
				child = $(id);
				child.css('background-image', 'url(\'' + accessoryURL + '\')');
			} else {
				target.css('background-image', 'url(\'' + accessoryURL + '\')');
			}
			
			// set img src and fade in accessory div
			currentGroup = opt.accessories[c].group;
			
			// the group the toggled accessory belongs to
			if(typeof currentGroup == "number") // group is not null
			{
				// search through all accessories
				for(var accessory = 0; accessory < opt.accessories.length; accessory++)
				{
					// console.log('checking accessory ' + accessory);
					
					//console.log('testing group ' + opt.accessories[accessory].group);
					
					// if this is not the accessory group we just turned on
					if( opt.accessories[accessory].group == currentGroup )
					{
						// turn it off
						$('#accessory-stack-' + accessory).fadeOut(fadeSpeed, function() {$(this).removeClass('visible')});
						$('#accessory-link-' + accessory).removeClass('kia360-selected');
					}
				}
			}
			
			// spin to accessory
			if(spin != false)
			{
				spinToAccessory(c);
			} else {
				accessoryDelay = 0;
			}
			
			// turn on the accessory
			child.addClass('visible');
			target.addClass('visible').fadeOut(0).delay(accessoryDelay).fadeIn(accessoryFadeSpeed, function() {
				if (typeof callback == "function") callback();
			});
			updateVisibleAccessories();
			
			// update link
			$('#accessory-link-' + c).addClass('kia360-selected');

		}).each(function () {
			if(this.complete) {
				$(this).load(); // IE fix
			}
		});
		
	} else {
		
		//console.log('DEactivating accessory ' + c + ' (' + opt.accessories[c].name + ')');
		
		// find all accessories that require the accessory about to be turned off
		// turn them off too
		for(var i = 0, len = opt.accessories.length; i < len; i++)
		{
			//console.log(i + '.requires: ' + opt.accessories[i].requires);
			
			if(opt.accessories[i].requires == opt.accessories[c].name && $('#accessory-stack-' + i).filter('.visible').length != 0)
			{
				//console.log(i + ' requires ' + opt.accessories[i].requires + ' == ' + c + ' ' + $('#accessory-stack-' + i + '.visible').length );
				toggleAccessory(i, false, false);
			} 
		}
		
		// if this accessory group is not in the "always on" array
		if(opt.alwaysOnGroups != null)
		{
			if($.inArray(opt.accessories[c].group, opt.alwaysOnGroups) == -1)
			{
				// spin to accessory
				if(spin != false)
				{
					spinToAccessory(c);
				} else {
					accessoryDelay = 0;
				}
				
				var $target = $('#accessory-stack-' + c);

				// hide accessory
				$target.delay(accessoryDelay).fadeOut(fadeSpeed, function() {
					
					$(this).removeClass('visible');
					$(this).css('background-image', '');
					
					$('.visible', '#accessory-stack-' + c).removeClass('visible');
										
					if (typeof callback == "function") callback();
				});
				
				updateVisibleAccessories();
				
				$('#accessory-link-' + c).removeClass('kia360-selected'); 
			}
		}
	}
}

// save visible accessories in a jquery object, then update frames for all
var updateVisibleAccessories = function() {
	//$visibleAccessories = $('.accessory-stack.visible');
	
	visibleAccessoriesIDs = Array(); // reset the array
	
	$('.accessory-stack.visible').each(function () {
		// snip the index off the end of this accessory's id
		visibleAccessoriesIDs.push($(this).attr('id').substr('16'));
	});
	
	$bodyColorAccessories = $('.body-color');
	
	redraw();
}

// cycle through all body color accessories and turn them on/off according to argument color
var updateAccessoryColor = function(callback) {
	
	//console.log('updateAccessoryColor() ' + colorIndex +' '+colorName);
	
	var $visible = $bodyColorAccessories.filter('.visible');
	var len = $visible.length;
	
	//console.log($visible.length + ' body color accessories visible');	
	
	$visible.each(function ()
	{
		// get index of body color accessory
		var id = $(this).parent().attr('id');
		var idx = id.replace('accessory-stack-', '');
		
		//console.log('idx = ' + idx);
		
		// toggle accessory on and off
		
		var url = imageFolder + '/' + opt.accessories[parseInt(idx)].image[colorIndex];
		
		//console.log('url = ' + url);
		
		// wait until file loaded
		$('<img/>').attr('src', url).load(function() {
			
			// if the event is left bound, it will never trigger again because the file is cached
			$(this).unbind('load');

			//console.log(url + ' loaded');
			
			// move all other accessory colors on top of the current one
			$('.visible', '#accessory-stack-' + idx)
				.not('#accessory-stack-body-color-' + idx + '-' + colorIndex).css('z-index',10);
			
			// move the current color to the bottom
			$('#accessory-stack-body-color-' + idx + '-' + colorIndex)
				.css('z-index', 0)
				.css({
					'background-image': 'url(\'' + url + '\')'
				})
				.addClass('visible')
				// fade in new color...	
				.fadeIn(0, function() {
					$('.visible', '#accessory-stack-' + idx)
						.not('#accessory-stack-body-color-' + idx + '-' + colorIndex)
						// fade out old color...
						.fadeOut(fadeSpeed, function() { 
							$(this).removeClass('visible').css({
								'display': 'none'
							}); 
						});
						
						//$('#accessory-stack-body-color-' + idx + '-' + colorIndex).css('z-index', 2);
				});
				
			callback(); // change color only after last element is loaded
			
			redraw();
		}).each(function () {
			if(this.complete) {
				$(this).load(); // IE fix
			}
		});
		//toggleAccessory(idx, false, false, function() { toggleAccessory(idx, false, false); });
	});
	
	if(len == 0) callback();
}

/*
 * toggleInterior(c, opt)
 * 
 * Turns on interior at index c. Requires options opt from main function.
 * Interiors are not actually visible on the car. This simply selects/unselects the links.
 *
 ************************************/
var toggleInterior = function (c) 
{
	//console.log('toggleInterior(' + c + ')');
	
	$('.kia360-interior-link').removeClass('kia360-selected'); 

	if($('#interior-link-' + c).hasClass('kia360-selected'))
	{
		$('#interior-link-' + c).removeClass('kia360-selected'); 
	} else {
		$('#interior-link-' + c).addClass('kia360-selected'); 
	}
}

/*
 * spin()
 * 
 * rotates the car forever
 */
var spin = function(direction) {
		
	if(direction == 'cw')
	{
		cw();
		window.clearInterval(timer);
		timer = window.setInterval(cw, spinSpeed);
	} else if (direction == 'ccw') {
		ccw();
		window.clearInterval(timer);
		timer = window.setInterval(ccw, spinSpeed);
	} else {
		// do nothing
	}
}

/*
 * spinTo()
 * 
 * rotates the car to a target frame
 */
var spinTo = function(targetFrame) {
	
	//console.log('spinTo(' + targetFrame + ')');
	
	var difference = currentFrame - targetFrame;
	
	stopAtFrame = targetFrame;
	
	//console.log('difference == ' + difference);
	
	if(difference == 0) 
	{
		return;
	}
	
	var distance = 0; // used to calculate delay before accessory fadein
	
	stopAtFrame = targetFrame;
	
	if(difference > 0 )
	{
		var loopDistance = numFrames - currentFrame + targetFrame;
		
		// is it faster to go backwards than forwards
		if(difference > loopDistance) {
			
			distance = numFrames - currentFrame + targetFrame;
			
			spin('ccw');
		} else {
			distance = difference;
			
			spin('cw');
		}
	} else {
		var loopDistance = numFrames - targetFrame + currentFrame;
		
		if(difference * -1 > loopDistance) {
			distance = loopDistance;
			
			spin('cw');
		} else {
			distance = difference * -1;
			
			spin('ccw');
		}
	}
	
	stopAtFrame = targetFrame;
	//console.log('stopAtFrame = ' + stopAtFrame);
	//var timeout = setTimeout(function() { clearInterval(timer); }, distance * spinSpeed);
}

/*
 * spinToAccessory(a)
 * 
 * rotates the car to show a certain accessory
 * if current frame is outside the visible range for this accessory
 */
var spinToAccessory = function(a) {
	//console.log('b spinToAccessory(' + a + ')');
	
	accessoryDelay = 0;
		
	var visibleRange = opt.accessories[a].visibleRange;
	
	// IE fix - thanks to http://soledadpenades.com/2007/05/17/arrayindexof-in-internet-explorer/
	if(!Array.indexOf)
	{
	    Array.prototype.indexOf = function(obj) {
	        for(var i=0; i<this.length; i++)
					{
	            if(this[i]==obj)
							{
	                return i;
	            }
	        }
	        return -1;
	    }
	}
	
	if(visibleRange != null && visibleRange.length > 0)
	{
		// we are already looking at the accessory, no need to spin
		//if(currentFrame in visibleRange)
		//if($.inArray('' + currentFrame, visibleRange)) 
		if(visibleRange.indexOf(currentFrame) > -1) 
		{
			//console.log('### ' + visibleRange.indexOf(currentFrame));
			
			var str = '';
			
			for(var i = 0, len = visibleRange.length; i < len; i++)
			{
				str += ' ' + visibleRange[i];
			}
			
			//console.log(currentFrame + ' is in the visible range for accessory ' + a + ' (' + str + ')');
			
			return; 
		}
		
		var forwardDistance = 0;
		var backwardDistance = 0;
		
		var forwardTarget = 0;
		var backwardTarget = 0;
		
		for(var f = currentFrame, loops = 0; f < numFrames && loops < 2; f++)
		{
			//console.log('### - ' + i + ' - ' + loops);
			
			if(f == numFrames - 1) 
			{ 
				f = 0;
				loops++; 
			}
			
			if(visibleRange.indexOf(f) > -1)
			{
				//console.log('f found ' + f);
				
				forwardTarget = f;
				
				break;
			}
			
			forwardDistance++;
		}
		
		for(var b = currentFrame, loops = 0; b >= 0 && loops < 2; b--)
		{
			//console.log('ddd - ' + b + ' - ' + loops);
			
			if(b == 0) 
			{ 
				b = numFrames - 1;
				loops++; 
			}
			
			if(visibleRange.indexOf(b) > -1)
			{
				//console.log('b found ' + b);
				
				backwardTarget = b;
				
				break;
			}
			
			backwardDistance++;
		}
		
		spinTo((forwardDistance <= backwardDistance ? forwardTarget : backwardTarget));
		accessoryDelay = (forwardDistance <= backwardDistance ? forwardDistance : backwardDistance) * spinSpeed + accessoryWait;
		
		//console.log('Delay: ' + accessoryDelay);
	} else {
		//console.log('visibleRange is null.');
	}
}

/*
 * spinStop()
 * 
 * Stop spinning the car.
 *
 ************************************/
var spinStop = function () {
	
	//console.log('spinStop('+ currentFrame +')');
	
	initialSpinInterval = window.clearInterval(initialSpinInterval);
	timer = window.clearInterval(timer);
}


/*
 * spinStopAt()
 * 
 * Stop spinning the car at a specific frame.
 *
 ************************************/
var spinStopAt = function (targetFrame) {
	//console.log('spinStopAt(' + targetFrame + ')');
		
	if(currentFrame == targetFrame)
	{
		//console.log('spinStopAt() calling spinStop() | targetFrame == ' + targetFrame);
		spinStop();
		stopAtFrame = -1;
		return true;
	}
	
	//console.log('NO MATCH currentFrame == ' + currentFrame + ' | targetFrame == ' + targetFrame);
	return false;
}



/* rotate clockwise one frame
 *
 ************************************/
var cw = function() {	

	// check target frame before attempting to spin
	if(spinStopAt(stopAtFrame))
	{
		return;
	}
	
	if(!opt.flipMouse)
	{
		if(currentFrame >= numFrames - 1)
		{
			// beginning of animation, skip to the end
			currentFrame = 0; 
		} else {
			currentFrame++;
		}
	} else {
		if(currentFrame <= 0)
		{
			// end of animation, go back to beginning
			currentFrame = numFrames - 1; 
		} else {
			currentFrame--;
		}
	}
	
	redraw();
}



/* rotate counter-clockwise one frame
 *
 ************************************/
var ccw = function() {
	
	// check target frame before attempting to spin
	if(spinStopAt(stopAtFrame))
	{
		return;
	}

	if(!opt.flipMouse)
	{
		if(currentFrame <= 0)
		{
			// end of animation, go back to beginning
			currentFrame = numFrames - 1; 
		} else {
			currentFrame--;
		}
	} else {
		if(currentFrame >= numFrames - 1)
		{
			// beginning of animation, skip to the end
			currentFrame = 0; 
		} else {
			currentFrame++;
		}
	}
	
	redraw();
}

/* update the scene by moving all visible sprites up or down by the appropriate value
 *
 ************************************/
var redraw = function() {
	
	//console.log('redraw(' + currentFrame + ')');
	
	//console_log('redraw() #vehicle-stack-' + colorIndex);
		
	// spin car stacks
	if($currentColor) $currentColor.css('top', '' + ( -1 * currentFrame * frameHeight) + 'px');
	if($previousColor) $previousColor.css('top', '' + ( -1 * currentFrame * frameHeight) + 'px');
	
	//console_log('redraw() #vehicle-stack-' + colorIndex + ' done');
	
	/* spin accessory stacks */
	
	// select visible only
	
	for(var i = 0, len = visibleAccessoriesIDs.length; i < len; i++)
	{
		//console.log('visibleAccessoriesIDs[' + i + '] == ' + visibleAccessoriesIDs[i]);
		var index = visibleAccessoriesIDs[i];
		var position = -1 * currentFrame * opt.accessories[index].height;
		
		//console_log('redraw() #accessory-stack-' + index);
		
		$('#accessory-stack-' + index, '#kia360-stack-accessory')
			.css('background-position', '0 ' + position + 'px');
			
		// update body color accessories
		$('.visible', '#accessory-stack-' + index)
			.css('background-position', '0 ' + position + 'px');
						
		//console_log('redraw() #accessory-stack-' + index + ' done');
	}
	
//console_log('redraw(' + currentFrame + ') complete');
	if(devEnabled) 
	{
		$('.frame-link').removeClass('currentFrame');
		$('.frame-link-' + currentFrame).addClass('currentFrame');
		
		$('.frame-link').removeClass('visibleBound');
		$('.frame-link-' + visibleStart).addClass('visibleBound');
		$('.frame-link-' + visibleEnd).addClass('visibleBound');
	}
}

// prevent links from scrolling to top of page on click
// prevent taps from scrolling on touch device
var prevent_default = function(event){
    if(window.event)
    {
        window.event.returnValue = false;
    }
    else if(event.preventDefault)
    {
        event.preventDefault();
    }
    else
    {
        event.returnValue = false;
    }
};
