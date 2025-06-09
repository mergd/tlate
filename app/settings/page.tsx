"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Bell, Key, Trash2, Save } from "lucide-react";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("account");
  // const userInfo = useQuery(api.myFunctions.getUserInfo);
  
  // Form states
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
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
              <h1 className="text-2xl font-serif font-medium text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="space-y-2">
            <h3 className="text-sm font-serif font-medium text-foreground mb-3">Categories</h3>
            <div className="space-y-1">
              <Button 
                variant={activeSection === "account" ? "secondary" : "ghost"} 
                className="w-full justify-start h-8" 
                size="sm"
                onClick={() => setActiveSection("account")}
              >
                <User className="h-3.5 w-3.5 mr-2" />
                Account
              </Button>
              <Button 
                variant={activeSection === "security" ? "secondary" : "ghost"} 
                className="w-full justify-start h-8" 
                size="sm"
                onClick={() => setActiveSection("security")}
              >
                <Key className="h-3.5 w-3.5 mr-2" />
                Security
              </Button>
              <Button 
                variant={activeSection === "notifications" ? "secondary" : "ghost"} 
                className="w-full justify-start h-8" 
                size="sm"
                onClick={() => setActiveSection("notifications")}
              >
                <Bell className="h-3.5 w-3.5 mr-2" />
                Notifications
              </Button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeSection === "account" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-serif">
                    <User className="h-4 w-4 mr-2" />
                    Account Information
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Manage your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="display-name" className="text-sm font-medium">Display Name</Label>
                      <Input
                        id="display-name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your display name"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="h-9"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="min-h-[80px] resize-none"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-serif font-medium text-foreground">Account Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-medium text-foreground">0</div>
                        <div className="text-xs text-muted-foreground">Projects Created</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-medium text-foreground">0</div>
                        <div className="text-xs text-muted-foreground">Documents Translated</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-medium text-foreground">0</div>
                        <div className="text-xs text-muted-foreground">Days Active</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button size="sm" className="h-8">
                      <Save className="h-3.5 w-3.5 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-serif">
                    <Key className="h-4 w-4 mr-2" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-serif font-medium text-foreground">Change Password</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="Enter current password"
                          className="h-9"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            placeholder="Enter new password"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm new password"
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-serif font-medium text-foreground">Session Management</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-foreground">Current Session</div>
                          <div className="text-xs text-muted-foreground">Active now • This device</div>
                        </div>
                        <Button variant="outline" size="sm" className="h-7">
                          End Session
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button size="sm" className="h-8">
                      <Save className="h-3.5 w-3.5 mr-2" />
                      Update Security
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-serif">
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Configure how you receive updates and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-serif font-medium text-foreground">Email Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-foreground">Project Updates</div>
                          <div className="text-xs text-muted-foreground">Get notified about project changes</div>
                        </div>
                        <Button variant="outline" size="sm" className="h-7">
                          Enable
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-foreground">Translation Completion</div>
                          <div className="text-xs text-muted-foreground">When translations are finished</div>
                        </div>
                        <Button variant="outline" size="sm" className="h-7">
                          Enable
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-foreground">Weekly Summary</div>
                          <div className="text-xs text-muted-foreground">Weekly activity digest</div>
                        </div>
                        <Button variant="outline" size="sm" className="h-7">
                          Enable
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-serif font-medium text-foreground">Browser Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-foreground">Real-time Updates</div>
                          <div className="text-xs text-muted-foreground">Instant notifications in browser</div>
                        </div>
                        <Button variant="outline" size="sm" className="h-7">
                          Enable
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button size="sm" className="h-8">
                      <Save className="h-3.5 w-3.5 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Danger Zone */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-serif text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-sm">
                  Irreversible actions that will permanently affect your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-destructive/20 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-foreground">Delete Account</div>
                      <div className="text-xs text-muted-foreground">Permanently delete your account and all data</div>
                    </div>
                    <Button variant="destructive" size="sm" className="h-7">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}