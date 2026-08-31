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
	}: Omit<EntitySelectionViewProps<EntityType.ZeroGKvEntry>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const titleFallback = $derived(selection.entitySelector.key || 'zero g kv entry')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import ZeroGStorageLogEntryView from '$/views/ZeroGStorageLogEntryView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGKvEntry}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/kv/[namespace=stringSegment]/[key=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					namespace: selection.entitySelector.namespace,
					key: selection.entitySelector.key,
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
		{selection.entitySelector.namespace || selection.entitySelector.key || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Namespace</dt>
				<dd>
					{selection.entitySelector.namespace}
				</dd>
			</div>

			<div>
				<dt>key</dt>
				<dd>
					{selection.entitySelector.key}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources ?? [
							Source.ZeroGStorageNode_JsonRpc,
							Source.ZeroGStorageScan_Rest,
						],
					})({
						fields: {
							valueHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const valueHash = entity.valueHash}
					{#if valueHash != null}
						<div>
							<dt>value hash</dt>
							<dd>
								<TruncatedValue value={valueHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$owner}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>owner</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$logEntry}
			>
				{#snippet children(zeroGStorageLogEntry)}
					{#if zeroGStorageLogEntry != null}
						<div>
							<dt>log entry</dt>
							<dd>
								<ZeroGStorageLogEntryView
									selection={select(EntityType.ZeroGStorageLogEntry, zeroGStorageLogEntry[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
