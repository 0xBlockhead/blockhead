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
		title = 'Zcash shielded actions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZcashShieldedActions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ZcashShieldedAction>
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
	import ZcashShieldedActionView from '$/views/ZcashShieldedActionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZcashShieldedAction}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
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
	getResourceItems={(zcashShieldedActions) => [...new Map(zcashShieldedActions.values.map((zcashShieldedAction) => [zcashShieldedAction[EntityMetaKey.SelectorKey], zcashShieldedAction])).values()]}
	getKey={(zcashShieldedAction) => zcashShieldedAction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zcash shielded actions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zcashShieldedAction })}
		{@const zcashShieldedActionFields = { ...zcashShieldedAction[EntityMetaKey.Selector], ...zcashShieldedAction }}
		{@const selection = select(EntityType.ZcashShieldedAction, zcashShieldedAction[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const zcashShieldedActionHrefFields = { ...zcashShieldedAction, ...zcashShieldedAction[EntityMetaKey.Selector] }}
		<ZcashShieldedActionView
			selection={selection}
			prefetched={zcashShieldedActionFields}
			href={
				(zcashShieldedActionHrefFields.pool !== undefined && zcashShieldedActionHrefFields.actionKind !== undefined && zcashShieldedActionHrefFields.indexInTransaction !== undefined && zcashShieldedActionHrefFields.$transaction !== undefined && zcashShieldedActionHrefFields.$transaction.txId !== undefined && zcashShieldedActionHrefFields.$transaction.$network !== undefined && zcashShieldedActionHrefFields.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
					pool: String(zcashShieldedActionHrefFields.pool ?? ''),
					actionKind: String(zcashShieldedActionHrefFields.actionKind ?? ''),
					actionIndex: String(zcashShieldedActionHrefFields.indexInTransaction ?? ''),
					transactionId: String(zcashShieldedActionHrefFields.$transaction.txId ?? ''),
					network: String(caip2StringFromValue(zcashShieldedActionHrefFields.$transaction.$network.caip2) ?? ''),
				}) : zcashShieldedActionHrefFields.pool !== undefined && zcashShieldedActionHrefFields.actionKind !== undefined && zcashShieldedActionHrefFields.indexInTransaction !== undefined && zcashShieldedActionHrefFields.$transaction !== undefined && zcashShieldedActionHrefFields.$transaction.txId !== undefined && zcashShieldedActionHrefFields.$transaction.$network !== undefined && zcashShieldedActionHrefFields.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
					pool: String(zcashShieldedActionHrefFields.pool ?? ''),
					actionKind: String(zcashShieldedActionHrefFields.actionKind ?? ''),
					actionIndex: String(zcashShieldedActionHrefFields.indexInTransaction ?? ''),
					transactionId: String(zcashShieldedActionHrefFields.$transaction.txId ?? ''),
					network: String(zcashShieldedActionHrefFields.$transaction.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
