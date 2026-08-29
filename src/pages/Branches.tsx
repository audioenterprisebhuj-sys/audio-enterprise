import React from 'react';
import logoImage from '../assets/categories/em audio.jpeg';

export function Branches() {
  return (
    <div className="bg-white">
      <section className="mx-auto w-full max-w-[1320px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12 md:flex-row">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
              Brand
            </p>

            <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-5xl">
              EM Audio
            </h1>
          </div>

          <div className="flex w-full max-w-[220px] justify-center md:w-auto md:justify-end">
            <img
              src={logoImage}
              alt="EM Audio logo"
              className="h-auto w-[180px] object-contain sm:w-[200px] md:w-[220px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
