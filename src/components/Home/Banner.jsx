import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Swiper CSS import
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Link } from 'react-router-dom';

const Banner = () => {
  const banners = [
    {
      id: 1,
      title: "Earn Money by Completing",
      highlight: "Micro Tasks",
      subtitle: "Start earning today with simple tasks starting from $0.50",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600",
      buttonText: "Start Earning",
      buttonLink: "/register"
    },
    {
      id: 2,
      title: "Post Tasks & Get",
      highlight: "Quality Work Done",
      subtitle: "Get your tasks completed by verified workers within hours",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600",
      buttonText: "Post a Task",
      buttonLink: "/dashboard/buyer/add-task"
    },
    {
      id: 3,
      title: "Join 10,000+",
      highlight: "Active Earners",
      subtitle: "Your skills can earn you real money. No experience needed!",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600",
      buttonText: "Join Now",
      buttonLink: "/register"
    }
  ];

  return (
    <div className="relative w-full h-screen max-h-[600px] md:max-h-[650px] lg:max-h-[700px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-custom-bullet',
          bulletActiveClass: 'swiper-custom-bullet-active',
        }}
        navigation={{
          nextEl: '.banner-next',
          prevEl: '.banner-prev',
        }}
        loop={true}
        className="w-full h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${banner.image})` }}
              />
              
              {/* Dark Overlay for readability */}
              <div className="absolute inset-0 bg-black/50" />
              
              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-base-100 leading-tight mb-4">
                      {banner.title}{' '}
                      <span className="text-primary inline-block">
                        {banner.highlight}
                      </span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-base-100/90 mb-6 md:mb-8 leading-relaxed">
                      {banner.subtitle}
                    </p>
                    <Link
                      href={banner.buttonLink}
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-content font-semibold px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg transition-all duration-200 hover:gap-3 hover:scale-105"
                    >
                      {banner.buttonText}
                      <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button 
        className="banner-prev absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-base-100/20 hover:bg-base-100/40 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-base-100" />
      </button>
      
      <button 
        className="banner-next absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-base-100/20 hover:bg-base-100/40 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-base-100" />
      </button>

      {/* Custom Pagination Styles */}
      <style jsx>{`
        :global(.swiper-custom-bullet) {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          margin: 0 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        :global(.swiper-custom-bullet-active) {
          background: #8b5cf6;
          width: 24px;
          border-radius: 4px;
        }
        
        :global(.swiper-pagination) {
          bottom: 20px !important;
          z-index: 20;
        }
        
        @media (min-width: 768px) {
          :global(.swiper-custom-bullet) {
            width: 10px;
            height: 10px;
            margin: 0 8px;
          }
          :global(.swiper-custom-bullet-active) {
            width: 28px;
          }
          :global(.swiper-pagination) {
            bottom: 30px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Banner;