/*
 * Copyright 2021 agwlvssainokuni
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package cherry.oauth2app.api;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller()
@RequestMapping("/")
public class RootController {

    @RequestMapping(value = "/myapi", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody()
    public Map<String, Object> myapi(Authentication auth) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("name", auth.getName());
        if (auth.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) auth.getPrincipal();
            map.put("headers", jwt.getHeaders());
            map.put("claims", jwt.getClaims());
            map.put("issuedAt", jwt.getIssuedAt());
            map.put("expiresAt", jwt.getExpiresAt());
        }
        return map;
    }

}
