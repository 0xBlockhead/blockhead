<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.FarcasterCast> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterCast}
	bind:open
	resource={
		selection({
			fields: {
				text: true,
				hash: true,
				fid: true,
				timestamp: true,
			},
		})
	}
>
	{#snippet Item({ item: farcasterCast })}
		{@const farcasterCastSelector = farcasterCast[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FarcasterCast}
			entitySelector={farcasterCastSelector}
			href={
				(
					'fid' in farcasterCastSelector
					&& 'hash' in farcasterCastSelector ?
						resolve(
							'/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]',
							{
								fid: String(farcasterCastSelector.fid),
								hash: String(farcasterCastSelector.hash),
							}
						)
					:
						'username' in farcasterCastSelector
						&& 'hashPrefix' in farcasterCastSelector ?
							resolve(
								'/(social)/(farcaster)/farcaster/(farcasterNetwork)/c/[fname=stringSegment]/[hash=zeroExHex]',
								{
									fname: String(farcasterCastSelector.username),
									hash: String(farcasterCastSelector.hashPrefix),
								}
							)
						:
							undefined
				)
			}
		>
			{#snippet Title()}
				{[(farcasterCast.text ?? ''), String(farcasterCastSelector.hash)].filter(Boolean).join(' ') || 'Farcaster cast'}
			{/snippet}

			{#snippet Value()}
				{[String(farcasterCastSelector.fid), String(farcasterCastSelector.hash)].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(farcasterCast.timestamp ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
