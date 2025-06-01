import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import robo from "../assets/robo.png";
import logo from "../assets/logo.png";
import Chat from "../components/Chat";
import { useAuth } from "../context/AuthContext";
export default function Home() {
  const { currentUser } = useAuth();
  console.log(currentUser);
  return (
    <>
      <Navbar />

      {/* ___________________________________________INTRO AND TAGLINE_______________________________________________________________________________________________________ */}

      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-16 bg-[#FAF3E0] \ space-y-10 md:space-y-0 rounded-b-3xl shadow-inner">
        <div className="md:w-1/2 space-y-6 animate-fade-in-left">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            😊Namaste! {currentUser.displayName} <br />
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 leading-tight tracking-tight">
            kaise ho? Koi ache se guide nahi kar raha?<br></br>
          </h2>

          <p className="text-gray-700 text-4lg leading-relaxed">
            Main samjh sakta hu, abhi tum kis situation me ho! lekin chinta mat
            karo kyoki ab main aa gaya hu tumhari help karne ke liye.Ab tum bhi
            sabki tarah ek din zaroor SMART banoge dekhna, trust me.....Daro
            mat! <br></br>
            🥰
            <i>
              <b>MAIN HOON NA</b>
            </i>
            !🫱🏼‍🫲🏻
          </p>
          <div>
            <a
              href="/schedules"
              className="inline-block bg-[#BC4749] text-white px-6 py-3 rounded-xl text-lg font-medium shadow-md hover:bg-red-800 transition duration-300 hover:scale-110"
            >
              Start Kare?
            </a>
          </div>
        </div>

        {/*________________________________________ IMAGE OF SmartSahayak _____________________________________________*/}

        <div className="md:w-1/2 flex justify-center animate-fade-in-right w-320px scale-115">
          <img
            src={robo}
            alt="SmartSahayak Logo"
            className="h-96 rounded-2xl"
          />
        </div>
      </div>

      {/* _____________________________________________________FEATURES SECTION______________________________________________________________________________ */}

      <section className="px-6 md:px-10 py-5 bg-[#FAF3E0] ">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powerful Features Aapke liye
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up ">
          <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:scale-105 transform duration-200">
            <h3 className="text-xl font-bold text-green-900 mb-3">
              📅Homework Manager
            </h3>
            <p className="text-gray-600">
              <l>
                <li>SmartSahayak will give you Homework Everyday.</li>
                <li>
                  <i>Homework check bhi kiya jayega roz!</i>
                </li>
                <li>
                  <i>Check karne ke baad aapko smart feedback bhi milega!</i>
                </li>

                <li>AI-powered Homework scanning feature.</li>
                <li>Homework status showing pending/submitted!</li>
              </l>
            </p>
          </div>

          <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-bold text-green-900 mb-3">
              🤖AI-powered Expert Doubt Solver
            </h3>
            <p className="text-gray-600">
              <l>
                <li>Specially tailored for rural students.</li>
                <li>
                  <i>Aapko jo bhi doubt ho pucho!</i>
                </li>
                <li>Very fast response in seconds.</li>
                <li>Subject input option for more in-depth doubt clearing.</li>
              </l>
            </p>
          </div>

          <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-bold text-green-900 mb-3">
              ✅Life Coach
            </h3>
            <p className="text-gray-600">
              To give emotional support to rural students and motivate to adapt
              good habits to be successful in life.
            </p>
          </div>
        </div>
      </section>

      <Chat src={logo} />

      <Footer />
    </>
  );
}
