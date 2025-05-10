// components/HowItWorksSection.tsx
import Image from 'next/image';

const HowItWorksSection = () => {
  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">What you can do with amEx</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <Image 
              src="/water-bottle.png" 
              alt="Water bottle" 
              width={300} 
              height={200}
              className="rounded-lg mx-auto mb-4 object-cover"
            />
            <h3 className="font-bold text-lg mb-2">Request and Offer Services</h3>
            <p className="text-gray-600">Forgot your water bottle in class? Just open a quest to get it back!</p>
          </div>
          
          <div className="text-center">
            <Image 
              src="/documents.png" 
              alt="Documents" 
              width={300} 
              height={200}
              className="rounded-lg mx-auto mb-4 object-cover"
            />
            <h3 className="font-bold text-lg mb-2">Buy and Sell Items</h3>
            <p className="text-gray-600">One topper's trashy notes are another batchmate's treasure.</p>
          </div>
          
          <div className="text-center">
            <Image 
              src="/students.png" 
              alt="Students" 
              width={300} 
              height={200}
              className="rounded-lg mx-auto mb-4 object-cover"
            />
            <h3 className="font-bold text-lg mb-2">Partner up for Mutual Benefit</h3>
            <p className="text-gray-600">Got no one to share an auto with? Find a ridesharing buddy with amEx.</p>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  1
                </div>
                <h3 className="font-bold text-lg">Submit information in the post</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Price"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <button className="w-full bg-black text-white p-2 rounded">Open a Quest</button>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  2
                </div>
                <h3 className="font-bold text-lg">Interested buyers and request providers apply</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="border rounded p-4 mb-4">
                  <p className="font-bold">Biology Assignment Help</p>
                  <p className="text-gray-600 text-sm">Needed by tomorrow for submission paper</p>
                  <p className="font-bold mt-2">₹15/suitcase</p>
                  <button className="w-full bg-black text-white p-2 rounded mt-4">I'm interested</button>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  3
                </div>
                <h3 className="font-bold text-lg">Posters choose from available applicants</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border-b">
                    <div>
                      <p className="font-medium">I'm happily doing that immediately available</p>
                      <div className="flex items-center mt-1">
                        <p className="font-bold mr-2">Rohit Kamal V</p>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★★★★★</span>
                          <span className="text-gray-600 text-sm ml-1">5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <div>
                      <p className="font-medium">I can also solve you all the math</p>
                      <div className="flex items-center mt-1">
                        <p className="font-bold mr-2">Rohith Verma</p>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★★★★</span>
                          <span className="text-gray-600 text-sm ml-1">4.3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  4
                </div>
                <h3 className="font-bold text-lg">Students chat and make a deal</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="font-bold">Rohit Kamal V</p>
                      <p className="text-gray-500 text-sm">Connected Apr 2023</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-400">★★★★★</span>
                        <span className="text-gray-600 text-sm ml-1">5.0</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2 mb-4">
                    <p>Rohit is on your quest!</p>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      R
                    </div>
                    <div className="bg-gray-100 rounded-lg p-2 max-w-xs">
                      <p>Hey, I'm at the classroom near the warden's office. Where can I get you?</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type something here..." 
                      className="w-full p-2 pr-10 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 5 */}
          <div className="mt-16">
            <div className="flex items-center mb-4">
              <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                5
              </div>
              <h3 className="font-bold text-lg">The exchange is confirmed in-app using an OTP</h3>
            </div>
            <div className="max-w-md mx-auto bg-white border rounded-lg p-6 text-center">
              <h4 className="font-bold mb-4">Quest Fulfilled?</h4>
              <p className="mb-4">Show this code to Rohit</p>
              <div className="text-4xl font-bold mb-4">5743</div>
              <div className="text-center mb-4">
                <p className="font-bold mb-2">amEx</p>
                <p className="text-sm mb-4">Quest Fulfilled?</p>
                <p className="text-sm mb-2">Enter this code on Rohit's screen</p>
                <p className="text-sm">When Rohit has entered the code</p>
                <p className="text-sm">the quest will be marked as completed</p>
              </div>
              <div className="flex justify-center gap-4 mb-4">
                <button className="w-8 h-8 border rounded-lg flex items-center justify-center">5</button>
                <button className="w-8 h-8 border rounded-lg flex items-center justify-center">7</button>
                <button className="w-8 h-8 border rounded-lg flex items-center justify-center">4</button>
                <button className="w-8 h-8 border rounded-lg flex items-center justify-center">3</button>
              </div>
              <p className="text-sm text-gray-500">
                On entering this code, the quest will be marked as completed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;