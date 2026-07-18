<script lang="ts">
	// Components
	import Heading from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<svelte:head>
	<title>Open Farcaster URL • Blockhead</title>
</svelte:head>


<Page>
	<ParentPageCollapsible open={true}>
		{#snippet Summary()}
			<header
				class="entity-view-summary"
				data-row-item="flexible"
				data-row="wrap gap-2"
			>
				<Heading>Open Farcaster URL</Heading>
			</header>
		{/snippet}

		<form method="GET" data-column="gap-3">
			<label for="farcaster-url">Farcaster URL</label>
			<input
				id="farcaster-url"
				name="url"
				type="url"
				inputmode="url"
				autocomplete="url"
				placeholder="https://farcaster.xyz/~/profiles/3"
				required
			/>
			<button type="submit">Open</button>
		</form>
	</ParentPageCollapsible>
</Page>
