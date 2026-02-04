import { useAuthStore } from "../store/useAuthStore";

function ChatPage() {
  const {logout} = useAuthStore();
  return (
    <div>ChatPage

      <button onClick={logout} className="z-50 absolute top-4 right-4">Logout</button>
    </div>
  )
}

export default ChatPage