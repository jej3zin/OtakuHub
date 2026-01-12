export function setupSlider(container, left, right) {
  const scroll = 300;

  left.onclick = () =>
    container.scrollBy({ left: -scroll, behavior: 'smooth' });

  right.onclick = () =>
    container.scrollBy({ left: scroll, behavior: 'smooth' });
}
