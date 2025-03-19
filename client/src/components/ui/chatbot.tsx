import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Define message structure
interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hi there! 👋 How can I help you with your property search today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the messages when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Common property-related questions and responses
  const quickResponses: Record<string, string> = {
    'property': 'We have properties available in various locations. Would you like to search by location, price range, or property type?',
    'rent': 'We have rental properties starting from ₹8,000 per month. What\'s your budget and preferred location?',
    'buy': 'Looking to buy a property? Great! We have options ranging from apartments to villas. What\'s your budget and preferred area?',
    'sell': 'Want to sell your property? You can list it on our platform for free. Would you like to learn more about our selling process?',
    'price': 'Property prices vary by location and type. Can you tell me which area you\'re interested in?',
    'agent': 'We have verified agents who can help you. Would you like to be connected with one?',
    'loan': 'We have partnerships with major banks for home loans. Would you like to know more about our loan options?',
    'apartments': 'We have various apartment options. What size (1BHK, 2BHK, 3BHK) are you looking for?',
    'house': 'Independent houses are available in many neighborhoods. Any particular area you\'re interested in?',
    'commercial': 'We have commercial properties for both sale and lease. What kind of business space are you looking for?'
  };

  // Handle message submission
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Bot typing indicator
    setIsTyping(true);
    
    // Simulate bot response
    setTimeout(() => {
      let botResponse = 'I\'m not sure about that. Can you try asking something related to properties, buying, selling, or renting?';
      
      // Check for keywords in the user's message
      const lowerInput = inputValue.toLowerCase();
      
      for (const [keyword, response] of Object.entries(quickResponses)) {
        if (lowerInput.includes(keyword)) {
          botResponse = response;
          break;
        }
      }
      
      // Special cases
      if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        botResponse = 'Hello! How can I assist you with your property needs today?';
      } else if (lowerInput.includes('thank')) {
        botResponse = 'You\'re welcome! Is there anything else I can help you with?';
      } else if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
        botResponse = 'Thank you for chatting! Feel free to return if you have more questions.';
      }
      
      const newBotMessage: Message = {
        id: Date.now().toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
      
      {/* Chat window */}
      <div 
        className={cn(
          "fixed bottom-24 right-6 z-40 w-80 md:w-96 bg-white rounded-lg shadow-xl transition-all duration-300 transform",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        {/* Chat header */}
        <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Property Assistant</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
        
        {/* Chat messages */}
        <div className="p-4 h-96 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "mb-3 max-w-[80%] rounded-lg p-3",
                message.sender === 'user' 
                  ? "bg-primary/10 text-gray-800 ml-auto" 
                  : "bg-white text-gray-800 border border-gray-200"
              )}
            >
              {message.text}
              <div 
                className={cn(
                  "text-xs mt-1", 
                  message.sender === 'user' ? "text-gray-600" : "text-gray-500"
                )}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex space-x-2 bg-white border border-gray-200 p-3 rounded-lg max-w-[80%] mb-3">
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat input */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow mr-2"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}