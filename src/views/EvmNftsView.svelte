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
		typeAnnotationParagraphs = ['A non-fungible token on an EVM contract, with ERC-8004 agent registration fields shown when the resolver supplies registry evidence.'],
		placeholderText,
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
			selection({
				sources: [
					Source.Eip8004Scan_Rest,
				],
				fields: {
					name: true,
					tokenId: true,
					$contract: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={evmNfts.totalCount}
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
					{@const evmNftFields = { ...evmNft[EntityMetaKey.Selector], ...evmNft }}
					{@const evmNftHrefFields = { ...evmNft, ...evmNft[EntityMetaKey.Selector] }}
					<EvmNftView
						selection={select(EntityType.EvmNft, evmNft[EntityMetaKey.Selector])}
						prefetched={evmNftFields}
						href={
							(evmNftHrefFields.$contract !== undefined && evmNftHrefFields.$contract.$network !== undefined && evmNftHrefFields.$contract.$network.caip2 !== undefined && evmNftHrefFields.$contract.$network.caip2.reference !== undefined && evmNftHrefFields.$contract !== undefined && evmNftHrefFields.$contract.address !== undefined && evmNftHrefFields.tokenId !== undefined ? resolve('/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId]', {
								chainId: String(evmNftHrefFields.$contract.$network.caip2.reference ?? ''),
								contractAddress: String(evmNftHrefFields.$contract.address ?? ''),
								tokenId: String(evmNftHrefFields.tokenId ?? ''),
							}) : undefined)
						}
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
