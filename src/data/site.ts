/**
 * Everything the site says about itself that is not one of the three
 * content collections. Lists that grow (roles, projects, writing) live in
 * `src/data/*.yaml`; the fixed furniture lives here.
 */

export const site = {
  name: 'Destiny Erhabor',
  role: 'Cloud Native Software Engineer',
  location: 'Lagos, Nigeria',
  email: 'hello@destinyerhabor.com',
} as const;

/**
 * The resume has no file yet. Drop the PDF in `public/` under this name and
 * every Resume control on the site starts working — nav, hero and About all
 * read this one value.
 */
export const resumeUrl = '/destiny-erhabor-cv.pdf';

/**
 * The About portrait is picked up from `src/assets/portrait.*` — dropping the
 * file in is the whole change. Until one is there the design's placeholder
 * frame stands in its place.
 */
export const portraitAlt = 'Destiny Erhabor';

export const nav = [
  { label: 'Experience', href: '/experience/' },
  { label: 'Open source', href: '/open-source/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'Speaking', href: '/speaking/' },
  { label: 'About', href: '/about/' },
] as const;

export const socials = [
  { label: 'GitHub', handle: 'github.com/Caesarsage', href: 'https://github.com/Caesarsage' },
  { label: 'LinkedIn', handle: 'in/destiny-erhabor', href: 'https://www.linkedin.com/in/destiny-erhabor' },
  { label: 'X', handle: '@Caesar_Sage', href: 'https://x.com/Caesar_Sage' },
] as const;

export const mailto = `mailto:${site.email}`;

/**
 * Everywhere the same person can be found. Feeds `sameAs` in the Person
 * structured data, which is how a search engine decides that these profiles
 * and this site are one entity rather than several.
 */
export const sameAs = [
  'https://github.com/Caesarsage',
  'https://www.linkedin.com/in/destiny-erhabor',
  'https://x.com/Caesar_Sage',
  'https://www.freecodecamp.org/news/author/CaesarSage/',
  'https://blog.logrocket.com/author/destinyerhabor/',
  'https://www.aviator.co/blog/author/destinyerhabor/',
  'https://builder.aws.com/community/@caesarsage',
] as const;

/** Subjects the site is actually about, for `knowsAbout`. */
export const knowsAbout = [
  'Software engineering',
  'Kubernetes',
  'Cloud native infrastructure',
  'Platform engineering',
  'DevOps/Cloud engineering',
  'Technical documentation',
  'Go',
  'TypeScript',
  'Contract testing',
  'AWS',
  'Azure',
  'GCP',
  'IBM',
  'Multicloud',
  'Zero-trust workload identity',
] as const;

/** The three pieces of work the home page leads with. */
export const selectedWork = [
  {
    org: 'Kubernetes',
    title: 'Reference generation, from hours to minutes',
    blurb:
      'Removed the hand-maintained configuration that gated every Kubernetes reference build — API groups, versions and kinds now come straight from the OpenAPI spec.',
  },
  {
    org: 'Oris',
    title: 'Payroll that stops before it pays the wrong amount',
    blurb:
      'Records failing a consistency check are now held out of a pay run rather than paid incorrectly, and sign-off moved from an email trail to a fully auditable multi-reviewer path.',
  },
  {
    org: 'Microcks',
    title: 'Contract testing, moved into the inner loop',
    blurb:
      'Running a Microcks contract test used to cost a server, credentials and an import. Now it runs against an ephemeral container in one command, before you push.',
  },
] as const;

export const skills = [
  { label: 'Languages', value: 'Go, TypeScript, Python, SQL, Java with Spring Boot' },
  { label: 'Backend', value: 'NestJS, TypeORM, MySQL, PostgreSQL, Redis, Bull, Kafka, Testcontainers' },
  { label: 'Frontend', value: 'React, Next.js, Astro, TypeScript, Hugo' },
  { label: 'Mobile', value: 'React Native, Expo, over-the-air release management' },
  { label: 'Cloud', value: 'Kubernetes, Docker, Helm, ArgoCD, Terraform, AWS, Azure' },
  { label: 'Platform', value: 'GitHub Actions, OIDC, Prow, Prometheus, Grafana, Loki, OpenTelemetry, Trivy' },
  {
    label: 'Practice',
    value: 'Architecture decision records, phased migration, mutation testing, incident response, OpenAPI',
  },
] as const;

export const education = {
  degree: 'B.Eng, Chemical Engineering',
  detail: 'University of Benin — NPDC/SEPLAT and Jim Ovia scholarships',
  result: 'CGPA 4.42 / 5.0',
} as const;

export const certifications = [
  'AWS Solutions Architect Associate',
  'Azure Administrator Associate',
  'Kubernetes and Cloud Native Associate',
] as const;
