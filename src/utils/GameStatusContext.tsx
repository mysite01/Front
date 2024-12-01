import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameStatusContextType {
    isGameStarted: boolean;
    setIsGameStarted: (value: boolean) => void;
}

const GameStatusContext = createContext<GameStatusContextType | undefined>(undefined);

interface GameStatusProviderProps {
    children: ReactNode;
}

export const GameStatusProvider: React.FC<GameStatusProviderProps> = ({ children }) => {
    const [isGameStarted, setIsGameStarted] = useState(false);
    React.useEffect(() => {
        console.log('Game status changed: Context Tessss....', isGameStarted);
    }, [isGameStarted]);

    return (
        <GameStatusContext.Provider value={{ isGameStarted, setIsGameStarted }}>
            {children}
        </GameStatusContext.Provider>
    );
};

export const useGameStatus = (): GameStatusContextType => {
    const context = useContext(GameStatusContext);
    if (!context) {
        throw new Error('useGameStatus must be used within a GameStatusProvider');
    }
    return context;
};
