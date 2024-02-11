import { auth } from "@clerk/nextjs"

export default function OrganizationIdPage() {
    const { userId, orgId } = auth();

    return (
        <div>

        </div>
    )
}