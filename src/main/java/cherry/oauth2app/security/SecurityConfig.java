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

package cherry.oauth2app.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http //
                .oauth2ResourceServer((oauth2) -> {
                    oauth2.jwt();
                }) //
                .oauth2Login((oauth2) -> {
                    oauth2.defaultSuccessUrl("/onserver/");
                }) //
                .logout((logout) -> {
                    logout.logoutUrl("/logout");
                    logout.logoutSuccessUrl("/onserver/");
                    logout.logoutSuccessHandler(oidcLogoutSuccessHandler("/onserver/"));
                    logout.invalidateHttpSession(true);
                    logout.clearAuthentication(true);
                }) //
                .authorizeRequests((authz) -> {
                    authz.antMatchers("/onbrowser/myapi").hasAuthority("SCOPE_openid");
                    authz.antMatchers("/onserver/userinfo").authenticated();
                    authz.antMatchers("/exit").authenticated();
                    authz.antMatchers("/**").permitAll();
                });
    }

    private LogoutSuccessHandler oidcLogoutSuccessHandler(String path) {
        OidcClientInitiatedLogoutSuccessHandler handler = new OidcClientInitiatedLogoutSuccessHandler(
                clientRegistrationRepository);
        handler.setPostLogoutRedirectUri("{baseUrl}" + path);
        return handler;
    }

}
