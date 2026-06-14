<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	const hubKey = 'social'

	const socialProtocolGroups = [
		{
			label: 'ActivityPub (Mastodon API v1)',
			hubRoute: '/(social)/activitypub',
			lists: [
				{ label: 'Actors', route: '/(social)/(activitypub)/activitypub/actors' },
				{ label: 'Notes', route: '/(social)/(activitypub)/activitypub/notes' },
			],
		},
		{
			label: 'AT Protocol (Bluesky appview / XRPC)',
			hubRoute: '/(social)/atproto',
			lists: [
				{ label: 'Actors', route: '/(social)/(atproto)/atproto/actors' },
				{ label: 'Posts', route: '/(social)/(atproto)/atproto/posts' },
			],
		},
		{
			label: 'Lens',
			hubRoute: '/(social)/lens',
			lists: [
				{ label: 'Accounts', route: '/(social)/(lens)/lens/accounts' },
				{ label: 'Posts', route: '/(social)/(lens)/lens/posts' },
			],
		},
		{
			label: 'Nostr (NostrBand / Primal indexers)',
			hubRoute: '/(social)/nostr',
			lists: [
				{ label: 'Relays', route: '/(social)/(nostr)/nostr/relays' },
				{ label: 'Profiles', route: '/(social)/(nostr)/nostr/profiles' },
				{ label: 'Notes', route: '/(social)/(nostr)/nostr/notes' },
				{ label: 'Reposts', route: '/(social)/(nostr)/nostr/reposts' },
				{ label: 'Articles', route: '/(social)/(nostr)/nostr/articles' },
			],
		},
		{
			label: 'Reddit',
			hubRoute: '/(social)/reddit',
			lists: [
				{ label: 'Subreddits', route: '/(social)/(reddit)/reddit/subreddits' },
				{ label: 'Submissions', route: '/(social)/(reddit)/reddit/links' },
			],
		},
		{
			label: 'RSS / Atom syndication',
			hubRoute: '/(social)/rss',
			lists: [
				{ label: 'Feeds', route: '/(social)/(rss)/rss/feeds' },
				{ label: 'Items', route: '/(social)/(rss)/rss/items' },
			],
		},
		{
			label: 'X (API v2)',
			hubRoute: '/(social)/x',
			lists: [
				{ label: 'Users', route: '/(social)/(x)/x/users' },
				{ label: 'Posts', route: '/(social)/(x)/x/posts' },
			],
		},
		{
			label: 'YouTube (Data API v3 / Piped)',
			hubRoute: '/(social)/youtube',
			lists: [
				{ label: 'Channels', route: '/(social)/(youtube)/youtube/channels' },
				{ label: 'Videos', route: '/(social)/(youtube)/youtube/videos' },
				{ label: 'Playlists', route: '/(social)/(youtube)/youtube/playlists' },
			],
		},
		{
			label: 'XMTP',
			hubRoute: '/(social)/xmtp',
			lists: [
				{ label: 'Accounts', route: '/(social)/(xmtp)/xmtp/accounts' },
				{ label: 'Conversations', route: '/(social)/(xmtp)/xmtp/conversations' },
			],
		},
	] as const satisfies readonly {
		label: string
		hubRoute: string
		lists: readonly {
			label: string
			route: string
		}[]
	}[]


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import FarcasterView from '$/views/FarcasterView.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		selector={{ scope: 'Social' }}
		title="Social"
		href={resolve('/social')}
	>
		{#snippet children({ open: hubOpen,
		})}
			<CollapsibleTabs
				id={`${hubKey}:hub`}
				sectionIdPrefix={hubKey}
				sections={[
					{ id: 'protocols', label: 'Protocols' },
					{ id: 'farcaster', label: 'Farcaster' },
				]}
				data-card
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 40ch',
				}}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Social
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionProtocols({ id, label })}
					<h2>Protocols & networks</h2>
					<ul class="social-protocol-groups">
						{#each socialProtocolGroups as { label, hubRoute, lists } (hubRoute)}
							<li>
								<a href={resolve(hubRoute)}>{label}</a>
								<ul>
									{#each lists as { label: listLabel, route } (route)}
										<li>
											<a href={resolve(route)}>{listLabel}</a>
										</li>
									{/each}
								</ul>
							</li>
						{/each}
						<li>
							<a href={resolve('/(social)/(farcaster)/farcaster')}>Farcaster (feed / hub)</a>
							<ul>
								<li>
									<a href={resolve('/farcaster/accounts')}>Accounts</a>
								</li>
								<li>
									<a href={resolve('/farcaster/feed')}>Feed</a>
								</li>
								<li>
									<a href={resolve('/farcaster/channels')}>Channels</a>
								</li>
								<li>
									<a href={resolve('/farcaster/users')}>Users</a>
								</li>
							</ul>
						</li>
					</ul>
				{/snippet}

				{#snippet SectionFarcaster({ id, label })}
					<FarcasterView
						selector={{
							scope: 'FarcasterNetwork',
						}}
						open={hubOpen}
					/>
				{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>


<style>
	.social-protocol-groups {
		> li {
			> ul {
				margin-block: 0.25em 0.75em;
				padding-inline-start: 1.25em;
			}
		}
	}
</style>
