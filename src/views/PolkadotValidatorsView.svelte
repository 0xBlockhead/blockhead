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
		title = 'Validators',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotValidator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotValidator}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					stashAccountId: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: polkadotValidator })}
		{@const polkadotValidatorSelector = polkadotValidator[EntityMetaKey.Selector]}
		{@const network = polkadotValidatorSelector.$network}
		<EntityView
			entityType={EntityType.PolkadotValidator}
			entitySelector={polkadotValidatorSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/validator/polkadot/[stashAccountId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						stashAccountId: polkadotValidatorSelector.stashAccountId,
					}
				)
			}
		>
			{#snippet Title()}
				{polkadotValidatorSelector.stashAccountId || 'Polkadot validator'}
			{/snippet}

			{#snippet Value()}
				{polkadotValidatorSelector.stashAccountId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotValidator.$network.name || `${polkadotValidator.$network.caip2.namespace}:${polkadotValidator.$network.caip2.reference}` || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
