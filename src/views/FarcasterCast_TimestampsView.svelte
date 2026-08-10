<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.FarcasterCast_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterCast_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$cast: {
						fields: {
							text: true,
							hash: true,
							fid: true,
							timestamp: true,
						},
					},
					timestampMs: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: farcasterCastTimestamp })}
		{@const farcasterCastTimestampSelector = farcasterCastTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FarcasterCast_Timestamp}
			entitySelector={farcasterCastTimestampSelector}
		>
			{#snippet Title()}
				{[(farcasterCastTimestamp.$cast.text ?? ''), farcasterCastTimestamp.$cast.hash].filter(Boolean).join(' ') || 'Farcaster cast'}
			{/snippet}

			{#snippet Value()}
				{farcasterCastTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{farcasterCastTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
