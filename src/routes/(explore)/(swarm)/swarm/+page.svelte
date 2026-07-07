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
	import SwarmProtocolView from '$/views/SwarmProtocolView.svelte'
</script>


<Page>
	<SwarmProtocolView
		href={resolve('/(explore)/(swarm)/swarm')}
		selection={
			select(EntityType.SwarmProtocol, {
				scope: 'SwarmProtocol',
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					protocolName: true,
					relationshipModel: true,
					registryName: true,
					homeUrl: true,
					docsUrl: true,
				},
			})
		}
	/>
</Page>
