import { useState, useEffect } from "react";
import "./App.css";
import PensionPage from "./pages/PensionPage";
import sessionService from "./service/sessionService";
import type { conversation, Session } from "./types/Session";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [conversation, setConversation] = useState<conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessionAndConversation = async () => {
      try {
        const fetchedSession = await sessionService.fetchSession();
        if (!fetchedSession?.session_id) {
          throw new Error("Session fetch failed or invalid session_id");
        }

        setSession(fetchedSession);
        localStorage.setItem("sessionId", fetchedSession.session_id as string);
        console.log("Session ID:", fetchedSession.session_id);

        const fetchedConversation = await sessionService.fetchConversation();
        console.log("convo ID:", fetchedConversation);
        if (!fetchedConversation?.id) {
          throw new Error("Conversation fetch failed or invalid id");
        }

        setConversation(fetchedConversation);
        localStorage.setItem("ConversationId", fetchedConversation.id as string);
        console.log("Conversation ID:", fetchedConversation.id);

      } catch (err) {
        console.error("Error during session/conversation loading:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSessionAndConversation();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading session and conversation...</div>;
  }

  if (!session || !conversation) {
    return (
      <div className="text-center p-10 text-red-600">
        Failed to load session or conversation.
      </div>
    );
  }

  return <PensionPage/>;
}

export default App;
