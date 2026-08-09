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
	}: EntityListViewProps<EntityType.FarcasterUser_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterUser_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$user: true,
					timestampMs: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: farcasterUserTimestamp })}
		{@const farcasterUserTimestampSelector = farcasterUserTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FarcasterUser_Timestamp}
			entitySelector={farcasterUserTimestampSelector}
			href={
				resolve(
					'/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
					{
						userId: String(farcasterUserTimestampSelector.$user.fid),
						timestampMs: String(farcasterUserTimestampSelector.timestampMs),
						source: farcasterUserTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(farcasterUserTimestamp.$user.displayName ?? ''), (farcasterUserTimestamp.$user.username ?? ''), String(farcasterUserTimestampSelector.$user.fid)].filter(Boolean).join(' ') || 'Farcaster user'}
			{/snippet}

			{#snippet Value()}
				{farcasterUserTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{farcasterUserTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
