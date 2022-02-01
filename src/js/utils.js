export const scrollToTop = () => window.scrollTo(0, 0);

export const makeRandomUser = () => {
  const n = Math.floor(Math.random() * 10);
  return n % 2 ? "🙋‍♂️" : "🙋";
};
