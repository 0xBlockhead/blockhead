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
	}: Omit<EntitySelectionViewProps<EntityType.BeaconExecutionWithdrawalRequest>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
		],
	}))
	const beaconExecutionWithdrawalRequest = $derived(viewSelection({
		fields: {
			amountGwei: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconExecutionPayloadEnvelopeView from '$/views/BeaconExecutionPayloadEnvelopeView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconExecutionWithdrawalRequest}
	entitySelector={selection.entitySelector}
	title={title ?? `Withdrawal request #${selection.entitySelector.indexInEnvelope}`}
	idDragPlainText={String(selection.entitySelector.indexInEnvelope)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-envelope/(beaconExecutionPayloadEnvelope)/withdrawal-request/[indexInEnvelope=nonNegativeInteger]',
				{
					network: (
						'caip2' in selection.entitySelector.$envelope.$beaconBlock.$network ?
							caip2StringFromValue(selection.entitySelector.$envelope.$beaconBlock.$network.caip2)
						:
							selection.entitySelector.$envelope.$beaconBlock.$network.slug
					),
					root: selection.entitySelector.$envelope.$beaconBlock.root,
					indexInEnvelope: String(selection.entitySelector.indexInEnvelope),
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
		<span data-row="inline align-center gap-2 wrap">
			<span>Withdrawal request </span>
			<span data-badge="small">
				#{selection.entitySelector.indexInEnvelope}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={beaconExecutionWithdrawalRequest}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.amountGwei}
				/>

				<span> Gwei</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<BeaconExecutionPayloadEnvelopeView
				selection={select(EntityType.BeaconExecutionPayloadEnvelope, selection.entitySelector.$envelope)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Envelope</dt>
				<dd>
					<BeaconExecutionPayloadEnvelopeView
						selection={select(EntityType.BeaconExecutionPayloadEnvelope, selection.entitySelector.$envelope)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Index in envelope</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.indexInEnvelope}
					/>
				</dd>
			</div>

			<div>
				<dt>Source address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									sourceAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.sourceAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Validator public key</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									validatorPubkey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.validatorPubkey} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Amount</dt>
				<dd>
					<ResourceBoundary
						resource={beaconExecutionWithdrawalRequest}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.amountGwei}
							/>

							<span> Gwei</span>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
