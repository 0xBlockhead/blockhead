<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.CashuMint>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CashuMint>>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const cashuMint = $derived(selection({
		sources: [
			Source.CashuMint_Rest,
		],
		fields: {
			name: true,
			version: true,
			description: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.mintUrl) ?? '')].filter(Boolean).join(' ') || 'Cashu mint')
	const viewDomId = $derived('cashu-mint-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CashuKeysetsView from '$/views/CashuKeysetsView.svelte'
</script>


<EntityView
	entityType={EntityType.CashuMint}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cashuMint}>
			{#snippet Pending()}
				{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.mintUrl) ?? '')].filter(Boolean).join(' ') || 'Cashu mint'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cashuMint}>
			{#snippet Pending()}
				{[String((pendingEntity.version) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.mintUrl) ?? '')].filter(Boolean).join(' ') || 'Cashu mint'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.version) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>mint URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									mintUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const mintUrl = pendingEntity.mintUrl}
							{#if mintUrl !== undefined && mintUrl !== null}
								<svelte:element
									this={'a'}
									href={String(mintUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(mintUrl)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const mintUrl = resolvedEntity.mintUrl}
							{#if mintUrl !== undefined && mintUrl !== null}
								<svelte:element
									this={'a'}
									href={String(mintUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(mintUrl)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = pendingEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const version = pendingEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							pubkey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pubkey = pendingEntity.pubkey}
					{#if pubkey !== undefined && pubkey !== null}
						<div>
							<dt>public key</dt>
							<dd>
								<TruncatedValue value={String((pubkey) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pubkey = resolvedEntity.pubkey}
					{#if pubkey !== undefined && pubkey !== null}
						<div>
							<dt>public key</dt>
							<dd>
								<TruncatedValue value={String((pubkey) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const description = pendingEntity.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const description = resolvedEntity.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							motd: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const motd = pendingEntity.motd}
					{#if motd !== undefined && motd !== null}
						<div>
							<dt>motd</dt>
							<dd>
								{String((motd) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const motd = resolvedEntity.motd}
					{#if motd !== undefined && motd !== null}
						<div>
							<dt>motd</dt>
							<dd>
								{String((motd) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							iconUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const iconUrl = pendingEntity.iconUrl}
					{#if iconUrl !== undefined && iconUrl !== null}
						<div>
							<dt>icon URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(iconUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(iconUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const iconUrl = resolvedEntity.iconUrl}
					{#if iconUrl !== undefined && iconUrl !== null}
						<div>
							<dt>icon URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(iconUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(iconUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							tosUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tosUrl = pendingEntity.tosUrl}
					{#if tosUrl !== undefined && tosUrl !== null}
						<div>
							<dt>tos URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(tosUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(tosUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tosUrl = resolvedEntity.tosUrl}
					{#if tosUrl !== undefined && tosUrl !== null}
						<div>
							<dt>tos URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(tosUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(tosUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							timeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timeMs = pendingEntity.timeMs}
					{#if timeMs !== undefined && timeMs !== null}
						<div>
							<dt>time ms</dt>
							<dd>
								<Timestamp timestamp={Number(timeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timeMs = resolvedEntity.timeMs}
					{#if timeMs !== undefined && timeMs !== null}
						<div>
							<dt>time ms</dt>
							<dd>
								<Timestamp timestamp={Number(timeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CashuKeysetsView
				selection={
						selection.$$keysets({
							sources: [
								Source.CashuMint_Rest,
							],
							count: true,
						})
					}
				title='keysets'
				emptyText='No keysets found.'
				id='CashuKeysetsView-keysets'
			/>
		{/if}
	{/snippet}
</EntityView>
