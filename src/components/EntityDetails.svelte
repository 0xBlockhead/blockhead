<script
	lang="ts"
	generics="_EntityType extends EntityType"
>
	// Types/constants
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { EntityType } from '$/schema/$EntityType.ts'


	// State
	import type { Snippet } from 'svelte'

	let {
		entityType,
		entityId,
		children,
	}: {
		entityType: _EntityType
		entityId: EntityId<typeof schema, _EntityType>
		children?: Snippet
	} = $props()


	// Functions
	import { stringify } from 'devalue'
</script>


<div
	class="entity-details"
	style:view-transition-name={`EntityDetails-${stringify(entityId)}`}
>
	{#if children}
		{@render children()}
	{/if}
</div>


<style>
	.entity-details {
		display: contents;
	}
</style>
