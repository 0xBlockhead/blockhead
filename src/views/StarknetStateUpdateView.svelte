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
	}: Omit<EntitySelectionViewProps<EntityType.StarknetStateUpdate>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StarknetNetworkView from '$/views/StarknetNetworkView.svelte'
	import StarknetBlockView from '$/views/StarknetBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetStateUpdate}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.blockHash || 'Starknet state update')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(starknet)/state-update/[blockHash=stringSegment]/[source=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					blockHash: selection.entitySelector.blockHash,
					source: selection.entitySelector.source,
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
		<TruncatedValue value={selection.entitySelector.blockHash} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$block}
		>
			{#snippet children(starknetBlock)}
				{@const starknetBlockInitial = untrack(() => starknetBlock)}
				<StarknetBlockView
					selection={select(EntityType.StarknetBlock, (starknetBlock ?? starknetBlockInitial)[EntityMetaKey.Selector])}
					prefetched={starknetBlock ?? starknetBlockInitial}
					href={null}
					layout={EntityLayout.Value}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<StarknetNetworkView
						selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Block</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$block}
					>
						{#snippet children(starknetBlock)}
							{@const starknetBlockInitial = untrack(() => starknetBlock)}
							<StarknetBlockView
								selection={select(EntityType.StarknetBlock, (starknetBlock ?? starknetBlockInitial)[EntityMetaKey.Selector])}
								prefetched={starknetBlock ?? starknetBlockInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Old state root</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									oldRoot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.oldRoot}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>New state root</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									newRoot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.newRoot}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Deprecated declared class hashes</dt>
				<dd>
					<ResourceBoundary
						resource={selection.deprecatedDeclaredClassHashes}
					>
						{#snippet children(deprecatedDeclaredClassHashes)}
							{deprecatedDeclaredClassHashes.values.join(', ')}
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
							storageDiffs: true,
							declaredClasses: true,
							deployedContracts: true,
							replacedClasses: true,
							nonces: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					<div>
						<dt>State diff</dt>
						<dd><pre>{JSON.stringify({
							storageDiffs: entity.storageDiffs.values,
							declaredClasses: entity.declaredClasses.values,
							deployedContracts: entity.deployedContracts.values,
							replacedClasses: entity.replacedClasses.values,
							nonces: entity.nonces.values,
						}, null, 2)}</pre></dd>
					</div>
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
