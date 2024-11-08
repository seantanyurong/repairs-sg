"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CustomMenuButton } from "@/components/ui/customMenuButton";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";

export default function Comments({
  comments,
  currentUser
}: {
  comments?: { sender: string; content: string; }[];
  currentUser: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <CustomMenuButton className="w-[110%]" variant="ghost">View Comments</CustomMenuButton>
      </SheetTrigger>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle className="flex gap-2">
            Comments
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-9 py-9">
          </div>
          <div>
          <ChatMessageList>
            {comments?.map((comment, index) => (
              <ChatBubble key={index} variant={comment.sender === currentUser ? 'sent' : 'received'}>
                <ChatBubbleAvatar fallback={comment.sender} />
                <ChatBubbleMessage variant={comment.sender === currentUser ? 'sent' : 'received'}>
                  {comment.content}
                </ChatBubbleMessage>
              </ChatBubble>            
            ))}
          </ChatMessageList>
          <ChatInput
            placeholder="Type your message here..."
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
