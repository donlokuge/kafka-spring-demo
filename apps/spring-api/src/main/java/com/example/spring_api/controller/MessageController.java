package com.example.spring_api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_api.service.MessageService;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllMessages() {
        List<Map<String, Object>> messages = messageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/latest")
    public ResponseEntity<Map<String, Object>> getLatestMessage() {
        Map<String, Object> latest = messageService.getLatestMessage();
        return latest != null
            ? ResponseEntity.ok(latest)
            : ResponseEntity.noContent().build();
    }
}
