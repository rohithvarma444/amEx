// app/sync-user/page.tsx
import { auth } from "@clerk/nextjs/server"; 
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "../../lib/db";
import { redirect } from "next/navigation";

export default async function SyncUserPage() {
  const { userId } =await  auth();
  console.log("Syncing user...,", userId);

  if (!userId) {
    return <p>Not authenticated</p>;
}
try {
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);

  if (!clerkUser) {
      throw new Error("User not found in Clerk");
  }

  console.log("Syncing user:", clerkUser);

  const existingUser = await db.user.findUnique({
      where: { id: userId },
  });

  if (!existingUser) {
      await db.user.create({
          data: {
              id: userId,
              firstName: clerkUser.firstName ?? "",
              lastName: clerkUser.lastName ?? "",
              email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
          },
      });
      console.log("New user added to the database:", userId);
  }

} catch (error) {
  //console.error("Error syncing user:", error);
}

return redirect("/dashboard"); 
}