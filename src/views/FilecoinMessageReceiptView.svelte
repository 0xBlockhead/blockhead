<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.FilecoinMessageReceipt>, 'prefetched'> = $props()

	const message = $derived(selection.entitySelector.$message)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Filfox_Rest,
		],
	}))
	const filecoinMessageReceipt = $derived(viewSelection({
		fields: {
			exitCode: true,
			gasUsed: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinMessageView from '$/views/FilecoinMessageView.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMessageReceipt}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.tipsetKey || 'filecoin message receipt')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/receipt/[tipsetKey=stringSegment]/[source=stringSegment]',
				{
					network: (
						'caip2' in message.$network ?
							caip2StringFromValue(message.$network.caip2)
						:
							message.$network.slug
					),
					cid: message.cid,
					tipsetKey: selection.entitySelector.tipsetKey,
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={filecoinMessageReceipt}>
			{#snippet children(entity)}
				{@const exitCode = entity.exitCode}
				{#if exitCode != null}
					<NumberValue
						value={exitCode}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinMessageReceipt}>
			{#snippet children(entity)}
				{@const gasUsed = entity.gasUsed}
				{#if gasUsed != null}
					<span data-text="muted">
						<NumberValue
							value={gasUsed}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Message</dt>
				<dd>
					<FilecoinMessageView
						selection={select(EntityType.FilecoinMessage, selection.entitySelector.$message)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Tipset key</dt>
				<dd>
					{selection.entitySelector.tipsetKey}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$tipset}
			>
				{#snippet children(filecoinTipset)}
					{#if filecoinTipset != null}
						{@const filecoinTipsetInitial = untrack(() => filecoinTipset)}
						<div>
							<dt>Tipset</dt>
							<dd>
								<FilecoinTipsetView
									selection={select(EntityType.FilecoinTipset, (filecoinTipset ?? filecoinTipsetInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							height: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const height = entity.height}
					{#if height != null}
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
					viewSelection({
						fields: {
							blockCid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockCid = entity.blockCid}
					{#if blockCid != null}
						<div>
							<dt>Block CID</dt>
							<dd>
								<TruncatedValue value={blockCid} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={filecoinMessageReceipt}
			>
				{#snippet children(entity)}
					{@const exitCode = entity.exitCode}
					{#if exitCode != null}
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
					viewSelection({
						fields: {
							returnData: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const returnData = entity.returnData}
					{#if returnData != null}
						<div>
							<dt>Return data</dt>
							<dd>
								{returnData}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={filecoinMessageReceipt}
			>
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
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
					viewSelection({
						fields: {
							replacedMessageCid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const replacedMessageCid = entity.replacedMessageCid}
					{#if replacedMessageCid != null}
						<div>
							<dt>Replaced message CID</dt>
							<dd>
								<TruncatedValue value={replacedMessageCid} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
