<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const entityViewByType = {
		[EntityType.HederaToken]: HederaTokenView,
		[EntityType.TronToken]: TronTokenView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import HederaTokenView from '$/views/HederaTokenView.svelte'
	import TronTokenView from '$/views/TronTokenView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.HederaToken ?
				(data.selector.tokenId || 'hedera token') + ' • hedera token • Blockhead'
			:
				('tron token') + ' • tron token • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.HederaToken ?
				select(EntityType.HederaToken, data.selector)
			:
				select(EntityType.TronToken, data.selector)
		}
	/>
</Page>
