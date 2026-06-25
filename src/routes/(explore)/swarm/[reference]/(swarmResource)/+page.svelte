<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()

	const selector = $derived(
		params.reference.replace(/^\/+|\/+$/g, '') === '' ?
			undefined
		:
			{
				reference: params.reference.toLowerCase().replace(/^0x/, '').replace(/^\/+|\/+$/g, ''),
				contentPath: '',
			},
	)


	// Components
	import Page from '$/components/Page.svelte'
	import SwarmResourceView from '$/views/SwarmResourceView.svelte'
</script>


{#if selector !== undefined}
	<Page>
		<SwarmResourceView
			selection={select(EntityType.SwarmResource, selector)}
			open
		/>
	</Page>
{:else}
	<p role="alert">
		Invalid Swarm resource URL.
	</p>
{/if}
