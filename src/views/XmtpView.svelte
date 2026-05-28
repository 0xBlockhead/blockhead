<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/xmtp',
			entityId,
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.XmtpNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const networkIdKey = stringify(entityId)

	const network = useEntity(
		EntityType.XmtpNetwork,
		entityId,
		{
			$: [Source.Constants_Internal],
			protocolName: {},
			homeUrl: {},
			docsUrl: {},
			registryLabel: {},
			topology: {},
		},
	)

	const registry = useEntity(
		EntityType._Global,
		{},
		{
			$: [Source.Local_Internal],
			$$actors: {},
			$$xmtpConversations: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActorsView from '$/views/ActorsView.svelte'
	import XmtpConversationsView from '$/views/XmtpConversationsView.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpNetwork}
	{entityId}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="XMTP"
>
	{#snippet Value()}
		{entityId.scope}

	{/snippet}

	{#snippet Title()}
		XMTP
	{/snippet}

	{#snippet Heading()}
		{@render Title()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			XMTP transports encrypted payloads between inbox identities; conversation rows here are local catalog stubs until a live XMTP client is wired.
		</p>
		<p>
			“Demo accounts” are generic EVM actors from the local catalog—not XMTP inbox IDs or installations.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={registry}
				placeholderText="Loading local inbox…"
			>
				{#snippet children(registry)}
					<div>
						<dt>Demo accounts</dt>
						<dd>{String(registry['$$actors'].length)}</dd>
					</div>
					<div>
						<dt>Conversations</dt>
						<dd>{String(registry['$$xmtpConversations'].length)}</dd>
					</div>
				{/snippet}
			</ResourceBoundary>
			{#if contentOpen}
				<ResourceBoundary
					resource={network}
					placeholderText="Loading XMTP network…"
				>
					{#snippet children(network)}
						<div>
							<dt>Protocol</dt>
							<dd>{network.protocolName}</dd>
						</div>
						<div>
							<dt>Registry</dt>
							<dd>{network.registryLabel}</dd>
						</div>
						<div>
							<dt>Topology</dt>
							<dd>{network.topology}</dd>
						</div>
						<div>
							<dt>Home</dt>
							<dd>
								<a href={network.homeUrl}>
									{network.homeUrl}
								</a>
							</dd>
						</div>
						{#if network.docsUrl != null && network.docsUrl !== ''}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={network.docsUrl}>
										{network.docsUrl}
									</a>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
				id={`${networkIdKey}:registry`}
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'demo-accounts', label: 'Demo accounts' },
					{ id: 'conversations', label: 'Conversations' },
				]}
				data-card
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Local inbox state
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionDemoAccounts({ id: _id, label: _label })}
					<ActorsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/~/accounts')}
						entityFieldReference={{
							entityType: EntityType._Global,
							entityId: {},
							fieldName: '$$actors',
						}}
						id="accounts"
						open={_open}
						title="Demo accounts"
					/>
				{/snippet}

				{#snippet SectionConversations({ id: _id, label: _label })}
					<XmtpConversationsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/xmtp')}
						entityFieldReference={{
							entityType: EntityType.XmtpNetwork,
							entityId,
							fieldName: '$$xmtpConversations',
						}}
						id="conversations"
						open={_open}
					/>
				{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
