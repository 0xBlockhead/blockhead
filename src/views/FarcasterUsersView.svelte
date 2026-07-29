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
	}: EntityListViewProps<EntityType.FarcasterUser> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterUser}
	bind:open
	resource={
		selection({
			fields: {
				$icon: true,
				displayName: true,
				username: true,
				fid: true,
			},
		})
	}
>
	{#snippet Item({ item: farcasterUser })}
		{@const farcasterUserSelector = farcasterUser[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FarcasterUser}
			entitySelector={farcasterUserSelector}
			href={
				resolve(
					'/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]',
					{
						userId: String(farcasterUserSelector.fid),
					}
				)
			}
		>
			{#snippet Title()}
				{[(farcasterUser.displayName ?? ''), (farcasterUser.username ?? ''), String(farcasterUserSelector.fid)].filter(Boolean).join(' ') || 'Farcaster user'}
			{/snippet}

			{#snippet Value()}
				{String(farcasterUserSelector.fid)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{farcasterUser.username ? '@' + farcasterUser.username : ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
