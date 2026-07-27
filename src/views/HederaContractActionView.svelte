<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HederaContractAction> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'hedera contract action'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaContractResultView from '$/views/HederaContractResultView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaContractAction}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		hedera contract action
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>result</dt>
				<dd>
					<HederaContractResultView
						selection={select(EntityType.HederaContractResult, selection.entitySelector.$result)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>call depth</dt>
				<dd>
					{String(pendingEntity.callDepth)}
				</dd>
			</div>

			<div>
				<dt>call index</dt>
				<dd>
					{String(pendingEntity.callIndex)}
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
								<TruncatedValue value={String(fromAddress)} />
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
								<TruncatedValue value={String(toAddress)} />
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
								{String(gas)}
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
								{String(gasUsed)}
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
								{String(valueTinybar)}
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
