<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
	} = $props()


	// Components
	import SocialClientArchetype from '$/components/social/SocialClientArchetype.svelte'
</script>


<SocialClientArchetype
	label="Reddit"
	data-social-client-archetype="reddit"
>
	{#snippet Identity()}
		<a href={resolve('/reddit')}>
			<h1>Reddit</h1>
		</a>
	{/snippet}

	{#snippet Navigation()}
		<div data-row="wrap">
			<a href={resolve('/reddit/subreddits')}>Communities</a>
			<a href={resolve('/reddit/links')}>Popular submissions</a>
		</div>
	{/snippet}

	{@render children()}
</SocialClientArchetype>
