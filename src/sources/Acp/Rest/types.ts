/**
 * Agent Client Protocol public registry (`registry.json`) fail-closed arktype.
 * @see https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json
 */

import { type as arktype } from 'arktype'


export const acpRegistryBinaryTargetWire = arktype({
	archive: 'string > 0',
	cmd: 'string > 0',
	'args?': 'string[]',
	'env?': 'Record<string, string>',
	'sha256?': 'string > 0',
})

export type AcpRegistryBinaryTarget = typeof acpRegistryBinaryTargetWire.infer

export const acpRegistryPackageRunnerWire = arktype({
	package: 'string > 0',
	'args?': 'string[]',
	'env?': 'Record<string, string>',
})

export type AcpRegistryPackageRunner = typeof acpRegistryPackageRunnerWire.infer

export const acpRegistryDistributionWire = arktype({
	'binary?': {
		'[string]': acpRegistryBinaryTargetWire,
	},
	'npx?': acpRegistryPackageRunnerWire,
	'uvx?': acpRegistryPackageRunnerWire,
})

export type AcpRegistryDistribution = typeof acpRegistryDistributionWire.infer

export const acpRegistryAgentWire = arktype({
	id: 'string > 0',
	name: 'string > 0',
	version: 'string > 0',
	description: 'string',
	'repository?': 'string > 0',
	'website?': 'string > 0',
	'authors?': 'string[]',
	'license?': 'string > 0',
	'icon?': 'string > 0',
	distribution: acpRegistryDistributionWire,
})

export type AcpRegistryAgent = typeof acpRegistryAgentWire.infer

export const acpRegistryWire = arktype({
	version: 'string > 0',
	agents: acpRegistryAgentWire.array(),
})

export type AcpRegistry = typeof acpRegistryWire.infer
