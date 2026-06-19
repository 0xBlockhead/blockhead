<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/~/multiplayer/contacts'),
		title,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSharedAddress>
			href?: string
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { select } from '$/routes/+layout.svelte'

	const sharedAddress = $derived(selection( { sources: [
				Source.Local_Internal,
			], fields: { peerId: true, sharedAt: true, ...(open ? ({ $account: true, $room: true, $network: true, targetPeerIds: true }) : ({  })) } }))


	// (Derived)
	const contactKey = $derived(
		stringify(selection.entitySelector),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSharedAddress}
	bind:open
	entitySelector={selection.entitySelector}
	href={href}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>{selection.entitySelector.id}</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			<strong>Contact routing</strong> ties a shared execution address to multiplayer sessions: rooms, optional chain-scoped accounts, and negotiated peer ids.
		</p>
		<p>
			Use it to see who should sign next when several people share the same address book entry.
		</p>
	{/snippet}

	{#snippet Content({})}
		<div data-column="gap-1">
			<ResourceBoundary
				resource={sharedAddress}
				placeholderText="Loading contact…"
			>
				{#snippet children(sharedAddress)}
					<dl data-column-item="center">
						<div>
							<dt>Shown as</dt>
							<dd data-text="mono">
								{selection.entitySelector.id}
							</dd>
						</div>

						{#if (
							sharedAddress.fields.peerId !== undefined
							&& sharedAddress.fields.peerId !== ''
						)}
							<div>
								<dt>Peer ID</dt>
								<dd>{sharedAddress.fields.peerId}</dd>
							</div>
						{/if}

						{#if sharedAddress.fields.sharedAt !== undefined}
							<div>
								<dt>Shared at</dt>
								<dd>
									<Timestamp
										timestamp={sharedAddress.fields.sharedAt}
									/>
								</dd>
							</div>
						{/if}

						{#if (
							open
							&& sharedAddress.fields.$account !== undefined
							&& sharedAddress.fields.$network !== undefined
						)}
							<div>
								<dt>Account</dt>
								<dd>
									<EvmNetworkAccountView
										selection={select(EntityType.EvmNetworkAccount, {
											$network: sharedAddress.fields.$network[EntityMetaKey.Selector],
											$actor: sharedAddress.fields.$account[EntityMetaKey.Selector],
										})}
										layout={EntityLayout.Title}

									/>
								</dd>
							</div>
						{/if}
						{#if (
							open
							&& sharedAddress.fields.$room !== undefined
							)}
								<div>
									<dt>Room</dt>
									<dd>{sharedAddress.fields.$room[EntityMetaKey.Selector].id}</dd>
								</div>
							{/if}
						{#if (
							open
							&& sharedAddress.fields.$network !== undefined
							)}
								<div>
									<dt>Execution chain ID</dt>
									<dd>{String(evmChainIdFromCaip2(`${sharedAddress.fields.$network[EntityMetaKey.Selector].caip2.namespace}:${sharedAddress.fields.$network[EntityMetaKey.Selector].caip2.reference}`))}</dd>
								</div>
							{/if}
						{#if (
							open
							&& (sharedAddress.fields.targetPeerIds ?? []).length
						)}
							<div>
								<dt>Target peer IDs</dt>
								<dd>{(sharedAddress.fields.targetPeerIds ?? []).join(', ')}</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			id={`${contactKey}:carousel-more`}
			sectionIdPrefix={contactKey}
			sections={[
				{ id: 'contact-overview', label: 'Fields' },
			]}
			data-card
		>
			{#snippet Summary({ open: _isOpen })}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>
						Session links
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionContactOverview({ id, label })}
				<ResourceBoundary
					resource={sharedAddress}
					placeholderText="Loading contact…"
				>
					{#snippet children(sharedAddress)}
						{#if (
							(sharedAddress.fields.peerId === undefined || sharedAddress.fields.peerId === '')
							&& !(sharedAddress.fields.$account !== undefined && sharedAddress.fields.$network !== undefined)
							&& sharedAddress.fields.$room === undefined
							&& sharedAddress.fields.$network === undefined
							&& !(sharedAddress.fields.targetPeerIds ?? []).length
							&& sharedAddress.fields.sharedAt === undefined
						)}
							<div data-row="wrap align-center gap-2">
								<p data-text="muted">
									No session details yet.
								</p>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Peer id, shared time, linked account, room, chain, and target peers appear when this contact row is populated from a session.
										</p>
									{/snippet}
									<abbr
										class="entity-heading-tip"
										aria-label="Contact fields"
									>ⓘ</abbr>
								</Tooltip>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
