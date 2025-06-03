/**
 * Theme: Approx - Bootstrap 5 Responsive Admin Dashboard
 * Author: Mannatthemes
 * File: Leaflet Js
 */
 
             // Map-6


             var map = L.map('V_Simple');
     
     map.setView([51.505, -0.09], 13);

     var marker = L.marker([51.5, -0.09])
         .bindPopup("<b>Hello world!</b><br />I am a popup.")
         .addTo(map);

     var circle = L.circle([51.508, -0.11], 500, {color: '#f03', opacity: 0.7})
         .bindPopup("I am a circle.")
         .addTo(map);

     var polygon = L.polygon([
         [51.509, -0.08],
         [51.503, -0.06],
         [51.51,  -0.047]])
         .bindPopup("I am a polygon.")
         .addTo(map);

     var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
         osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
         osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib}).addTo(map);
 