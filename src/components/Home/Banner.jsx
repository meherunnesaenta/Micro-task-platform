import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp, Briefcase, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

// Swiper CSS import
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const Banner = () => {
  const banners = [
    {
      id: 1,
      title: "Earn Money by Completing",
      highlight: "Micro Tasks",
      subtitle: "Start earning today with simple tasks starting from $0.50",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600",
      buttonText: "Start Earning",
      buttonLink: "/register",
      icon: <TrendingUp size={24} />
    },
    {
      id: 2,
      title: "Post Tasks & Get",
      highlight: "Quality Work Done",
      subtitle: "Get your tasks completed by verified workers within hours",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600",
      buttonText: "Post a Task",
      buttonLink: "/dashboard/buyer/add-task",
      icon: <Briefcase size={24} />
    },
    {
      id: 3,
      title: "Join 10,000+",
      highlight: "Active Earners",
      subtitle: "Your skills can earn you real money. No experience needed!",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600",
      buttonText: "Join Now",
      buttonLink: "/register",
      icon: <Users size={24} />
    }
  ];

  return (
    <div className="relative w-full h-screen max-h-[600px] md:max-h-[650px] lg:max-h-[700px] overflow-hidden hero-gradient">
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
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full">
              {/* Background Image with Overlay Gradient */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-10000"
                style={{ 
                  backgroundImage: `url(${banner.image})`,
                  animation: 'scaleSlow 20s ease-in-out infinite alternate'
                }}
              />
              
              {/* Modern Gradient Overlay - No over-gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-base-100/90 via-base-100/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-base-100/40 to-transparent" />
              
              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container-modern">
                  <div className="max-w-2xl animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                    {/* Icon Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm mb-4 md:mb-6">
                      <span className="text-primary">{banner.icon}</span>
                      <span className="text-sm font-medium text-primary">New Opportunity</span>
                    </div>
                    
                    {/* Heading */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-base-content leading-tight mb-4 md:mb-6">
                      {banner.title}{' '}
                      <span className="text-gradient inline-block">
                        {banner.highlight}
                      </span>
                    </h1>
                    
                    {/* Subtitle */}
                    <p className="text-base sm:text-lg md:text-xl text-base-content/80 mb-6 md:mb-8 leading-relaxed max-w-xl">
                      {banner.subtitle}
                    </p>
                    
                    {/* CTA Button */}
                    <Link
                      to={banner.buttonLink}
                      className="btn-gradient inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-field font-semibold text-base sm:text-lg group"
                    >
                      {banner.buttonText}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    
                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-6 mt-8 md:mt-12 pt-4 border-t border-base-200/30">
                      <div>
                        <p className="text-2xl font-bold text-gradient">10K+</p>
                        <p className="text-xs opacity-60">Active Workers</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gradient">50K+</p>
                        <p className="text-xs opacity-60">Tasks Completed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gradient">$100K+</p>
                        <p className="text-xs opacity-60">Total Earnings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons - Glass Morphism */}
      <button 
        className="banner-prev absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-panel hover:glass-panel-dark flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-base-content group-hover:text-primary transition-colors" />
      </button>
      
      <button 
        className="banner-next absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-panel hover:glass-panel-dark flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-base-content group-hover:text-primary transition-colors" />
      </button>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-bounce-subtle hidden sm:block">
        <div className="w-6 h-10 rounded-full border-2 border-base-content/30 flex justify-center">
          <div className="w-1 h-2 bg-primary rounded-full mt-2 animate-float-3d"></div>
        </div>
      </div>

      <style>{`
        @keyframes scaleSlow {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        
        .duration-10000 {
          transition-duration: 10000ms;
        }
        
        .swiper-custom-bullet {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          margin: 0 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .swiper-custom-bullet-active {
          background: var(--color-primary);
          width: 24px;
          border-radius: 4px;
        }
        
        .swiper-pagination {
          bottom: 24px !important;
          z-index: 20;
        }
        
        @media (min-width: 768px) {
          .swiper-custom-bullet {
            width: 10px;
            height: 10px;
            margin: 0 8px;
          }
          .swiper-custom-bullet-active {
            width: 28px;
          }
          .swiper-pagination {
            bottom: 32px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Banner;