<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: EntitySelectionViewProps<EntityType.AptosStateChange> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const aptosStateChange = $derived(selection({
		fields: {
			changeKind: true,
		},
	}))
	const titleFallback = $derived((prefetched.changeKind ?? '') || 'aptos state change')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosTransactionView from '$/views/AptosTransactionView.svelte'
	import AptosAccountResourceView from '$/views/AptosAccountResourceView.svelte'
	import MoveModuleView from '$/views/MoveModuleView.svelte'
	import AptosTableItemView from '$/views/AptosTableItemView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosStateChange}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'version' in transaction ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/version/[version=nonNegativeBigInt]/(aptosTransaction)/state-change/[changeIndex=nonNegativeInteger]',
						{
							network: (
								'caip2' in transaction.$network.$network ?
									caip2StringFromValue(transaction.$network.$network.caip2)
								:
									transaction.$network.$network.slug
							),
							version: String(transaction.version),
							changeIndex: String(selection.entitySelector.changeIndex),
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
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
			value={selection.entitySelector.changeIndex}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<AptosTransactionView
				selection={select(EntityType.AptosTransaction, selection.entitySelector.$transaction)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<AptosTransactionView
						selection={select(EntityType.AptosTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>change index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.changeIndex}
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
						{@const aptosAccountResourceInitial = untrack(() => aptosAccountResource)}
						<div>
							<dt>resource</dt>
							<dd>
								<AptosAccountResourceView
									selection={select(EntityType.AptosAccountResource, (aptosAccountResource ?? aptosAccountResourceInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const moveModuleInitial = untrack(() => moveModule)}
						<div>
							<dt>module</dt>
							<dd>
								<MoveModuleView
									selection={select(EntityType.MoveModule, (moveModule ?? moveModuleInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$tableItem}
			>
				{#snippet children(aptosTableItem)}
					{#if aptosTableItem != null}
						{@const aptosTableItemInitial = untrack(() => aptosTableItem)}
						<div>
							<dt>table item</dt>
							<dd>
								<AptosTableItemView
									selection={select(EntityType.AptosTableItem, (aptosTableItem ?? aptosTableItemInitial)[EntityMetaKey.Selector])}
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
