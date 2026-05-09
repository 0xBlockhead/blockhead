<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkForksView from '$/views/NetworkForksView.svelte'
</script>


<Page>
		<NetworkForksView
		entityFieldReference={{
			entityType: EntityType.Network,
			entityId: { chainId: Number(params.networkId) },
			fieldName: '$$forks',
		}}
		href={resolve('/(explore)/(networks)/network/[networkId]/(network)/forks', params)}
		id="forks"
	/>
</Page>

