"use client";

import { usePremiumModal } from "@/hooks/usePremiumModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";

export const PremiumModal = () => {
    const premiumModal = usePremiumModal();

    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: (data) => {
            window.location.href = data;
        },
        onError: (err) => {
            toast.error(err);
        }
    })

    const upgradeToPremium = () => {
        execute({});
    }

    return (
        <Dialog
            onOpenChange={premiumModal.onClose}
            open={premiumModal.isOpen}
        >
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <div className="aspect-video relative flex items-center justify-center">
                    <Image src="/hero.svg" alt="Hero" className="object-cover" fill />
                </div>

                <div className="text-neutral-700 mx-auto space-y-6 p-6">
                    <h2 className="font-semibold text-xl">
                        Upgrade to TaskHub Pro today!
                    </h2>

                    <p className="text-xs font-semibold text-neutral-600">
                        Explore the best of TaskHub
                    </p>

                    <div className="pl-3">
                        <ul className="text-sm list-disc">
                            <li>Unlimited boards</li>
                            <li>Advanced checklists</li>
                            <li>Admin and security features</li>
                            <li>And more!</li>
                        </ul>
                    </div>

                    <Button
                        disabled={isLoading}
                        onClick={upgradeToPremium}
                        className="w-full"
                        variant="primary"
                    >
                        Upgrade
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}