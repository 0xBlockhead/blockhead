<script lang="ts">
	// Types/constants
	import type { EntityType } from '$/schema/EntityType.ts'

	import type { Snippet } from 'svelte'

	// State
	let {
		entityType: _entityType,
		entitySelector,
		children,
	}: {
		entityType: EntityType
		entitySelector: object
		children?: Snippet
	} = $props()


	// Functions
	import { stringify } from 'devalue'
</script>


<div
	class="entity-details"
	style:view-transition-name={`EntityDetails-${stringify(entitySelector)}`}
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
