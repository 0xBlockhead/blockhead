<!-- Generated from APP.ts. Do not edit by hand. -->

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
			},
		})
	}
>
	{#snippet Item({ item: farcasterCastTimestamp })}
		{@const farcasterCastTimestampSelector = farcasterCastTimestamp[EntityMetaKey.Selector]}
		{@const cast = farcasterCastTimestampSelector.$cast}
		<EntityView
			entityType={EntityType.FarcasterCast_Timestamp}
			entitySelector={farcasterCastTimestampSelector}
			href={
				'fid' in cast
				&& 'hash' in cast ?
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/observations/[timestampMs=nonNegativeInteger]',
						{
							fid: String(cast.fid),
							hash: cast.hash,
							timestampMs: String(farcasterCastTimestampSelector.timestampMs),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{[(farcasterCastTimestamp.$cast.text ?? ''), farcasterCastTimestampSelector.$cast.hash].filter(Boolean).join(' ') || 'Farcaster cast'}
			{/snippet}

			{#snippet Value()}
				{farcasterCastTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
