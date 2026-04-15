import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/home.css';

const Home = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for top workers
    const mockWorkers = [
      {
        _id: '1',
        name: 'Sarah Ahmed',
        coins: 5000,
        photoURL:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      },
      {
        _id: '2',
        name: 'Mohammad Hassan',
        coins: 4500,
        photoURL:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      },
      {
        _id: '3',
        name: 'Fatima Khan',
        coins: 4200,
        photoURL:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      },
      {
        _id: '4',
        name: 'Ali Reza',
        coins: 3800,
        photoURL:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      },
      {
        _id: '5',
        name: 'Aisha Patel',
        coins: 3500,
        photoURL:
          'https://images.unsplash.com/photo-1517841905240-472988babf7d?w=200&h=200&fit=crop',
      },
      {
        _id: '6',
        name: 'Omar Ibrahim',
        coins: 3200,
        photoURL:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
      },
    ];
    setWorkers(mockWorkers);
    setLoading(false);
  }, []);

  const banners = [
    {
      id: 1,
      title: 'Earn Money by Completing Tasks',
      subtitle: 'Complete simple tasks and earn instantly',
      cta: 'Get Started as Worker',
      gradient: 'from-blue-600 to-blue-800',
    },
    {
      id: 2,
      title: 'Hire Workers for Your Tasks',
      subtitle: 'Post your tasks and get them done by our workers',
      cta: 'Post a Task as Buyer',
      gradient: 'from-purple-600 to-purple-800',
    },
    {
      id: 3,
      title: 'Trusted by Thousands',
      subtitle: 'Join a community of content creators and workers',
      cta: 'Join Our Community',
      gradient: 'from-pink-600 to-pink-800',
    },
  ];

  const testimonials = [
    {
      name: 'Kamala Sharma',
      role: 'Freelancer',
      text: 'This platform changed my life! I earn $500+ every month just by completing simple tasks.',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Business Owner',
      text: 'Great service! I found quality workers who completed my tasks perfectly on time.',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    {
      name: 'Priya Desai',
      role: 'Content Creator',
      text: 'Earning has never been so easy! Highly recommended for anyone looking for extra income.',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    {
      name: 'Vikram Singh',
      role: 'Entrepreneur',
      text: 'The platform is reliable, secure, and payments are quick. Excellent experience!',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
  ];

  return (
    <div className="home">
      {/* Hero Section with Banner Slider */}
      <section className="hero-section">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="banner-slider"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className={`banner bg-gradient-to-r ${banner.gradient}`}>
                <div className="banner-content">
                  <h1 className="banner-title">{banner.title}</h1>
                  <p className="banner-subtitle">{banner.subtitle}</p>
                  <Link to="/register" className="banner-cta">
                    {banner.cta}
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Why Choose MicroTask?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Briefcase size={32} />
              </div>
              <h3>Easy Tasks</h3>
              <p>Simple and straightforward tasks that anyone can complete</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <DollarSign size={32} />
              </div>
              <h3>Fast Payments</h3>
              <p>Get paid instantly for completed and approved tasks</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Trusted Community</h3>
              <p>Join thousands of workers and buyers on our platform</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Grow Your Income</h3>
              <p>Earn more as you complete more tasks and build reputation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Workers Section */}
      <section className="workers-section">
        <div className="section-container">
          <h2 className="section-title">🌟 Top Earners</h2>
          <p className="section-subtitle">Meet our most successful workers</p>
          {loading ? (
            <div className="loading">Loading top workers...</div>
          ) : (
            <div className="workers-grid">
              {workers.map((worker, index) => (
                <div key={worker._id} className="worker-card">
                  <div className="worker-rank">#{index + 1}</div>
                  <img
                    src={worker.photoURL}
                    alt={worker.name}
                    className="worker-avatar"
                  />
                  <h3 className="worker-name">{worker.name}</h3>
                  <p className="worker-coins">
                    <span>🪙</span> {worker.coins.toLocaleString()} coins
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <h2 className="section-title">What Our Users Say</h2>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="testimonials-slider"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="testimonial-card">
                  <div className="stars">★★★★★</div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="author-avatar"
                    />
                    <div>
                      <p className="author-name">{testimonial.name}</p>
                      <p className="author-role">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your account as a Worker or Buyer in seconds</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Browse or Post</h3>
              <p>
                Browse available tasks or post your own task for workers
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Complete & Review</h3>
              <p>Complete tasks or review submissions from workers</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Get Paid</h3>
              <p>Receive instant payments for approved work</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Earning?</h2>
          <p>Join thousands of workers making money on MicroTask Platform</p>
          <div className="cta-buttons">
            <Link to="/register?role=worker" className="cta-btn primary">
              Become a Worker
            </Link>
            <Link to="/register?role=buyer" className="cta-btn secondary">
              Become a Buyer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
