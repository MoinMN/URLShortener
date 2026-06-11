import LegalLayout from "../components/LegalLayout";

export default function AboutUs() {
  return (
    <LegalLayout eyebrow="About" title="Built to make long links short.">
      <p>
        Snip is a lightweight serverless URL shortener built on AWS cloud
        services.
      </p>

      <p>
        The project was created as a hands-on learning experience to explore
        serverless architecture, event-driven systems, and cloud-native
        application design.
      </p>

      <h2>Technology</h2>

      <ul>
        <li>React + Vite</li>
        <li>AWS Lambda</li>
        <li>Amazon SQS</li>
        <li>DynamoDB</li>
        <li>API Gateway</li>
      </ul>

      <h2>Mission</h2>

      <p>
        Keep URL shortening simple, fast, and accessible without requiring user
        accounts.
      </p>
    </LegalLayout>
  );
}
