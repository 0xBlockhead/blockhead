<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	let {
		open = $bindable(true),
	} = $props()

	const entityId = {
		scope: 'XmtpNetwork' as const,
	}

	const networkIdKey = stringify(entityId)

	const network = useEntity(
		EntityType.XmtpNetwork,
		entityId,
		{
			$: [Source.Constants_Internal],
			protocolName: {},
			homeUrl: {},
			docsUrl: {},
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
	href={resolve('/(social)/xmtp')}
	bind:open
	title="XMTP"
>
	{#snippet Heading()}
		<span data-text="font-monospace">
			{entityId.scope}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			XMTP transports double‑ratcheted payloads between wallet-controlled identities; only holders of the session material can read ciphertext.
		</p>
		<p>
			Message bodies therefore stay off calldata and most explorers—unlike public Farcaster casts or federated ActivityPub notes on HTTPS.
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
						<dt>Accounts</dt>
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
							<dt>Protocol name</dt>
							<dd>{network.protocolName}</dd>
						</div>
						<div>
							<dt>Home</dt>
							<dd>
								<a href={network.homeUrl}>
									{network.homeUrl}
								</a>
							</dd>
						</div>
						{#if network.docsUrl != null}
							{#if network.docsUrl !== ''}
								<div>
									<dt>Docs</dt>
									<dd>
										<a href={network.docsUrl}>
											{network.docsUrl}
										</a>
									</dd>
								</div>
							{/if}
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.XmtpNetwork}
			{entityId}
		/>

		<div class="entity-view-detail-carousels" data-column="gap-3">
			<CollapsibleTabs
				id={`${networkIdKey}:registry`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 36ch',
				}}
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

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Accounts"
						href={`#${networkIdKey}:accounts`}
					>Accounts</a>
					<a
						data-scroll-marker-label="Conversations"
						href={`#${networkIdKey}:conversations`}
					>Inbox</a>
				{/snippet}

				{#snippet body({ open: _o })}
					<section
						id={`${networkIdKey}:accounts`}
						data-scroll-marker-label="Accounts"
					>
						<ActorsView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$actors',
							}}
							href={resolve('/xmtp/accounts')}
							id="accounts"
							open={_open}
							title="Accounts"
						/>
					</section>

					<section
						id={`${networkIdKey}:conversations`}
						data-scroll-marker-label="Conversations"
					>
						<XmtpConversationsView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$xmtpConversations',
							}}
							href={resolve('/xmtp/conversations')}
							id="conversations"
							open={_open}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
