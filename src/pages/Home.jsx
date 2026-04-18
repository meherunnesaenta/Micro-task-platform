import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, DollarSign, Users, TrendingUp, PlayCircle, Shield, Sparkles, Star, CheckCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Banner from '../components/Home/Banner';
import Features from '../components/Home/Features';
import TopWorker from '../components/Home/TopWorker';
import PostedTasks from '../components/Home/PostedTasks';

const Home = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockWorkers = [
      { _id: '1', name: 'Sarah Ahmed', coins: 5000, photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
      { _id: '2', name: 'Mohammad Hassan', coins: 4500, photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
      { _id: '3', name: 'Fatima Khan', coins: 4200, photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
      { _id: '4', name: 'Ali Reza', coins: 3800, photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
      { _id: '5', name: 'Aisha Patel', coins: 3500, photoURL: 'https://images.unsplash.com/photo-1517841905240-472988babf7d?w=200&h=200&fit=crop' },
      { _id: '6', name: 'Omar Ibrahim', coins: 3200, photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop' },
    ];
    setWorkers(mockWorkers);
    setLoading(false);
  }, []);

  const testimonials = [
    { name: 'Kamala Sharma', role: 'Top Earner', text: 'This platform changed my life! I earn $500+ every month just by completing simple tasks.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', rating: 5 },
    { name: 'Rajesh Kumar', role: 'Business Owner', text: 'Great service! I found quality workers who completed my tasks perfectly on time.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', rating: 5 },
    { name: 'Priya Desai', role: 'Content Creator', text: 'Earning has never been so easy! Highly recommended for anyone looking for extra income.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', rating: 5 },
    { name: 'Vikram Singh', role: 'Entrepreneur', text: 'The platform is reliable, secure, and payments are quick. Excellent experience!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', rating: 5 },
  ];

  const stats = [
    { icon: <Users size={24} />, value: '50K+', label: 'Active Users' },
    { icon: <Briefcase size={24} />, value: '100K+', label: 'Tasks Completed' },
    { icon: <DollarSign size={24} />, value: '$2M+', label: 'Total Earnings' },
    { icon: <TrendingUp size={24} />, value: '190+', label: 'Countries' },
  ];

  const steps = [
    { number: '01', title: 'Sign Up', description: 'Create your account as a Worker or Buyer in seconds', icon: <Users size={28} /> },
    { number: '02', title: 'Browse or Post', description: 'Browse available tasks or post your own task', icon: <Briefcase size={28} /> },
    { number: '03', title: 'Complete & Review', description: 'Complete tasks or review submissions from workers', icon: <CheckCircle size={28} /> },
    { number: '04', title: 'Get Paid', description: 'Receive instant payments for approved work', icon: <DollarSign size={28} /> },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section>
        <Banner />
      </section>

      {/* Posted Tasks Section */}
      <PostedTasks />

      {/* Features Section */}
      <section className="py-16">
        <Features />
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-base-100">
        <div className="container-modern">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
              <PlayCircle size={14} className="text-primary" />
              <span className="text-primary font-medium text-sm">Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-3">
              How <span className="text-primary">It Works</span>
            </h2>
            <p className="text-base-content/60">Get started in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center p-6 bg-base-200 rounded-xl hover:shadow-md transition-all">
                <div className="relative w-16 h-16 mx-auto bg-primary rounded-xl flex items-center justify-center text-white mb-4">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-base-content mb-2">{step.title}</h3>
                <p className="text-sm text-base-content/60">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Workers Section */}
      <section className="py-16">
        <TopWorker />
      </section>



      {/* Testimonials Section */}
      <section className="py-16 bg-base-100">
        <div className="container-modern">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
              <Star size={14} className="text-primary" />
              <span className="text-primary font-medium text-sm">Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-3">
              What Our <span className="text-primary">Users Say</span>
            </h2>
            <p className="text-base-content/60">Join thousands of satisfied users</p>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-12"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-base-200 rounded-xl p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-base-content/70 text-sm leading-relaxed mb-5 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-base-content">{testimonial.name}</p>
                      <p className="text-xs text-primary">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container-modern text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Start Earning?</h2>
          <p className="text-white/80 mb-6">Join thousands of users already making money on TaskEarn</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-full font-semibold hover:shadow-lg transition-all">
            Get Started Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;