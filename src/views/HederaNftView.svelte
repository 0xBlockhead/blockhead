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
	}: Omit<EntitySelectionViewProps<EntityType.HederaNft>, 'prefetched'> = $props()

	const hederaNft = $derived(selection({
		fields: {
			createdTimestamp: true,
		},
	}))


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HederaTokenView from '$/views/HederaTokenView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNft}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.serialNumber)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.serialNumber}
		/>
	{/snippet}

	{#snippet Value()}
		<HederaTokenView
			selection={select(EntityType.HederaToken, selection.entitySelector.$token)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={hederaNft}>
			{#snippet children(entity)}
				{@const createdTimestamp = entity.createdTimestamp}
				{#if createdTimestamp != null}
					<span data-text="muted">
						{createdTimestamp}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>token</dt>
				<dd>
					<HederaTokenView
						selection={select(EntityType.HederaToken, selection.entitySelector.$token)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>serial number</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.serialNumber}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							metadata: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metadata = entity.metadata}
					{#if metadata != null}
						<div>
							<dt>metadata</dt>
							<dd>
								{metadata}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={hederaNft}
			>
				{#snippet children(entity)}
					{@const createdTimestamp = entity.createdTimestamp}
					{#if createdTimestamp != null}
						<div>
							<dt>created timestamp</dt>
							<dd>
								{createdTimestamp}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const transfersResource = selection.$$transfers}
		<ResourceBoundary
			resource={transfersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EntitiesList
						entityType={EntityType.HederaTokenTransfer}
						countResource={transfersResource.count}
						title='Transfers'
						open={true}
						id='transfers'
						resource={transfersResource()}
					>
						{#snippet Item({ item: hederaTokenTransfer })}
							<EntityView
								entityType={EntityType.HederaTokenTransfer}
								entitySelector={hederaTokenTransfer[EntityMetaKey.Selector]}
							/>
						{/snippet}
					</EntitiesList>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EntitiesList
						entityType={EntityType.HederaNft_Timestamp}
						countResource={timestampsResource.count}
						title='Observations'
						open={true}
						id='timestamps'
						resource={timestampsResource()}
					>
						{#snippet Item({ item: hederaNftTimestamp })}
							<EntityView
								entityType={EntityType.HederaNft_Timestamp}
								entitySelector={hederaNftTimestamp[EntityMetaKey.Selector]}
							/>
						{/snippet}
					</EntitiesList>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
