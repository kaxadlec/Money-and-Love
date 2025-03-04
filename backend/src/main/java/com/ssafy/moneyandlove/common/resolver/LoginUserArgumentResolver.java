package com.ssafy.moneyandlove.common.resolver;

import java.util.Objects;

import org.springframework.core.MethodParameter;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class LoginUserArgumentResolver implements HandlerMethodArgumentResolver,
	org.springframework.messaging.handler.invocation.HandlerMethodArgumentResolver {

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return parameter.hasParameterAnnotation(LoginUser.class)
			&& User.class.isAssignableFrom(parameter.getParameterType());
	}

	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
		NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
		//SecurityContext에서 값 꺼내기
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return authentication.getPrincipal();
	}

	@Override
	public Object resolveArgument(MethodParameter parameter, Message<?> message) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
		return ((Authentication)Objects.requireNonNull(accessor.getUser())).getPrincipal();
	}
}
