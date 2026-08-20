import {
	describe,
	expect,
	it,
} from 'vitest'

import sourceProviderDefinitions, { sourceBindings } from '$/sources/$sourceProviders.ts'
import { indexSourceProviders } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import {
	sourceBindingId,
	SourceCredentialScope,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const requiredSourceBinding = (
	source: Source,
	matches: (binding: SourceBinding) => boolean = () => true
) => {
	const binding = sourceBindings.find((binding) => (
		binding.source === source
		&& matches(binding)
	))
	if (binding == null)
		throw new Error(`Missing ${source} source binding fixture`)

	return binding
}

describe('source provider runtime capability index', () => {
	it('distinguishes unbound sources from declared bindings unavailable in browsers', () => {
		const unbound = indexSourceProviders(
			[{
				provider: 'Fixture',
				label: 'Fixture',
				sources: {
					[Source.Constants_Internal]: {
						label: 'Fixture',
					},
				},
				bindings: {},
			}],
			{
				PUBLIC_FIXTURE: 'configured',
			},
			new Set()
		)
		expect(unbound.enabledSources).toEqual(new Set([
			Source.Constants_Internal,
		]))
		expect(unbound.enabledBindingIds).toEqual(new Set())
		expect(unbound.resolverPublicEnvBySource.get(Source.Constants_Internal)).toEqual({
			PUBLIC_FIXTURE: 'configured',
		})

		const localOnlyBinding = requiredSourceBinding(Source.Pathfinder)
		const localOnlyUnavailable = indexSourceProviders(
			sourceProviderDefinitions,
			{},
			new Set()
		)
		expect(localOnlyUnavailable.enabledSources.has(Source.Pathfinder)).toBe(false)

		const browserDirectBinding = requiredSourceBinding(Source.Constants_Internal)
		const browserDirectAvailable = indexSourceProviders(
			sourceProviderDefinitions,
			{},
			new Set([
				sourceBindingId(browserDirectBinding),
			])
		)
		expect(browserDirectAvailable.enabledSources.has(Source.Constants_Internal)).toBe(true)
		expect(browserDirectAvailable.enabledBindingIds).toEqual(new Set([
			sourceBindingId(browserDirectBinding),
		]))
	})

	it('gates runtime-secret bindings without disabling a surviving public binding', () => {
		const starkscanBinding = requiredSourceBinding(Source.Starkscan)
		const starkscanBindingId = sourceBindingId(starkscanBinding)
		expect(indexSourceProviders(
			sourceProviderDefinitions,
			{},
			new Set()
		).enabledSources.has(Source.Starkscan)).toBe(false)

		const starkscanAvailable = indexSourceProviders(
			sourceProviderDefinitions,
			{},
			new Set([
				starkscanBindingId,
			])
		)
		expect(starkscanAvailable.enabledSources.has(Source.Starkscan)).toBe(true)
		expect(starkscanAvailable.enabledBindingIds.has(starkscanBindingId)).toBe(true)

		const tonCenterPublicBinding = requiredSourceBinding(
			Source.TonCenter,
			(binding) => binding.credentials.length === 0
		)
		const tonCenterSecretBinding = requiredSourceBinding(
			Source.TonCenter,
			(binding) => binding.credentials.some((credential) => (
				credential.scope === SourceCredentialScope.RuntimeSecret
			))
		)
		const tonCenterPublicBindingId = sourceBindingId(tonCenterPublicBinding)
		const tonCenterSecretBindingId = sourceBindingId(tonCenterSecretBinding)
		const publicOnly = indexSourceProviders(
			sourceProviderDefinitions,
			{},
			new Set([
				tonCenterPublicBindingId,
			])
		)
		expect(publicOnly.enabledSources.has(Source.TonCenter)).toBe(true)
		expect(publicOnly.enabledBindingIds).toEqual(new Set([
			tonCenterPublicBindingId,
		]))

		const publicAndSecret = indexSourceProviders(
			sourceProviderDefinitions,
			{},
			new Set([
				tonCenterPublicBindingId,
				tonCenterSecretBindingId,
			])
		)
		expect(publicAndSecret.enabledSources.has(Source.TonCenter)).toBe(true)
		expect(publicAndSecret.enabledBindingIds).toEqual(new Set([
			tonCenterSecretBindingId,
			tonCenterPublicBindingId,
		]))
	})

	it('exposes public environment only for eligible bindings whose schema passes', () => {
		const blockchairBinding = requiredSourceBinding(Source.Blockchair_Rest)
		const blockchairBindingId = sourceBindingId(blockchairBinding)
		const browserEligibleBindingIds = new Set([
			blockchairBindingId,
		])
		const missingPublicEnv = indexSourceProviders(
			sourceProviderDefinitions,
			{},
			browserEligibleBindingIds
		)
		expect(missingPublicEnv.enabledSources.has(Source.Blockchair_Rest)).toBe(false)
		expect(missingPublicEnv.enabledBindingIds.has(blockchairBindingId)).toBe(false)

		const configured = indexSourceProviders(
			sourceProviderDefinitions,
			{
				PUBLIC_BLOCKCHAIR_API_KEY: 'blockchair-secret',
				PUBLIC_EXTRA_KEY: 'excluded',
			},
			browserEligibleBindingIds
		)
		expect(configured.enabledBindingIds).toEqual(browserEligibleBindingIds)
		expect(configured.resolverPublicEnvBySource.get(Source.Blockchair_Rest)).toEqual({
			PUBLIC_BLOCKCHAIR_API_KEY: 'blockchair-secret',
		})
	})
})
