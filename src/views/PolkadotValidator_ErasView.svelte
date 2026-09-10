<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		title = 'Validator eras',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotValidator_Era> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotValidator_Era}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				eraIndex: true,
				active: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: polkadotValidatorEra })}
		{@const polkadotValidatorEraSelector = polkadotValidatorEra[EntityMetaKey.Selector]}
		{@const validator = polkadotValidatorEraSelector.$validator}
		<EntityView
			entityType={EntityType.PolkadotValidator_Era}
			entitySelector={polkadotValidatorEraSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/validator/polkadot/[stashAccountId=stringSegment]/(polkadotValidator)/era/[eraIndex=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in validator.$network ?
								caip2StringFromValue(validator.$network.caip2)
							:
								validator.$network.slug
						),
						stashAccountId: validator.stashAccountId,
						eraIndex: String(polkadotValidatorEraSelector.eraIndex),
						source: polkadotValidatorEraSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{polkadotValidatorEraSelector.eraIndex}
			{/snippet}

			{#snippet Value()}
				{polkadotValidatorEra.active ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotValidatorEraSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
