import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | Last Race`;
  }, [title]);
};

export default usePageTitle;
