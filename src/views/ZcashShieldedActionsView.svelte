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
		title = 'Zcash shielded actions',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Zcash shielded actions...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZcashShieldedActions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.ZcashShieldedAction>
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
	import ZcashShieldedActionView from '$/views/ZcashShieldedActionView.svelte'
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
					actionKind: true,
					indexInTransaction: true,
					pool: true,
					nullifier: true,
					noteCommitment: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ZcashShieldedAction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(zcashShieldedActions)}
			{@const uniqueZcashShieldedActions = [...new Map(zcashShieldedActions.values.map((zcashShieldedAction) => [zcashShieldedAction[EntityMetaKey.SelectorKey], zcashShieldedAction])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ZcashShieldedAction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={zcashShieldedActions.values.length === uniqueZcashShieldedActions.length && zcashShieldedActions.totalCount != null && zcashShieldedActions.totalCount >= uniqueZcashShieldedActions.length ? zcashShieldedActions.totalCount : uniqueZcashShieldedActions.length}
				getKey={(zcashShieldedAction) => zcashShieldedAction[EntityMetaKey.SelectorKey]}
				items={uniqueZcashShieldedActions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Zcash shielded actions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: zcashShieldedAction }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.ZcashShieldedAction> })}
					<ZcashShieldedActionView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/shielded-action/[pool]/[actionKind]/[actionIndex=nonNegativeInteger]', {
								networkSlug: String(networkByCaip2[String(({ ...zcashShieldedAction.entitySelector, ...zcashShieldedAction }).$transaction.$network.caip2)].slug),
								txId: String(({ ...zcashShieldedAction.entitySelector, ...zcashShieldedAction }).$transaction.txId),
								pool: String(({ ...zcashShieldedAction.entitySelector, ...zcashShieldedAction }).pool),
								actionKind: String(({ ...zcashShieldedAction.entitySelector, ...zcashShieldedAction }).actionKind),
								actionIndex: String(({ ...zcashShieldedAction.entitySelector, ...zcashShieldedAction }).indexInTransaction),
							})
						}
						selection={select(EntityType.ZcashShieldedAction, zcashShieldedAction.entitySelector)}
						prefetched={zcashShieldedAction}
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
		entityType={EntityType.ZcashShieldedAction}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
