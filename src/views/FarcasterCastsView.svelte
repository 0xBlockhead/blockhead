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
			...{
				fields: {
					text: true,
					hash: true,
					fid: true,
					timestamp: true,
				},
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
				'fid' in farcasterCastSelector
				&& 'hash' in farcasterCastSelector ?
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]',
						{
							fid: String(farcasterCastSelector.fid),
							hash: farcasterCastSelector.hash,
						}
					)
				:
					'username' in farcasterCastSelector
					&& 'hashPrefix' in farcasterCastSelector ?
						resolve(
							'/(social)/(farcaster)/farcaster/(farcasterNetwork)/c/[fname=stringSegment]/[hash=zeroExHex]',
							{
								fname: farcasterCastSelector.username,
								hash: farcasterCastSelector.hashPrefix,
							}
						)
					:
						'hash' in farcasterCastSelector ?
							resolve(
								'/farcaster/cast/[hash=zeroExHex]',
								{
									hash: farcasterCastSelector.hash,
								}
							)
						:
							'clientUrl' in farcasterCastSelector ?
								resolve(
									'/farcaster/cast/client/[clientUrl=stringSegment]',
									{
										clientUrl: farcasterCastSelector.clientUrl,
									}
								)
							:
								undefined
			}
		>
			{#snippet Title()}
				{[(farcasterCast.text ?? ''), farcasterCast.hash].filter(Boolean).join(' ') || 'Farcaster cast'}
			{/snippet}

			{#snippet Value()}
				{['FID ', String(farcasterCast.fid), ' / ', farcasterCast.hash].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{farcasterCast.timestamp ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
