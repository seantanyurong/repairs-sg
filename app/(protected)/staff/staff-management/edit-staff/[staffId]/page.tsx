import EditStaffClient from "./clientPage";
import { clerkClient } from "@clerk/nextjs/server";

export default async function EditStaff({
  params,
}: {
  params: { staffId: string };
}) {
  const staff = await clerkClient().users.getUser(params.staffId);
  console.log("staff", staff);

  return (
    <EditStaffClient
      staff={{
        id: params.staffId,
        imageUrl: staff.imageUrl,
        firstName: staff.firstName || "",
        lastName: staff.lastName || "",
        email: staff.emailAddresses[0].emailAddress || "",
        role: (staff.publicMetadata.role as string) || "",
        phone: (staff.unsafeMetadata.phone as string) || "",
      }}
    />
  );
}
