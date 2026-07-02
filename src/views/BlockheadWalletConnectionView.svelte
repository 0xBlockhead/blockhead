<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletConnection>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadWalletConnection>>
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

	const blockheadWalletConnection = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			status: true,
			protocol: true,
			transportKind: true,
			selected: true,
			...(open && {
				connectedAt: true,
				disconnectedAt: true,
				sessionId: true,
				sessionTopic: true,
				error: true,
				$activeAccount: true,
				$$connectedAccounts: true,
			}),
		},
	}))
	const titleFallback = $derived('wallet connection')
	const viewDomId = $derived('blockhead-wallet-connection-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletConnection}
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
			{@const $wallet0 = ({ ...selection.entitySelector, ...prefetched }).$wallet}
			{#if $wallet0 !== undefined && $wallet0 !== null}
				{String(($wallet0) ?? '')}
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadWalletConnection}>
				{#snippet Pending()}
					{@const $wallet0 = ({ ...selection.entitySelector, ...prefetched }).$wallet}
					{#if $wallet0 !== undefined && $wallet0 !== null}
						{String(($wallet0) ?? '')}
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const $wallet0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).$wallet}
					{#if $wallet0 !== undefined && $wallet0 !== null}
						{String(($wallet0) ?? '')}
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).status) ?? '')].filter(Boolean).join(' ') || title || 'wallet connection'}
		{:else}
			<ResourceBoundary resource={blockheadWalletConnection}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).status) ?? '')].filter(Boolean).join(' ') || title || 'wallet connection'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.status) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary resource={blockheadWalletConnection}>
						{#snippet Pending()}
							{@const protocol = prefetched.protocol ?? selection.entitySelector.protocol}
							{#if protocol !== undefined && protocol !== null}
								{String((protocol) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const protocol = entity.protocol ?? selection.entitySelector.protocol ?? prefetched.protocol}
							{#if protocol !== undefined && protocol !== null}
								{String((protocol) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Transport</dt>
				<dd>
					<ResourceBoundary resource={blockheadWalletConnection}>
						{#snippet Pending()}
							{@const transportKind = prefetched.transportKind ?? selection.entitySelector.transportKind}
							{#if transportKind !== undefined && transportKind !== null}
								{String((transportKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const transportKind = entity.transportKind ?? selection.entitySelector.transportKind ?? prefetched.transportKind}
							{#if transportKind !== undefined && transportKind !== null}
								{String((transportKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Selected</dt>
				<dd>
					<ResourceBoundary resource={blockheadWalletConnection}>
						{#snippet Pending()}
							{@const selected = prefetched.selected ?? selection.entitySelector.selected}
							{#if selected !== undefined && selected !== null}
								{String((selected) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const selected = entity.selected ?? selection.entitySelector.selected ?? prefetched.selected}
							{#if selected !== undefined && selected !== null}
								{String((selected) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Connected</dt>
				<dd>
					<ResourceBoundary resource={blockheadWalletConnection}>
						{#snippet Pending()}
							{@const connectedAt = prefetched.connectedAt ?? selection.entitySelector.connectedAt}
							{#if connectedAt !== undefined && connectedAt !== null}
								<Timestamp timestamp={Number(connectedAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const connectedAt = entity.connectedAt ?? selection.entitySelector.connectedAt ?? prefetched.connectedAt}
							{#if connectedAt !== undefined && connectedAt !== null}
								<Timestamp timestamp={Number(connectedAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={blockheadWalletConnection}>
				{#snippet Pending()}
					{@const disconnectedAt = prefetched.disconnectedAt ?? selection.entitySelector.disconnectedAt}
					{#if disconnectedAt !== undefined && disconnectedAt !== null}
						<div>
							<dt>Disconnected</dt>
							<dd>
								<Timestamp timestamp={Number(disconnectedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const disconnectedAt = entity.disconnectedAt ?? selection.entitySelector.disconnectedAt ?? prefetched.disconnectedAt}
					{#if disconnectedAt !== undefined && disconnectedAt !== null}
						<div>
							<dt>Disconnected</dt>
							<dd>
								<Timestamp timestamp={Number(disconnectedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={blockheadWalletConnection}>
				{#snippet Pending()}
					{@const sessionId = prefetched.sessionId ?? selection.entitySelector.sessionId}
					{#if sessionId !== undefined && sessionId !== null}
						<div>
							<dt>Session ID</dt>
							<dd>
								{String((sessionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const sessionId = entity.sessionId ?? selection.entitySelector.sessionId ?? prefetched.sessionId}
					{#if sessionId !== undefined && sessionId !== null}
						<div>
							<dt>Session ID</dt>
							<dd>
								{String((sessionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={blockheadWalletConnection}>
				{#snippet Pending()}
					{@const sessionTopic = prefetched.sessionTopic ?? selection.entitySelector.sessionTopic}
					{#if sessionTopic !== undefined && sessionTopic !== null}
						<div>
							<dt>Session topic</dt>
							<dd>
								{String((sessionTopic) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const sessionTopic = entity.sessionTopic ?? selection.entitySelector.sessionTopic ?? prefetched.sessionTopic}
					{#if sessionTopic !== undefined && sessionTopic !== null}
						<div>
							<dt>Session topic</dt>
							<dd>
								{String((sessionTopic) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={blockheadWalletConnection}>
				{#snippet Pending()}
					{@const error = prefetched.error ?? selection.entitySelector.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const error = entity.error ?? selection.entitySelector.error ?? prefetched.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
