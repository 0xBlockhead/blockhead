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
	title={title ?? (selection.entitySelector.accountId || 'near account')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={nearAccount}>
			{#snippet children(entity)}
				{@const amountYoctoNear = entity.amountYoctoNear}
				{#if amountYoctoNear != null}
					<NumberValue
						value={amountYoctoNear}
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
					/>
				</dd>
			</div>

			<div>
				<dt>Account ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.accountId} />
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
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const accessKeysResource = selection.$$accessKeys}
		<ResourceBoundary
			resource={accessKeysResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NearAccessKeysView
						selection={accessKeysResource}
						countResource={accessKeysResource.count}
						title='Access keys'
						id='access-keys'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
