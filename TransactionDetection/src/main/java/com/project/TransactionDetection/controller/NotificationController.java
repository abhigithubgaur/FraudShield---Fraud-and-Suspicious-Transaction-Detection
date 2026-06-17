package com.project.TransactionDetection.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/alerts")
public class NotificationController {

    private static final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Long userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // Keep open

        emitters.put(userId, emitter);

        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError((e) -> emitters.remove(userId));

        try {
            emitter.send(SseEmitter.event().name("INIT").data("Connected to Real-Time Security Alert Stream"));
        } catch (IOException e) {
            emitters.remove(userId);
        }

        return emitter;
    }

    public static void sendAlert(Long userId, String alertType, String message) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name(alertType) // e.g., "SUSPICIOUS_ACTIVITY" or "ACCOUNT_BLOCKED"
                        .data(Map.of("message", message, "timestamp", System.currentTimeMillis())));
            } catch (IOException e) {
                emitters.remove(userId);
            }
        }
    }
}