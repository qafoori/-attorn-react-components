export const useScrollSection = (
  scrollSectionRef: React.RefObject<HTMLDivElement>
) => {
  const { current: scrollSection } = scrollSectionRef;

  const onWheel = (evt: React.WheelEvent<HTMLDivElement>) => {
    const { currentTarget: target } = evt;
    const { deltaY } = evt;
    console.log(evt)

    if (target.scrollTop > deltaY) { // scroll up
      const { scrollHeight } = evt.currentTarget
      const newScroll = target.scrollTop + deltaY + 50;

      // target.scrollTop = newScroll > scrollHeight ? scrollHeight : newScroll
      target.scrollTop = scrollHeight
    }
    else { // scroll down
      // target.scrollTop += (evt.altKey ? deltaY + 50 : deltaY)
      target.scrollTop += deltaY - 20
    }

  }
  // evt => { evt.currentTarget.scrollTop += (evt.deltaY - 20) }}

  return {
    on: {
      wheel: onWheel
    }
  }
}