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
		placeholderText = 'Loading Cosmos accounts...',
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
			selection.sources == null ? selection({
				fields: {
					address: true,
					$network: true,
				},
			}) : selection
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
				totalCount={cosmosAccounts.values.length === uniqueCosmosAccounts.length && cosmosAccounts.totalCount != null && cosmosAccounts.totalCount >= uniqueCosmosAccounts.length ? cosmosAccounts.totalCount : uniqueCosmosAccounts.length}
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
					<CosmosAccountView
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]', {
								caip2: `${String(({ ...cosmosAccount.entitySelector, ...cosmosAccount }).$network.caip2.namespace)}:${String(({ ...cosmosAccount.entitySelector, ...cosmosAccount }).$network.caip2.reference)}`,
								address: String(({ ...cosmosAccount.entitySelector, ...cosmosAccount }).address),
							})
						}
						selection={select(EntityType.CosmosAccount, cosmosAccount.entitySelector)}
						prefetched={cosmosAccount}
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
