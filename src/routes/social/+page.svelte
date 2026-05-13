<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
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
		{#snippet children()}
			<section data-column>
				<h2>Protocols & networks</h2>
				<ul>
					{#each socialLinks as { label, route } (route)}
						<li>
							<a href={resolve(route)}>{label}</a>
						</li>
					{/each}
				</ul>
			</section>
			<section>
				<FarcasterView
					entityId={{
						scope: 'FarcasterNetwork',
					}}
					href={resolve('/farcaster')}
					open={false}
				/>
			</section>
		{/snippet}
	</GlobalView>
</Page>
