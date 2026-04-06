import { useEffect, useState } from "react";
import type { Conversation } from "../../types/chat";
import { getUserConversations } from "../../api/chat.api";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { getSocket } from "../../socket";
import { Avatar } from "../ui/Avatar";

const ChatBar = () => {
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const response = await getUserConversations();
        setConversations(response);
      } catch (error) {
        console.log("Failed to fetch your conversations");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();

    const socket = getSocket();

    socket?.on("conversation_updated", loadConversations);

    return () => {
      socket?.off("conversation_updated", loadConversations);
    };
  }, []);

  return (
    <div className="hidden xl:flex w-72 shrink-0 h-full border-l border-border bg-card text-card-foreground flex-col">
      <h2 className="px-4 pb-3 text-lg font-semibold border-b border-border my-4">
        Chats
      </h2>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : conversations.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center mt-6">
          No conversations yet
        </p>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const otherUser = conv.participants.find(
              (p) => p._id !== loggedInUser?._id,
            );

            return (
              <div
                key={conv._id}
                onClick={() => navigate(`/chat/${otherUser?._id}`)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer transition-colors"
              >
                {/* Avatar */}
                <Avatar src={otherUser?.profileImage} alt={otherUser?.username} />

                {/* Text Section */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium truncate text-foreground">
                      {otherUser?.username}
                    </span>

                    {/* Unread Badge */}
                    {conv.unreadCount > 0 && (
                      <span className="bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-muted-foreground truncate">
                    {conv.lastMessage?.text || "Image"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatBar;
