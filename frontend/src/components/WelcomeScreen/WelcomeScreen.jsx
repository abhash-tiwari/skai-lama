import React, { useState } from "react";
import homestyle from "./WelcomeScreen.module.css";
import masked from "../../assets/Mask group.png";
import logo from "../../assets/QuesLogo 1.png";
import logo2 from "../../assets/Group 22.png";
import google from "../../assets/image 6.png";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const url = isRegistering ? "https://skai-lama-2g0p.onrender.com/api/auth/register" : "https://skai-lama-2g0p.onrender.com/api/auth/login";
        const payload = isRegistering ? { name, email, password } : { email, password };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            if (!isRegistering) {
                localStorage.setItem("token", data.token);
                navigate("/projects");
            } else {
                setIsRegistering(false);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={homestyle.mainContainer}>
            <div className={homestyle.left}>
                <div className={homestyle.imageContainer}>
                    <img src={masked} alt="Masked overlay" className={homestyle.maskedImage} />
                </div>
                <div className={homestyle.data}>
                    <img src={logo} alt="logo" className={homestyle.logo} />
                    <p className={homestyle.details}>Your podcast <br /> will no longer<br /> be just a hobby</p>
                    <p className={homestyle.subtitle}>Supercharge Your Distribution <br /> using your AI assistant!</p>
                </div>
            </div>
            <div className={homestyle.right}>
                <img src={logo2} alt="Logo" className={homestyle.image2} />
                <p className={homestyle.intro}>Welcome to <br /><span className={homestyle.introQ}>Quest.AI</span></p>

                <form className={homestyle.formData} onSubmit={handleAuth}>
                    {isRegistering && (
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className={homestyle.inputTag} 
                        />
                    )}
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className={homestyle.inputTag} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className={homestyle.inputTag} 
                    />
                    {error && <p className={homestyle.error}>{error}</p>}
                    <button 
                        className={homestyle.button} 
                        type="submit" 
                        disabled={loading} 
                    >
                        {loading ? <span className={homestyle.loader}></span> : (isRegistering ? "Register" : "Login")}
                    </button>
                </form>

                {!isRegistering && (
                    <div className={homestyle.googleDiv}>
                        <img src={google} alt="" className={homestyle.googleImg} />
                        <p className={homestyle.googleName}>Continue with Google</p>
                    </div>
                )}
                <p className={homestyle.noAccount}>
                    {isRegistering ? "Already have an account? " : "Don’t have an account? "}
                    <span className={homestyle.createAccount} onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? "Login" : "Create Account"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default WelcomeScreen;
