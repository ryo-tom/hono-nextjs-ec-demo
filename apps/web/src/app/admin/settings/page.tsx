import { Header } from "@/app/admin/_components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSection } from "./_components/account-section";
import { UsersSection } from "./_components/users-section";

export default function SettingsPage() {
  return (
    <>
      <Header title="設定" />
      <main className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">ユーザー管理</TabsTrigger>
            <TabsTrigger value="account">アカウント</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <UsersSection />
          </TabsContent>
          <TabsContent value="account">
            <AccountSection />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
