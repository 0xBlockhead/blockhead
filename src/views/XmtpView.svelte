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
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/xmtp'),
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
				$$xmtpConversations: {
					$: [Source.Local_Internal],
				},
			},
		)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmAccountsView from '$/views/EvmAccountsView.svelte'
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
		XMTP
	{/snippet}

	{#snippet Title()}
		XMTP
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			XMTP transports encrypted payloads between inbox identities; conversation xmtpNetworks here are local catalog stubs until a live XMTP client is wired.
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
			{#if contentOpen}
				<ResourceBoundary
					resource={network}
					placeholderText="Loading XMTP network…"
				>
					{#snippet children(network)}
							<div>
								<dt>Conversations</dt>
								<dd>{String(network.$$xmtpConversations?.length ?? 0)}</dd>
							</div>

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
			{#snippet Summary()}
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
				<EvmAccountsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/~/accounts')}
					entityFieldReference={{
						entityType: EntityType._Global,
						entityId: { scope: '$$actors' },
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
