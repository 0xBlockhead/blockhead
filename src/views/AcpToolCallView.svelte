<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.AcpToolCall> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.AcpLocal_JsonRpc,
		],
	}))
	const acpToolCall = $derived(viewSelection({
		fields: {
			toolName: true,
			serverName: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.toolCallId ?? '') || 'ACP tool call')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AcpToolCall_TimestampsView from '$/views/AcpToolCall_TimestampsView.svelte'
	import AcpPromptTurnView from '$/views/AcpPromptTurnView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpToolCall}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.toolCallId ?? '') || 'ACP tool call'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpToolCall}>
			{#snippet children(entity)}
				{(entity.toolName ?? '') || pendingEntity.toolCallId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpToolCall}>
			{#snippet children(entity)}
				{@const serverName0 = entity.serverName}
				{#if serverName0 != null}
					<span data-text="muted">
						{serverName0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>prompt turn</dt>
				<dd>
					<AcpPromptTurnView
						selection={select(EntityType.AcpPromptTurn, selection.entitySelector.$promptTurn)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>tool call ID</dt>
				<dd>
					{pendingEntity.toolCallId}
				</dd>
			</div>

			<ResourceBoundary
				resource={acpToolCall}
			>
				{#snippet children(entity)}
					{@const toolName = entity.toolName}
					{#if toolName != null}
						<div>
							<dt>tool name</dt>
							<dd>
								{toolName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={acpToolCall}
			>
				{#snippet children(entity)}
					{@const serverName = entity.serverName}
					{#if serverName != null}
						<div>
							<dt>server name</dt>
							<dd>
								{serverName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							startedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const startedAt = entity.startedAt}
					{#if startedAt != null}
						<div>
							<dt>started AT</dt>
							<dd>
								<Timestamp timestamp={Number(startedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const completedAt = entity.completedAt}
					{#if completedAt != null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							inputHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const inputHashAlgorithm = entity.inputHashAlgorithm}
					{#if inputHashAlgorithm != null}
						<div>
							<dt>input hash algorithm</dt>
							<dd>
								<TruncatedValue value={inputHashAlgorithm} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							inputHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const inputHash = entity.inputHash}
					{#if inputHash != null}
						<div>
							<dt>input hash</dt>
							<dd>
								<TruncatedValue value={String(inputHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							outputHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const outputHashAlgorithm = entity.outputHashAlgorithm}
					{#if outputHashAlgorithm != null}
						<div>
							<dt>output hash algorithm</dt>
							<dd>
								<TruncatedValue value={outputHashAlgorithm} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							outputHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const outputHash = entity.outputHash}
					{#if outputHash != null}
						<div>
							<dt>output hash</dt>
							<dd>
								<TruncatedValue value={String(outputHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const acpToolCallAcpToolCallTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={acpToolCallAcpToolCallTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AcpToolCall_TimestampsView
						selection={acpToolCallAcpToolCallTimestampsViewTimestampsResource}
						countResource={acpToolCallAcpToolCallTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
