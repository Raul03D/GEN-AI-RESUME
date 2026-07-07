import React, { useState, useRef } from "react";
import "../style/home.scss";

const InterviewPlanUI = ({
  jobDescription: propJobDesc,
  onJobDescriptionChange,
  resumeFile: propResume,
  onResumeChange,
  selfDescription: propSelfDesc,
  onSelfDescriptionChange,
  onSubmit,
  isGenerating = false,
}) => {
  // Local state fallbacks for standalone usage / interactive preview
  const [localJobDesc, setLocalJobDesc] = useState("");
  const [localResume, setLocalResume] = useState(null);
  const [localSelfDesc, setLocalSelfDesc] = useState("");

  const jobDesc = propJobDesc !== undefined ? propJobDesc : localJobDesc;
  const resume = propResume !== undefined ? propResume : localResume;
  const selfDesc = propSelfDesc !== undefined ? propSelfDesc : localSelfDesc;

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleJobDescChange = (e) => {
    const val = e.target.value;
    if (val.length <= 5000) {
      if (onJobDescriptionChange) onJobDescriptionChange(val);
      else setLocalJobDesc(val);
    }
  };

  const handleSelfDescChange = (e) => {
    const val = e.target.value;
    if (onSelfDescriptionChange) onSelfDescriptionChange(val);
    else setLocalSelfDesc(val);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (onResumeChange) onResumeChange(file);
      else setLocalResume(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      // Validate file type (PDF or DOCX)
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (validTypes.includes(file.type) || fileExt === "pdf" || fileExt === "docx" || fileExt === "doc") {
        if (file.size <= 5 * 1024 * 1024) {
          if (onResumeChange) onResumeChange(file);
          else setLocalResume(file);
        } else {
          alert("File size exceeds 5MB limit.");
        }
      } else {
        alert("Please upload a PDF or DOCX file.");
      }
    }
  };

  const removeResume = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onResumeChange) onResumeChange(null);
    else setLocalResume(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobDesc.trim()) {
      alert("Please paste the job description (Target Job Description is required).");
      return;
    }
    if (!resume && !selfDesc.trim()) {
      alert("Either a Resume or a Self Description is required to generate a personalized plan.");
      return;
    }
    
    if (onSubmit) {
      onSubmit({ jobDesc, resume, selfDesc });
    } else {
      console.log("Submitting form: ", { jobDesc, resume, selfDesc });
      alert("Generating your custom interview plan...");
    }
  };

  // Validation helper
  const isFormValid = jobDesc.trim().length > 0 && (resume !== null || selfDesc.trim().length > 0);

  return (
    <div className="interview-plan-container">
      <header className="header-section">
        <h1 className="main-title">
          Create Your Custom <span className="highlight-text">Interview Plan</span>
        </h1>
        <p className="subtitle">
          Let our AI analyze the job requirements and your unique profile to build a winning strategy.
        </p>
      </header>

      <form className="plan-card" onSubmit={handleSubmit}>
        <div className="card-body">
          {/* Left Column: Target Job Description */}
          <div className="column-left">
            <div className="section-title-wrapper">
              <div className="title-left">
                {/* Briefcase SVG Icon */}
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <h2 className="section-title">Target Job Description</h2>
              </div>
              <span className="badge badge-required">REQUIRED</span>
            </div>

            <div className="textarea-container">
              <textarea
                placeholder="Paste the full job description here...&#10;e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                value={jobDesc}
                onChange={handleJobDescChange}
                disabled={isGenerating}
              />
              <div className="char-counter">
                {jobDesc.length} / 5000 chars
              </div>
            </div>
          </div>

          {/* Middle Vertical Divider (desktop only) */}
          <div className="vertical-divider" />

          {/* Right Column: Your Profile */}
          <div className="column-right">
            <div className="section-title-wrapper">
              <div className="title-left">
                {/* User Profile SVG Icon */}
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <h2 className="section-title">Your Profile</h2>
              </div>
            </div>

            {/* Resume Upload Sub-section */}
            <div className="profile-subsection">
              <div className="subsection-header">
                <span className="subsection-label">Upload Resume</span>
                <span className="badge badge-best">BEST RESULTS</span>
              </div>

              <div
                className={`dropzone ${isDragOver ? "drag-over" : ""} ${resume ? "has-file" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc"
                  style={{ display: "none" }}
                  disabled={isGenerating}
                />
                
                {!resume ? (
                  <div className="dropzone-content">
                    {/* Cloud Upload Icon */}
                    <div className="upload-icon-wrapper">
                      <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.5-2-2.4-3.5-4.5-3.5h-1.3C15.5 4.8 12.5 3 9 3 5.4 3 2.5 5.6 2.1 9.2C.8 10.4 0 12.1 0 14c0 3 2.5 5.5 5.5 5.5h13.5c2.2 0 4-1.8 4-4v-.5z" />
                        <polyline points="16 12 12 8 8 12" />
                        <line x1="12" y1="8" x2="12" y2="17" />
                      </svg>
                    </div>
                    <p className="primary-text">Click to upload or drag & drop</p>
                    <p className="secondary-text">PDF or DOCX (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="file-info-container">
                    <div className="file-details">
                      {/* Document Icon */}
                      <svg className="doc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      <div className="text-info">
                        <p className="file-name">{resume.name}</p>
                        <p className="file-size">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button type="button" className="remove-file-btn" onClick={removeResume} aria-label="Remove resume">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* OR Divider */}
            <div className="divider-container">
              <div className="line" />
              <span className="divider-text">OR</span>
              <div className="line" />
            </div>

            {/* Quick Self-Description Sub-section */}
            <div className="profile-subsection">
              <span className="subsection-label">Quick Self-Description</span>
              <div className="textarea-container">
                <textarea
                  className="self-desc-textarea"
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                  value={selfDesc}
                  onChange={handleSelfDescChange}
                  disabled={isGenerating}
                />
              </div>
            </div>

            {/* Info Warning Card */}
            <div className="info-card">
              <div className="info-icon-wrapper">
                {/* Info Icon */}
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <p className="info-text">
                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <footer className="card-footer">
          <div className="footer-left">
            <span className="footer-meta">AI-Powered Strategy Generation • Approx 30s</span>
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="spinner-wrapper">
                <span className="spinner" />
                Generating Plan...
              </span>
            ) : (
              <>
                <span className="star-icon">★</span>
                Generate My Interview Strategy
              </>
            )}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default InterviewPlanUI;
