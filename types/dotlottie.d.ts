declare module '@dotlottie/react-player' {
  import { FC } from 'react';

  interface DotLottiePlayerProps {
    src: string;
    autoplay?: boolean;
    loop?: boolean;
    className?: string;
  }

  export const DotLottiePlayer: FC<DotLottiePlayerProps>;
}
