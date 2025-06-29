import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUpload, FaThumbsUp, FaCheck, FaFilter, FaTimes } from 'react-icons/fa';
import Card from '../Card';

interface StudyMaterial {
  id: string;
  title: string;
  type: 'notes' | 'summary' | 'practice' | 'flashcards' | 'other';
  courseId: string;
  courseName: string;
  upvotes: number;
  verified: boolean;
  uploadedBy: string;
  uploadDate: Date;
  fileUrl: string;
}

interface StudyMaterialsGridProps {
  courseList: {
    id: string;
    code: string;
    name: string;
  }[];
}

const StudyMaterialsGrid: React.FC<StudyMaterialsGridProps> = ({ courseList }) => {
  // Mock data - in a real app this would come from an API
  const [materials, setMaterials] = useState<StudyMaterial[]>([
    {
      id: 'mat-1',
      title: 'Midterm Study Guide',
      type: 'summary',
      courseId: 'cs101',
      courseName: 'Introduction to Computer Science',
      upvotes: 24,
      verified: true,
      uploadedBy: 'Professor Smith',
      uploadDate: new Date(2025, 5, 20), // June 20, 2025
      fileUrl: '/files/cs101-midterm-guide.pdf'
    },
    {
      id: 'mat-2',
      title: 'Week 5-8 Lecture Notes',
      type: 'notes',
      courseId: 'cs101',
      courseName: 'Introduction to Computer Science',
      upvotes: 18,
      verified: true,
      uploadedBy: 'TA Johnson',
      uploadDate: new Date(2025, 5, 15), // June 15, 2025
      fileUrl: '/files/cs101-week5-8-notes.pdf'
    },
    {
      id: 'mat-3',
      title: 'Practice Problems Set 3',
      type: 'practice',
      courseId: 'math201',
      courseName: 'Calculus II',
      upvotes: 32,
      verified: true,
      uploadedBy: 'Professor Zhang',
      uploadDate: new Date(2025, 5, 18), // June 18, 2025
      fileUrl: '/files/math201-practice-set3.pdf'
    },
    {
      id: 'mat-4',
      title: 'Algorithm Flashcards',
      type: 'flashcards',
      courseId: 'cs101',
      courseName: 'Introduction to Computer Science',
      upvotes: 15,
      verified: false,
      uploadedBy: 'Alex K.',
      uploadDate: new Date(2025, 5, 10), // June 10, 2025
      fileUrl: '/files/cs101-algorithm-flashcards.pdf'
    },
    {
      id: 'mat-5',
      title: 'Final Exam Review',
      type: 'summary',
      courseId: 'math201',
      courseName: 'Calculus II',
      upvotes: 28,
      verified: false,
      uploadedBy: 'Study Group B',
      uploadDate: new Date(2025, 5, 25), // June 25, 2025
      fileUrl: '/files/math201-final-review.pdf'
    }
  ]);

  // State for search, filters, and modal
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'notes' as StudyMaterial['type'],
    courseId: '',
    file: null as File | null
  });

  // Filter materials based on search and filters
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = searchTerm === '' || 
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = selectedCourse === '' || material.courseId === selectedCourse;
    const matchesType = selectedType === '' || material.type === selectedType;
    
    return matchesSearch && matchesCourse && matchesType;
  });

  // Sort by upvotes (most upvoted first)
  const sortedMaterials = [...filteredMaterials].sort((a, b) => b.upvotes - a.upvotes);

  // Handle upvote
  const handleUpvote = (id: string) => {
    setMaterials(prev => 
      prev.map(material => 
        material.id === id 
          ? { ...material, upvotes: material.upvotes + 1 } 
          : material
      )
    );
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) return;
    
    // In a real app, you would upload the file to a server here
    // For this demo, we'll just add it to our local state
    
    const selectedCourseObj = courseList.find(course => course.id === uploadForm.courseId);
    
    const newMaterial: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title: uploadForm.title,
      type: uploadForm.type,
      courseId: uploadForm.courseId,
      courseName: selectedCourseObj?.name || 'Unknown Course',
      upvotes: 0,
      verified: false,
      uploadedBy: 'You', // In a real app, this would be the user's name
      uploadDate: new Date(),
      fileUrl: URL.createObjectURL(uploadForm.file) // In a real app, this would be the URL from the server
    };
    
    setMaterials(prev => [...prev, newMaterial]);
    setShowUploadModal(false);
    
    // Reset form
    setUploadForm({
      title: '',
      type: 'notes',
      courseId: '',
      file: null
    });
  };

  // Get material type display name
  const getMaterialTypeDisplay = (type: string) => {
    switch (type) {
      case 'notes': return 'Notes';
      case 'summary': return 'Summary';
      case 'practice': return 'Practice';
      case 'flashcards': return 'Flashcards';
      default: return 'Other';
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Study Materials</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUploadModal(true)}
          className="btn-secondary flex items-center gap-1"
          aria-label="Upload study materials"
        >
          <FaUpload size={14} />
          <span>Upload</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-2">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-primary-bg border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full bg-primary-bg border border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="">All Courses</option>
              {courseList.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-primary-bg border border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="">All Types</option>
              <option value="notes">Notes</option>
              <option value="summary">Summaries</option>
              <option value="practice">Practice</option>
              <option value="flashcards">Flashcards</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {(selectedCourse || selectedType || searchTerm) && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCourse('');
                setSelectedType('');
                setSearchTerm('');
              }}
              className="bg-primary-bg border border-gray-700 rounded-lg px-2 text-text-secondary hover:text-white"
              aria-label="Clear filters"
            >
              <FaTimes />
            </motion.button>
          )}
        </div>
      </div>

      {/* Materials Grid */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {sortedMaterials.length === 0 ? (
          <p className="text-text-secondary text-center py-4">
            No study materials found. Upload some to get started!
          </p>
        ) : (
          sortedMaterials.map(material => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary-bg rounded-lg p-3 border border-gray-700 hover:border-accent-50 transition-all duration-300"
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{material.title}</h4>
                    {material.verified && (
                      <span className="text-green-500" title="Verified by instructor">
                        <FaCheck size={12} />
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">{material.courseName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-secondary-bg px-2 py-0.5 rounded">
                      {getMaterialTypeDisplay(material.type)}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {new Date(material.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpvote(material.id)}
                    className="flex items-center gap-1 text-text-secondary hover:text-accent"
                    aria-label="Upvote"
                  >
                    <FaThumbsUp size={14} />
                    <span>{material.upvotes}</span>
                  </motion.button>
                  
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:underline mt-2"
                  >
                    View
                  </a>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-secondary-bg p-6 rounded-lg w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Upload Study Material</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={uploadForm.title}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-primary-bg border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="e.g. Week 5 Lecture Notes"
                  />
                </div>
                
                <div>
                  <label htmlFor="courseId" className="block text-sm font-medium text-text-secondary mb-1">
                    Course *
                  </label>
                  <select
                    id="courseId"
                    name="courseId"
                    value={uploadForm.courseId}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-primary-bg border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="" disabled>Select a course</option>
                    {courseList.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-text-secondary mb-1">
                    Material Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={uploadForm.type}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-primary-bg border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="notes">Notes</option>
                    <option value="summary">Summary</option>
                    <option value="practice">Practice Problems</option>
                    <option value="flashcards">Flashcards</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-text-secondary mb-1">
                    File *
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleFileChange}
                    required
                    className="w-full bg-primary-bg border border-gray-600 rounded px-3 py-2 text-white"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Accepted formats: PDF, Word, PowerPoint, Text
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={!uploadForm.file || !uploadForm.title || !uploadForm.courseId}
                  >
                    Upload
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default StudyMaterialsGrid;
