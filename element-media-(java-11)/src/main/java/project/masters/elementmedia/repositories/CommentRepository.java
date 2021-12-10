package project.masters.elementmedia.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.masters.elementmedia.entities.CommentEntity;
import project.masters.elementmedia.entities.ElementEntity;
import project.masters.elementmedia.entities.UserEntity;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {
	CommentEntity findByFromUser(UserEntity user);
	
	CommentEntity findByForElement(ElementEntity element);
}
