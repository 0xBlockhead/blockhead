<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.CashuMint_Timestamp> = $props()

	const cashuMintTimestamp = $derived(selection({
		fields: {
			name: true,
			version: true,
			reachable: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
</script>


<EntityView
	entityType={EntityType.CashuMint_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cashuMintTimestamp}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), (entity.version ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cashuMintTimestamp}>
			{#snippet children(entity)}
				{@const reachable = entity.reachable}
				{#if reachable != null}
					<span data-text="muted">
						{reachable ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>mint</dt>
				<dd>
					<CashuMintView
						selection={select(EntityType.CashuMint, selection.entitySelector.$mint)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={cashuMintTimestamp}
			>
				{#snippet children(entity)}
					{@const reachable = entity.reachable}
					{#if reachable != null}
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
				resource={cashuMintTimestamp}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cashuMintTimestamp}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>version</dt>
							<dd>
								{version}
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
				{#snippet children(entity)}
					{@const serverTimeMs = entity.serverTimeMs}
					{#if serverTimeMs != null}
						<div>
							<dt>server time ms</dt>
							<dd>
								<Timestamp timestamp={serverTimeMs} />
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
				{#snippet children(entity)}
					{@const pubkey = entity.pubkey}
					{#if pubkey != null}
						<div>
							<dt>public key</dt>
							<dd>
								<TruncatedValue value={pubkey} />
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
				{#snippet children(entity)}
					{@const description = entity.description}
					{#if description != null}
						<div>
							<dt>Description</dt>
							<dd>
								{description}
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
				{#snippet children(entity)}
					{@const descriptionLong = entity.descriptionLong}
					{#if descriptionLong != null}
						<div>
							<dt>description long</dt>
							<dd>
								{descriptionLong}
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
				{#snippet children(entity)}
					{@const motd = entity.motd}
					{#if motd != null}
						<div>
							<dt>motd</dt>
							<dd>
								{motd}
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
				{#snippet children(entity)}
					{@const iconUrl = entity.iconUrl}
					{#if iconUrl != null}
						<div>
							<dt>icon URL</dt>
							<dd>
								<a
									href={iconUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={iconUrl} />
								</a>
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
				{#snippet children(entity)}
					{@const tosUrl = entity.tosUrl}
					{#if tosUrl != null}
						<div>
							<dt>tos URL</dt>
							<dd>
								<a
									href={tosUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={tosUrl} />
								</a>
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
				{#snippet children(entity)}
					{@const contactJson = entity.contactJson}
					{#if contactJson != null}
						<div>
							<dt>contact JSON</dt>
							<dd>
								{contactJson}
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
				{#snippet children(entity)}
					{@const nutsJson = entity.nutsJson}
					{#if nutsJson != null}
						<div>
							<dt>nuts JSON</dt>
							<dd>
								{nutsJson}
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
				{#snippet children(entity)}
					{@const mintMethodsJson = entity.mintMethodsJson}
					{#if mintMethodsJson != null}
						<div>
							<dt>mint methods JSON</dt>
							<dd>
								{mintMethodsJson}
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
				{#snippet children(entity)}
					{@const meltMethodsJson = entity.meltMethodsJson}
					{#if meltMethodsJson != null}
						<div>
							<dt>melt methods JSON</dt>
							<dd>
								{meltMethodsJson}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
