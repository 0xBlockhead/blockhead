<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EnsName_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EnsName_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const ensNameTimestamp = $derived(selection({
		sources: [
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			$resolvedActor: true,
			$resolverContract: true,
			$ownerActor: true,
			subdomainCount: true,
			ttl: true,
			isMigrated: true,
		},
	}))
	const titleFallback = $derived('ENS name observation')
	const viewDomId = $derived('ens-name-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<EnsNameView
				selection={select(EntityType.EnsName, selection.entitySelector.$name)}
				href={
						resolve('/(explore)/(ens)/ens/name/[ensName]', {
							ensName: String(selection.entitySelector.$name.name),
						})
					}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={ensNameTimestamp}>
				{#snippet Pending()}
					<EnsNameView
						selection={select(EntityType.EnsName, selection.entitySelector.$name)}
						href={
							resolve('/(explore)/(ens)/ens/name/[ensName]', {
								ensName: String(selection.entitySelector.$name.name),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<EnsNameView
						selection={select(EntityType.EnsName, selection.entitySelector.$name)}
						href={
							resolve('/(explore)/(ens)/ens/name/[ensName]', {
								ensName: String(selection.entitySelector.$name.name),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={ensNameTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary resource={ensNameTimestamp}>
						{#snippet Pending()}
							{@const source = prefetched.source ?? selection.entitySelector.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const source = entity.source ?? selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$resolvedActor')}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>Resolved actor</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
									prefetched={evmAccount}
									href={
										resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount.entitySelector.address),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$resolverContract')}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Resolver contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract.entitySelector)}
									prefetched={evmContract}
									href={
										resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
											caip2: `${String(evmContract.entitySelector.$network.caip2.namespace)}:${String(evmContract.entitySelector.$network.caip2.reference)}`,
											address: String(evmContract.entitySelector.address),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$ownerActor')}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
									prefetched={evmAccount}
									href={
										resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount.entitySelector.address),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={ensNameTimestamp}>
				{#snippet Pending()}
					{@const subdomainCount = prefetched.subdomainCount ?? selection.entitySelector.subdomainCount}
					{#if subdomainCount !== undefined && subdomainCount !== null}
						<div>
							<dt>Subdomains</dt>
							<dd>
								<NumberValue value={Number(subdomainCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const subdomainCount = entity.subdomainCount ?? selection.entitySelector.subdomainCount ?? prefetched.subdomainCount}
					{#if subdomainCount !== undefined && subdomainCount !== null}
						<div>
							<dt>Subdomains</dt>
							<dd>
								<NumberValue value={Number(subdomainCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={ensNameTimestamp}>
				{#snippet Pending()}
					{@const ttl = prefetched.ttl ?? selection.entitySelector.ttl}
					{#if ttl !== undefined && ttl !== null}
						<div>
							<dt>TTL</dt>
							<dd>
								{String((ttl) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const ttl = entity.ttl ?? selection.entitySelector.ttl ?? prefetched.ttl}
					{#if ttl !== undefined && ttl !== null}
						<div>
							<dt>TTL</dt>
							<dd>
								{String((ttl) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={ensNameTimestamp}>
				{#snippet Pending()}
					{@const isMigrated = prefetched.isMigrated ?? selection.entitySelector.isMigrated}
					{#if isMigrated !== undefined && isMigrated !== null}
						<div>
							<dt>Migrated</dt>
							<dd>
								{String((isMigrated) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const isMigrated = entity.isMigrated ?? selection.entitySelector.isMigrated ?? prefetched.isMigrated}
					{#if isMigrated !== undefined && isMigrated !== null}
						<div>
							<dt>Migrated</dt>
							<dd>
								{String((isMigrated) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
