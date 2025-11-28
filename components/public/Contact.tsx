'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Github, Linkedin, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { contactFormSchema, type ContactFormData } from '@/lib/validations';
import GlassCard from '@/components/effects/GlassCard';

// ==================== Animation Variants ====================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// ==================== Component ====================

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      toast.success('Message sent successfully!', {
        description: "I'll get back to you as soon as possible.",
      });
      reset();
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('ridamchhapiya5@gmail.com');
    setCopiedEmail(true);
    toast.success('Email copied to clipboard');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have a project in mind or just want to say hi? I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-8">
              <GlassCard className="p-8 space-y-8">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>

                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <a
                        href="mailto:ridamchhapiya5@gmail.com"
                        className="text-white hover:text-cyan-400 transition-colors font-medium"
                      >
                        ridamchhapiya5@gmail.com
                      </a>
                      <button
                        onClick={copyEmail}
                        className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        aria-label="Copy email"
                      >
                        {copiedEmail ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 group">
                  <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Location</p>
                    <p className="text-white font-medium">Pune, India</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-8 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-4">Connect with me</p>
                  <div className="flex gap-4">
                    <a
                      href="https://github.com/ridamchhapiya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white hover:text-cyan-400 transition-all hover:scale-110"
                      aria-label="GitHub"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                    <a
                      href="https://linkedin.com/in/ridamchhapiya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white hover:text-cyan-400 transition-all hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <GlassCard className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-300">
                        Name
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        id="name"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all text-white placeholder-gray-500"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-400">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-300">
                        Email
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all text-white placeholder-gray-500"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                      Subject
                    </label>
                    <input
                      {...register('subject')}
                      type="text"
                      id="subject"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all text-white placeholder-gray-500"
                      placeholder="Project Inquiry"
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-400">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-300">
                      Message
                    </label>
                    <textarea
                      {...register('message')}
                      id="message"
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all text-white placeholder-gray-500 resize-none"
                      placeholder="Tell me about your project..."
                    />
                    {errors.message && (
                      <p className="text-xs text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
