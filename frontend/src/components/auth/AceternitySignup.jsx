import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "../ui/canvas-text";
import {
    IconBrandGithub,
    IconBrandGoogle,
} from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AceternitySignup({ onSwitchToLogin, onClose }) {
    const { register: registerUser, loginWithGoogle, loginWithGithub, loading } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const { username, email, password, confirmPassword } = formData;

        if (!username || !email || !password) {
            setError("Please fill in all fields");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        const result = await registerUser(username, email, password, username);
        if (result.success) {
            setTimeout(() => {
                onClose?.();
                navigate("/");
            }, 1500);
        } else {
            setError(result.message || "Registration failed");
        }
    };

    const handleGoogle = async () => {
        setError("");
        const result = await loginWithGoogle();
        if (result.success) {
            onClose?.();
            navigate("/");
        }
    };

    const handleGithub = async () => {
        setError("");
        const result = await loginWithGithub();
        if (result.success) {
            onClose?.();
            navigate("/");
        }
    };

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black border border-white/10 relative z-20">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                Welcome to Hushh
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                Join a new realm of global social discovery.
            </p>

            <form className="my-8" onSubmit={handleSubmit}>
                {/* Quick sign-up with Social */}
                <div className="flex flex-col space-y-3 mb-6">
                    <button
                        onClick={handleGoogle}
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] disabled:opacity-50"
                        type="button"
                        disabled={loading}
                    >
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            Sign up with Google
                        </span>
                        <BottomGradient />
                    </button>
                    <button
                        onClick={handleGithub}
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] disabled:opacity-50"
                        type="button"
                        disabled={loading}
                    >
                        <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            Sign up with GitHub
                        </span>
                        <BottomGradient />
                    </button>
                </div>

                <div className="my-6 flex items-center">
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
                    <span className="px-4 text-xs text-neutral-400">or with email</span>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
                </div>

                {/* Email form */}
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        placeholder="cooluser123"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        placeholder="you@example.com"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        placeholder="••••••••"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </LabelInputContainer>

                {error && (
                    <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
                )}

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Creating account...</span>
                        </div>
                    ) : (
                        <>Sign up →</>
                    )}
                    <BottomGradient />
                </button>

                {onSwitchToLogin && (
                    <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Already have an account?{" "}
                            <button type="button" onClick={onSwitchToLogin} className="font-semibold text-blue-500 hover:text-blue-400">
                                Login →
                            </button>
                        </p>
                    </div>
                )}
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({ children, className }) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};
