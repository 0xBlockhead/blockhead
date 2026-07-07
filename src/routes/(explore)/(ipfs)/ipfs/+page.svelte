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
	import IpfsProtocolView from '$/views/IpfsProtocolView.svelte'
</script>


<Page>
	<IpfsProtocolView
		href={resolve('/(explore)/(ipfs)/ipfs')}
		selection={
			select(EntityType.IpfsProtocol, {
				scope: 'IpfsProtocol',
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
