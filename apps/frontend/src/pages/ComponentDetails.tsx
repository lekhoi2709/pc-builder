import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import { GetComponentById } from '../services/api';
import {
  CheckCircle2Icon,
  ChevronRightIcon,
  HeartIcon,
  PlusCircleIcon,
} from 'lucide-react';
import SideBarButton from '../components/SideBarButton';
import { useUIStore } from '../stores/uiStore';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import getLocalizedPrice from '../utils/getLocalizedPrice';
import type { ComponentWithRelations } from '../types/components';
import { SkeletonBox, SkeletonText } from '../components/Skeleton';
import type { TFunction } from 'i18next';

export function ComponentDetails() {
  const { componentId, lang } = useParams();
  const { isSideBarOpen, toggleSidebar } = useUIStore();
  const { t } = useTranslation('component');

  const componentDetailsQuery = useQuery({
    queryKey: ['component', componentId],
    queryFn: () => GetComponentById(componentId!),
    refetchOnWindowFocus: false,
    placeholderData: previousData => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const data = componentDetailsQuery.data;
  if (componentDetailsQuery.isLoading) {
    return (
      <main className="md:px-22 font-saira z-0 h-full min-h-screen w-screen gap-4 p-8 md:pt-28">
        <span className="flex items-center justify-between xl:hidden">
          <h1 className="text-2xl font-semibold">{t('page.title')}</h1>
          <SideBarButton
            isSideBarOpen={isSideBarOpen}
            toggleSidebar={toggleSidebar}
          />
        </span>
        <span className="my-8 flex items-center gap-2 font-bold md:mt-4">
          <Link
            to="/components"
            className="hidden capitalize underline-offset-4 hover:underline md:inline-block"
          >
            {t('page.title')}
          </Link>
          <ChevronRightIcon className="hidden h-4 w-4 md:inline-block" />
          <span className="text-accent-400 capitalize">
            <SkeletonText />
          </span>
        </span>
        <section className="md:grid-cols-14 grid grid-cols-1 items-center gap-8">
          <div className="md:col-span-6">
            <SkeletonBox className="border-secondary-300 dark:border-secondary-500 font-saira max-w-screen bg-secondary-500/20 dark:bg-secondary-600/20 hover:border-secondary-400 col-span-full aspect-square w-full transform rounded-lg border bg-center object-contain" />

            <div className="mt-4 flex gap-4 overflow-x-auto md:grid-cols-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBox
                  key={i}
                  className="border-secondary-300 dark:border-secondary-500 font-saira max-w-screen bg-secondary-500/20 dark:bg-secondary-600/20 hover:border-secondary-400 col-span-1 aspect-square w-[calc(25%-0.75rem)] shrink-0 transform cursor-pointer rounded-lg border bg-cover bg-center p-2 md:w-[calc(33.333%-0.667rem)] xl:w-[calc(20%-0.8rem)]"
                />
              ))}
            </div>
          </div>
          <div className="flex h-full w-full flex-col gap-8 md:col-span-8">
            <span className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold md:text-3xl">
                <SkeletonText boxClassName="h-8 w-full" />
              </h1>
              <span className="flex items-center gap-4">
                <SkeletonText boxClassName="h-6" />
                <span>
                  <SkeletonText />
                </span>
              </span>
            </span>
          </div>
        </section>
      </main>
    );
  }

  if (componentDetailsQuery.isError) {
    return <div>Error</div>;
  }

  if (!componentDetailsQuery.data) {
    return <div>Error</div>;
  }

  return (
    <Layout
      data={data!}
      lang={lang}
      t={t}
      isSideBarOpen={isSideBarOpen}
      toggleSidebar={toggleSidebar}
    />
  );
}

type LayoutProps = {
  data: ComponentWithRelations;
  lang?: string;
  t: TFunction<'component', undefined>;
  isSideBarOpen: boolean;
  toggleSidebar: () => void;
};

