import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Upload, 
  Filter, 
  Download, 
  Heart, 
  Box,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';

const GALLERY_ITEMS = [
  {
    id: '1',
    title: 'Neo-Tokyo Modular District',
    author: 'Kenta_Builds',
    downloads: '4.2k',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrT6ikf-ljL9cr7yVgF1QpXLFBADiMlnd_QQc00TECbMr5OXBR9yVCJ4bRKgsMe3BQxRAy_hpW8DyQlevEa4b-fp_5G8r9E1ZM0s4f6wqV-URi5hkcA_e2SUmust6ePLKvvtb-1YIJPIJUQT1skLvqSVjLUxYL8iaoK5BDaFr7q5M0eo00lfe5aYYYw_mJ5xycIadnt-PXbeTNmKPstwMITWTupMlAklZHbL1I95pXx_wypVDwWsWuvOXP8L9Ex8kD-T9Ito42xto',
    featured: true
  },
  {
    id: '2',
    title: 'Retro Steam-Engine',
    author: 'SteamPunk_Fan',
    downloads: '842',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCncrF-ZYrs5h6dhDYGyweL2w17zKllH-EAlm_Lg84G1bfwxZYR0nmvOGDzK6DIyubtL0bVcti794J1VEmkb2DA0P5d6h4GoYyCru0s2fC3GjAu8Pylsafo7vEKmVv8cUoE0K8CciQ3nCOxkauEnYnCXUQcFkp7gcc04bWlpbBa8cqY51mE9HzgBWq9PyA1C8lQnD-djwBeryCMg7RhA85ofgvVgVnCsHsLNDzPKp_fjspW4UL-CQJyyI1LB_g2Z-nYhCnFfMI90uE'
  },
  {
    id: '3',
    title: 'Minimalist Workspace',
    author: 'DeskArch',
    downloads: '1.2k',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6Q50tw5cUIDV-NxivrtxM_aB0mt21JCRoeFDs5rmMhPBBFxY-3odltD7sMrm1UT2wBD94YAPIOXiT6NlNtCFFWYYacDwNzZx4gfnRD26xUU2wzsXw6TpGOqI5t-2-I9Tozp_E3UJPJP-RH8--3UGPEw3U7lLUC-S4zqmCVxBftkqsJhlGB7ACU0MjUlDOfy-0Unt8qYWD6ZaDrxTM59S6OqzoOCUNFXHFXOqEuidPejsKDnRFvU94vwVmHkAoaZPQDYpxmWnoM-Y'
  },
  {
    id: '4',
    title: 'Differential Gear-Box V4',
    author: 'Technic / Mechanical',
    downloads: '2.5k',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA57e-_nuxnhNGRqCZS8vikyQ9_BesoB_w-6rpcEUdJhowxpgUOsud4KO9peYXFpA0r2jq8mdl6z8X--rRAzpU0W6418HJI6keRq7494VnPOX2xdO43XIS-tEBe_OoRixeIc1pqAAyEtNVXs_qm14E17ZYzo5BftRAVsRZMteoiEx96o9JQWzX_OZ8ahbNUP1iSiJvm8LdIjoM25g_WCXpkSYRjHVQKne8vPYeYYbWFBpXBHduqvgAia0cylzafyAimuOF5WVA8BLY',
    vertical: true
  },
  {
    id: '5',
    title: 'Mars Habitat 01',
    author: 'SpaceCadet',
    downloads: '315',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm0kdIB_Caff1nMamy4EDse8tGwCdXrth81RNuG-cz5FXQGZrDtL_duWx2tHPx47A2Jhjw9-I6zhB6q8CCKZccz-RR2f1fZJVOFiuZT5lZluxvJ7Up7BHih1-RX8OQodxFd0OQiDnzRDF2oajIq9E8OvtEqCwyWgYlJKYD9VMLmac87LdXJeNiTLZ9RujlS7SE6KjRxgrTNn2ar45RVI7pbX6976_GVANP9wjace1BgetMS7TE9fbQTv9T9YJNa3c7pwRbjqv431A'
  },
  {
    id: '6',
    title: 'Parkside Cafe',
    author: 'UrbanCreator',
    downloads: '2.1k',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqXcZoHmEFejx1gCTayoC0fYIQtoN-CopsD4cgk-llVTkfvERmROHuXeH6Z6Tvio2sMIdY36-9__40nchAf81mzvAsRD54-JMlx2s3FRv4Lx9OrVNh5JvgLC4echS3tlma2Sqpu2mi_Ln5FLSZ4PzOxDfVYRw5v19jAMTFwCkDUEodFlnpWUiQa5MJQSlEmmfoXs9m6O-pyMUxUusCKI5NAbrMI3hdQ12AZAMERY08p6xgJnR5rA_4kAUpn89mTWVggdYSSY70HIg'
  },
  {
    id: '7',
    title: 'Modern Glass Villa',
    author: 'LuxArchitect',
    downloads: '540',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA7FpEoCTgGC4tiIKASKvAYcoLpRNVgTcm5nnq7vhoN7xZYNxPA3oU2fm-HYb_19fzkJ7vn1LSGKHqKg5WglLU7eQAVRGHD4NwU05DdcqdcA34C95GvrboAWvTFFd6RDmKrJFyH0hicb5DRLgEjOx3lHmjVnNl560hLtTfFotpb41lQdl5d9mzK8VXEffBoNhu_140z9v53OV8_rIhGsCIlUnUI2dxzGU4svvY6FGSb_DBzIWPbdbEvQZvTFvXC1EMDWqBGlhlLqA'
  }
];

