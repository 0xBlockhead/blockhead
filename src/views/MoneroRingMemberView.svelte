<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MoneroRingMember>, 'prefetched'> = $props()

	const moneroRingMember = $derived(selection({
		sources: selection.sources ?? [
			Source.MoneroDaemonRpc_JsonRpc,
		],
		fields: {
			globalOutputIndex: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MoneroRingView from '$/views/MoneroRingView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroRingMember}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.memberIndex)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/key-image/[inputIndex=nonNegativeInteger]/[keyImage=stringSegment]/(moneroKeyImage)/ring/(moneroRing)/member/[memberIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in selection.entitySelector.$ring.$keyImage.$transaction.$network ?
							caip2StringFromValue(selection.entitySelector.$ring.$keyImage.$transaction.$network.caip2)
						:
							selection.entitySelector.$ring.$keyImage.$transaction.$network.slug
					),
					transactionId: selection.entitySelector.$ring.$keyImage.$transaction.txHash,
					inputIndex: String(selection.entitySelector.$ring.$keyImage.inputIndex),
					keyImage: selection.entitySelector.$ring.$keyImage.keyImage,
					memberIndex: String(selection.entitySelector.memberIndex),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.memberIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moneroRingMember}>
			{#snippet children(entity)}
				{@const globalOutputIndex = entity.globalOutputIndex}
				{#if globalOutputIndex != null}
					<NumberValue
						value={globalOutputIndex}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Ring</dt>
				<dd>
					<MoneroRingView
						selection={select(EntityType.MoneroRing, selection.entitySelector.$ring)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Member index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.memberIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={moneroRingMember}
			>
				{#snippet children(entity)}
					{@const globalOutputIndex = entity.globalOutputIndex}
					{#if globalOutputIndex != null}
						<div>
							<dt>Global output index</dt>
							<dd>
								<NumberValue
									value={globalOutputIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
