<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaContractAction>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaContractResultView from '$/views/HederaContractResultView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaContractAction}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			(
				'consensusTimestamp' in selection.entitySelector.$result.$transaction ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/contract-result/(hederaContractResult)/action/[callDepth=nonNegativeInteger]/[callIndex=nonNegativeInteger]',
						{
							network: (
								'caip2' in selection.entitySelector.$result.$transaction.$network ?
									caip2StringFromValue(selection.entitySelector.$result.$transaction.$network.caip2)
								:
									selection.entitySelector.$result.$transaction.$network.slug
							),
							consensusTimestamp: selection.entitySelector.$result.$transaction.consensusTimestamp,
							callDepth: String(selection.entitySelector.callDepth),
							callIndex: String(selection.entitySelector.callIndex),
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>result</dt>
				<dd>
					<HederaContractResultView
						selection={select(EntityType.HederaContractResult, selection.entitySelector.$result)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>call depth</dt>
				<dd>
					{selection.entitySelector.callDepth}
				</dd>
			</div>

			<div>
				<dt>call index</dt>
				<dd>
					{selection.entitySelector.callIndex}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							callType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const callType = entity.callType}
					{#if callType != null}
						<div>
							<dt>call type</dt>
							<dd>
								{callType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fromAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fromAddress = entity.fromAddress}
					{#if fromAddress != null}
						<div>
							<dt>from address</dt>
							<dd>
								<TruncatedValue value={fromAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							toAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toAddress = entity.toAddress}
					{#if toAddress != null}
						<div>
							<dt>to address</dt>
							<dd>
								<TruncatedValue value={toAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gas: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gas = entity.gas}
					{#if gas != null}
						<div>
							<dt>gas</dt>
							<dd>
								{gas}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
						<div>
							<dt>gas used</dt>
							<dd>
								{gasUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const valueTinybar = entity.valueTinybar}
					{#if valueTinybar != null}
						<div>
							<dt>value tinybar</dt>
							<dd>
								{valueTinybar}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							input: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const input = entity.input}
					{#if input != null}
						<div>
							<dt>input</dt>
							<dd>
								{input}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							output: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const output = entity.output}
					{#if output != null}
						<div>
							<dt>output</dt>
							<dd>
								{output}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
