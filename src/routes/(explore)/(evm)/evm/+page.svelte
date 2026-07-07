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
	import EvmProtocolView from '$/views/EvmProtocolView.svelte'
</script>


<Page>
	<EvmProtocolView
		href={resolve('/(explore)/(evm)/evm')}
		selection={
			select(EntityType.EvmProtocol, {
				scope: 'EvmProtocol',
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					protocolName: true,
					registryName: true,
					relationshipModel: true,
					homeUrl: true,
					docsUrl: true,
				},
			})
		}
	/>
</Page>
