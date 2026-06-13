<script lang="ts">
	// State
	let {
		params,
	} = $props()

	const entityId = $derived(
		params.reference.trim() === '' ?
			undefined
		:
			{
				reference: params.reference.trim().toLowerCase().replace(/^0x/, '').replace(/^\/+|\/+$/g, ''),
				contentPath: params.contentPath.replace(/^\/+|\/+$/g, ''),
			},
	)


	// Components
	import Page from '$/components/Page.svelte'
	import SwarmResourceView from '$/views/SwarmResourceView.svelte'
</script>


{#if entityId !== undefined}
	<Page>
		<SwarmResourceView
			{entityId}
			open
		/>
	</Page>
{:else}
	<p role="alert">
		Invalid Swarm resource URL.
	</p>
{/if}
