package com.sdse.platform.service.pricing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PricingContext {

    private final Map<String, PricingStrategy> strategies;

    @Autowired
    public PricingContext(Map<String, PricingStrategy> strategies) {
        this.strategies = strategies;
    }

    public PricingStrategy getStrategy(String strategyName) {
        if ("SURGE".equalsIgnoreCase(strategyName)) {
            return strategies.get("surgePricingStrategy");
        }
        return strategies.getOrDefault("standardPricingStrategy", strategies.values().iterator().next());
    }
}
