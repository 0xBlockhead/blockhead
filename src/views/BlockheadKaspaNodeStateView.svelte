<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.BlockheadKaspaNodeState> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadKaspaNodeState = $derived(viewSelection({
		fields: {
			networkId: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadKaspaNodeState_TimestampsView from '$/views/BlockheadKaspaNodeState_TimestampsView.svelte'
	import KaspaNetworkView from '$/views/KaspaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadKaspaNodeState}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.connectionId || 'blockhead kaspa node state')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<KaspaNetworkView
			selection={select(EntityType.KaspaNetwork, selection.entitySelector.$network)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadKaspaNodeState}>
			{#snippet children(entity)}
				{@const networkId = entity.networkId}
				{#if networkId != null}
					<span data-text="muted">
						{networkId}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					{selection.entitySelector.connectionId}
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<KaspaNetworkView
						selection={select(EntityType.KaspaNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							rpcUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rpcUrl = entity.rpcUrl}
					{#if rpcUrl != null}
						<div>
							<dt>RPC URL</dt>
							<dd>
								<a
									href={rpcUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={rpcUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							encoding: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const encoding = entity.encoding}
					{#if encoding != null}
						<div>
							<dt>encoding</dt>
							<dd>
								{encoding}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadKaspaNodeState}
			>
				{#snippet children(entity)}
					{@const networkId = entity.networkId}
					{#if networkId != null}
						<div>
							<dt>network ID</dt>
							<dd>
								{networkId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadKaspaNodeState_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
