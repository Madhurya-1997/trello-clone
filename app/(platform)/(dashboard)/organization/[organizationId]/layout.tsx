import { OrganizationControl } from "./_components/OrganizationControl"

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