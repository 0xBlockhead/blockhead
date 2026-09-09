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
	}: EntityListViewProps<EntityType.CosmosValidator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosValidator}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				moniker: true,
				operatorAddress: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosValidator })}
		{@const cosmosValidatorSelector = cosmosValidator[EntityMetaKey.Selector]}
		{@const network = cosmosValidatorSelector.$network}
		<EntityView
			entityType={EntityType.CosmosValidator}
			entitySelector={cosmosValidatorSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkeyOrStringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						validatorId: cosmosValidatorSelector.operatorAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{[(cosmosValidator.moniker ?? ''), cosmosValidatorSelector.operatorAddress].filter(Boolean).join(' ') || 'Cosmos validator'}
			{/snippet}

			{#snippet Value()}
				{cosmosValidatorSelector.operatorAddress}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosValidator.$network.name || (cosmosValidator.$network.caip2 == null ? '' : `${cosmosValidator.$network.caip2.namespace}:${cosmosValidator.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
