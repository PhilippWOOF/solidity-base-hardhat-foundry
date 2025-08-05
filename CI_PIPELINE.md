# CI Pipeline Documentation

This repository implements a comprehensive CI/CD pipeline for Solidity smart contract development using GitHub Actions. The pipeline includes multiple stages of testing, analysis, and validation to ensure code quality and security.

## 🚀 Pipeline Overview

The CI pipeline consists of the following workflows:

### 1. Main CI Pipeline (`ci.yml`)
Runs on every push to `main`/`develop` branches and on pull requests.

### 2. Security Scan (`security-scan.yml`)
Comprehensive security analysis that runs weekly and on contract changes.

### 3. Gas Regression Analysis (`gas-regression.yml`)
Tracks gas usage over time to detect performance regressions.

## 📋 Pipeline Stages

### Stage 1: Compilation & Linting
- **Solidity Compiler Check**: Compiles contracts with both Hardhat and Foundry
- **Linting & Code Style**: 
  - TypeScript/JavaScript linting with ESLint and Prettier
  - Solidity linting with Solhint and Prettier
- **Contract Size Check**: Validates contract sizes against limits

### Stage 2: Static Analysis & Security
- **Slither Analysis**: Static analysis for common vulnerabilities
- **Mythril Analysis**: Symbolic execution for security issues
- **Echidna Fuzzing**: Property-based testing for edge cases

### Stage 3: Testing
- **Unit Tests**: Full test suite execution with both Hardhat and Foundry
- **Gas Reporting**: Detailed gas usage analysis
- **Test Coverage**: Code coverage reporting

### Stage 4: Code Coverage
- **Hardhat Coverage**: Coverage analysis using solidity-coverage
- **Foundry Coverage**: Coverage analysis using Foundry's built-in coverage
- **Coverage Reports**: Upload to Codecov for tracking

### Stage 5: Gas Usage Regression
- **Gas Analysis**: Detailed gas usage tracking
- **Regression Detection**: Compare against previous runs
- **Performance Monitoring**: Track gas efficiency over time

### Stage 6: Deployment Simulation
- **Dry-Run Deployment**: Simulate deployment without actual deployment
- **Contract Validation**: Verify deployment parameters
- **Gas Estimation**: Estimate deployment costs

### Stage 7: Integration Tests
- **Cross-Contract Testing**: Test interactions between contracts
- **Integration Scenarios**: End-to-end workflow testing
- **Fork Testing**: Test against forked mainnet state

## 🔧 Configuration Files

### Echidna Configuration (`echidna.config.yml`)
```yaml
testMode: assertion
testLimit: 50000
corpusDir: corpus
coverage: true
gasLimit: 3000000
contractSrc: "contracts/"
```

### Deployment Script (`scripts/deploy.ts`)
Template for deployment simulation in CI environment.

## 🛠️ Tools Used

### Compilation & Testing
- **Hardhat**: Primary development framework
- **Foundry**: Fast testing and fuzzing framework
- **pnpm**: Package manager

### Linting & Formatting
- **ESLint**: TypeScript/JavaScript linting
- **Prettier**: Code formatting
- **Solhint**: Solidity linting

### Security Analysis
- **Slither**: Static analysis
- **Mythril**: Symbolic execution
- **Echidna**: Fuzzing and property-based testing

### Coverage & Reporting
- **solidity-coverage**: Hardhat coverage
- **Foundry Coverage**: Built-in coverage
- **Codecov**: Coverage tracking

## 📊 Artifacts & Reports

### Generated Artifacts
- `gas-report.json`: Detailed gas usage data
- `slither-report.json`: Static analysis results
- `mythril-report.txt`: Symbolic execution results
- `echidna-report.txt`: Fuzzing test results
- `coverage.json`: Coverage data

### Available Reports
- **Gas Usage**: Performance metrics and regression analysis
- **Security**: Vulnerability reports and recommendations
- **Coverage**: Code coverage statistics
- **Test Results**: Test execution summaries

## 🔄 Workflow Triggers

### Automatic Triggers
- **Push to main/develop**: Full pipeline execution
- **Pull Request**: All checks except main-only features
- **Weekly Security Scan**: Comprehensive security analysis

### Manual Triggers
- **workflow_dispatch**: Manual execution of any workflow
- **Security Scan**: On-demand security analysis
- **Gas Analysis**: Manual gas usage analysis

## 🚨 Failure Handling

### Critical Failures (Blocking)
- Compilation errors
- Linting violations
- Test failures
- Coverage below threshold

### Non-Critical Failures (Non-blocking)
- Security tool warnings (reported but don't block)
- Gas regression warnings (reported for review)
- Integration test failures (reported for investigation)

## 📈 Monitoring & Metrics

### Performance Tracking
- Gas usage trends over time
- Test execution time
- Coverage percentage trends
- Security issue frequency

### Quality Gates
- Minimum coverage threshold: 80%
- Maximum gas usage limits
- Security vulnerability thresholds
- Code quality metrics

## 🔧 Customization

### Environment Variables
```bash
# Gas reporting
REPORT_GAS=true
SERIAL=true
RUN_OPTIMIZER=true

# Coverage
COVERAGE=true

# Security
SLITHER_IGNORE=path/to/ignore
MYTHRIL_CONFIG=path/to/config
```

### Workflow Modifications
1. Edit `.github/workflows/ci.yml` for main pipeline changes
2. Modify `echidna.config.yml` for fuzzing configuration
3. Update `scripts/deploy.ts` for deployment simulation
4. Adjust thresholds in workflow files

## 🚀 Getting Started

### Local Development
```bash
# Install dependencies
pnpm install

# Run local checks
pnpm compile
pnpm lint
pnpm test
pnpm coverage
```

### CI Integration
1. Push code to trigger CI
2. Monitor workflow execution in GitHub Actions
3. Review generated reports and artifacts
4. Address any failures or warnings

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Foundry Book](https://book.getfoundry.sh/)
- [Slither Documentation](https://github.com/crytic/slither)
- [Mythril Documentation](https://mythril-classic.readthedocs.io/)
- [Echidna Documentation](https://echidna.readthedocs.io/)

## 🤝 Contributing

When contributing to this repository:

1. Ensure all CI checks pass
2. Review security scan results
3. Monitor gas usage changes
4. Maintain test coverage above 80%
5. Address any linting or formatting issues

## 📞 Support

For questions about the CI pipeline:
- Check workflow logs in GitHub Actions
- Review generated reports and artifacts
- Consult the documentation for each tool
- Open an issue for pipeline-specific problems 