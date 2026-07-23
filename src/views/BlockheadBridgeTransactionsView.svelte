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




	// State
	let {
		selection,
		countResource,
		title = 'Transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadBridgeTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadBridgeTransaction>
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
	entityType={EntityType.BlockheadBridgeTransaction}
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
				createdAt: true,
				$sourceTx: true,
				$account: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadBridgeTransactions) => [...new Map(blockheadBridgeTransactions.values.map((blockheadBridgeTransaction) => [blockheadBridgeTransaction[EntityMetaKey.SelectorKey], blockheadBridgeTransaction])).values()]}
	getKey={(blockheadBridgeTransaction) => blockheadBridgeTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bridge transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadBridgeTransaction })}
		{@const blockheadBridgeTransactionFields = { ...blockheadBridgeTransaction[EntityMetaKey.Selector], ...blockheadBridgeTransaction }}
		<EntityView
			entityType={EntityType.BlockheadBridgeTransaction}
			entitySelector={blockheadBridgeTransaction[EntityMetaKey.Selector]}
			href={
				(
					blockheadBridgeTransaction[EntityMetaKey.Selector] != null && 'createdAt' in blockheadBridgeTransaction[EntityMetaKey.Selector]
					&& blockheadBridgeTransaction[EntityMetaKey.Selector].createdAt != null
					&& blockheadBridgeTransaction[EntityMetaKey.Selector] != null && '$account' in blockheadBridgeTransaction[EntityMetaKey.Selector]
					&& blockheadBridgeTransaction[EntityMetaKey.Selector].$account != null && 'address' in blockheadBridgeTransaction[EntityMetaKey.Selector].$account
					&& blockheadBridgeTransaction[EntityMetaKey.Selector].$account.address != null
					&& blockheadBridgeTransaction[EntityMetaKey.Selector] != null && '$sourceTx' in blockheadBridgeTransaction[EntityMetaKey.Selector]
					&& blockheadBridgeTransaction[EntityMetaKey.Selector].$sourceTx != null && '$network' in blockheadBridgeTransaction[EntityMetaKey.Selector].$sourceTx
					&& blockheadBridgeTransaction[EntityMetaKey.Selector].$sourceTx.$network != null && 'caip2' in blockheadBridgeTransaction[EntityMetaKey.Selector].$sourceTx.$network
					&& blockheadBridgeTransaction[EntityMetaKey.Selector].$sourceTx.$network.caip2 != null && 'reference' in blockheadBridgeTransaction[EntityMetaKey.Selector].$sourceTx.$network.caip2
					&& blockheadBridgeTransaction[EntityMetaKey.Selector].$sourceTx.$network.caip2.reference != null
					&& blockheadBridgeTransaction[EntityMetaKey.Selector].$sourceTx != null && 'txHash' in blockheadBridgeTransaction[EntityMetaKey.Selector].$sourceTx
					&& blockheadBridgeTransaction[EntityMetaKey.Selector].$sourceTx.txHash != null ?
						resolve('/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash=stringSegment]/[createdAt=nonNegativeInteger]', {
					createdAt: String(blockheadBridgeTransaction[EntityMetaKey.Selector].createdAt ?? ''),
					address: String(blockheadBridgeTransaction[EntityMetaKey.Selector].$account.address ?? ''),
					chainId: String(blockheadBridgeTransaction[EntityMetaKey.Selector].$sourceTx.$network.caip2.reference ?? ''),
					sourceTxHash: encodeURIComponent(String(blockheadBridgeTransaction[EntityMetaKey.Selector].$sourceTx.txHash ?? '')),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadBridgeTransactionFields.createdAt) ?? '')].filter(Boolean).join(' ') || 'bridge transaction'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadBridgeTransactionFields.$sourceTx.txHash) ?? '')].filter(Boolean).join(' ') || 'EVM transaction'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((blockheadBridgeTransactionFields.$account.address) ?? '')].filter(Boolean).join(' ') || 'EVM account'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
