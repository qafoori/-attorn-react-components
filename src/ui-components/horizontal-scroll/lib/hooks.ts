export const useHorizontalScroll = (HSRef: React.RefObject<HTMLDivElement>) => {

  const wheel = (evt: React.WheelEvent<HTMLDivElement>) => {
    const { deltaY } = evt;
    const { current: HS } = HSRef;
    HS!.scrollLeft += deltaY;
  }

  return {
    on: {
      wheel
    }
  }
}