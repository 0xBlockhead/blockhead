<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<Page>
	<NetworkView
		selection={select(
			EntityType.Network,
			{
				slug: params.networkSlug,
			},
			{
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					name: true,
					slug: true,
					caip2: true,
					namespace: true,
					environment: true,
				},
			}
		)}
	/>
</Page>
