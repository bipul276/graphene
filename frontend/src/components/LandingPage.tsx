import { Shield, Lock, Eye, FileCheck, CheckCircle2, ArrowRight, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react'; // if using framer-motion v10, replace with: 'framer-motion'

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* ACT 1: THE HOOK - Above the Fold Hero */}
      <section
        className="relative bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#3949AB] overflow-hidden"
        aria-labelledby="hero-heading"
        role="banner"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full"
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-40 right-20 w-3 h-3 bg-[#4CAF50]/30 rounded-full"
            animate={{ y: [0, -30, 0], x: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="absolute bottom-32 left-1/4 w-1 h-1 bg-white/30 rounded-full"
            animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Value Proposition */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.div
                className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 cursor-default"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Shield className="h-5 w-5 text-white mr-2" />
                <span className="text-white font-medium font-cta">Unbreakable. Verifiable. Trusted.</span>
              </motion.div>

              <motion.h1
                id="hero-heading"
                className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-brand"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Blockchain-Verified
                <motion.span
                  className="block text-[#4CAF50] font-brand"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Digital Certificates
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl text-blue-100 mb-8 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Secure, tamper-proof digital credentials that institutions trust and employers verify instantly.
                Built on unbreakable blockchain technology.
              </motion.p>

              {/* Primary CTA */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <Button
                    onClick={() => onNavigate('verify')}
                    size="lg"
                    className="bg-[#4CAF50] hover:bg-[#43A047] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all group"
                  >
                    Verify Certificate Now
                    <motion.div className="inline-block ml-2" animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <Button
                    onClick={() => onNavigate('register')}
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-[#1A237E] px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                  >
                    Register Institution
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div className="relative" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-[#1A237E]/20 to-transparent rounded-2xl"
                animate={{
                  background: [
                    'linear-gradient(to top, rgba(26, 35, 126, 0.2) 0%, transparent 100%)',
                    'linear-gradient(to top, rgba(26, 35, 126, 0.3) 0%, transparent 100%)',
                    'linear-gradient(to top, rgba(26, 35, 126, 0.2) 0%, transparent 100%)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div whileHover={{ scale: 1.02, rotateY: 5 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1664792417230-7dd9485abdf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwc2VjdXJpdHklMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NzMyMDg4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Blockchain Security Technology"
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                />
              </motion.div>

              {/* Floating Trust Badge */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl cursor-default"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="bg-[#4CAF50] rounded-full p-2"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(76, 175, 80, 0.7)',
                        '0 0 0 10px rgba(76, 175, 80, 0)',
                        '0 0 0 0 rgba(76, 175, 80, 0)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <div className="font-semibold text-[#1A237E]">Blockchain Verified</div>
                    <div className="text-sm text-gray-600">100% Tamper-Proof</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ACT 2: THE PROCESS - How We Deliver */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center bg-[#1A237E]/10 rounded-full px-6 py-2 mb-6 cursor-default"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(26, 35, 126, 0.15)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className="text-[#1A237E] font-semibold">How It Works</span>
            </motion.div>
            <motion.h2
              className="text-4xl font-bold text-[#1A237E] mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Three Steps to Unbreakable Trust
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Our streamlined process ensures maximum security with minimal effort. Every certificate becomes an immutable part of the blockchain.
            </motion.p>
          </motion.div>

          {/* Three Process Steps */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <motion.div
              className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#1A237E] to-[#4CAF50]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />

            {/* Step 1: Issue */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="h-full"
            >
              <Card className="relative bg-gradient-to-br from-[#1A237E] to-[#283593] text-white border-0 shadow-xl hover:shadow-2xl transition-all group h-full flex flex-col">
                <CardContent className="p-8 text-center flex flex-col h-full">
                  <motion.div className="absolute -top-6 left-1/2 transform -translate-x-1/2" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="bg-[#4CAF50] rounded-full p-4 w-12 h-12 flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center mt-6"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)', rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <FileCheck className="h-10 w-10 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-4">Issue Certificates</h3>
                  <p className="text-blue-100 leading-relaxed mb-6 flex-grow">
                    Institutions create and issue digital certificates through our secure platform. Each certificate receives a unique blockchain identifier.
                  </p>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="mt-auto">
                    <Button
                      onClick={() => onNavigate('issue')}
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-[#1A237E] font-semibold transition-all duration-300"
                    >
                      Start Issuing
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 2: Store */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="h-full"
            >
              <Card className="relative bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] text-white border-0 shadow-xl hover:shadow-2xl transition-all group h-full flex flex-col">
                <CardContent className="p-8 text-center flex flex-col h-full">
                  <motion.div className="absolute -top-6 left-1/2 transform -translate-x-1/2" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="bg-[#1A237E] rounded-full p-4 w-12 h-12 flex items-center justify-center">
                      <span className="text-white font-bold">2</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center mt-6"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                    animate={{ rotateY: [0, 360] }}
                    transition={{ rotateY: { duration: 8, repeat: Infinity, ease: 'linear' }, scale: { type: 'spring', stiffness: 300, damping: 20 } }}
                  >
                    <Lock className="h-10 w-10 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-4">Blockchain Storage</h3>
                  <p className="text-green-100 leading-relaxed mb-6 flex-grow">
                    Certificates are cryptographically secured and permanently stored on the blockchain, making them impossible to alter or delete.
                  </p>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="mt-auto">
                    <Button
                      onClick={() => onNavigate('ledger')}
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-[#4CAF50] font-semibold transition-all duration-300"
                    >
                      View Ledger
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 3: Verify */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="h-full"
            >
              <Card className="relative bg-gradient-to-br from-[#FF9800] to-[#FFB74D] text-white border-0 shadow-xl hover:shadow-2xl transition-all group h-full flex flex-col">
                <CardContent className="p-8 text-center flex flex-col h-full">
                  <motion.div className="absolute -top-6 left-1/2 transform -translate-x-1/2" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="bg-[#1A237E] rounded-full p-4 w-12 h-12 flex items-center justify-center">
                      <span className="text-white font-bold">3</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center mt-6"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)', transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
                  >
                    <Eye className="h-10 w-10 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-4">Instant Verification</h3>
                  <p className="text-orange-100 leading-relaxed mb-6 flex-grow">
                    Anyone can verify certificate authenticity instantly by checking against our public blockchain registry. No intermediaries required.
                  </p>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="mt-auto">
                    <Button
                      onClick={() => onNavigate('verify')}
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-[#FF9800] font-semibold transition-all duration-300"
                    >
                      Verify Now
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ACT 3: THE PROOF - Security & Guarantees */}
      <section className="py-24 bg-[#F4F6F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-[#4CAF50]/10 rounded-full px-6 py-2 mb-6">
              <span className="text-[#4CAF50] font-semibold">Enterprise Security</span>
            </div>
            <h2 className="text-4xl font-bold text-[#1A237E] mb-6">Built for Trust from Day One</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge security, industry compliance, and early adopter benefits to deliver uncompromising certificate protection.
            </p>
          </div>

          {/* Three Security Pillars */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16 items-stretch">
            {/* Enterprise Security */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="h-full"
            >
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                <CardContent className="p-8 text-center flex flex-col h-full">
                  <motion.div className="bg-[#1A237E] rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <Shield className="h-10 w-10 text-white" />
                  </motion.div>
                  <div className="text-2xl font-bold text-[#1A237E] mb-3">Bank-Grade Security</div>
                  <div className="text-lg font-semibold text-gray-700 mb-4">AES-256 Encryption</div>
                  <p className="text-gray-600 mb-6 flex-grow">
                    Military-grade encryption, multi-signature validation, and immutable blockchain storage protect your certificates against any form of tampering.
                  </p>
                  <div className="space-y-2 text-sm text-left mt-auto">
                    {['ISO 27001 Compliant', 'SOC 2 Type II Certified', 'GDPR Compliant'].map((item, index) => (
                      <motion.div
                        key={item}
                        className="flex items-center text-[#4CAF50]"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Blockchain Technology */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="h-full"
            >
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                <CardContent className="p-8 text-center flex flex-col h-full">
                  <motion.div
                    className="bg-[#4CAF50] rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(76, 175, 80, 0.4)' }}
                    animate={{ boxShadow: ['0 0 0px rgba(76, 175, 80, 0.2)', '0 0 20px rgba(76, 175, 80, 0.4)', '0 0 0px rgba(76, 175, 80, 0.2)'] }}
                    transition={{ boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, scale: { type: 'spring', stiffness: 300, damping: 20 } }}
                  >
                    <Lock className="h-10 w-10 text-white" />
                  </motion.div>
                  <div className="text-2xl font-bold text-[#4CAF50] mb-3">Immutable Ledger</div>
                  <div className="text-lg font-semibold text-gray-700 mb-4">Blockchain Verified</div>
                  <p className="text-gray-600 mb-6 flex-grow">
                    Every certificate is cryptographically secured on a distributed blockchain, making fraud detection instantaneous and forgery impossible.
                  </p>
                  <div className="space-y-2 text-sm text-left mt-auto">
                    {['Ethereum-based security', 'Smart contract validation', 'Public verification'].map((item, index) => (
                      <motion.div
                        key={item}
                        className="flex items-center text-[#4CAF50]"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Early Adopter Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="h-full"
            >
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                <CardContent className="p-8 text-center flex flex-col h-full">
                  <motion.div
                    className="bg-[#FF9800] rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, rotate: { duration: 0.5 } }}
                  >
                    <Award className="h-10 w-10 text-white" />
                  </motion.div>
                  <div className="text-2xl font-bold text-[#FF9800] mb-3">Founding Members</div>
                  <div className="text-lg font-semibold text-gray-700 mb-4">Exclusive Benefits</div>
                  <p className="text-gray-600 mb-6 flex-grow">
                    Be among the first institutions to secure your place in the future of digital credentials with special founding member privileges.
                  </p>
                  <div className="space-y-2 text-sm text-left mt-auto">
                    {['50% off first year', 'Priority support access', 'Custom integration help'].map((item, index) => (
                      <motion.div
                        key={item}
                        className="flex items-center text-[#4CAF50]"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Platform Guarantees */}
          <div className="bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-2xl p-12 text-white mb-16">
            <div className="text-center mb-12">
              <h3 id="guarantees-heading" className="text-3xl font-bold mb-4">
                Our Commitment to You
              </h3>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                We stand behind our platform with iron-clad guarantees that protect your institution and your graduates.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8" role="region" aria-labelledby="guarantees-heading">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#4CAF50] mb-2 font-data" aria-label="99.9 percent">
                  99.9%
                </div>
                <div className="text-lg font-semibold mb-3">Uptime SLA</div>
                <p className="text-blue-100 text-sm">
                  Enterprise-grade infrastructure ensures your certificates are always accessible with guaranteed uptime.
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-[#4CAF50] mb-2 font-data" aria-label="24 hours, 7 days a week">
                  24/7
                </div>
                <div className="text-lg font-semibold mb-3">Expert Support</div>
                <p className="text-blue-100 text-sm">Our blockchain security experts are available around the clock to ensure seamless operation.</p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-[#4CAF50] mb-2 font-data" aria-label="1 million dollars">
                  $1M
                </div>
                <div className="text-lg font-semibold mb-3">Security Insurance</div>
                <p className="text-blue-100 text-sm">Comprehensive cybersecurity insurance protects against any potential security breaches.</p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <motion.div className="text-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <motion.div
              className="bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-2xl p-12 text-white relative overflow-hidden"
              whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
            >
              {/* Background animation particles */}
              <motion.div className="absolute top-4 right-4 w-4 h-4 bg-white/20 rounded-full" animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.div
                className="absolute bottom-8 left-8 w-3 h-3 bg-[#4CAF50]/30 rounded-full"
                animate={{ y: [0, -15, 0], x: [0, 10, 0], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />

              <motion.h3 className="text-3xl font-bold mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                Ready to Make Your Credentials Unbreakable?
              </motion.h3>
              <motion.p
                className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Join the future of verified digital credentials. Start issuing tamper-proof certificates today.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <Button
                    onClick={() => onNavigate('register')}
                    size="lg"
                    className="bg-[#4CAF50] hover:bg-[#43A047] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all group"
                  >
                    Get Started Now
                    <motion.div className="inline-block ml-2" animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <Button
                    onClick={() => onNavigate('verify')}
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-[#1A237E] px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                  >
                    Try Verification Demo
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
