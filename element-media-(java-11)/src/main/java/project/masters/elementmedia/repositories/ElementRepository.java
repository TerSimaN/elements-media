package project.masters.elementmedia.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.masters.elementmedia.entities.ElementEntity;
import project.masters.elementmedia.entities.UserEntity;

@Repository
public interface ElementRepository extends JpaRepository<ElementEntity, Integer> {
	ElementEntity findByUser(UserEntity user);
	
	List<ElementEntity> findByTitle(String title);
	
	List<ElementEntity> findByRating(int rating);
}
