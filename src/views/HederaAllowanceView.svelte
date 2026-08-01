<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaAllowance>, 'prefetched'> = $props()

	const hederaAllowance = $derived(selection({
		fields: {
			serialNumber: true,
		},
	}))


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
	{#snippet Value()}
		<HederaAccountView
			selection={select(EntityType.HederaAccount, selection.entitySelector.$spender)}
			href={null}
			layout={EntityLayout.Value}
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
									layout={EntityLayout.Title}
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

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>owner</dt>
				<dd>
					<HederaAccountView
						selection={select(EntityType.HederaAccount, selection.entitySelector.$owner)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>spender</dt>
				<dd>
					<HederaAccountView
						selection={select(EntityType.HederaAccount, selection.entitySelector.$spender)}
						layout={EntityLayout.Value}
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
									layout={EntityLayout.Value}
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
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EntitiesList
						entityType={EntityType.HederaAllowance_Timestamp}
						countResource={timestampsResource.count}
						title='Observations'
						open={true}
						id='timestamps'
						resource={timestampsResource()}
					>
						{#snippet Item({ item: hederaAllowanceTimestamp })}
							<EntityView
								entityType={EntityType.HederaAllowance_Timestamp}
								entitySelector={hederaAllowanceTimestamp[EntityMetaKey.Selector]}
							/>
						{/snippet}
					</EntitiesList>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
