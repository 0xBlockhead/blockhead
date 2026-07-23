<script lang="ts" generics="
	Value
">
	// Types/constants
	import type { Snippet } from 'svelte'

	import type {
		EntityFieldAddress,
		ProjectionValue,
	} from '$/schema/$schema.ts'
	import { ProjectionResolution } from '$/schema/$schema.ts'

	// State
	let {
		projection,
		Applicable,
		NotApplicable,
		Blocked,
		Unsupported,
	}: {
		projection: ProjectionValue<Value>
		Applicable: Snippet<[value: Value]>
		NotApplicable?: Snippet
		Blocked?: Snippet<[dependencies: readonly EntityFieldAddress[]]>
		Unsupported?: Snippet
	} = $props()
</script>


{#if projection.resolution === ProjectionResolution.Applicable}
	{@render Applicable(projection.value)}
{:else if projection.resolution === ProjectionResolution.NotApplicable}
	{#if NotApplicable}
		{@render NotApplicable()}
	{/if}
{:else if projection.resolution === ProjectionResolution.Blocked}
	{#if Blocked}
		{@render Blocked(projection.dependencies)}
	{/if}
{:else if Unsupported}
	{@render Unsupported()}
{/if}
