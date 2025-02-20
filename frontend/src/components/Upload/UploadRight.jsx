import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Youtube, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import styles from './UploadRight.module.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.modalClose}>
          <X size={20} />
        </button>
        <h2 className={styles.modalTitle}>{title}</h2>
        {children}
      </div>
    </div>
  );
};

const UploadRight = ({ projectId, token }) => {
  const [showRssModal, setShowRssModal] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: 'file',
      uploadDate: new Date().toLocaleString(),
      file
    }));
    
    handleFileUpload(newFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav'],
      'video/*': ['.mp4', '.mov'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'text/plain': ['.txt']
    }
  });

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/content`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch files');
      
      const data = await response.json();
      const transformedFiles = data.content.map(item => ({
        id: item._id,
        name: item.type === 'youtube' ? 'YouTube Video' : item.type === 'rss' ? 'RSS Feed' : item.fileName,
        type: item.type,
        url: item.url || item.fileUrl,
        uploadDate: new Date(item.createdAt).toLocaleString()
      }));
      
      setFiles(transformedFiles);
    } catch (err) {
      setError('Failed to fetch files');
    }
  };

  const handleFileUpload = async (newFiles) => {
    try {
      setLoading(true);
      setError('');

      for (const fileData of newFiles) {
        const formData = new FormData();
        formData.append('file', fileData.file);

        const response = await fetch(`/api/projects/${projectId}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        setFiles(prev => [...prev, {
          id: data.content._id,
          name: fileData.name,
          type: 'file',
          uploadDate: new Date().toLocaleString()
        }]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (type) => {
    try {
      setLoading(true);
      setError('');
      
      const endpoint = `http://localhost:5000/api/upload/${type}/${projectId}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const newFile = {
        id: data.content[data.content.length - 1]._id,
        name: type === 'youtube' ? 'YouTube Video' : 'RSS Feed',
        type: type,
        url: url,
        uploadDate: new Date().toLocaleString()
      };

      setFiles(prev => [...prev, newFile]);
      setUrl('');
      type === 'rss' ? setShowRssModal(false) : setShowYoutubeModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      const response = await fetch(`https://skai-lama-2g0p.onrender.com/api/projects/${projectId}/content/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Delete failed');

      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  const handleView = (file) => {
    if (file.type === 'rss' || file.type === 'youtube') {
      window.open(file.url, '_blank');
    } else if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <a href="/">Home Page</a> / <a href="/sample">Sample Project</a> / <span>Add your podcast</span>
      </div>
      
      <h1 className={styles.header}>Add Podcast</h1>
      
      <div className={styles.cardGrid}>
        <div className={styles.card} onClick={() => setShowRssModal(true)}>
          <div className={styles.cardContent}>
            <div className={styles.cardText}>
              <h2 className={styles.cardTitle}>RSS Feed</h2>
              <p className={styles.cardDescription}>Lorem ipsum dolor sit. Dolor lorem sit.</p>
            </div>
            <div className={`${styles.iconContainer} ${styles.rss}`}>
              <Upload className={styles.icon} />
            </div>
          </div>
        </div>

        <div className={styles.card} onClick={() => setShowYoutubeModal(true)}>
          <div className={styles.cardContent}>
            <div className={styles.cardText}>
              <h2 className={styles.cardTitle}>Youtube Video</h2>
              <p className={styles.cardDescription}>Lorem ipsum dolor sit. Dolor lorem sit.</p>
            </div>
            <div className={`${styles.iconContainer} ${styles.youtube}`}>
              <Youtube className={styles.icon} />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.cardText}>
              <h2 className={styles.cardTitle}>Upload Files</h2>
              <p className={styles.cardDescription}>Lorem ipsum dolor sit. Dolor lorem sit.</p>
            </div>
            <div className={`${styles.iconContainer} ${styles.uploadIcon}`}>
              <Upload className={`${styles.icon} ${styles.uploadIconColor}`} />
            </div>
          </div>
        </div>
      </div>

      <div 
        {...getRootProps()} 
        className={`${styles.uploadArea} ${isDragActive ? styles.uploadAreaActive : ''}`}
      >
        <input {...getInputProps()} />
        {/* <div className={styles.uploadContent}>
          <Upload size={48} className={styles.uploadIconColor} />
          <h3>Select a file or drag and drop here</h3>
          <p>MP4, MOV, MP3, WAV, PDF, DOCX or TXT file</p>
          <button className={styles.selectButton}>Select File</button>
        </div> */}
      </div>

      <div className={styles.filesSection}>
        <h2 className={styles.filesHeader}>Your Files</h2>
        {error && <div className={styles.error}>{error}</div>}
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Upload Date & Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={file.id} className={styles.tableRow}>
                <td>{index + 1}</td>
                <td>{file.name}</td>
                <td>{file.uploadDate}</td>
                <td>
                  <button 
                    className={`${styles.actionButton} ${styles.viewButton}`}
                    onClick={() => handleView(file)}
                  >
                    View
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDelete(file.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showRssModal}
        onClose={() => {
          setShowRssModal(false);
          setError('');
          setUrl('');
        }}
        title="Add RSS Feed"
      >
        {error && <div className={styles.error}>{error}</div>}
        <input
          type="url"
          placeholder="Enter RSS feed URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={styles.input}
          disabled={loading}
        />
        <button 
          onClick={() => handleSubmit('rss')} 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Feed'}
        </button>
      </Modal>

      <Modal
        isOpen={showYoutubeModal}
        onClose={() => {
          setShowYoutubeModal(false);
          setError('');
          setUrl('');
        }}
        title="Add YouTube Video"
      >
        {error && <div className={styles.error}>{error}</div>}
        <input
          type="url"
          placeholder="Enter YouTube video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={styles.input}
          disabled={loading}
        />
        <button 
          onClick={() => handleSubmit('youtube')} 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Video'}
        </button>
      </Modal>
    </div>
  );
};

export default UploadRight;