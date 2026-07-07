<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterNetworkView from '$/views/FarcasterNetworkView.svelte'
</script>


<Page>
	<FarcasterNetworkView
		href={resolve('/(social)/(farcaster)/farcaster')}
		selection={
			select(EntityType.FarcasterNetwork, {
				scope: 'FarcasterNetwork',
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					protocolName: true,
					homeUrl: true,
					docsUrl: true,
					registryName: true,
					relationshipModel: true,
				},
			})
		}
	/>
</Page>
