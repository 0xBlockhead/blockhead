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
	import GlobalNostrNetworkView from '$/views/_GlobalNostrNetworkView.svelte'
</script>


<Page>
	<GlobalNostrNetworkView
		href={resolve('/(social)/(nostr)/nostr')}
		selection={
			select(EntityType._GlobalNostrNetwork, {
				scope: '_GlobalNostrNetwork',
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					registryName: true,
					protocolName: true,
					homeUrl: true,
					docsUrl: true,
					relationshipModel: true,
				},
			})
		}
	/>
</Page>
