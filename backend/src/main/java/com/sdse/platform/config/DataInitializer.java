package com.sdse.platform.config;

import com.sdse.platform.model.Category;
import com.sdse.platform.model.Customer;
import com.sdse.platform.model.Role;
import com.sdse.platform.model.ServiceProvider;
import com.sdse.platform.model.User;
import com.sdse.platform.repository.CategoryRepository;
import com.sdse.platform.repository.CustomerRepository;
import com.sdse.platform.repository.ServiceProviderRepository;
import com.sdse.platform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            CustomerRepository customerRepository,
            ServiceProviderRepository providerRepository,
            CategoryRepository categoryRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (categoryRepository.count() == 0) {
                Category electrician = categoryRepository.save(new Category(
                        "Electrician",
                        "Wiring, circuit breakers, installations, and repairs",
                        "Zap",
                        50.0
                ));
                Category plumber = categoryRepository.save(new Category(
                        "Plumber",
                        "Leak repair, pipe installation, drainage, and plumbing fixtures",
                        "Wrench",
                        45.0
                ));
                Category carpenter = categoryRepository.save(new Category(
                        "Carpenter",
                        "Woodwork, furniture assembly, shelving, and custom fittings",
                        "Hammer",
                        40.0
                ));
                Category painter = categoryRepository.save(new Category(
                        "Painter",
                        "Interior and exterior wall painting, waterproof coating, and touch-ups",
                        "Paintbrush",
                        35.0
                ));
                Category mason = categoryRepository.save(new Category(
                        "Mason",
                        "Brickwork, tiling, plastering, and structural concrete repair",
                        "HardHat",
                        55.0
                ));

                if (!userRepository.existsByEmail("admin@platform.com")) {
                    User admin = new User(
                            "admin@platform.com",
                            passwordEncoder.encode("admin123"),
                            "Platform Administrator",
                            "+1 (555) 000-0001",
                            Role.ROLE_ADMIN
                    );
                    userRepository.save(admin);
                }

                if (!userRepository.existsByEmail("alice@gmail.com")) {
                    Customer c1 = new Customer(
                            "alice@gmail.com",
                            passwordEncoder.encode("password123"),
                            "Alice Johnson",
                            "+1 (555) 234-5678",
                            "742 Evergreen Terrace",
                            "Springfield"
                    );
                    customerRepository.save(c1);
                }

                if (!userRepository.existsByEmail("bob@gmail.com")) {
                    Customer c2 = new Customer(
                            "bob@gmail.com",
                            passwordEncoder.encode("password123"),
                            "Bob Smith",
                            "+1 (555) 345-6789",
                            "123 Elm Street",
                            "Metropolis"
                    );
                    customerRepository.save(c2);
                }

                if (!userRepository.existsByEmail("raj.electric@gmail.com")) {
                    ServiceProvider p1 = new ServiceProvider(
                            "raj.electric@gmail.com",
                            passwordEncoder.encode("password123"),
                            "Raj Patel",
                            "+1 (555) 456-7890",
                            electrician,
                            "7 years",
                            45.0,
                            "Springfield",
                            "Certified master electrician specializing in residential and commercial wiring."
                    );
                    p1.setRating(4.9);
                    p1.setTotalReviews(28);
                    providerRepository.save(p1);
                }

                if (!userRepository.existsByEmail("mike.plumb@gmail.com")) {
                    ServiceProvider p2 = new ServiceProvider(
                            "mike.plumb@gmail.com",
                            passwordEncoder.encode("password123"),
                            "Mike Miller",
                            "+1 (555) 567-8901",
                            plumber,
                            "5 years",
                            40.0,
                            "Springfield",
                            "Prompt and reliable plumbing services. 24/7 emergency water damage response."
                    );
                    p2.setRating(4.8);
                    p2.setTotalReviews(19);
                    providerRepository.save(p2);
                }

                if (!userRepository.existsByEmail("carlos.carpentry@gmail.com")) {
                    ServiceProvider p3 = new ServiceProvider(
                            "carlos.carpentry@gmail.com",
                            passwordEncoder.encode("password123"),
                            "Carlos Rodriguez",
                            "+1 (555) 678-9012",
                            carpenter,
                            "10 years",
                            50.0,
                            "Metropolis",
                            "Custom cabinetry, fine carpentry, modular kitchens, and door installations."
                    );
                    p3.setRating(5.0);
                    p3.setTotalReviews(34);
                    providerRepository.save(p3);
                }

                if (!userRepository.existsByEmail("sarah.painter@gmail.com")) {
                    ServiceProvider p4 = new ServiceProvider(
                            "sarah.painter@gmail.com",
                            passwordEncoder.encode("password123"),
                            "Sarah Jenkins",
                            "+1 (555) 789-0123",
                            painter,
                            "4 years",
                            38.0,
                            "Springfield",
                            "Eco-friendly interior designer & painter with precision finish."
                    );
                    p4.setRating(4.7);
                    p4.setTotalReviews(15);
                    providerRepository.save(p4);
                }

                if (!userRepository.existsByEmail("david.mason@gmail.com")) {
                    ServiceProvider p5 = new ServiceProvider(
                            "david.mason@gmail.com",
                            passwordEncoder.encode("password123"),
                            "David Stone",
                            "+1 (555) 890-1234",
                            mason,
                            "12 years",
                            60.0,
                            "Metropolis",
                            "Expert stone mason, tile layer, and foundation specialist."
                    );
                    p5.setRating(4.9);
                    p5.setTotalReviews(42);
                    providerRepository.save(p5);
                }

                System.out.println(">>> Sample seed data successfully initialized!");
            }
        };
    }
}
