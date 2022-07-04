import React, { useContext, createContext, useState, FC } from 'react';

export type Message = {
    level: 'error' | 'info' | 'success';
    message: React.ReactNode;
    id?: string | number;
};

export type Messages = Array<Message>;
export type HandleChangeMessages = (
    setter: Messages | ((messages: Messages) => Messages)
) => void;

const DEFAULT_CTX: {
    messages: Array<Message>;
    handleChangeMessages: HandleChangeMessages;
} = {
    messages: [],
    handleChangeMessages: () => {},
};

const MessagesCtx = createContext(DEFAULT_CTX);

export const MessagesProvider = ({ children }: React.PropsWithChildren) => {
    const [messages, setMessages] = useState<Messages>([]);

    const handleChangeMessages: HandleChangeMessages = (setter) => {
        setMessages(setter);
    };

    return (
        <MessagesCtx.Provider
            value={{
                messages,
                handleChangeMessages,
            }}
        >
            {children}
        </MessagesCtx.Provider>
    );
};

export const useMessages = () => {
    const { messages, handleChangeMessages } = useContext(MessagesCtx);

    return {
        messages,
        handleChangeMessages,
    };
};