export default function Community() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Gallery Header & Filter Shell */}
      <div className="pt-12 px-8 pb-12 overflow-y-auto custom-scrollbar">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-headline font-extrabold text-4xl lg:text-5xl tracking-tighter text-on-surface mb-2">
              Community <span className="text-secondary">Showcase</span>
            </h1>
            <p className="text-on-surface-variant max-w-xl text-lg">
              Explore and download precision-engineered modular designs from the world's master architects.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-lg text-sm font-semibold border border-outline-variant/20 hover:bg-surface-bright transition-all">
              <Filter className="w-4 h-4 text-secondary" />
              Refine
            </button>
            <div className="flex bg-surface-container-low rounded-lg p-1 border border-outline-variant/10">
              <button className="px-3 py-1.5 rounded-md bg-surface-container-highest text-tertiary text-xs font-bold uppercase tracking-wider">Trending</button>
              <button className="px-3 py-1.5 rounded-md text-on-surface-variant text-xs font-bold uppercase tracking-wider hover:text-on-surface transition-colors">Newest</button>
            </div>
          </div>
        </header>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {GALLERY_ITEMS.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -4 }}
              className={cn(
                "group bg-surface-container-low rounded-[1.5rem] overflow-hidden border border-outline-variant/5 hover:border-tertiary/20 transition-all flex flex-col relative shadow-xl",
                item.featured && "sm:col-span-2 lg:col-span-2 row-span-2 rounded-[2rem]",
                item.vertical && "md:row-span-2"
              )}
            >
              <div className={cn(
                "relative overflow-hidden",
                item.featured ? "h-[400px]" : item.vertical ? "h-full min-h-[300px]" : "h-48"
              )}>
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  src={item.imageUrl} 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/90 via-transparent to-transparent"></div>
                
                {item.featured && (
                  <div className="absolute top-6 left-6">
                    <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Featured Build</span>
                  </div>
                )}
                
                {!item.vertical && (
                  <button className="absolute top-4 right-4 h-8 w-8 bg-surface-container-lowest/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary transition-all group/heart">
                    <Heart className="w-4 h-4 text-white group-hover/heart:fill-current" />
                  </button>
                )}

                {item.vertical && (
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="font-headline font-bold text-xl text-on-surface mb-1">{item.title}</h3>
                    <p className="text-xs text-on-surface-variant mb-4">{item.author}</p>
                    <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold text-sm">Download Specs</button>
                  </div>
                )}
              </div>

              {!item.vertical && (
                <div className={cn("p-5 flex flex-col flex-1", item.featured && "p-8")}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className={cn("font-headline font-bold text-lg text-on-surface mb-1", item.featured && "text-3xl")}>{item.title}</h2>
                      <p className="text-xs text-on-surface-variant font-medium">By <span className="text-tertiary">{item.author}</span></p>
                    </div>
                    {item.featured && (
                      <div className="text-right">
                        <span className="text-2xl font-black text-secondary">{item.downloads}</span>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Downloads</p>
                      </div>
                    )}
                  </div>

                  {item.featured ? (
                    <div className="flex gap-4 mt-auto">
                      <button className="flex-1 bg-secondary text-on-secondary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(255,243,215,0.2)] transition-all">
                        <Download className="w-5 h-5" />
                        Download Blueprint
                      </button>
                      <button className="px-6 bg-surface-container-highest text-on-surface py-4 rounded-xl font-bold hover:bg-surface-bright transition-all border border-outline-variant/20">
                        <Box className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/10">
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-on-surface-variant" />
                        <span className="text-xs font-bold text-on-surface">{item.downloads}</span>
                      </div>
                      <button className="text-tertiary text-xs font-bold hover:underline">View Details</button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Pagination / Load More */}
        <div className="mt-16 flex justify-center pb-12">
          <button className="group flex items-center gap-3 bg-surface-container-high border border-outline-variant/30 px-8 py-4 rounded-full font-bold text-on-surface hover:bg-surface-bright transition-all">
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Initialize More Designs
          </button>
        </div>
      </div>
    </div>
  );
}
