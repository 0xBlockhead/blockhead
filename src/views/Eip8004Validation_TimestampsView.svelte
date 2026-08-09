<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Eip8004Validation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Eip8004Validation_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					requestHash: true,
					response: true,
					validatorAddress: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: eip8004ValidationTimestamp })}
		{@const eip8004ValidationTimestampSelector = eip8004ValidationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Eip8004Validation_Timestamp}
			entitySelector={eip8004ValidationTimestampSelector}
			href={
				resolve(
					'/(agents)/agents/eip-8004/validation/[requestHashAlgorithm=stringSegment]/[requestHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						requestHashAlgorithm: eip8004ValidationTimestampSelector.requestHashAlgorithm,
						requestHash: eip8004ValidationTimestampSelector.requestHash,
						timestampMs: String(eip8004ValidationTimestampSelector.timestampMs),
						source: eip8004ValidationTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{eip8004ValidationTimestampSelector.requestHash || 'EIP-8004 validation timestamp'}
			{/snippet}

			{#snippet Value()}
				{eip8004ValidationTimestamp.response ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eip8004ValidationTimestamp.validatorAddress ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
