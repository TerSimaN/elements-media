package project.masters.elementmedia.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import project.masters.elementmedia.entities.UserEntity;
import project.masters.elementmedia.repositories.UserRepository;

@RestController
public class LoginController {
	
	private UserRepository userRepository;
	
	public LoginController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	@PostMapping(path = "/register")
	public UserEntity register( @RequestParam(value = "username") String username,
								@RequestParam(value = "password") String password,
								@RequestParam(value = "email") String email,
								@RequestParam(value = "repeatPassword") String repeatPassword) {
		
		if (password.equals(repeatPassword)) {
			UserEntity user = new UserEntity(username, password, email);
			
			return userRepository.saveAndFlush(user);
		}
		
		return null;
	}
	
	@PostMapping(path = "/login")
	public String login(@RequestParam(value = "username") String username,
						@RequestParam(value = "password") String password,
						HttpSession session) {
		
		UserEntity user = userRepository.findUserByUsernameAndPassword(username, password);
		
		if (user != null) {
			session.setAttribute("user", user);
			
			return "home.html";
		}
		
		return "error.html";
	}
	
	@GetMapping(path = "/loggedUserId")
	public ResponseEntity<Integer> loggedUserId(HttpSession session) {
		UserEntity loggedUser = (UserEntity) session.getAttribute("user");
		
		if (loggedUser != null) {
			return new ResponseEntity<Integer>(loggedUser.getId(), HttpStatus.OK);
		} else {
			return new ResponseEntity<Integer>(401, HttpStatus.UNAUTHORIZED);
		}
		
	}
	
	@PostMapping(path = "/logout")
	public ResponseEntity<Boolean> logout(HttpSession session) {
		UserEntity loggedUser = (UserEntity) session.getAttribute("user");
		
		if (loggedUser != null) {
			session.invalidate();
			return new ResponseEntity<Boolean>(true, HttpStatus.OK);
		} else {
			return new ResponseEntity<Boolean>(false, HttpStatus.I_AM_A_TEAPOT);
		}
	}
	
}
