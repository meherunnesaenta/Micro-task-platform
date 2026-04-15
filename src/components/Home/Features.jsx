import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { 
  Briefcase, DollarSign, Users, TrendingUp, 
  Clock, Globe, Zap, Sparkles, ChevronRight
} from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const Features = () => {
  const features = [
    {
      id: 1,
      title: "Easy Micro Tasks",
      description: "Complete simple tasks like data entry, social media engagement, and app testing",
      icon: <Briefcase size={28} />,
      stat: "10,000+ Tasks"
    },
    {
      id: 2,
      title: "Fast Payments",
      description: "Get paid instantly after task approval. Withdraw anytime to your preferred method",
      icon: <DollarSign size={28} />,
      stat: "$500,000+ Paid"
    },
    {
      id: 3,
      title: "Trusted Community",
      description: "Join 50,000+ verified workers and 5,000+ businesses worldwide",
      icon: <Users size={28} />,
      stat: "50,000+ Users"
    },
    {
      id: 4,
      title: "Grow Your Income",
      description: "Earn up to $2000/month with higher-level tasks and bonuses",
      icon: <TrendingUp size={28} />,
      stat: "Up to $2000/mo"
    },
    {
      id: 5,
      title: "24/7 Support",
      description: "Dedicated support team available round the clock to help you",
      icon: <Clock size={28} />,
      stat: "24/7 Available"
    },
    {
      id: 6,
      title: "Global Access",
      description: "Work from anywhere in 190+ countries with no restrictions",
      icon: <Globe size={28} />,
      stat: "190+ Countries"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={14} className="text-primary" />
            <span className="text-primary font-medium text-sm">Why Choose Us</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-3">
            Why Thousands Trust{' '}
            <span className="text-primary">TaskEarn</span>
          </h2>
          
          <p className="text-base-content/60 text-base">
            Join the leading micro-task platform trusted worldwide
          </p>
        </div>

        {/* Features Swiper Carousel - News Headline Style */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          loop={true}
          className="features-swiper pb-12"
        >
          {features.map((feature) => (
            <SwiperSlide key={feature.id}>
              <div className="bg-base-200 rounded-xl p-5 h-full transition-all duration-300 hover:shadow-md">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Title with arrow like news headline */}
                <div className="flex items-start gap-2 mb-2">
                  <ChevronRight size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <h3 className="text-base font-semibold text-base-content">
                    {feature.title}
                  </h3>
                </div>
                
                {/* Description */}
                <p className="text-base-content/60 text-xs mb-3 leading-relaxed pl-5">
                  {feature.description}
                </p>
                
                {/* Stat Badge */}
                <div className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-5">
                  <Zap size={10} />
                  <span>{feature.stat}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx>{`
          :global(.features-swiper .swiper-pagination-bullet) {
            background: #cbd5e1;
            opacity: 1;
          }
          :global(.features-swiper .swiper-pagination-bullet-active) {
            background: #8b5cf6;
          }
          :global(.features-swiper .swiper-pagination) {
            bottom: 0;
          }
        `}</style>
      </div>
    </section>
  );
};

export default Features;