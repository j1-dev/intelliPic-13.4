'use client';
import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons';

const ColorSchemeToggleButton = () => {
  const [colorScheme, setColorScheme] = useState('light');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const localColorScheme = localStorage.getItem('colorScheme');
    if (localColorScheme) {
      document.documentElement.classList.add(localColorScheme);
      document.documentElement.dataset.theme = localColorScheme;
      setColorScheme(localColorScheme);
      setEnabled(localColorScheme === 'dark');
    }
  }, []);

  const toggleColorScheme = () => {
    const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.remove(colorScheme);
    document.documentElement.classList.add(newColorScheme);
    document.documentElement.dataset.theme = newColorScheme;
    localStorage.setItem('colorScheme', newColorScheme);
    setColorScheme(newColorScheme);
    setEnabled(!enabled);
  };

  return (
    <div className="inline-flex fixed right-6 bottom-6 z-50">
      <SunIcon className="m-3 scale-150" />

      <Switch
        onChange={toggleColorScheme}
        className={`${colorScheme === 'light' ? 'bg-black' : 'bg-white'}
          transition-all hover:shadow-lg mtrelative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white dark:bg-black shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>

      <MoonIcon className="m-3 scale-150" />
    </div>
  );
};

export default ColorSchemeToggleButton;
