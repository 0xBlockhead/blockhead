<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
</script>


<Page>
	<NetworksView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$networks',
		}}
		href={resolve('/networks')}
		id="networks"
	/>
</Page>
