<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'ERC-8004 Registrations',
		typeAnnotationParagraphs = ['A non-fungible token on an EVM contract, with ERC-8004 agent registration fields shown when the resolver supplies registry evidence.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNfts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmNft>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNft}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Eip8004Scan_Rest,
			],
			fields: {
				name: true,
				tokenId: true,
				$contract: true,
			},
			limit: 100,
		})
	}
	{countResource}
	getResourceItems={(evmNfts) => [...new Map(evmNfts.values.map((evmNft) => [evmNft[EntityMetaKey.SelectorKey], evmNft])).values()]}
	getKey={(evmNft) => evmNft[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM NFTs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmNft })}
		{@const evmNftFields = { ...evmNft[EntityMetaKey.Selector], ...evmNft }}
		<EntityView
			entityType={EntityType.EvmNft}
			entitySelector={evmNft[EntityMetaKey.Selector]}
			href={
				(
					evmNft[EntityMetaKey.Selector] != null && 'tokenId' in evmNft[EntityMetaKey.Selector]
					&& evmNft[EntityMetaKey.Selector].tokenId != null
					&& evmNft[EntityMetaKey.Selector] != null && '$contract' in evmNft[EntityMetaKey.Selector]
					&& evmNft[EntityMetaKey.Selector].$contract != null && '$network' in evmNft[EntityMetaKey.Selector].$contract
					&& evmNft[EntityMetaKey.Selector].$contract.$network != null && 'caip2' in evmNft[EntityMetaKey.Selector].$contract.$network
					&& evmNft[EntityMetaKey.Selector].$contract.$network.caip2 != null && 'reference' in evmNft[EntityMetaKey.Selector].$contract.$network.caip2
					&& evmNft[EntityMetaKey.Selector].$contract.$network.caip2.reference != null
					&& evmNft[EntityMetaKey.Selector].$contract != null && 'address' in evmNft[EntityMetaKey.Selector].$contract
					&& evmNft[EntityMetaKey.Selector].$contract.address != null ?
						resolve('/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]', {
					tokenId: String(evmNft[EntityMetaKey.Selector].tokenId ?? ''),
					chainId: String(evmNft[EntityMetaKey.Selector].$contract.$network.caip2.reference ?? ''),
					contractAddress: String(evmNft[EntityMetaKey.Selector].$contract.address ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((evmNftFields.name) ?? '')].filter(Boolean).join(' ') || [String((evmNftFields.tokenId) ?? '')].filter(Boolean).join(' ') || 'EVM NFT'}
			{/snippet}

			{#snippet Value()}
				{[String((evmNftFields.tokenId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
