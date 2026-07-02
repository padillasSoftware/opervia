import { execSync } from "node:child_process";

const baseRef = process.env.BASE_REF;
const headRef = process.env.HEAD_REF;

if (!baseRef || !headRef) {
  throw new Error("BASE_REF and HEAD_REF are required.");
}

execSync(`git fetch origin ${baseRef} ${headRef}`, { stdio: "inherit" });

const changedFiles = execSync(
  `git diff --name-only origin/${baseRef}...origin/${headRef}`,
  { encoding: "utf8" },
)
  .split("\n")
  .map((file) => file.trim())
  .filter(Boolean);

const rules = [
  {
    name: "Auth",
    appPatterns: [
      /^app\/pages\/signin/,
      /^app\/pages\/forgot-password/,
      /^app\/pages\/first-login/,
      /^server\/api\/auth\//,
      /^server\/utils\/auth/,
      /^app\/middleware\/authenticated/,
    ],
    testPatterns: [
      /^tests\/e2e\/public\/auth\//,
      /^tests\/e2e\/authenticated\/auth\//,
      /^tests\/smoke\//,
    ],
  },
  {
    name: "Employees",
    appPatterns: [
      /^app\/pages\/dashboard\/employees\//,
      /^app\/components\/employees\//,
      /^app\/composables\/useEmployees/,
      /^server\/api\/employees\//,
      /^server\/services\/employees\//,
    ],
    testPatterns: [
      /^tests\/e2e\/authenticated\/employees\//,
      /^tests\/e2e\/authenticated\/employee\//,
      /^tests\/smoke\//,
    ],
  },
  {
    name: "Dashboard",
    appPatterns: [
      /^app\/pages\/dashboard(\/index)?\.vue$/,
      /^app\/components\/dashboard\//,
      /^app\/layouts\/dashboard/,
    ],
    testPatterns: [
      /^tests\/e2e\/authenticated\/dashboard\//,
      /^tests\/smoke\//,
    ],
  },
  {
    name: "Patients",
    appPatterns: [
      /^app\/pages\/dashboard\/patients\//,
      /^app\/components\/patients\//,
      /^server\/api\/patients\//,
      /^server\/services\/patients\//,
    ],
    testPatterns: [
      /^tests\/e2e\/authenticated\/patients\//,
      /^tests\/smoke\//,
    ],
  },
  {
    name: "Middleware / RBAC",
    appPatterns: [
      /^app\/middleware\//,
      /^server\/middleware\//,
      /^server\/utils\/permissions/,
      /^server\/utils\/roles/,
    ],
    testPatterns: [
      /^tests\/e2e\/public\//,
      /^tests\/e2e\/authenticated\//,
      /^tests\/smoke\//,
    ],
  },
];

const generalAppPatterns = [
  /^app\/pages\//,
  /^app\/components\//,
  /^app\/composables\//,
  /^app\/layouts\//,
  /^app\/middleware\//,
  /^server\/api\//,
  /^server\/services\//,
  /^server\/utils\//,
  /^server\/middleware\//,
];

const ignoredPatterns = [
  /^\.github\//,
  /^README\.md$/,
  /^package\.json$/,
  /^package-lock\.json$/,
  /^prisma\//,
  /^seed\//,
  /^public\//,
  /^\.env/,
  /^nuxt\.config/,
  /^playwright\.config/,
];

const matchesAny = (file, patterns) => patterns.some((pattern) => pattern.test(file));

const changedAppFiles = changedFiles.filter(
  (file) =>
    matchesAny(file, generalAppPatterns) &&
    !matchesAny(file, ignoredPatterns),
);

const changedTestFiles = changedFiles.filter((file) => /^tests\//.test(file));

if (changedAppFiles.length === 0) {
  console.log("No application behavior files changed. Tests are not required.");
  process.exit(0);
}

const failedRules = [];

for (const rule of rules) {
  const ruleChangedFiles = changedFiles.filter((file) =>
    matchesAny(file, rule.appPatterns),
  );

  if (ruleChangedFiles.length === 0) {
    continue;
  }

  const hasMatchingTest = changedFiles.some((file) =>
    matchesAny(file, rule.testPatterns),
  );

  if (!hasMatchingTest) {
    failedRules.push({
      name: rule.name,
      files: ruleChangedFiles,
      expectedTests: rule.testPatterns.map((pattern) =>
        pattern.toString().replace(/^\/\^?/, "").replace(/\\\//g, "/").replace(/\/$/, ""),
      ),
    });
  }
}

if (failedRules.length > 0) {
  console.error("");
  console.error("❌ This pull request modifies application code but required tests were not updated.");
  console.error("");

  for (const failedRule of failedRules) {
    console.error(`Rule: ${failedRule.name}`);
    console.error("Modified files:");
    for (const file of failedRule.files) {
      console.error(`- ${file}`);
    }
    console.error("Expected tests under:");
    for (const pattern of failedRule.expectedTests) {
      console.error(`- ${pattern}`);
    }
    console.error("");
  }

  process.exit(1);
}

if (changedTestFiles.length === 0) {
  console.error("");
  console.error("❌ This pull request modifies application code but no tests were updated.");
  console.error("");
  console.error("Modified application files:");
  for (const file of changedAppFiles) {
    console.error(`- ${file}`);
  }
  console.error("");
  console.error("Please add or update tests under:");
  console.error("- tests/");
  console.error("");

  process.exit(1);
}

console.log("Application files changed and matching tests were updated.");