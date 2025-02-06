import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User, MessageSquare, Heart, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MobileSidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Profile",
      icon: User,
      onClick: () => navigate("/profile")
    },
    {
      title: "Approaches",
      icon: MessageSquare,
      onClick: () => navigate("/")
    },
    {
      title: "Your Match",
      icon: Heart,
      onClick: () => navigate("/profile")
    },
    {
      title: "Upgrade",
      icon: Zap,
      onClick: () => navigate("/upgrade")
    }
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={item.onClick}>
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}