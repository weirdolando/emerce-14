import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  shadows: { outline: "0 0 0 2px var(--chakra-colors-pink-400)" },
  components: {
    Input: {
      defaultProps: {
        focusBorderColor: "pink.400",
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: "pink.400",
      },
    },
  },
});
