// Large example Git repository data with multiple branches and hundreds of commits
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

// Helper function to generate commit hash - unique for each index
const generateExampleHash = (index: number) => {
  const base = index.toString(16).padStart(4, '0');
  return base + Math.random().toString(16).substr(2, 2);
};

// File types for realistic commit content
const fileTypes = [
  'component', 'service', 'util', 'model', 'controller', 'middleware', 'config', 'test', 'style', 'asset'
];

const fileExtensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.json', '.md', '.yml', '.xml'];

const generateFileName = (index: number): string => {
  const typeIndex = index % fileTypes.length;
  const extIndex = index % fileExtensions.length;
  const type = fileTypes[typeIndex];
  const ext = fileExtensions[extIndex];
  return `${type}${Math.floor(index / 10)}${ext}`;
};

// Commit message templates
const commitMessageTemplates = [
  "Add {feature} functionality",
  "Fix {issue} in {module}",
  "Refactor {component} for better performance",
  "Update {dependency} to latest version",
  "Implement {feature} tests",
  "Configure {tool} for {environment}",
  "Optimize {process} algorithm",
  "Add {feature} validation",
  "Remove deprecated {method}",
  "Merge {branch} into {target}",
  "Hotfix for {critical} bug",
  "Initial {module} setup",
  "Document {api} endpoints",
  "Style improvements for {component}",
  "Add error handling for {operation}",
  "Improve {feature} user experience",
  "Security update for {vulnerability}",
  "Performance optimization in {area}",
  "Add logging to {service}",
  "Cleanup unused {resources}"
];

const features = ['authentication', 'dashboard', 'reporting', 'analytics', 'messaging', 'notifications', 'search', 'upload', 'export', 'integration'];
const modules = ['user-service', 'api-gateway', 'database', 'cache', 'queue', 'auth-module', 'logging', 'monitoring', 'backup', 'scheduler'];
const components = ['UserProfile', 'DataTable', 'Navigation', 'Modal', 'Form', 'Chart', 'Sidebar', 'Header', 'Footer', 'Card'];

const generateCommitMessage = (index: number): string => {
  const template = commitMessageTemplates[index % commitMessageTemplates.length];
  const feature = features[index % features.length];
  const moduleItem = modules[index % modules.length];
  const component = components[index % components.length];
  
  return template
    .replace('{feature}', feature)
    .replace('{module}', moduleItem)
    .replace('{component}', component)
    .replace('{issue}', `issue #${100 + (index % 50)}`)
    .replace('{dependency}', `package-${index % 10}`)
    .replace('{tool}', ['webpack', 'eslint', 'jest', 'docker', 'nginx'][index % 5])
    .replace('{environment}', ['development', 'staging', 'production'][index % 3])
    .replace('{process}', ['sorting', 'filtering', 'rendering', 'validation', 'parsing'][index % 5])
    .replace('{method}', `oldMethod${index % 20}`)
    .replace('{branch}', 'feature-branch')
    .replace('{target}', 'main')
    .replace('{critical}', 'critical')
    .replace('{api}', 'REST API')
    .replace('{operation}', 'file upload')
    .replace('{area}', 'data processing')
    .replace('{service}', 'user service')
    .replace('{vulnerability}', 'XSS')
    .replace('{resources}', 'imports');
};

