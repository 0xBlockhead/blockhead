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
		placeholderText,
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
			selection({
				fields: {
					actionKind: true,
					indexInTransaction: true,
					pool: true,
					nullifier: true,
					noteCommitment: true,
					$transaction: true,
				},
			})
		}
		{placeholderText}
	>
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
				totalCount={zcashShieldedActions.totalCount}
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
					{@const zcashShieldedActionFields = { ...zcashShieldedAction[EntityMetaKey.Selector], ...zcashShieldedAction }}
					{@const zcashShieldedActionHrefFields = { ...zcashShieldedAction, ...zcashShieldedAction[EntityMetaKey.Selector] }}
					<ZcashShieldedActionView
						selection={select(EntityType.ZcashShieldedAction, zcashShieldedAction[EntityMetaKey.Selector])}
						prefetched={zcashShieldedActionFields}
						href={
							(zcashShieldedActionHrefFields.$transaction !== undefined && zcashShieldedActionHrefFields.$transaction.$network !== undefined && zcashShieldedActionHrefFields.$transaction.$network.caip2 !== undefined && zcashShieldedActionHrefFields.$transaction.$network.caip2.namespace !== undefined && zcashShieldedActionHrefFields.$transaction !== undefined && zcashShieldedActionHrefFields.$transaction.$network !== undefined && zcashShieldedActionHrefFields.$transaction.$network.caip2 !== undefined && zcashShieldedActionHrefFields.$transaction.$network.caip2.reference !== undefined && zcashShieldedActionHrefFields.$transaction !== undefined && zcashShieldedActionHrefFields.$transaction.txId !== undefined && zcashShieldedActionHrefFields.pool !== undefined && zcashShieldedActionHrefFields.actionKind !== undefined && zcashShieldedActionHrefFields.indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/shielded-action/[pool]/[actionKind]/[actionIndex=nonNegativeInteger]', {
								networkSlug: String(networkByCaip2[String(String(zcashShieldedActionHrefFields.$transaction.$network.caip2.namespace) + ':' + String(zcashShieldedActionHrefFields.$transaction.$network.caip2.reference))].slug ?? ''),
								txId: String(zcashShieldedActionHrefFields.$transaction.txId ?? ''),
								pool: String(zcashShieldedActionHrefFields.pool ?? ''),
								actionKind: String(zcashShieldedActionHrefFields.actionKind ?? ''),
								actionIndex: String(zcashShieldedActionHrefFields.indexInTransaction ?? ''),
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
		entityType={EntityType.ZcashShieldedAction}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
