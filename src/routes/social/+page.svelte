<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import FarcasterNetworkView from '$/views/FarcasterNetworkView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Social • Blockhead</title>
</svelte:head>


<Page>
	<CollapsibleTabs
		id='social:hub'
		sectionIdPrefix='social'
		sections={[
			{ id: 'protocols', label: 'Protocols' },
			{ id: 'farcaster', label: 'Farcaster' },
		]}
		data-card
	>
		{#snippet Summary({ open: _open })}
			<header
				data-row-item='flexible'
				data-row='wrap gap-4'
			>
				<HeadingComponent>Social</HeadingComponent>
			</header>
		{/snippet}

		{#snippet SectionProtocols()}
			<ul class='social-protocol-groups'>
				<li><a href={resolve('/activitypub')}>ActivityPub</a></li>
				<li><a href={resolve('/atproto')}>AT Protocol</a></li>
				<li><a href={resolve('/farcaster')}>Farcaster</a></li>
				<li><a href={resolve('/lens')}>Lens</a></li>
				<li><a href={resolve('/nostr')}>Nostr</a></li>
				<li><a href={resolve('/reddit')}>Reddit</a></li>
				<li><a href={resolve('/rss')}>RSS / Atom</a></li>
				<li><a href={resolve('/x')}>X</a></li>
				<li><a href={resolve('/youtube')}>YouTube</a></li>
				<li><a href={resolve('/xmtp')}>XMTP</a></li>
			</ul>
		{/snippet}

		{#snippet SectionFarcaster()}
			<FarcasterNetworkView
				selection={select(EntityType.FarcasterNetwork, { scope: 'FarcasterNetwork' })}
				open={true}
			/>
		{/snippet}
	</CollapsibleTabs>
</Page>


<style>
	.social-protocol-groups {
		margin-block: 0;
		padding-inline-start: 1.25em;
	}
</style>
