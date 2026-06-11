import LegalLayout from "../components/LegalLayout";

export default function Privacy() {
  return (
    <LegalLayout eyebrow="Privacy" title="Your data stays minimal.">
      <p>
        Snip stores only the information required to provide URL shortening
        services.
      </p>

      <h2>Information Stored</h2>

      <ul>
        <li>Original URL</li>
        <li>Generated short code</li>
        <li>Creation timestamp</li>
        <li>Expiry timestamp</li>
      </ul>

      <h2>What We Don't Collect</h2>

      <ul>
        <li>User accounts</li>
        <li>Passwords</li>
        <li>Payment information</li>
        <li>Personal profiles</li>
      </ul>

      <h2>Usage</h2>

      <p>Data is used solely to create and resolve shortened URLs.</p>

      <h2>Contact</h2>

      <p>For questions regarding privacy, contact the project owner.</p>
    </LegalLayout>
  );
}
