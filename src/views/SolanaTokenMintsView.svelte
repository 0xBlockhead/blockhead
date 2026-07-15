<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Token mints',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaTokenMints-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SolanaTokenMint>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import SolanaTokenMintView from '$/views/SolanaTokenMintView.svelte'
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
				fields: {
					mintAddress: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaTokenMint}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(solanaTokenMints)}
			{@const uniqueSolanaTokenMints = [...new Map(solanaTokenMints.values.map((solanaTokenMint) => [solanaTokenMint[EntityMetaKey.SelectorKey], solanaTokenMint])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaTokenMint}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={solanaTokenMints.totalCount}
				getKey={(solanaTokenMint) => solanaTokenMint[EntityMetaKey.SelectorKey]}
				items={uniqueSolanaTokenMints}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Solana token mints yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: solanaTokenMint })}
					{@const solanaTokenMintFields = { ...solanaTokenMint[EntityMetaKey.Selector], ...solanaTokenMint }}
					{@const selection = select(EntityType.SolanaTokenMint, solanaTokenMint[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const solanaTokenMintHrefFields = { ...solanaTokenMint, ...solanaTokenMint[EntityMetaKey.Selector] }}
					<SolanaTokenMintView
						selection={selection}
						prefetched={solanaTokenMintFields}
						href={
							(solanaTokenMintHrefFields.mintAddress !== undefined && solanaTokenMintHrefFields.$network !== undefined && solanaTokenMintHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-mint/[mintAddress=stringSegment]', {
								mintAddress: String(solanaTokenMintHrefFields.mintAddress ?? ''),
								network: String(caip2StringFromValue(solanaTokenMintHrefFields.$network.caip2) ?? ''),
							}) : solanaTokenMintHrefFields.mintAddress !== undefined && solanaTokenMintHrefFields.$network !== undefined && solanaTokenMintHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-mint/[mintAddress=stringSegment]', {
								mintAddress: String(solanaTokenMintHrefFields.mintAddress ?? ''),
								network: String(solanaTokenMintHrefFields.$network.slug ?? ''),
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
		entityType={EntityType.SolanaTokenMint}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
