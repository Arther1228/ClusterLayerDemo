//变量

var map;
var clusterLayer = null;
var photoInfo = {};

var defaultSym = null;
var renderer = null;

var picBaseUrl = "";
var blue = null;
var green = null;
var red = null;

//var popupOptions = null;
var popupTemplate = null;

var highlightSymbol1 = "";
var path = "";

require(["dojo/parser", "dojo/ready", "dojo/_base/array", "esri/Color", "dojo/dom-style", "dojo/query", "esri/map"
         , "esri/request", "esri/graphic", "esri/geometry/Extent", "esri/symbols/SimpleMarkerSymbol"
         , "esri/symbols/SimpleFillSymbol", "esri/symbols/PictureMarkerSymbol", "esri/renderers/ClassBreaksRenderer"
         , "esri/layers/GraphicsLayer", "esri/SpatialReference", "esri/dijit/PopupTemplate", "esri/geometry/Point", "esri/geometry/webMercatorUtils"
         , "extras/ClusterLayer", "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!"]);

function init() { 

	dojo.parser.parse();

	defaultSym = new esri.symbol.SimpleMarkerSymbol().setSize(4);
	renderer = new esri.renderer.ClassBreaksRenderer(defaultSym, "clusterCount");

	picBaseUrl = "https://static.arcgis.com/images/Symbols/Shapes/";
	blue = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "BluePin1LargeB.png", 32, 32).setOffset(0, 15);
	green = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "GreenPin1LargeB.png", 64, 64).setOffset(0, 15);
	red = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "RedPin1LargeB.png", 72, 72).setOffset(0, 15);

	
	var whpath = window.document.location.href;
    var filename = "index.html";
    var pos = whpath.indexOf(filename);
    path = whpath.substring(0, pos);
    highlightSymbol1 = new esri.symbol.PictureMarkerSymbol(path + "/images/qiujiNew.png", 12, 12);
    highlightSymbol0 = new esri.symbol.PictureMarkerSymbol(path + "/images/qiangjiNew.png", 12, 12);
    
/*	popupOptions = {
			"markerSymbol": new esri.symbol.SimpleMarkerSymbol("circle", 20, null, new esri.Color([0, 0, 0, 0.25])),
			"marginLeft": "20",
			"marginTop": "20"
	};*/

	// popupTemplate to work with attributes specific to this dataset
	popupTemplate = new esri.dijit.PopupTemplate({
		"title": "",
		"fieldInfos": [{
			"fieldName": "Caption",
			visible: true
		}, {
			"fieldName": "Name",
			"label": "By",
			visible: true
		}, {
			"fieldName": "Link",
			"label": "On Instagram",
			visible: true
		}]
	});

	map = new esri.Map("map", {
		basemap: "oceans",
		center: [-117.789, 33.543],
		zoom: 13
	});
	map.disableDoubleClickZoom();
	map.isDoubleClickZoom = true;
	
	map.on("click", cleanUp);

	map.on("key-down", function(e) {
		if (e.keyCode === 27) {
			cleanUp();
		}
	});

	dojo.connect(map, "onLoad", function () {
		// hide the popup's ZoomTo link as it doesn't make sense for cluster features
		//dojo.domStyle.set(query("a.action.zoomTo")[0], "display", "none");

		// get the latest 1000 photos from instagram/laguna beach
		var photos = new esri.request({
			url: "data/1000-photos.json",
			handleAs: "json"
		});

		photos.then(addClusters, error);
	});
}

dojo.addOnLoad(init);