package com.sdse.platform.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "customers")
public class Customer extends User {

    private String address;
    private String city;

    public Customer() {
        super();
        setRole(Role.ROLE_CUSTOMER);
    }

    public Customer(String email, String password, String fullName, String phone, String address, String city) {
        super(email, password, fullName, phone, Role.ROLE_CUSTOMER);
        this.address = address;
        this.city = city;
    }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}
