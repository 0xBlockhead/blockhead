/// <reference path="../typescript/Object.d.ts" />

import { type as arktype, type Type } from 'arktype'

import {
	sourceBindingId,
	SourceCredentialScope,
	type SourceBinding,
	type SourceBindingIndex,
} from '$/sources/SourceBinding.ts'

export type SourcePublicEnv = {
	readonly [key: string]: string
}

export type SourceDefinition<
	_Source extends PropertyKey,
> = {
	source: _Source
	label: string
}

export type SourceDefinitionIndex<
	_Source extends PropertyKey,
> = {
	readonly [_Key in _Source]: Omit<SourceDefinition<_Key>, 'source'>
}

export type SourceProviderDefinition<
	_SourceProvider extends PropertyKey,
	_Source extends PropertyKey,
> = {
	provider: _SourceProvider
	label: string
	sources: Partial<SourceDefinitionIndex<_Source>>
	bindings: SourceBindingIndex
}

export const requiredPublicEnvString = (
	publicEnv: SourcePublicEnv,
	key: string
) => {
	const value = (publicEnv[key] ?? '').trim()
	if (value === '')
		throw new Error(`Missing or empty required env: ${key}`)

	return value
}

export const optionalPublicEnvString = (
	publicEnv: SourcePublicEnv,
	key: string
) => {
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
	env: Record<string, string | undefined>,
	browserEligibleBindingIds: ReadonlySet<string>
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
	) => {
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
		if (Object.values(out).some((value) => value.trim() === ''))
			return null

		return out
	}

	const enabledSourceEntries = sourceProviders.flatMap((sourceProvider) => {
		const providerBindings = Object.values<
			| readonly SourceBinding[]
			| undefined
		>(sourceProvider.bindings).flatMap((bindings) => bindings ?? [])
		return Object.keys(sourceProvider.sources).flatMap((source) => {
			if (sourceProvider.sources[source] == null)
				return []

			const declaredSourceBindings = providerBindings.filter((binding) => (
				binding.source === source
			))
			const enabledBindingEntries = declaredSourceBindings
				.filter((binding) => (
					browserEligibleBindingIds.has(sourceBindingId(binding))
				))
				.flatMap((binding) => {
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

				return [{
					bindingId: sourceBindingId(binding),
					publicEnv: Object.assign({}, ...credentialSubsets) satisfies SourcePublicEnv,
				}]
			})
			if (declaredSourceBindings.length > 0 && enabledBindingEntries.length === 0)
				return []

			return [{
				source,
				bindingIds: enabledBindingEntries.map((entry) => entry.bindingId),
				publicEnv: (
					declaredSourceBindings.length === 0 ?
						resolverPublicEnv
					:
						Object.assign(
							{},
							...enabledBindingEntries.map((entry) => entry.publicEnv)
						) satisfies SourcePublicEnv
				),
			}]
		})
	})

	return {
		enabledBindingIds: new Set(
			enabledSourceEntries.flatMap((entry) => entry.bindingIds)
		),
		resolverPublicEnvBySource: new Map(
			enabledSourceEntries.map((entry) => ([
				entry.source,
				entry.publicEnv,
			]))
		),
		enabledSources: new Set(
			enabledSourceEntries.map((entry) => entry.source)
		),
	}
}
