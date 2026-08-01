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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmRollup> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmRollup}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				projectId: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: evmRollup })}
		{@const evmRollupSelector = evmRollup[EntityMetaKey.Selector]}
		{@const network = evmRollupSelector.$network}
		<EntityView
			entityType={EntityType.EvmRollup}
			entitySelector={evmRollupSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						projectId: evmRollupSelector.projectId,
					}
				)
			}
		>
			{#snippet Title()}
				{[(evmRollup.name ?? ''), evmRollupSelector.projectId].filter(Boolean).join(' ') || 'EVM rollup'}
			{/snippet}

			{#snippet Value()}
				{[(evmRollup.name ?? ''), evmRollupSelector.projectId].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmRollup.$network.name || (evmRollupSelector.$network.caip2 == null ? '' : `${evmRollupSelector.$network.caip2.namespace}:${evmRollupSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
