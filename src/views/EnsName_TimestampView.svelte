<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EnsName_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Voltaire_JsonRpc,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ENS name observation'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EnsNameView
			selection={select(EntityType.EnsName, selection.entitySelector.$name)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Name</dt>
				<dd>
					<EnsNameView
						selection={select(EntityType.EnsName, selection.entitySelector.$name)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$resolvedActor}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						{@const evmAccountInitial = untrack(() => evmAccount)}
						<div>
							<dt>Resolved actor</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
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
				resource={selection.$resolverContract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						{@const evmContractInitial = untrack(() => evmContract)}
						<div>
							<dt>Resolver contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
									prefetched={evmContract ?? evmContractInitial}
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
				resource={selection.$ownerActor}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						{@const evmAccountInitial = untrack(() => evmAccount)}
						<div>
							<dt>Owner</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
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
					viewSelection({
						fields: {
							subdomainCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const subdomainCount = entity.subdomainCount}
					{#if subdomainCount != null}
						<div>
							<dt>Subdomains</dt>
							<dd>
								<NumberValue
									value={subdomainCount}
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
					viewSelection({
						fields: {
							ttl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ttl = entity.ttl}
					{#if ttl != null}
						<div>
							<dt>TTL</dt>
							<dd>
								{ttl}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							isMigrated: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isMigrated = entity.isMigrated}
					{#if isMigrated != null}
						<div>
							<dt>Migrated</dt>
							<dd>
								{isMigrated ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
