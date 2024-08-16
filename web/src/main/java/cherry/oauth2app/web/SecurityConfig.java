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

package cherry.oauth2app.web;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.switchuser.SwitchUserFilter;

@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
            ClientRegistrationRepository repository) throws Exception {
        http //
                .oauth2Login(oauth2 -> {
                    oauth2.defaultSuccessUrl("/");
                }) //
                .logout(logout -> {
                    logout.logoutUrl("/logout");
                    logout.logoutSuccessUrl("/");
                    logout.logoutSuccessHandler(oidcLogoutSuccessHandler("/", repository));
                    logout.invalidateHttpSession(true);
                    logout.clearAuthentication(true);
                }) //
                .authorizeHttpRequests(authz -> {
                    authz.requestMatchers("/userinfo").authenticated();
                    authz.anyRequest().permitAll();
                });
        http //
                .addFilterAfter(new MDCLoginIdInsertingFilter(), SwitchUserFilter.class);
        return http.build();
    }

    private LogoutSuccessHandler oidcLogoutSuccessHandler(String path,
            ClientRegistrationRepository repository) {
        OidcClientInitiatedLogoutSuccessHandler handler = new OidcClientInitiatedLogoutSuccessHandler(repository);
        handler.setPostLogoutRedirectUri("{baseUrl}" + path);
        return handler;
    }

}
