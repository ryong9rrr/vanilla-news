export const scrollToTop = (): Window | void => window.scrollTo(0, 0);

export const randomUserImg = (): string => {
  const n: number = Math.floor(Math.random() * 10);
  return n % 2 ? "🙋‍♂️" : "🙋";
};
