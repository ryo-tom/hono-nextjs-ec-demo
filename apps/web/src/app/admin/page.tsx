import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Package, Tag, TrendingUp } from "lucide-react";
import { Header } from "./_components/header";

const stats = [
  { label: "総商品数", value: "24", icon: Package, badge: "+2 今月" },
  { label: "カテゴリ数", value: "4", icon: Tag, badge: null },
  { label: "画像数", value: "87", icon: ImageIcon, badge: null },
  { label: "今月の更新", value: "12", icon: TrendingUp, badge: "件" },
];

export default function AdminPage() {
  return (
    <>
      <Header title="ダッシュボード" />
      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon size={14} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-semibold">{stat.value}</span>
                    {stat.badge && (
                      <Badge variant="secondary" className="text-[10px]">
                        {stat.badge}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                最近の更新
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "サンプル商品 α",
                    action: "価格変更",
                    time: "2時間前",
                  },
                  { name: "カテゴリB", action: "新規追加", time: "昨日" },
                  { name: "サンプル商品 β", action: "在庫更新", time: "昨日" },
                  { name: "サンプル商品 γ", action: "画像追加", time: "3日前" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {item.action}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
