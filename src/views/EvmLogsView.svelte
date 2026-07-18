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
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmLog>
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
	import EvmLogView from '$/views/EvmLogView.svelte'
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
			sources: [
				Source.Blockscout_Rest,
			],
			fields: {
				indexInTransaction: true,
				data: true,
				$transaction: true,
			},
		})
	}
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
		{@const selection = select(EntityType.EvmLog, evmLog[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const evmLogHrefFields = { ...evmLog, ...evmLog[EntityMetaKey.Selector] }}
		<EvmLogView
			selection={selection}
			prefetched={evmLogFields}
			href={
				(evmLogHrefFields.indexInTransaction !== undefined && evmLogHrefFields.$transaction !== undefined && evmLogHrefFields.$transaction.txHash !== undefined && evmLogHrefFields.$transaction.$network !== undefined && evmLogHrefFields.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]', {
					indexInTransaction: String(evmLogHrefFields.indexInTransaction ?? ''),
					transactionId: String(evmLogHrefFields.$transaction.txHash ?? ''),
					network: String(caip2StringFromValue(evmLogHrefFields.$transaction.$network.caip2) ?? ''),
				}) : evmLogHrefFields.indexInTransaction !== undefined && evmLogHrefFields.$transaction !== undefined && evmLogHrefFields.$transaction.txHash !== undefined && evmLogHrefFields.$transaction.$network !== undefined && evmLogHrefFields.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]', {
					indexInTransaction: String(evmLogHrefFields.indexInTransaction ?? ''),
					transactionId: String(evmLogHrefFields.$transaction.txHash ?? ''),
					network: String(evmLogHrefFields.$transaction.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
