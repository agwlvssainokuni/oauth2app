/*
 * Copyright 2021,2022 agwlvssainokuni
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

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.switchuser.SwitchUserFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http //
                .cors(cors -> {
                    CorsConfiguration myapi = new CorsConfiguration();
                    myapi.addAllowedOrigin("http://localhost:8082");
                    myapi.applyPermitDefaultValues();
                    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                    source.registerCorsConfiguration("/myapi", myapi);
                    cors.configurationSource(source);
                }) //
                .oauth2ResourceServer(oauth2 -> {
                    oauth2.jwt(jwt -> {});
                }) //
                .authorizeHttpRequests(authz -> {
                    authz.requestMatchers("/myapi").hasAuthority("SCOPE_openid");
                    authz.anyRequest().permitAll();
                });
        http //
                .addFilterAfter(new MDCLoginIdInsertingFilter(), SwitchUserFilter.class);
        return http.build();
    }

}
