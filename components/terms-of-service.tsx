import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function TermsOfService() {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Terms of Service</CardTitle>
        <CardDescription>Last updated: April 29, 2025</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
        <section>
          <h3 className="mb-2 text-[1.125rem] font-medium">
            1. Acceptance of Terms
          </h3>
          <p className="text-muted-foreground">
            By accessing or using our digital business card service, you agree
            to be bound by these Terms of Service. If you do not agree to all
            the terms and conditions, you may not access or use our services.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-[1.125rem] font-medium">
            2. Description of Service
          </h3>
          <p className="text-muted-foreground mb-4">
            Our service provides users with the ability to create, customize,
            and share digital business cards. We reserve the right to modify,
            suspend, or discontinue any aspect of the service at any time.
          </p>
          <p className="text-muted-foreground">
            Features and functionality may vary based on subscription level and
            may change over time as the service evolves.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-[1.125rem] font-medium">
            3. Registration and Account
          </h3>
          <p className="text-muted-foreground mb-4">
            To use certain features of our service, you must register for an
            account. You agree to provide accurate, current, and complete
            information during the registration process and to update such
            information to keep it accurate, current, and complete.
          </p>
          <p className="text-muted-foreground">
            You are responsible for safeguarding your password and for all
            activities that occur under your account. You agree to notify us
            immediately of any unauthorized use of your account.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-[1.125rem] font-medium">4. Payment Terms</h3>
          <p className="text-muted-foreground mb-4">
            Some aspects of our service require payment of fees. All fees are
            stated in U.S. dollars unless otherwise specified. You agree to pay
            all applicable fees as described on our website.
          </p>
          <p className="text-muted-foreground">
            Subscription fees are billed in advance on a monthly or annual
            basis, depending on the billing cycle you select. You may cancel
            your subscription at any time, but no refunds will be provided for
            any unused portion of the current billing period.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-[1.125rem] font-medium">5. User Content</h3>
          <p className="text-muted-foreground">
            You retain all rights to any content you submit, post, or display on
            or through our service. By submitting, posting, or displaying
            content, you grant us a worldwide, non-exclusive, royalty-free
            license to use, reproduce, adapt, publish, translate, and distribute
            your content in any existing or future media.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-[1.125rem] font-medium">
            6. Prohibited Activities
          </h3>
          <p className="text-muted-foreground mb-4">
            You agree not to engage in any of the following prohibited
            activities:
          </p>
          <ul className="text-muted-foreground list-inside list-disc space-y-2">
            <li>
              Using the service for any illegal purpose or in violation of any
              laws
            </li>
            <li>Violating the intellectual property rights of others</li>
            <li>
              Attempting to interfere with, compromise the system integrity or
              security, or decipher any transmissions to or from the servers
              running the service
            </li>
            <li>
              Taking any action that imposes an unreasonable or
              disproportionately large load on our infrastructure
            </li>
            <li>
              Uploading invalid data, viruses, worms, or other software agents
              through the service
            </li>
            <li>
              Collecting or harvesting any personally identifiable information
              from the service
            </li>
            <li>
              Using the service for any commercial solicitation purposes without
              our consent
            </li>
          </ul>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-[1.125rem] font-medium">7. Termination</h3>
          <p className="text-muted-foreground">
            We may terminate or suspend your account and access to the service
            immediately, without prior notice or liability, for any reason,
            including if you breach these Terms of Service. Upon termination,
            your right to use the service will immediately cease.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-[1.125rem] font-medium">
            8. Disclaimer of Warranties
          </h3>
          <p className="text-muted-foreground">
            The service is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis. We expressly disclaim all warranties of any
            kind, whether express or implied, including but not limited to the
            implied warranties of merchantability, fitness for a particular
            purpose, and non-infringement.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-[1.125rem] font-medium">
            9. Limitation of Liability
          </h3>
          <p className="text-muted-foreground">
            In no event shall we be liable for any indirect, incidental,
            special, consequential, or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other
            intangible losses, resulting from your access to or use of or
            inability to access or use the service.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-[1.125rem] font-medium">
            10. Changes to Terms
          </h3>
          <p className="text-muted-foreground">
            We reserve the right to modify these Terms of Service at any time.
            We will provide notice of any material changes through the service
            or by other means. Your continued use of the service after such
            modifications will constitute your acknowledgment of the modified
            Terms of Service and agreement to abide and be bound by them.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
