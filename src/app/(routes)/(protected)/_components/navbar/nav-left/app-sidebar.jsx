"use client"
import React, { useEffect, useState } from 'react'
import {
  GraduationCap,
  Search,
  Settings,
  ChevronRight,
  BookOpen,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar"

import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible"
import { currentUser } from '@/hooks/use-current-user'

export default function AppSidebar() {
  const user = currentUser()
  // State to track current path
  const [currentPath, setCurrentPath] = useState("");
  
  // State to track manually opened menus
  const [openMenus, setOpenMenus] = useState({});

  // Get base path prefix based on user role
  const getBasePath = () => {
    return user?.role === "ADMIN" ? "/admin" : "/teacher";
  };

  // Set current path on component mount and when location changes
  useEffect(() => {
    // Get the current path
    const path = window.location.pathname;
    setCurrentPath(path);
    
    // Set initial open state based on the path
    const initialOpenState = {};
    getMenuItemsForCurrentRole().forEach(item => {
      if (item.pathPrefix && path.startsWith(item.pathPrefix)) {
        initialOpenState[item.title] = true;
      }
    });
    setOpenMenus(initialOpenState);

    // Listen for route changes
    const handleRouteChange = () => {
      const newPath = window.location.pathname;
      setCurrentPath(newPath);
      
      // Update open menus based on new path
      setOpenMenus(prev => {
        const updated = { ...prev };
        getMenuItemsForCurrentRole().forEach(item => {
          if (item.pathPrefix && newPath.startsWith(item.pathPrefix)) {
            updated[item.title] = true;
          }
        });
        return updated;
      });
    };

    // Add event listener for popstate (browser navigation)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [user?.role]);
  
  // Get menu items specific to the current role
  const getMenuItemsForCurrentRole = () => {
    const basePath = getBasePath();
    
    if (user?.role === "ADMIN") {
      return [
        {
          title: "Students",
          url: "#",
          icon: GraduationCap,
          pathPrefix: `${basePath}/students`,
          items: [
            {
              title: "Student List",
              url: `${basePath}/students/list`,
            },
            {
              title: "Student Attendance",
              url: `${basePath}/students/attendance`,
            },
            {
              title: "Student Enrollment",
              url: `${basePath}/students/enrollment`,
            }
          ]
        },
        {
          title: "Academics",
          url: "#",
          icon: BookOpen,
          pathPrefix: `${basePath}/academics`,
          items: [
            {
              title: "Courses",
              url: `${basePath}/academics/courses`,
            },
            {
              title: "Grade Level",
              url: `${basePath}/academics/grade-level`,
            },
            {
              title: "Teachers",
              url: `${basePath}/academics/teachers`,
            },
            {
              title: "Curriculum",
              url: `${basePath}/academics/curriculum`,
            }
          ]
        },
        {
          title: "Search",
          url: `${basePath}/search`,
          icon: Search,
        },
        {
          title: "Settings",
          url: `${basePath}/settings`,
          icon: Settings,
        },
      ];
    } else if (user?.role === "TEACHER") {
      return [
        {
          title: "Students",
          url: "#",
          icon: GraduationCap,
          pathPrefix: `${basePath}/students`,
          items: [
            {
              title: "Student List",
              url: `${basePath}/students/list`,
            },
            {
              title: "Student Attendance",
              url: `${basePath}/students/attendance`,
            }
          ]
        },
        {
          title: "My Classes",
          url: `${basePath}/classes`,
          icon: BookOpen,
          pathPrefix: `${basePath}/classes`,
          items: [
            {
              title: "Class Schedule",
              url: `${basePath}/classes/schedule`,
            },
            {
              title: "Grades",
              url: `${basePath}/classes/grades`,
            }
          ]
        },
        {
          title: "Search",
          url: `${basePath}/search`,
          icon: Search,
        },
        {
          title: "Settings",
          url: `${basePath}/settings`,
          icon: Settings,
        },
      ];
    }
    
    return [];
  };

  // Get the menu items for the current user role
  const visibleMenuItems = getMenuItemsForCurrentRole();

  // Helper function to check if a submenu item is active
  const isSubmenuActive = (url) => {
    return currentPath === url;
  };

  // Helper function to check if a direct menu item is active
  const isMenuActive = (url) => {
    return url !== "#" && currentPath === url;
  };
  
  // Toggle a menu's open state
  const toggleMenu = (title) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {user?.role === "ADMIN" ? "Admin Dashboard" : "Teacher Dashboard"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => (
                item.items ? (
                  <Collapsible 
                    key={item.title} 
                    asChild 
                    open={openMenus[item.title] || false}
                    onOpenChange={(isOpen) => {
                      setOpenMenus(prev => ({
                        ...prev,
                        [item.title]: isOpen
                      }));
                    }}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          tooltip={item.title} 
                          className={currentPath.startsWith(item.pathPrefix) ? "bg-gray-100 text-gray-900" : ""}
                          onClick={() => toggleMenu(item.title)}
                        >
                          {item.icon && <item.icon className={currentPath.startsWith(item.pathPrefix) ? "text-blue-600" : ""} />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild
                                className={isSubmenuActive(subItem.url) ? "bg-blue-50 text-blue-700 font-medium" : ""}
                              >
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className={isMenuActive(item.url) ? "bg-gray-100 text-gray-900" : ""}
                    >
                      <a href={item.url}>
                        <item.icon className={isMenuActive(item.url) ? "text-blue-600" : ""} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}