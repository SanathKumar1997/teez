import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

const HeroBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: 'Premium Round Neck Tees',
            subtitle: 'Comfort Meets Style',
            description: 'Experience ultimate comfort with our premium cotton t-shirts',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=600&fit=crop&q=80',
            cta: 'Shop Now',
            bgColor: 'from-blue-600 to-purple-600'
        },
        {
            id: 2,
            title: 'Classic Collection',
            subtitle: 'Timeless Designs',
            description: 'Discover our handpicked collection of essential tees',
            image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&h=600&fit=crop&q=80',
            cta: 'Explore',
            bgColor: 'from-teal-500 to-cyan-600'
        },
        {
            id: 3,
            title: 'Express Yourself',
            subtitle: 'Unique Prints & Designs',
            description: 'Stand out with our exclusive graphic tees',
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=600&fit=crop&q=80',
            cta: 'View Collection',
            bgColor: 'from-orange-500 to-red-600'
        },
        {
            id: 4,
            title: 'New Arrivals',
            subtitle: 'Fresh Styles Daily',
            description: 'Check out the latest additions to our collection',
            image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1200&h=600&fit=crop&q=80',
            cta: 'Shop New',
            bgColor: 'from-green-500 to-emerald-600'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Auto-advance every 5 seconds

        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-70`}></div>
                        <div className="absolute inset-0 bg-black opacity-20"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full container mx-auto px-4 flex items-center">
                        <div className="max-w-2xl text-white">
                            <div className="animate-slide-up">
                                <p className="text-sm md:text-base font-semibold mb-2 tracking-wider uppercase opacity-90">
                                    {slide.subtitle}
                                </p>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                                    {slide.title}
                                </h1>
                                <p className="text-lg md:text-xl mb-8 opacity-90 max-w-xl">
                                    {slide.description}
                                </p>
                                <Link
                                    to="/catalog"
                                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    {slide.cta}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all z-10"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all z-10"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroBanner;
