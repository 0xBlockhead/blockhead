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
	import GlobalAtprotoNetworkView from '$/views/_GlobalAtprotoNetworkView.svelte'
</script>


<Page>
	<GlobalAtprotoNetworkView
		href={resolve('/(social)/(atproto)/atproto')}
		selection={
			select(EntityType._GlobalAtprotoNetwork, {
				scope: '_GlobalAtprotoNetwork',
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					protocolName: true,
					relationshipModel: true,
					homeUrl: true,
					docsUrl: true,
				},
			})
		}
	/>
</Page>
