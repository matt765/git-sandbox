// Large example Git repository data with many branches and extensive commit history
import { GitFile, Commit } from "@/store/gitStore";

interface Branch {
  name: string;
  commitId: string;
  position: number;
}

interface ExampleGitState {
  commits: Record<string, Commit>;
  branches: Record<string, Branch>;
  HEAD: { type: "branch"; name: string };
  logs: string[];
  workingDirectory: GitFile[];
  stagingArea: GitFile[];
}

// Create large example data - 2x bigger than example 1
const createLargeExampleData = (): ExampleGitState => {
  const commits: Record<string, Commit> = {};
  const branches: Record<string, Branch> = {};
  let fileIdCounter = 0;

  // Create main branch commits (60 commits - 2x more than example 1)
  const mainCommits = [
    { id: "000001", message: "Initial commit", files: ["README.md"] },
    { id: "000002", message: "Add package.json", files: ["package.json"] },
    { id: "000003", message: "Setup basic structure", files: ["src/index.ts"] },
    { id: "000004", message: "Add configuration", files: ["config.json"] },
    { id: "000005", message: "Implement core module", files: ["src/core.ts"] },
    { id: "000006", message: "Add tests", files: ["tests/core.test.ts"] },
    { id: "000007", message: "Update documentation", files: ["docs/api.md"] },
    { id: "000008", message: "Fix build issues", files: ["webpack.config.js"] },
    { id: "000009", message: "Add CI/CD", files: [".github/workflows/ci.yml"] },
    { id: "00000a", message: "Performance improvements", files: ["src/utils.ts"] },
    { id: "00000b", message: "Security updates", files: ["src/auth.ts"] },
    { id: "00000c", message: "Database integration", files: ["src/db.ts"] },
    { id: "00000d", message: "API endpoints", files: ["src/api.ts"] },
    { id: "00000e", message: "Error handling", files: ["src/errors.ts"] },
    { id: "00000f", message: "Logging system", files: ["src/logger.ts"] },
    { id: "000010", message: "Data validation", files: ["src/validator.ts"] },
    { id: "000011", message: "Cache implementation", files: ["src/cache.ts"] },
    { id: "000012", message: "User management", files: ["src/users.ts"] },
    { id: "000013", message: "Session handling", files: ["src/session.ts"] },
    { id: "000014", message: "Email service", files: ["src/email.ts"] },
    { id: "000015", message: "File upload", files: ["src/upload.ts"] },
    { id: "000016", message: "Image processing", files: ["src/images.ts"] },
    { id: "000017", message: "Search functionality", files: ["src/search.ts"] },
    { id: "000018", message: "Analytics tracking", files: ["src/analytics.ts"] },
    { id: "000019", message: "Backup system", files: ["src/backup.ts"] },
    { id: "00001a", message: "Monitoring tools", files: ["src/monitor.ts"] },
    { id: "00001b", message: "Deployment scripts", files: ["scripts/deploy.sh"] },
    { id: "00001c", message: "Environment config", files: [".env.example"] },
    { id: "00001d", message: "Docker setup", files: ["Dockerfile"] },
    { id: "00001e", message: "Production optimizations", files: ["src/prod.ts"] },
    // Additional 30 commits
    { id: "00001f", message: "Add GraphQL support", files: ["src/graphql.ts"] },
    { id: "000020", message: "Implement WebSocket", files: ["src/websocket.ts"] },
    { id: "000021", message: "Add rate limiting", files: ["src/rateLimit.ts"] },
    { id: "000022", message: "Security middleware", files: ["src/security.ts"] },
    { id: "000023", message: "Add Redis integration", files: ["src/redis.ts"] },
    { id: "000024", message: "Implement caching layer", files: ["src/cacheLayer.ts"] },
    { id: "000025", message: "Add message queue", files: ["src/queue.ts"] },
    { id: "000026", message: "Background job processing", files: ["src/jobs.ts"] },
    { id: "000027", message: "Add file compression", files: ["src/compression.ts"] },
    { id: "000028", message: "Implement CDN support", files: ["src/cdn.ts"] },
    { id: "000029", message: "Add multi-language support", files: ["src/i18n.ts"] },
    { id: "00002a", message: "Implement timezone handling", files: ["src/timezone.ts"] },
    { id: "00002b", message: "Add audit logging", files: ["src/audit.ts"] },
    { id: "00002c", message: "Implement data encryption", files: ["src/crypto.ts"] },
    { id: "00002d", message: "Add health checks", files: ["src/health.ts"] },
    { id: "00002e", message: "Implement graceful shutdown", files: ["src/shutdown.ts"] },
    { id: "00002f", message: "Add request tracing", files: ["src/tracing.ts"] },
    { id: "000030", message: "Implement feature flags", files: ["src/features.ts"] },
    { id: "000031", message: "Add A/B testing", files: ["src/abtest.ts"] },
    { id: "000032", message: "Implement notification system", files: ["src/notifications.ts"] },
    { id: "000033", message: "Add push notification support", files: ["src/push.ts"] },
    { id: "000034", message: "Implement email templates", files: ["src/templates.ts"] },
    { id: "000035", message: "Add SMS gateway", files: ["src/sms.ts"] },
    { id: "000036", message: "Implement social login", files: ["src/oauth.ts"] },
    { id: "000037", message: "Add two-factor auth", files: ["src/2fa.ts"] },
    { id: "000038", message: "Implement password policies", files: ["src/policies.ts"] },
    { id: "000039", message: "Add session management", files: ["src/sessions.ts"] },
    { id: "00003a", message: "Implement API versioning", files: ["src/versioning.ts"] },
    { id: "00003b", message: "Add request throttling", files: ["src/throttle.ts"] },
    { id: "00003c", message: "Final production release", files: ["CHANGELOG.md"] }
  ];

  // Create main branch
  let parent: string | null = null;
  mainCommits.forEach((commit) => {
    const files = commit.files.map(fileName => ({
      id: fileIdCounter++,
      name: fileName
    }));
    
    commits[commit.id] = {
      id: commit.id,
      parent: parent,
      message: commit.message,
      files
    };
    
    parent = commit.id;
  });

  branches.main = { name: 'main', commitId: "00003c", position: 0 };

  // Create many feature branches (24 branches vs 12 in example 1)
  const branchConfigs = [
    { name: 'authentication', startFromCommit: 5, commits: 15, position: 1 },
    { name: 'dashboard', startFromCommit: 12, commits: 18, position: 2 },
    { name: 'api', startFromCommit: 8, commits: 22, position: 3 },
    { name: 'security', startFromCommit: 25, commits: 8, position: 4 },
    { name: 'mobile', startFromCommit: 18, commits: 20, position: 5 },
    { name: 'analytics', startFromCommit: 30, commits: 12, position: 6 },
    { name: 'ui', startFromCommit: 15, commits: 25, position: 7 },
    { name: 'performance', startFromCommit: 35, commits: 10, position: 8 },
    { name: 'i18n', startFromCommit: 22, commits: 16, position: 9 },
    { name: 'optimization', startFromCommit: 40, commits: 14, position: 10 },
    { name: 'testing', startFromCommit: 10, commits: 12, position: 11 },
    { name: 'deployment', startFromCommit: 45, commits: 9, position: 12 },
    { name: 'monitoring', startFromCommit: 28, commits: 11, position: 13 },
    { name: 'logging', startFromCommit: 20, commits: 13, position: 14 },
    { name: 'caching', startFromCommit: 32, commits: 15, position: 15 },
    { name: 'messaging', startFromCommit: 38, commits: 17, position: 16 },
    { name: 'notifications', startFromCommit: 26, commits: 14, position: 17 },
    { name: 'backup', startFromCommit: 42, commits: 8, position: 18 },
    { name: 'integration', startFromCommit: 16, commits: 19, position: 19 },
    { name: 'websockets', startFromCommit: 24, commits: 13, position: 20 },
    { name: 'graphql', startFromCommit: 31, commits: 16, position: 21 },
    { name: 'microservices', startFromCommit: 36, commits: 21, position: 22 },
    { name: 'devops', startFromCommit: 44, commits: 12, position: 23 },
    { name: 'documentation', startFromCommit: 14, commits: 10, position: 24 }
  ];

  let commitCounter = 1000; // Start from higher number to avoid collisions

  branchConfigs.forEach((config) => {
    const startCommitId = mainCommits[config.startFromCommit].id;
    let branchParent = startCommitId;
    
    // Create commits for this branch
    for (let i = 0; i < config.commits; i++) {
      const commitId = (commitCounter++).toString(16).padStart(6, '0');
      const files: GitFile[] = [];
      
      // Each commit changes 1-3 files
      const numFiles = 1 + (i % 3);
      for (let f = 0; f < numFiles; f++) {
        files.push({
          id: fileIdCounter++,
          name: `${config.name}/${config.name}-${i}-${f}.ts`
        });
      }
      
      commits[commitId] = {
        id: commitId,
        parent: branchParent,
        message: `${config.name}: Implement feature ${i + 1}`,
        files
      };
      
      branchParent = commitId;
    }
    
    // Create the branch pointing to the last commit
    branches[config.name] = {
      name: config.name,
      commitId: branchParent,
      position: config.position
    };
  });

  // Add extensive merge commits (20 merges vs 10 in example 1)
  const mergeCommits = [
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [mainCommits[15].id, branches['authentication'].commitId],
      message: "Merge authentication into main",
      targetBranch: 'main'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [mainCommits[20].id, branches['security'].commitId],
      message: "Merge security hotfix into main",
      targetBranch: 'main'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [mainCommits[25].id, branches['dashboard'].commitId],
      message: "Merge dashboard into main",
      targetBranch: 'main'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [mainCommits[30].id, branches['api'].commitId],
      message: "Merge API redesign into main",
      targetBranch: 'main'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [mainCommits[35].id, branches['mobile'].commitId],
      message: "Merge mobile support into main",
      targetBranch: 'main'
    },
    // Cross-merges between feature branches
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [branches['dashboard'].commitId, branches['analytics'].commitId],
      message: "Merge analytics into dashboard",
      targetBranch: 'dashboard'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [branches['ui'].commitId, branches['mobile'].commitId],
      message: "Merge mobile changes into UI branch",
      targetBranch: 'ui'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [branches['api'].commitId, branches['authentication'].commitId],
      message: "Merge auth improvements into API",
      targetBranch: 'api'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [branches['monitoring'].commitId, branches['logging'].commitId],
      message: "Merge logging into monitoring",
      targetBranch: 'monitoring'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [branches['caching'].commitId, branches['performance'].commitId],
      message: "Merge performance optimizations into caching",
      targetBranch: 'caching'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [branches['messaging'].commitId, branches['notifications'].commitId],
      message: "Merge notifications into messaging",
      targetBranch: 'messaging'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [branches['integration'].commitId, branches['websockets'].commitId],
      message: "Merge websockets into integration",
      targetBranch: 'integration'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [branches['graphql'].commitId, branches['api'].commitId],
      message: "Merge API changes into GraphQL",
      targetBranch: 'graphql'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [branches['microservices'].commitId, branches['deployment'].commitId],
      message: "Merge deployment config into microservices",
      targetBranch: 'microservices'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [branches['devops'].commitId, branches['monitoring'].commitId],
      message: "Merge monitoring into DevOps",
      targetBranch: 'devops'
    },
    // More merges back to main
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [mainCommits[40].id, branches['performance'].commitId],
      message: "Merge performance fixes into main",
      targetBranch: 'main'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [mainCommits[45].id, branches['ui'].commitId],
      message: "Merge UI improvements into main",
      targetBranch: 'main'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [mainCommits[50].id, branches['i18n'].commitId],
      message: "Merge internationalization into main",
      targetBranch: 'main'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [mainCommits[55].id, branches['testing'].commitId],
      message: "Merge testing improvements into main",
      targetBranch: 'main'
    },
    {
      id: (commitCounter++).toString(16).padStart(6, '0'),
      parents: [mainCommits[58].id, branches['deployment'].commitId],
      message: "Merge deployment pipeline into main",
      targetBranch: 'main'
    }
  ];

  mergeCommits.forEach(merge => {
    commits[merge.id] = {
      id: merge.id,
      parent: merge.parents,
      message: merge.message,
      files: [
        {
          id: fileIdCounter++,
          name: `merge-${merge.id}.md`
        }
      ]
    };
    
    // Update the target branch to point to this merge commit
    if (branches[merge.targetBranch]) {
      branches[merge.targetBranch].commitId = merge.id;
    }
  });

  return {
    commits,
    branches,
    HEAD: { type: "branch", name: "main" },
    logs: [
      "Initialized comprehensive enterprise repository",
      "Extensive development across 24 feature branches",
      "Multiple complex merges and integrations",
      "Cross-branch collaboration and dependencies",
      "Advanced CI/CD and deployment strategies",
      "Microservices architecture implementation",
      "Production-ready enterprise application"
    ],
    workingDirectory: [
      { id: fileIdCounter++, name: "new-feature.ts" },
      { id: fileIdCounter++, name: "experimental.tsx" },
      { id: fileIdCounter++, name: "prototype.js" }
    ],
    stagingArea: [
      { id: fileIdCounter++, name: "ready-for-review.ts" },
      { id: fileIdCounter++, name: "tested-feature.tsx" }
    ]
  };
};

export const largeExampleGitData = createLargeExampleData();
