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
	}: EntitySelectionViewProps<EntityType.HederaHbarTransfer> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaTransactionView from '$/views/HederaTransactionView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaHbarTransfer}
	entitySelector={selection.entitySelector}
	title={title ?? 'hedera HBAR transfer'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<HederaTransactionView
						selection={select(EntityType.HederaTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>account ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.accountId} />
				</dd>
			</div>

			<div>
				<dt>transfer index</dt>
				<dd>
					{selection.entitySelector.transferIndex}
				</dd>
			</div>

			<div>
				<dt>amount tinybar</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									amountTinybar: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.amountTinybar}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isApproval: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isApproval = entity.isApproval}
					{#if isApproval != null}
						<div>
							<dt>is approval</dt>
							<dd>
								{isApproval ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(hederaAccount)}
					{#if hederaAccount != null}
						<div>
							<dt>account</dt>
							<dd>
								<HederaAccountView
									selection={select(EntityType.HederaAccount, hederaAccount[EntityMetaKey.Selector])}
									prefetched={hederaAccount}
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
