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
		title = 'Wallet authentications',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadWalletAuthentication> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWalletAuthentication}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					authenticationId: true,
					protocol: true,
					verified: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadWalletAuthentication })}
		{@const blockheadWalletAuthenticationSelector = blockheadWalletAuthentication[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadWalletAuthentication}
			entitySelector={blockheadWalletAuthenticationSelector}
			href={
				resolve(
					'/~/wallet/authentication/[authenticationId=stringSegment]',
					{
						authenticationId: blockheadWalletAuthenticationSelector.authenticationId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadWalletAuthenticationSelector.authenticationId || 'blockhead wallet authentication'}
			{/snippet}

			{#snippet Value()}
				{[blockheadWalletAuthentication.protocol, String(blockheadWalletAuthentication.verified)].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
