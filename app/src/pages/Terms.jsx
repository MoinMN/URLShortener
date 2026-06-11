import LegalLayout from "../components/LegalLayout";

export default function Terms() {
  return (
    <LegalLayout eyebrow="Terms" title="Terms of Service.">
      <p>
        By using Snip, you agree to use the service responsibly and lawfully.
      </p>

      <h2>Acceptable Use</h2>

      <ul>
        <li>No malicious content.</li>
        <li>No phishing links.</li>
        <li>No illegal activities.</li>
        <li>No abuse of service resources.</li>
      </ul>

      <h2>Availability</h2>

      <p>
        This service is provided on an "as available" basis without guarantees
        of uptime or permanence.
      </p>

      <h2>Link Expiration</h2>

      <p>
        URLs may expire according to the selected expiration period and can be
        removed automatically.
      </p>

      <h2>Liability</h2>

      <p>
        The project owner is not responsible for damages resulting from use of
        the service.
      </p>
    </LegalLayout>
  );
}
