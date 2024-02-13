import { auth } from "@clerk/nextjs"
import { OrganizationControl } from "./_components/OrganizationControl"

export async function generateMetadata() {
    const { orgSlug } = auth();


    let organization = orgSlug?.
        split("-").
        map(word => word.replace(word.charAt(0), word.charAt(0).toLocaleUpperCase())).
        join(" ");

    return {
        title: organization || "organization"
    }
}

export default function OrganizationIdLayout(
    { children }: {
        children: React.ReactNode
    }
) {
    return (
        <>
            <OrganizationControl />
            {children}
        </>
    )
}