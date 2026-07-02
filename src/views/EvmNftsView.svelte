<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'ERC-8004 Registrations',
		typeAnnotationParagraphs = ['A non-fungible token on an EVM contract, including ERC-8004 agent registration metadata when available.'],
		placeholderText = 'Loading EVM NFTs...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNfts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmNft>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmNftView from '$/views/EvmNftView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				sources: [
					Source.Eip8004Scan_Rest,
				],
				fields: {
					name: true,
					tokenId: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNft}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(evmNfts)}
			{@const uniqueEvmNfts = [...new Map(evmNfts.values.map((evmNft) => [evmNft[EntityMetaKey.SelectorKey], evmNft])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNft}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmNfts.values.length === uniqueEvmNfts.length && evmNfts.totalCount != null && evmNfts.totalCount >= uniqueEvmNfts.length ? evmNfts.totalCount : uniqueEvmNfts.length}
				getKey={(evmNft) => evmNft[EntityMetaKey.SelectorKey]}
				items={uniqueEvmNfts}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM NFTs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmNft }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmNft> })}
					<EvmNftView
						href={
							resolve('/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId]', {
								chainId: String(({ ...evmNft.entitySelector, ...evmNft }).$contract.$network.caip2.reference),
								contractAddress: String(({ ...evmNft.entitySelector, ...evmNft }).$contract.address),
								tokenId: String(({ ...evmNft.entitySelector, ...evmNft }).tokenId),
							})
						}
						selection={select(EntityType.EvmNft, evmNft.entitySelector)}
						prefetched={evmNft}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmNft}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
