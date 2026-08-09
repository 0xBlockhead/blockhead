<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const entityViewByType = {
		[EntityType.SuiAccount]: SuiAccountView,
		[EntityType.TezosAccount]: TezosAccountView,
		[EntityType.KaspaAddress]: KaspaAddressView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import SuiAccountView from '$/views/SuiAccountView.svelte'
	import TezosAccountView from '$/views/TezosAccountView.svelte'
	import KaspaAddressView from '$/views/KaspaAddressView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.SuiAccount ?
				('Sui account') + ' • Sui account • Blockhead'
			:
			data.entityType === EntityType.TezosAccount ?
				('tezos account') + ' • tezos account • Blockhead'
			:
				('kaspa address') + ' • kaspa address • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.SuiAccount ?
				select(EntityType.SuiAccount, data.selector)
			:
			data.entityType === EntityType.TezosAccount ?
				select(EntityType.TezosAccount, data.selector)
			:
				select(EntityType.KaspaAddress, data.selector, {
					sources: [
						Source.KaspaExplorer,
						Source.KaspaNode_Grpc,
						Source.KaspaNode_Rest,
						Source.KaspaNode_Wrpc,
					],
				})
		}
	/>
</Page>
