import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { FaMoneyBillWave, FaUsers, FaLock, FaChartLine } from 'react-icons/fa';

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Grow Your Wealth with Crypto Investments
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of investors earning passive income through our secure
              investment platform with guaranteed returns.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-primary font-semibold rounded-md hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border border-white text-white font-semibold rounded-md hover:bg-white hover:bg-opacity-10 transition"
              >
                Login to Account
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="mt-4 text-xl text-gray-600">
              InvestPro offers the best investment experience with top-notch features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                <FaMoneyBillWave />
              </div>
              <h3 className="text-xl font-semibold mb-2">High Returns</h3>
              <p className="text-gray-600">
                Earn up to 25% ROI on your investments with our proven strategies.
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                <FaUsers />
              </div>
              <h3 className="text-xl font-semibold mb-2">Referral Program</h3>
              <p className="text-gray-600">
                Earn 5% commission on investments made by users you refer.
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                <FaLock />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Your investments are secure with our advanced security measures.
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparent Growth</h3>
              <p className="text-gray-600">
                Track your investments and earnings in real-time on your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Investment Plans */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Investment Plans</h2>
            <p className="mt-4 text-xl text-gray-600">
              Choose the plan that best fits your investment goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-primary-light p-6 text-center">
                <h3 className="text-2xl font-bold text-primary">Bronze</h3>
                <p className="text-gray-600 mt-1">For beginners</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-primary">5%</p>
                  <p className="text-gray-600">Return on Investment</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex justify-between">
                    <span>Minimum Investment</span>
                    <span className="font-semibold">$3</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Maximum Investment</span>
                    <span className="font-semibold">$10</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-semibold">1 day</span>
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="btn btn-primary w-full text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden relative transform scale-105 z-10">
              <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-semibold">
                Popular
              </div>
              <div className="bg-primary p-6 text-center">
                <h3 className="text-2xl font-bold text-white">Gold</h3>
                <p className="text-white text-opacity-80 mt-1">For serious investors</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-primary">10%</p>
                  <p className="text-gray-600">Return on Investment</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex justify-between">
                    <span>Minimum Investment</span>
                    <span className="font-semibold">$51</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Maximum Investment</span>
                    <span className="font-semibold">$200</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-semibold">2 days</span>
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="btn btn-primary w-full text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-primary-light p-6 text-center">
                <h3 className="text-2xl font-bold text-primary">Elite</h3>
                <p className="text-gray-600 mt-1">For large investments</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-primary">25%</p>
                  <p className="text-gray-600">Return on Investment</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex justify-between">
                    <span>Minimum Investment</span>
                    <span className="font-semibold">$1,001</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Maximum Investment</span>
                    <span className="font-semibold">$50,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-semibold">7 days</span>
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="btn btn-primary w-full text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/invest"
              className="text-primary font-semibold hover:underline"
            >
              View All Investment Plans →
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Investing Today
          </h2>
          <p className="text-xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto">
            Join thousands of investors who are already growing their wealth with our platform.
            It takes less than 2 minutes to create an account and start investing.
          </p>
          <Link
            to="/register"
            className="px-8 py-3 bg-white text-primary font-semibold rounded-md hover:bg-gray-100 transition text-lg"
          >
            Create an Account
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home; 