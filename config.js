/*
 * Create and export configuration variables
 *
 */

// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
	'httpPort': 3000,
	'httpsPort': 3001,
	'envName': 'staging'
};

// Testing environment
environments.testing = {
	'httpPort': 4000,
	'httpsPort': 4001,
	'envName': 'testing'
};

// Production environment
environments.production = {
	'httpPort': 5000,
	'httpsPort': 5001,
	'envName': 'production'
}

// Determine which envirnoment was passed as a command-line argument
const currentEnvrionment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check the current environment is one of the envirnoments above, if not, default to staging
const environmentToExport = typeof(environments[currentEnvrionment]) === 'object' ? environments[currentEnvrionment] : environments.staging;

// Export the module
module.exports = environmentToExport;
