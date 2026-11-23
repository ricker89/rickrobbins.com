# Hero Background Marquee Effect

Saved 2026-11-23. This was the scrolling portfolio cards background behind the hero section.

## CSS (lines ~190-259 in index.html)

```css
.v3-hero-video {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}
.v3-hero-video::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 10, 0.72);
  z-index: 2;
}
.v3-hero-bg-marquee {
  position: absolute;
  inset: -10%;
  z-index: 1;
  display: flex;
  gap: 16px;
  transform: rotate(-12deg) scale(1.3);
  transform-origin: center center;
  pointer-events: none;
}
.v3-hero-bg-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-width: 0;
}
.v3-hero-bg-col-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.v3-hero-bg-col:nth-child(odd) .v3-hero-bg-col-inner {
  animation: heroBgUp 30s linear infinite;
}
.v3-hero-bg-col:nth-child(even) .v3-hero-bg-col-inner {
  animation: heroBgDown 35s linear infinite;
}
@keyframes heroBgUp {
  from { transform: translateY(0); }
  to { transform: translateY(-50%); }
}
@keyframes heroBgDown {
  from { transform: translateY(-50%); }
  to { transform: translateY(0); }
}
.v3-hero-bg-card {
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}
.v3-hero-bg-card img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  object-position: top center;
  display: block;
}
@media (max-width: 768px) {
  .v3-hero-bg-marquee { gap: 12px; }
  .v3-hero-bg-col { gap: 12px; }
  .v3-hero-bg-col-inner { gap: 12px; }
  .v3-hero-bg-col:nth-child(n+4) { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .v3-hero-bg-col-inner { animation: none !important; }
}
```

## HTML (the hero section container)

```html
<div class="v3-hero-video">
  <div class="v3-hero-bg-marquee" id="hero-bg-marquee"></div>
</div>
```

## JavaScript (generates the scrolling columns)

```js
// Hero background marquee
(function() {
  var images = [
    'beforeafter/jennrobbins.actor/jennrobbins-full.jpg',
    'beforeafter/vincechafin.com/vince-after-full.jpg',
    'beforeafter/edithegerfoundation.com/editheger-full.jpg',
    'beforeafter/bridal.chloe.fit/bridal-chloe-full.jpg',
    'beforeafter/sacredsons.com/ss-homepage-full.jpg',
    'beforeafter/godsspear.com/godsspear-card.jpg',
    'beforeafter/mamayura.org/mamayura-card.jpg',
    'beforeafter/sacredsons-summit-2026/summit-card.jpg',
    'beforeafter/founders-circle/fc-card.jpg',
    'beforeafter/shemsheartwell.com/shems-after-full-2.jpg',
    'beforeafter/vincechafin.co/vincechafin-co-full.jpg',
    'beforeafter/walkingwithanthony.org/wwa-card.jpg',
    'beforeafter/flowwithchloe.com/chloe-card.jpg',
    'beforeafter/apexathletegroup.com/apex-full.jpg',
    'beforeafter/vincechafin.com/vince-guide-card.jpg',
    'beforeafter/shemsheartwell.com/shems-after-full.jpg',
    'beforeafter/cellevate/cellevate-full.jpg',
  ];
  shuffleArray(images);
  var container = document.getElementById('hero-bg-marquee');
  if (!container) return;
  var numCols = 7;
  for (var c = 0; c < numCols; c++) {
    var col = document.createElement('div');
    col.className = 'v3-hero-bg-col';
    var inner = document.createElement('div');
    inner.className = 'v3-hero-bg-col-inner';
    var colImages = [];
    for (var i = 0; i < 4; i++) {
      colImages.push(images[(c * 3 + i) % images.length]);
    }
    var doubled = colImages.concat(colImages);
    doubled.forEach(function(src) {
      var card = document.createElement('div');
      card.className = 'v3-hero-bg-card';
      var img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'eager';
      card.appendChild(img);
      inner.appendChild(card);
    });
    col.appendChild(inner);
    container.appendChild(col);
  }
})();
```
