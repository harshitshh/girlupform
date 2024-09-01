import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import './App.css';
import Rive from '@rive-app/react-canvas';
import Confetti from 'react-confetti';

const formUrl = "https://form.reyansh7447.workers.dev/postSubmit?fid=1FAIpQLSfxOun5tvPPIToe3JR3w4jj8V-su3e6kYmHlmrByQoTtqoTpQ";

const formFields = [
  { id: 'Name', label: 'Name', type: 'text', placeholder: 'Enter your full name' },
  { id: 'Year', label: 'Year', type: 'select', options: ['1st', '2nd'] },
  { id: 'Phone number', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
  { id: 'Roll no.', label: 'Roll Number', type: 'text', placeholder: 'Enter your roll number' },
  { id: 'Email id', label: 'Email', type: 'email', placeholder: 'Enter your email address' },
  { id: 'Department', label: 'Department', type: 'checkbox', options: ['Creativity', 'Designing', 'Technical', 'Logistics', 'Content', 'Marketing and PR'] },
];

const App = () => {
  const [formData, setFormData] = useState({
    Department: []  // Initialize the Department field as an empty array
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0xff6ad5, wireframe: true });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    camera.position.z = 30;

    // const animate = () => {
    //   requestAnimationFrame(animate);
    //   torus.rotation.x += 0.01;
    //   torus.rotation.y += 0.01;
    //   renderer.render(scene, camera);
    // };
    // animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === 'checkbox') {
      let updatedDepartments = [...formData['Department']];

      if (checked) {
        updatedDepartments.push(value);
      } else {
        updatedDepartments = updatedDepartments.filter(department => department !== value);
      }

      setFormData({ ...formData, Department: updatedDepartments });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const data = {
      'Name': formData['Name'],
      'Year': formData['Year'],
      'Phone number': formData['Phone number'],
      'Roll no.': formData['Roll no.'],
      'Email id': formData['Email id'],
      'Department': formData['Department'] ? formData['Department'].join(', ') : '',
    };

    try {
      const response = await fetch(formUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowConfetti(true);
      setSuccessMessage('Form submitted successfully!');
    } catch (error) {
      console.error('Error details:', error);
      setSuccessMessage('An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ Department: [] });
    setCurrentStep(0);
    setShowConfetti(false);
    setSuccessMessage('');
  };

  const progress = ((currentStep + 1) / formFields.length) * 100;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <Rive
        src="/ayy_section.riv"
        stateMachines="State Machine 1"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5, transform: 'scale(1.3)' }}
      />

      <div className="absolute inset-0" ref={mountRef}></div>
      <div className="relative z-10 rounded-2xl shadow-xl w-full max-w-md overflow-hidden" style={{background:`rgba(0,0,0,0.7)`}}>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-200">GirlUp Recruitments</h1>
          {!successMessage ? (
            <>
              <div className="mb-6">
                <div className="h-2 bg-indigo-200 rounded-full">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-indigo-200 mt-2">
                  Step {currentStep + 1} of {formFields.length}
                </div>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    {formFields.map((field, index) => (
                      currentStep === index && (
                        <div key={field.id} className="mb-4">
                          <label htmlFor={field.id} className="block text-sm font-medium text-white mb-3">
                            {field.label}
                          </label>
                          {field.type === 'select' ? (
                            <select
                              id={field.id}
                              value={formData[field.id] || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">Select {field.label}</option>
                              {field.options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : field.type === 'checkbox' ? (
                            <div className="space-y-2">
                              {field.options.map((option) => (
                                <label key={option} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    value={option}
                                    checked={formData['Department']?.includes(option) || false}
                                    onChange={handleChange}
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                  />
                                  <span className="text-white">{option}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <input
                              type={field.type}
                              id={field.id}
                              placeholder={field.placeholder}
                              value={formData[field.id] || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          )}
                        </div>
                      )
                    ))}
                  </motion.div>
                </AnimatePresence>
                <div className="flex justify-between mt-6">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(step => step - 1)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < formFields.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(step => step + 1)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-4">{successMessage}</h2>
                {showConfetti && <Confetti />}
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                >
                  Fill Another Form
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
