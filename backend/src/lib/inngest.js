import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "interview-platform" });

const syncUser = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        await connectDB();

        const { id, email_addresses, first_name, last_name, image_url } = event.data;

        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}`.trim(),
            profileImage: image_url
        };

        await User.create(newUser);

        // FIX: Pass correct data to Stream
        await upsertStreamUser({
            id: newUser.clerkId,  // Stream user ID
            name: newUser.name,   // FIX: Was profileImage, should be name
            image: newUser.profileImage,  // Add profile image
            email: newUser.email  // Add email for reference
        });
        
        return { success: true, userId: id };
    }
);

const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user-from-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        await connectDB();

        const { id } = event.data;
        await User.deleteOne({ clerkId: id });

        await deleteStreamUser(id);  // Remove .toString() - not needed
        
        return { success: true, deletedUserId: id };
    }
);

export const functions = [syncUser, deleteUserFromDB];
