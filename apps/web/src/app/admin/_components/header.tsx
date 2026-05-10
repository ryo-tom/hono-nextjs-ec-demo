import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <h1 className="text-sm font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell size={16} />
          <Badge className="absolute -right-1 -top-1 h-4 w-4 items-center justify-center p-0 text-[10px]">
            2
          </Badge>
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
            <span className="text-[11px] font-medium text-primary-foreground">
              A
            </span>
          </div>
          <span className="text-sm text-muted-foreground">Admin</span>
        </div>
      </div>
    </header>
  );
}
