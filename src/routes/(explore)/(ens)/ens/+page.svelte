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
	import GlobalEnsNetworkView from '$/views/_GlobalEnsNetworkView.svelte'
</script>


<Page>
	<GlobalEnsNetworkView
		href={resolve('/(explore)/(ens)/ens')}
		selection={
			select(EntityType._GlobalEnsNetwork, {
				scope: '_GlobalEnsNetwork',
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					$registryContract: true,
					$ethRegistrarController: true,
					$reverseRegistrar: true,
					$nameWrapper: true,
				},
			})
		}
	/>
</Page>
