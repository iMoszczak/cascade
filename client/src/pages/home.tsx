import { Shield } from "lucide-react";
import { ChatInterface } from "@/components/chat-interface";
import { CipherTool } from "@/components/cipher-tool";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation Bar */}
      <nav className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8" />
              <h1 className="text-xl font-bold">Cascade Cipher</h1>
            </div>
            <div className="text-sm opacity-90">
              Secure Communication Tool
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChatInterface />
          <CipherTool />
        </div>

        {/* Example Usage Section */}
        <div className="mt-12">
          <div className="bg-card rounded-lg shadow-lg border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                Usage Examples
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-3">Encryption Example</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div><strong>Input:</strong> "DUPA"</div>
                    <div><strong>Key:</strong> "KOD"</div>
                    <div><strong>Start Number:</strong> 3</div>
                    <div><strong>Reverse Groups:</strong> Yes</div>
                    <div className="pt-2 border-t border-border"><strong>Output:</strong> "XUQKC"</div>
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-3">Chat Example</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div><strong>Message:</strong> "TEST"</div>
                    <div><strong>Key:</strong> "KOD"</div>
                    <div><strong>Start Number:</strong> 3</div>
                    <div><strong>Encrypted:</strong> "XQWAW"</div>
                    <div className="pt-2 border-t border-border"><strong>Received & Decrypted:</strong> "TEST"</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
