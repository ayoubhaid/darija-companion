import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../core/constants/app_colors.dart';

class ChatInput extends StatefulWidget {
  final TextEditingController controller;
  final Function(String) onSend;
  final VoidCallback onVoiceRecord;
  final bool isTyping;

  const ChatInput({
    super.key,
    required this.controller,
    required this.onSend,
    required this.onVoiceRecord,
    this.isTyping = false,
  });

  @override
  State<ChatInput> createState() => _ChatInputState();
}

class _ChatInputState extends State<ChatInput> {
  bool _isRecording = false;
  bool _hasText = false;

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_onTextChanged);
  }

  @override
  void dispose() {
    widget.controller.removeListener(_onTextChanged);
    super.dispose();
  }

  void _onTextChanged() {
    setState(() {
      _hasText = widget.controller.text.trim().isNotEmpty;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        boxShadow: [
          BoxShadow(
            color: AppColors.shadow.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            // Voice Record Button
            GestureDetector(
              onTapDown: (_) => _startRecording(),
              onTapUp: (_) => _stopRecording(),
              onTapCancel: () => _stopRecording(),
              child: Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: _isRecording ? AppColors.error : AppColors.accent,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Icon(
                  _isRecording ? Icons.stop : Icons.mic,
                  color: AppColors.textOnPrimary,
                  size: 24,
                ),
              )
                  .animate(target: _isRecording ? 1 : 0)
                  .scale(
                    begin: const Offset(1.0, 1.0),
                    end: const Offset(1.2, 1.2),
                    duration: 200.ms,
                  )
                  .then()
                  .scale(
                    begin: const Offset(1.2, 1.2),
                    end: const Offset(1.0, 1.0),
                    duration: 200.ms,
                  ),
            ),
            
            const SizedBox(width: 12),
            
            // Text Input
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: AppColors.textLight.withOpacity(0.3),
                  ),
                ),
                child: TextField(
                  controller: widget.controller,
                  enabled: !widget.isTyping,
                  maxLines: null,
                  textCapitalization: TextCapitalization.sentences,
                  decoration: InputDecoration(
                    hintText: widget.isTyping 
                        ? 'AI is typing...' 
                        : 'Type your message...',
                    hintStyle: TextStyle(
                      color: AppColors.textLight,
                    ),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    suffixIcon: _hasText
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              widget.controller.clear();
                            },
                            color: AppColors.textLight,
                          )
                        : null,
                  ),
                  onSubmitted: (text) {
                    if (text.trim().isNotEmpty && !widget.isTyping) {
                      widget.onSend(text);
                    }
                  },
                ),
              ),
            ),
            
            const SizedBox(width: 12),
            
            // Send Button
            GestureDetector(
              onTap: _hasText && !widget.isTyping
                  ? () => widget.onSend(widget.controller.text)
                  : null,
              child: Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: _hasText && !widget.isTyping 
                      ? AppColors.primary 
                      : AppColors.textLight.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Icon(
                  Icons.send,
                  color: _hasText && !widget.isTyping 
                      ? AppColors.textOnPrimary 
                      : AppColors.textLight,
                  size: 24,
                ),
              )
                  .animate(target: _hasText && !widget.isTyping ? 1 : 0)
                  .scale(
                    begin: const Offset(1.0, 1.0),
                    end: const Offset(1.1, 1.1),
                    duration: 200.ms,
                  ),
            ),
          ],
        ),
      ),
    );
  }

  void _startRecording() {
    setState(() {
      _isRecording = true;
    });
    widget.onVoiceRecord();
  }

  void _stopRecording() {
    setState(() {
      _isRecording = false;
    });
  }
} 