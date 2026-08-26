<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TronAccount_Timestamp>, 'prefetched'> = $props()


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TronAccountView from '$/views/TronAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.TronAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'tron account timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TronAccountView
			selection={select(EntityType.TronAccount, selection.entitySelector.$account)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={
				selection({
					fields: {
						balanceSun: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const balanceSun = entity.balanceSun}
				{#if balanceSun != null}
					<NumberValue
						value={balanceSun}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>

		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHeight = entity.blockHeight}
					{#if blockHeight != null}
						<div>
							<dt>Block height</dt>
							<dd>
								{blockHeight}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							createdTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdTimestampMs = entity.createdTimestampMs}
					{#if createdTimestampMs != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdTimestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestOperationTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestOperationTimestampMs = entity.latestOperationTimestampMs}
					{#if latestOperationTimestampMs != null}
						<div>
							<dt>Latest operation</dt>
							<dd>
								<Timestamp timestamp={latestOperationTimestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalTransactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalTransactionCount = entity.totalTransactionCount}
					{#if totalTransactionCount != null}
						<div>
							<dt>Total transactions</dt>
							<dd>
								{totalTransactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							freeNetUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const freeNetUsed = entity.freeNetUsed}
					{#if freeNetUsed != null}
						<div>
							<dt>Free net used</dt>
							<dd>
								{freeNetUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							freeNetLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const freeNetLimit = entity.freeNetLimit}
					{#if freeNetLimit != null}
						<div>
							<dt>Free net limit</dt>
							<dd>
								{freeNetLimit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							netUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const netUsed = entity.netUsed}
					{#if netUsed != null}
						<div>
							<dt>Net used</dt>
							<dd>
								{netUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							netLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const netLimit = entity.netLimit}
					{#if netLimit != null}
						<div>
							<dt>Net limit</dt>
							<dd>
								{netLimit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							energyUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const energyUsed = entity.energyUsed}
					{#if energyUsed != null}
						<div>
							<dt>Energy used</dt>
							<dd>
								{energyUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							energyLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const energyLimit = entity.energyLimit}
					{#if energyLimit != null}
						<div>
							<dt>Energy limit</dt>
							<dd>
								{energyLimit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tronPowerUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tronPowerUsed = entity.tronPowerUsed}
					{#if tronPowerUsed != null}
						<div>
							<dt>TRON power used</dt>
							<dd>
								{tronPowerUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tronPowerLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tronPowerLimit = entity.tronPowerLimit}
					{#if tronPowerLimit != null}
						<div>
							<dt>TRON power limit</dt>
							<dd>
								{tronPowerLimit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isContract: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isContract = entity.isContract}
					{#if isContract != null}
						<div>
							<dt>Contract</dt>
							<dd>
								{isContract ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
