<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkForksView from '$/views/NetworkForksView.svelte'
</script>


<Page>
		<NetworkForksView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$networkForks',
		}}
		href={resolve('/forks')}
		id="forks"
	/>
</Page>

