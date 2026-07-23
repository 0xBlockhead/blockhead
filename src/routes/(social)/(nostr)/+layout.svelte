<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
	} = $props()


	// Components
	import SocialClientArchetype from '../SocialClientArchetype.svelte'
</script>


<SocialClientArchetype
	label="Nostr"
	data-social-client-archetype="nostr"
>
	{#snippet Identity()}
		<a href={resolve('/nostr')}>
			<h1>Nostr</h1>
		</a>
	{/snippet}

	{#snippet Navigation()}
		<div data-row="wrap">
			<a href={resolve('/nostr/notes')}>Notes</a>
			<a href={resolve('/nostr/profiles')}>Profiles</a>
			<a href={resolve('/nostr/relays')}>Relays</a>
		</div>
	{/snippet}

	{@render children()}
</SocialClientArchetype>
