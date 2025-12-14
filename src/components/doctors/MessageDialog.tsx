import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useConsultations } from '@/hooks/useConsultations';
import { format } from 'date-fns';

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultationId: string;
}

export const MessageDialog = ({ open, onOpenChange, consultationId }: MessageDialogProps) => {
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { messages, sendMessage, isLoadingMessages } = useConsultations(consultationId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessage.mutate({ consultationId, message: message.trim() }, {
      onSuccess: () => setMessage('')
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Consultation Messages</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4 py-4">
            {isLoadingMessages ? (
              <p className="text-center text-muted-foreground">Loading messages...</p>
            ) : messages?.length === 0 ? (
              <p className="text-center text-muted-foreground">No messages yet. Start the conversation!</p>
            ) : (
              messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.sender_id === user?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender_id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {format(new Date(msg.created_at!), 'HH:mm')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSend} className="flex gap-2 pt-4 border-t">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={sendMessage.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
