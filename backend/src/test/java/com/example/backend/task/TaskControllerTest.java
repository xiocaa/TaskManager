package com.example.backend.task;

import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@org.springframework.transaction.annotation.Transactional
class TaskControllerTest {

    @Autowired MockMvc mvc;
    @Autowired UserRepository users;
    @Autowired ObjectMapper om;
    Long userId;

    @BeforeEach
    void setUp(){
        User u = users.save(User.builder().username("alice").build());
        userId = u.getId();
    }

    @Test
    void crud_flow() throws Exception {
        // create
        var createRes = mvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Id", String.valueOf(userId))
                        .content("{\"title\":\"hello\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title").value("hello"))
                .andReturn();

        String body = createRes.getResponse().getContentAsString();
        Map<?,?> m = om.readValue(body, Map.class);
        Integer id = (Integer) m.get("id");
        // list
        mvc.perform(get("/api/tasks").header("X-User-Id", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("hello"));

        // update
        mvc.perform(put("/api/tasks/"+id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Id", userId)
                        .content("{\"id\":"+id+",\"title\":\"hello2\",\"status\":\"DONE\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("hello2"))
                .andExpect(jsonPath("$.status").value("DONE"));

        // delete
        mvc.perform(delete("/api/tasks/"+id).header("X-User-Id", userId))
                .andExpect(status().isNoContent());
    }

    @Test
    void missing_user_header_is_bad_request() throws Exception {
        mvc.perform(get("/api/tasks")).andExpect(status().isBadRequest());
    }
}

