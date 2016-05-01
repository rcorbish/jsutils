/**
 * makeLiveTable makes a table scroll keeping the headers always visible. The original table is kept
 * in place; it may be restyled and may have THEAD & TBODY sections added, if they are missing.
 * 
 * parameters:
 * 		table					  : may be the actual table, its id or a query selector (first matching table)
 * 		height					  : height of the table
 * 		colWidths				  : an iterable containing numbers from which each column width will be taken
 * 
 * colWidths can be smaller than the # columns, in which case the colWidth will start from index 0 again
 * so to make all columns the same width pass in [ "200px" ], for example.
 * 
 * A function is bound to the table addRow( iterable ); this adds a new row to 
 * the top of the table rows. The newly added row has a style of newly-added-row
 * 
 * Suggestion: set the table style to display: none before calling this. That prevents unnecessary redrawing.
 * this function will set the display to block after it's finished
 * 
 * full example...
 * 
 *  <table id='livetable'>
 *  </table>
 *  
 *	<script>
 * 
 * 		makeLiveTable( "#livetable", "300px", [ "120px", "200px"] ) ;
 *
 *		function addR() { 
 *			var t = document.querySelector("#livetable") ; 
 *			var now = new Date();
 *			var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
 *			if ( time[0] < 10 ) time[0] = "0" + time[0];
 *			if ( time[1] < 10 ) time[1] = "0" + time[1];
 *			if ( time[2] < 10 ) time[2] = "0" + time[2];
 *			t.addRow( ['this', 'is a', 'new', 'row', time.join(':') ] ) ; 
 *		}
 *	</script>
 *		
 *	<button id="addbtn">Add</button>
 *	
 *	<script>
 *		var btn = document.getElementById( "addbtn" ) ;
 *		btn.onclick = function(e){ 
 *			addR(); 
 *		}
 *	</script>
 *
 * This is a way to highlight the newly added rows; added by addRow()
 * 
 * <style>		
 *	.newly-added-row {	
 *		animation: fadein 1.5s
 *	}
 * @keyframes fadein {
 *     from {
 *     	background-color: black ;
 *     	color: white ;
 *     }
 *     to {    
 *     	background-color: transparent ;
 *     	color: inherit ;
 * 	   }
 * }
 * </style>
 */
function makeLiveTable( table, tableHeight, colwidths ) {
	// allow the actual element or a valid selector to a table
	if( ! (table instanceof HTMLTableElement) ) {
		table = document.querySelector( table ) ;
		if( ! (table instanceof HTMLTableElement)) {
			throw "Cannot find a valid HTML table from " + table ;
		}
	}
	// Hide the table while we're making a load of style updates (faster)
	table.style['display'] = 'none' ;
	
	// Make sure we have a separate THEAD section - if not add it in
	// if we do add it in - steal the first row into the newly created THEAD
	// we assume it's the title bar you don't want to scroll
	var thead = table.querySelector( "thead" ) ;
	if( !thead ) {
		var firstRow = table.querySelector( "tr" ) ;
		thead = document.createElement("thead");
		table.insertBefore( thead, table.firstChild ) ;
		thead.appendChild( firstRow ) ;
	}
	// Now force the proper column widths on each header item
	var titleRows = thead.querySelectorAll( "tr" ) ;
	for( var i=0 ; i<titleRows.length ; i++ ) {
		var cols = titleRows[i].querySelectorAll( "td,th" ) ;
		for( var j=0 ; j<cols.length ; j++ ) {
			cols[j].style['min-width'] = colwidths[j % colwidths.length] ;
			cols[j].style['width'] = colwidths[j % colwidths.length] ;
		}
	}
	
	// Now we concentrate on the body; if there is no body, add one
	var tbody = table.querySelector( "tbody" ) ;
	if( !tbody ) {
		tbody = document.createElement("tbody");
		table.insertBefore( tbody, thead ) ;
	}
	// This is easy enough - for all pre-existing rows set the column widths
	// to the desired sizes. Note - if you do want to add rows to the table
	// afterwards - use the addRow() function ( see above). If you do it 
	// yourself - you won't get the correct style (i.e. widths)
	var bodyRows = tbody.querySelectorAll( "tr" ) ;
	for( var i=0 ; i<bodyRows.length ; i++ ) {
		var cols = bodyRows[i].querySelectorAll( "td" ) ;
		for( var j=0 ; j<cols.length ; j++ ) {
			cols[j].style['min-width'] = colwidths[j % colwidths.length] ;
			cols[j].style['width'] = colwidths[j % colwidths.length] ;
		}
	}

	// This utility func will be bound to the table. It should be used to 
	// add a new row. The data parameter is an iterable of text that will become the 
	// inner HTML of each cell in the new row.
	// It creates the new HTML elements and applies proper styles to them. Nothing too 
	// clever worth mentioning.
	function addRow(data) {
		var tbody = this.querySelector( "tbody" ) ;
		var firstRow = tbody.querySelector( "tr" ) ; 
		var tr = document.createElement("tr");
		tr.className = "newly-added-row" ;
		for( var i=0 ; i<data.length ; i++  ) {
			var td = document.createElement("td");
			td.style['min-width'] = colwidths[i % colwidths.length] ;
			td.style['width'] = colwidths[i % colwidths.length] ;
			td.innerHTML = data[i] ;
			tr.appendChild( td ) ;
		}
		tbody.insertBefore( tr, firstRow ) ;
	} ; 
	// Bind the function to the table - so it's a new public method of that table
	table.addRow = addRow.bind( table ) ;

	// Setup all the important custom styles
	// make sure the THEAD style is valid for no scrolling	
	thead.style["display"] = "block" ;
	thead.style["overflow-x"] = "hidden" ; 
	// then set the body styles so that it will scroll (independently of the THEAD)
	tbody.style["display"] = "block" ;
	tbody.style["overflow-x"] = "hidden" ; 
	tbody.style["overflow-y"] = "scroll" ; 
	
	// OK put the style back - this is just for performance
	// OK let's set the important styles to make the scrolling work
	table.style["table-layout"] = "fixed" ;
	table.style["overflow-x"] = "hidden" ;
	table.style["overflow-y"] = "hidden" ;
	table.style["height"] = tableHeight ;
	table.style['display'] = 'block'  ;			// this could be an input parameter ?????
	
	// we must set the body height to enable scrolling (after all other styles are defined)
	tbody.style["height"] = (table.offsetHeight - tbody.offsetTop) + "px"; 
}	

