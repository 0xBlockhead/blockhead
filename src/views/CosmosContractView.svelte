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
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CosmosContract>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const cosmosContract = $derived(selection({
		fields: {
			codeId: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosContract}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.address || 'Cosmos contract')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					address: selection.entitySelector.address,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.address} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.address} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosContract}>
			{#snippet children(entity)}
				{@const codeId = entity.codeId}
				{#if codeId != null}
					<span data-text="muted">
						{codeId}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
				</dd>
			</div>

			<ResourceBoundary
				resource={cosmosContract}
			>
				{#snippet children(entity)}
					{@const codeId = entity.codeId}
					{#if codeId != null}
						<div>
							<dt>Code ID</dt>
							<dd>
								{codeId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$creator}
			>
				{#snippet children(cosmosAccount)}
					{#if cosmosAccount != null}
						{@const cosmosAccountInitial = untrack(() => cosmosAccount)}
						<div>
							<dt>Creator</dt>
							<dd>
								<CosmosAccountView
									selection={select(EntityType.CosmosAccount, (cosmosAccount ?? cosmosAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$admin}
			>
				{#snippet children(cosmosAccount)}
					{#if cosmosAccount != null}
						{@const cosmosAccountInitial = untrack(() => cosmosAccount)}
						<div>
							<dt>Admin</dt>
							<dd>
								<CosmosAccountView
									selection={select(EntityType.CosmosAccount, (cosmosAccount ?? cosmosAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
