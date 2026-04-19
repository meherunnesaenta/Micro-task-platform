import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroSlider = () => {
  const slides = [
    {
      title: 'Earn Money Completing Micro Tasks',
      subtitle: 'Join thousands of workers earning real money from simple online tasks',
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cta: 'Get Started Now'
    },
    {
      title: 'Post Tasks & Get Results Fast',
      subtitle: 'Hire skilled workers to complete your tasks within hours, not days',
      bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      cta: 'Post Your First Task'
    },
    {
      title: 'Trusted by 10K+ Users',
      subtitle: 'Secure payments, verified workers, and 24/7 platform support',
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      cta: 'Join Platform'
    }
  ];

  return (
    <section className="relative h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div 
              className="h-screen flex items-center justify-center text-white text-center px-4"
              style={{ background: slide.bg }}
            >
              <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-12 drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
                  {slide.subtitle}
                </p>
                <button className="bg-white text-primary px-12 py-4 rounded-full text-xl font-bold hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 shadow-2xl">
                  {slide.cta}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

