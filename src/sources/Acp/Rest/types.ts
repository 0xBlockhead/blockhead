export type AcpRegistryDistribution = {
	binary?: Record<string, {
		archive: string
		cmd: string
		args?: string[]
		env?: Record<string, string>
	}>
	npx?: {
		package: string
		args?: string[]
	}
	uvx?: {
		package: string
		args?: string[]
	}
}

export type AcpRegistryAgent = {
	id: string
	name: string
	version: string
	description: string
	repository?: string
	website?: string
	authors?: string[]
	license?: string
	icon?: string
	distribution: AcpRegistryDistribution
}

export type AcpRegistry = {
	version: string
	agents: AcpRegistryAgent[]
}
