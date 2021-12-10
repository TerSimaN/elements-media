package project.masters.elementmedia.entities;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "user")
@JsonIgnoreProperties({ "elements", "comments" })
public class UserEntity implements Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "username", nullable = false, length = 255, unique = true)
	private String username;
	
	@Column(name = "password", nullable = false, length = 32)
	private String password;
	
	@Column(name = "email", nullable = false, length = 255, unique = true)
	private String email;
	
	@OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
	private List<ElementEntity> elements;
	
	@OneToMany(mappedBy = "fromUser", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
	private List<CommentEntity> comments;
	
	public UserEntity() {	}
	
	public UserEntity(String username, String password, String email) {
		this.username = username;
		this.password = password;
		this.email = email;
	}
	
	public UserEntity(String username, String password) {
		this.username = username;
		this.password = password;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<ElementEntity> getElements() {
		return elements;
	}

	public void setElements(List<ElementEntity> elements) {
		this.elements = elements;
	}

	public List<CommentEntity> getComments() {
		return comments;
	}

	public void setComments(List<CommentEntity> comments) {
		this.comments = comments;
	}
	
	
}
