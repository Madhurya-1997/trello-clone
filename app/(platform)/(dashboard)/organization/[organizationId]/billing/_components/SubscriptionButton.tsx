"use client"

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { usePremiumModal } from "@/hooks/usePremiumModal";
import { toast } from "sonner";

interface SubscriptionButtonProps {
    isPremium: boolean;
}

export const SubscriptionButton = ({
    isPremium
}: SubscriptionButtonProps) => {

    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: (data) => {
            window.location.href = data;
        },
        onError: (err) => {
            toast.error(err);
        }
    })

    const premiumModal = usePremiumModal();

    const upgradeToPremium = () => {
        if (isPremium) {
            execute({});
        } else {
            premiumModal.onOpen();
        }
    }

    return (
        <Button
            variant={'primary'}
            onClick={upgradeToPremium}
            disabled={isLoading}
        >
            {isPremium ? "Manage Subscription" : "Upgrade to premium"}
        </Button>
    )
}