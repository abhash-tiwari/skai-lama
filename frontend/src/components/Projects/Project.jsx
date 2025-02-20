import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import project from "./Project.module.css";
import logo from "../../assets/colorlogo.png";
import notification from "../../assets/notifications.png";
import setting from "../../assets/icon.png";
import plus from "../../assets/Vector (12).png";
import group from "../../assets/Group 16.png";
import axios from "axios";

const Project = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [projects, setProjects] = useState([]);
    const [projectCount, setProjectCount] = useState(0);
    const [showProjects, setShowProjects] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/projects", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects(response.data);
            setProjectCount(response.data.length);
            if (response.data.length > 0) {
                setShowProjects(true);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const handleModal = () => {
        setModal(!modal);
    };

    const handleProject = async () => {
        if (!projectName) {
            setError("Project Name is Required!");
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:5000/api/projects", { name: projectName }, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            if (response.status === 201 || response.status === 200) {
                setSuccess("Project created successfully");
                setProjectName("");
                setModal(false);
                fetchProjects(); 
                setShowProjects(true); 
            } else {
                setError("Unexpected response from server.");
            }
        } catch (error) {
            console.error("Error creating project:", error.response?.data || error.message);
            setError(error.response?.data?.error || "Failed to create project. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleProjectClick = (projectId) => {
        navigate(`/upload/${projectId}`);
    };

    return (
        <div className={project.container}>
            <div className={project.header}>
                <div>
                    <img src={logo} alt="Logo" className={project.logo} />
                </div>
                <div className={project.icons}>
                    <img src={setting} alt="Settings" className={project.icon} />
                    <img src={notification} alt="Notifications" className={project.icon} />
                </div>
            </div>
            {showProjects ? (
                <div className={project.projectsSection}>
                    <div className={project.projectsHeader}>
                        <h1>Projects</h1>
                        <button className={project.buttonTag} onClick={handleModal}>
                            <img src={plus} alt="Addition" className={project.add} />Create New Project
                        </button>
                    </div>
                    <div className={project.projectCountCard}>
                        <h2>Total Projects</h2>
                        <p>{projectCount}</p>
                    </div>
                    <div className={project.projectsGrid}>
                    {projects.map((project) => (
    <div
        key={project._id}
        className={project.projectCard}
        onClick={() => handleProjectClick(project._id)}
    >
        <div className={project.projectIcon}>
            {project.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
        </div>
        <div className={project.projectInfo}>
            <h3 className={project.projectName}>{project.name}</h3>
            <p className={project.projectDetails}>{project.files || 0} Files</p>
            <p className={project.projectDetails}>Last edited {project.lastEdited || 'a week ago'}</p>
        </div>
    </div>
))}
                    </div>
                </div>
            ) : (
                <div className={project.details}>
                    <h1 className={project.heading}>Create a New Project</h1>
                    <img src={group} alt="Group Photo" className={project.mainImg} />
                    <p className={project.lorem}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae impedit quibusdam quisquam quidem, excepturi deserunt maiores nostrum odio aspernatur veniam. Maiores excepturi inventore error a quaerat autem in magnam voluptate.
                    </p>
                    <button className={project.buttonTag} onClick={handleModal}>
                        <img src={plus} alt="Addition" className={project.add} />Create New Project
                    </button>
                </div>
            )}
            {modal && (
                <div className={project.modalOverlay}>
                    <div className={project.modalContent}>
                        <h1>Create Project</h1>
                        <div className={project.inputData}>
                            <label>Enter Project Name:</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                            {error && <p className={project.error}>{error}</p>}
                            {success && <p className={project.success}>{success}</p>}
                        </div>
                        <div className={project.buttonDiv}>
                            <button onClick={handleModal}>Cancel</button>
                            <button
                                onClick={handleProject}
                                disabled={loading}
                                className={project.createButton}
                            >
                                {loading ? <span className={project.loader}></span> : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Project;