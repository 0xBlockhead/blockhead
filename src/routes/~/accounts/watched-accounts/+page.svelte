<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmAccountsView from '$/views/EvmAccountsView.svelte'
</script>


<svelte:head>
	<title>Watched accounts • Blockhead</title>
</svelte:head>


<Page>
	<EvmAccountsView
		href={resolve('/~/accounts/watched-accounts')}
		title='Watched accounts'
		selection={
			select(EntityType._Global, {
				scope: '$$actors',
			})[EntityProxyField]<EntityType.EvmAccount>('$$actors', {
				sources: [
					Source.Local_Internal,
				],
			})
		}
		id='actors'
	/>
</Page>
