package project.masters.elementmedia.controllers;

import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import project.masters.elementmedia.entities.UserEntity;
import project.masters.elementmedia.repositories.UserRepository;

@RestController
public class UserController {
	
	private UserRepository userRepository;
	
	public UserController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	@PutMapping(path = "/user/update")
	public ResponseEntity<Integer> updateUser(  @RequestParam(value = "user_id") int user_id,
												@RequestParam(value = "username") String username,
												@RequestParam(value = "email") String email,
												@RequestParam(value = "password") String password,
												@RequestParam(value = "repeatPassword") String repeatPassword,
												HttpSession session) {
		
		UserEntity loggedUser = (UserEntity) session.getAttribute("user");
		
		if (loggedUser == null) {
			return new ResponseEntity<Integer>(401, HttpStatus.UNAUTHORIZED);
		}
		
		if (loggedUser.getId() == user_id) {
			Optional<UserEntity> optionalUser = userRepository.findById(user_id);
			
			if (optionalUser.isPresent()) {
				UserEntity user = optionalUser.get();
				
				user.setUsername(username);
				user.setEmail(email);
				user.setPassword(password);
				
				if (password.equals(repeatPassword)) {
					user = userRepository.saveAndFlush(user);
					return new ResponseEntity<Integer>(200, HttpStatus.OK);
				}
				
			} else {
				return new ResponseEntity<Integer>(404, HttpStatus.NOT_FOUND);
			}
			
		}
		
		return new ResponseEntity<Integer>(403, HttpStatus.FORBIDDEN);
		
	}
	
	@DeleteMapping(path = "/user/delete")
	public ResponseEntity<Integer> deleteUser(@RequestParam(value = "user_id") int id, HttpSession session) {
		UserEntity loggedUser = (UserEntity) session.getAttribute("user");
		
		if (loggedUser == null) {
			return new ResponseEntity<Integer>(401, HttpStatus.UNAUTHORIZED);
		}
		
		Optional<UserEntity> optionalUser = userRepository.findById(id);
		
		if (optionalUser.isPresent()) {
			UserEntity user = optionalUser.get();
			
			if (user.getId() == loggedUser.getId()) {
				userRepository.delete(user);
				session.invalidate();
				return new ResponseEntity<Integer>(200, HttpStatus.OK);
			} else {
				return new ResponseEntity<Integer>(403, HttpStatus.FORBIDDEN);
			}
			
		} else {
			return new ResponseEntity<Integer>(404, HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping(path = "/user/get")
	public UserEntity getUserById(@RequestParam(value = "user_id") int id, HttpSession session) {
		
		UserEntity loggedUser = (UserEntity) session.getAttribute("user");
		
		if (loggedUser != null) {
			Optional<UserEntity> optionalUser = userRepository.findById(id);
			
			if (optionalUser.isPresent()) {
				return optionalUser.get();
			}
		}
		
		return null;
	}
	
	
}
