package com.sdse.platform.model;

import jakarta.persistence.*;

@Entity
@Table(name = "service_providers")
public class ServiceProvider extends User {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    private String experience;

    private Double hourlyRate;

    private String city;

    private Boolean available = true;

    private Double rating = 5.0;

    private Integer totalReviews = 0;

    @Column(length = 1000)
    private String bio;

    public ServiceProvider() {
        super();
        setRole(Role.ROLE_PROVIDER);
    }

    public ServiceProvider(String email, String password, String fullName, String phone,
                           Category category, String experience, Double hourlyRate, String city, String bio) {
        super(email, password, fullName, phone, Role.ROLE_PROVIDER);
        this.category = category;
        this.experience = experience;
        this.hourlyRate = hourlyRate;
        this.city = city;
        this.bio = bio;
        this.available = true;
        this.rating = 5.0;
        this.totalReviews = 0;
    }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
