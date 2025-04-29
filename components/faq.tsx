import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FAQ() {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
        <CardDescription>
          Find answers to common questions about our digital business card
          service
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="mb-4 text-lg font-medium">General Questions</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                What is a digital business card?
              </AccordionTrigger>
              <AccordionContent>
                A digital business card is an electronic version of a
                traditional business card that can be shared via QR code, email,
                text message, or social media. It contains your contact
                information, social media profiles, and other relevant details
                about you or your business.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                How do I share my digital business card?
              </AccordionTrigger>
              <AccordionContent>
                You can share your digital business card by sending your unique
                URL, using the generated QR code, or through direct sharing
                options like email, SMS, or social media platforms.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Can I customize my digital business card?
              </AccordionTrigger>
              <AccordionContent>
                Yes, you can fully customize your digital business card with
                your own branding, colors, images, and content. You can also
                choose from various templates and layouts.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-medium">Account & Subscription</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="account-1">
              <AccordionTrigger>How do I create an account?</AccordionTrigger>
              <AccordionContent>
                To create an account, click on the &quot;Sign Up&quot; button on
                our homepage, enter your email address, create a password, and
                follow the prompts to complete your profile.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="account-2">
              <AccordionTrigger>
                What subscription plans do you offer?
              </AccordionTrigger>
              <AccordionContent>
                We offer several subscription plans including a free basic plan,
                a premium plan with additional features, and an enterprise plan
                for businesses. Visit our pricing page for detailed information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="account-3">
              <AccordionTrigger>
                How do I cancel my subscription?
              </AccordionTrigger>
              <AccordionContent>
                You can cancel your subscription at any time by going to your
                account settings, selecting &quot;Subscription,&quot; and
                clicking on &quot;Cancel Subscription.&quot; Your access will
                continue until the end of your billing period.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-medium">Technical Support</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="tech-1">
              <AccordionTrigger>
                My QR code isn&apos;t working. What should I do?
              </AccordionTrigger>
              <AccordionContent>
                If your QR code isn&apos;t working, try regenerating it from
                your dashboard. Make sure the QR code has good contrast and is
                large enough to scan. If problems persist, contact our support
                team.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tech-2">
              <AccordionTrigger>
                How do I update my information?
              </AccordionTrigger>
              <AccordionContent>
                You can update your information at any time by logging into your
                account, navigating to your profile, and clicking
                &quot;Edit.&quot; All changes will be reflected immediately on
                your digital business card.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tech-3">
              <AccordionTrigger>
                Can I track who views my digital business card?
              </AccordionTrigger>
              <AccordionContent>
                Yes, premium and enterprise plans include analytics that show
                you how many times your card has been viewed, which links were
                clicked, and other engagement metrics.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </CardContent>
    </Card>
  );
}
