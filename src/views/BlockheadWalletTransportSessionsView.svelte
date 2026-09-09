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
		title = 'Wallet transport sessions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadWalletTransportSession> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWalletTransportSession}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				transportSessionId: true,
				status: true,
				transportKind: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadWalletTransportSession })}
		{@const blockheadWalletTransportSessionSelector = blockheadWalletTransportSession[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadWalletTransportSession}
			entitySelector={blockheadWalletTransportSessionSelector}
			href={
				resolve(
					'/~/wallet/connection/[connectionKey=stringSegment]/transport-session/[transportSessionId=stringSegment]',
					{
						connectionKey: blockheadWalletTransportSessionSelector.connectionKey,
						transportSessionId: blockheadWalletTransportSessionSelector.transportSessionId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadWalletTransportSessionSelector.transportSessionId || 'blockhead wallet transport session'}
			{/snippet}

			{#snippet Value()}
				{[blockheadWalletTransportSession.status, blockheadWalletTransportSession.transportKind].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
