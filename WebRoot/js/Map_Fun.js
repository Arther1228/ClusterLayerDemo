/**
 * 相关功能
 */

function cleanUp() {
	map.infoWindow.hide();
	clusterLayer.clearSingles();
}

function error(err) {
	console.log("something failed: ", err);
}

function addClusters(resp) {
    var wgs = new esri.SpatialReference({
      "wkid": 4326
    });
    
    require(["dojo/_base/array"], function(arrayUtils) {
        photoInfo.data = arrayUtils.map(resp, function(p) {
            var latlng = new esri.geometry.Point(parseFloat(p.lng), parseFloat(p.lat), wgs);
            var webMercator = new esri.geometry.geographicToWebMercator(latlng);
            var attributes = {
              "Caption": p.caption,
              "Name": p.full_name,
              "Image": p.image,
              "Link": p.link
            };
            return {
              "x": webMercator.x,
              "y": webMercator.y,
              "attributes": attributes
            };
          });
    	});
    
    // popupTemplate to work with attributes specific to this dataset
    var popupTemplate = new esri.dijit.PopupTemplate({
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
    
    // cluster layer that uses OpenLayers style clustering
    require(["extras/ClusterLayer"], function(ClusterLayer){
    	clusterLayer = new ClusterLayer({
	      "data": photoInfo.data,
	      "distance": 100,
	      "id": "clusters",
	      "labelColor": "#fff",
	      "labelOffset": 10,
	      "resolution": map.extent.getWidth() / map.width,
	      "singleColor": "#888",
	      "singleTemplate": popupTemplate
	    });
    });
   
    renderer.addBreak(0, 2, blue);
    renderer.addBreak(2, 200, green);
    renderer.addBreak(200, 1001, red);

    clusterLayer.setRenderer(renderer);
    map.addLayer(clusterLayer);
}