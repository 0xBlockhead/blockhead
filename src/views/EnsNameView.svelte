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
			selection: EntityProxyResource<typeof schema, EntityType.EnsName>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EnsName>>
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

	const ensName = $derived(selection({
		sources: [
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			normalizedName: true,
			node: true,
			labelName: true,
			labelhash: true,
			$parent: true,
			...(open && {
				$resolverContract: true,
				$subgraphResolvedActor: true,
				$ownerActor: true,
				$$subdomains: true,
				$$records: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || 'ENS name')
	const viewDomId = $derived('ens-name-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EnsNamesView from '$/views/EnsNamesView.svelte'
	import EnsRecordsView from '$/views/EnsRecordsView.svelte'
	import EnsName_TimestampsView from '$/views/EnsName_TimestampsView.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(ens)/ens/name/[ensName]', {
			ensName: String(({ ...selection.entitySelector, ...prefetched }).name),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'ENS name'}
		{:else}
			<ResourceBoundary resource={ensName}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'ENS name'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'ENS name'}
		{:else}
			<ResourceBoundary resource={ensName}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'ENS name'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? '')].filter(Boolean).join(' ') || [String((entity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={ensName}>
				{#snippet Pending()}
					{@const normalizedName = prefetched.normalizedName ?? selection.entitySelector.normalizedName}
					{#if normalizedName !== undefined && normalizedName !== null}
						<div>
							<dt>Normalized name</dt>
							<dd>
								{String((normalizedName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const normalizedName = entity.normalizedName ?? selection.entitySelector.normalizedName ?? prefetched.normalizedName}
					{#if normalizedName !== undefined && normalizedName !== null}
						<div>
							<dt>Normalized name</dt>
							<dd>
								{String((normalizedName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={ensName}>
				{#snippet Pending()}
					{@const node = prefetched.node ?? selection.entitySelector.node}
					{#if node !== undefined && node !== null}
						<div>
							<dt>Node</dt>
							<dd>
								{String((node) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const node = entity.node ?? selection.entitySelector.node ?? prefetched.node}
					{#if node !== undefined && node !== null}
						<div>
							<dt>Node</dt>
							<dd>
								{String((node) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={ensName}>
				{#snippet Pending()}
					{@const labelName = prefetched.labelName ?? selection.entitySelector.labelName}
					{#if labelName !== undefined && labelName !== null}
						<div>
							<dt>Label name</dt>
							<dd>
								{String((labelName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const labelName = entity.labelName ?? selection.entitySelector.labelName ?? prefetched.labelName}
					{#if labelName !== undefined && labelName !== null}
						<div>
							<dt>Label name</dt>
							<dd>
								{String((labelName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={ensName}>
				{#snippet Pending()}
					{@const labelhash = prefetched.labelhash ?? selection.entitySelector.labelhash}
					{#if labelhash !== undefined && labelhash !== null}
						<div>
							<dt>Label hash</dt>
							<dd>
								{String((labelhash) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const labelhash = entity.labelhash ?? selection.entitySelector.labelhash ?? prefetched.labelhash}
					{#if labelhash !== undefined && labelhash !== null}
						<div>
							<dt>Label hash</dt>
							<dd>
								{String((labelhash) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EnsName, false>('$parent')}
			>
				{#snippet children(ensName)}
					{#if ensName != null}
						<div>
							<dt>Parent</dt>
							<dd>
								<EnsNameView
									selection={select(EntityType.EnsName, ensName.entitySelector)}
									prefetched={ensName}
									href={
										resolve('/(explore)/(ens)/ens/name/[ensName]', {
											ensName: String(ensName.entitySelector.name),
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

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$subgraphResolvedActor')}
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
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EnsNamesView
				selection={selection[EntityProxyField]<EntityType.EnsName>('$$subdomains')}
				title='Subdomains'
				emptyText='No subdomains for this ENS name yet.'
				id='EnsNamesView-$$subdomains'
			/>

			<EnsRecordsView
				selection={selection[EntityProxyField]<EntityType.EnsRecord>('$$records')}
				title='Records'
				emptyText='No ENS records for this name yet.'
				id='EnsRecordsView-$$records'
			/>

			<EnsName_TimestampsView
				selection={selection[EntityProxyField]<EntityType.EnsName_Timestamp>('$$timestamps')}
				title='Observations'
				emptyText='No ENS name observations yet.'
				id='EnsName_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
