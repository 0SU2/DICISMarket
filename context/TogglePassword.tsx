import * as React from 'react'

export const useTogglePasswordVisibility = () => {
  const [passwordVisibility, setPasswordVisibility] = React.useState(true);
  const [rightIcon, setRightIcon] = React.useState<string>('eye');

  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  return {
    passwordVisibility,
    rightIcon,
    handlePasswordVisibility
  };
};