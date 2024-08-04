package com.example.WebSocket.controllers;

import java.util.UUID;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
// import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@CrossOrigin(origins = "http://localhost:5173/")
@RequestMapping("/room")
public class PrivateWorkspaceController {

    private final SimpMessagingTemplate template;

    PrivateWorkspaceController(SimpMessagingTemplate template) {
        this.template = template;
    }

    // POST Mapping for creating workspace
    @PostMapping("/create")
    public String createWorkspace() {
        String workspace_code = UUID.randomUUID().toString().substring(0, 8);
        return workspace_code;
    }

    // MESSAGE Mapping form joining the workspace
    @MessageMapping("/join/{workspace_code}")
    public void joinWorkspace(@DestinationVariable String workspace_code, String msg) {
        template.convertAndSend("/topic/" + workspace_code, msg);
    }

}