// Create example data
const createExampleData = (): ExampleGitState => {
  const commits: Record<string, Commit> = {};
  const branches: Record<string, Branch> = {};
  let fileIdCounter = 0;

  // Create main branch commits (backbone)
  const mainCommits = 75;
  let currentParent: string | null = null;
  
  for (let i = 0; i < mainCommits; i++) {
    const commitId = generateExampleHash(i);
    const files: GitFile[] = [];
    
    // Each commit changes 1-4 files
    const numFiles = 1 + (i % 4);
    for (let f = 0; f < numFiles; f++) {
      files.push({
        id: fileIdCounter++,
        name: generateFileName(fileIdCounter)
      });
    }
    
    commits[commitId] = {
      id: commitId,
      parent: currentParent,
      message: generateCommitMessage(i),
      files
    };
    
    currentParent = commitId;
  }

  // Main branch
  const lastMainCommit = generateExampleHash(mainCommits - 1);
  branches.main = { name: 'main', commitId: lastMainCommit, position: 0 };

  // Create feature branches
  const branchConfigs = [
    { name: 'authentication', startFromCommit: 10, commits: 12, position: 1 },
    { name: 'dashboard', startFromCommit: 22, commits: 15, position: 2 },
    { name: 'api', startFromCommit: 15, commits: 20, position: 3 },
    { name: 'security', startFromCommit: 40, commits: 4, position: 4 },
    { name: 'mobile', startFromCommit: 30, commits: 18, position: 5 },
    { name: 'analytics', startFromCommit: 45, commits: 10, position: 6 },
    { name: 'ui', startFromCommit: 20, commits: 22, position: 7 },
    { name: 'performance', startFromCommit: 50, commits: 6, position: 8 },
    { name: 'i18n', startFromCommit: 35, commits: 14, position: 9 },
    { name: 'optimization', startFromCommit: 55, commits: 11, position: 10 },
    { name: 'testing', startFromCommit: 12, commits: 8, position: 11 },
    { name: 'deployment', startFromCommit: 60, commits: 7, position: 12 }
  ];

  let commitCounter = mainCommits;

  branchConfigs.forEach(config => {
    const startCommitId = generateExampleHash(config.startFromCommit);
    let branchParent = startCommitId;
    
    // Create commits for this branch
    for (let i = 0; i < config.commits; i++) {
      const commitId = generateExampleHash(commitCounter++);
      const files: GitFile[] = [];
      
      // Each commit changes 1-3 files
      const numFiles = 1 + (i % 3);
      for (let f = 0; f < numFiles; f++) {
        files.push({
          id: fileIdCounter++,
          name: generateFileName(fileIdCounter)
        });
      }
      
      commits[commitId] = {
        id: commitId,
        parent: branchParent,
        message: `${config.name}: ${generateCommitMessage(commitCounter)}`,
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

  // Add many merge commits to create complex graph
  const mergeCommits = [
    {
      id: generateExampleHash(commitCounter++),
      parents: [generateExampleHash(25), branches['authentication'].commitId],
      message: "Merge authentication into main",
      targetBranch: 'main',
      position: 26
    },
    {
      id: generateExampleHash(commitCounter++),
      parents: [generateExampleHash(35), branches['security'].commitId],
      message: "Merge security hotfix into main",
      targetBranch: 'main',
      position: 36
    },
    {
      id: generateExampleHash(commitCounter++),
      parents: [generateExampleHash(45), branches['dashboard'].commitId],
      message: "Merge dashboard into main",
      targetBranch: 'main',
      position: 46
    },
    {
      id: generateExampleHash(commitCounter++),
      parents: [generateExampleHash(55), branches['api'].commitId],
      message: "Merge API redesign into main",
      targetBranch: 'main',
      position: 56
    },
    {
      id: generateExampleHash(commitCounter++),
      parents: [generateExampleHash(65), branches['mobile'].commitId],
      message: "Merge mobile support into main",
      targetBranch: 'main',
      position: 66
    },
    // Cross-merges between feature branches
    {
      id: generateExampleHash(commitCounter++),
      parents: [branches['dashboard'].commitId, branches['analytics'].commitId],
      message: "Merge analytics into dashboard",
      targetBranch: 'dashboard',
      position: 67
    },
    {
      id: generateExampleHash(commitCounter++),
      parents: [branches['ui'].commitId, branches['mobile'].commitId],
      message: "Merge mobile changes into UI branch",
      targetBranch: 'ui',
      position: 68
    },
    {
      id: generateExampleHash(commitCounter++),
      parents: [branches['api'].commitId, branches['authentication'].commitId],
      message: "Merge auth improvements into API",
      targetBranch: 'api',
      position: 69
    },
    {
      id: generateExampleHash(commitCounter++),
      parents: [generateExampleHash(70), branches['performance'].commitId],
      message: "Merge performance fixes into main",
      targetBranch: 'main',
      position: 71
    },
    {
      id: generateExampleHash(commitCounter++),
      parents: [branches['testing'].commitId, branches['deployment'].commitId],
      message: "Merge deployment config into testing",
      targetBranch: 'testing',
      position: 72
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
          name: `merge-${fileIdCounter}.md`
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
      "Initialized empty Git repository",
      "Created comprehensive development history",
      "Multiple feature branches developed in parallel",
      "Hotfixes applied for critical issues",
      "Performance optimizations implemented",
      "Security patches merged",
      "Ready for production deployment"
    ],
    workingDirectory: [
      { id: fileIdCounter++, name: "pending-feature.ts" },
      { id: fileIdCounter++, name: "draft-component.tsx" }
    ],
    stagingArea: [
      { id: fileIdCounter++, name: "ready-to-commit.js" }
    ]
  };
};

export const exampleGitData = createExampleData();
