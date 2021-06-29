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

package cherry.oauth2app.web;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller()
@RequestMapping("/onbrowser")
public class OnbrowserController {

    @RequestMapping()
    public ModelAndView index(Authentication auth) {
        ModelAndView mav = new ModelAndView("/onbrowser/index");
        mav.addObject("auth", auth);
        return mav;
    }

    @RequestMapping(value = "/myapi", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody()
    public Map<String, String> myapi(Authentication auth) {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("username", auth.getName());
        map.put("datetime", LocalDateTime.now().toString());
        return map;
    }

    @RequestMapping("/blank")
    @ResponseBody()
    public String blank() {
        return "";
    }

}
