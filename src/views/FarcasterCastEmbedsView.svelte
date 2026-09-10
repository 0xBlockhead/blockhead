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
	}: EntityListViewProps<EntityType.FarcasterCastEmbed> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterCastEmbed}
	bind:open
	resource={
		selection({
			fields: {
				$icon: true,
				title: true,
				url: true,
				$embeddedCast: true,
				indexInCast: true,
			},
		})
	}
>
	{#snippet Item({ item: farcasterCastEmbed })}
		{@const farcasterCastEmbedSelector = farcasterCastEmbed[EntityMetaKey.Selector]}
		{@const cast = farcasterCastEmbedSelector.$cast}
		<EntityView
			entityType={EntityType.FarcasterCastEmbed}
			entitySelector={farcasterCastEmbedSelector}
			href={
				'fid' in cast
				&& 'hash' in cast ?
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/embed/[indexInCast=nonNegativeInteger]',
						{
							fid: String(cast.fid),
							hash: cast.hash,
							indexInCast: String(farcasterCastEmbedSelector.indexInCast),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{[(farcasterCastEmbed.title ?? ''), (farcasterCastEmbed.url ?? ''), farcasterCastEmbed.$embeddedCast == null ? '' : [(farcasterCastEmbed.$embeddedCast.text ?? ''), farcasterCastEmbed.$embeddedCast.hash].filter(Boolean).join(' ') || 'Farcaster cast'].filter(Boolean).join(' ') || 'Farcaster cast embed'}
			{/snippet}

			{#snippet Value()}
				{farcasterCastEmbedSelector.indexInCast}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
