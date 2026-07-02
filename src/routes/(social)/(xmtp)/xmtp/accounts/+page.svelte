<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmAccountsView from '$/views/EvmAccountsView.svelte'
</script>


<svelte:head>
	<title>XMTP accounts • Blockhead</title>
</svelte:head>


<Page>
	<EvmAccountsView
		href={resolve('/(social)/(xmtp)/xmtp/accounts')}
		title='XMTP accounts'
		selection={
			select(EntityType._Global, {
				scope: '$$actors',
			})[EntityProxyField]<EntityType.EvmAccount>('$$actors')
		}
		id='EvmAccountsView-page'
	/>
</Page>
