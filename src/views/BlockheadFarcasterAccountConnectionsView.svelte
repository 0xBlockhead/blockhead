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
	}: EntityListViewProps<EntityType.BlockheadFarcasterAccountConnection> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	bind:open
	resource={
		selection({
			fields: {
				$user: true,
				authMethod: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadFarcasterAccountConnection })}
		{@const blockheadFarcasterAccountConnectionSelector = blockheadFarcasterAccountConnection[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadFarcasterAccountConnection}
			entitySelector={blockheadFarcasterAccountConnectionSelector}
			href={
				resolve(
					'/(social)/(farcaster)/farcaster/(farcasterNetwork)/account/[connectionId=stringSegment]',
					{
						connectionId: blockheadFarcasterAccountConnectionSelector.connectionId,
					}
				)
			}
		>
			{#snippet Title()}
				Verified Farcaster connection
			{/snippet}

			{#snippet Value()}
				{[(blockheadFarcasterAccountConnection.$user.displayName ?? ''), (blockheadFarcasterAccountConnection.$user.username ?? ''), String(blockheadFarcasterAccountConnection.$user.fid)].filter(Boolean).join(' ') || 'Farcaster user'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadFarcasterAccountConnection.authMethod ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
