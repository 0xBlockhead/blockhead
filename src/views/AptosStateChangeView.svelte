<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.AptosStateChange> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const aptosStateChange = $derived(selection({
		fields: {
			changeKind: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.changeKind ?? '') || 'aptos state change')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosTransactionView from '$/views/AptosTransactionView.svelte'
	import AptosAccountResourceView from '$/views/AptosAccountResourceView.svelte'
	import MoveModuleView from '$/views/MoveModuleView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosStateChange}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aptosStateChange}>
			{#snippet children(entity)}
				{entity.changeKind || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={pendingEntity.changeIndex}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<AptosTransactionView
				selection={select(EntityType.AptosTransaction, selection.entitySelector.$transaction)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<AptosTransactionView
						selection={select(EntityType.AptosTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>change index</dt>
				<dd>
					<NumberValue
						value={pendingEntity.changeIndex}
					/>
				</dd>
			</div>

			<div>
				<dt>change kind</dt>
				<dd>
					<ResourceBoundary
						resource={aptosStateChange}
					>
						{#snippet children(entity)}
							{entity.changeKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							address: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const address = entity.address}
					{#if address != null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={address} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stateKeyHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stateKeyHash = entity.stateKeyHash}
					{#if stateKeyHash != null}
						<div>
							<dt>state key hash</dt>
							<dd>
								<TruncatedValue value={stateKeyHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resourceType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resourceType = entity.resourceType}
					{#if resourceType != null}
						<div>
							<dt>resource type</dt>
							<dd>
								{resourceType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$resource}
			>
				{#snippet children(aptosAccountResource)}
					{#if aptosAccountResource != null}
						<div>
							<dt>resource</dt>
							<dd>
								<AptosAccountResourceView
									selection={select(EntityType.AptosAccountResource, aptosAccountResource[EntityMetaKey.Selector])}
									prefetched={aptosAccountResource}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							moduleAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const moduleAddress = entity.moduleAddress}
					{#if moduleAddress != null}
						<div>
							<dt>module address</dt>
							<dd>
								<TruncatedValue value={moduleAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moduleName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const moduleName = entity.moduleName}
					{#if moduleName != null}
						<div>
							<dt>module name</dt>
							<dd>
								{moduleName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$module}
			>
				{#snippet children(moveModule)}
					{#if moveModule != null}
						<div>
							<dt>module</dt>
							<dd>
								<MoveModuleView
									selection={select(EntityType.MoveModule, moveModule[EntityMetaKey.Selector])}
									prefetched={moveModule}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
