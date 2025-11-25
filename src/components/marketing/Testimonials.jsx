import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Fashion Blogger',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            rating: 5,
            text: 'TEEZI has the best quality t-shirts I\'ve ever owned. The fabric is soft, durable, and the fit is perfect!'
        },
        {
            name: 'Michael Chen',
            role: 'Graphic Designer',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            rating: 5,
            text: 'Love the custom design feature! I created my own tee and it turned out exactly as I imagined. Highly recommend!'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Student',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
            rating: 5,
            text: 'Fast shipping, great prices, and amazing customer service. TEEZI is now my go-to for all my t-shirt needs!'
        }
    ];

    return (
        <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 animate-slide-up">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Join thousands of happy customers who love their TEEZI products
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="card p-6 hover-lift animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <Quote className="w-8 h-8 text-primary mb-4 opacity-50" />

                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>

                            <div className="flex items-center gap-3">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
