'use client';

import { useEffect, useMemo, useState } from 'react';

import type { NextPage } from 'next';

const words = [
  'i',
  'nature',
  'job',
  'offer',
  'me',
  'happy',
  'unicorn',
  'project',
  'contact',
  'hi',
  'discuss',
  'will.i.am',
  'xyz',
  'hear.me.out',
  'feel',
  'help',
  'reach'
];

const getRandomWords = (wordList: string[], count: number): string[] => {
  const shuffledList = [...wordList];

  for (let i = shuffledList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
  }

  return shuffledList.slice(0, count);
};

const Contact: NextPage = () => {
  const list = useMemo(() => getRandomWords(words, 7), []);

  const [randomWord, setRandomWord] = useState('random');

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    for (const word of list) {
      const ratio = (list.indexOf(word) + 1) / list.length;
      const time = ratio * (ratio - ratio / 3) * 2000;

      const timer = setTimeout(() => {
        setRandomWord(word);
      }, time);

      timers.push(timer);
    }

    return () => {
      timers.forEach(timer => {
        clearTimeout(timer);
      });
    };
  }, [list]);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="text-4xl font-medium tracking-widest">
        <a href={`mailto:${randomWord}@lazar.sh`}>
          <span className="border-b-2 dark:border-zinc-500 border-dashed dark:text-zinc-400">
            {randomWord}
          </span>
          <span>@lazar.sh</span>
        </a>
      </div>
      <div className="dark:text-zinc-500 font-medium pt-4">
        <p>use a random name, write your own, it&apos;s up to you!</p>
      </div>
    </div>
  );
};

export default Contact;
