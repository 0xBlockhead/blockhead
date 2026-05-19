<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	const hubKey = 'social'

	const socialLinks = [
		{
			label: 'AT Protocol (Bluesky appview / XRPC)',
			route: '/(social)/atproto',
		},
		{
			label: 'ActivityPub (Mastodon API v1)',
			route: '/(social)/activitypub',
		},
		{
			label: 'Lens',
			route: '/(social)/lens',
		},
		{
			label: 'X (API v2)',
			route: '/(social)/x',
		},
		{
			label: 'Reddit',
			route: '/(social)/reddit',
		},
		{
			label: 'XMTP',
			route: '/(social)/xmtp',
		},
		{
			label: 'Farcaster (feed / hub)',
			route: '/(social)/(farcaster)/farcaster',
		},
	] as const satisfies ReadonlyArray<{
		label: string,
		route: string,
	}>


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import FarcasterView from '$/views/FarcasterView.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title={'Social'}
		href={resolve('/social')}
		open={false}
	>
		{#snippet children({
			open: hubOpen,
		})}
			<CollapsibleTabs
				id={`${hubKey}:hub`}
				{...{ 'data-card': '' }}
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

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Protocols"
						href={`#${hubKey}:protocols`}
					>Protocols</a>
					<a
						data-scroll-marker-label="Farcaster"
						href={`#${hubKey}:farcaster`}
					>Farcaster</a>
				{/snippet}

				{#snippet children({ open: _paneOpen })}
					<section
						id={`${hubKey}:protocols`}
						data-scroll-marker-label="Protocols"
						data-column
					>
						<h2>Protocols & networks</h2>
						<ul>
							{#each socialLinks as { label, route } (route)}
								<li>
									<a href={resolve(route)}>{label}</a>
								</li>
							{/each}
						</ul>
					</section>

					<section
						id={`${hubKey}:farcaster`}
						data-scroll-marker-label="Farcaster"
					>
						<FarcasterView
							entityId={{
								scope: 'FarcasterNetwork',
							}}
							href={resolve('/farcaster')}
							open={hubOpen}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>
