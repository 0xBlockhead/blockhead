<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.FilecoinMessageReceipt>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.FilecoinMessageReceipt>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const filecoinMessageReceipt = $derived(selection({
		sources: selection.sources,
		fields: {
			exitCode: true,
			gasUsed: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.tipsetKey) ?? '')].filter(Boolean).join(' ') || 'filecoin message receipt')
	const viewDomId = $derived('filecoin-message-receipt-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinMessageView from '$/views/FilecoinMessageView.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMessageReceipt}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.tipsetKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={filecoinMessageReceipt}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.tipsetKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const exitCode0 = pendingEntity.exitCode}
					{#if exitCode0 !== undefined && exitCode0 !== null}
						<NumberValue
							value={exitCode0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={filecoinMessageReceipt}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const exitCode0 = resolvedEntity.exitCode}
					{#if exitCode0 !== undefined && exitCode0 !== null}
						<NumberValue
							value={exitCode0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const gasUsed0 = pendingEntity.gasUsed}
			{#if gasUsed0 !== undefined && gasUsed0 !== null}
				<span data-text="muted">
					<NumberValue
						value={gasUsed0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={filecoinMessageReceipt}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasUsed0 = resolvedEntity.gasUsed}
					{#if gasUsed0 !== undefined && gasUsed0 !== null}
						<span data-text="muted">
							<NumberValue
								value={gasUsed0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Message</dt>
				<dd>
					<FilecoinMessageView
						selection={select(EntityType.FilecoinMessage, selection.entitySelector.$message, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Tipset key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									tipsetKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tipsetKey = resolvedEntity.tipsetKey}
							{#if tipsetKey !== undefined && tipsetKey !== null}
								{String((tipsetKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$tipset}
			>
				{#snippet children(filecoinTipset)}
					{#if filecoinTipset != null && filecoinTipset[EntityMetaKey.Selector] != null}
						<div>
							<dt>Tipset</dt>
							<dd>
								<FilecoinTipsetView
									selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
									prefetched={filecoinTipset}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							height: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const height = resolvedEntity.height}
					{#if height !== undefined && height !== null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue
									value={height}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							blockCid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockCid = resolvedEntity.blockCid}
					{#if blockCid !== undefined && blockCid !== null}
						<div>
							<dt>Block CID</dt>
							<dd>
								<TruncatedValue value={String((blockCid) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							exitCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const exitCode = resolvedEntity.exitCode}
					{#if exitCode !== undefined && exitCode !== null}
						<div>
							<dt>Exit code</dt>
							<dd>
								<NumberValue
									value={exitCode}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							returnData: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const returnData = resolvedEntity.returnData}
					{#if returnData !== undefined && returnData !== null}
						<div>
							<dt>Return data</dt>
							<dd>
								{String((returnData) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasUsed = resolvedEntity.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>Gas used</dt>
							<dd>
								<NumberValue
									value={gasUsed}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							replacedMessageCid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const replacedMessageCid = resolvedEntity.replacedMessageCid}
					{#if replacedMessageCid !== undefined && replacedMessageCid !== null}
						<div>
							<dt>Replaced message CID</dt>
							<dd>
								<TruncatedValue value={String((replacedMessageCid) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
