import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export const DashboardCard = ({ title, icon: Icon, color, onClick }: DashboardCardProps) => {
  return (
    <Card 
      className={cn(
        "aspect-square p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 rounded-xl flex flex-col items-center justify-center text-center group",
        color
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-3">
        <Icon className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
        <h3 className="text-white font-semibold text-sm leading-tight">{title}</h3>
      </div>
    </Card>
  );
};