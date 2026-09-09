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
	}: EntityListViewProps<EntityType.CctpFee> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CctpFee}
	bind:open
	resource={
		selection({
			fields: {
				apiHost: true,
				fromDomain: true,
				toDomain: true,
			},
		})
	}
>
	{#snippet Item({ item: cctpFee })}
		{@const cctpFeeSelector = cctpFee[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CctpFee}
			entitySelector={cctpFeeSelector}
			href={
				resolve(
					'/cctp/fee/[apiHost=stringSegment]/[fromDomain=nonNegativeInteger]/[toDomain=nonNegativeInteger]',
					{
						apiHost: cctpFeeSelector.apiHost,
						fromDomain: String(cctpFeeSelector.fromDomain),
						toDomain: String(cctpFeeSelector.toDomain),
					}
				)
			}
		>
			{#snippet Title()}
				{cctpFeeSelector.apiHost || 'CCTP fee'}
			{/snippet}

			{#snippet Value()}
				{[String(cctpFeeSelector.fromDomain), String(cctpFeeSelector.toDomain)].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
