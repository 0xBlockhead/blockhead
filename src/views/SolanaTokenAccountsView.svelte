<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		title = 'Token accounts',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SolanaTokenAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaTokenAccount}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				tokenAccountPubkey: true,
				$mint: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaTokenAccount })}
		{@const solanaTokenAccountSelector = solanaTokenAccount[EntityMetaKey.Selector]}
		{@const network = solanaTokenAccountSelector.$network}
		<EntityView
			entityType={EntityType.SolanaTokenAccount}
			entitySelector={solanaTokenAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-account/[tokenAccountPubkey=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						tokenAccountPubkey: solanaTokenAccountSelector.tokenAccountPubkey,
					}
				)
			}
		>
			{#snippet Title()}
				{solanaTokenAccountSelector.tokenAccountPubkey || 'solana token account'}
			{/snippet}

			{#snippet Value()}
				{solanaTokenAccountSelector.tokenAccountPubkey}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{solanaTokenAccount.$mint.mintAddress || 'solana token mint'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
