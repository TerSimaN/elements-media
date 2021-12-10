package project.masters.elementmedia.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "comment")
@JsonIgnoreProperties({"forElement"})
public class CommentEntity implements Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "comment", nullable = false, length = 255)
	private String comment;
	
	@ManyToOne
	@JoinColumn(referencedColumnName = "id")
	private UserEntity fromUser;
	
	@OneToOne
	@JoinColumn(referencedColumnName = "id")
	private ElementEntity forElement;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public UserEntity getFromUser() {
		return fromUser;
	}

	public void setFromUser(UserEntity fromUser) {
		this.fromUser = fromUser;
	}

	public ElementEntity getForElement() {
		return forElement;
	}

	public void setForElement(ElementEntity forElement) {
		this.forElement = forElement;
	}
	
	
}
