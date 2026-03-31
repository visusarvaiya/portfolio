import { useRef, useState, useEffect } from "react";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import ShinyText from "./components/ShinyText/ShinyText";
import BlurText from "./components/BlurText/BlurText";
import ScrambledText from "./components/ScrambledText/ScrambledText";
import SplitText from "./components/SplitText/SplitText";
import Lanyard from "./components/Lanyard/Lanyard";
import GlassIcons from "./components/GlassIcons/GlassIcons";
import { listTools, listProyek } from "./data";
import ChromaGrid from "./components/ChromaGrid/ChromaGrid";
import ProjectModal from "./components/ProjectModal/ProjectModal"; // <-- IMPORT MODAL
import Aurora from "./components/Aurora/Aurora";
import CountUp from "./components/CountUp/CountUp";
import AOS from 'aos';
import axios from 'axios';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init();

function App() {
  const aboutRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null); // null = modal tertutup

  // Stats State
  const [stats, setStats] = useState({ views: 0, likes: 0 });
  const [isLiking, setIsLiking] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // 'loading', 'success', 'error'
  const [formData, setFormData] = useState({ Name: '', Email: '', message: '' });

  // CounterAPI configuration
  const API_KEY = "vishva-portfolio-realtime-stats";
  const BASE_URL = `https://api.counterapi.dev/v1/${API_KEY}`;

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Fetch current stats
  const fetchStats = async () => {
    try {
      const [viewsRes, likesRes] = await Promise.allSettled([
        axios.get(`${BASE_URL}/views`),
        axios.get(`${BASE_URL}/likes`)
      ]);

      setStats(prev => ({
        views: viewsRes.status === 'fulfilled' ? viewsRes.value.data.count : prev.views,
        likes: likesRes.status === 'fulfilled' ? likesRes.value.data.count : prev.likes
      }));
    } catch (err) {
      console.error("Critical: Failed to fetch stats", err);
    }
  };

  // Increment views on mount
  useEffect(() => {
    // Initial fetch to show current stats immediately
    fetchStats();
    
    const incrementViews = async () => {
      try {
        await axios.get(`${BASE_URL}/views/up?t=${Date.now()}`);
        await fetchStats(); // Fetch again to show the increment
      } catch (err) {
        console.error("Failed to increment views", err);
      }
    };
    incrementViews();
  }, []);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    
    // Optimistic Update: Update UI immediately
    setStats(prev => ({ ...prev, likes: prev.likes + 1 }));

    try {
      await axios.get(`${BASE_URL}/likes/up?t=${Date.now()}`);
      // Re-fetch to get accurate global count (in case others liked too)
      await fetchStats();
    } catch (err) {
      console.error("Failed to increment likes", err);
      // Revert optimistic update on error if needed
      // setStats(prev => ({ ...prev, likes: prev.likes - 1 }));
    } finally {
      setIsLiking(false);
    }
  };
  // -------------------------

  useEffect(() => {
    const isReload =
      performance.getEntriesByType("navigation")[0]?.type === "reload";

    if (isReload) {
      // Ambil path tanpa hash
      const baseUrl = window.location.origin + "/";
      window.location.replace(baseUrl);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full -z-10 ">
        <Aurora
          colorStops={["#577870", "#1F97A6", "#127B99"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="hero grid md:grid-cols-2 items-center pt-10 xl:gap-0 gap-6 grid-cols-1">
          <div className="animate__animated animate__fadeInUp animate__delay-3s">
            <div className="flex items-center gap-3 mb-6 bg bg-zinc-800 w-fit py-2 px-4 rounded-full border border-zinc-700">
              <img src="./assets/imgprof.jpeg" className="w-8 h-8 object-cover rounded-full" />
              <span className="font-semibold tracking-widest text-sm text-zinc-300">TEMPTATION 🔥</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              <ShinyText text="Hi I'm Vishva Sarvaiya" disabled={false} speed={3} className='custom-class' />
            </h1>
            <BlurText
              text="I’m a Computer Engineering student at Government Engineering College, Rajkot, with practical experience in C, Java, MySQL, Node.js, Express, and MongoDB. I am eager to join a dynamic team."
              delay={150}
              animateBy="words"
              direction="top"
              className=" mb-6"
            />
            <div className="flex items-center sm:gap-4 gap-2">
              <a 
                href="./assets/vishva-resume.pdf" 
                download="Vishva_Sarvaiya_Resume.pdf" 
                className="font-semibold bg-[#1a1a1a] p-4 px-6 rounded-full border border-gray-700 hover:bg-[#222] transition-colors"
              >
                <ShinyText text="Download CV" disabled={false} speed={3} className="custom-class" />
              </a>

              <a href="#project" className="font-semibold bg-[#1a1a1a] p-4 px-6 rounded-full border border-gray-700 hover:bg-[#222] transition-colors">
                <ShinyText text="Explore My Projects" disabled={false} speed={3} className="custom-class" />
              </a>
            </div>

          </div>
          <div className="md:ml-auto animate__animated animate__fadeInUp animate__delay-4s">
            <ProfileCard
              name="Vishva Sarvaiya"
              title="Computer Engineering Student"
              handle=""
              status=""
              contactText="Contact Me"
              avatarUrl="./assets/imgprof.jpeg"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() => window.location.href = 'mailto:visusarvaiya54@gmail.com'}
              stats={stats}
              onLikeClick={handleLike}
            />
          </div>
        </div>
        {/* tentang */}
        <div className="mt-15 mx-auto w-full max-w-[1600px] rounded-3xl border-[5px] border-violet-500/40 shadow-[0_0_30px_rgba(168,85,247,0.4)] bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] p-6" id="about">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-0 px-8" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
            <div className="basis-full md:basis-7/12 pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-violet-500/30">
              {/* Kolom kiri */}
              <div className="flex-1 text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
                  About Me
                </h2>

                <BlurText
                  text="I’m Vishva Sarvaiya, a Computer Engineering student at Government Engineering College, Rajkot (CGPA: 8.78/10). I have practical experience in C, Java, Python, and full-stack web development using Node.js, Express, and MongoDB. I've also solved 50+ DSA problems on LeetCode. I am eager to join a dynamic team, solve challenging problems, and continuously learn emerging technologies."
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="text-base md:text-lg leading-relaxed mb-10 text-gray-300"
                />

                <div className="flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-y-8 sm:gap-y-0 mb-4 w-full">
                  <div>
                    <h1 className="text-3xl md:text-4xl mb-1">
                      3<span className="text-violet-500">+</span>
                    </h1>
                    <p>Projects Finished</p>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl mb-1">
                      1<span className="text-violet-500">+</span>
                    </h1>
                    <p>Years of Experience</p>
                  </div>
                  <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600" data-aos-once="true">
                    <h1 className="text-3xl md:text-4xl mb-1">
                      8.78<span className="text-violet-500">/10</span>
                    </h1>
                    <p>CGPA</p>
                  </div>
                </div>


                <ShinyText
                  text="Working with heart, creating with mind."
                  disabled={false}
                  speed={3}
                  className="text-sm md:text-base text-violet-400"
                />
              </div>
            </div>

            {/* Kolom kanan */}
            <div className="basis-full md:basis-5/12 pl-0 md:pl-8 overflow-hidden max-w-full flex justify-center items-center">
              <div className="relative mt-8 md:mt-4 flex flex-col items-center">
                {/* The Pin on the wall (Static) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-300 rounded-full shadow-md z-30 border-2 border-zinc-500"></div>

                {/* The Swinging Element */}
                <div className="relative group pt-2 flex flex-col items-center origin-top hover-swing transition-transform duration-300">
                  {/* Hanging string */}
                  <div className="w-[2px] h-16 md:h-20 bg-zinc-600 z-10 pointer-events-none"></div>
                  {/* The Clip */}
                  <div className="w-8 h-4 bg-zinc-700 rounded border border-zinc-500 z-20 -mt-2 relative pointer-events-none"></div>
                  
                  {/* Photo container */}
                  <div className="pointer-events-auto relative -mt-2 p-2 z-10 cursor-pointer">
                     {/* Soft blurred background */}
                     <div className="absolute inset-0 bg-violet-600/30 blur-2xl rounded-3xl transition-opacity duration-500 group-hover:opacity-80"></div>
                     <img 
                       src="./assets/imgprof.jpeg" 
                       alt="Vishva Sarvaiya" 
                       className="relative w-56 h-56 md:w-60 md:h-60 object-cover rounded-2xl grayscale border-2 border-zinc-800 shadow-2xl transition-all duration-500" 
                     />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="tools mt-32">
          <h1 className="text-4xl/snug font-bold mb-4" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true" >Tools & Technologies</h1>
          <p className="w-2/5 text-base/loose opacity-50" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" data-aos-once="true">My Profesional Skills</p>
          <div className="tools-box mt-14 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">

            {listTools.map((tool) => (
              <div
                key={tool.id} data-aos="fade-up" data-aos-duration="1000" data-aos-delay={tool.dad} data-aos-once="true"
                className="flex items-center gap-4 p-4 border border-zinc-700 rounded-xl bg-zinc-900/60 backdrop-blur-md hover:bg-zinc-800/80 transition-all duration-300 group shadow-lg"
              >
                <img
                  src={tool.gambar}
                  alt="Tools Image"
                  className="w-16 h-16 object-contain bg-zinc-800 p-2 rounded-lg group-hover:bg-zinc-900 transition-all duration-300"
                />
                <div className="flex flex-col overflow-hidden">
                  <div className="truncate">
                    <ShinyText
                      text={tool.nama}
                      disabled={false}
                      speed={3}
                      className="text-lg font-semibold block"
                    />
                  </div>
                  <p className="text-sm text-zinc-400 truncate">{tool.ket}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* tentang */}

        {/* Proyek */}
        <div className="proyek mt-32 py-10" id="project">
          <h1 className="text-4xl font-bold mb-4 uppercase tracking-tighter" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">Selected Works /</h1>
          <p className="text-base/loose opacity-50 mb-14" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" data-aos-once="true">A collection of projects built with modern technologies.</p>
          
          <div className="flex flex-col gap-20">
            {listProyek.map((proyek, index) => (
              <div 
                key={proyek.id}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 group`}
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                {/* Project Image */}
                <div className="basis-1/2 overflow-hidden rounded-2xl border-2 border-zinc-800 shadow-2xl relative cursor-pointer" onClick={() => handleProjectClick(proyek)}>
                  <img 
                    src={proyek.image} 
                    alt={proyek.title}
                    className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="bg-white text-black px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs">View Details</span>
                  </div>
                </div>
                
                {/* Project Info */}
                <div className="basis-1/2 flex flex-col gap-4">
                  <h2 className="text-5xl font-black uppercase tracking-tighter text-white">{proyek.title}</h2>
                  <p className="text-violet-500 font-bold uppercase tracking-widest">{proyek.subtitle}</p>
                  <p className="text-zinc-400 leading-relaxed text-lg">{proyek.fullDescription}</p>
                  <div className="pt-4 flex gap-6">
                    <a 
                      href={proyek.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block border-b-2 border-white text-white font-bold uppercase tracking-widest pb-1 hover:border-violet-500 transition-colors"
                    >
                      Visit Github ↗
                    </a>
                    <a 
                      href={proyek.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block border-b-2 border-white text-white font-bold uppercase tracking-widest pb-1 hover:border-violet-500 transition-colors"
                    >
                      Live ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Proyek */}

        {/* Stats */}
        <div className="stats mt-32 sm:p-10 p-4" id="stats">
          <h1 className="text-center text-4xl font-bold mb-2 uppercase tracking-tighter" data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">Insights & Metrics /</h1>
          <p className="text-base/loose text-center opacity-50 mb-14" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" data-aos-once="true">Live indicators of your interactions.</p>
          <div className="gap-8 max-w-4xl mx-auto flex flex-col md:flex-row justify-center w-full">
            <div className="flex-1 p-8 border-l-[4px] border-violet-500 bg-zinc-900/30 flex flex-col items-center text-center transition-all duration-300 hover:bg-zinc-900/50" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-aos-once="true">
              <i className="ri-line-chart-line text-4xl text-violet-500 mb-4"></i>
              <h1 className="text-6xl font-black mb-2 text-white">
                 <CountUp to={stats.views} from={0} duration={1.5} separator="," />
              </h1>
              <p className="text-lg font-bold uppercase tracking-widest text-zinc-300">Total Views</p>
              <p className="text-sm text-zinc-500 mt-2">Active page visits</p>
            </div>
            <div 
              className="flex-1 p-8 border-l-[4px] border-violet-500 bg-zinc-900/30 flex flex-col items-center text-center transition-all duration-300 hover:bg-zinc-900/50 cursor-pointer group"
              onClick={handleLike}
              data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600" data-aos-once="true"
            >
              <i className={`ri-heart-add-line text-4xl mb-4 transition-colors ${isLiking ? 'text-red-500 scale-125' : 'text-violet-500 group-hover:text-red-500'}`}></i>
              <h1 className="text-6xl font-black mb-2 text-white">
                <CountUp to={stats.likes} from={0} duration={1.5} separator="," />
              </h1>
              <p className="text-lg font-bold uppercase tracking-widest text-zinc-300">Appreciation</p>
              <p className="text-sm text-zinc-500 mt-2 hover:text-white transition-colors duration-300">Click heart to appreciate</p>
            </div>
          </div>
        </div>

        {/* Kontak */}
        <div className="kontak mt-32 sm:p-10 p-0" id="contact">
          <h1
            className="text-4xl mb-2 font-bold text-center"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
          >
            LET'S MAKE IT HAPPEN
          </h1>
          <p
            className="text-base/loose text-center mb-10 opacity-50"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="300"
            data-aos-once="true"
          >
            <span className="text-white font-bold cursor-pointer hover:text-violet-400 transition-colors" onClick={() => window.location.href = 'mailto:visusarvaiya54@gmail.com'}>visusarvaiya54@gmail.com</span> | <span className="text-white font-bold">+91 9586648913</span>
          </p>

          {/* Container */}
          <div className="flex justify-center w-full">
            {/* Contact Form di tengah */}
            <div className="w-full max-w-2xl">
              {formStatus === 'success' ? (
                <div className="bg-zinc-800/50 border border-violet-500/50 p-10 rounded-2xl text-center space-y-4 animate-in">
                  <div className="w-20 h-20 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="ri-checkbox-circle-fill text-5xl text-violet-500"></i>
                  </div>
                  <h2 className="text-3xl font-bold text-white">Message Sent!</h2>
                  <p className="text-zinc-400 text-lg">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                  <button 
                    onClick={() => setFormStatus(null)}
                    className="mt-6 text-violet-400 font-bold hover:underline"
                  >
                    Send another message?
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setFormStatus('loading');
                    try {
                      const response = await fetch("https://formsubmit.co/ajax/be1cff2cd89bd31f30afef973a2b8f7a", {
                        method: "POST",
                        headers: { 
                          'Content-Type': 'application/json',
                          'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                          Name: e.target.Name.value,
                          Email: e.target.Email.value,
                          message: e.target.message.value,
                          _subject: "New message from your Portfolio!"
                        })
                      });
                      
                      if (response.ok) {
                        setFormStatus('success');
                        handleLike(); // Appreciation on success
                      } else {
                        setFormStatus('error');
                      }
                    } catch (err) {
                      console.error("Form submisson failed", err);
                      setFormStatus('error');
                    }
                  }}
                  className="bg-zinc-800 p-10 w-full rounded-md border border-zinc-700 active-glow transition-all duration-300"
                  autoComplete="off"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="500"
                  data-aos-once="true"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold">Full Name</label>
                      <input
                        type="text"
                        name="Name"
                        placeholder="Input Name..."
                        className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl focus:border-violet-500 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold">Email</label>
                      <input
                        type="email"
                        name="Email"
                        placeholder="Input Email..."
                        className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl focus:border-violet-500 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" className="font-semibold">Message</label>
                      <textarea
                        name="message"
                        id="message"
                        cols="45"
                        rows="5"
                        placeholder="Message..."
                        className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl focus:border-violet-500 outline-none transition-colors resize-none"
                        required
                      ></textarea>
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={formStatus === 'loading'}
                        className="font-semibold bg-violet-600 p-4 px-6 rounded-xl w-full cursor-pointer hover:bg-violet-700 transition-all duration-300 shadow-lg shadow-violet-500/20 disabled:opacity-50"
                      >
                        {formStatus === 'loading' ? 'Sending...' : <ShinyText text="Send Message" disabled={false} speed={3} />}
                      </button>
                      {formStatus === 'error' && (
                        <p className="mt-4 text-red-500 text-sm">Oops! Something went wrong. Please try again.</p>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        {/* Kontak */}
      </main>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  )
}

export default App
