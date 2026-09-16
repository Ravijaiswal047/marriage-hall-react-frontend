import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORY_MARKETING_ITEMS } from "../constants/marketing.content";
import { useSearchStore } from "@/store/search.store";
import { ROUTES } from "@/lib/constants/routes";
import { Badge } from "@/components/ui/Badge";

export const CategorySection: FC = () => {
  const navigate = useNavigate();
  const setFilter = useSearchStore((state) => state.setFilter);

  const handleCategoryClick = (categoryId: string) => {
    setFilter("category", categoryId);
    navigate(ROUTES.HALLS);
  };

  return (
    <section className="py-12 sm:py-16 text-left border-t border-[#DDDDDD]">
      <div className="mb-8">
        <Badge variant="primary" size="sm" className="mb-2">
          Venue Types
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-black text-[#222222] tracking-tight">
          Browse by Category
        </h2>
        <p className="text-sm text-[#717171] mt-1">
          Whether you need a grand indoor banquet or a serene open lawn, find
          your setting.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORY_MARKETING_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCategoryClick(item.id)}
            className="group relative rounded-2xl overflow-hidden border border-[#DDDDDD] bg-white shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#F7F7F7]">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {item.badge ? (
                <div className="absolute top-3 right-3">
                  <Badge variant="primary" size="sm">
                    {item.badge}
                  </Badge>
                </div>
              ) : null}
            </div>

            <div className="p-5 flex flex-col gap-1">
              <h3 className="text-base font-bold text-[#222222] group-hover:text-[#FF385C] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#717171] line-clamp-2">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
