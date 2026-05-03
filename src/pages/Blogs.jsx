import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, User, Search, ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const blogs = [
  {
    id: 1,
    title: "The Future of Gen AI in Corporate Training",
    excerpt: "How generative AI is reshaping the landscape of executive education and employee upskilling in 2024.",
    category: "Gen AI",
    date: "October 24, 2023",
    author: "Regenesys Editor",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Mastering Human-Centric Leadership in a Tech-Driven Era",
    excerpt: "Essential leadership skills for navigating complex organizational changes and market volatility.",
    category: "Leadership",
    date: "October 18, 2023",
    author: "Regenesys Editor",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "ESG Regulations: A Guide to Compliance and Reporting",
    excerpt: "Why sustainability reporting and social governance are becoming critical metrics for global enterprises.",
    category: "ESG",
    date: "October 12, 2023",
    author: "Regenesys Editor",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
  }
];

const Blogs = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Corporate Education Blog" 
        description="Stay updated with the latest trends in corporate training, upskilling, and executive leadership from Regenesys experts."
      />
      <TopBar />
      <Navbar />
      
      {/* Hero Section - Light Theme with Glows */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-10 overflow-hidden bg-white">
        <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] -translate-x-1/2" />
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-indigo-50/30 rounded-full blur-[120px] translate-x-1/3" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-[36px] lg:text-[56px] font-head font-bold text-regenesys-navy leading-[1.1] mb-8">
              Corporate Education Blog: Insights & Trends
            </h1>
            <p className="text-gray-500 text-[15px] lg:text-[17px] leading-relaxed max-w-3xl mx-auto mb-12">
              Welcome to our corporate education blog, your trusted space for fresh insights and the latest trends in workplace training and corporate education. Designed with experienced HR leaders, training specialists, and business executives in mind, our content is created to offer practical advice and forward-thinking strategies.
            </p>

            {/* Reference Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-regenesys-purple/20 rounded-xl p-1.5 flex flex-col md:flex-row items-center shadow-premium-sm transition-all focus-within:shadow-premium-lg">
                <div className="flex-1 flex items-center w-full">
                  <div className="pl-4 pr-3 text-gray-400">
                    <Search size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter Keywords" 
                    className="flex-1 bg-transparent border-none outline-none text-[14px] text-gray-700 py-3"
                  />
                </div>
                <div className="hidden md:block w-px h-8 bg-gray-100 mx-2" />
                <div className="relative w-full md:w-auto px-4 md:px-0">
                  <select className="w-full md:w-40 h-11 bg-transparent text-[13px] font-bold text-gray-600 outline-none appearance-none cursor-pointer">
                    <option>All Categories</option>
                    <option>Gen AI</option>
                    <option>Leadership</option>
                    <option>Soft Skills</option>
                  </select>
                </div>
                <button className="w-full md:w-auto bg-[#4a72f5] hover:bg-blue-600 text-white px-8 h-11 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 transition-all shadow-md ml-0 md:ml-2 mt-3 md:mt-0">
                  Submit <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 lg:py-24 px-6 lg:px-10 bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-[32px] font-head font-bold text-regenesys-navy">Recent Posts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {blogs.map((blog, i) => (
              <motion.article 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-premium-xl transition-all duration-500 group flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-5 left-5">
                    <span className="bg-regenesys-purple text-white text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg shadow-lg">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    <div className="flex items-center gap-1.5"><Calendar size={13} /> {blog.date}</div>
                    <div className="flex items-center gap-1.5"><User size={13} /> {blog.author}</div>
                  </div>
                  <h3 className="text-[20px] lg:text-[22px] font-head font-bold text-regenesys-navy leading-tight mb-4 line-clamp-2 group-hover:text-regenesys-purple transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-regenesys-muted text-[14px] leading-relaxed mb-8 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="mt-auto">
                    <Link to={`/blogs/${blog.id}`} className="inline-flex items-center gap-2 text-regenesys-purple font-black text-[12px] group-hover:gap-3 transition-all uppercase tracking-[0.1em]">
                      Read More <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-20 flex justify-center gap-2">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] transition-all ${p === 1 ? 'bg-regenesys-purple text-white shadow-lg shadow-regenesys-purple/20' : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stay Informed Section */}
      <section className="bg-white py-20 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#f0f4f9] rounded-[3rem] p-8 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden relative border border-gray-100">
            <div className="max-w-xl relative z-10">
              <h2 className="text-[32px] lg:text-[40px] font-head font-bold text-regenesys-navy leading-tight mb-4">Stay Informed</h2>
              <p className="text-regenesys-muted text-[15px] lg:text-[16px] leading-relaxed">
                Subscribe to our newsletter to receive the latest insights, trends, and updates in corporate education directly in your inbox.
              </p>
            </div>
            <div className="w-full lg:w-[450px] relative z-10">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 h-14 bg-white border border-gray-200 rounded-2xl px-6 text-[14px] outline-none focus:border-regenesys-purple transition-all shadow-sm"
                />
                <button className="h-14 px-8 bg-regenesys-navy text-white rounded-2xl font-bold text-[14px] hover:bg-regenesys-purple transition-all shadow-xl shadow-regenesys-navy/10 whitespace-nowrap">
                  SUBSCRIBE NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blogs;
