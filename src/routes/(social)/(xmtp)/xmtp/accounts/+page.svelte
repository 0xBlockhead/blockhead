<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import ActorsView from '$/views/ActorsView.svelte'
</script>


<Page>
	<ActorsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$actors',
		}}
		href={resolve('/xmtp/accounts')}
		id="accounts"
	/>
</Page>
