"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/app/lib/auth-client";

export default function ProfileCard() {
  const { data: session } = authClient.useSession(); 
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-2xl mt-16">
      <CardHeader className="flex flex-col items-center text-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-2xl font-semibold">{session?.user.name}</h2>
          <h3 className="text-sm p-2">{session?.user.email}</h3>
          <p className="text-muted-foreground text-sm">
            Dev Engineer • Open Source Enthusiast
          </p>
        </div>

        <div className="flex gap-2">
          <Badge variant="secondary">React</Badge>
          <Badge variant="secondary">Next.js</Badge>
          <Badge variant="secondary">TypeScript</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground text-center">
          Building beautifully designed components that you can copy and paste
          into your apps.
        </p>

        <Separator />

        {/* Stats */}
        <div className="flex justify-around text-center">
          <div>
            <p className="font-semibold text-lg">1.2k</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="font-semibold text-lg">320</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
          <div>
            <p className="font-semibold text-lg">45</p>
            <p className="text-xs text-muted-foreground">Projects</p>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          <Button className="w-full">Follow</Button>
          
        </div>
      </CardContent>
    </Card>
  )
}