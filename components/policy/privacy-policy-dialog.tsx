import type { Dispatch, SetStateAction } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export function PrivacyPolicyDialog({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Privacy Policy</DialogTitle>
          <DialogDescription>Last updated: April 29, 2025.</DialogDescription>
        </DialogHeader>
        <section>
          <h3 className="mb-2 text-base font-medium">
            1. Information We Collect
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            We collect several types of information from and about users of our
            service, including:
          </p>
          <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
            <li>
              Personal information you provide when registering for an account,
              such as your name, email address, phone number, and profile
              picture.
            </li>
            <li>
              Information you choose to include on your digital business card,
              such as job title, company name, social media profiles, and other
              contact details.
            </li>
            <li>
              Usage data, including how you interact with our service, the
              features you use, and the time spent on the platform.
            </li>
            <li>
              Device information, such as your IP address, browser type,
              operating system, and device identifiers.
            </li>
          </ul>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-base font-medium">
            2. How We Use Your Information
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
            <li>Providing, maintaining, and improving our service.</li>
            <li>Processing transactions and managing your account.</li>
            <li>
              Sending you technical notices, updates, security alerts, and
              support messages.
            </li>
            <li>
              Responding to your comments, questions, and customer service
              requests.
            </li>
            <li>
              Monitoring and analyzing trends, usage, and activities in
              connection with our service.
            </li>
            <li>
              Personalizing your experience and delivering content relevant to
              your interests.
            </li>
            <li>
              Detecting, investigating, and preventing fraudulent transactions
              and other illegal activities.
            </li>
          </ul>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-base font-medium">
            3. Information Sharing and Disclosure
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            We may share your information in the following circumstances:
          </p>
          <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
            <li>With service providers who perform services on our behalf.</li>
            <li>
              To comply with legal obligations, such as responding to a subpoena
              or court order.
            </li>
            <li>
              To protect the rights, property, or safety of our users or others.
            </li>
            <li>
              In connection with a business transaction, such as a merger, sale
              of assets, or acquisition.
            </li>
            <li>With your consent or at your direction.</li>
          </ul>
          <p className="text-muted-foreground mt-4 text-sm">
            We do not sell your personal information to third parties.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-base font-medium">
            4. Cookies and Tracking Technologies
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            We use cookies and similar tracking technologies to track activity
            on our service and hold certain information. Cookies are files with
            a small amount of data that may include an anonymous unique
            identifier.
          </p>
          <p className="text-muted-foreground text-sm">
            You can instruct your browser to refuse all cookies or to indicate
            when a cookie is being sent. However, if you do not accept cookies,
            you may not be able to use some portions of our service.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-base font-medium">5. Data Security</h3>
          <p className="text-muted-foreground text-sm">
            We implement appropriate technical and organizational measures to
            protect the security of your personal information. However, please
            be aware that no method of transmission over the Internet or method
            of electronic storage is 100% secure. While we strive to use
            commercially acceptable means to protect your personal information,
            we cannot guarantee its absolute security.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-base font-medium">
            6. Your Rights and Choices
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Depending on your location, you may have certain rights regarding
            your personal information, including:
          </p>
          <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
            <li>
              Accessing, correcting, or deleting your personal information.
            </li>
            <li>
              Withdrawing your consent at any time, where we rely on consent to
              process your information.
            </li>
            <li>
              Requesting restriction of processing of your personal information.
            </li>
            <li>Requesting transfer of your personal information.</li>
            <li>Opting out of certain data sharing with partners.</li>
          </ul>
          <p className="text-muted-foreground mt-4 text-sm">
            To exercise these rights, please contact us using the information
            provided in the &quot;Contact Us&quot; section.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-base font-medium">
            7. Children&apos;s Privacy
          </h3>
          <p className="text-muted-foreground text-sm">
            Our service is not intended for children under the age of 13. We do
            not knowingly collect personal information from children under 13.
            If you are a parent or guardian and you are aware that your child
            has provided us with personal information, please contact us so that
            we can take necessary actions.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-base font-medium">
            8. International Data Transfers
          </h3>
          <p className="text-muted-foreground text-sm">
            Your information may be transferred to and processed in countries
            other than the country in which you reside. These countries may have
            data protection laws that are different from the laws of your
            country. We take steps to ensure that your information receives an
            adequate level of protection in the countries in which we process
            it.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-base font-medium">
            9. Changes to This Privacy Policy
          </h3>
          <p className="text-muted-foreground text-sm">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date. You are advised to
            review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <Separator />

        <section>
          <h3 className="mb-2 text-base font-medium">10. Contact Us</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            If you have any questions about this Privacy Policy, please contact
            us:
          </p>
          <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
            <li>By email: itsmethu2408@gmail.com.</li>
            <li>By visiting the contact page on our website.</li>
            <li>
              By mail: Digital Business Card, Inc., 123 Main Street, Suite 100,
              Anytown, CA 12345.
            </li>
          </ul>
        </section>
      </DialogContent>
    </Dialog>
  )
}
