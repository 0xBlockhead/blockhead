import { type as arktype, type Type } from 'arktype'

import {
	SourceCredentialScope,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

export type SourcePublicEnv = {
	readonly [key: string]: string
	readonly [key: `PUBLIC_${string}`]: string
}

export type SourceDefinition<
	_Source extends PropertyKey,
> = {
	source: _Source
	label: string
	env?: Type<SourcePublicEnv>
}

export type SourceProviderDefinition<
	_SourceProvider extends PropertyKey,
	_Source extends PropertyKey,
> = {
	provider: _SourceProvider
	label: string
	env?: Type<SourcePublicEnv>
	sources: readonly SourceDefinition<_Source>[]
	bindings?: readonly SourceBinding[]
}

export const requiredPublicEnvString = (
	publicEnv: SourcePublicEnv,
	key: string
): string => {
	const value = (publicEnv[key] ?? '').trim()
	if (value === '')
		throw new Error(`Missing or empty required env: ${key}`)

	return value
}

export const optionalPublicEnvString = (
	publicEnv: SourcePublicEnv,
	key: string
): string | undefined => {
	const value = (publicEnv[key] ?? '').trim()
	if (value === '')
		return undefined

	return value
}

export const envLocatorKey = (locator: string) => (
	locator.startsWith('env:') ?
		locator.slice('env:'.length)
	:
		undefined
)

export const resolveEnvLocator = (
	locator: string,
	env: Record<string, string | undefined>
) => {
	const key = envLocatorKey(locator)
	if (key == null)
		return locator

	const value = (env[key] ?? '').trim()
	if (value === '')
		throw new Error(`Missing or empty source endpoint env: ${key}`)

	return value
}

export const indexSourceProviders = <
	const _SourceProvider extends PropertyKey,
	const _Source extends PropertyKey,
>(
	sourceProviders: readonly SourceProviderDefinition<_SourceProvider, _Source>[],
	env: Record<string, string | undefined>
) => {
	const resolverPublicEnv = (
		Object.fromEntries(
			Object.entries(env).map(([key, value]) => [
				key,
				value ?? '',
			])
		)
	) satisfies SourcePublicEnv

	const envSubsetFromSchema = (
		envSchema: Type<SourcePublicEnv> | undefined
	): SourcePublicEnv | null => {
		if (envSchema == null)
			return {}

		const subset = Object.fromEntries(
			envSchema.props.flatMap((property) => (
				(resolverPublicEnv[String(property.key)] ?? '').trim() === '' ?
					[]
				:
					[[
						String(property.key),
						resolverPublicEnv[String(property.key)],
					]]
			))
		) satisfies SourcePublicEnv
		const out = envSchema(subset)
		if (out instanceof arktype.errors)
			return null

		const subsetEntries: [string, string][] = []
		for (const [key, value] of Object.entries(out)) {
			if (value.trim() === '')
				return null
			subsetEntries.push([
				key,
				value,
			])
		}
		return Object.fromEntries(subsetEntries)
	}

	const enabledSourceEntries = sourceProviders.flatMap((sourceProvider) => {
		const providerSubset = envSubsetFromSchema(
			'env' in sourceProvider ?
				sourceProvider.env
			:
				undefined
		)
		if (providerSubset == null)
			return []

		return sourceProvider.sources.flatMap((sourceDefinition) => {
			const sourceSubset = envSubsetFromSchema(
				'env' in sourceDefinition ?
					sourceDefinition.env
				:
					undefined
			)
			if (sourceSubset == null)
				return []

			const sourceBindings = (sourceProvider.bindings ?? []).filter((binding) => (
				binding.source === sourceDefinition.source
			))
			const bindingSubsets = sourceBindings.flatMap((binding) => {
				const credentialSubsets = binding.credentials.flatMap((credential) => {
					if (
						credential.scope !== SourceCredentialScope.PublicConfig
						|| credential.env == null
					) return [{}]

					const credentialSubset = envSubsetFromSchema(credential.env)
					return credentialSubset == null ? [] : [credentialSubset]
				})
				if (credentialSubsets.length !== binding.credentials.length)
					return []

				return [Object.assign({}, ...credentialSubsets) satisfies SourcePublicEnv]
			})
			if (sourceBindings.length > 0 && bindingSubsets.length === 0)
				return []

			const merged = {
				...providerSubset,
				...sourceSubset,
				...Object.assign({}, ...bindingSubsets),
			}
			return [{
				sourceDefinition,
				publicEnv: (
					'env' in sourceProvider
					|| 'env' in sourceDefinition
					|| sourceBindings.some((binding) => binding.credentials.some((credential) => (
						credential.scope === SourceCredentialScope.PublicConfig
						&& credential.env != null
					))) ?
						merged
					:
						resolverPublicEnv
				),
			}]
		})
	})

	return {
		resolverPublicEnvBySource: new Map(
			enabledSourceEntries.map((entry) => ([
				entry.sourceDefinition.source,
				entry.publicEnv,
			]))
		),
		enabledSources: new Set(
			enabledSourceEntries.map((entry) => entry.sourceDefinition.source)
		),
	}
}

export const enabledSourcesFromBindings = <
	const _Source extends Source,
>(
	sourceBindings: readonly SourceBinding<_Source>[]
) => new Set(
	sourceBindings.map((binding) => binding.source)
)
