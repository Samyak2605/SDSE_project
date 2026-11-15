package com.sdse.platform.service.pricing;

import com.sdse.platform.model.Category;
import com.sdse.platform.model.ServiceProvider;

public interface PricingStrategy {
    Double calculatePrice(Category category, ServiceProvider provider, int hours);
    String getStrategyName();
}
