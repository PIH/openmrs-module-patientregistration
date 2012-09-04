<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<style>
	.custom-colorize {
		font-size: 20px;
		position: relative;
		width: 75px;
		height: 75px;
	}
	.custom-colorize-changer {
		font-size: 10px;
		position: absolute;
		right: 0;
		bottom: 0;
	}
</style>
<script type="text/javascript"><!--
		
	$j(document).ready(function(){
		
		// the widget definition, where "custom" is the namespace,
		// "colorize" the widget name
		$j.widget( "custom.colorize", {
			// default options
			options: {
				red: 255,
				green: 0,
				blue: 0,

				// callbacks
				change: null,
				random: null
			},

			// the constructor
			_create: function() {
				this.element
					// add a class for theming
					.addClass( "custom-colorize" )
					// prevent double click to select text
					.disableSelection();

				this.changer = $j( "<button>", {
					text: "change",
					"class": "custom-colorize-changer"
				})
				.appendTo( this.element )
				.button();

				// bind click events on the changer button to the random method
				// in 1.9 would use this._bind( this.changer, { click: "random" });
				var that = this;
				this.changer.bind("click.colorize", function() {
					// _bind would handle this check
					if (that.options.disabled) {
						return;
					}
					that.random.apply(that, arguments);
				});
				this._refresh();
			},

			// called when created, and later when changing options
			_refresh: function() {
				this.element.css( "background-color", "rgb(" +
					this.options.red +"," +
					this.options.green + "," +
					this.options.blue + ")"
				);

				// trigger a callback/event
				this._trigger( "change" );
			},

			// a public method to change the color to a random value
			// can be called directly via .colorize( "random" )
			random: function( event ) {
				var colors = {
					red: Math.floor( Math.random() * 256 ),
					green: Math.floor( Math.random() * 256 ),
					blue: Math.floor( Math.random() * 256 )
				};

				// trigger an event, check if it's canceled
				if ( this._trigger( "random", event, colors ) !== false ) {
					this.option( colors );
				}
			},

			// events bound via _bind are removed automatically
			// revert other modifications here
			_destroy: function() {
				// remove generated elements
				this.changer.remove();

				this.element
					.removeClass( "custom-colorize" )
					.enableSelection()
					.css( "background-color", "transparent" );
			},

			// _setOptions is called with a hash of all options that are changing
			// always refresh when changing options
			_setOptions: function() {
				// in 1.9 would use _superApply
				$j.Widget.prototype._setOptions.apply( this, arguments );
				this._refresh();
			},

			// _setOption is called for each individual option that is changing
			_setOption: function( key, value ) {
				// prevent invalid color values
				if ( /red|green|blue/.test(key) && (value < 0 || value > 255) ) {
					return;
				}
				// in 1.9 would use _super
				$j.Widget.prototype._setOption.call( this, key, value );
			}
		});

		// initialize with default options
		$j( "#my-widget1" ).colorize();

		// initialize with two customized options
		$j( "#my-widget2" ).colorize({
			red: 60,
			blue: 60
		});

		// initialize with custom green value
		// and a random callback to allow only colors with enough green
		$j( "#my-widget3" ).colorize( {
			green: 128,
			random: function( event, ui ) {
				return ui.green > 128;
			}
		});

		// click to toggle enabled/disabled
		$j( "#disable" ).toggle(function() {
			// use the custom selector created for each widget to find all instances
			$j( ":custom-colorize" ).colorize( "disable" );
		}, function() {
			$j( ":custom-colorize" ).colorize( "enable" );
		});

		// click to set options after initalization
		$j( "#black" ).click( function() {
			$j( ":custom-colorize" ).colorize( "option", {
				red: 0,
				green: 0,
				blue: 0
			});
		});
		
		
		 $j.widget("ui.dialogX", $j.ui.dialog, {
			_create: function() {
				$j.ui.dialog.prototype._create.call(this, this.options);
				if (!this.options.closeText) {
					this.uiDialogTitlebarCloseText.parent().hide();
				}
			},
			_setOption: function(key, value) {
				$j.ui.dialog.prototype._setOption.call(this, key, value);
				if (key === "closeText" && !value) {
					this.uiDialogTitlebarCloseText.parent().hide();
				}
			},
			
			destroy: function() {
				var self = this;
				$j.ui.dialog.prototype.destroy.call(this);
				self.element.unbind('.dialogX').removeData('dialogX');
				/* In 1.9 this part wont be necessary $.widget  */
				$j.Widget.prototype.destroy.call(this);
			}
		});
		function d() {
			$j(".d").dialog("destroy");
			$j(".d").dialogX("destroy");
		}

		$j("#s1").click(function() {
			d();
			$j("#dialog1").dialog();
		});
		
		$j("#s3").click(function() {
			d();
			$j("#dialog3").dialogX({
				width: ($j(document).width() * 0.8),
				closeText: ""
			});

		});
	});
		
		-->
</script>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuTopBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_topBar.jsp"%>		

<div class="middleArea">
	<div class="menu" id="menuArea">	
	</div>
	
	<div class="partBar mainArea largeFont">	
		<span id="s1" >Open Standard Dialog</span><br />
		<span id="s3">Open Dialog 3</span><br/>
		
		<div id="dialog1" class="d">This is a standard dialog with no extra options
			<pre>$("#dialog1").dialog();</pre>
		</div>
		<div id="dialog3" class="d">The new dialog with no close button.<br /> Aint that simpler
			<pre>
				$("#dialog3").dialogX({closeText: ""});
			</pre>
		</div>
		<div class="demo">
			<div>
				<div id="my-widget1">color me</div>
				<div id="my-widget2">color me</div>
				<div id="my-widget3">color me</div>
				<button id="disable">Toggle disabled option</button>
				<button id="black">Go black</button>
			</div>
		</div><!-- End demo -->

		<div class="demo-description" style="display: none; ">
			<p>This demo shows a simple custom widget built using the widget factory (jquery.ui.widget.js).</p>
			<p>The three boxes are initialized in different ways. Clicking them changes their background color. View source to see how it works, its heavily commented</p>
			<p><a href="http://wiki.jqueryui.com/w/page/12138135/Widget-factory">For more details on the widget factory, visit the jQuery UI planning wiki.</a></p>
		</div><!-- End demo-description -->
		
	</div>		
</div>	

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>	

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>