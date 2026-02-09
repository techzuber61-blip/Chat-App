import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { useChatStore } from "../store/useChatStore";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatList from "../components/ChatList";
import ContactList from "../components/ContactList";
import ProfileHeader from "../components/ProfileHeader";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const {activeTab, selectedUser} = useChatStore();
  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        <div className="w-full flex flex-col md:flex-row">
          {/* FORM CLOUMN - LEFT SIDE */}
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatList /> : <ContactList />}
          </div>

          {/* FORM CLOUMN - RIGHT SIDE */}
          <div className="flex-1 flex flex-col bg-slate-900">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
          
        </div>
      </BorderAnimatedContainer>

      
    </div>
  )
}

export default ChatPage