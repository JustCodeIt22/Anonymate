package com.example.WebSocket.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("https://anonymate-amber.vercel.app")
public class PublicWorkspaceController {
    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public String sendMessage(@Payload String message) {
        return message;
    }
}
