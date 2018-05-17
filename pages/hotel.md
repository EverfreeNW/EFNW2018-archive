---
layout: page
title: Hotel
permalink: /hotel/
cover:
  name: Hotel
  extension: png
  artist: imdrunkontea
thumb: "/images/news/hotel_announcement.png"
preview: "Everfree Northwest is a family-friendly event at the DoubleTree Hotel Seattle Airport in Seattle, Washington. Be sure to register and book a room today!"
preview-tweet: "Everfree Northwest is a family-friendly event at the DoubleTree Hotel Seattle Airport. Register and book a room today!"
---

<div class="large-icon"><icon class="icon-location"></icon></div>

# DoubleTree Hotel Seattle Airport

**Hotel rooms are SOLD OUT!**
For the first time ever, we are out of rooms! So, what can you do if you don't have your room yet?
If you already purchased Hotel Tier badge, your room is reserved. No worries!

You can post on [ConRoomies](https://www.conroomies.com/convention/efnw18) or our [forums](https://mlpforums.com/forum/125-lodging/), as both have roomsharing areas. Make some new friends and find some convention crash space!

<div id="map" style="height: 500px"></div>
<br>

# How to Get Here

<row markdown="block">
<column markdown="block">

<div class="large-icon"><icon class="icon-st-link"></icon> <icon class="icon-link-seatac"></icon></div>

## From Light Rail

Link Light Rail operates every 6-15 minutes from Downtown Seattle to <icon class="icon-link-seatac"></icon> **SeaTac** station. Travel time is approximately 31 minutes from <icon class="icon-link-intl-district-chinatown"></icon> **International District-Chinatown** station and 38 minutes from <icon class="icon-link-westlake"></icon> **Westlake** station.

From the light rail station, go down the stairs or elevator and cross 176th street (towards our old location at the Hilton). Follow 176th for 0.6 of a mile, and the DoubleTree will be on your left. You can also cross the skybridge from the lightrail station and take the shuttle.

<a href="https://www.soundtransit.org/" target="_blank" class="button">Visit Sound Transit's Website <icon class="icon-right"></icon></a>

</column>
<column markdown="block">

<div class="large-icon"><icon class="icon-airport"></icon></div>

## From SeaTac Airport

Head to the shuttle pick up area. The shuttle to the DoubleTree Hotel Seattle Airport comes every 15 minutes during the day. Flag down the driver of the shuttle that you need. To see when the next shuttle will be arriving, call (206) 246-8600. Be sure to get on the shuttle for the DoubleTree Hotel Seattle Airport, and not the one for the DoubleTree Suites by Hilton Hotel Seattle Airport – Southcenter. Yes, there are two DoubleTree shuttles. Both will say DoubleTree on the side (the O is a giant cookie!), and will both have the location they are going. If you’re not sure if it’s the right shuttle, feel free to flag down the driver and ask.
</column>
</row>

<div class="large-icon"><icon class="icon-car"></icon></div>

## Driving

Take I-5 to exit 152. Follow 188th St and it will take you right by the hotel.

<p class="text-center"><a href="https://www.google.com/maps/dir//DoubleTree+Hotel+Seattle+Airport,+18740+International+Blvd,+Seattle,+WA+98188/@47.435511,-122.2963028,17z/data=!4m15!1m6!3m5!1s0x54905ca75f4c722b:0xd407b9006acd55ee!2sDoubleTree+Hotel+Seattle+Airport!8m2!3d47.435511!4d-122.2941141!4m7!1m0!1m5!1m1!1s0x54905ca75f4c722b:0xd407b9006acd55ee!2m2!1d-122.2941141!2d47.435511?hl=en" target="_blank" class="button"><icon class="icon-map"></icon> Get Directions from Google Maps <icon class="icon-right"></icon></a></p>

# Parking Rates

<row markdown="block">
<column markdown="block">

<div class="large-icon"><icon class="icon-hotel"></icon></div>

## Hotel Guests

$12 per night per vehicle with in-and-out privileges. Please pick up your parking ticket at the Front Desk.

</column>
<column markdown="block">

<div class="large-icon"><icon class="icon-day"></icon></div>

## Daytime Attendees

Be advised, when you leave the lot, the timer resets! Before returning to your vehicle, please pay at the pay station, located in the foyer across from Registration.

| Time | Price |
| ---- | ----- |
| 0 – 20 minutes | FREE |
| 20 mins – 1 hr | $5 |
| 1 hr – 24 hrs | $10 |

</column>
</row>

<!-- Scripts below -->
<script src="/scripts/mapbox-gl-0.40.1.js"></script>
<script>
  mapboxgl.accessToken = 'pk.eyJ1IjoidmljbG91IiwiYSI6Imo2TnUwRVEifQ.Lym1WQrkrRlIXtSKS7n15w';
  var hotel = [-122.294114, 47.435511];
  var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/viclou/cj89tj0hx4i652rs1n6d7vj36',
      center:  [-122.29498237657003, 47.44053458766169],
      zoom: 14.01
  });

  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
  }));
  map.scrollZoom.disable();

  var el = document.createElement('div'); el.id = 'marker';

  var hotel_popup = new mapboxgl.Popup({closeOnClick: false}).setHTML('<div class="text-center"><strong>Doubletree by Hilton <br> Seattle Airport</strong> <br> 18740 International Boulevard, <br> Seattle, Washington, 98188, USA</div>');
  new mapboxgl.Marker(el).setLngLat(hotel).setPopup(hotel_popup).addTo(map);
  hotel_popup.addTo(map);
</script>