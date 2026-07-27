<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.NearAccount> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.NearRpc_JsonRpc,
			Source.NearBlocks_Rest,
		],
	}))
	const nearAccount = $derived(viewSelection({
		fields: {
			amountYoctoNear: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.accountId ?? '') || 'near account')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearAccessKeysView from '$/views/NearAccessKeysView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import NearContractView from '$/views/NearContractView.svelte'
</script>


<EntityView
	entityType={EntityType.NearAccount}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.accountId ?? '') || 'near account'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearAccount}>
			{#snippet children(entity)}
				{@const amountYoctoNear0 = entity.amountYoctoNear}
				{#if amountYoctoNear0 != null}
					<NumberValue
						value={amountYoctoNear0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Account ID</dt>
				<dd>
					<TruncatedValue value={pendingEntity.accountId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={nearAccount}
			>
				{#snippet children(entity)}
					{@const amountYoctoNear = entity.amountYoctoNear}
					{#if amountYoctoNear != null}
						<div>
							<dt>Amount yocto near</dt>
							<dd>
								<NumberValue
									value={amountYoctoNear}
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
							storageUsageBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const storageUsageBytes = entity.storageUsageBytes}
					{#if storageUsageBytes != null}
						<div>
							<dt>Storage usage bytes</dt>
							<dd>
								<NumberValue
									value={storageUsageBytes}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$contract}
			>
				{#snippet children(nearContract)}
					{#if nearContract != null}
						<div>
							<dt>Contract</dt>
							<dd>
								<NearContractView
									selection={select(EntityType.NearContract, nearContract[EntityMetaKey.Selector])}
									prefetched={nearContract}
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

	{#snippet Details({ open: detailsOpen })}
		{@const nearAccountNearAccessKeysViewAccessKeysResource = selection.$$accessKeys}
		<ResourceBoundary
			resource={nearAccountNearAccessKeysViewAccessKeysResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NearAccessKeysView
						selection={nearAccountNearAccessKeysViewAccessKeysResource}
						countResource={nearAccountNearAccessKeysViewAccessKeysResource.count}
						title='Access keys'
						id='access-keys'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
