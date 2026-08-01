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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HederaContract_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaContractView from '$/views/HederaContractView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaContract_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>contract</dt>
				<dd>
					<HederaContractView
						selection={select(EntityType.HederaContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
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
					selection({
						fields: {
							accountId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const accountId = entity.accountId}
					{#if accountId != null}
						<div>
							<dt>account ID</dt>
							<dd>
								<TruncatedValue value={accountId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							runtimeBytecodeHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const runtimeBytecodeHash = entity.runtimeBytecodeHash}
					{#if runtimeBytecodeHash != null}
						<div>
							<dt>runtime bytecode hash</dt>
							<dd>
								<TruncatedValue value={runtimeBytecodeHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
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
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fileId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fileId = entity.fileId}
					{#if fileId != null}
						<div>
							<dt>file ID</dt>
							<dd>
								{fileId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							memo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const memo = entity.memo}
					{#if memo != null}
						<div>
							<dt>memo</dt>
							<dd>
								{memo}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							obtainerId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const obtainerId = entity.obtainerId}
					{#if obtainerId != null}
						<div>
							<dt>obtainer ID</dt>
							<dd>
								{obtainerId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expirationTimestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expirationTimestamp = entity.expirationTimestamp}
					{#if expirationTimestamp != null}
						<div>
							<dt>expiration timestamp</dt>
							<dd>
								{expirationTimestamp}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							autoRenewPeriodSeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const autoRenewPeriodSeconds = entity.autoRenewPeriodSeconds}
					{#if autoRenewPeriodSeconds != null}
						<div>
							<dt>auto renew period seconds</dt>
							<dd>
								{autoRenewPeriodSeconds}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
