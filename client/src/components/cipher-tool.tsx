import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Key, Lock, Unlock, Info, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { CipherRequest } from "@shared/schema";

export function CipherTool() {
  const [key, setKey] = useState("");
  const [startNumber, setStartNumber] = useState<number>(3);
  const [inputText, setInputText] = useState("");
  const [reverseGroups, setReverseGroups] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const { toast } = useToast();

  const cipherMutation = useMutation({
    mutationFn: async (request: CipherRequest) => {
      const response = await apiRequest("POST", "/api/cipher", request);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data.result);
      setError("");
    },
    onError: (error: any) => {
      setError(error.message || "Cipher operation failed");
      setResult("");
    },
  });

  const validateInputs = (): boolean => {
    if (!key.trim()) {
      setError("Key is required");
      return false;
    }
    
    if (!/^[A-Z]+$/i.test(key)) {
      setError("Key must contain only letters A-Z");
      return false;
    }
    
    if (key.length < 3) {
      setError("Key must be at least 3 characters long");
      return false;
    }
    
    if (!inputText.trim()) {
      setError("Input text is required");
      return false;
    }
    
    if (!/^[A-Z\s]*$/i.test(inputText)) {
      setError("Text must contain only letters A-Z and spaces");
      return false;
    }
    
    if (isNaN(startNumber)) {
      setError("Start number must be a valid number");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleOperation = (operation: "encrypt" | "decrypt") => {
    if (!validateInputs()) return;

    const request: CipherRequest = {
      text: inputText.toUpperCase(),
      key: key.toUpperCase(),
      startNumber,
      reverseGroups,
      operation,
    };

    cipherMutation.mutate(request);
  };

  return (
    <div className="bg-card rounded-lg shadow-lg border border-border">
      <div className="bg-primary text-primary-foreground px-6 py-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Key className="w-5 h-5 mr-2" />
          Encryption/Decryption Tool
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Tool Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="tool-key" className="block text-sm font-medium text-foreground mb-2">Cipher Key</Label>
            <Input
              id="tool-key"
              type="text"
              placeholder="Enter key (A-Z only)"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              data-testid="input-tool-key"
            />
          </div>
          <div>
            <Label htmlFor="tool-start-number" className="block text-sm font-medium text-foreground mb-2">Start Number</Label>
            <Input
              id="tool-start-number"
              type="number"
              placeholder="Enter number"
              value={startNumber}
              onChange={(e) => setStartNumber(parseInt(e.target.value) || 0)}
              data-testid="input-tool-start-number"
            />
          </div>
          <div className="flex items-end">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tool-reverse-groups"
                checked={reverseGroups}
                onCheckedChange={(checked) => setReverseGroups(checked === true)}
                data-testid="checkbox-tool-reverse-groups"
              />
              <Label htmlFor="tool-reverse-groups" className="text-sm text-foreground">
                Reverse Groups
              </Label>
            </div>
          </div>
        </div>

        {/* Input Text Area */}
        <div>
          <Label htmlFor="tool-input-text" className="block text-sm font-medium text-foreground mb-2">Input Text</Label>
          <Textarea
            id="tool-input-text"
            placeholder="Enter text to encrypt/decrypt (A-Z and spaces only)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="h-24 resize-none"
            data-testid="textarea-tool-input"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            onClick={() => handleOperation("encrypt")}
            disabled={cipherMutation.isPending}
            className="flex-1 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
            data-testid="button-encrypt"
          >
            <Lock className="w-4 h-4 mr-2" />
            {cipherMutation.isPending ? "Processing..." : "Encrypt"}
          </Button>
          <Button
            onClick={() => handleOperation("decrypt")}
            disabled={cipherMutation.isPending}
            variant="secondary"
            className="flex-1"
            data-testid="button-decrypt"
          >
            <Unlock className="w-4 h-4 mr-2" />
            {cipherMutation.isPending ? "Processing..." : "Decrypt"}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-4 py-3">
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span data-testid="text-tool-error">{error}</span>
            </div>
          </div>
        )}

        {/* Result Display */}
        <div>
          <Label htmlFor="tool-result" className="block text-sm font-medium text-foreground mb-2">Result</Label>
          <div
            id="tool-result"
            className="w-full px-4 py-3 bg-muted border border-border rounded-md min-h-[80px] text-sm"
            data-testid="text-tool-result"
          >
            {result || (
              <div className="text-muted-foreground italic">
                Result will appear here after encryption/decryption
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Information */}
        <div className="bg-muted rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center">
            <Info className="w-4 h-4 mr-2" />
            Cascade Cipher Info
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Key assigns numbers to letters (first letter = 1, second = 2, etc.)</li>
            <li>• Remaining alphabet letters follow in order</li>
            <li>• Each letter's cipher value = (letter value + previous cipher/start) mod 26</li>
            <li>• Optional: group into 5-letter blocks, pad with X, reverse each group</li>
            <li>• Supports A-Z and spaces only</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
