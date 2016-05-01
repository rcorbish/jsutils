# jsutils
Java script utilities to do frequently done things. No other libraries are required: Keep it simple

## makeLiveTable

via CDN:  `//cdn.rawgit.com/rcorbish/jsutils/master/makeLiveTable-min.js`

makeLiveTable makes a table scroll keeping the headers always visible. The original table is kept
in place; it may be restyled and may have THEAD & TBODY sections added, if they are missing.

parameters:
* table		: may be the actual table, its id or a query selector (first matching table)
* height	: height of the table
* colWidths	: an iterable containing numbers from which each column width will be taken
 
colWidths can be smaller than the # columns, in which case the colWidth will start from index 0 again
so to make all columns the same width pass in [ "200px" ], for example.
 
 Functions are bound to the table :
 * addRow( iterable ); this adds a new row to the top of the table rows. The newly added row has a style of newly-added-row
 * editRow( tr, iterable ); this edits the data in an existing row. tr may be a tablerow element or a query selector to find one
 
Suggestion: set the table style to display: none before calling this. That prevents unnecessary redrawing.
this function will set the display to block after it's finished

## Usage
```
  <table id='livetable'></table>
  <button id="addbtn">Add</button>

  <script>
    makeLiveTable( "#livetable", "300px", [ "120px", "200px"] ) ;
    function addR() { 
      var t = document.querySelector("#livetable") ; 
      var now = new Date();
      var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
      if ( time[0] < 10 ) time[0] = "0" + time[0];
      if ( time[1] < 10 ) time[1] = "0" + time[1];
      if ( time[2] < 10 ) time[2] = "0" + time[2];
      t.addRow( ['this', 'is a', 'new', 'row', time.join(':') ] ) ; 
      t.editRow( "#livetable tbody tr:nth-child(5)", ['this', 'is a', 'new', 'row', time.join(':') ] ) ; 
    }

    var btn = document.getElementById( "addbtn" ) ;
    btn.onclick = function(e){ addR(); 	}
  </script>
  // This is a way to highlight the newly added rows; added by addRow()
 
  <style>		
  .newly-added-row { animation: fadein 1.5s ;	}
  @keyframes fadein {
     from {	background-color: black ; color: white ; }
     to { background-color: transparent ; color: inherit ; }
    }
  </style>
  
 ```
