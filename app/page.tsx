"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { FileText, Workflow, Code, CheckCircle, AlertCircle, Mail, Database, RefreshCw, Search, X } from 'lucide-react';

// Extend Window type to include mermaid
declare global {
  interface Window {
    mermaid?: any;
  }
}

const EskerVendorGuide = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mermaidLoaded, setMermaidLoaded] = useState(false);

  // Load Mermaid library
  useEffect(() => {
    const loadMermaid = async () => {
      if (typeof window !== 'undefined' && !window.mermaid) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
        script.async = true;
        script.onload = () => {
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
    if (mermaidLoaded && currentPage === 4) {
      setTimeout(() => {
        window.mermaid.init(undefined, document.querySelectorAll('.mermaid'));
      }, 100);
    }
  }, [mermaidLoaded, currentPage]);

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

  const WorkflowDiagram = () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border-2 border-indigo-200">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Workflow className="w-6 h-6 text-indigo-600" />
          Process Flow Stages
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-2">1. User Input</h4>
            <p className="text-sm text-blue-800">Form validation and email submission</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-2">2. Email Dispatch</h4>
            <p className="text-sm text-green-800">Outlook integration and confirmation</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <h4 className="font-semibold text-purple-900 mb-2">3. Script Trigger</h4>
            <p className="text-sm text-purple-800">Scheduled Python automation</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <h4 className="font-semibold text-orange-900 mb-2">4. Data Processing</h4>
            <p className="text-sm text-orange-800">Parse and validate vendor data</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 mb-2">5. Esker Update</h4>
            <p className="text-sm text-amber-800">System synchronization</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
            <h4 className="font-semibold text-emerald-900 mb-2">6. Completion</h4>
            <p className="text-sm text-emerald-800">Success logging and archival</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Workflow Diagram</h3>
        <p className="text-sm text-gray-600 mb-4 italic">
          The workflow encompasses user interaction, email automation, scheduled processing, and system integration
        </p>
        <div className="overflow-x-auto bg-white p-4 rounded-lg border border-gray-200">
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
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> The diagram shows the complete end-to-end process from form submission to Esker system update, including validation checkpoints, error handling, and retry logic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-2xl hidden lg:block border-r border-gray-200">
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Search Results Counter */}
          {searchQuery && (
            <div className="mt-2 text-xs text-gray-600 px-2">
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
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={currentPage === index ? 'text-white' : 'text-indigo-600'}>
                {p.icon}
              </span>
              <span className="font-medium text-sm">{p.title}</span>
            </button>
          ))}
          {filteredPages.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">No results found</p>
              <p className="text-gray-400 text-xs mt-1">Try a different search term</p>
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-200 transition-colors"
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
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
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
                  <p className="text-lg text-gray-600 mt-1">{page.subtitle}</p>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <span className="text-sm font-medium text-gray-700">
                  Page {currentPage + 1} of {filteredPages.length}
                </span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {page.isWorkflow ? (
              <WorkflowDiagram />
            ) : (
              <div className="space-y-6">
                {page.content && page.content.map((section, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl transition-all duration-300 ${
                      section.highlight
                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        section.highlight ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}>
                        {React.cloneElement(section.icon, {
                          className: `w-5 h-5 ${section.highlight ? 'text-white' : 'text-gray-700'}`
                        })}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {section.heading}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {section.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 ${
                  currentPage === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                <span>←</span>
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
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === filteredPages.length - 1}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 ${
                  currentPage === filteredPages.length - 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                <span>Next</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EskerVendorGuide;
