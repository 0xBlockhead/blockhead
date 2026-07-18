<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmNft>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmNftView from '$/views/EvmNftView.svelte'
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
			sources: [
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
		{@const selection = select(EntityType.EvmNft, evmNft[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const evmNftHrefFields = { ...evmNft, ...evmNft[EntityMetaKey.Selector] }}
		<EvmNftView
			selection={selection}
			prefetched={evmNftFields}
			href={
				(evmNftHrefFields.tokenId !== undefined && evmNftHrefFields.$contract !== undefined && evmNftHrefFields.$contract.$network !== undefined && evmNftHrefFields.$contract.$network.caip2 !== undefined && evmNftHrefFields.$contract.$network.caip2.reference !== undefined && evmNftHrefFields.$contract.address !== undefined ? resolve('/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]', {
					tokenId: String(evmNftHrefFields.tokenId ?? ''),
					chainId: String(evmNftHrefFields.$contract.$network.caip2.reference ?? ''),
					contractAddress: String(evmNftHrefFields.$contract.address ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
