import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useSession } from 'next-auth/react'
import { updateProfile } from '@/app/actions/user'

export default function ProfileUpdate() {
  const { data } = useSession()
  const { toast } = useToast()

  const [profile, setProfile] = useState({
    name: data?.user?.name || '',
    email: data?.user?.email || '',
    oldPassword: '',
    newPassword: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }))
  }

  // Form validation logic
  const validateForm = () => {
    const { oldPassword, newPassword } = profile
    if (isEditing && (!oldPassword || !newPassword)) {
      toast({
        title: "Error",
        description: "Both old and new passwords are required when editing.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const res = await updateProfile(profile)

      if (res.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
      }

      // Clear password fields after successful update
      setProfile(prevProfile => ({
        ...prevProfile,
        oldPassword: '',
        newPassword: ''
      }))
      setIsEditing(false)
    } catch (error) {
      console.log(error, 'Error in updating profile')
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>View or update your profile information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          {isEditing && (
            <>
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                  Old Password
                </label>
                <Input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={profile.oldPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={profile.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            {/* Remove onClick from here */}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Save Changes'}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
