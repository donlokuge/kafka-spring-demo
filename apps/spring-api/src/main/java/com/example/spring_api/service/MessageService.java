package com.example.spring_api.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class MessageService {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final String redisKey;

    public MessageService(StringRedisTemplate redisTemplate,
                          ObjectMapper objectMapper,
                          @Value("${app.redis.key:kafka:messages}") String redisKey) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.redisKey = redisKey;
    }

    public List<Map<String, Object>> getAllMessages() {
        List<String> rawMessages = redisTemplate.opsForList().range(redisKey, 0, -1);
        if (rawMessages == null) return Collections.emptyList();

        List<Map<String, Object>> messages = new ArrayList<>();
        for (String raw : rawMessages) {
            try {
                Map<String, Object> parsed = objectMapper.readValue(raw, Map.class);

                // Parse 'value' field into JSON
                if (parsed.containsKey("value")) {
                    Object value = parsed.get("value");
                    if (value instanceof String strValue) {
                        parsed.put("value", objectMapper.readValue(strValue, Map.class));
                    }
                }

                messages.add(parsed);
            } catch (Exception e) {
                
            }
        }
        return messages;
    }

    public Map<String, Object> getLatestMessage() {
        String raw = redisTemplate.opsForList().index(redisKey, 0);
        if (raw == null) return null;
        try {
            Map<String, Object> parsed = objectMapper.readValue(raw, Map.class);

            if (parsed.containsKey("value")) {
                Object value = parsed.get("value");
                if (value instanceof String strValue) {
                    parsed.put("value", objectMapper.readValue(strValue, Map.class));
                }
            }

            return parsed;
        } catch (Exception e) {
            return null;
        }
    }
}
