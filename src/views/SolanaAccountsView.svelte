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
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Accounts',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SolanaAccount>
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
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
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
					pubkey: true,
					lamports: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaAccount}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(solanaAccounts)}
			{@const uniqueSolanaAccounts = [...new Map(solanaAccounts.values.map((solanaAccount) => [solanaAccount[EntityMetaKey.SelectorKey], solanaAccount])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaAccount}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={solanaAccounts.totalCount}
				getKey={(solanaAccount) => solanaAccount[EntityMetaKey.SelectorKey]}
				items={uniqueSolanaAccounts}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Solana accounts yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: solanaAccount }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SolanaAccount> })}
					{@const solanaAccountFields = { ...solanaAccount[EntityMetaKey.Selector], ...solanaAccount }}
					{@const solanaAccountHrefFields = { ...solanaAccount, ...solanaAccount[EntityMetaKey.Selector] }}
					<SolanaAccountView
						selection={select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={solanaAccountFields}
						href={
							(solanaAccountHrefFields.$network !== undefined && solanaAccountHrefFields.$network.caip2 !== undefined && solanaAccountHrefFields.$network.caip2.namespace !== undefined && solanaAccountHrefFields.$network !== undefined && solanaAccountHrefFields.$network.caip2 !== undefined && solanaAccountHrefFields.$network.caip2.reference !== undefined && solanaAccountHrefFields.pubkey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/account/[pubkey]', {
								networkSlug: String(networkByCaip2[String(String(solanaAccountHrefFields.$network.caip2.namespace) + ':' + String(solanaAccountHrefFields.$network.caip2.reference))].slug ?? ''),
								pubkey: String(solanaAccountHrefFields.pubkey ?? ''),
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
		entityType={EntityType.SolanaAccount}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
