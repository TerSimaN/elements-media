package project.masters.elementmedia.controllers;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import project.masters.elementmedia.entities.CommentEntity;
import project.masters.elementmedia.entities.ElementEntity;
import project.masters.elementmedia.entities.UserEntity;
import project.masters.elementmedia.repositories.CommentRepository;
import project.masters.elementmedia.repositories.ElementRepository;

@RestController
public class CommentController {
	
	CommentRepository commentRepository;
	ElementRepository elementRepository;
	
	public CommentController(CommentRepository commentRepository, ElementRepository elementRepository) {
		this.commentRepository = commentRepository;
		this.elementRepository = elementRepository;
	}
	
	@PostMapping(path = "/comment/add")
	public String addComment(@RequestParam(value = "comment") String comment,
							 @RequestParam(value = "element_id") String id,
							 HttpSession session) {
		
		UserEntity loggedUser = (UserEntity) session.getAttribute("user");
		int elementId = Integer.parseInt(id);
		
		if (loggedUser != null) {
			
			Optional<ElementEntity> optionalElement = elementRepository.findById(elementId);
			
			if (optionalElement.isPresent()) {
				ElementEntity forElement = optionalElement.get();
				
				CommentEntity newComment = new CommentEntity();
				
				newComment.setComment(comment);
				newComment.setForElement(forElement);
				newComment.setFromUser(loggedUser);
				
				newComment = commentRepository.saveAndFlush(newComment);
				
				if (newComment != null) {
					return String.valueOf(newComment.getId());
				}
				
				return "ERROR: Unable to insert into DB!!!";
			}
			
			return "ERROR: Could not find the selected element!!!";
			
		}
		
		return "ERROR: No logged user found!!!";
		
	}
	
	@PutMapping(path = "/comment/update")
	public ResponseEntity<Integer> updateComment(	@RequestParam(value = "comment") String comment,
			 										@RequestParam(value = "comment_id") String id,
			 										HttpSession session) {
		UserEntity loggedUser = (UserEntity) session.getAttribute("user");
		int commentId = Integer.parseInt(id);
		
		if (loggedUser == null) {
			return new ResponseEntity<Integer>(401, HttpStatus.UNAUTHORIZED);
		}
		
		Optional<CommentEntity> optionalComment = commentRepository.findById(commentId);
		
		if (optionalComment.isPresent()) {
			CommentEntity updateComment = optionalComment.get();
			
			updateComment.setComment(comment);
			
			if (updateComment.getFromUser().getId() == loggedUser.getId()) {
				updateComment = commentRepository.saveAndFlush(updateComment);
				return new ResponseEntity<Integer>(200, HttpStatus.OK);
			} else {
				return new ResponseEntity<Integer>(403, HttpStatus.FORBIDDEN);
			}
			
		} else {
			return new ResponseEntity<Integer>(404, HttpStatus.NOT_FOUND);
		}
		
	}
	
	@GetMapping(path = "/comment/all")
	public List<CommentEntity> getAllComments() {
		return commentRepository.findAll();
	}
	
	@DeleteMapping(path = "/comment/delete")
	public ResponseEntity<Integer> deleteComment(@RequestParam(value = "comment_id") int id, HttpSession session) {
		
		UserEntity loggedUser = (UserEntity) session.getAttribute("user");
		
		if (loggedUser == null) {
			return new ResponseEntity<Integer>(401, HttpStatus.UNAUTHORIZED);
		}
		
		Optional<CommentEntity> optionalComment = commentRepository.findById(id);
		
		if (optionalComment.isPresent()) {
			CommentEntity comment = optionalComment.get();
			
			if (comment.getFromUser().getId() == loggedUser.getId()) {
				commentRepository.delete(comment);
				return new ResponseEntity<Integer>(200, HttpStatus.OK);
			} else {
				return new ResponseEntity<Integer>(403, HttpStatus.FORBIDDEN);
			}
			
		} else {
			return new ResponseEntity<Integer>(404, HttpStatus.NOT_FOUND);
		}
		
	}
	
}
