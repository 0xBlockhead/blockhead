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
	}: EntitySelectionViewProps<EntityType.HederaAllowance> = $props()

	const hederaAllowance = $derived(selection({
		fields: {
			serialNumber: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HederaAllowance_TimestampsView from '$/views/HederaAllowance_TimestampsView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
	import HederaTokenView from '$/views/HederaTokenView.svelte'
	import HederaNftView from '$/views/HederaNftView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaAllowance}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.allowanceKind || 'hedera allowance')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.allowanceKind || 'hedera allowance'}
	{/snippet}

	{#snippet Value()}
		<HederaAccountView
			selection={select(EntityType.HederaAccount, selection.entitySelector.$spender)}
			href={null}
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={hederaAllowance}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={selection.$token}
				>
					{#snippet children(hederaToken)}
						{#if hederaToken != null}
							<span data-text="muted">
								<HederaTokenView
									selection={select(EntityType.HederaToken, hederaToken[EntityMetaKey.Selector])}
									prefetched={hederaToken}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const serialNumber = entity.serialNumber}
				{#if serialNumber != null}
					<span data-text="muted">
						<NumberValue
							value={serialNumber}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>owner</dt>
				<dd>
					<HederaAccountView
						selection={select(EntityType.HederaAccount, selection.entitySelector.$owner)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>spender</dt>
				<dd>
					<HederaAccountView
						selection={select(EntityType.HederaAccount, selection.entitySelector.$spender)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>allowance kind</dt>
				<dd>
					{selection.entitySelector.allowanceKind}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$token}
			>
				{#snippet children(hederaToken)}
					{#if hederaToken != null}
						<div>
							<dt>token</dt>
							<dd>
								<HederaTokenView
									selection={select(EntityType.HederaToken, hederaToken[EntityMetaKey.Selector])}
									prefetched={hederaToken}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={hederaAllowance}
			>
				{#snippet children(entity)}
					{@const serialNumber = entity.serialNumber}
					{#if serialNumber != null}
						<div>
							<dt>serial number</dt>
							<dd>
								<NumberValue
									value={serialNumber}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$nft}
			>
				{#snippet children(hederaNft)}
					{#if hederaNft != null}
						<div>
							<dt>NFT</dt>
							<dd>
								<HederaNftView
									selection={select(EntityType.HederaNft, hederaNft[EntityMetaKey.Selector])}
									prefetched={hederaNft}
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
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<HederaAllowance_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
