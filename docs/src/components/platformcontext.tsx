import BrowserOnly from "@docusaurus/BrowserOnly";
import { createContext, ReactNode, useContext, useState } from "react";

import "./platformcontext.css";

export type Platform = "mac" | "linux";

interface PlatformContextProps {
    platform: Platform;
    togglePlatform: () => void;
}

export const PlatformContext = createContext<PlatformContextProps | undefined>(undefined);

const detectPlatform = (): Platform => {
    const savedPlatform = localStorage.getItem("platform") as Platform | null;
    if (savedPlatform && (savedPlatform === "mac" || savedPlatform === "linux")) {
        return savedPlatform;
    }
    return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ? "mac" : "linux";
};

const PlatformProviderInternal = ({ children }: { children: ReactNode }) => {
    const [platform, setPlatform] = useState<Platform>(detectPlatform());

    const togglePlatform = () => {
        const newPlatform = platform === "mac" ? "linux" : "mac";
        setPlatform(newPlatform);
        localStorage.setItem("platform", newPlatform); // Store in localStorage
    };

    return <PlatformContext.Provider value={{ platform, togglePlatform }}>{children}</PlatformContext.Provider>;
};

export const PlatformProvider: React.FC = ({ children }: { children: ReactNode }) => {
    return (
        <BrowserOnly fallback={<div />}>
            {() => <PlatformProviderInternal>{children}</PlatformProviderInternal>}
        </BrowserOnly>
    );
};

export const usePlatform = (): PlatformContextProps => {
    const context = useContext(PlatformContext);
    if (!context) {
        throw new Error("usePlatform must be used within a PlatformProvider");
    }
    return context;
};

const PlatformToggleButtonInternal: React.FC = () => {
    const { platform, togglePlatform } = usePlatform();

    return (
        <div className="pill-toggle">
            <button
                className={`pill-option ${platform === "mac" ? "active" : ""}`}
                onClick={() => platform !== "mac" && togglePlatform()}
            >
                MacOS
            </button>
            <button
                className={`pill-option ${platform === "linux" ? "active" : ""}`}
                onClick={() => platform !== "linux" && togglePlatform()}
            >
                Linux/Windows
            </button>
        </div>
    );
};

export const PlatformToggleButton: React.FC = () => {
    return <BrowserOnly fallback={<div />}>{() => <PlatformToggleButtonInternal />}</BrowserOnly>;
};
