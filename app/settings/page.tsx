"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Palette, Monitor, User, Bell } from "lucide-react";
import { ThemeSelector } from "@/components/theme/ThemeSelector";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your application preferences and settings
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Navigation */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Palette className="h-4 w-4 mr-2" />
                  Appearance
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm" disabled>
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm" disabled>
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Selection */}
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <div className="flex items-center space-x-4">
                    <ThemeSelector />
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred color scheme
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Color Preview */}
                <div className="space-y-4">
                  <Label>Color Preview</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="h-16 bg-background border border-border rounded-lg"></div>
                      <p className="text-xs text-center text-muted-foreground">Background</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 bg-card border border-border rounded-lg"></div>
                      <p className="text-xs text-center text-muted-foreground">Card</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground text-xs font-medium">Primary</span>
                      </div>
                      <p className="text-xs text-center text-muted-foreground">Primary</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 bg-muted rounded-lg"></div>
                      <p className="text-xs text-center text-muted-foreground">Muted</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Status Colors Preview */}
                <div className="space-y-4">
                  <Label>Status Colors</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="h-12 bg-success/10 border border-success/20 rounded-lg flex items-center justify-center">
                        <span className="text-success-foreground text-xs font-medium">Success</span>
                      </div>
                      <p className="text-xs text-center text-muted-foreground">Success</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-warning/10 border border-warning/20 rounded-lg flex items-center justify-center">
                        <span className="text-warning-foreground text-xs font-medium">Warning</span>
                      </div>
                      <p className="text-xs text-center text-muted-foreground">Warning</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-info/10 border border-info/20 rounded-lg flex items-center justify-center">
                        <span className="text-info-foreground text-xs font-medium">Info</span>
                      </div>
                      <p className="text-xs text-center text-muted-foreground">Info</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-danger/10 border border-danger/20 rounded-lg flex items-center justify-center">
                        <span className="text-danger-foreground text-xs font-medium">Danger</span>
                      </div>
                      <p className="text-xs text-center text-muted-foreground">Danger</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings (Placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences (Coming Soon)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-muted-foreground">
                    Account settings will be available in a future update
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings (Placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure your notification preferences (Coming Soon)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-muted-foreground">
                    Notification settings will be available in a future update
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}