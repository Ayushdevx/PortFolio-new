import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Check, 
  X, 
  ArrowRight, 
  Sparkles,
  Zap 
} from 'lucide-react';
import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAIL_JS_CONFIG = {
  SERVICE_ID: 'service_gp272dm',
  TEMPLATE_ID: 'template_w7cq9j3',
  PUBLIC_KEY: 'YBoU9qAHvzemSVljd6'
};

// Initialize EmailJS with your public key
emailjs.init(EMAIL_JS_CONFIG.PUBLIC_KEY);

// Animated Background Component
const AnimatedBackground = () => (
  <motion.div 
    className="absolute inset-0 overflow-hidden -z-10"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-purple-500/10 rounded-full"
        style={{
          width: `${Math.random() * 100 + 50}px`,
          height: `${Math.random() * 100 + 50}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          repeatType: 'mirror'
        }}
      />
    ))}
  </motion.div>
);

export default function EnhancedContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Input validation state
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    email: false,
    message: false
  });

  // Reset submit status after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submitStatus !== 'idle') {
      timer = setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [submitStatus]);

  // Validate inputs
  const validateInput = () => {
    const errors = {
      name: formData.name.trim().length < 2,
      email: !/\S+@\S+\.\S+/.test(formData.email),
      message: formData.message.trim().length < 10
    };
    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when typing
    setValidationErrors(prev => ({
      ...prev,
      [name]: false
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submission
    if (!validateInput()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAIL_JS_CONFIG.SERVICE_ID, 
        EMAIL_JS_CONFIG.TEMPLATE_ID, 
        templateParams
      );

      console.log('Email sent successfully', response);
      
      // Set success status
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      formRef.current?.reset();
    } catch (error) {
      console.error('Email send failed', error);
      setSubmitStatus('error');
    }
    
    // Reset submitting state
    setIsSubmitting(false);
  };

  return (
    <section 
      id="contact" 
      className="relative py-24 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] overflow-hidden"
    >
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with Dynamic Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 10 
          }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-4">
            <Sparkles className="text-purple-400 animate-pulse" />
            Get in Touch
            <Zap className="text-pink-400 animate-bounce" />
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Ready to transform your ideas into reality? Let's collaborate!
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100 
            }}
            className="space-y-6 bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20"
          >
            <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-purple-500" />
              Contact Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-purple-500" />
                <a 
                  href="mailto:ayushdevxai@gmail.com" 
                  className="text-gray-300 hover:text-white transition-colors group"
                >
                  ayushdevxai@gmail.com
                  <span className="block h-0.5 bg-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <MessageSquare className="w-6 h-6 text-purple-500" />
                <span className="text-gray-300">
                  Available for freelance opportunities
                </span>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100 
            }}
            className="space-y-6 bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20"
          >
            {/* Name Input */}
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`
                    block w-full rounded-md bg-gray-800 border-2 text-white 
                    ${validationErrors.name 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-700 focus:border-purple-500'}
                    focus:ring-purple-500 transition-all duration-300
                  `}
                />
                {validationErrors.name && (
                  <X className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
                )}
              </div>
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">
                  Name must be at least 2 characters long
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`
                    block w-full rounded-md bg-gray-800 border-2 text-white 
                    ${validationErrors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-700 focus:border-purple-500'}
                    focus:ring-purple-500 transition-all duration-300
                  `}
                />
                {validationErrors.email && (
                  <X className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
                )}
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* Message Input */}
            <div>
              <label 
                htmlFor="message" 
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Message
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className={`
                    block w-full rounded-md bg-gray-800 border-2 text-white 
                    ${validationErrors.message 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-700 focus:border-purple-500'}
                    focus:ring-purple-500 transition-all duration-300
                  `}
                ></textarea>
                {validationErrors.message && (
                  <X className="absolute right-3 top-3 text-red-500" />
                )}
              </div>
              {validationErrors.message && (
                <p className="text-red-500 text-sm mt-1">
                  Message must be at least 10 characters long
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                w-full flex items-center justify-center px-4 py-3 
                border border-transparent rounded-xl shadow-lg 
                text-base font-medium text-white 
                bg-gradient-to-r from-purple-600 to-pink-600 
                hover:from-purple-700 hover:to-pink-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-purple-500 disabled:opacity-50 
                transition-all duration-300 group
              "
            >
              {isSubmitting ? (
                <>
                  Sending 
                  <div className="ml-2 animate-spin">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </>
              ) : (
                <>
                  Send Message
                  <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>

            {/* Submission Status Messages */}
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center text-green-500 space-x-2"
                >
                  <Check className="w-5 h-5" />
                  <span>Message sent successfully!</span>
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center text-red-500 space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Failed to send message. Please try again.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </section>
  );
}