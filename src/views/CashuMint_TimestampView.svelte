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
			selection: EntityProxyResource<typeof schema, EntityType.CashuMint_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CashuMint_Timestamp>>
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
	const cashuMintTimestamp = $derived(selection({
		fields: {
			name: true,
			version: true,
			reachable: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Cashu mint timestamp')
	const viewDomId = $derived('cashu-mint-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
</script>


<EntityView
	entityType={EntityType.CashuMint_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cashuMintTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cashuMintTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.name) ?? ''), String((prefetched.version) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'Cashu mint timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? ''), String((resolvedEntity.version) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cashuMintTimestamp}>
			{#snippet Pending()}
				{@const reachable0 = prefetched.reachable}
				{#if reachable0 !== undefined && reachable0 !== null}
					<span data-text="muted">
						{reachable0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const reachable0 = resolvedEntity.reachable}
				{#if reachable0 !== undefined && reachable0 !== null}
					<span data-text="muted">
						{reachable0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>mint</dt>
				<dd>
					<CashuMintView
						selection={select(EntityType.CashuMint, selection.entitySelector.$mint, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reachable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachable = resolvedEntity.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
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
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = prefetched.name}
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
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const version = prefetched.version}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							serverTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const serverTimeMs = prefetched.serverTimeMs}
					{#if serverTimeMs !== undefined && serverTimeMs !== null}
						<div>
							<dt>server time ms</dt>
							<dd>
								<Timestamp timestamp={Number(serverTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const serverTimeMs = resolvedEntity.serverTimeMs}
					{#if serverTimeMs !== undefined && serverTimeMs !== null}
						<div>
							<dt>server time ms</dt>
							<dd>
								<Timestamp timestamp={Number(serverTimeMs)} />
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
						fields: {
							pubkey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pubkey = prefetched.pubkey}
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
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const description = prefetched.description}
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
						fields: {
							descriptionLong: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const descriptionLong = prefetched.descriptionLong}
					{#if descriptionLong !== undefined && descriptionLong !== null}
						<div>
							<dt>description long</dt>
							<dd>
								{String((descriptionLong) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const descriptionLong = resolvedEntity.descriptionLong}
					{#if descriptionLong !== undefined && descriptionLong !== null}
						<div>
							<dt>description long</dt>
							<dd>
								{String((descriptionLong) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							motd: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const motd = prefetched.motd}
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
						fields: {
							iconUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const iconUrl = prefetched.iconUrl}
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
						fields: {
							tosUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tosUrl = prefetched.tosUrl}
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
						fields: {
							contactJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contactJson = prefetched.contactJson}
					{#if contactJson !== undefined && contactJson !== null}
						<div>
							<dt>contact JSON</dt>
							<dd>
								{String((contactJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contactJson = resolvedEntity.contactJson}
					{#if contactJson !== undefined && contactJson !== null}
						<div>
							<dt>contact JSON</dt>
							<dd>
								{String((contactJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nutsJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nutsJson = prefetched.nutsJson}
					{#if nutsJson !== undefined && nutsJson !== null}
						<div>
							<dt>nuts JSON</dt>
							<dd>
								{String((nutsJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nutsJson = resolvedEntity.nutsJson}
					{#if nutsJson !== undefined && nutsJson !== null}
						<div>
							<dt>nuts JSON</dt>
							<dd>
								{String((nutsJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mintMethodsJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mintMethodsJson = prefetched.mintMethodsJson}
					{#if mintMethodsJson !== undefined && mintMethodsJson !== null}
						<div>
							<dt>mint methods JSON</dt>
							<dd>
								{String((mintMethodsJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mintMethodsJson = resolvedEntity.mintMethodsJson}
					{#if mintMethodsJson !== undefined && mintMethodsJson !== null}
						<div>
							<dt>mint methods JSON</dt>
							<dd>
								{String((mintMethodsJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							meltMethodsJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const meltMethodsJson = prefetched.meltMethodsJson}
					{#if meltMethodsJson !== undefined && meltMethodsJson !== null}
						<div>
							<dt>melt methods JSON</dt>
							<dd>
								{String((meltMethodsJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const meltMethodsJson = resolvedEntity.meltMethodsJson}
					{#if meltMethodsJson !== undefined && meltMethodsJson !== null}
						<div>
							<dt>melt methods JSON</dt>
							<dd>
								{String((meltMethodsJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
