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
		title = 'Accounts',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosAccount>
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
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
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
					address: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosAccount}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(cosmosAccounts)}
			{@const uniqueCosmosAccounts = [...new Map(cosmosAccounts.values.map((cosmosAccount) => [cosmosAccount[EntityMetaKey.SelectorKey], cosmosAccount])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosAccount}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosAccounts.totalCount}
				getKey={(cosmosAccount) => cosmosAccount[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosAccounts}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos accounts yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosAccount }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosAccount> })}
					{@const cosmosAccountFields = { ...cosmosAccount[EntityMetaKey.Selector], ...cosmosAccount }}
					{@const cosmosAccountHrefFields = { ...cosmosAccount, ...cosmosAccount[EntityMetaKey.Selector] }}
					<CosmosAccountView
						selection={select(EntityType.CosmosAccount, cosmosAccount[EntityMetaKey.Selector])}
						prefetched={cosmosAccountFields}
						href={
							(cosmosAccountHrefFields.$network !== undefined && cosmosAccountHrefFields.$network.caip2 !== undefined && cosmosAccountHrefFields.$network.caip2.namespace !== undefined && cosmosAccountHrefFields.$network !== undefined && cosmosAccountHrefFields.$network.caip2 !== undefined && cosmosAccountHrefFields.$network.caip2.reference !== undefined && cosmosAccountHrefFields.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]', {
								caip2: `${String(cosmosAccountHrefFields.$network.caip2.namespace ?? '')}:${String(cosmosAccountHrefFields.$network.caip2.reference ?? '')}`,
								address: String(cosmosAccountHrefFields.address ?? ''),
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
		entityType={EntityType.CosmosAccount}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
