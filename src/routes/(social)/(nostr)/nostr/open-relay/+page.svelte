<script lang="ts">
	// Components
	import Heading from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<svelte:head>
	<title>Open Nostr relay • Blockhead</title>
</svelte:head>


<Page>
	<ParentPageCollapsible open={true}>
		{#snippet Summary()}
			<header
				class="entity-view-summary"
				data-row-item="flexible"
				data-row="wrap gap-2"
			>
				<Heading>Open Nostr relay</Heading>
			</header>
		{/snippet}

		<form method="GET" data-column="gap-3">
			<label for="nostr-relay-url">Relay URL</label>
			<input
				id="nostr-relay-url"
				name="url"
				type="url"
				inputmode="url"
				autocomplete="url"
				placeholder="wss://relay.damus.io"
				maxlength="2048"
				required
			/>
			<button type="submit">Open relay</button>
		</form>
	</ParentPageCollapsible>
</Page>
