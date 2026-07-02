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
	import LiquidityPositionsView from '$/views/LiquidityPositionsView.svelte'
</script>


<svelte:head>
	<title>LP positions • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPositionsView
		href={resolve('/(assets)/leverage')}
		title='LP positions'
		selection={
			select(EntityType._Global, {
				scope: '$$liquidityPositions',
			})[EntityProxyField]<EntityType.LiquidityPosition>('$$liquidityPositions')
		}
		id='LiquidityPositionsView-page'
	/>
</Page>
