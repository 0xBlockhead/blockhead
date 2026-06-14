<script lang="ts">
	// State
	let {
		params,
	} = $props()

	const entitySelector = $derived(
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


{#if entitySelector !== undefined}
	<Page>
		<SwarmResourceView
			selector={selector}
			open
		/>
	</Page>
{:else}
	<p role="alert">
		Invalid Swarm resource URL.
	</p>
{/if}
