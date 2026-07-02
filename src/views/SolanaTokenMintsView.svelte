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


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Token mints',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Solana token mints...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaTokenMints-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SolanaTokenMint>
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
			selection.sources == null ? selection({
				fields: {
					mintAddress: true,
					supply: true,
				},
			}) : selection
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
				totalCount={solanaTokenMints.values.length === uniqueSolanaTokenMints.length && solanaTokenMints.totalCount != null && solanaTokenMints.totalCount >= uniqueSolanaTokenMints.length ? solanaTokenMints.totalCount : uniqueSolanaTokenMints.length}
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

				{#snippet Item({ item: solanaTokenMint }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SolanaTokenMint> })}
					<SolanaTokenMintView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/token-mint/[mintAddress]', {
								networkSlug: String(({ ...solanaTokenMint.entitySelector, ...solanaTokenMint }).$network.slug),
								mintAddress: String(({ ...solanaTokenMint.entitySelector, ...solanaTokenMint }).mintAddress),
							})
						}
						selection={select(EntityType.SolanaTokenMint, solanaTokenMint.entitySelector)}
						prefetched={solanaTokenMint}
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
