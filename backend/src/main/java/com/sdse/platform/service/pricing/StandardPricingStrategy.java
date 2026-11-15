package com.sdse.platform.service.pricing;

import com.sdse.platform.model.Category;
import com.sdse.platform.model.ServiceProvider;
import org.springframework.stereotype.Component;

@Component("standardPricingStrategy")
public class StandardPricingStrategy implements PricingStrategy {

    @Override
    public Double calculatePrice(Category category, ServiceProvider provider, int hours) {
        double base = (category != null && category.getBasePrice() != null) ? category.getBasePrice() : 50.0;
        double hourly = (provider != null && provider.getHourlyRate() != null) ? provider.getHourlyRate() : 30.0;
        return base + (hourly * hours);
    }

    @Override
    public String getStrategyName() {
        return "STANDARD";
    }
}
