package project.masters.elementmedia.controllers;

import java.util.ArrayList;
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

import project.masters.elementmedia.entities.ElementEntity;
import project.masters.elementmedia.entities.UserEntity;
import project.masters.elementmedia.repositories.ElementRepository;

@RestController
public class ElementController {
	
	private ElementRepository elementRepository;
	
	public ElementController(ElementRepository elementRepository) {
		this.elementRepository = elementRepository;
	}
	
	@PostMapping(path = "/element/add")
	public String addElement(@RequestParam(value = "imageAddress") String imageAddress, 
							 @RequestParam(value = "title") String title,
							 @RequestParam(value = "description") String description,
							 @RequestParam(value = "rating") int rating,
							 HttpSession session) {
		
		UserEntity loggedUser = (UserEntity) session.getAttribute("user");
		
		if (loggedUser != null) {
			ElementEntity newElement = new ElementEntity();

			newElement.setImageAddress(imageAddress);
			newElement.setTitle(title);
			newElement.setDescription(description);
			newElement.setRating(rating);
			newElement.setUser(loggedUser);
			
			newElement = elementRepository.saveAndFlush(newElement);
			
			if (newElement != null) {
				return String.valueOf(newElement.getId());
			}
			
			return "ERROR: Unable to insert into DB!!!";
		}
		
		return "ERROR: No logged user found!!!";
	}
	
	@PutMapping(path = "/element/update")
	public ResponseEntity<Integer> updateElement(	@RequestParam(value = "imageAddress") String imageAddress, 
		 											@RequestParam(value = "title") String title,
			 										@RequestParam(value = "description") String description,
			 										@RequestParam(value = "rating") int rating,
			 										@RequestParam(value = "element_id") String id,
			 										HttpSession session) {
		UserEntity loggedUser = (UserEntity) session.getAttribute("user");
		int elementId = Integer.parseInt(id);
		
		if (loggedUser == null) {
			return new ResponseEntity<Integer>(401, HttpStatus.UNAUTHORIZED);
		}
		
		Optional<ElementEntity> optionalElement = elementRepository.findById(elementId);
		
		if (optionalElement.isPresent()) {
			ElementEntity updateElement = optionalElement.get();
			
			updateElement.setImageAddress(imageAddress);
			updateElement.setTitle(title);
			updateElement.setDescription(description);
			updateElement.setRating(rating);
			
			if (updateElement.getUser().getId() == loggedUser.getId()) {
				updateElement = elementRepository.saveAndFlush(updateElement);
				return new ResponseEntity<Integer>(200, HttpStatus.OK);
			} else {
				return new ResponseEntity<Integer>(403, HttpStatus.FORBIDDEN);
			}
			
		} else {
			return new ResponseEntity<Integer>(404, HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping(path = "/element/all")
	public List<ElementEntity> getAllElements() {
		return elementRepository.findAll();
	}
	
	@PostMapping(path = "/element/filter")
	public List<ElementEntity> getElementsByFilter( @RequestParam(value = "title") String title,
													@RequestParam(value = "rating") String rating,
													HttpSession session) {
		int elementRating;
		List<ElementEntity> filterResults = new ArrayList<ElementEntity>();
		List<ElementEntity> allElements = elementRepository.findAll();
		
		if (!title.equals("") && !rating.equals("none")) {
			elementRating = Integer.parseInt(rating);
			filterResults.addAll(elementRepository.findByRating(elementRating));
			
			for (ElementEntity elementEntity : allElements) {
				if (elementEntity.getTitle().contains(title)) {
					filterResults.add(elementEntity);
				}
			}
			
			return filterResults;
		}
		
		if (!title.equals("")) {
			for (ElementEntity elementEntity : allElements) {
				if (elementEntity.getTitle().contains(title)) {
					filterResults.add(elementEntity);
				}
			}
			
			return filterResults;
		}
		
		if (!rating.equals("none")) {
			elementRating = Integer.parseInt(rating);
			filterResults.addAll(elementRepository.findByRating(elementRating));
			
			return filterResults;
		}
		
		return null;
	}
	
	@DeleteMapping(path = "/element/delete")
	public ResponseEntity<Integer> deleteElement(@RequestParam(value = "id") int id, HttpSession session) {
		UserEntity loggedUser = (UserEntity) session.getAttribute("user");
		
		if (loggedUser == null) {
			return new ResponseEntity<Integer>(401, HttpStatus.UNAUTHORIZED);
		}
		
		Optional<ElementEntity> optionalElement = elementRepository.findById(id);
		
		if (optionalElement.isPresent()) {
			ElementEntity element = optionalElement.get();
			
			if (element.getUser().getId() == loggedUser.getId()) {
				elementRepository.delete(element);
				return new ResponseEntity<Integer>(200, HttpStatus.OK);
			} else {
				return new ResponseEntity<Integer>(403, HttpStatus.FORBIDDEN);
			}
			
		} else {
			return new ResponseEntity<Integer>(404, HttpStatus.NOT_FOUND);
		}
	}
	
}
