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
	}: EntitySelectionViewProps<EntityType.NearContractStorageEntry> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.NearRpc_JsonRpc,
		],
	}))
	const nearContractStorageEntry = $derived(viewSelection({
		fields: {
			valueHash: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearContractView from '$/views/NearContractView.svelte'
</script>


<EntityView
	entityType={EntityType.NearContractStorageEntry}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.keyBase64 || 'near contract storage entry')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.keyBase64} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearContractStorageEntry}>
			{#snippet children(entity)}
				{@const valueHash = entity.valueHash}
				{#if valueHash != null}
					<TruncatedValue value={valueHash} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NumberValue
				value={selection.entitySelector.blockHeight}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Contract</dt>
				<dd>
					<NearContractView
						selection={select(EntityType.NearContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Key base64</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.keyBase64} />
				</dd>
			</div>

			<div>
				<dt>Block height</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.blockHeight}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							blockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHash = entity.blockHash}
					{#if blockHash != null}
						<div>
							<dt>Block hash</dt>
							<dd>
								<TruncatedValue value={blockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							valueBase64: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const valueBase64 = entity.valueBase64}
					{#if valueBase64 != null}
						<div>
							<dt>Value base64</dt>
							<dd>
								<span data-text="long-text">{valueBase64}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={nearContractStorageEntry}
			>
				{#snippet children(entity)}
					{@const valueHash = entity.valueHash}
					{#if valueHash != null}
						<div>
							<dt>Value hash</dt>
							<dd>
								<TruncatedValue value={valueHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							prefixBase64: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const prefixBase64 = entity.prefixBase64}
					{#if prefixBase64 != null}
						<div>
							<dt>Prefix base64</dt>
							<dd>
								<TruncatedValue value={prefixBase64} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deleted = entity.deleted}
					{#if deleted != null}
						<div>
							<dt>Deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
