"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  FileText,
  Workflow,
  Code,
  CheckCircle,
  AlertCircle,
  Mail,
  Database,
  RefreshCw,
  Search,
  X,
  Image as ImageIcon,
  UploadCloud,
  MousePointerClick,
  PlayCircle,
  ClipboardCheck,
  Moon,
  Sun
} from 'lucide-react';

type MermaidAPI = {
  initialize: (config: {
    startOnLoad?: boolean;
    theme?: string;
    flowchart?: {
      useMaxWidth?: boolean;
      htmlLabels?: boolean;
      curve?: string;
    };
  }) => void;
  init: (config?: unknown, nodes?: NodeListOf<Element> | Element | string) => void;
};

// Extend Window type to include mermaid
declare global {
  interface Window {
    mermaid?: MermaidAPI;
  }
}

const DEFAULT_IMAGE_SRC = '/vendor_update_process_ghibli_style.jpg';
const DEFAULT_IMAGE_NAME = 'vendor_update_process_ghibli_style.jpg';

const EskerVendorGuide = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mermaidLoaded, setMermaidLoaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>(DEFAULT_IMAGE_SRC);
  const [uploadedImageName, setUploadedImageName] = useState(DEFAULT_IMAGE_NAME);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isCustomImage = uploadedImage !== DEFAULT_IMAGE_SRC;
  const imageAltText = isCustomImage
    ? uploadedImageName || 'Uploaded vendor process visual'
    : 'Default Esker vendor update process illustration';
  const shouldUnoptimizeImage = uploadedImage.startsWith('data:');
  const displayedImageName = isCustomImage
    ? uploadedImageName
    : `${DEFAULT_IMAGE_NAME} (default)`;

  // Load Mermaid library
  useEffect(() => {
    const loadMermaid = async () => {
      if (typeof window !== 'undefined' && !window.mermaid) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
        script.async = true;
        script.onload = () => {
          if (!window.mermaid) {
            console.error('Mermaid loaded without exposing the expected API.');
            return;
          }

          window.mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
              curve: 'basis'
            }
          });
          setMermaidLoaded(true);
        };
        document.body.appendChild(script);
      } else if (window.mermaid) {
        setMermaidLoaded(true);
      }
    };
    loadMermaid();
  }, []);

  // Render Mermaid diagram when it becomes visible
  useEffect(() => {
    if (typeof window === 'undefined' || !window.mermaid) {
      return;
    }

    if (mermaidLoaded && currentPage === 4) {
      const timeoutId = window.setTimeout(() => {
        window.mermaid?.init(undefined, document.querySelectorAll('.mermaid'));
      }, 100);

      return () => window.clearTimeout(timeoutId);
    }

    return;
  }, [mermaidLoaded, currentPage]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedTheme = window.localStorage.getItem('esker-theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem('esker-theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (!isImageModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsImageModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isImageModalOpen]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please select a valid image file.');
      setIsImageModalOpen(false);
      fileInput.value = '';
      return;
    }

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setImageUploadError('Image must be 5 MB or smaller.');
      setIsImageModalOpen(false);
      fileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setUploadedImageName(file.name);
      setImageUploadError(null);
      setIsImageModalOpen(true);
    };

    reader.readAsDataURL(file);
    fileInput.value = '';
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const clearUploadedImage = () => {
    setUploadedImage(DEFAULT_IMAGE_SRC);
    setUploadedImageName(DEFAULT_IMAGE_NAME);
    setImageUploadError(null);
    setIsImageModalOpen(false);
  };

  const quickstartVisuals = [
    {
      id: 'user-guide-step-1',
      image: '/user_guide_1.png',
      title: 'Open the vendor canvas app',
      description: 'In Power Apps, locate the vendor application under My apps so you can launch the Esker vendor workflow.',
      note: 'click on vendor app'
    },
    {
      id: 'user-guide-step-2',
      image: '/user_guide_2.png',
      title: 'Start the app preview',
      description: 'Select the Play control in the top-right corner to enter the interactive app preview experience.',
      note: 'click Play button'
    },
    {
      id: 'user-guide-step-3',
      image: '/user_guide_3.png',
      title: 'Complete the form and send the email',
      description: 'Fill in every required field. The vendor number accepts numeric values only. When all fields are complete, choose Send Email to dispatch the update.',
      note: 'fill in all fields (required), vendor number only accepts numeric, click Send Email'
    }
  ];

  const pages = [
    {
      id: 'overview',
      title: 'Esker Vendor Update Process',
      subtitle: 'Complete workflow automation guide',
      icon: <Workflow className="w-6 h-6" />,
      searchTerms: ['overview', 'process', 'workflow', 'automation', 'guide', 'introduction'],
      content: [
        {
          heading: 'Process Overview',
          text: 'The Esker vendor update process provides an automated workflow for collecting vendor information through a web form and synchronizing it with the Esker system via scheduled Python scripts.',
          icon: <FileText className="w-5 h-5" />
        },
        {
          heading: 'Key Components',
          text: 'Web form for data input, Outlook email integration, Python automation script, and Esker system synchronization.',
          icon: <Code className="w-5 h-5" />
        },
        {
          heading: 'Automation Benefits',
          text: 'Reduces manual data entry, ensures data consistency, provides audit trail through email, and enables scheduled batch processing.',
          icon: <CheckCircle className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'form-requirements',
      title: 'Form Input Requirements',
      subtitle: 'Essential field validations and rules',
      icon: <AlertCircle className="w-6 h-6" />,
      searchTerms: ['form', 'input', 'requirements', 'validation', 'fields', 'required', 'vendor number'],
      content: [
        {
          heading: 'Required Fields',
          text: 'All input fields must be completed before submission. The system includes: Company Code, Vendor Number (whole numbers only), and Vendor Name fields.',
          icon: <CheckCircle className="w-5 h-5" />,
          highlight: true
        },
        {
          heading: 'Vendor Number Validation',
          text: 'The vendor number field accepts whole numbers only. Any decimal or non-numeric input will be rejected to maintain data integrity.',
          icon: <AlertCircle className="w-5 h-5" />,
          highlight: true
        },
        {
          heading: 'Submit Button Behavior',
          text: 'The Submit Email button remains disabled until all required fields are properly filled. This prevents incomplete data submission.',
          icon: <Mail className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'email-process',
      title: 'Email Submission Process',
      subtitle: 'How data is transmitted via Outlook',
      icon: <Mail className="w-6 h-6" />,
      searchTerms: ['email', 'outlook', 'submission', 'dispatch', 'send', 'message'],
      content: [
        {
          heading: 'Email Dispatch',
          text: 'Upon submission, the form generates and sends an Outlook email to a pre-configured inbox. This email contains all vendor update information in a structured format.',
          icon: <Mail className="w-5 h-5" />
        },
        {
          heading: 'Success Confirmation',
          text: 'A success message is displayed immediately after the email is dispatched successfully, providing user feedback and confirmation.',
          icon: <CheckCircle className="w-5 h-5" />,
          highlight: true
        },
        {
          heading: 'Email Storage',
          text: 'Submitted emails are stored in the specified inbox, creating an audit trail and serving as the data source for the Python automation script.',
          icon: <Database className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'automation',
      title: 'Python Script Automation',
      subtitle: 'Scheduled data synchronization to Esker',
      icon: <RefreshCw className="w-6 h-6" />,
      searchTerms: ['python', 'script', 'automation', 'schedule', 'sync', 'synchronization', 'batch'],
      content: [
        {
          heading: 'Scheduled Execution',
          text: 'A Python script runs at predetermined intervals (e.g., hourly, daily) to process pending vendor updates automatically without manual intervention.',
          icon: <RefreshCw className="w-5 h-5" />,
          highlight: true
        },
        {
          heading: 'Email Processing',
          text: 'The script reads emails from the designated inbox, parses vendor information, validates data format, and prepares it for Esker system updates.',
          icon: <Code className="w-5 h-5" />
        },
        {
          heading: 'Esker Integration',
          text: 'Validated vendor data is automatically pushed to the Esker system, updating vendor records and maintaining synchronization across platforms.',
          icon: <Database className="w-5 h-5" />,
          highlight: true
        }
      ]
    },
    {
      id: 'workflow',
      title: 'Complete Workflow Diagram',
      subtitle: 'Visual representation of the entire process',
      icon: <Workflow className="w-6 h-6" />,
      searchTerms: ['workflow', 'diagram', 'flowchart', 'visual', 'mermaid', 'process flow'],
      isWorkflow: true
    },
    {
      id: 'user-guide',
      title: 'User Guide & Quickstart',
      subtitle: 'Step-by-step walkthrough with visuals',
      icon: <PlayCircle className="w-6 h-6" />,
      searchTerms: ['user guide', 'quickstart', 'tutorial', 'getting started', 'play', 'launch'],
      content: [
        {
          heading: 'Launch the vendor app',
          text: 'Open Power Apps and choose the vendor canvas application from My apps to begin the Esker update process.',
          icon: <MousePointerClick className="w-5 h-5" />,
          highlight: true
        },
        {
          heading: 'Use preview mode to run the app',
          text: 'Select the play control in the upper-right corner to launch the interactive preview so you can enter vendor information.',
          icon: <PlayCircle className="w-5 h-5" />
        },
        {
          heading: 'Complete required fields then send the email',
          text: 'Populate every required field. The vendor number accepts numeric values only. When validation passes, select Send Email to dispatch the vendor update.',
          icon: <ClipboardCheck className="w-5 h-5" />,
          highlight: true
        }
      ]
    }
  ];

  const filteredPages = pages.filter(page => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    // Search in title, subtitle, and search terms
    return (
      page.title.toLowerCase().includes(query) ||
      page.subtitle.toLowerCase().includes(query) ||
      page.searchTerms?.some(term => term.includes(query)) ||
      page.content?.some(section => 
        section.heading.toLowerCase().includes(query) ||
        section.text.toLowerCase().includes(query)
      )
    );
  });

  const page = filteredPages[currentPage];

  const handleNext = () => {
    if (currentPage < filteredPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(0);
  };

  const toggleTheme = () => {
    setIsDarkMode((previous) => !previous);
  };

  const WorkflowDiagram = () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border-2 border-indigo-200 transition-colors duration-300 dark:bg-slate-900 dark:bg-none dark:border-indigo-500/40">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-slate-900 dark:border dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 dark:text-slate-100">
          <Workflow className="w-6 h-6 text-indigo-600" />
          Process Flow Stages
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 dark:bg-slate-800 dark:border-blue-500/60">
            <h4 className="font-semibold text-blue-900 mb-2 dark:text-blue-200">1. User Input</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200/80">Form validation and email submission</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500 dark:bg-slate-800 dark:border-green-500/60">
            <h4 className="font-semibold text-green-900 mb-2 dark:text-green-200">2. Email Dispatch</h4>
            <p className="text-sm text-green-800 dark:text-green-200/80">Outlook integration and confirmation</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500 dark:bg-slate-800 dark:border-purple-500/60">
            <h4 className="font-semibold text-purple-900 mb-2 dark:text-purple-200">3. Script Trigger</h4>
            <p className="text-sm text-purple-800 dark:text-purple-200/80">Scheduled Python automation</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500 dark:bg-slate-800 dark:border-orange-500/60">
            <h4 className="font-semibold text-orange-900 mb-2 dark:text-orange-200">4. Data Processing</h4>
            <p className="text-sm text-orange-800 dark:text-orange-200/80">Parse and validate vendor data</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500 dark:bg-slate-800 dark:border-amber-500/60">
            <h4 className="font-semibold text-amber-900 mb-2 dark:text-amber-200">5. Esker Update</h4>
            <p className="text-sm text-amber-800 dark:text-amber-200/80">System synchronization</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500 dark:bg-slate-800 dark:border-emerald-500/60">
            <h4 className="font-semibold text-emerald-900 mb-2 dark:text-emerald-200">6. Completion</h4>
            <p className="text-sm text-emerald-800 dark:text-emerald-200/80">Success logging and archival</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md dark:bg-slate-900 dark:border dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-slate-100">Detailed Workflow Diagram</h3>
        <p className="text-sm text-gray-600 mb-4 italic dark:text-slate-300">
          The workflow encompasses user interaction, email automation, scheduled processing, and system integration
        </p>
        <div className="overflow-x-auto bg-white p-4 rounded-lg border border-gray-200 dark:bg-slate-900 dark:border-slate-700">
          <div className="mermaid">
{`graph TD
    A[User Access Form] --> B{All Fields Filled?}
    B -->|No| C[Submit Button Disabled]
    C --> D[User Fills Required Fields]
    D --> B
    
    B -->|Yes| E[Submit Button Enabled]
    E --> F[User Clicks Submit Email]
    
    F --> G{Validate Vendor Number}
    G -->|Invalid| H[Show Error: Whole Numbers Only]
    H --> D
    
    G -->|Valid| I[Compose Email with Form Data]
    I --> J[Send via Outlook to Specified Inbox]
    
    J --> K{Email Dispatch Status}
    K -->|Failed| L[Show Error Message]
    L --> M[Log Error]
    
    K -->|Success| N[Display Success Message]
    N --> O[Email Received in Inbox]
    
    O --> P[Wait for Scheduled Interval]
    P --> Q[Python Script Triggered]
    Q --> R[Read Email from Inbox]
    R --> S[Parse Vendor Data]
    S --> T[Validate Data Format]
    
    T --> U{Data Valid?}
    U -->|No| V[Log Validation Error]
    V --> W[Send Error Notification]
    
    U -->|Yes| X[Connect to Esker System]
    X --> Y[Update Vendor Information]
    Y --> Z{Update Successful?}
    
    Z -->|No| AA[Retry Logic]
    AA --> AB{Retry Count < Max?}
    AB -->|Yes| X
    AB -->|No| AC[Log Failure & Alert Admin]
    
    Z -->|Yes| AD[Log Success]
    AD --> AE[Archive Processed Email]
    AE --> AF[Send Confirmation]
    AF --> P
    
    style A fill:#e1f5ff
    style E fill:#c8e6c9
    style N fill:#4caf50,color:#fff
    style L fill:#f44336,color:#fff
    style Y fill:#ff9800,color:#fff
    style AD fill:#4caf50,color:#fff
    style Q fill:#9c27b0,color:#fff`}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 dark:bg-slate-800 dark:border-blue-500/60">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>Note:</strong> The diagram shows the complete end-to-end process from form submission to Esker system update, including validation checkpoints, error handling, and retry logic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`flex min-h-screen transition-colors duration-300 ${
          isDarkMode
            ? 'bg-slate-950 text-slate-100'
            : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'
        }`}
      >
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-2xl hidden lg:block border-r border-gray-200 transition-colors duration-300 dark:bg-slate-900 dark:border-slate-800">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600">E</span>
            </div>
            <h1 className="text-xl font-bold text-white">ESKER</h1>
          </div>
          <p className="text-indigo-100 text-sm">Vendor Update System</p>
        </div>
        
        {/* Enhanced Search Section */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors duration-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-indigo-400 dark:placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors dark:text-slate-500 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Search Results Counter */}
          {searchQuery && (
            <div className="mt-2 text-xs text-gray-600 px-2 dark:text-slate-400">
              {filteredPages.length} {filteredPages.length === 1 ? 'result' : 'results'} found
            </div>
          )}
        </div>

        <nav className="px-4 pb-4 space-y-2">
          {filteredPages.map((p, index) => (
            <button
              key={p.id}
              onClick={() => setCurrentPage(index)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                currentPage === index
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <span className={currentPage === index ? 'text-white' : 'text-indigo-600 dark:text-indigo-300'}>
                {p.icon}
              </span>
              <span className="font-medium text-sm dark:text-slate-100">{p.title}</span>
            </button>
          ))}
          {filteredPages.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3 dark:text-slate-600" />
              <p className="text-gray-500 text-sm font-medium dark:text-slate-300">No results found</p>
              <p className="text-gray-400 text-xs mt-1 dark:text-slate-500">Try a different search term</p>
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-200 transition-colors dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900/70"
              >
                Clear Search
              </button>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 transition-colors duration-300 dark:bg-slate-900 dark:border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl dark:bg-indigo-900/50">
                  {page.icon}
                </div>
                <div>
                  
                  <style jsx>{`
                    .gradient-title {
                      color: #1f2937; /* Fallback: solid gray-900 */
                    }
  
                    @supports (background-clip: text) or (-webkit-background-clip: text) {
                      .gradient-title {
                       background: linear-gradient(to right, #4f46e5, #9333ea, #ec4899);
                       -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                        color: transparent;
                      }
                    }
                  `}</style>

                  <h2 className="text-3xl font-bold gradient-title">
                    {page.title}
                  </h2>

                  {/* 
                  <h2
                    className={`text-3xl font-bold ${
                      page.id === 'overview'
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'
                        : 'text-gray-900'
                    }`}
                  >
                    {page.title}
                  </h2>
                  */}

                  <p className="text-lg text-gray-600 mt-1 dark:text-slate-300">{page.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                  aria-label={`Activate ${isDarkMode ? 'light' : 'dark'} mode`}
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
                </button>
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full dark:bg-slate-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    Page {currentPage + 1} of {filteredPages.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 transition-colors duration-300 dark:bg-slate-900 dark:border-slate-700">
            {page.isWorkflow ? (
              <WorkflowDiagram />
            ) : (
              <>
                <div className="space-y-6">
                  {page.content && page.content.map((section, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-xl transition-all duration-300 ${
                        section.highlight
                          ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 dark:from-indigo-900/40 dark:to-blue-900/30 dark:border-indigo-500/60'
                          : 'bg-gray-50 border border-gray-200 dark:bg-slate-800 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${
                          section.highlight
                            ? 'bg-indigo-600 dark:bg-indigo-500'
                            : 'bg-gray-300 dark:bg-slate-700'
                        }`}>
                          {React.cloneElement(section.icon, {
                            className: `w-5 h-5 ${
                              section.highlight ? 'text-white' : 'text-gray-700 dark:text-slate-200'
                            }`
                          })}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 dark:text-slate-100">
                            {section.heading}
                          </h3>
                          <p className="text-gray-700 leading-relaxed dark:text-slate-300">
                            {section.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {page.id === 'user-guide' && (
                  <div className="mt-8 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                        Quickstart Visual Guide
                      </h3>
                      <p className="text-gray-600 mt-2 dark:text-slate-300">
                        Follow these annotated screenshots for a rapid walkthrough of the Esker vendor update submission.
                      </p>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                      {quickstartVisuals.map((step) => (
                        <div
                          key={step.id}
                          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
                        >
                          <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-slate-800">
                            <Image
                              src={step.image}
                              alt={step.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 33vw"
                              className="object-cover"
                              priority={false}
                            />
                          </div>
                          <div className="p-5 space-y-2">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                              {step.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-slate-300">
                              {step.description}
                            </p>
                            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                              {step.note}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 ${
                  currentPage === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                <span>&lt;</span>
                <span>Previous</span>
              </button>

              <div className="flex gap-2">
                {filteredPages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      currentPage === index
                        ? 'bg-indigo-600 w-8'
                        : 'bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === filteredPages.length - 1}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 ${
                  currentPage === filteredPages.length - 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                <span>Next</span>
                <span>&gt;</span>
              </button>
            </div>
          </div>

          {/* Uploaded Image Section */}
          <section className="mt-10">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-colors duration-300 dark:bg-slate-900 dark:border-slate-700">
              <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 dark:border-slate-700/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300">
                    <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Visual Reference</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Upload the latest vendor process map for quick sharing with your team.
                  </p>
                </div>
              </div>
              {isCustomImage && (
                <button
                  onClick={clearUploadedImage}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors dark:text-indigo-300 dark:hover:text-indigo-200"
                >
                  Remove image
                </button>
              )}
            </div>

            <div className="p-6 space-y-4">
              <label
                htmlFor="process-image-upload"
                className="group relative flex flex-col items-center justify-center w-full border-2 border-dashed border-indigo-200 rounded-xl p-6 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-center dark:border-indigo-500/40 dark:hover:border-indigo-400 dark:hover:bg-slate-900"
              >
                <UploadCloud className="w-10 h-10 text-indigo-400 group-hover:text-indigo-600 transition-colors dark:text-indigo-300" />
                <span className="mt-3 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 dark:text-indigo-300 dark:group-hover:text-indigo-200">
                  Click to upload process image
                </span>
                <span className="text-xs text-gray-500 mt-1 dark:text-slate-400">Accepts PNG, JPG, or GIF (max 5 MB)</span>
                <input
                  id="process-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {imageUploadError && (
                <p className="text-sm text-red-600 font-medium dark:text-red-400">{imageUploadError}</p>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-700 truncate dark:text-slate-200">
                    {displayedImageName}
                  </p>
                  <button
                    onClick={() => setIsImageModalOpen(true)}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors dark:text-indigo-300 dark:hover:text-indigo-200"
                  >
                    View larger
                  </button>
                </div>
                <div
                  className="relative h-60 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 cursor-zoom-in dark:bg-slate-800 dark:border-slate-700"
                  onClick={() => setIsImageModalOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setIsImageModalOpen(true);
                    }
                  }}
                  aria-label="Open vendor process image in modal"
                >
                  <Image
                    src={uploadedImage}
                    alt={imageAltText}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain transition-transform duration-200 hover:scale-[1.01]"
                    priority={!isCustomImage}
                    unoptimized={shouldUnoptimizeImage}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Select the preview or the button above to open a full-size modal view.
                </p>
              </div>
            </div>
          </div>
        </section>
        </div>
    </main>
  </div>

  {isImageModalOpen && uploadedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          onClick={closeImageModal}
          role="dialog"
          aria-modal="true"
          aria-label="Uploaded vendor process image"
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
              aria-label="Close image preview"
            >
              <X className="w-5 h-5" />
            </button>
          <div className="relative h-[80vh] bg-gray-900">
            <Image
              src={uploadedImage}
              alt={imageAltText}
              fill
              sizes="100vw"
              className="object-contain"
              priority={!isCustomImage}
              unoptimized={shouldUnoptimizeImage}
            />
          </div>
          {displayedImageName && (
            <div className="px-6 py-4 text-sm text-gray-600 border-t border-gray-200 bg-gray-50 dark:text-slate-300 dark:border-slate-700 dark:bg-slate-900">
              {displayedImageName}
            </div>
          )}
          </div>
        </div>
      )}
    </>
  );
};

export default EskerVendorGuide;
