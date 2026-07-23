<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ZcashShieldedAction>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	{countResource}
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
		<EntityView
			entityType={EntityType.ZcashShieldedAction}
			entitySelector={zcashShieldedAction[EntityMetaKey.Selector]}
			href={
				(
					zcashShieldedAction[EntityMetaKey.Selector] != null && 'pool' in zcashShieldedAction[EntityMetaKey.Selector]
					&& zcashShieldedAction[EntityMetaKey.Selector].pool != null
					&& zcashShieldedAction[EntityMetaKey.Selector] != null && 'actionKind' in zcashShieldedAction[EntityMetaKey.Selector]
					&& zcashShieldedAction[EntityMetaKey.Selector].actionKind != null
					&& zcashShieldedAction[EntityMetaKey.Selector] != null && 'indexInTransaction' in zcashShieldedAction[EntityMetaKey.Selector]
					&& zcashShieldedAction[EntityMetaKey.Selector].indexInTransaction != null
					&& zcashShieldedAction[EntityMetaKey.Selector] != null && '$transaction' in zcashShieldedAction[EntityMetaKey.Selector]
					&& zcashShieldedAction[EntityMetaKey.Selector].$transaction != null && 'txId' in zcashShieldedAction[EntityMetaKey.Selector].$transaction
					&& zcashShieldedAction[EntityMetaKey.Selector].$transaction.txId != null
					&& zcashShieldedAction[EntityMetaKey.Selector].$transaction != null && '$network' in zcashShieldedAction[EntityMetaKey.Selector].$transaction ?
						zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network
						&& zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
						pool: String(zcashShieldedAction[EntityMetaKey.Selector].pool ?? ''),
						actionKind: String(zcashShieldedAction[EntityMetaKey.Selector].actionKind ?? ''),
						actionIndex: String(zcashShieldedAction[EntityMetaKey.Selector].indexInTransaction ?? ''),
						transactionId: String(zcashShieldedAction[EntityMetaKey.Selector].$transaction.txId ?? ''),
						network: String(caip2StringFromValue(zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
					})
					:
							zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network
							&& zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
							pool: String(zcashShieldedAction[EntityMetaKey.Selector].pool ?? ''),
							actionKind: String(zcashShieldedAction[EntityMetaKey.Selector].actionKind ?? ''),
							actionIndex: String(zcashShieldedAction[EntityMetaKey.Selector].indexInTransaction ?? ''),
							transactionId: String(zcashShieldedAction[EntityMetaKey.Selector].$transaction.txId ?? ''),
							network: String(zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((zcashShieldedActionFields.actionKind) ?? ''), String((zcashShieldedActionFields.indexInTransaction) ?? '')].filter(Boolean).join(' ') || 'Zcash shielded action'}
			{/snippet}

			{#snippet Value()}
				{[String((zcashShieldedActionFields.pool) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((zcashShieldedActionFields.nullifier) ?? ''), String((zcashShieldedActionFields.noteCommitment) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
