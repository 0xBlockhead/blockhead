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
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'EVM logs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmLogs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmLog>
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

{#snippet ModelTypeAnnotationTooltip()}
		<p>
			Each row is one <code>LOG</code> opcode captured on the parent transaction receipt: emitter address, topics, and data payload.
	</p>

	<p>
		Topic 0 often fingerprints an ABI log declaration; additional topics carry indexed arguments when the emitter used ABI-style indexing.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmLog}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Blockscout_Rest,
			],
			fields: {
				indexInTransaction: true,
				data: true,
				$transaction: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmLogs) => [...new Map(evmLogs.values.map((evmLog) => [evmLog[EntityMetaKey.SelectorKey], evmLog])).values()]}
	getKey={(evmLog) => evmLog[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM logs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmLog })}
		{@const evmLogFields = { ...evmLog[EntityMetaKey.Selector], ...evmLog }}
		<EntityView
			entityType={EntityType.EvmLog}
			entitySelector={evmLog[EntityMetaKey.Selector]}
			href={
				(
					evmLog[EntityMetaKey.Selector] != null && 'indexInTransaction' in evmLog[EntityMetaKey.Selector]
					&& evmLog[EntityMetaKey.Selector].indexInTransaction != null
					&& evmLog[EntityMetaKey.Selector] != null && '$transaction' in evmLog[EntityMetaKey.Selector]
					&& evmLog[EntityMetaKey.Selector].$transaction != null && 'txHash' in evmLog[EntityMetaKey.Selector].$transaction
					&& evmLog[EntityMetaKey.Selector].$transaction.txHash != null
					&& evmLog[EntityMetaKey.Selector].$transaction != null && '$network' in evmLog[EntityMetaKey.Selector].$transaction ?
						evmLog[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in evmLog[EntityMetaKey.Selector].$transaction.$network
						&& evmLog[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]', {
						indexInTransaction: String(evmLog[EntityMetaKey.Selector].indexInTransaction ?? ''),
						transactionId: String(evmLog[EntityMetaKey.Selector].$transaction.txHash ?? ''),
						network: String(caip2StringFromValue(evmLog[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
					})
					:
							evmLog[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in evmLog[EntityMetaKey.Selector].$transaction.$network
							&& evmLog[EntityMetaKey.Selector].$transaction.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]', {
							indexInTransaction: String(evmLog[EntityMetaKey.Selector].indexInTransaction ?? ''),
							transactionId: String(evmLog[EntityMetaKey.Selector].$transaction.txHash ?? ''),
							network: String(evmLog[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
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
				{(String((evmLogFields.indexInTransaction) ?? '') ? 'Log #' + String((evmLogFields.indexInTransaction) ?? '') : '') || [[String((evmLogFields.$emitter.precompileName) ?? ''), String((evmLogFields.$emitter.address) ?? '')].filter(Boolean).join(' ') || 'EVM contract', (String((evmLogFields.indexInTransaction) ?? '') ? '#' + String((evmLogFields.indexInTransaction) ?? '') : '')].filter(Boolean).join(' ') || [(String((evmLogFields.indexInTransaction) ?? '') ? '#' + String((evmLogFields.indexInTransaction) ?? '') : '')].filter(Boolean).join(' ') || 'EVM log'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
