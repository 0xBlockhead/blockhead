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
		title = 'Token accounts',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaTokenAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SolanaTokenAccount>
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
	import SolanaTokenAccountView from '$/views/SolanaTokenAccountView.svelte'
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
					tokenAccountPubkey: true,
					$mint: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaTokenAccount}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(solanaTokenAccounts)}
			{@const uniqueSolanaTokenAccounts = [...new Map(solanaTokenAccounts.values.map((solanaTokenAccount) => [solanaTokenAccount[EntityMetaKey.SelectorKey], solanaTokenAccount])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaTokenAccount}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={solanaTokenAccounts.totalCount}
				getKey={(solanaTokenAccount) => solanaTokenAccount[EntityMetaKey.SelectorKey]}
				items={uniqueSolanaTokenAccounts}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Solana token accounts yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: solanaTokenAccount }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SolanaTokenAccount> })}
					{@const solanaTokenAccountFields = { ...solanaTokenAccount[EntityMetaKey.Selector], ...solanaTokenAccount }}
					{@const solanaTokenAccountHrefFields = { ...solanaTokenAccount, ...solanaTokenAccount[EntityMetaKey.Selector] }}
					<SolanaTokenAccountView
						selection={select(EntityType.SolanaTokenAccount, solanaTokenAccount[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={solanaTokenAccountFields}
						href={
							(solanaTokenAccountHrefFields.$network !== undefined && solanaTokenAccountHrefFields.$network.slug !== undefined && solanaTokenAccountHrefFields.tokenAccountPubkey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-account/[tokenAccountPubkey=stringSegment]', {
								network: String(solanaTokenAccountHrefFields.$network.slug ?? ''),
								tokenAccountPubkey: String(solanaTokenAccountHrefFields.tokenAccountPubkey ?? ''),
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
		entityType={EntityType.SolanaTokenAccount}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
