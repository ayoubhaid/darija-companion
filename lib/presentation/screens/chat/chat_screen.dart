import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../core/constants/app_colors.dart';
import '../../widgets/chat_message.dart';
import '../../widgets/chat_input.dart';

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _messageController = TextEditingController();
  bool _isTyping = false;

  @override
  void initState() {
    super.initState();
    // Send welcome message
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _addBotMessage(
        "مرحبا! أنا مساعدك لتعلم الدارجة المغربية. كيف يمكنني مساعدتك اليوم؟",
        "Hello! I'm your assistant for learning Moroccan Darija. How can I help you today?",
      );
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: AppColors.accent,
              child: Icon(
                Icons.smart_toy,
                color: AppColors.textOnPrimary,
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Darija AI',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Conversation Practice',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert),
            onPressed: () {
              _showChatOptions();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Chat Messages
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                return ChatMessage(
                  message: message,
                  onTap: () {
                    // TODO: Handle message tap (e.g., pronunciation)
                  },
                )
                    .animate()
                    .fadeIn(duration: 300.ms)
                    .slideX(begin: message.isUser ? 0.3 : -0.3, end: 0);
              },
            ),
          ),
          
          // Typing Indicator
          if (_isTyping)
            Container(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 16,
                    backgroundColor: AppColors.accent,
                    child: Icon(
                      Icons.smart_toy,
                      size: 16,
                      color: AppColors.textOnPrimary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _buildTypingDot(0),
                        const SizedBox(width: 4),
                        _buildTypingDot(1),
                        const SizedBox(width: 4),
                        _buildTypingDot(2),
                      ],
                    ),
                  ),
                ],
              ),
            )
                .animate()
                .fadeIn(duration: 300.ms)
                .slideY(begin: 0.3, end: 0),
          
          // Chat Input
          ChatInput(
            controller: _messageController,
            onSend: _sendMessage,
            onVoiceRecord: _startVoiceRecording,
            isTyping: _isTyping,
          ),
        ],
      ),
    );
  }

  Widget _buildTypingDot(int index) {
    return AnimatedContainer(
      duration: Duration(milliseconds: 600 + (index * 200)),
      width: 8,
      height: 8,
      decoration: BoxDecoration(
        color: AppColors.textSecondary,
        shape: BoxShape.circle,
      ),
    ).animate(
      onPlay: (controller) => controller.repeat(),
    ).scale(
      begin: const Offset(0.5, 0.5),
      end: const Offset(1.0, 1.0),
      duration: 600.ms,
      delay: Duration(milliseconds: index * 200),
    );
  }

  void _sendMessage(String message) {
    if (message.trim().isEmpty) return;

    // Add user message
    _addUserMessage(message);
    
    // Clear input
    _messageController.clear();
    
    // Show typing indicator
    setState(() {
      _isTyping = true;
    });
    
    // Simulate AI response
    Future.delayed(const Duration(seconds: 2), () {
      _generateAIResponse(message);
    });
  }

  void _startVoiceRecording() {
    // TODO: Implement voice recording
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Voice recording feature coming soon!'),
      ),
    );
  }

  void _addUserMessage(String message) {
    setState(() {
      _messages.add(ChatMessageData(
        text: message,
        translation: '', // User messages don't need translation
        isUser: true,
        timestamp: DateTime.now(),
      ));
    });
    _scrollToBottom();
  }

  void _addBotMessage(String darijaText, String translation) {
    setState(() {
      _messages.add(ChatMessageData(
        text: darijaText,
        translation: translation,
        isUser: false,
        timestamp: DateTime.now(),
      ));
      _isTyping = false;
    });
    _scrollToBottom();
  }

  void _generateAIResponse(String userMessage) {
    // TODO: Integrate with actual AI service
    // For now, provide sample responses
    final responses = [
      {
        'darija': 'أهلا وسهلا! كيف حالك؟',
        'translation': 'Hello and welcome! How are you?',
      },
      {
        'darija': 'ماشي مشكل، نتعلمو مع بعض',
        'translation': 'No problem, we\'ll learn together',
      },
      {
        'darija': 'هذا جيد! تريد تتعلم شي كلمة جديدة؟',
        'translation': 'That\'s good! Do you want to learn a new word?',
      },
      {
        'darija': 'يمكن نقولو "شكرا" بلفظ "شكرا" أو "ميرسي"',
        'translation': 'We can say "thank you" as "shukran" or "mersi"',
      },
    ];
    
    final randomResponse = responses[userMessage.length % responses.length];
    _addBotMessage(randomResponse['darija']!, randomResponse['translation']!);
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _showChatOptions() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.textLight,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 20),
            
            ListTile(
              leading: const Icon(Icons.clear_all),
              title: const Text('Clear Chat'),
              onTap: () {
                Navigator.of(context).pop();
                _clearChat();
              },
            ),
            
            ListTile(
              leading: const Icon(Icons.save),
              title: const Text('Save Conversation'),
              onTap: () {
                Navigator.of(context).pop();
                _saveConversation();
              },
            ),
            
            ListTile(
              leading: const Icon(Icons.settings),
              title: const Text('Chat Settings'),
              onTap: () {
                Navigator.of(context).pop();
                _openChatSettings();
              },
            ),
            
            ListTile(
              leading: const Icon(Icons.help_outline),
              title: const Text('Help'),
              onTap: () {
                Navigator.of(context).pop();
                _showHelp();
              },
            ),
          ],
        ),
      ),
    );
  }

  void _clearChat() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear Chat'),
        content: const Text('Are you sure you want to clear all messages?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              setState(() {
                _messages.clear();
              });
              // Send welcome message again
              _addBotMessage(
                "مرحبا! أنا مساعدك لتعلم الدارجة المغربية. كيف يمكنني مساعدتك اليوم؟",
                "Hello! I'm your assistant for learning Moroccan Darija. How can I help you today?",
              );
            },
            child: const Text('Clear'),
          ),
        ],
      ),
    );
  }

  void _saveConversation() {
    // TODO: Implement save conversation
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Conversation saved!'),
      ),
    );
  }

  void _openChatSettings() {
    // TODO: Navigate to chat settings
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Chat settings coming soon!'),
      ),
    );
  }

  void _showHelp() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Chat Help'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('• Type messages in any language'),
            Text('• The AI will respond in Darija with translations'),
            Text('• Tap on messages to hear pronunciation'),
            Text('• Use voice recording for hands-free practice'),
            Text('• Ask questions about grammar, vocabulary, or culture'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Got it'),
          ),
        ],
      ),
    );
  }
}

// Sample messages list (in a real app, this would come from a provider)
final List<ChatMessageData> _messages = <ChatMessageData>[]; 