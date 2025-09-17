import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Lock, Unlock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Message, InsertMessage, CipherRequest } from "@shared/schema";

export function ChatInterface() {
  const [message, setMessage] = useState("");
  const [chatKey, setChatKey] = useState("");
  const [startNumber, setStartNumber] = useState<number>(3);
  const [reverseGroups, setReverseGroups] = useState(false);
  const [error, setError] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    refetchInterval: 1000, // Poll for new messages
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: InsertMessage) => {
      const response = await apiRequest("POST", "/api/messages", messageData);
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Decrypt message mutation
  const decryptMutation = useMutation({
    mutationFn: async (request: CipherRequest) => {
      const response = await apiRequest("POST", "/api/cipher", request);
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Message Decrypted",
        description: `Decrypted text: ${data.result}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Decryption Error",
        description: error.message || "Failed to decrypt message",
        variant: "destructive",
      });
    },
  });

  const validateInputs = (): boolean => {
    if (!chatKey.trim()) {
      setError("Key is required");
      return false;
    }
    
    if (!/^[A-Z]+$/.test(chatKey.toUpperCase())) {
      setError("Key must contain only letters A-Z");
      return false;
    }
    
    if (chatKey.length < 3) {
      setError("Key must be at least 3 characters long");
      return false;
    }
    
    if (!message.trim()) {
      setError("Message is required");
      return false;
    }
    
    if (!/^[A-Z\s]*$/i.test(message)) {
      setError("Message must contain only letters A-Z and spaces");
      return false;
    }
    
    if (isNaN(startNumber)) {
      setError("Start number must be a valid number");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleEncryptAndSend = async () => {
    if (!validateInputs()) return;

    try {
      // First encrypt the message
      const encryptRequest: CipherRequest = {
        text: message.toUpperCase(),
        key: chatKey.toUpperCase(),
        startNumber,
        reverseGroups,
        operation: "encrypt",
      };

      const encryptResponse = await apiRequest("POST", "/api/cipher", encryptRequest);
      const { result: encryptedText } = await encryptResponse.json();

      // Then send the encrypted message
      const messageData: InsertMessage = {
        sender: "You",
        content: encryptedText,
        isEncrypted: true,
        cipherKey: chatKey.toUpperCase(),
        startNumber,
        reverseGroups,
      };

      sendMessageMutation.mutate(messageData);
    } catch (error: any) {
      setError(error.message || "Failed to encrypt and send message");
    }
  };

  const handleDecrypt = async (msg: Message) => {
    if (!msg.cipherKey || msg.startNumber === null || msg.startNumber === undefined) {
      toast({
        title: "Cannot Decrypt",
        description: "Message is missing encryption parameters",
        variant: "destructive",
      });
      return;
    }

    const decryptRequest: CipherRequest = {
      text: msg.content,
      key: msg.cipherKey,
      startNumber: msg.startNumber,
      reverseGroups: msg.reverseGroups || false,
      operation: "decrypt",
    };

    decryptMutation.mutate(decryptRequest);
  };

  return (
    <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden">
      <div className="bg-primary text-primary-foreground px-6 py-4">
        <h2 className="text-lg font-semibold flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Encrypted Chat
        </h2>
      </div>

      {/* Chat Messages Area */}
      <div className="chat-container p-4 bg-muted space-y-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground">No messages yet</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
              <div className={`message-bubble px-4 py-2 rounded-lg ${
                msg.sender === "You" ? "user-message" : "other-message"
              }`}>
                <div className={`text-sm font-medium mb-1 ${
                  msg.sender === "You" ? "opacity-90" : "text-muted-foreground"
                }`}>
                  {msg.sender}
                </div>
                <div className="text-sm" data-testid={`message-content-${msg.id}`}>{msg.content}</div>
                <div className={`text-xs mt-1 ${
                  msg.sender === "You" ? "opacity-75" : "text-muted-foreground"
                }`}>
                  {msg.isEncrypted ? "Encrypted" : "Decrypted"} • {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {msg.isEncrypted && msg.sender !== "You" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-accent hover:text-accent/80 mt-1 p-0 h-auto"
                    onClick={() => handleDecrypt(msg)}
                    disabled={decryptMutation.isPending}
                    data-testid={`button-decrypt-${msg.id}`}
                  >
                    {decryptMutation.isPending ? "Decrypting..." : "Decrypt"}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Input Section */}
      <div className="p-4 bg-card border-t border-border">
        {/* Encryption Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <Label htmlFor="chat-key" className="block text-sm font-medium text-foreground mb-1">Key</Label>
            <Input
              id="chat-key"
              type="text"
              placeholder="e.g., KOD"
              value={chatKey}
              onChange={(e) => setChatKey(e.target.value)}
              data-testid="input-chat-key"
            />
          </div>
          <div>
            <Label htmlFor="chat-start-number" className="block text-sm font-medium text-foreground mb-1">Start Number</Label>
            <Input
              id="chat-start-number"
              type="number"
              placeholder="3"
              value={startNumber}
              onChange={(e) => setStartNumber(parseInt(e.target.value) || 0)}
              data-testid="input-chat-start-number"
            />
          </div>
          <div className="flex items-end">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="chat-reverse-groups"
                checked={reverseGroups}
                onCheckedChange={(checked) => setReverseGroups(checked === true)}
                data-testid="checkbox-chat-reverse-groups"
              />
              <Label htmlFor="chat-reverse-groups" className="text-sm text-foreground">
                Reverse Groups
              </Label>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-3">
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2" data-testid="text-chat-error">
              {error}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="flex space-x-3">
          <Input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEncryptAndSend()}
            className="flex-1"
            data-testid="input-chat-message"
          />
          <Button
            onClick={handleEncryptAndSend}
            disabled={sendMessageMutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
            data-testid="button-encrypt-send"
          >
            <Lock className="w-4 h-4 mr-2" />
            {sendMessageMutation.isPending ? "Sending..." : "Encrypt & Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