function Layout(props: LayoutProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const { price } = getLocalizedPrice(
    (props.data && props.data!.price) || [
      { currency: 'USD', amount: 0, symbol: '' },
    ],
    props.lang || 'vn'
  );

  return (
    <main className="md:px-22 font-saira z-0 h-full min-h-screen w-screen gap-4 p-8 md:pt-28">
      <span className="flex items-center justify-between xl:hidden">
        <h1 className="text-2xl font-semibold">{props.t('page.title')}</h1>
        <SideBarButton
          isSideBarOpen={props.isSideBarOpen}
          toggleSidebar={props.toggleSidebar}
        />
      </span>
      <span className="my-8 flex items-center gap-2 font-bold md:mt-4">
        <Link
          to="/components"
          className="hidden capitalize underline-offset-4 hover:underline md:inline-block"
        >
          {props.t('page.title')}
        </Link>
        <ChevronRightIcon className="hidden h-4 w-4 md:inline-block" />
        <span className="text-accent-400 capitalize">{props.data.name}</span>
      </span>
      <section className="md:grid-cols-14 grid grid-cols-1 items-center gap-8">
        <div className="md:col-span-6">
          <img
            src={props.data.image_url[selectedImageIndex]}
            alt={props.data.name}
            className="border-secondary-300 dark:border-secondary-500 font-saira max-w-screen bg-secondary-500/20 dark:bg-secondary-600/20 hover:border-secondary-400 col-span-full aspect-square w-full transform rounded-lg border bg-center object-contain"
            loading="eager"
          />

          <div className="mt-4 flex gap-4 overflow-x-auto md:grid-cols-3">
            {props.data.image_url.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={image + index}
                onClick={() => setSelectedImageIndex(index)}
                className="border-secondary-300 dark:border-secondary-500 font-saira max-w-screen bg-secondary-500/20 dark:bg-secondary-600/20 hover:border-secondary-400 col-span-1 aspect-square w-[calc(25%-0.75rem)] shrink-0 transform cursor-pointer rounded-lg border bg-cover bg-center p-2 md:w-[calc(33.333%-0.667rem)] xl:w-[calc(20%-0.8rem)]"
                loading="lazy"
              />
            ))}
          </div>
        </div>
        <div className="flex h-full w-full flex-col gap-8 md:col-span-8">
          <span className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold xl:text-4xl">
              {props.data.name}
            </h1>
            <span className="border-secondary-200 dark:border-secondary-500 bg-secondary-300/10 dark:bg-secondary-600/20 hover:border-secondary-400 flex w-full transform flex-col gap-4 rounded-lg border p-4 px-6 transition-colors">
              <p className="transform text-xl font-bold text-blue-700 xl:text-3xl">
                {price}
              </p>
              <span>
                {props.data.is_active ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="h-5 w-5 fill-green-400/20 text-green-600 dark:fill-green-400 dark:text-green-900" />
                    <p className="text-green-600 dark:text-green-400">
                      {props.t('page.in_stock')}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="h-5 w-5 fill-red-400/20 text-red-600 dark:fill-red-400 dark:text-red-900" />
                    <p className="text-red-600 dark:text-red-400">
                      {props.t('page.out_of_stock')}
                    </p>
                  </div>
                )}
              </span>
              <div className="flex w-full items-center justify-between gap-4">
                <button className="dark:text-primary-100 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-700 bg-blue-700/20 p-4 text-blue-800 dark:bg-blue-700">
                  <PlusCircleIcon className="h-5 w-5" />
                  Add to Build
                </button>
                <button className="border-secondary-200 dark:border-secondary-500 bg-secondary-300/10 dark:bg-secondary-600/20 hover:border-secondary-400 flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-4">
                  <HeartIcon className="text-accent-400 h-6 w-6" />
                </button>
              </div>
            </span>
            <div>
              {props.data.specs_map &&
                Object.keys(props.data.specs_map).length > 0 && (
                  <>
                    <h2 className="mb-4 text-xl font-semibold">
                      Technical Specifications
                    </h2>
                    <div className="max-h-75 xl:max-h-100 border-secondary-300 hover:border-secondary-400 dark:border-secondary-500 space-y-2 overflow-y-auto rounded-lg border px-4 pt-3">
                      {Object.entries(props.data.specs_map).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="border-accent-400/20 flex justify-between border-b p-2 pb-3"
                          >
                            <span className="text-accent-500 dark:text-accent-300 font-medium capitalize">
                              {key.replace(/_/g, ' ')}
                            </span>
                            <span className="text-secondary-900 dark:text-secondary-100">
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </>
                )}
            </div>
          </span>
        </div>
      </section>
    </main>
  );
}
