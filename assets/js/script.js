// Curved text JS for logo - found at https://circletype.labwire.ca/
var demo4 = new CircleType(document.getElementById('logo'));
window.addEventListener('resize', function updateRadius() {
  demo4.radius(demo4.element.offsetWidth / 2);
});
updateRadius();