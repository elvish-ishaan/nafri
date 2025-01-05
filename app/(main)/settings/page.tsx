'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { updateProfile } from "@/app/actions/user";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const { data: session, update: updateSession } = useSession();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [changePassword, setChangePassword] = useState(false);

  // Load session data into formData after session is fetched
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user?.name || "",
        email: session.user?.email || "",
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.oldPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      return;
    }

    if (changePassword && !formData.newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password if changing it.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await updateProfile(formData);
      
      if (res.success) {
         // Update session data to reflect profile changes
        await updateSession({
            ...session,
            user: {
              ...session?.user,
              name: res.data?.name,
              email: res.data?.email,
            },
          });
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Unable to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Current Password</Label>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="changePassword"
              checked={changePassword}
              onCheckedChange={(checked) => setChangePassword(!!checked)}
            />
            <Label htmlFor="changePassword">Change Password</Label>
          </div>
          {changePassword && (
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                required
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
