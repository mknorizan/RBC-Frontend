import React from "react";
import { Typography, Stack } from "@mui/material";
import { PriceTier } from "../../types/package";

interface PriceDisplayProps {
  priceTiers: PriceTier[];
  categoryId: number;
  fishingType?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  priceTiers,
  categoryId,
  fishingType,
}) => {
  // Debug log
  console.log("PriceTiers received:", priceTiers);

  // Helper function to handle tiered pricing display
  const renderTieredPricing = (tiers: PriceTier[]) => {
    const sortedTiers = [...tiers].sort((a, b) => {
      const order: Record<PriceTier["type"], number> = {
        ADULT: 1,
        CHILD: 2,
        INFANT: 3,
        FIXED: 4,
      };
      return order[a.type] - order[b.type];
    });

    return (
      <Stack spacing={0.5} alignItems="center">
        {sortedTiers.map((tier, index) => (
          <Typography
            key={`${tier.type}-${tier.price}-${index}`}
            variant="subtitle2"
            sx={{
              textAlign: "center",
              fontWeight: tier.type === "ADULT" ? 500 : 400,
            }}
          >
            {tier.price === 0 ? "FREE" : `RM${tier.price}`} |{" "}
            {tier.label || tier.type}
          </Typography>
        ))}
      </Stack>
    );
  };

  if (categoryId === 1) {
    // Boat Charter - check for both fixed and tiered pricing
    const fixedPrice = priceTiers.find((tier) => tier.type === "FIXED");
    const hasTieredPricing = priceTiers.some((tier) =>
      ["ADULT", "CHILD", "INFANT"].includes(tier.type)
    );

    if (fixedPrice) {
      return (
        <Typography
          variant="subtitle1"
          sx={{ textAlign: "center", fontWeight: 500 }}
        >
          RM{fixedPrice.price} {fixedPrice.label ? `| ${fixedPrice.label}` : ""}
        </Typography>
      );
    } else if (hasTieredPricing) {
      return renderTieredPricing(priceTiers);
    }

    return (
      <Typography
        variant="subtitle1"
        sx={{ textAlign: "center", color: "error.main" }}
      >
        Price unavailable
      </Typography>
    );
  }

  if (categoryId === 3) {
    // Fishing packages
    const fixedPrice = priceTiers.find((tier) => tier.type === "FIXED");
    if (!fixedPrice) {
      return (
        <Typography
          variant="subtitle1"
          sx={{ textAlign: "center", color: "error.main" }}
        >
          Price unavailable
        </Typography>
      );
    }

    return (
      <>
        {fishingType && (
          <Typography
            variant="subtitle2"
            sx={{ textAlign: "center", mb: 1, color: "primary.main" }}
          >
            {fishingType === "DEEP_SEA" ? "Deep Sea Fishing" : "Squid Fishing"}
          </Typography>
        )}
        <Typography
          variant="subtitle1"
          sx={{ textAlign: "center", fontWeight: 500 }}
        >
          RM{fixedPrice.price} {fixedPrice.label ? `| ${fixedPrice.label}` : ""}
        </Typography>
      </>
    );
  }

  // Day Trip packages (categoryId === 2)
  return renderTieredPricing(priceTiers);
};

export default PriceDisplay;
