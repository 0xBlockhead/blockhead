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
			fields: {
				$user: true,
				timestampMs: true,
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
					'/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/observations/[timestampMs=nonNegativeInteger]',
					{
						userId: String(farcasterUserTimestampSelector.$user.fid),
						timestampMs: String(farcasterUserTimestampSelector.timestampMs),
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
		</EntityView>
	{/snippet}
</EntitiesList>
